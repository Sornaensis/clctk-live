(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.b8.aM === region.ck.aM)
	{
		return 'on line ' + region.b8.aM;
	}
	return 'on lines ' + region.b8.aM + ' through ' + region.ck.aM;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dm,
		impl.dP,
		impl.dN,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		g: func(record.g),
		i: record.i,
		h: record.h
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.g;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.i;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.h) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dm,
		impl.dP,
		impl.dN,
		function(sendToApp, initialModel) {
			var view = impl.dS;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dm,
		impl.dP,
		impl.dN,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.b3 && impl.b3(sendToApp)
			var view = impl.dS;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.c5);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bL) && (_VirtualDom_doc.title = title = doc.bL);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.dx;
	var onUrlRequest = impl.dy;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		b3: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.cK === next.cK
							&& curr.cr === next.cr
							&& curr.cF.a === next.cF.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		dm: function(flags)
		{
			return A3(impl.dm, flags, _Browser_getUrl(), key);
		},
		dS: impl.dS,
		dP: impl.dP,
		dN: impl.dN
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dk: 'hidden', c6: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dk: 'mozHidden', c6: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dk: 'msHidden', c6: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dk: 'webkitHidden', c6: 'webkitvisibilitychange' }
		: { dk: 'hidden', c6: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		cP: _Browser_getScene(),
		cW: {
			c_: _Browser_window.pageXOffset,
			c$: _Browser_window.pageYOffset,
			cY: _Browser_doc.documentElement.clientWidth,
			f: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		cY: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		f: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			cP: {
				cY: node.scrollWidth,
				f: node.scrollHeight
			},
			cW: {
				c_: node.scrollLeft,
				c$: node.scrollTop,
				cY: node.clientWidth,
				f: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			cP: _Browser_getScene(),
			cW: {
				c_: x,
				c$: y,
				cY: _Browser_doc.documentElement.clientWidth,
				f: _Browser_doc.documentElement.clientHeight
			},
			bh: {
				c_: x + rect.left,
				c$: y + rect.top,
				cY: rect.width,
				f: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.k) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.n),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.n);
		} else {
			var treeLen = builder.k * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.o) : builder.o;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.k);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.n) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.n);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{o: nodeList, k: (len / $elm$core$Array$branchFactor) | 0, n: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {co: fragment, cr: host, cD: path, cF: port_, cK: protocol, cL: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Types$Assimilation = 0;
var $author$project$Types$DisplayIPA = 0;
var $author$project$Types$IllegalCluster = 0;
var $author$project$Types$Suffix = 1;
var $author$project$Model$TemplateGeneration = 0;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$getCurrentTime = _Platform_outgoingPort(
	'getCurrentTime',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$loadAllLanguageFamilies = _Platform_outgoingPort(
	'loadAllLanguageFamilies',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$loadAllLanguageProjects = _Platform_outgoingPort(
	'loadAllLanguageProjects',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$loadAllTemplates = _Platform_outgoingPort(
	'loadAllTemplates',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$loadPreferences = _Platform_outgoingPort(
	'loadPreferences',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{
			aH: $elm$core$Maybe$Nothing,
			X: 'languages',
			ao: 'languages',
			ap: '',
			ba: '',
			bN: 'noun',
			bO: '',
			M: '',
			bb: $elm$core$Maybe$Nothing,
			bc: $elm$core$Maybe$Nothing,
			bd: $elm$core$Maybe$Nothing,
			be: '',
			c7: 0,
			N: $elm$core$Maybe$Nothing,
			O: 1,
			b: '',
			bP: $elm$core$Dict$empty,
			bf: '',
			ar: $elm$core$Maybe$Nothing,
			af: '',
			as: '',
			at: $elm$core$Maybe$Nothing,
			ag: $elm$core$Maybe$Nothing,
			Z: $elm$core$Maybe$Nothing,
			bg: false,
			ah: $elm$core$Maybe$Nothing,
			s: $elm$core$Maybe$Nothing,
			dd: $elm$core$Maybe$Nothing,
			x: '',
			y: '',
			z: $elm$core$Maybe$Nothing,
			bi: '',
			av: $elm$core$Dict$empty,
			cm: 'all',
			cn: 'all',
			dh: _List_Nil,
			cp: 0,
			bk: '',
			aK: '',
			bl: '',
			bm: '',
			bo: $elm$core$Maybe$Nothing,
			bp: '',
			aL: false,
			bS: $elm$core$Maybe$Nothing,
			bq: $elm$core$Maybe$Nothing,
			br: false,
			m: _List_Nil,
			P: _List_Nil,
			bs: '',
			aw: $elm$core$Maybe$Nothing,
			aj: '',
			cv: 4,
			bT: 2,
			cw: 2,
			aN: false,
			B: '',
			C: '',
			D: '',
			bt: $elm$core$Maybe$Nothing,
			H: 1,
			E: '',
			ak: '',
			cB: '',
			aP: '',
			aQ: '',
			aR: false,
			bu: '',
			u: $elm$core$Maybe$Nothing,
			bv: '',
			a: {
				ch: '',
				bn: 1,
				ct: {
					dh: _List_Nil,
					dq: $elm$core$Maybe$Nothing,
					dt: $elm$core$Dict$empty,
					dv: {bQ: _List_Nil, bV: _List_Nil, cy: _List_Nil, cC: _List_Nil},
					dE: {
						ce: _List_fromArray(
							[
								{
								dp: 'C',
								I: 'Consonants',
								dM: _List_fromArray(
									['p', 't', 'k', 'm', 'n', 's', 'l', 'r']),
								ae: ''
							},
								{
								dp: 'V',
								I: 'Vowels',
								dM: _List_fromArray(
									['a', 'e', 'i', 'o', 'u']),
								ae: ''
							}
							]),
						c8: _List_Nil,
						da: _List_Nil,
						cA: {cj: 0, cq: _List_Nil},
						dC: _List_fromArray(
							[
								{I: 'CV', dB: 'CV'},
								{I: 'CVC', dB: 'CVC'}
							])
					},
					ae: ''
				},
				cu: '',
				I: 'My Conlang Project'
			},
			F: '',
			G: '',
			ax: $elm$core$Maybe$Nothing,
			b$: _List_Nil,
			r: _List_Nil,
			b0: $elm$core$Maybe$Nothing,
			bx: $elm$core$Maybe$Nothing,
			ay: '',
			az: '',
			by: $elm$core$Maybe$Nothing,
			aS: '',
			aT: '',
			aU: '',
			aV: '',
			aW: '',
			bz: 0,
			aX: '',
			aA: '',
			cQ: '',
			aB: 'C',
			aa: _List_Nil,
			b1: $elm$core$Maybe$Nothing,
			b2: $elm$core$Maybe$Nothing,
			aY: _List_Nil,
			q: _List_Nil,
			bA: false,
			ab: false,
			bB: false,
			bC: false,
			bD: false,
			ac: false,
			bE: false,
			b4: true,
			b5: true,
			bF: false,
			aZ: true,
			a_: false,
			a$: false,
			a0: false,
			bG: false,
			b6: false,
			b7: false,
			aC: false,
			bH: false,
			bI: false,
			R: false,
			bJ: false,
			bK: false,
			a1: true,
			a2: '',
			a3: '',
			a4: '',
			b9: 'CV',
			aE: '',
			L: $elm$core$Dict$empty,
			cU: 3,
			ca: 1,
			aF: $elm$core$Maybe$Nothing,
			cV: _List_Nil,
			j: _List_Nil,
			a9: _List_Nil,
			cX: 768,
			S: '',
			T: '',
			U: '',
			cZ: 10,
			V: '',
			W: 'noun'
		},
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Main$getCurrentTime(0),
					$author$project$Main$loadAllTemplates(0),
					$author$project$Main$loadPreferences(0),
					$author$project$Main$loadAllLanguageFamilies(0),
					$author$project$Main$loadAllLanguageProjects(0)
				])));
};
var $author$project$Msg$ImportDataReceived = function (a) {
	return {$: 43, a: a};
};
var $author$project$Msg$LexiconCSVImported = function (a) {
	return {$: 160, a: a};
};
var $author$project$Msg$LoadedFromStorage = function (a) {
	return {$: 45, a: a};
};
var $author$project$Msg$ReceiveCursorPosition = function (a) {
	return {$: 205, a: a};
};
var $author$project$Msg$ReceivedAllLanguageFamilies = function (a) {
	return {$: 219, a: a};
};
var $author$project$Msg$ReceivedAllLanguageProjects = function (a) {
	return {$: 235, a: a};
};
var $author$project$Msg$ReceivedAllProjects = function (a) {
	return {$: 145, a: a};
};
var $author$project$Msg$ReceivedAllTemplates = function (a) {
	return {$: 130, a: a};
};
var $author$project$Msg$ReceivedCurrentTime = function (a) {
	return {$: 46, a: a};
};
var $author$project$Msg$ReceivedPreferences = function (a) {
	return {$: 131, a: a};
};
var $author$project$Msg$ReceivedProject = function (a) {
	return {$: 146, a: a};
};
var $author$project$Msg$ReceivedUUID = function (a) {
	return {$: 47, a: a};
};
var $author$project$Msg$WindowResized = F2(
	function (a, b) {
		return {$: 206, a: a, b: b};
	});
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Msg$Redo = {$: 168};
var $author$project$Msg$Undo = {$: 167};
var $author$project$Msg$UpdatePhonemeInput = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$keyDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (key, ctrl) {
			return (ctrl && (key === 'z')) ? $author$project$Msg$Undo : ((ctrl && (key === 'y')) ? $author$project$Msg$Redo : ((ctrl && (key === 'Z')) ? $author$project$Msg$Redo : $author$project$Msg$UpdatePhonemeInput('')));
		}),
	A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool));
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Main$loadFromStorage = _Platform_incomingPort('loadFromStorage', $elm$json$Json$Decode$value);
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {cE: pids, cR: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {cl: event, cs: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.cE,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.cs;
		var event = _v0.cl;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.cR);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onKeyDown = A2($elm$browser$Browser$Events$on, 0, 'keydown');
var $elm$browser$Browser$Events$Window = 1;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Main$receiveAllLanguageFamilies = _Platform_incomingPort('receiveAllLanguageFamilies', $elm$json$Json$Decode$value);
var $author$project$Main$receiveAllLanguageProjects = _Platform_incomingPort('receiveAllLanguageProjects', $elm$json$Json$Decode$value);
var $author$project$Main$receiveAllProjects = _Platform_incomingPort('receiveAllProjects', $elm$json$Json$Decode$value);
var $author$project$Main$receiveAllTemplates = _Platform_incomingPort('receiveAllTemplates', $elm$json$Json$Decode$value);
var $author$project$Main$receiveCSVData = _Platform_incomingPort('receiveCSVData', $elm$json$Json$Decode$string);
var $author$project$Main$receiveCurrentTime = _Platform_incomingPort('receiveCurrentTime', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Main$receiveCursorPosition = _Platform_incomingPort(
	'receiveCursorPosition',
	A2(
		$elm$json$Json$Decode$andThen,
		function (position) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (fieldId) {
					return $elm$json$Json$Decode$succeed(
						{bj: fieldId, cH: position});
				},
				A2($elm$json$Json$Decode$field, 'fieldId', $elm$json$Json$Decode$string));
		},
		A2($elm$json$Json$Decode$field, 'position', $elm$json$Json$Decode$int)));
var $author$project$Main$receiveImportData = _Platform_incomingPort('receiveImportData', $elm$json$Json$Decode$string);
var $author$project$Main$receivePreferences = _Platform_incomingPort('receivePreferences', $elm$json$Json$Decode$value);
var $author$project$Main$receiveProject = _Platform_incomingPort('receiveProject', $elm$json$Json$Decode$value);
var $author$project$Main$receiveUUID = _Platform_incomingPort('receiveUUID', $elm$json$Json$Decode$string);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$loadFromStorage($author$project$Msg$LoadedFromStorage),
				$author$project$Main$receiveCurrentTime($author$project$Msg$ReceivedCurrentTime),
				$author$project$Main$receiveImportData($author$project$Msg$ImportDataReceived),
				$author$project$Main$receiveAllProjects($author$project$Msg$ReceivedAllProjects),
				$author$project$Main$receiveProject($author$project$Msg$ReceivedProject),
				$author$project$Main$receiveCSVData($author$project$Msg$LexiconCSVImported),
				$author$project$Main$receiveAllTemplates($author$project$Msg$ReceivedAllTemplates),
				$author$project$Main$receivePreferences($author$project$Msg$ReceivedPreferences),
				$author$project$Main$receiveAllLanguageFamilies($author$project$Msg$ReceivedAllLanguageFamilies),
				$author$project$Main$receiveAllLanguageProjects($author$project$Msg$ReceivedAllLanguageProjects),
				$author$project$Main$receiveCursorPosition($author$project$Msg$ReceiveCursorPosition),
				$author$project$Main$receiveUUID($author$project$Msg$ReceivedUUID),
				$elm$browser$Browser$Events$onKeyDown($author$project$Main$keyDecoder),
				$elm$browser$Browser$Events$onResize($author$project$Msg$WindowResized)
			]));
};
var $author$project$Types$DisplayOrthography = 1;
var $author$project$Model$ForGrammaticalFeature = function (a) {
	return {$: 2, a: a};
};
var $author$project$Model$ForLexeme = function (a) {
	return {$: 0, a: a};
};
var $author$project$Model$ForMorpheme = function (a) {
	return {$: 3, a: a};
};
var $author$project$Model$ForSoundCategory = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Msg$GotIPAFieldElement = F2(
	function (a, b) {
		return {$: 200, a: a, b: b};
	});
var $author$project$Msg$WordsGenerated = function (a) {
	return {$: 39, a: a};
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$MorphologyHelpers$applyMorpheme = F2(
	function (morpheme, base) {
		if ($elm$core$String$isEmpty(base)) {
			return base;
		} else {
			var morphForm = A3(
				$elm$core$String$replace,
				'Ø',
				'',
				A3(
					$elm$core$String$replace,
					'...',
					'',
					A3($elm$core$String$replace, '-', '', morpheme.bR)));
			var _v0 = morpheme.du;
			switch (_v0) {
				case 0:
					return _Utils_ap(morphForm, base);
				case 1:
					return _Utils_ap(base, morphForm);
				case 2:
					var vowels = _List_fromArray(
						['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']);
					var insertAt = F3(
						function (position, infix, string) {
							var before = A2($elm$core$String$left, position, string);
							var after = A2($elm$core$String$dropLeft, position, string);
							return _Utils_ap(
								before,
								_Utils_ap(infix, after));
						});
					var findFirstVowelPosition = F2(
						function (idx, str) {
							findFirstVowelPosition:
							while (true) {
								var _v1 = $elm$core$String$uncons(str);
								if (_v1.$ === 1) {
									return $elm$core$Maybe$Nothing;
								} else {
									var _v2 = _v1.a;
									var _char = _v2.a;
									var rest = _v2.b;
									if (A2(
										$elm$core$List$member,
										$elm$core$String$fromChar(_char),
										vowels)) {
										return $elm$core$Maybe$Just(idx);
									} else {
										var $temp$idx = idx + 1,
											$temp$str = rest;
										idx = $temp$idx;
										str = $temp$str;
										continue findFirstVowelPosition;
									}
								}
							}
						});
					var _v3 = A2(findFirstVowelPosition, 0, base);
					if (!_v3.$) {
						var pos = _v3.a;
						return A3(insertAt, pos + 1, morphForm, base);
					} else {
						var _v4 = $elm$core$String$uncons(base);
						if (!_v4.$) {
							var _v5 = _v4.a;
							var firstChar = _v5.a;
							var rest = _v5.b;
							return _Utils_ap(
								$elm$core$String$fromChar(firstChar),
								_Utils_ap(morphForm, rest));
						} else {
							return base;
						}
					}
				default:
					var parts = A2($elm$core$String$contains, '-', morpheme.bR) ? A2(
						$elm$core$List$filter,
						function (s) {
							return (s !== '...') && (s !== '');
						},
						A2($elm$core$String$split, '-', morpheme.bR)) : (A2($elm$core$String$contains, '...', morpheme.bR) ? A2($elm$core$String$split, '...', morpheme.bR) : _List_Nil);
					_v6$2:
					while (true) {
						if (parts.b) {
							if (parts.b.b) {
								if (!parts.b.b.b) {
									var prefix = parts.a;
									var _v7 = parts.b;
									var suffix = _v7.a;
									return _Utils_ap(
										prefix,
										_Utils_ap(base, suffix));
								} else {
									break _v6$2;
								}
							} else {
								var prefix = parts.a;
								return _Utils_ap(prefix, base);
							}
						} else {
							break _v6$2;
						}
					}
					return _Utils_ap(base, morphForm);
			}
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $author$project$MorphologyHelpers$replaceAfterPattern = F4(
	function (target, replacement, before, word) {
		var pattern = _Utils_ap(before, target);
		var newPattern = _Utils_ap(before, replacement);
		return A3($elm$core$String$replace, pattern, newPattern, word);
	});
var $author$project$MorphologyHelpers$replaceBeforePattern = F4(
	function (target, replacement, after, word) {
		var pattern = _Utils_ap(target, after);
		var newPattern = _Utils_ap(replacement, after);
		return A3($elm$core$String$replace, pattern, newPattern, word);
	});
var $author$project$MorphologyHelpers$replaceBetweenPattern = F5(
	function (target, replacement, before, after, word) {
		var pattern = _Utils_ap(
			before,
			_Utils_ap(target, after));
		var newPattern = _Utils_ap(
			before,
			_Utils_ap(replacement, after));
		return A3($elm$core$String$replace, pattern, newPattern, word);
	});
var $author$project$MorphologyHelpers$applyContextualRule = F2(
	function (rule, word) {
		var parts = A2($elm$core$String$split, '_', rule.cg);
		var result = function () {
			if ((parts.b && parts.b.b) && (!parts.b.b.b)) {
				var before = parts.a;
				var _v1 = parts.b;
				var after = _v1.a;
				return ($elm$core$String$isEmpty(before) && (!$elm$core$String$isEmpty(after))) ? A4($author$project$MorphologyHelpers$replaceBeforePattern, rule.dO, rule.dH, after, word) : (((!$elm$core$String$isEmpty(before)) && $elm$core$String$isEmpty(after)) ? A4($author$project$MorphologyHelpers$replaceAfterPattern, rule.dO, rule.dH, before, word) : (((!$elm$core$String$isEmpty(before)) && (!$elm$core$String$isEmpty(after))) ? A5($author$project$MorphologyHelpers$replaceBetweenPattern, rule.dO, rule.dH, before, after, word) : word));
			} else {
				return word;
			}
		}();
		return result;
	});
var $author$project$MorphologyHelpers$applyRule = F2(
	function (rule, word) {
		return $elm$core$String$isEmpty(rule.cg) ? A3($elm$core$String$replace, rule.dO, rule.dH, word) : A2($author$project$MorphologyHelpers$applyContextualRule, rule, word);
	});
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$MorphologyHelpers$applyMorphophonemicRules = F2(
	function (rules, word) {
		var compareRule = F2(
			function (r1, r2) {
				return ($elm$core$String$isEmpty(r1.cg) && (!$elm$core$String$isEmpty(r2.cg))) ? 2 : (((!$elm$core$String$isEmpty(r1.cg)) && $elm$core$String$isEmpty(r2.cg)) ? 0 : 1);
			});
		var sortedRules = A2($elm$core$List$sortWith, compareRule, rules);
		return A3($elm$core$List$foldl, $author$project$MorphologyHelpers$applyRule, word, sortedRules);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$trim = _String_trim;
var $author$project$MorphologyHelpers$applySyllableOrthography = F4(
	function (phonology, mappings, diphthongs, syllable) {
		var matchesCustomCategory = F3(
			function (categoryLabel, str, isEnd) {
				var maybeCategory = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (cat) {
							return _Utils_eq(cat.dp, categoryLabel);
						},
						phonology.ce));
				if (maybeCategory.$ === 1) {
					return false;
				} else {
					var category = maybeCategory.a;
					return A2(
						$elm$core$List$any,
						function (sound) {
							return isEnd ? A2($elm$core$String$endsWith, sound, str) : A2($elm$core$String$startsWith, sound, str);
						},
						category.dM);
				}
			});
		var isVowel = function (c) {
			return A2(
				$elm$core$List$member,
				c,
				_List_fromArray(
					['a', 'e', 'i', 'o', 'u', 'ɑ', 'ɛ', 'ɪ', 'ɔ', 'ʊ', 'ə', 'ʌ', 'æ', 'aː', 'eː', 'iː', 'oː', 'uː']));
		};
		var isShortVowel = function (c) {
			return A2(
				$elm$core$List$member,
				c,
				_List_fromArray(
					['ɪ', 'ɛ', 'æ', 'ʌ', 'ʊ', 'ɒ', 'ə', 'ʏ', 'ɐ', 'ɞ']));
		};
		var isConsonant = function (c) {
			return !isVowel(c);
		};
		var getLastChar = function (str) {
			return $elm$core$String$isEmpty(str) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2($elm$core$String$right, 1, str));
		};
		var getFirstChar = function (str) {
			return $elm$core$String$isEmpty(str) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2($elm$core$String$left, 1, str));
		};
		var compareMapping = F2(
			function (m1, m2) {
				var contextSpecificity = function (ctx) {
					return $elm$core$String$isEmpty(ctx) ? 0 : (A2($elm$core$String$contains, '#', ctx) ? 3 : ((A2($elm$core$String$contains, 'V', ctx) || A2($elm$core$String$contains, 'C', ctx)) ? 2 : (A2($elm$core$String$contains, '{', ctx) ? 2 : 2)));
				};
				var spec1 = contextSpecificity(m1.cg);
				var spec2 = contextSpecificity(m2.cg);
				return (!_Utils_eq(spec1, spec2)) ? A2($elm$core$Basics$compare, spec2, spec1) : A2(
					$elm$core$Basics$compare,
					-$elm$core$String$length(m1.dD),
					-$elm$core$String$length(m2.dD));
			});
		var sortedMappings = A2($elm$core$List$sortWith, compareMapping, mappings);
		var checkBeforeContext = F2(
			function (pattern, before) {
				if ($elm$core$String$isEmpty(pattern)) {
					return true;
				} else {
					if (pattern === '#') {
						return $elm$core$String$isEmpty(before);
					} else {
						if (pattern === 'C') {
							var _v9 = getLastChar(before);
							if (!_v9.$) {
								var c = _v9.a;
								return isConsonant(c);
							} else {
								return false;
							}
						} else {
							if (pattern === 'V') {
								var _v10 = getLastChar(before);
								if (!_v10.$) {
									var c = _v10.a;
									return isVowel(c);
								} else {
									return false;
								}
							} else {
								if (pattern === 'V̆') {
									var _v11 = getLastChar(before);
									if (!_v11.$) {
										var c = _v11.a;
										return isShortVowel(c);
									} else {
										return false;
									}
								} else {
									if (A2($elm$core$String$startsWith, '{', pattern) && A2($elm$core$String$endsWith, '}', pattern)) {
										var phonemes = A2(
											$elm$core$List$map,
											$elm$core$String$trim,
											A2(
												$elm$core$String$split,
												',',
												A3($elm$core$String$slice, 1, -1, pattern)));
										return A2(
											$elm$core$List$any,
											function (p) {
												return A2($elm$core$String$endsWith, p, before);
											},
											phonemes);
									} else {
										if ($elm$core$String$length(pattern) === 1) {
											var _v12 = $elm$core$String$uncons(pattern);
											if (!_v12.$) {
												var _v13 = _v12.a;
												var _char = _v13.a;
												return ($elm$core$Char$isUpper(_char) && ((_char !== 'C') && (_char !== 'V'))) ? A3(matchesCustomCategory, _char, before, true) : A2($elm$core$String$endsWith, pattern, before);
											} else {
												return false;
											}
										} else {
											return A2($elm$core$String$endsWith, pattern, before);
										}
									}
								}
							}
						}
					}
				}
			});
		var checkAfterContext = F2(
			function (pattern, after) {
				if ($elm$core$String$isEmpty(pattern)) {
					return true;
				} else {
					if (pattern === '#') {
						return $elm$core$String$isEmpty(after);
					} else {
						if (pattern === 'C') {
							var _v4 = getFirstChar(after);
							if (!_v4.$) {
								var c = _v4.a;
								return isConsonant(c);
							} else {
								return false;
							}
						} else {
							if (pattern === 'V') {
								var _v5 = getFirstChar(after);
								if (!_v5.$) {
									var c = _v5.a;
									return isVowel(c);
								} else {
									return false;
								}
							} else {
								if (pattern === 'V̆') {
									var _v6 = getFirstChar(after);
									if (!_v6.$) {
										var c = _v6.a;
										return isShortVowel(c);
									} else {
										return false;
									}
								} else {
									if (A2($elm$core$String$startsWith, '{', pattern) && A2($elm$core$String$endsWith, '}', pattern)) {
										var phonemes = A2(
											$elm$core$List$map,
											$elm$core$String$trim,
											A2(
												$elm$core$String$split,
												',',
												A3($elm$core$String$slice, 1, -1, pattern)));
										return A2(
											$elm$core$List$any,
											function (p) {
												return A2($elm$core$String$startsWith, p, after);
											},
											phonemes);
									} else {
										if ($elm$core$String$length(pattern) === 1) {
											var _v7 = $elm$core$String$uncons(pattern);
											if (!_v7.$) {
												var _v8 = _v7.a;
												var _char = _v8.a;
												return ($elm$core$Char$isUpper(_char) && ((_char !== 'C') && (_char !== 'V'))) ? A3(matchesCustomCategory, _char, after, false) : A2($elm$core$String$startsWith, pattern, after);
											} else {
												return false;
											}
										} else {
											return A2($elm$core$String$startsWith, pattern, after);
										}
									}
								}
							}
						}
					}
				}
			});
		var checkContext = F3(
			function (context, before, after) {
				var parts = A2($elm$core$String$split, '_', context);
				_v2$2:
				while (true) {
					if (parts.b) {
						if (parts.b.b) {
							if (!parts.b.b.b) {
								var beforePart = parts.a;
								var _v3 = parts.b;
								var afterPart = _v3.a;
								return A2(checkBeforeContext, beforePart, before) && A2(checkAfterContext, afterPart, after);
							} else {
								break _v2$2;
							}
						} else {
							var beforePart = parts.a;
							return A2($elm$core$String$endsWith, '_', context) ? A2(checkBeforeContext, beforePart, before) : true;
						}
					} else {
						break _v2$2;
					}
				}
				return true;
			});
		var contextMatches = F4(
			function (context, before, remaining, phonemeLen) {
				return $elm$core$String$isEmpty(context) ? true : A3(
					checkContext,
					context,
					before,
					A2($elm$core$String$dropLeft, phonemeLen, remaining));
			});
		var findMatchingMapping = F3(
			function (before, remaining, mappingList) {
				findMatchingMapping:
				while (true) {
					if (!mappingList.b) {
						return $elm$core$Maybe$Nothing;
					} else {
						var mapping = mappingList.a;
						var rest = mappingList.b;
						if (A2($elm$core$String$startsWith, mapping.dD, remaining)) {
							if (A4(
								contextMatches,
								mapping.cg,
								before,
								remaining,
								$elm$core$String$length(mapping.dD))) {
								return $elm$core$Maybe$Just(mapping);
							} else {
								var $temp$before = before,
									$temp$remaining = remaining,
									$temp$mappingList = rest;
								before = $temp$before;
								remaining = $temp$remaining;
								mappingList = $temp$mappingList;
								continue findMatchingMapping;
							}
						} else {
							var $temp$before = before,
								$temp$remaining = remaining,
								$temp$mappingList = rest;
							before = $temp$before;
							remaining = $temp$remaining;
							mappingList = $temp$mappingList;
							continue findMatchingMapping;
						}
					}
				}
			});
		var applyMapping = F2(
			function (before, remaining) {
				if ($elm$core$String$isEmpty(remaining)) {
					return '';
				} else {
					var _v1 = A3(findMatchingMapping, before, remaining, sortedMappings);
					if (!_v1.$) {
						var match = _v1.a;
						return _Utils_ap(
							match.dj,
							A2(
								applyMapping,
								_Utils_ap(before, match.dD),
								A2(
									$elm$core$String$dropLeft,
									$elm$core$String$length(match.dD),
									remaining)));
					} else {
						var firstChar = A2($elm$core$String$left, 1, remaining);
						return _Utils_ap(
							firstChar,
							A2(
								applyMapping,
								_Utils_ap(before, firstChar),
								A2($elm$core$String$dropLeft, 1, remaining)));
					}
				}
			});
		return A2(applyMapping, '', syllable);
	});
var $author$project$MorphologyHelpers$applyOrthography = F4(
	function (phonology, mappings, diphthongs, word) {
		var syllables = A2($elm$core$String$split, '.', word);
		var mappedSyllables = A2(
			$elm$core$List$map,
			A3($author$project$MorphologyHelpers$applySyllableOrthography, phonology, mappings, diphthongs),
			syllables);
		return A2($elm$core$String$join, '', mappedSyllables);
	});
var $author$project$MorphologyHelpers$applySyllableOrthographyWithTracking = F4(
	function (phonology, mappings, diphthongs, syllable) {
		var matchesCustomCategory = F3(
			function (categoryLabel, str, isEnd) {
				var maybeCategory = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (cat) {
							return _Utils_eq(cat.dp, categoryLabel);
						},
						phonology.ce));
				if (maybeCategory.$ === 1) {
					return false;
				} else {
					var category = maybeCategory.a;
					return A2(
						$elm$core$List$any,
						function (sound) {
							return isEnd ? A2($elm$core$String$endsWith, sound, str) : A2($elm$core$String$startsWith, sound, str);
						},
						category.dM);
				}
			});
		var isVowel = function (c) {
			return A2(
				$elm$core$List$member,
				c,
				_List_fromArray(
					['a', 'e', 'i', 'o', 'u', 'ɑ', 'ɛ', 'ɪ', 'ɔ', 'ʊ', 'ə', 'ʌ', 'æ', 'aː', 'eː', 'iː', 'oː', 'uː']));
		};
		var isShortVowel = function (c) {
			return A2(
				$elm$core$List$member,
				c,
				_List_fromArray(
					['ɪ', 'ɛ', 'æ', 'ʌ', 'ʊ', 'ɒ', 'ə', 'ʏ', 'ɐ', 'ɞ']));
		};
		var isConsonant = function (c) {
			return !isVowel(c);
		};
		var getLastChar = function (str) {
			return $elm$core$String$isEmpty(str) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2($elm$core$String$right, 1, str));
		};
		var getFirstChar = function (str) {
			return $elm$core$String$isEmpty(str) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2($elm$core$String$left, 1, str));
		};
		var compareMapping = F2(
			function (m1, m2) {
				var contextSpecificity = function (ctx) {
					return $elm$core$String$isEmpty(ctx) ? 0 : (A2($elm$core$String$contains, '#', ctx) ? 3 : ((A2($elm$core$String$contains, 'V', ctx) || A2($elm$core$String$contains, 'C', ctx)) ? 2 : (A2($elm$core$String$contains, '{', ctx) ? 2 : 2)));
				};
				var spec1 = contextSpecificity(m1.cg);
				var spec2 = contextSpecificity(m2.cg);
				return (!_Utils_eq(spec1, spec2)) ? A2($elm$core$Basics$compare, spec2, spec1) : A2(
					$elm$core$Basics$compare,
					-$elm$core$String$length(m1.dD),
					-$elm$core$String$length(m2.dD));
			});
		var sortedMappings = A2($elm$core$List$sortWith, compareMapping, mappings);
		var checkBeforeContext = F2(
			function (pattern, before) {
				if ($elm$core$String$isEmpty(pattern)) {
					return true;
				} else {
					if (pattern === '#') {
						return $elm$core$String$isEmpty(before);
					} else {
						if (pattern === 'C') {
							var _v11 = getLastChar(before);
							if (!_v11.$) {
								var c = _v11.a;
								return isConsonant(c);
							} else {
								return false;
							}
						} else {
							if (pattern === 'V') {
								var _v12 = getLastChar(before);
								if (!_v12.$) {
									var c = _v12.a;
									return isVowel(c);
								} else {
									return false;
								}
							} else {
								if (pattern === 'V̆') {
									var _v13 = getLastChar(before);
									if (!_v13.$) {
										var c = _v13.a;
										return isShortVowel(c);
									} else {
										return false;
									}
								} else {
									if (A2($elm$core$String$startsWith, '{', pattern) && A2($elm$core$String$endsWith, '}', pattern)) {
										var phonemes = A2(
											$elm$core$List$map,
											$elm$core$String$trim,
											A2(
												$elm$core$String$split,
												',',
												A3($elm$core$String$slice, 1, -1, pattern)));
										return A2(
											$elm$core$List$any,
											function (p) {
												return A2($elm$core$String$endsWith, p, before);
											},
											phonemes);
									} else {
										if ($elm$core$String$length(pattern) === 1) {
											var _v14 = $elm$core$String$uncons(pattern);
											if (!_v14.$) {
												var _v15 = _v14.a;
												var _char = _v15.a;
												return ($elm$core$Char$isUpper(_char) && ((_char !== 'C') && (_char !== 'V'))) ? A3(matchesCustomCategory, _char, before, true) : A2($elm$core$String$endsWith, pattern, before);
											} else {
												return false;
											}
										} else {
											return A2($elm$core$String$endsWith, pattern, before);
										}
									}
								}
							}
						}
					}
				}
			});
		var checkAfterContext = F2(
			function (pattern, after) {
				if ($elm$core$String$isEmpty(pattern)) {
					return true;
				} else {
					if (pattern === '#') {
						return $elm$core$String$isEmpty(after);
					} else {
						if (pattern === 'C') {
							var _v6 = getFirstChar(after);
							if (!_v6.$) {
								var c = _v6.a;
								return isConsonant(c);
							} else {
								return false;
							}
						} else {
							if (pattern === 'V') {
								var _v7 = getFirstChar(after);
								if (!_v7.$) {
									var c = _v7.a;
									return isVowel(c);
								} else {
									return false;
								}
							} else {
								if (pattern === 'V̆') {
									var _v8 = getFirstChar(after);
									if (!_v8.$) {
										var c = _v8.a;
										return isShortVowel(c);
									} else {
										return false;
									}
								} else {
									if (A2($elm$core$String$startsWith, '{', pattern) && A2($elm$core$String$endsWith, '}', pattern)) {
										var phonemes = A2(
											$elm$core$List$map,
											$elm$core$String$trim,
											A2(
												$elm$core$String$split,
												',',
												A3($elm$core$String$slice, 1, -1, pattern)));
										return A2(
											$elm$core$List$any,
											function (p) {
												return A2($elm$core$String$startsWith, p, after);
											},
											phonemes);
									} else {
										if ($elm$core$String$length(pattern) === 1) {
											var _v9 = $elm$core$String$uncons(pattern);
											if (!_v9.$) {
												var _v10 = _v9.a;
												var _char = _v10.a;
												return ($elm$core$Char$isUpper(_char) && ((_char !== 'C') && (_char !== 'V'))) ? A3(matchesCustomCategory, _char, after, false) : A2($elm$core$String$startsWith, pattern, after);
											} else {
												return false;
											}
										} else {
											return A2($elm$core$String$startsWith, pattern, after);
										}
									}
								}
							}
						}
					}
				}
			});
		var checkContext = F3(
			function (context, before, after) {
				var parts = A2($elm$core$String$split, '_', context);
				_v4$2:
				while (true) {
					if (parts.b) {
						if (parts.b.b) {
							if (!parts.b.b.b) {
								var beforePart = parts.a;
								var _v5 = parts.b;
								var afterPart = _v5.a;
								return A2(checkBeforeContext, beforePart, before) && A2(checkAfterContext, afterPart, after);
							} else {
								break _v4$2;
							}
						} else {
							var beforePart = parts.a;
							return A2($elm$core$String$endsWith, '_', context) ? A2(checkBeforeContext, beforePart, before) : true;
						}
					} else {
						break _v4$2;
					}
				}
				return true;
			});
		var contextMatches = F4(
			function (context, before, remaining, phonemeLen) {
				return $elm$core$String$isEmpty(context) ? true : A3(
					checkContext,
					context,
					before,
					A2($elm$core$String$dropLeft, phonemeLen, remaining));
			});
		var findMatchingMapping = F3(
			function (before, remaining, mappingList) {
				findMatchingMapping:
				while (true) {
					if (!mappingList.b) {
						return $elm$core$Maybe$Nothing;
					} else {
						var mapping = mappingList.a;
						var rest = mappingList.b;
						if (A2($elm$core$String$startsWith, mapping.dD, remaining)) {
							if (A4(
								contextMatches,
								mapping.cg,
								before,
								remaining,
								$elm$core$String$length(mapping.dD))) {
								return $elm$core$Maybe$Just(mapping);
							} else {
								var $temp$before = before,
									$temp$remaining = remaining,
									$temp$mappingList = rest;
								before = $temp$before;
								remaining = $temp$remaining;
								mappingList = $temp$mappingList;
								continue findMatchingMapping;
							}
						} else {
							var $temp$before = before,
								$temp$remaining = remaining,
								$temp$mappingList = rest;
							before = $temp$before;
							remaining = $temp$remaining;
							mappingList = $temp$mappingList;
							continue findMatchingMapping;
						}
					}
				}
			});
		var applyMapping = F3(
			function (before, remaining, triggered) {
				if ($elm$core$String$isEmpty(remaining)) {
					return _Utils_Tuple2('', triggered);
				} else {
					var _v1 = A3(findMatchingMapping, before, remaining, sortedMappings);
					if (!_v1.$) {
						var match = _v1.a;
						var _v2 = A3(
							applyMapping,
							_Utils_ap(before, match.dD),
							A2(
								$elm$core$String$dropLeft,
								$elm$core$String$length(match.dD),
								remaining),
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2(match.dD, match.cg),
								triggered));
						var restResult = _v2.a;
						var restTriggered = _v2.b;
						return _Utils_Tuple2(
							_Utils_ap(match.dj, restResult),
							restTriggered);
					} else {
						var firstChar = A2($elm$core$String$left, 1, remaining);
						var _v3 = A3(
							applyMapping,
							_Utils_ap(before, firstChar),
							A2($elm$core$String$dropLeft, 1, remaining),
							triggered);
						var restResult = _v3.a;
						var restTriggered = _v3.b;
						return _Utils_Tuple2(
							_Utils_ap(firstChar, restResult),
							restTriggered);
					}
				}
			});
		return A3(applyMapping, '', syllable, _List_Nil);
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$MorphologyHelpers$applyOrthographyWithTracking = F4(
	function (phonology, mappings, diphthongs, word) {
		var syllables = A2($elm$core$String$split, '.', word);
		var results = A2(
			$elm$core$List$map,
			A3($author$project$MorphologyHelpers$applySyllableOrthographyWithTracking, phonology, mappings, diphthongs),
			syllables);
		var mappedSyllables = A2($elm$core$List$map, $elm$core$Tuple$first, results);
		var allTriggeredRules = A2($elm$core$List$concatMap, $elm$core$Tuple$second, results);
		var uniqueTriggeredRules = A3(
			$elm$core$List$foldl,
			F2(
				function (item, acc) {
					return A2($elm$core$List$member, item, acc) ? acc : A2($elm$core$List$cons, item, acc);
				}),
			_List_Nil,
			allTriggeredRules);
		return _Utils_Tuple2(
			A2($elm$core$String$join, '', mappedSyllables),
			uniqueTriggeredRules);
	});
var $elm$core$String$fromList = _String_fromList;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$MorphologyHelpers$isVowelChar = function (c) {
	return A2(
		$elm$core$List$member,
		c,
		_List_fromArray(
			['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U']));
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$MorphologyHelpers$matchesPatternAfterVowel = F3(
	function (patternChars, chars, previousChar) {
		var patternLen = $elm$core$List$length(patternChars);
		var extracted = A2($elm$core$List$take, patternLen, chars);
		return _Utils_eq(extracted, patternChars) && function () {
			if (!previousChar.$) {
				var c = previousChar.a;
				return $author$project$MorphologyHelpers$isVowelChar(c);
			} else {
				return false;
			}
		}();
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$MorphologyHelpers$replaceAfterVowelHelper = F4(
	function (patternChars, replacement, chars, previousChar) {
		replaceAfterVowelHelper:
		while (true) {
			if (!chars.b) {
				return _List_Nil;
			} else {
				if (A3($author$project$MorphologyHelpers$matchesPatternAfterVowel, patternChars, chars, previousChar)) {
					var newChars = _Utils_ap(
						$elm$core$String$toList(replacement),
						A2(
							$elm$core$List$drop,
							$elm$core$List$length(patternChars),
							chars));
					var $temp$patternChars = patternChars,
						$temp$replacement = replacement,
						$temp$chars = newChars,
						$temp$previousChar = $elm$core$Maybe$Nothing;
					patternChars = $temp$patternChars;
					replacement = $temp$replacement;
					chars = $temp$chars;
					previousChar = $temp$previousChar;
					continue replaceAfterVowelHelper;
				} else {
					if (chars.b) {
						var first = chars.a;
						var rest = chars.b;
						return A2(
							$elm$core$List$cons,
							first,
							A4(
								$author$project$MorphologyHelpers$replaceAfterVowelHelper,
								patternChars,
								replacement,
								rest,
								$elm$core$Maybe$Just(first)));
					} else {
						return _List_Nil;
					}
				}
			}
		}
	});
var $author$project$MorphologyHelpers$replaceAfterVowel = F3(
	function (pattern, replacement, word) {
		var patternChars = $elm$core$String$toList(pattern);
		var chars = $elm$core$String$toList(word);
		return $elm$core$String$fromList(
			A4($author$project$MorphologyHelpers$replaceAfterVowelHelper, patternChars, replacement, chars, $elm$core$Maybe$Nothing));
	});
var $author$project$MorphologyHelpers$matchesPatternBeforeVowel = F2(
	function (patternChars, chars) {
		var patternLen = $elm$core$List$length(patternChars);
		var extracted = A2($elm$core$List$take, patternLen, chars);
		var afterPattern = A2($elm$core$List$drop, patternLen, chars);
		return _Utils_eq(extracted, patternChars) && function () {
			var _v0 = $elm$core$List$head(afterPattern);
			if (!_v0.$) {
				var c = _v0.a;
				return $author$project$MorphologyHelpers$isVowelChar(c);
			} else {
				return false;
			}
		}();
	});
var $author$project$MorphologyHelpers$replaceBeforeVowelHelper = F3(
	function (patternChars, replacement, chars) {
		if (!chars.b) {
			return _List_Nil;
		} else {
			if (A2($author$project$MorphologyHelpers$matchesPatternBeforeVowel, patternChars, chars)) {
				return A3(
					$author$project$MorphologyHelpers$replaceBeforeVowelHelper,
					patternChars,
					replacement,
					_Utils_ap(
						$elm$core$String$toList(replacement),
						A2(
							$elm$core$List$drop,
							$elm$core$List$length(patternChars),
							chars)));
			} else {
				if (chars.b) {
					var first = chars.a;
					var rest = chars.b;
					return A2(
						$elm$core$List$cons,
						first,
						A3($author$project$MorphologyHelpers$replaceBeforeVowelHelper, patternChars, replacement, rest));
				} else {
					return _List_Nil;
				}
			}
		}
	});
var $author$project$MorphologyHelpers$replaceBeforeVowel = F3(
	function (pattern, replacement, word) {
		var patternChars = $elm$core$String$toList(pattern);
		var chars = $elm$core$String$toList(word);
		return $elm$core$String$fromList(
			A3($author$project$MorphologyHelpers$replaceBeforeVowelHelper, patternChars, replacement, chars));
	});
var $author$project$MorphologyHelpers$matchesPatternBetweenVowels = F3(
	function (patternChars, chars, previousChar) {
		var patternLen = $elm$core$List$length(patternChars);
		var extracted = A2($elm$core$List$take, patternLen, chars);
		var afterPattern = A2($elm$core$List$drop, patternLen, chars);
		return _Utils_eq(extracted, patternChars) && function () {
			if (!previousChar.$) {
				var prevC = previousChar.a;
				return $author$project$MorphologyHelpers$isVowelChar(prevC) && function () {
					var _v1 = $elm$core$List$head(afterPattern);
					if (!_v1.$) {
						var nextC = _v1.a;
						return $author$project$MorphologyHelpers$isVowelChar(nextC);
					} else {
						return false;
					}
				}();
			} else {
				return false;
			}
		}();
	});
var $author$project$MorphologyHelpers$replaceBetweenVowelsHelper = F4(
	function (patternChars, replacement, chars, previousChar) {
		replaceBetweenVowelsHelper:
		while (true) {
			if (!chars.b) {
				return _List_Nil;
			} else {
				if (A3($author$project$MorphologyHelpers$matchesPatternBetweenVowels, patternChars, chars, previousChar)) {
					var newChars = _Utils_ap(
						$elm$core$String$toList(replacement),
						A2(
							$elm$core$List$drop,
							$elm$core$List$length(patternChars),
							chars));
					var $temp$patternChars = patternChars,
						$temp$replacement = replacement,
						$temp$chars = newChars,
						$temp$previousChar = $elm$core$Maybe$Nothing;
					patternChars = $temp$patternChars;
					replacement = $temp$replacement;
					chars = $temp$chars;
					previousChar = $temp$previousChar;
					continue replaceBetweenVowelsHelper;
				} else {
					if (chars.b) {
						var first = chars.a;
						var rest = chars.b;
						return A2(
							$elm$core$List$cons,
							first,
							A4(
								$author$project$MorphologyHelpers$replaceBetweenVowelsHelper,
								patternChars,
								replacement,
								rest,
								$elm$core$Maybe$Just(first)));
					} else {
						return _List_Nil;
					}
				}
			}
		}
	});
var $author$project$MorphologyHelpers$replaceBetweenVowels = F3(
	function (pattern, replacement, word) {
		var patternChars = $elm$core$String$toList(pattern);
		var chars = $elm$core$String$toList(word);
		return $elm$core$String$fromList(
			A4($author$project$MorphologyHelpers$replaceBetweenVowelsHelper, patternChars, replacement, chars, $elm$core$Maybe$Nothing));
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $author$project$MorphologyHelpers$replaceWordFinal = F3(
	function (pattern, replacement, word) {
		return A2($elm$core$String$endsWith, pattern, word) ? _Utils_ap(
			A2(
				$elm$core$String$dropRight,
				$elm$core$String$length(pattern),
				word),
			replacement) : word;
	});
var $author$project$MorphologyHelpers$replaceWordInitial = F3(
	function (pattern, replacement, word) {
		return A2($elm$core$String$startsWith, pattern, word) ? _Utils_ap(
			replacement,
			A2(
				$elm$core$String$dropLeft,
				$elm$core$String$length(pattern),
				word)) : word;
	});
var $author$project$MorphologyHelpers$applySoundChangeWithContext = F4(
	function (pattern, replacement, context, word) {
		if (context === '#_') {
			return A3($author$project$MorphologyHelpers$replaceWordInitial, pattern, replacement, word);
		} else {
			if (context === '_#') {
				return A3($author$project$MorphologyHelpers$replaceWordFinal, pattern, replacement, word);
			} else {
				if (A2($elm$core$String$contains, '_V', context)) {
					return A3($author$project$MorphologyHelpers$replaceBeforeVowel, pattern, replacement, word);
				} else {
					if (A2($elm$core$String$contains, 'V_', context)) {
						return A3($author$project$MorphologyHelpers$replaceAfterVowel, pattern, replacement, word);
					} else {
						if (A2($elm$core$String$contains, 'V_V', context)) {
							return A3($author$project$MorphologyHelpers$replaceBetweenVowels, pattern, replacement, word);
						} else {
							var contextPattern = A3($elm$core$String$replace, '_', pattern, context);
							return A3(
								$elm$core$String$replace,
								contextPattern,
								A3($elm$core$String$replace, pattern, replacement, contextPattern),
								word);
						}
					}
				}
			}
		}
	});
var $author$project$MorphologyHelpers$applySoundChange = F4(
	function (pattern, replacement, context, word) {
		return $elm$core$String$isEmpty(pattern) ? word : ($elm$core$String$isEmpty(context) ? A3($elm$core$String$replace, pattern, replacement, word) : A4($author$project$MorphologyHelpers$applySoundChangeWithContext, pattern, replacement, context, word));
	});
var $author$project$MorphologyHelpers$applySoundChangeToWord = F4(
	function (pattern, replacement, context, lexeme) {
		var newForm = A4($author$project$MorphologyHelpers$applySoundChange, pattern, replacement, context, lexeme.bR);
		return _Utils_update(
			lexeme,
			{bR: newForm});
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $author$project$Types$Circumfix = 3;
var $author$project$Types$CodaRestriction = 3;
var $author$project$Types$Dissimilation = 1;
var $author$project$Types$NoWordInitial = 4;
var $author$project$Types$OnsetRestriction = 2;
var $author$project$Types$Prefix = 0;
var $author$project$Templates$englishTemplate = {
	aq: 'A template based on English phonology with common Germanic patterns',
	bn: 0,
	$7: true,
	ct: {
		dh: _List_Nil,
		dq: $elm$core$Maybe$Nothing,
		dt: $elm$core$Dict$empty,
		dv: {
			bQ: _List_fromArray(
				[
					{
					I: 'Number',
					ae: '',
					dR: _List_fromArray(
						['singular', 'plural'])
				},
					{
					I: 'Tense',
					ae: '',
					dR: _List_fromArray(
						['present', 'past', 'future'])
				},
					{
					I: 'Person',
					ae: '',
					dR: _List_fromArray(
						['1st', '2nd', '3rd'])
				},
					{
					I: 'Aspect',
					ae: '',
					dR: _List_fromArray(
						['simple', 'progressive', 'perfect'])
				}
				]),
			bV: _List_fromArray(
				[
					{df: 'Number', bR: '-s', di: 'PL', du: 1, ae: '', dQ: 'plural'},
					{df: 'Tense', bR: '-ed', di: 'PST', du: 1, ae: '', dQ: 'past'},
					{df: 'Tense', bR: 'will-', di: 'FUT', du: 0, ae: '', dQ: 'future'},
					{df: 'Aspect', bR: '-ing', di: 'PROG', du: 1, ae: '', dQ: 'progressive'},
					{df: 'Person', bR: '-s', di: '3SG', du: 1, ae: '', dQ: '3rd'},
					{df: 'Aspect', bR: 'have-...-en', di: 'PERF', du: 3, ae: '', dQ: 'perfect'}
				]),
			cy: _List_fromArray(
				[
					{cg: 'V_', aq: 's becomes z after vowels', I: 'Voicing Assimilation', dH: 'z', dJ: 0, dO: 's'},
					{cg: 'e_', aq: 'e deletes before another e', I: 'E-deletion', dH: '', dJ: 1, dO: 'e'},
					{cg: '_s', aq: 'y becomes i before suffix -s', I: 'Y to I', dH: 'ɪ', dJ: 0, dO: 'j'},
					{cg: 'V̆_V', aq: 't doubles between short vowel and vowel suffix', I: 'Consonant doubling', dH: 'tt', dJ: 0, dO: 't'}
				]),
			cC: _List_Nil
		},
		dE: {
			ce: _List_fromArray(
				[
					{
					dp: 'C',
					I: 'Consonants',
					dM: _List_fromArray(
						['p', 'b', 't', 'd', 'k', 'g', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'tʃ', 'dʒ', 'm', 'n', 'ŋ', 'l', 'r', 'w', 'j']),
					ae: ''
				},
					{
					dp: 'V',
					I: 'Vowels',
					dM: _List_fromArray(
						['i', 'ɪ', 'e', 'ɛ', 'æ', 'ɑ', 'ɔ', 'o', 'ʊ', 'u', 'ʌ', 'ə', 'aɪ', 'aʊ', 'ɔɪ', 'eɪ', 'oʊ']),
					ae: ''
				},
					{
					dp: 'T',
					I: 'Stops',
					dM: _List_fromArray(
						['p', 'b', 't', 'd', 'k', 'g']),
					ae: ''
				},
					{
					dp: 'F',
					I: 'Fricatives',
					dM: _List_fromArray(
						['f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h']),
					ae: ''
				},
					{
					dp: 'A',
					I: 'Affricates',
					dM: _List_fromArray(
						['tʃ', 'dʒ']),
					ae: ''
				},
					{
					dp: 'N',
					I: 'Nasals',
					dM: _List_fromArray(
						['m', 'n', 'ŋ']),
					ae: ''
				},
					{
					dp: 'L',
					I: 'Liquids',
					dM: _List_fromArray(
						['l', 'r']),
					ae: ''
				},
					{
					dp: 'G',
					I: 'Glides',
					dM: _List_fromArray(
						['w', 'j']),
					ae: ''
				},
					{
					dp: 'M',
					I: 'Monophthongs',
					dM: _List_fromArray(
						['i', 'ɪ', 'e', 'ɛ', 'æ', 'ɑ', 'ɔ', 'o', 'ʊ', 'u', 'ʌ', 'ə']),
					ae: ''
				},
					{
					dp: 'D',
					I: 'Diphthongs',
					dM: _List_fromArray(
						['aɪ', 'aʊ', 'ɔɪ', 'eɪ', 'oʊ']),
					ae: ''
				}
				]),
			c8: _List_fromArray(
				[
					{c7: 0, aq: 'Illegal cluster: *tl', dL: 'tl'},
					{c7: 0, aq: 'Illegal cluster: *dl', dL: 'dl'},
					{c7: 0, aq: 'Illegal cluster: *bn', dL: 'bn'},
					{c7: 0, aq: 'Illegal cluster: *pn (word-initially)', dL: 'pn'},
					{c7: 2, aq: 'ŋ not allowed in syllable onset', dL: 'ŋ'},
					{c7: 3, aq: 'h not allowed in syllable coda', dL: 'h'},
					{c7: 3, aq: 'w not allowed in syllable coda', dL: 'w'},
					{c7: 3, aq: 'j not allowed in syllable coda', dL: 'j'},
					{c7: 4, aq: 'ŋ not allowed word-initially', dL: 'ŋ'}
				]),
			da: _List_fromArray(
				['aɪ', 'aʊ', 'ɔɪ', 'eɪ', 'oʊ']),
			cA: {
				cj: 0,
				cq: _List_fromArray(
					[
						{cg: '', aq: 'voiceless bilabial stop', dj: 'p', dD: 'p'},
						{cg: '', aq: 'voiced bilabial stop', dj: 'b', dD: 'b'},
						{cg: '', aq: 'voiceless alveolar stop', dj: 't', dD: 't'},
						{cg: '', aq: 'voiced alveolar stop', dj: 'd', dD: 'd'},
						{cg: 'V̆_', aq: 'voiceless velar stop (ck after short vowel)', dj: 'ck', dD: 'k'},
						{cg: '', aq: 'voiceless velar stop', dj: 'k', dD: 'k'},
						{cg: '', aq: 'voiced velar stop', dj: 'g', dD: 'g'},
						{cg: '', aq: 'voiceless labiodental fricative', dj: 'f', dD: 'f'},
						{cg: '', aq: 'voiced labiodental fricative', dj: 'v', dD: 'v'},
						{cg: '', aq: 'voiceless dental fricative', dj: 'th', dD: 'θ'},
						{cg: '', aq: 'voiced dental fricative (also \'th\')', dj: 'th', dD: 'ð'},
						{cg: 'V̆_', aq: 'voiceless alveolar fricative (doubled after short vowel)', dj: 'ss', dD: 's'},
						{cg: '', aq: 'voiceless alveolar fricative', dj: 's', dD: 's'},
						{cg: '', aq: 'voiced alveolar fricative', dj: 'z', dD: 'z'},
						{cg: '', aq: 'voiceless postalveolar fricative', dj: 'sh', dD: 'ʃ'},
						{cg: '', aq: 'voiced postalveolar fricative', dj: 'zh', dD: 'ʒ'},
						{cg: '', aq: 'voiceless glottal fricative', dj: 'h', dD: 'h'},
						{cg: 'V̆_', aq: 'voiceless postalveolar affricate (tch after short vowel)', dj: 'tch', dD: 'tʃ'},
						{cg: '', aq: 'voiceless postalveolar affricate', dj: 'ch', dD: 'tʃ'},
						{cg: 'V̆_', aq: 'voiced postalveolar affricate (dge after short vowel)', dj: 'dge', dD: 'dʒ'},
						{cg: '#_', aq: 'voiced postalveolar affricate (word-initially)', dj: 'j', dD: 'dʒ'},
						{cg: '_#', aq: 'voiced postalveolar affricate (word-finally)', dj: 'ge', dD: 'dʒ'},
						{cg: '', aq: 'voiced postalveolar affricate', dj: 'g', dD: 'dʒ'},
						{cg: '', aq: 'bilabial nasal', dj: 'm', dD: 'm'},
						{cg: '', aq: 'alveolar nasal', dj: 'n', dD: 'n'},
						{cg: '', aq: 'velar nasal', dj: 'ng', dD: 'ŋ'},
						{cg: 'V̆_', aq: 'alveolar lateral approximant (doubled after short vowel)', dj: 'll', dD: 'l'},
						{cg: '', aq: 'alveolar lateral approximant', dj: 'l', dD: 'l'},
						{cg: 'V̆_', aq: 'alveolar approximant (doubled after short vowel)', dj: 'rr', dD: 'r'},
						{cg: '', aq: 'alveolar approximant', dj: 'r', dD: 'r'},
						{cg: '', aq: 'labio-velar approximant', dj: 'w', dD: 'w'},
						{cg: '', aq: 'palatal approximant', dj: 'y', dD: 'j'},
						{cg: '', aq: 'close front unrounded vowel', dj: 'ee', dD: 'i'},
						{cg: '', aq: 'near-close front unrounded vowel', dj: 'i', dD: 'ɪ'},
						{cg: '', aq: 'close-mid front unrounded vowel (diphthong)', dj: 'ay', dD: 'e'},
						{cg: '', aq: 'open-mid front unrounded vowel', dj: 'e', dD: 'ɛ'},
						{cg: '', aq: 'near-open front unrounded vowel', dj: 'a', dD: 'æ'},
						{cg: '', aq: 'open back unrounded vowel', dj: 'o', dD: 'ɑ'},
						{cg: '', aq: 'open-mid back rounded vowel', dj: 'aw', dD: 'ɔ'},
						{cg: '', aq: 'close-mid back rounded vowel', dj: 'oa', dD: 'o'},
						{cg: '', aq: 'near-close back rounded vowel', dj: 'oo', dD: 'ʊ'},
						{cg: '', aq: 'close back rounded vowel', dj: 'oo', dD: 'u'},
						{cg: '', aq: 'open-mid back unrounded vowel', dj: 'u', dD: 'ʌ'},
						{cg: '', aq: 'mid central vowel (schwa, unstressed)', dj: 'a', dD: 'ə'},
						{cg: '', aq: 'diphthong (as in \'bite\')', dj: 'i', dD: 'aɪ'},
						{cg: '', aq: 'diphthong (as in \'out\')', dj: 'ou', dD: 'aʊ'},
						{cg: '', aq: 'diphthong (as in \'boy\')', dj: 'oy', dD: 'ɔɪ'},
						{cg: '', aq: 'diphthong (as in \'bait\')', dj: 'a', dD: 'eɪ'},
						{cg: '', aq: 'diphthong (as in \'boat\')', dj: 'o', dD: 'oʊ'}
					])
			},
			dC: _List_fromArray(
				[
					{I: 'M', dB: 'M'},
					{I: 'D', dB: 'D'},
					{I: 'MC', dB: 'MC'},
					{I: 'DC', dB: 'DC'},
					{I: 'CM', dB: 'CM'},
					{I: 'CD', dB: 'CD'},
					{I: 'CMC', dB: 'CMC'},
					{I: 'CDC', dB: 'CDC'},
					{I: 'CMCC', dB: 'CMCC'},
					{I: 'MCC', dB: 'MCC'},
					{I: 'CCM', dB: 'CCM'},
					{I: 'CCMC', dB: 'CCMC'},
					{I: 'CCMCC', dB: 'CCMCC'},
					{I: 'CCCMC', dB: 'CCCMC'}
				])
		},
		ae: ''
	},
	I: 'English-inspired'
};
var $author$project$Types$NoWordFinal = 5;
var $author$project$Types$VowelHarmony = 2;
var $author$project$Templates$quenyaTemplate = {
	aq: 'A template based on Tolkien\'s Quenya with a flowing, vowel-rich phonology',
	bn: 0,
	$7: true,
	ct: {
		dh: _List_Nil,
		dq: $elm$core$Maybe$Nothing,
		dt: $elm$core$Dict$empty,
		dv: {
			bQ: _List_fromArray(
				[
					{
					I: 'Number',
					ae: '',
					dR: _List_fromArray(
						['singular', 'plural', 'dual'])
				},
					{
					I: 'Case',
					ae: '',
					dR: _List_fromArray(
						['nominative', 'genitive', 'dative', 'accusative', 'locative', 'instrumental', 'ablative', 'allative'])
				},
					{
					I: 'Definiteness',
					ae: '',
					dR: _List_fromArray(
						['indefinite', 'definite'])
				}
				]),
			bV: _List_fromArray(
				[
					{df: 'Number', bR: '-r', di: 'PL', du: 1, ae: '', dQ: 'plural'},
					{df: 'Number', bR: '-t', di: 'DU', du: 1, ae: '', dQ: 'dual'},
					{df: 'Case', bR: '-o', di: 'GEN', du: 1, ae: '', dQ: 'genitive'},
					{df: 'Case', bR: '-n', di: 'DAT', du: 1, ae: '', dQ: 'dative'},
					{df: 'Case', bR: '-', di: 'ACC', du: 1, ae: '', dQ: 'accusative'},
					{df: 'Case', bR: '-sse', di: 'LOC', du: 1, ae: '', dQ: 'locative'},
					{df: 'Case', bR: '-nen', di: 'INST', du: 1, ae: '', dQ: 'instrumental'},
					{df: 'Case', bR: '-llo', di: 'ABL', du: 1, ae: '', dQ: 'ablative'},
					{df: 'Case', bR: '-nna', di: 'ALL', du: 1, ae: '', dQ: 'allative'}
				]),
			cy: _List_fromArray(
				[
					{cg: '', aq: 'e becomes i in certain contexts', I: 'Vowel Harmony', dH: 'i', dJ: 2, dO: 'e'},
					{cg: '_p', aq: 'n becomes m before p', I: 'Nasal Assimilation', dH: 'm', dJ: 0, dO: 'n'},
					{cg: 'V_V', aq: 't becomes r between vowels', I: 'T-lenition', dH: 'r', dJ: 0, dO: 't'},
					{cg: '_#', aq: 'final e may drop in compounds', I: 'Final vowel loss', dH: '', dJ: 1, dO: 'e'}
				]),
			cC: _List_Nil
		},
		dE: {
			ce: _List_fromArray(
				[
					{
					dp: 'C',
					I: 'Consonants',
					dM: _List_fromArray(
						['p', 't', 'k', 'kʷ', 'm', 'n', 'ɲ', 'ŋ', 'f', 's', 'h', 'hl', 'hr', 'hw', 'l', 'r', 'w', 'j']),
					ae: ''
				},
					{
					dp: 'V',
					I: 'Vowels',
					dM: _List_fromArray(
						['a', 'e', 'i', 'o', 'u', 'aː', 'eː', 'iː', 'oː', 'uː', 'ai', 'ei', 'oi', 'ui', 'au', 'eu', 'iu']),
					ae: ''
				},
					{
					dp: 'T',
					I: 'Stops',
					dM: _List_fromArray(
						['p', 't', 'k', 'kʷ']),
					ae: ''
				},
					{
					dp: 'N',
					I: 'Nasals',
					dM: _List_fromArray(
						['m', 'n', 'ɲ', 'ŋ']),
					ae: ''
				},
					{
					dp: 'F',
					I: 'Fricatives',
					dM: _List_fromArray(
						['f', 's', 'h', 'hl', 'hr', 'hw']),
					ae: ''
				},
					{
					dp: 'L',
					I: 'Liquids',
					dM: _List_fromArray(
						['l', 'r']),
					ae: ''
				},
					{
					dp: 'G',
					I: 'Glides',
					dM: _List_fromArray(
						['w', 'j']),
					ae: ''
				},
					{
					dp: 'S',
					I: 'ShortVowels',
					dM: _List_fromArray(
						['a', 'e', 'i', 'o', 'u']),
					ae: ''
				},
					{
					dp: 'Q',
					I: 'LongVowels',
					dM: _List_fromArray(
						['aː', 'eː', 'iː', 'oː', 'uː']),
					ae: ''
				},
					{
					dp: 'D',
					I: 'Diphthongs',
					dM: _List_fromArray(
						['ai', 'ei', 'oi', 'ui', 'au', 'eu', 'iu']),
					ae: ''
				}
				]),
			c8: _List_fromArray(
				[
					{c7: 0, aq: 'Illegal cluster: *nm', dL: 'nm'},
					{c7: 0, aq: 'Illegal cluster: *fn', dL: 'fn'},
					{c7: 0, aq: 'Illegal cluster: *tl', dL: 'tl'},
					{c7: 0, aq: 'Illegal cluster: *sr', dL: 'sr'},
					{c7: 2, aq: 'ŋ not allowed in syllable onset', dL: 'ŋ'},
					{c7: 3, aq: 'h not allowed in syllable coda', dL: 'h'},
					{c7: 3, aq: 'j not allowed in syllable coda', dL: 'j'},
					{c7: 5, aq: 'w not allowed word-finally', dL: 'w'},
					{c7: 4, aq: 'ŋ not allowed word-initially', dL: 'ŋ'}
				]),
			da: _List_fromArray(
				['ai', 'ei', 'oi', 'ui', 'au', 'eu', 'iu']),
			cA: {
				cj: 0,
				cq: _List_fromArray(
					[
						{cg: '', aq: 'voiceless bilabial stop', dj: 'p', dD: 'p'},
						{cg: '', aq: 'voiceless alveolar stop', dj: 't', dD: 't'},
						{cg: '', aq: 'voiceless velar stop (spelled \'c\')', dj: 'c', dD: 'k'},
						{cg: '', aq: 'labialized velar stop', dj: 'qu', dD: 'kʷ'},
						{cg: '', aq: 'bilabial nasal', dj: 'm', dD: 'm'},
						{cg: '_{a,i}', aq: 'alveolar nasal (doubled before a/i)', dj: 'nn', dD: 'n'},
						{cg: '_p', aq: 'alveolar nasal (assimilates before p)', dj: 'm', dD: 'n'},
						{cg: '', aq: 'alveolar nasal', dj: 'n', dD: 'n'},
						{cg: '', aq: 'palatal nasal', dj: 'ny', dD: 'ɲ'},
						{cg: '', aq: 'velar nasal (used medially)', dj: 'ng', dD: 'ŋ'},
						{cg: '', aq: 'voiceless labiodental fricative', dj: 'f', dD: 'f'},
						{cg: 'V_V', aq: 'voiceless alveolar fricative (doubled medially)', dj: 'ss', dD: 's'},
						{cg: '', aq: 'voiceless alveolar fricative', dj: 's', dD: 's'},
						{cg: '', aq: 'voiceless glottal fricative', dj: 'h', dD: 'h'},
						{cg: '', aq: 'voiceless lateral fricative', dj: 'hl', dD: 'hl'},
						{cg: '', aq: 'voiceless trilled r', dj: 'hr', dD: 'hr'},
						{cg: '', aq: 'voiceless w', dj: 'hw', dD: 'hw'},
						{cg: 'V_', aq: 'alveolar lateral approximant (doubled after vowel)', dj: 'll', dD: 'l'},
						{cg: '', aq: 'alveolar lateral approximant', dj: 'l', dD: 'l'},
						{cg: 'V_V', aq: 'alveolar trill (doubled medially)', dj: 'rr', dD: 'r'},
						{cg: '', aq: 'alveolar trill', dj: 'r', dD: 'r'},
						{cg: '', aq: 'labio-velar approximant (spelled \'v\')', dj: 'v', dD: 'w'},
						{cg: '', aq: 'palatal approximant', dj: 'y', dD: 'j'},
						{cg: '', aq: 'open front unrounded vowel', dj: 'a', dD: 'a'},
						{cg: '', aq: 'close-mid front unrounded vowel', dj: 'e', dD: 'e'},
						{cg: '', aq: 'close front unrounded vowel', dj: 'i', dD: 'i'},
						{cg: '', aq: 'close-mid back rounded vowel', dj: 'o', dD: 'o'},
						{cg: '', aq: 'close back rounded vowel', dj: 'u', dD: 'u'},
						{cg: '', aq: 'long open front unrounded vowel', dj: 'á', dD: 'aː'},
						{cg: '', aq: 'long close-mid front unrounded vowel', dj: 'é', dD: 'eː'},
						{cg: '', aq: 'long close front unrounded vowel', dj: 'í', dD: 'iː'},
						{cg: '', aq: 'long close-mid back rounded vowel', dj: 'ó', dD: 'oː'},
						{cg: '', aq: 'long close back rounded vowel', dj: 'ú', dD: 'uː'},
						{cg: '', aq: 'diphthong', dj: 'ai', dD: 'ai'},
						{cg: '', aq: 'diphthong', dj: 'ei', dD: 'ei'},
						{cg: '', aq: 'diphthong', dj: 'oi', dD: 'oi'},
						{cg: '', aq: 'diphthong', dj: 'ui', dD: 'ui'},
						{cg: '', aq: 'diphthong', dj: 'au', dD: 'au'},
						{cg: '', aq: 'diphthong', dj: 'eu', dD: 'eu'},
						{cg: '', aq: 'diphthong', dj: 'iu', dD: 'iu'}
					])
			},
			dC: _List_fromArray(
				[
					{I: 'S', dB: 'S'},
					{I: 'Q', dB: 'Q'},
					{I: 'D', dB: 'D'},
					{I: 'CS', dB: 'CS'},
					{I: 'CQ', dB: 'CQ'},
					{I: 'CD', dB: 'CD'},
					{I: 'CSC', dB: 'CSC'},
					{I: 'CQC', dB: 'CQC'},
					{I: 'CDC', dB: 'CDC'},
					{I: 'CSCC', dB: 'CSCC'},
					{I: 'LV', dB: 'LV'},
					{I: 'NV', dB: 'NV'}
				])
		},
		ae: ''
	},
	I: 'Quenya-inspired'
};
var $author$project$Templates$russianTemplate = {
	aq: 'A template based on Russian phonology and morphology with Latin orthography (no diacritics) and comprehensive inflectional system',
	bn: 0,
	$7: true,
	ct: {
		dh: _List_Nil,
		dq: $elm$core$Maybe$Nothing,
		dt: $elm$core$Dict$empty,
		dv: {
			bQ: _List_fromArray(
				[
					{
					I: 'Number',
					ae: '',
					dR: _List_fromArray(
						['singular', 'plural'])
				},
					{
					I: 'Gender',
					ae: '',
					dR: _List_fromArray(
						['masculine', 'feminine', 'neuter'])
				},
					{
					I: 'Case',
					ae: '',
					dR: _List_fromArray(
						['nominative', 'accusative', 'genitive', 'dative', 'instrumental', 'prepositional'])
				},
					{
					I: 'Animacy',
					ae: '',
					dR: _List_fromArray(
						['animate', 'inanimate'])
				},
					{
					I: 'Tense',
					ae: '',
					dR: _List_fromArray(
						['past', 'present', 'future'])
				},
					{
					I: 'Aspect',
					ae: '',
					dR: _List_fromArray(
						['perfective', 'imperfective'])
				},
					{
					I: 'Person',
					ae: '',
					dR: _List_fromArray(
						['1st', '2nd', '3rd'])
				}
				]),
			bV: _List_fromArray(
				[
					{df: 'Case', bR: '-Ø', di: 'NOM.SG.M', du: 1, ae: '', dQ: 'nominative'},
					{df: 'Case', bR: '-a', di: 'NOM.SG.F', du: 1, ae: '', dQ: 'nominative'},
					{df: 'Case', bR: '-o', di: 'NOM.SG.N', du: 1, ae: '', dQ: 'nominative'},
					{df: 'Number', bR: '-y', di: 'NOM.PL', du: 1, ae: '', dQ: 'plural'},
					{df: 'Number', bR: '-i', di: 'NOM.PL.F', du: 1, ae: '', dQ: 'plural'},
					{df: 'Case', bR: '-Ø', di: 'ACC.SG.M.INAN', du: 1, ae: '', dQ: 'accusative'},
					{df: 'Case', bR: '-a', di: 'ACC.SG.M.ANIM', du: 1, ae: '', dQ: 'accusative'},
					{df: 'Case', bR: '-u', di: 'ACC.SG.F', du: 1, ae: '', dQ: 'accusative'},
					{df: 'Case', bR: '-o', di: 'ACC.SG.N', du: 1, ae: '', dQ: 'accusative'},
					{df: 'Case', bR: '-ov', di: 'ACC.PL.ANIM', du: 1, ae: '', dQ: 'accusative'},
					{df: 'Case', bR: '-y', di: 'ACC.PL.INAN', du: 1, ae: '', dQ: 'accusative'},
					{df: 'Case', bR: '-a', di: 'GEN.SG.M', du: 1, ae: '', dQ: 'genitive'},
					{df: 'Case', bR: '-y', di: 'GEN.SG.F', du: 1, ae: '', dQ: 'genitive'},
					{df: 'Case', bR: '-a', di: 'GEN.SG.N', du: 1, ae: '', dQ: 'genitive'},
					{df: 'Case', bR: '-ov', di: 'GEN.PL.M', du: 1, ae: '', dQ: 'genitive'},
					{df: 'Case', bR: '-Ø', di: 'GEN.PL.F', du: 1, ae: '', dQ: 'genitive'},
					{df: 'Case', bR: '-u', di: 'DAT.SG.M', du: 1, ae: '', dQ: 'dative'},
					{df: 'Case', bR: '-e', di: 'DAT.SG.F', du: 1, ae: '', dQ: 'dative'},
					{df: 'Case', bR: '-u', di: 'DAT.SG.N', du: 1, ae: '', dQ: 'dative'},
					{df: 'Case', bR: '-am', di: 'DAT.PL', du: 1, ae: '', dQ: 'dative'},
					{df: 'Case', bR: '-om', di: 'INST.SG.M', du: 1, ae: '', dQ: 'instrumental'},
					{df: 'Case', bR: '-oj', di: 'INST.SG.F', du: 1, ae: '', dQ: 'instrumental'},
					{df: 'Case', bR: '-om', di: 'INST.SG.N', du: 1, ae: '', dQ: 'instrumental'},
					{df: 'Case', bR: '-ami', di: 'INST.PL', du: 1, ae: '', dQ: 'instrumental'},
					{df: 'Case', bR: '-e', di: 'PREP.SG.M', du: 1, ae: '', dQ: 'prepositional'},
					{df: 'Case', bR: '-e', di: 'PREP.SG.F', du: 1, ae: '', dQ: 'prepositional'},
					{df: 'Case', bR: '-e', di: 'PREP.SG.N', du: 1, ae: '', dQ: 'prepositional'},
					{df: 'Case', bR: '-akh', di: 'PREP.PL', du: 1, ae: '', dQ: 'prepositional'},
					{df: 'Person', bR: '-u', di: '1SG.PRS', du: 1, ae: '', dQ: '1st'},
					{df: 'Person', bR: '-esh', di: '2SG.PRS', du: 1, ae: '', dQ: '2nd'},
					{df: 'Person', bR: '-et', di: '3SG.PRS', du: 1, ae: '', dQ: '3rd'},
					{df: 'Person', bR: '-em', di: '1PL.PRS', du: 1, ae: '', dQ: '1st'},
					{df: 'Person', bR: '-ete', di: '2PL.PRS', du: 1, ae: '', dQ: '2nd'},
					{df: 'Person', bR: '-ut', di: '3PL.PRS', du: 1, ae: '', dQ: '3rd'},
					{df: 'Tense', bR: '-l', di: 'PST.M', du: 1, ae: '', dQ: 'past'},
					{df: 'Tense', bR: '-la', di: 'PST.F', du: 1, ae: '', dQ: 'past'},
					{df: 'Tense', bR: '-lo', di: 'PST.N', du: 1, ae: '', dQ: 'past'},
					{df: 'Tense', bR: '-li', di: 'PST.PL', du: 1, ae: '', dQ: 'past'},
					{df: 'Tense', bR: 'bu-', di: 'FUT', du: 0, ae: '', dQ: 'future'}
				]),
			cy: _List_fromArray(
				[
					{cg: '_C', aq: 'v becomes f before voiceless consonants', I: 'Voicing Assimilation', dH: 'f', dJ: 0, dO: 'v'},
					{cg: '_i', aq: 't becomes palatalized before i', I: 'Consonant Palatalization', dH: 'tʲ', dJ: 0, dO: 't'},
					{cg: '_i', aq: 'd becomes palatalized before i', I: 'Consonant Palatalization', dH: 'dʲ', dJ: 0, dO: 'd'},
					{cg: '', aq: 'o reduces to a in unstressed positions', I: 'Vowel Reduction', dH: 'a', dJ: 1, dO: 'o'},
					{cg: '_C#', aq: 'final e may delete after consonant', I: 'Yer deletion', dH: '', dJ: 1, dO: 'e'},
					{cg: '_e', aq: 'k becomes palatalized before e', I: 'Stem-final consonant softening', dH: 'kʲ', dJ: 0, dO: 'k'},
					{cg: '_i', aq: 'k becomes palatalized before i', I: 'Stem-final consonant softening', dH: 'kʲ', dJ: 0, dO: 'k'}
				]),
			cC: _List_Nil
		},
		dE: {
			ce: _List_fromArray(
				[
					{
					dp: 'C',
					I: 'Consonants',
					dM: _List_fromArray(
						['p', 'b', 't', 'd', 'k', 'g', 'f', 'v', 's', 'z', 'ts', 'tʃ', 'ʃ', 'ʒ', 'x', 'm', 'n', 'l', 'r', 'j']),
					ae: ''
				},
					{
					dp: 'P',
					I: 'PalatalizedConsonants',
					dM: _List_fromArray(
						['pʲ', 'bʲ', 'tʲ', 'dʲ', 'kʲ', 'gʲ', 'fʲ', 'vʲ', 'sʲ', 'zʲ', 'mʲ', 'nʲ', 'lʲ', 'rʲ']),
					ae: ''
				},
					{
					dp: 'V',
					I: 'Vowels',
					dM: _List_fromArray(
						['a', 'e', 'i', 'o', 'u', 'ɨ']),
					ae: ''
				},
					{
					dp: 'T',
					I: 'Stops',
					dM: _List_fromArray(
						['p', 'b', 't', 'd', 'k', 'g']),
					ae: ''
				},
					{
					dp: 'F',
					I: 'Fricatives',
					dM: _List_fromArray(
						['f', 'v', 's', 'z', 'ʃ', 'ʒ', 'x']),
					ae: ''
				},
					{
					dp: 'A',
					I: 'Affricates',
					dM: _List_fromArray(
						['ts', 'tʃ']),
					ae: ''
				},
					{
					dp: 'N',
					I: 'Nasals',
					dM: _List_fromArray(
						['m', 'n']),
					ae: ''
				},
					{
					dp: 'L',
					I: 'Liquids',
					dM: _List_fromArray(
						['l', 'r']),
					ae: ''
				},
					{
					dp: 'G',
					I: 'Glides',
					dM: _List_fromArray(
						['j']),
					ae: ''
				}
				]),
			c8: _List_fromArray(
				[
					{c7: 0, aq: 'Illegal cluster: *tl', dL: 'tl'},
					{c7: 0, aq: 'Illegal cluster: *dl', dL: 'dl'},
					{c7: 0, aq: 'Illegal cluster: *pb', dL: 'pb'},
					{c7: 0, aq: 'Illegal cluster: *bp', dL: 'bp'},
					{c7: 0, aq: 'Illegal cluster: *td', dL: 'td'},
					{c7: 0, aq: 'Illegal cluster: *dt', dL: 'dt'},
					{c7: 0, aq: 'Illegal cluster: *kg', dL: 'kg'},
					{c7: 0, aq: 'Illegal cluster: *gk', dL: 'gk'},
					{c7: 0, aq: 'Illegal cluster: *fv', dL: 'fv'},
					{c7: 0, aq: 'Illegal cluster: *vf', dL: 'vf'},
					{c7: 0, aq: 'Illegal cluster: *sz', dL: 'sz'},
					{c7: 0, aq: 'Illegal cluster: *zs', dL: 'zs'},
					{c7: 0, aq: 'Illegal cluster: *ʃʒ', dL: 'ʃʒ'},
					{c7: 0, aq: 'Illegal cluster: *ʒʃ', dL: 'ʒʃ'},
					{c7: 0, aq: 'Illegal cluster: *tʃʒ', dL: 'tʃʒ'},
					{c7: 0, aq: 'Illegal cluster: *nm', dL: 'nm'},
					{c7: 0, aq: 'Illegal cluster: *mn', dL: 'mn'},
					{c7: 0, aq: 'Illegal cluster: *lr', dL: 'lr'},
					{c7: 0, aq: 'Illegal cluster: *rl', dL: 'rl'},
					{c7: 0, aq: 'Illegal cluster: *fm', dL: 'fm'},
					{c7: 0, aq: 'Illegal cluster: *vm', dL: 'vm'},
					{c7: 0, aq: 'Illegal cluster: *xm', dL: 'xm'},
					{c7: 0, aq: 'Illegal cluster: *xn', dL: 'xn'},
					{c7: 0, aq: 'Illegal cluster: *fn', dL: 'fn'},
					{c7: 0, aq: 'Illegal cluster: *vn', dL: 'vn'},
					{c7: 0, aq: 'Illegal cluster: *ʃm', dL: 'ʃm'},
					{c7: 0, aq: 'Illegal cluster: *ʃn', dL: 'ʃn'},
					{c7: 0, aq: 'Illegal cluster: *ʒm', dL: 'ʒm'},
					{c7: 0, aq: 'Illegal cluster: *ʒn', dL: 'ʒn'},
					{c7: 0, aq: 'Illegal cluster: *tʃm', dL: 'tʃm'},
					{c7: 0, aq: 'Illegal cluster: *tʃn', dL: 'tʃn'},
					{c7: 0, aq: 'Illegal cluster: *xl', dL: 'xl'},
					{c7: 0, aq: 'Illegal cluster: *xr', dL: 'xr'},
					{c7: 0, aq: 'Illegal cluster: *ʃl', dL: 'ʃl'},
					{c7: 0, aq: 'Illegal cluster: *ʒl', dL: 'ʒl'},
					{c7: 0, aq: 'Illegal cluster: *tʃl', dL: 'tʃl'},
					{c7: 0, aq: 'Illegal cluster: *fl', dL: 'fl'},
					{c7: 0, aq: 'Illegal cluster: *vl', dL: 'vl'},
					{c7: 0, aq: 'Illegal cluster: *ŋk', dL: 'ŋk'},
					{c7: 0, aq: 'Illegal cluster: *ŋg', dL: 'ŋg'},
					{c7: 2, aq: 'ŋ not allowed in syllable onset', dL: 'ŋ'},
					{c7: 2, aq: 'ts restricted in certain onset positions', dL: 'ts'},
					{c7: 3, aq: 'h not allowed in syllable coda', dL: 'h'},
					{c7: 3, aq: 'x restricted in certain coda positions', dL: 'x'},
					{c7: 4, aq: 'ŋ not allowed word-initially', dL: 'ŋ'},
					{c7: 4, aq: 'r rare word-initially in Russian', dL: 'r'},
					{c7: 5, aq: 'j not allowed word-finally', dL: 'j'}
				]),
			da: _List_Nil,
			cA: {
				cj: 0,
				cq: _List_fromArray(
					[
						{cg: '', aq: 'voiceless bilabial stop', dj: 'p', dD: 'p'},
						{cg: '', aq: 'voiced bilabial stop', dj: 'b', dD: 'b'},
						{cg: '', aq: 'voiceless alveolar stop', dj: 't', dD: 't'},
						{cg: '', aq: 'voiced alveolar stop', dj: 'd', dD: 'd'},
						{cg: '', aq: 'voiceless velar stop', dj: 'k', dD: 'k'},
						{cg: '', aq: 'voiced velar stop', dj: 'g', dD: 'g'},
						{cg: '', aq: 'voiceless labiodental fricative', dj: 'f', dD: 'f'},
						{cg: '', aq: 'voiced labiodental fricative', dj: 'v', dD: 'v'},
						{cg: '', aq: 'voiceless alveolar fricative', dj: 's', dD: 's'},
						{cg: '', aq: 'voiced alveolar fricative', dj: 'z', dD: 'z'},
						{cg: '', aq: 'voiceless alveolar affricate', dj: 'c', dD: 'ts'},
						{cg: '', aq: 'voiceless postalveolar affricate', dj: 'ch', dD: 'tʃ'},
						{cg: '', aq: 'voiceless postalveolar fricative', dj: 'sh', dD: 'ʃ'},
						{cg: '', aq: 'voiced postalveolar fricative', dj: 'zh', dD: 'ʒ'},
						{cg: '', aq: 'voiceless velar fricative', dj: 'kh', dD: 'x'},
						{cg: '', aq: 'bilabial nasal', dj: 'm', dD: 'm'},
						{cg: '', aq: 'alveolar nasal', dj: 'n', dD: 'n'},
						{cg: '', aq: 'alveolar lateral approximant', dj: 'l', dD: 'l'},
						{cg: '', aq: 'alveolar trill', dj: 'r', dD: 'r'},
						{cg: '', aq: 'palatal approximant', dj: 'y', dD: 'j'},
						{cg: '', aq: 'palatalized voiceless bilabial stop', dj: 'pj', dD: 'pʲ'},
						{cg: '', aq: 'palatalized voiced bilabial stop', dj: 'bj', dD: 'bʲ'},
						{cg: '', aq: 'palatalized voiceless alveolar stop', dj: 'tj', dD: 'tʲ'},
						{cg: '', aq: 'palatalized voiced alveolar stop', dj: 'dj', dD: 'dʲ'},
						{cg: '', aq: 'palatalized voiceless velar stop', dj: 'kj', dD: 'kʲ'},
						{cg: '', aq: 'palatalized voiced velar stop', dj: 'gj', dD: 'gʲ'},
						{cg: '', aq: 'palatalized voiceless labiodental fricative', dj: 'fj', dD: 'fʲ'},
						{cg: '', aq: 'palatalized voiced labiodental fricative', dj: 'vj', dD: 'vʲ'},
						{cg: '', aq: 'palatalized voiceless alveolar fricative', dj: 'sj', dD: 'sʲ'},
						{cg: '', aq: 'palatalized voiced alveolar fricative', dj: 'zj', dD: 'zʲ'},
						{cg: '', aq: 'palatalized bilabial nasal', dj: 'mj', dD: 'mʲ'},
						{cg: '', aq: 'palatalized alveolar nasal', dj: 'nj', dD: 'nʲ'},
						{cg: '', aq: 'palatalized alveolar lateral approximant', dj: 'lj', dD: 'lʲ'},
						{cg: '', aq: 'palatalized alveolar trill', dj: 'rj', dD: 'rʲ'},
						{cg: '', aq: 'open front unrounded vowel', dj: 'a', dD: 'a'},
						{cg: '', aq: 'close-mid front unrounded vowel', dj: 'e', dD: 'e'},
						{cg: '', aq: 'close front unrounded vowel', dj: 'i', dD: 'i'},
						{cg: '', aq: 'close-mid back rounded vowel', dj: 'o', dD: 'o'},
						{cg: '', aq: 'close back rounded vowel', dj: 'u', dD: 'u'},
						{cg: '', aq: 'close central unrounded vowel', dj: 'y', dD: 'ɨ'}
					])
			},
			dC: _List_fromArray(
				[
					{I: 'V', dB: 'V'},
					{I: 'CV', dB: 'CV'},
					{I: 'PV', dB: 'PV'},
					{I: 'CVC', dB: 'CVC'},
					{I: 'PVC', dB: 'PVC'},
					{I: 'CVCC', dB: 'CVCC'},
					{I: 'CCV', dB: 'CCV'},
					{I: 'CCVC', dB: 'CCVC'},
					{I: 'CCVCC', dB: 'CCVCC'},
					{I: 'VC', dB: 'VC'},
					{I: 'VCC', dB: 'VCC'},
					{I: 'LV', dB: 'LV'},
					{I: 'NV', dB: 'NV'}
				])
		},
		ae: ''
	},
	I: 'Russian-inspired'
};
var $author$project$Templates$availableTemplates = _List_fromArray(
	[$author$project$Templates$quenyaTemplate, $author$project$Templates$englishTemplate, $author$project$Templates$russianTemplate]);
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$UpdateHelpers$constraintTypeToDescription = F2(
	function (constraintType, sequence) {
		switch (constraintType) {
			case 0:
				return 'Illegal cluster: *' + sequence;
			case 1:
				return 'Legal cluster pattern: ' + sequence;
			case 2:
				return 'Not allowed in onset: ' + sequence;
			case 3:
				return 'Not allowed in coda: ' + sequence;
			case 4:
				return 'Not allowed word-initially: ' + sequence;
			default:
				return 'Not allowed word-finally: ' + sequence;
		}
	});
var $author$project$Types$LanguageFamily = F6(
	function (id, uuid, name, description, parentFamilyUuid, projectUuids) {
		return {aq: description, bn: id, I: name, dA: parentFamilyUuid, dG: projectUuids, ae: uuid};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$json$Json$Decode$map6 = _Json_map6;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $author$project$JsonCodec$decodeLanguageFamily = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Types$LanguageFamily,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'uuid', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'parentFamilyUuid',
				$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string)),
				A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$map($elm$core$String$fromInt),
				A2(
					$elm$json$Json$Decode$field,
					'parentFamilyId',
					$elm$json$Json$Decode$nullable($elm$json$Json$Decode$int))),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'projectUuids',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $author$project$Types$LanguageProject = F3(
	function (uuid, name, description) {
		return {aq: description, I: name, ae: uuid};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$JsonCodec$decodeLanguageProject = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Types$LanguageProject,
	A2($elm$json$Json$Decode$field, 'uuid', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string));
var $author$project$Types$Project = F5(
	function (id, name, created, lastModified, language) {
		return {ch: created, bn: id, ct: language, cu: lastModified, I: name};
	});
var $author$project$Types$Language = F6(
	function (uuid, phonology, morphology, lexicon, generatedWords, languageFamilyUuid) {
		return {dh: generatedWords, dq: languageFamilyUuid, dt: lexicon, dv: morphology, dE: phonology, ae: uuid};
	});
var $author$project$Types$Lexeme = F9(
	function (uuid, form, orthography, definition, pos, etymology, semanticLinks, categories, morphemes) {
		return {ce: categories, c9: definition, dc: etymology, bR: form, bV: morphemes, cA: orthography, cG: pos, dK: semanticLinks, ae: uuid};
	});
var $author$project$JsonCodec$andMap = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $author$project$Types$Etymology = F2(
	function (text, philology) {
		return {bZ: philology, cb: text};
	});
var $author$project$Types$PhilologyLink = F3(
	function (languageUuid, lexemeUuid, note) {
		return {dr: languageUuid, ds: lexemeUuid, dw: note};
	});
var $author$project$JsonCodec$philologyLinkDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Types$PhilologyLink,
	A2($elm$json$Json$Decode$field, 'languageUuid', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'lexemeUuid', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'note', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])));
var $author$project$JsonCodec$etymologyDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$Etymology,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'text', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'philology',
				$elm$json$Json$Decode$list($author$project$JsonCodec$philologyLinkDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $author$project$JsonCodec$removeSyllableSeparators = function (word) {
	return A3($elm$core$String$replace, '.', '', word);
};
var $author$project$Types$SemanticLinks = F3(
	function (synonyms, antonyms, related) {
		return {cd: antonyms, cM: related, cS: synonyms};
	});
var $author$project$JsonCodec$semanticLinksDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Types$SemanticLinks,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'synonyms',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'antonyms',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'related',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $author$project$JsonCodec$lexemeDecoder = A2(
	$author$project$JsonCodec$andMap,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'morphemes',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	A2(
		$author$project$JsonCodec$andMap,
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$field,
					'categories',
					$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
					$elm$json$Json$Decode$succeed(_List_Nil)
				])),
		A2(
			$author$project$JsonCodec$andMap,
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2($elm$json$Json$Decode$field, 'semanticLinks', $author$project$JsonCodec$semanticLinksDecoder),
						$elm$json$Json$Decode$succeed(
						{cd: _List_Nil, cM: _List_Nil, cS: _List_Nil})
					])),
			A2(
				$author$project$JsonCodec$andMap,
				$elm$json$Json$Decode$oneOf(
					_List_fromArray(
						[
							A2($elm$json$Json$Decode$field, 'etymology', $author$project$JsonCodec$etymologyDecoder),
							A2(
							$elm$json$Json$Decode$map,
							function (text) {
								return {bZ: _List_Nil, cb: text};
							},
							A2($elm$json$Json$Decode$field, 'etymology', $elm$json$Json$Decode$string)),
							$elm$json$Json$Decode$succeed(
							{bZ: _List_Nil, cb: ''})
						])),
				A2(
					$author$project$JsonCodec$andMap,
					A2($elm$json$Json$Decode$field, 'pos', $elm$json$Json$Decode$string),
					A2(
						$author$project$JsonCodec$andMap,
						A2($elm$json$Json$Decode$field, 'definition', $elm$json$Json$Decode$string),
						A2(
							$author$project$JsonCodec$andMap,
							$elm$json$Json$Decode$oneOf(
								_List_fromArray(
									[
										A2($elm$json$Json$Decode$field, 'orthography', $elm$json$Json$Decode$string),
										A2(
										$elm$json$Json$Decode$map,
										$author$project$JsonCodec$removeSyllableSeparators,
										A2($elm$json$Json$Decode$field, 'form', $elm$json$Json$Decode$string))
									])),
							A2(
								$author$project$JsonCodec$andMap,
								A2($elm$json$Json$Decode$field, 'form', $elm$json$Json$Decode$string),
								A2(
									$author$project$JsonCodec$andMap,
									$elm$json$Json$Decode$oneOf(
										_List_fromArray(
											[
												A2($elm$json$Json$Decode$field, 'uuid', $elm$json$Json$Decode$string),
												$elm$json$Json$Decode$succeed('')
											])),
									$elm$json$Json$Decode$succeed($author$project$Types$Lexeme))))))))));
var $author$project$JsonCodec$listToLexiconDict = function (lexemes) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (lexeme, acc) {
				return A3($elm$core$Dict$insert, lexeme.ae, lexeme, acc);
			}),
		$elm$core$Dict$empty,
		lexemes);
};
var $author$project$Types$Morphology = F4(
	function (features, morphemes, paradigms, morphophonemicRules) {
		return {bQ: features, bV: morphemes, cy: morphophonemicRules, cC: paradigms};
	});
var $author$project$Types$GrammaticalFeature = F3(
	function (uuid, name, values) {
		return {I: name, ae: uuid, dR: values};
	});
var $author$project$JsonCodec$grammaticalFeatureDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Types$GrammaticalFeature,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'uuid', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'values',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Types$Morpheme = F6(
	function (uuid, form, gloss, morphemeType, feature, value) {
		return {df: feature, bR: form, di: gloss, du: morphemeType, ae: uuid, dQ: value};
	});
var $author$project$Types$Infix = 2;
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$JsonCodec$morphemeTypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Prefix':
				return $elm$json$Json$Decode$succeed(0);
			case 'Suffix':
				return $elm$json$Json$Decode$succeed(1);
			case 'Infix':
				return $elm$json$Json$Decode$succeed(2);
			case 'Circumfix':
				return $elm$json$Json$Decode$succeed(3);
			default:
				return $elm$json$Json$Decode$fail('Unknown morpheme type: ' + str);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$JsonCodec$morphemeDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Types$Morpheme,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'uuid', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'form', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'gloss', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'morphemeType', $author$project$JsonCodec$morphemeTypeDecoder),
	A2($elm$json$Json$Decode$field, 'feature', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string));
var $author$project$Types$MorphophonemicRule = F6(
	function (name, ruleType, context, target, replacement, description) {
		return {cg: context, aq: description, I: name, dH: replacement, dJ: ruleType, dO: target};
	});
var $author$project$Types$ConsonantGradation = 3;
var $author$project$JsonCodec$ruleTypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'Assimilation':
				return $elm$json$Json$Decode$succeed(0);
			case 'Dissimilation':
				return $elm$json$Json$Decode$succeed(1);
			case 'VowelHarmony':
				return $elm$json$Json$Decode$succeed(2);
			case 'ConsonantGradation':
				return $elm$json$Json$Decode$succeed(3);
			default:
				return $elm$json$Json$Decode$fail('Unknown rule type: ' + str);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$JsonCodec$morphophonemicRuleDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Types$MorphophonemicRule,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ruleType', $author$project$JsonCodec$ruleTypeDecoder),
	A2($elm$json$Json$Decode$field, 'context', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'target', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'replacement', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string));
var $author$project$Types$Paradigm = F4(
	function (name, pos, baseForm, featureCombinations) {
		return {c3: baseForm, dg: featureCombinations, I: name, cG: pos};
	});
var $author$project$Types$FeatureCombination = F2(
	function (features, form) {
		return {bQ: features, bR: form};
	});
var $author$project$JsonCodec$featureCombinationDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$FeatureCombination,
	A2(
		$elm$json$Json$Decode$field,
		'features',
		$elm$json$Json$Decode$list(
			A2(
				$elm$json$Json$Decode$andThen,
				function (list) {
					if ((list.b && list.b.b) && (!list.b.b.b)) {
						var k = list.a;
						var _v1 = list.b;
						var v = _v1.a;
						return $elm$json$Json$Decode$succeed(
							_Utils_Tuple2(k, v));
					} else {
						return $elm$json$Json$Decode$fail('Feature must be a pair [key, value]');
					}
				},
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)))),
	A2($elm$json$Json$Decode$field, 'form', $elm$json$Json$Decode$string));
var $author$project$JsonCodec$paradigmDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Types$Paradigm,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'pos', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'baseForm', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2(
		$elm$json$Json$Decode$field,
		'featureCombinations',
		$elm$json$Json$Decode$list($author$project$JsonCodec$featureCombinationDecoder)));
var $author$project$JsonCodec$morphologyDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Types$Morphology,
	A2(
		$elm$json$Json$Decode$field,
		'features',
		$elm$json$Json$Decode$list($author$project$JsonCodec$grammaticalFeatureDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'morphemes',
		$elm$json$Json$Decode$list($author$project$JsonCodec$morphemeDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'paradigms',
		$elm$json$Json$Decode$list($author$project$JsonCodec$paradigmDecoder)),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'morphophonemicRules',
				$elm$json$Json$Decode$list($author$project$JsonCodec$morphophonemicRuleDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$JsonCodec$objectToLexiconDict = $elm$json$Json$Decode$dict($author$project$JsonCodec$lexemeDecoder);
var $author$project$Types$Phonology = F5(
	function (categories, patterns, constraints, orthography, diphthongs) {
		return {ce: categories, c8: constraints, da: diphthongs, cA: orthography, dC: patterns};
	});
var $author$project$Types$PhonotacticConstraint = F3(
	function (constraintType, sequence, description) {
		return {c7: constraintType, aq: description, dL: sequence};
	});
var $author$project$Types$LegalCluster = 1;
var $author$project$JsonCodec$constraintTypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'IllegalCluster':
				return $elm$json$Json$Decode$succeed(0);
			case 'LegalCluster':
				return $elm$json$Json$Decode$succeed(1);
			case 'OnsetRestriction':
				return $elm$json$Json$Decode$succeed(2);
			case 'CodaRestriction':
				return $elm$json$Json$Decode$succeed(3);
			case 'NoWordInitial':
				return $elm$json$Json$Decode$succeed(4);
			case 'NoWordFinal':
				return $elm$json$Json$Decode$succeed(5);
			default:
				return $elm$json$Json$Decode$fail('Unknown constraint type: ' + str);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$JsonCodec$constraintDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Types$PhonotacticConstraint,
	A2($elm$json$Json$Decode$field, 'constraintType', $author$project$JsonCodec$constraintTypeDecoder),
	A2($elm$json$Json$Decode$field, 'sequence', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Types$Orthography = F2(
	function (graphemeMappings, displayMode) {
		return {cj: displayMode, cq: graphemeMappings};
	});
var $author$project$Types$GraphemeMapping = F4(
	function (phoneme, grapheme, description, context) {
		return {cg: context, aq: description, dj: grapheme, dD: phoneme};
	});
var $author$project$JsonCodec$graphemeMappingDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Types$GraphemeMapping,
	A2($elm$json$Json$Decode$field, 'phoneme', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'grapheme', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'context', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])));
var $author$project$JsonCodec$orthographyDisplayModeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'DisplayIPA':
				return $elm$json$Json$Decode$succeed(0);
			case 'DisplayOrthography':
				return $elm$json$Json$Decode$succeed(1);
			default:
				return $elm$json$Json$Decode$succeed(0);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$JsonCodec$orthographyDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$Orthography,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'graphemeMappings',
				$elm$json$Json$Decode$list($author$project$JsonCodec$graphemeMappingDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'displayMode', $author$project$JsonCodec$orthographyDisplayModeDecoder),
				$elm$json$Json$Decode$succeed(0)
			])));
var $author$project$Types$SoundCategory = F4(
	function (uuid, name, label, sounds) {
		return {dp: label, I: name, dM: sounds, ae: uuid};
	});
var $author$project$JsonCodec$soundCategoryDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Types$SoundCategory,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'uuid', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'label',
		A2(
			$elm$json$Json$Decode$andThen,
			function (str) {
				var _v0 = $elm$core$String$uncons(str);
				if (!_v0.$) {
					var _v1 = _v0.a;
					var _char = _v1.a;
					return $elm$json$Json$Decode$succeed(_char);
				} else {
					return $elm$json$Json$Decode$fail('Empty label string');
				}
			},
			$elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'sounds',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Types$SyllablePattern = F2(
	function (name, pattern) {
		return {I: name, dB: pattern};
	});
var $author$project$JsonCodec$syllablePatternDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Types$SyllablePattern,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'pattern', $elm$json$Json$Decode$string));
var $author$project$JsonCodec$phonologyDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Types$Phonology,
	A2(
		$elm$json$Json$Decode$field,
		'categories',
		$elm$json$Json$Decode$list($author$project$JsonCodec$soundCategoryDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'patterns',
		$elm$json$Json$Decode$list($author$project$JsonCodec$syllablePatternDecoder)),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'constraints',
				$elm$json$Json$Decode$list($author$project$JsonCodec$constraintDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'orthography', $author$project$JsonCodec$orthographyDecoder),
				$elm$json$Json$Decode$succeed(
				{cj: 0, cq: _List_Nil})
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'diphthongs',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $author$project$JsonCodec$languageDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Types$Language,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'uuid', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'phonology', $author$project$JsonCodec$phonologyDecoder),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'morphology', $author$project$JsonCodec$morphologyDecoder),
				$elm$json$Json$Decode$succeed(
				{bQ: _List_Nil, bV: _List_Nil, cy: _List_Nil, cC: _List_Nil})
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'lexicon', $author$project$JsonCodec$objectToLexiconDict),
				A2(
				$elm$json$Json$Decode$field,
				'lexicon',
				A2(
					$elm$json$Json$Decode$map,
					$author$project$JsonCodec$listToLexiconDict,
					$elm$json$Json$Decode$list($author$project$JsonCodec$lexemeDecoder))),
				$elm$json$Json$Decode$succeed($elm$core$Dict$empty)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'generatedWords',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'languageFamilyUuid',
				$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string)),
				A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$map($elm$core$String$fromInt),
				A2(
					$elm$json$Json$Decode$field,
					'languageFamilyId',
					$elm$json$Json$Decode$nullable($elm$json$Json$Decode$int))),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			])));
var $author$project$JsonCodec$projectDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Types$Project,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
				$elm$json$Json$Decode$succeed(1)
			])),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'created', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'lastModified', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	A2($elm$json$Json$Decode$field, 'language', $author$project$JsonCodec$languageDecoder));
var $author$project$JsonCodec$decodeProject = $author$project$JsonCodec$projectDecoder;
var $author$project$Types$ProjectMetadata = F4(
	function (id, name, created, lastModified) {
		return {ch: created, bn: id, cu: lastModified, I: name};
	});
var $author$project$JsonCodec$decodeProjectMetadata = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Types$ProjectMetadata,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'created', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'lastModified', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Types$LanguageTemplate = F5(
	function (id, name, description, language, isDefault) {
		return {aq: description, bn: id, $7: isDefault, ct: language, I: name};
	});
var $author$project$JsonCodec$decodeTemplate = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Types$LanguageTemplate,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'language', $author$project$JsonCodec$languageDecoder),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'isDefault', $elm$json$Json$Decode$bool),
				$elm$json$Json$Decode$succeed(false)
			])));
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$deleteLanguageFamilyById = _Platform_outgoingPort('deleteLanguageFamilyById', $elm$json$Json$Encode$string);
var $author$project$Main$deleteLanguageProjectByUuid = _Platform_outgoingPort('deleteLanguageProjectByUuid', $elm$json$Json$Encode$string);
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Main$deleteProjectById = _Platform_outgoingPort('deleteProjectById', $elm$json$Json$Encode$int);
var $author$project$Main$deleteTemplateById = _Platform_outgoingPort('deleteTemplateById', $elm$json$Json$Encode$int);
var $author$project$Main$duplicateProjectById = _Platform_outgoingPort('duplicateProjectById', $elm$json$Json$Encode$int);
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$JsonCodec$encodePhilologyLink = function (link) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'languageUuid',
				$elm$json$Json$Encode$string(link.dr)),
				_Utils_Tuple2(
				'lexemeUuid',
				$elm$json$Json$Encode$string(link.ds)),
				_Utils_Tuple2(
				'note',
				$elm$json$Json$Encode$string(link.dw))
			]));
};
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$JsonCodec$encodeEtymology = function (etymology) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'text',
				$elm$json$Json$Encode$string(etymology.cb)),
				_Utils_Tuple2(
				'philology',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodePhilologyLink, etymology.bZ))
			]));
};
var $author$project$JsonCodec$encodeSemanticLinks = function (links) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'synonyms',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, links.cS)),
				_Utils_Tuple2(
				'antonyms',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, links.cd)),
				_Utils_Tuple2(
				'related',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, links.cM))
			]));
};
var $author$project$JsonCodec$encodeLexeme = function (lexeme) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				$elm$json$Json$Encode$string(lexeme.ae)),
				_Utils_Tuple2(
				'form',
				$elm$json$Json$Encode$string(lexeme.bR)),
				_Utils_Tuple2(
				'orthography',
				$elm$json$Json$Encode$string(lexeme.cA)),
				_Utils_Tuple2(
				'definition',
				$elm$json$Json$Encode$string(lexeme.c9)),
				_Utils_Tuple2(
				'pos',
				$elm$json$Json$Encode$string(lexeme.cG)),
				_Utils_Tuple2(
				'etymology',
				$author$project$JsonCodec$encodeEtymology(lexeme.dc)),
				_Utils_Tuple2(
				'semanticLinks',
				$author$project$JsonCodec$encodeSemanticLinks(lexeme.dK)),
				_Utils_Tuple2(
				'categories',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, lexeme.ce)),
				_Utils_Tuple2(
				'morphemes',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, lexeme.bV))
			]));
};
var $author$project$JsonCodec$encodeLexiconDict = function (lexiconDict) {
	return $elm$json$Json$Encode$object(
		A2(
			$elm$core$List$map,
			function (_v0) {
				var uuid = _v0.a;
				var lexeme = _v0.b;
				return _Utils_Tuple2(
					uuid,
					$author$project$JsonCodec$encodeLexeme(lexeme));
			},
			$elm$core$Dict$toList(lexiconDict)));
};
var $author$project$JsonCodec$encodeGrammaticalFeature = function (feature) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				$elm$json$Json$Encode$string(feature.ae)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(feature.I)),
				_Utils_Tuple2(
				'values',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, feature.dR))
			]));
};
var $author$project$JsonCodec$encodeMorphemeType = function (morphemeType) {
	return $elm$json$Json$Encode$string(
		function () {
			switch (morphemeType) {
				case 0:
					return 'Prefix';
				case 1:
					return 'Suffix';
				case 2:
					return 'Infix';
				default:
					return 'Circumfix';
			}
		}());
};
var $author$project$JsonCodec$encodeMorpheme = function (morpheme) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				$elm$json$Json$Encode$string(morpheme.ae)),
				_Utils_Tuple2(
				'form',
				$elm$json$Json$Encode$string(morpheme.bR)),
				_Utils_Tuple2(
				'gloss',
				$elm$json$Json$Encode$string(morpheme.di)),
				_Utils_Tuple2(
				'morphemeType',
				$author$project$JsonCodec$encodeMorphemeType(morpheme.du)),
				_Utils_Tuple2(
				'feature',
				$elm$json$Json$Encode$string(morpheme.df)),
				_Utils_Tuple2(
				'value',
				$elm$json$Json$Encode$string(morpheme.dQ))
			]));
};
var $author$project$JsonCodec$encodeRuleType = function (ruleType) {
	return $elm$json$Json$Encode$string(
		function () {
			switch (ruleType) {
				case 0:
					return 'Assimilation';
				case 1:
					return 'Dissimilation';
				case 2:
					return 'VowelHarmony';
				default:
					return 'ConsonantGradation';
			}
		}());
};
var $author$project$JsonCodec$encodeMorphophonemicRule = function (rule) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(rule.I)),
				_Utils_Tuple2(
				'ruleType',
				$author$project$JsonCodec$encodeRuleType(rule.dJ)),
				_Utils_Tuple2(
				'context',
				$elm$json$Json$Encode$string(rule.cg)),
				_Utils_Tuple2(
				'target',
				$elm$json$Json$Encode$string(rule.dO)),
				_Utils_Tuple2(
				'replacement',
				$elm$json$Json$Encode$string(rule.dH)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(rule.aq))
			]));
};
var $author$project$JsonCodec$encodeFeatureCombination = function (combination) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'features',
				A2(
					$elm$json$Json$Encode$list,
					function (_v0) {
						var k = _v0.a;
						var v = _v0.b;
						return A2(
							$elm$json$Json$Encode$list,
							$elm$json$Json$Encode$string,
							_List_fromArray(
								[k, v]));
					},
					combination.bQ)),
				_Utils_Tuple2(
				'form',
				$elm$json$Json$Encode$string(combination.bR))
			]));
};
var $author$project$JsonCodec$encodeParadigm = function (paradigm) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(paradigm.I)),
				_Utils_Tuple2(
				'pos',
				$elm$json$Json$Encode$string(paradigm.cG)),
				_Utils_Tuple2(
				'baseForm',
				$elm$json$Json$Encode$string(paradigm.c3)),
				_Utils_Tuple2(
				'featureCombinations',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeFeatureCombination, paradigm.dg))
			]));
};
var $author$project$JsonCodec$encodeMorphology = function (morphology) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'features',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeGrammaticalFeature, morphology.bQ)),
				_Utils_Tuple2(
				'morphemes',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeMorpheme, morphology.bV)),
				_Utils_Tuple2(
				'paradigms',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeParadigm, morphology.cC)),
				_Utils_Tuple2(
				'morphophonemicRules',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeMorphophonemicRule, morphology.cy))
			]));
};
var $author$project$JsonCodec$encodeConstraintType = function (constraintType) {
	return $elm$json$Json$Encode$string(
		function () {
			switch (constraintType) {
				case 0:
					return 'IllegalCluster';
				case 1:
					return 'LegalCluster';
				case 2:
					return 'OnsetRestriction';
				case 3:
					return 'CodaRestriction';
				case 4:
					return 'NoWordInitial';
				default:
					return 'NoWordFinal';
			}
		}());
};
var $author$project$JsonCodec$encodeConstraint = function (constraint) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'constraintType',
				$author$project$JsonCodec$encodeConstraintType(constraint.c7)),
				_Utils_Tuple2(
				'sequence',
				$elm$json$Json$Encode$string(constraint.dL)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(constraint.aq))
			]));
};
var $author$project$JsonCodec$encodeGraphemeMapping = function (mapping) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'phoneme',
				$elm$json$Json$Encode$string(mapping.dD)),
				_Utils_Tuple2(
				'grapheme',
				$elm$json$Json$Encode$string(mapping.dj)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(mapping.aq)),
				_Utils_Tuple2(
				'context',
				$elm$json$Json$Encode$string(mapping.cg))
			]));
};
var $author$project$JsonCodec$encodeOrthographyDisplayMode = function (mode) {
	return $elm$json$Json$Encode$string(
		function () {
			if (!mode) {
				return 'DisplayIPA';
			} else {
				return 'DisplayOrthography';
			}
		}());
};
var $author$project$JsonCodec$encodeOrthography = function (orthography) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'graphemeMappings',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeGraphemeMapping, orthography.cq)),
				_Utils_Tuple2(
				'displayMode',
				$author$project$JsonCodec$encodeOrthographyDisplayMode(orthography.cj))
			]));
};
var $author$project$JsonCodec$encodeSoundCategory = function (category) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				$elm$json$Json$Encode$string(category.ae)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(category.I)),
				_Utils_Tuple2(
				'label',
				$elm$json$Json$Encode$string(
					$elm$core$String$fromChar(category.dp))),
				_Utils_Tuple2(
				'sounds',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, category.dM))
			]));
};
var $author$project$JsonCodec$encodeSyllablePattern = function (pattern) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(pattern.I)),
				_Utils_Tuple2(
				'pattern',
				$elm$json$Json$Encode$string(pattern.dB))
			]));
};
var $author$project$JsonCodec$encodePhonology = function (phonology) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'categories',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeSoundCategory, phonology.ce)),
				_Utils_Tuple2(
				'patterns',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeSyllablePattern, phonology.dC)),
				_Utils_Tuple2(
				'constraints',
				A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeConstraint, phonology.c8)),
				_Utils_Tuple2(
				'orthography',
				$author$project$JsonCodec$encodeOrthography(phonology.cA)),
				_Utils_Tuple2(
				'diphthongs',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, phonology.da))
			]));
};
var $author$project$JsonCodec$encodeLanguage = function (language) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				$elm$json$Json$Encode$string(language.ae)),
				_Utils_Tuple2(
				'phonology',
				$author$project$JsonCodec$encodePhonology(language.dE)),
				_Utils_Tuple2(
				'morphology',
				$author$project$JsonCodec$encodeMorphology(language.dv)),
				_Utils_Tuple2(
				'lexicon',
				$author$project$JsonCodec$encodeLexiconDict(language.dt)),
				_Utils_Tuple2(
				'generatedWords',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, language.dh)),
				_Utils_Tuple2(
				'languageFamilyUuid',
				function () {
					var _v0 = language.dq;
					if (!_v0.$) {
						var uuid = _v0.a;
						return $elm$json$Json$Encode$string(uuid);
					} else {
						return $elm$json$Json$Encode$null;
					}
				}())
			]));
};
var $author$project$JsonCodec$encodeProject = function (project) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(project.bn)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(project.I)),
				_Utils_Tuple2(
				'created',
				$elm$json$Json$Encode$string(project.ch)),
				_Utils_Tuple2(
				'lastModified',
				$elm$json$Json$Encode$string(project.cu)),
				_Utils_Tuple2(
				'language',
				$author$project$JsonCodec$encodeLanguage(project.ct))
			]));
};
var $author$project$JsonCodec$encodeExport = F2(
	function (timestamp, project) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'clctk_version',
					$elm$json$Json$Encode$string('0.1.0')),
					_Utils_Tuple2(
					'export_date',
					$elm$json$Json$Encode$string(timestamp)),
					_Utils_Tuple2(
					'project',
					$author$project$JsonCodec$encodeProject(project))
				]));
	});
var $author$project$JsonCodec$encodeLanguageFamily = function (family) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(family.bn)),
				_Utils_Tuple2(
				'uuid',
				$elm$json$Json$Encode$string(family.ae)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(family.I)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(family.aq)),
				_Utils_Tuple2(
				'parentFamilyUuid',
				function () {
					var _v0 = family.dA;
					if (!_v0.$) {
						var uuid = _v0.a;
						return $elm$json$Json$Encode$string(uuid);
					} else {
						return $elm$json$Json$Encode$null;
					}
				}()),
				_Utils_Tuple2(
				'projectUuids',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, family.dG))
			]));
};
var $author$project$JsonCodec$encodeLanguageProject = function (project) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuid',
				$elm$json$Json$Encode$string(project.ae)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(project.I)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(project.aq))
			]));
};
var $author$project$JsonCodec$encodeTabSections = function (tabSections) {
	return $elm$json$Json$Encode$object(
		A2(
			$elm$core$List$map,
			function (_v0) {
				var k = _v0.a;
				var v = _v0.b;
				return _Utils_Tuple2(
					k,
					$elm$json$Json$Encode$string(v));
			},
			$elm$core$Dict$toList(tabSections)));
};
var $author$project$JsonCodec$encodeTemplate = function (template) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(template.bn)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(template.I)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(template.aq)),
				_Utils_Tuple2(
				'isDefault',
				$elm$json$Json$Encode$bool(template.$7)),
				_Utils_Tuple2(
				'language',
				$author$project$JsonCodec$encodeLanguage(template.ct))
			]));
};
var $elm$core$String$foldl = _String_foldl;
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $author$project$UUIDHelpers$generateDeterministicUUID = function (seed) {
	var hash = A3(
		$elm$core$String$foldl,
		F2(
			function (_char, acc) {
				return A2(
					$elm$core$Basics$modBy,
					2147483647,
					(acc * 31) + $elm$core$Char$toCode(_char));
			}),
		0,
		seed);
	var part1 = A3(
		$elm$core$String$padLeft,
		8,
		'0',
		$elm$core$String$fromInt(
			A2($elm$core$Basics$modBy, 100000000, hash)));
	var part2 = A3(
		$elm$core$String$padLeft,
		4,
		'0',
		$elm$core$String$fromInt(
			A2($elm$core$Basics$modBy, 10000, (hash / 100) | 0)));
	var part3 = '4' + A3(
		$elm$core$String$padLeft,
		3,
		'0',
		$elm$core$String$fromInt(
			A2($elm$core$Basics$modBy, 1000, (hash / 10000) | 0)));
	var part4 = A3(
		$elm$core$String$padLeft,
		4,
		'0',
		$elm$core$String$fromInt(
			A2($elm$core$Basics$modBy, 10000, (hash / 100000) | 0)));
	var part5 = A3(
		$elm$core$String$padLeft,
		12,
		'0',
		$elm$core$String$fromInt(
			A2($elm$core$Basics$modBy, 1000000000000, (hash / 1000000) | 0)));
	return part1 + ('-' + (part2 + ('-' + (part3 + ('-' + (part4 + ('-' + part5)))))));
};
var $author$project$UUIDHelpers$ensureLanguageFamilyUUID = function (family) {
	return $elm$core$String$isEmpty(family.ae) ? _Utils_update(
		family,
		{
			ae: $author$project$UUIDHelpers$generateDeterministicUUID(
				'family-' + ($elm$core$String$fromInt(family.bn) + ('-' + family.I)))
		}) : family;
};
var $author$project$Main$exportCSV = _Platform_outgoingPort('exportCSV', $elm$json$Json$Encode$string);
var $author$project$Main$exportProject = _Platform_outgoingPort('exportProject', $elm$core$Basics$identity);
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$Main$findUniqueLabel = F2(
	function (categoryName, existingCategories) {
		var nameLetters = A2(
			$elm$core$List$filter,
			$elm$core$Char$isAlpha,
			$elm$core$String$toList(
				$elm$core$String$toUpper(categoryName)));
		var existingLabels = _Utils_ap(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.dp;
				},
				existingCategories),
			_List_fromArray(
				['C', 'V']));
		var uniqueFromName = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (c) {
					return !A2($elm$core$List$member, c, existingLabels);
				},
				nameLetters));
		var allLetters = A2(
			$elm$core$List$map,
			$elm$core$Char$fromCode,
			A2($elm$core$List$range, 65, 90));
		var anyUnused = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (c) {
					return !A2($elm$core$List$member, c, existingLabels);
				},
				allLetters));
		if (!uniqueFromName.$) {
			var letter = uniqueFromName.a;
			return letter;
		} else {
			if (!anyUnused.$) {
				var letter = anyUnused.a;
				return letter;
			} else {
				return 'X';
			}
		}
	});
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $author$project$MorphologyHelpers$generateFeatureCombinations = function (features) {
	if (!features.b) {
		return _List_fromArray(
			[_List_Nil]);
	} else {
		var first = features.a;
		var rest = features.b;
		var restCombinations = $author$project$MorphologyHelpers$generateFeatureCombinations(rest);
		var firstValues = A2(
			$elm$core$List$map,
			function (v) {
				return _Utils_Tuple2(first.I, v);
			},
			first.dR);
		return A2(
			$elm$core$List$concatMap,
			function (restCombo) {
				return A2(
					$elm$core$List$map,
					function (fv) {
						return A2($elm$core$List$cons, fv, restCombo);
					},
					firstValues);
			},
			restCombinations);
	}
};
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$MorphologyHelpers$generateInflectedForm = F4(
	function (baseForm, features, morphemes, rules) {
		if ($elm$core$String$isEmpty(
			$elm$core$String$trim(baseForm))) {
			return '';
		} else {
			var matchingMorphemes = A2(
				$elm$core$List$sortBy,
				function (m) {
					var _v1 = m.du;
					switch (_v1) {
						case 0:
							return 1;
						case 2:
							return 2;
						case 1:
							return 3;
						default:
							return 4;
					}
				},
				A2(
					$elm$core$List$filter,
					function (morpheme) {
						return A2(
							$elm$core$List$any,
							function (_v0) {
								var featureName = _v0.a;
								var featureValue = _v0.b;
								return _Utils_eq(morpheme.df, featureName) && _Utils_eq(morpheme.dQ, featureValue);
							},
							features);
					},
					morphemes));
			var formWithMorphemes = A3($elm$core$List$foldl, $author$project$MorphologyHelpers$applyMorpheme, baseForm, matchingMorphemes);
			var finalForm = A2($author$project$MorphologyHelpers$applyMorphophonemicRules, rules, formWithMorphemes);
			return finalForm;
		}
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $author$project$WordGeneration$addNgram = F2(
	function (_v0, model) {
		var prefix = _v0.a;
		var nextChar = _v0.b;
		return A3(
			$elm$core$Dict$update,
			prefix,
			function (maybeList) {
				if (!maybeList.$) {
					var list = maybeList.a;
					return $elm$core$Maybe$Just(
						A2($elm$core$List$cons, nextChar, list));
				} else {
					return $elm$core$Maybe$Just(
						_List_fromArray(
							[nextChar]));
				}
			},
			model);
	});
var $author$project$WordGeneration$extractNgrams = F2(
	function (order, word) {
		var chars = $elm$core$String$toList(word);
		var length = $elm$core$List$length(chars);
		return A2(
			$elm$core$List$filterMap,
			function (i) {
				var prefix = $elm$core$String$fromList(
					A2(
						$elm$core$List$take,
						order,
						A2($elm$core$List$drop, i, chars)));
				var nextChar = A2(
					$elm$core$Maybe$map,
					$elm$core$String$fromChar,
					$elm$core$List$head(
						A2($elm$core$List$drop, i + order, chars)));
				return A2(
					$elm$core$Maybe$map,
					function (nc) {
						return _Utils_Tuple2(prefix, nc);
					},
					nextChar);
			},
			A2($elm$core$List$range, 0, (length - order) - 1));
	});
var $author$project$WordGeneration$buildNgramModel = F2(
	function (order, words) {
		var markedWords = A2(
			$elm$core$List$map,
			function (w) {
				return '^' + (w + '$');
			},
			words);
		return A3(
			$elm$core$List$foldl,
			$author$project$WordGeneration$addNgram,
			$elm$core$Dict$empty,
			A2(
				$elm$core$List$concatMap,
				$author$project$WordGeneration$extractNgrams(order),
				markedWords));
	});
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0;
		return function (seed) {
			var _v1 = genA(seed);
			var result = _v1.a;
			var newSeed = _v1.b;
			var _v2 = callback(result);
			var genB = _v2;
			return genB(newSeed);
		};
	});
var $elm$random$Random$constant = function (value) {
	return function (seed) {
		return _Utils_Tuple2(value, seed);
	};
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$WordGeneration$randomFromList = function (list) {
	return $elm$core$List$isEmpty(list) ? $elm$random$Random$constant('') : A2(
		$elm$random$Random$map,
		function (index) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$elm$core$List$head(
					A2($elm$core$List$drop, index, list)));
		},
		A2(
			$elm$random$Random$int,
			0,
			$elm$core$List$length(list) - 1));
};
var $author$project$WordGeneration$generateMarkovHelper = F4(
	function (order, model, prefix, generated) {
		var possibleNext = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2($elm$core$Dict$get, prefix, model));
		return $elm$core$List$isEmpty(possibleNext) ? $elm$random$Random$constant(generated) : (A2($elm$core$String$contains, '$', generated) ? $elm$random$Random$constant(generated) : (($elm$core$String$length(generated) > 20) ? $elm$random$Random$constant(generated) : A2(
			$elm$random$Random$andThen,
			function (nextChar) {
				if (nextChar === '') {
					return $elm$random$Random$constant(generated);
				} else {
					var newPrefix = _Utils_ap(
						A2($elm$core$String$dropLeft, 1, prefix),
						nextChar);
					var newGenerated = _Utils_ap(generated, nextChar);
					return A4($author$project$WordGeneration$generateMarkovHelper, order, model, newPrefix, newGenerated);
				}
			},
			$author$project$WordGeneration$randomFromList(possibleNext))));
	});
var $author$project$WordGeneration$generateMarkovWord = F2(
	function (model, ngramModel) {
		var startPrefix = A2($elm$core$String$repeat, model.cw, '^');
		return A2(
			$elm$random$Random$map,
			A2($elm$core$String$replace, '$', ''),
			A2(
				$elm$random$Random$map,
				A2($elm$core$String$replace, '^', ''),
				A4($author$project$WordGeneration$generateMarkovHelper, model.cw, ngramModel, startPrefix, '')));
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0;
		var genB = _v1;
		return function (seed0) {
			var _v2 = genA(seed0);
			var a = _v2.a;
			var seed1 = _v2.b;
			var _v3 = genB(seed1);
			var b = _v3.a;
			var seed2 = _v3.b;
			return _Utils_Tuple2(
				A2(func, a, b),
				seed2);
		};
	});
var $author$project$WordGeneration$combineGenerators = function (generators) {
	if (!generators.b) {
		return $elm$random$Random$constant('');
	} else {
		var first = generators.a;
		var rest = generators.b;
		return A3(
			$elm$random$Random$map2,
			$elm$core$Basics$append,
			first,
			$author$project$WordGeneration$combineGenerators(rest));
	}
};
var $author$project$WordGeneration$charToGenerator = F2(
	function (phonology, _char) {
		var maybeCategory = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (cat) {
					return _Utils_eq(cat.dp, _char);
				},
				phonology.ce));
		if (!maybeCategory.$) {
			var category = maybeCategory.a;
			return $author$project$WordGeneration$randomFromList(category.dM);
		} else {
			return $elm$random$Random$constant('');
		}
	});
var $elm$random$Random$addOne = function (value) {
	return _Utils_Tuple2(1, value);
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$random$Random$float = F2(
	function (a, b) {
		return function (seed0) {
			var seed1 = $elm$random$Random$next(seed0);
			var range = $elm$core$Basics$abs(b - a);
			var n1 = $elm$random$Random$peel(seed1);
			var n0 = $elm$random$Random$peel(seed0);
			var lo = (134217727 & n1) * 1.0;
			var hi = (67108863 & n0) * 1.0;
			var val = ((hi * 134217728.0) + lo) / 9007199254740992.0;
			var scaled = (val * range) + a;
			return _Utils_Tuple2(
				scaled,
				$elm$random$Random$next(seed1));
		};
	});
var $elm$random$Random$getByWeight = F3(
	function (_v0, others, countdown) {
		getByWeight:
		while (true) {
			var weight = _v0.a;
			var value = _v0.b;
			if (!others.b) {
				return value;
			} else {
				var second = others.a;
				var otherOthers = others.b;
				if (_Utils_cmp(
					countdown,
					$elm$core$Basics$abs(weight)) < 1) {
					return value;
				} else {
					var $temp$_v0 = second,
						$temp$others = otherOthers,
						$temp$countdown = countdown - $elm$core$Basics$abs(weight);
					_v0 = $temp$_v0;
					others = $temp$others;
					countdown = $temp$countdown;
					continue getByWeight;
				}
			}
		}
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$random$Random$weighted = F2(
	function (first, others) {
		var normalize = function (_v0) {
			var weight = _v0.a;
			return $elm$core$Basics$abs(weight);
		};
		var total = normalize(first) + $elm$core$List$sum(
			A2($elm$core$List$map, normalize, others));
		return A2(
			$elm$random$Random$map,
			A2($elm$random$Random$getByWeight, first, others),
			A2($elm$random$Random$float, 0, total));
	});
var $elm$random$Random$uniform = F2(
	function (value, valueList) {
		return A2(
			$elm$random$Random$weighted,
			$elm$random$Random$addOne(value),
			A2($elm$core$List$map, $elm$random$Random$addOne, valueList));
	});
var $author$project$WordGeneration$elementToGenerator = F2(
	function (phonology, element) {
		switch (element.$) {
			case 0:
				var _char = element.a;
				return A2($author$project$WordGeneration$charToGenerator, phonology, _char);
			case 1:
				var _char = element.a;
				return A2(
					$elm$random$Random$andThen,
					function (include) {
						return include ? A2($author$project$WordGeneration$charToGenerator, phonology, _char) : $elm$random$Random$constant('');
					},
					A2(
						$elm$random$Random$weighted,
						_Utils_Tuple2(50, true),
						_List_fromArray(
							[
								_Utils_Tuple2(50, false)
							])));
			default:
				var chars = element.a;
				if (!chars.b) {
					return $elm$random$Random$constant('');
				} else {
					var first = chars.a;
					var rest = chars.b;
					return A2(
						$elm$random$Random$andThen,
						$author$project$WordGeneration$charToGenerator(phonology),
						A2($elm$random$Random$uniform, first, rest));
				}
		}
	});
var $author$project$Types$Choice = function (a) {
	return {$: 2, a: a};
};
var $author$project$Types$Optional = function (a) {
	return {$: 1, a: a};
};
var $author$project$Types$Required = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$WordGeneration$extractUntilCloseParenHelper = F2(
	function (chars, acc) {
		extractUntilCloseParenHelper:
		while (true) {
			if (!chars.b) {
				return _Utils_Tuple2(
					$elm$core$List$reverse(acc),
					_List_Nil);
			} else {
				if (')' === chars.a) {
					var rest = chars.b;
					return _Utils_Tuple2(
						$elm$core$List$reverse(acc),
						rest);
				} else {
					var c = chars.a;
					var rest = chars.b;
					var $temp$chars = rest,
						$temp$acc = A2($elm$core$List$cons, c, acc);
					chars = $temp$chars;
					acc = $temp$acc;
					continue extractUntilCloseParenHelper;
				}
			}
		}
	});
var $author$project$WordGeneration$extractUntilCloseParen = function (chars) {
	return A2($author$project$WordGeneration$extractUntilCloseParenHelper, chars, _List_Nil);
};
var $author$project$WordGeneration$parsePatternHelper = F2(
	function (chars, acc) {
		parsePatternHelper:
		while (true) {
			if (!chars.b) {
				return $elm$core$List$reverse(acc);
			} else {
				if ('(' === chars.a) {
					var rest = chars.b;
					var _v1 = $author$project$WordGeneration$extractUntilCloseParen(rest);
					var content = _v1.a;
					var remaining = _v1.b;
					var contentStr = $elm$core$String$fromList(content);
					if (A2($elm$core$String$contains, '|', contentStr)) {
						var choices = A2(
							$elm$core$List$filterMap,
							A2(
								$elm$core$Basics$composeR,
								$elm$core$String$uncons,
								$elm$core$Maybe$map($elm$core$Tuple$first)),
							A2($elm$core$String$split, '|', contentStr));
						var $temp$chars = remaining,
							$temp$acc = A2(
							$elm$core$List$cons,
							$author$project$Types$Choice(choices),
							acc);
						chars = $temp$chars;
						acc = $temp$acc;
						continue parsePatternHelper;
					} else {
						if ($elm$core$List$length(content) === 1) {
							var _v2 = $elm$core$List$head(content);
							if (!_v2.$) {
								var _char = _v2.a;
								var $temp$chars = remaining,
									$temp$acc = A2(
									$elm$core$List$cons,
									$author$project$Types$Optional(_char),
									acc);
								chars = $temp$chars;
								acc = $temp$acc;
								continue parsePatternHelper;
							} else {
								var $temp$chars = remaining,
									$temp$acc = acc;
								chars = $temp$chars;
								acc = $temp$acc;
								continue parsePatternHelper;
							}
						} else {
							var $temp$chars = remaining,
								$temp$acc = acc;
							chars = $temp$chars;
							acc = $temp$acc;
							continue parsePatternHelper;
						}
					}
				} else {
					var _char = chars.a;
					var rest = chars.b;
					var $temp$chars = rest,
						$temp$acc = A2(
						$elm$core$List$cons,
						$author$project$Types$Required(_char),
						acc);
					chars = $temp$chars;
					acc = $temp$acc;
					continue parsePatternHelper;
				}
			}
		}
	});
var $author$project$WordGeneration$parsePattern = function (pattern) {
	return A2(
		$author$project$WordGeneration$parsePatternHelper,
		$elm$core$String$toList(pattern),
		_List_Nil);
};
var $author$project$WordGeneration$generateFromPattern = F2(
	function (pattern, phonology) {
		return $author$project$WordGeneration$combineGenerators(
			A2(
				$elm$core$List$map,
				$author$project$WordGeneration$elementToGenerator(phonology),
				$author$project$WordGeneration$parsePattern(pattern)));
	});
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $author$project$WordGeneration$generateMultiSyllableWord = function (model) {
	var syllableCountGenerator = A2($elm$random$Random$int, model.ca, model.cU);
	var phonology = model.a.ct.dE;
	var patternsToUse = $elm$core$List$isEmpty(model.aY) ? _List_fromArray(
		['CV']) : A2($elm$core$List$map, $elm$core$String$toUpper, model.aY);
	var generateOneSyllable = function () {
		if (!patternsToUse.b) {
			return A2($author$project$WordGeneration$generateFromPattern, 'CV', phonology);
		} else {
			if (!patternsToUse.b.b) {
				var singlePattern = patternsToUse.a;
				return A2($author$project$WordGeneration$generateFromPattern, singlePattern, phonology);
			} else {
				var multiplePatterns = patternsToUse;
				return A2(
					$elm$random$Random$andThen,
					function (pattern) {
						return A2($author$project$WordGeneration$generateFromPattern, pattern, phonology);
					},
					A2(
						$elm$random$Random$uniform,
						A2(
							$elm$core$Maybe$withDefault,
							'CV',
							$elm$core$List$head(multiplePatterns)),
						A2($elm$core$List$drop, 1, multiplePatterns)));
			}
		}
	}();
	return A2(
		$elm$random$Random$andThen,
		function (count) {
			return A2(
				$elm$random$Random$map,
				function (syllables) {
					return A2($elm$core$String$join, '.', syllables);
				},
				A2($elm$random$Random$list, count, generateOneSyllable));
		},
		syllableCountGenerator);
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$WordGeneration$matchCategoryAtStart = F3(
	function (phonology, categoryLabel, remaining) {
		if ($elm$core$String$isEmpty(remaining)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybeCategory = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (cat) {
						return _Utils_eq(cat.dp, categoryLabel);
					},
					phonology.ce));
			if (maybeCategory.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var category = maybeCategory.a;
				return A2(
					$elm$core$Maybe$map,
					function (matched) {
						return _Utils_Tuple2(
							matched,
							A2(
								$elm$core$String$dropLeft,
								$elm$core$String$length(matched),
								remaining));
					},
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (sound) {
								return A2($elm$core$String$startsWith, sound, remaining);
							},
							A2(
								$elm$core$List$sortBy,
								function (s) {
									return -$elm$core$String$length(s);
								},
								category.dM))));
			}
		}
	});
var $author$project$WordGeneration$clusterMatchesPattern = F3(
	function (phonology, pattern, cluster) {
		var patternElements = $author$project$WordGeneration$parsePattern(pattern);
		var matchCluster = F2(
			function (elements, remaining) {
				matchCluster:
				while (true) {
					if (!elements.b) {
						return $elm$core$String$isEmpty(remaining);
					} else {
						switch (elements.a.$) {
							case 0:
								var _char = elements.a.a;
								var restPattern = elements.b;
								var _v1 = A3($author$project$WordGeneration$matchCategoryAtStart, phonology, _char, remaining);
								if (!_v1.$) {
									var _v2 = _v1.a;
									var matched = _v2.a;
									var afterMatch = _v2.b;
									var $temp$elements = restPattern,
										$temp$remaining = afterMatch;
									elements = $temp$elements;
									remaining = $temp$remaining;
									continue matchCluster;
								} else {
									return false;
								}
							case 1:
								var _char = elements.a.a;
								var restPattern = elements.b;
								var _v3 = A3($author$project$WordGeneration$matchCategoryAtStart, phonology, _char, remaining);
								if (!_v3.$) {
									var _v4 = _v3.a;
									var matched = _v4.a;
									var afterMatch = _v4.b;
									var $temp$elements = restPattern,
										$temp$remaining = afterMatch;
									elements = $temp$elements;
									remaining = $temp$remaining;
									continue matchCluster;
								} else {
									var $temp$elements = restPattern,
										$temp$remaining = remaining;
									elements = $temp$elements;
									remaining = $temp$remaining;
									continue matchCluster;
								}
							default:
								var chars = elements.a.a;
								var restPattern = elements.b;
								return A2(
									$elm$core$List$any,
									function (_char) {
										var _v5 = A3($author$project$WordGeneration$matchCategoryAtStart, phonology, _char, remaining);
										if (!_v5.$) {
											var _v6 = _v5.a;
											var matched = _v6.a;
											var afterMatch = _v6.b;
											return A2(matchCluster, restPattern, afterMatch);
										} else {
											return false;
										}
									},
									chars);
						}
					}
				}
			});
		return A2(matchCluster, patternElements, cluster);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$WordGeneration$collectConsecutiveConsonants = F3(
	function (consonants, syllable, startPos) {
		var helper = F2(
			function (pos, accumulated) {
				helper:
				while (true) {
					if (_Utils_cmp(
						pos,
						$elm$core$String$length(syllable)) > -1) {
						return _Utils_Tuple2(accumulated, pos);
					} else {
						var remaining = A2($elm$core$String$dropLeft, pos, syllable);
						var matchedConsonant = $elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (c) {
									return A2($elm$core$String$startsWith, c, remaining);
								},
								A2(
									$elm$core$List$sortBy,
									function (c) {
										return -$elm$core$String$length(c);
									},
									consonants)));
						if (!matchedConsonant.$) {
							var cons = matchedConsonant.a;
							var $temp$pos = pos + $elm$core$String$length(cons),
								$temp$accumulated = _Utils_ap(accumulated, cons);
							pos = $temp$pos;
							accumulated = $temp$accumulated;
							continue helper;
						} else {
							return _Utils_Tuple2(accumulated, pos);
						}
					}
				}
			});
		return A2(helper, startPos, '');
	});
var $author$project$WordGeneration$extractConsonantClustersFromSyllable = F2(
	function (consonants, syllable) {
		var findConsonantAt = function (pos) {
			if (_Utils_cmp(
				pos,
				$elm$core$String$length(syllable)) > -1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var remaining = A2($elm$core$String$dropLeft, pos, syllable);
				var matchedConsonant = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (c) {
							return A2($elm$core$String$startsWith, c, remaining);
						},
						A2(
							$elm$core$List$sortBy,
							function (c) {
								return -$elm$core$String$length(c);
							},
							consonants)));
				return A2(
					$elm$core$Maybe$map,
					function (c) {
						return _Utils_Tuple2(c, pos);
					},
					matchedConsonant);
			}
		};
		var collectClusters = F2(
			function (pos, acc) {
				collectClusters:
				while (true) {
					var _v0 = findConsonantAt(pos);
					if (_v0.$ === 1) {
						if (_Utils_cmp(
							pos,
							$elm$core$String$length(syllable)) > -1) {
							return acc;
						} else {
							var $temp$pos = pos + 1,
								$temp$acc = acc;
							pos = $temp$pos;
							acc = $temp$acc;
							continue collectClusters;
						}
					} else {
						var _v1 = _v0.a;
						var firstCons = _v1.a;
						var afterFirst = pos + $elm$core$String$length(firstCons);
						var _v2 = findConsonantAt(afterFirst);
						if (_v2.$ === 1) {
							var $temp$pos = afterFirst,
								$temp$acc = acc;
							pos = $temp$pos;
							acc = $temp$acc;
							continue collectClusters;
						} else {
							var _v3 = _v2.a;
							var secondCons = _v3.a;
							var _v4 = A3($author$project$WordGeneration$collectConsecutiveConsonants, consonants, syllable, pos);
							var cluster = _v4.a;
							var endPos = _v4.b;
							var $temp$pos = endPos,
								$temp$acc = A2($elm$core$List$cons, cluster, acc);
							pos = $temp$pos;
							acc = $temp$acc;
							continue collectClusters;
						}
					}
				}
			});
		return $elm$core$List$reverse(
			A2(collectClusters, 0, _List_Nil));
	});
var $elm$core$String$toLower = _String_toLower;
var $author$project$WordGeneration$syllableMatchesClusterPattern = F3(
	function (phonology, pattern, syllable) {
		var consonants = A2(
			$elm$core$List$concatMap,
			function ($) {
				return $.dM;
			},
			A2(
				$elm$core$List$filter,
				function (cat) {
					return (cat.dp === 'C') || ($elm$core$String$toLower(cat.I) === 'consonants');
				},
				phonology.ce));
		var clusters = A2($author$project$WordGeneration$extractConsonantClustersFromSyllable, consonants, syllable);
		return A2(
			$elm$core$List$all,
			A2($author$project$WordGeneration$clusterMatchesPattern, phonology, pattern),
			clusters);
	});
var $author$project$WordGeneration$checkLegalClusterPattern = F3(
	function (phonology, pattern, syllables) {
		return $elm$core$String$isEmpty(pattern) ? true : A2(
			$elm$core$List$all,
			A2($author$project$WordGeneration$syllableMatchesClusterPattern, phonology, pattern),
			syllables);
	});
var $author$project$WordGeneration$parseSyllableStructure = F2(
	function (vowels, syllable) {
		var findVowelAt = function (pos) {
			if (_Utils_cmp(
				pos,
				$elm$core$String$length(syllable)) > -1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var remaining = A2($elm$core$String$dropLeft, pos, syllable);
				var matchedVowel = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (v) {
							return A2($elm$core$String$startsWith, v, remaining);
						},
						A2(
							$elm$core$List$sortBy,
							function (v) {
								return -$elm$core$String$length(v);
							},
							vowels)));
				return A2(
					$elm$core$Maybe$map,
					function (v) {
						return _Utils_Tuple2(v, pos);
					},
					matchedVowel);
			}
		};
		var findAllVowels = F2(
			function (pos, acc) {
				findAllVowels:
				while (true) {
					var _v0 = findVowelAt(pos);
					if (_v0.$ === 1) {
						if (_Utils_cmp(
							pos,
							$elm$core$String$length(syllable)) > -1) {
							return $elm$core$List$reverse(acc);
						} else {
							var $temp$pos = pos + 1,
								$temp$acc = acc;
							pos = $temp$pos;
							acc = $temp$acc;
							continue findAllVowels;
						}
					} else {
						var _v1 = _v0.a;
						var vowel = _v1.a;
						var vPos = _v1.b;
						var $temp$pos = vPos + $elm$core$String$length(vowel),
							$temp$acc = A2(
							$elm$core$List$cons,
							_Utils_Tuple2(vowel, vPos),
							acc);
						pos = $temp$pos;
						acc = $temp$acc;
						continue findAllVowels;
					}
				}
			});
		var vowelPositions = A2(findAllVowels, 0, _List_Nil);
		var firstVowelPos = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$second,
				$elm$core$List$head(vowelPositions)));
		var lastVowelInfo = $elm$core$List$head(
			$elm$core$List$reverse(vowelPositions));
		var lastVowelEndPos = function () {
			if (!lastVowelInfo.$) {
				var _v3 = lastVowelInfo.a;
				var vowel = _v3.a;
				var pos = _v3.b;
				return pos + $elm$core$String$length(vowel);
			} else {
				return 0;
			}
		}();
		return $elm$core$List$isEmpty(vowelPositions) ? {aJ: '', bX: '', aO: syllable} : {
			aJ: A2($elm$core$String$dropLeft, lastVowelEndPos, syllable),
			bX: A3($elm$core$String$slice, firstVowelPos, lastVowelEndPos, syllable),
			aO: A2($elm$core$String$left, firstVowelPos, syllable)
		};
	});
var $author$project$WordGeneration$checkConstraint = F3(
	function (phonology, word, constraint) {
		var vowels = A2(
			$elm$core$List$concatMap,
			function ($) {
				return $.dM;
			},
			A2(
				$elm$core$List$filter,
				function (cat) {
					return (cat.dp === 'V') || ($elm$core$String$toLower(cat.I) === 'vowels');
				},
				phonology.ce));
		var syllables = A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			A2($elm$core$String$split, '.', word));
		var syllableStructures = A2(
			$elm$core$List$map,
			$author$project$WordGeneration$parseSyllableStructure(vowels),
			syllables);
		var consonants = A2(
			$elm$core$List$concatMap,
			function ($) {
				return $.dM;
			},
			A2(
				$elm$core$List$filter,
				function (cat) {
					return (cat.dp === 'C') || ($elm$core$String$toLower(cat.I) === 'consonants');
				},
				phonology.ce));
		var _v0 = constraint.c7;
		switch (_v0) {
			case 0:
				return A2(
					$elm$core$List$all,
					function (syl) {
						return !A2($elm$core$String$contains, constraint.dL, syl);
					},
					syllables);
			case 1:
				return A3($author$project$WordGeneration$checkLegalClusterPattern, phonology, constraint.dL, syllables);
			case 2:
				return A2(
					$elm$core$List$all,
					function (syl) {
						return !A2($elm$core$String$contains, constraint.dL, syl.aO);
					},
					syllableStructures);
			case 3:
				return A2(
					$elm$core$List$all,
					function (syl) {
						return !A2($elm$core$String$contains, constraint.dL, syl.aJ);
					},
					syllableStructures);
			case 4:
				var _v1 = $elm$core$List$head(syllableStructures);
				if (!_v1.$) {
					var firstSyl = _v1.a;
					return !A2($elm$core$String$startsWith, constraint.dL, firstSyl.aO);
				} else {
					return true;
				}
			default:
				var _v2 = $elm$core$List$head(
					$elm$core$List$reverse(syllableStructures));
				if (!_v2.$) {
					var lastSyl = _v2.a;
					return !A2($elm$core$String$endsWith, constraint.dL, lastSyl.aJ);
				} else {
					return true;
				}
		}
	});
var $author$project$WordGeneration$checkSyllableForValidDiphthongs = F2(
	function (phonology, syllable) {
		var vowels = A2(
			$elm$core$List$concatMap,
			function ($) {
				return $.dM;
			},
			A2(
				$elm$core$List$filter,
				function (cat) {
					return (cat.dp === 'V') || ($elm$core$String$toLower(cat.I) === 'vowels');
				},
				phonology.ce));
		var findLongestVowelMatch = F2(
			function (vowelList, str) {
				return $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (v) {
							return A2($elm$core$String$startsWith, v, str);
						},
						A2(
							$elm$core$List$sortBy,
							function (v) {
								return -$elm$core$String$length(v);
							},
							vowelList)));
			});
		var checkVowelSequences = function (remaining) {
			checkVowelSequences:
			while (true) {
				if ($elm$core$String$isEmpty(remaining)) {
					return true;
				} else {
					var _v0 = A2(findLongestVowelMatch, vowels, remaining);
					if (_v0.$ === 1) {
						var $temp$remaining = A2($elm$core$String$dropLeft, 1, remaining);
						remaining = $temp$remaining;
						continue checkVowelSequences;
					} else {
						var firstVowel = _v0.a;
						var afterFirst = A2(
							$elm$core$String$dropLeft,
							$elm$core$String$length(firstVowel),
							remaining);
						var _v1 = A2(findLongestVowelMatch, vowels, afterFirst);
						if (_v1.$ === 1) {
							var $temp$remaining = afterFirst;
							remaining = $temp$remaining;
							continue checkVowelSequences;
						} else {
							var secondVowel = _v1.a;
							var combination = _Utils_ap(firstVowel, secondVowel);
							var isValidDiphthong = A2($elm$core$List$member, combination, phonology.da);
							if (isValidDiphthong) {
								var $temp$remaining = A2(
									$elm$core$String$dropLeft,
									$elm$core$String$length(secondVowel),
									afterFirst);
								remaining = $temp$remaining;
								continue checkVowelSequences;
							} else {
								return false;
							}
						}
					}
				}
			}
		};
		return checkVowelSequences(syllable);
	});
var $author$project$WordGeneration$hasValidDiphthongs = F2(
	function (phonology, word) {
		if ($elm$core$List$isEmpty(phonology.da)) {
			return true;
		} else {
			var syllables = A2($elm$core$String$split, '.', word);
			return A2(
				$elm$core$List$all,
				$author$project$WordGeneration$checkSyllableForValidDiphthongs(phonology),
				syllables);
		}
	});
var $author$project$WordGeneration$isValidWord = F3(
	function (phonology, constraints, word) {
		return A2(
			$elm$core$List$all,
			A2($author$project$WordGeneration$checkConstraint, phonology, word),
			constraints) && A2($author$project$WordGeneration$hasValidDiphthongs, phonology, word);
	});
var $author$project$PhonologyHelpers$syllabifyIPA = F2(
	function (phonology, word) {
		return word;
	});
var $author$project$WordGeneration$generateWordsTemplate = function (model) {
	var phonology = model.a.ct.dE;
	var candidateCount = $elm$core$List$isEmpty(phonology.c8) ? model.cZ : (model.cZ * 5);
	return A2(
		$elm$random$Random$map,
		$elm$core$List$map(
			$author$project$PhonologyHelpers$syllabifyIPA(phonology)),
		A2(
			$elm$random$Random$map,
			$elm$core$List$take(model.cZ),
			A2(
				$elm$random$Random$map,
				$elm$core$List$filter(
					A2($author$project$WordGeneration$isValidWord, phonology, phonology.c8)),
				A2(
					$elm$random$Random$list,
					candidateCount,
					$author$project$WordGeneration$generateMultiSyllableWord(model)))));
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $author$project$WordGeneration$isValidWordLength = F3(
	function (minLen, maxLen, word) {
		var vowelCount = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (c) {
					return A2(
						$elm$core$List$member,
						c,
						_List_fromArray(
							['a', 'e', 'i', 'o', 'u']));
				},
				$elm$core$String$toList(
					$elm$core$String$toLower(word))));
		return (_Utils_cmp(vowelCount, minLen) > -1) && (_Utils_cmp(vowelCount, maxLen) < 1);
	});
var $author$project$Utilities$removeSyllableSeparators = function (word) {
	return A3($elm$core$String$replace, '.', '', word);
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$WordGeneration$generateWordsMarkov = function (model) {
	var phonology = model.a.ct.dE;
	var lexicon = A2(
		$elm$core$List$map,
		$author$project$Utilities$removeSyllableSeparators,
		A2(
			$elm$core$List$map,
			function ($) {
				return $.bR;
			},
			$elm$core$Dict$values(model.a.ct.dt)));
	var ngramModel = A2($author$project$WordGeneration$buildNgramModel, model.cw, lexicon);
	var candidateCount = $elm$core$List$isEmpty(phonology.c8) ? model.cZ : (model.cZ * 5);
	return $elm$core$Dict$isEmpty(ngramModel) ? $author$project$WordGeneration$generateWordsTemplate(model) : A2(
		$elm$random$Random$map,
		$elm$core$List$map(
			$author$project$PhonologyHelpers$syllabifyIPA(phonology)),
		A2(
			$elm$random$Random$map,
			$elm$core$List$take(model.cZ),
			A2(
				$elm$random$Random$map,
				$elm$core$List$filter(
					A2($author$project$WordGeneration$isValidWordLength, model.bT, model.cv)),
				A2(
					$elm$random$Random$map,
					$elm$core$List$filter(
						A2($author$project$WordGeneration$isValidWord, phonology, phonology.c8)),
					A2(
						$elm$random$Random$list,
						candidateCount,
						A2($author$project$WordGeneration$generateMarkovWord, model, ngramModel))))));
};
var $author$project$WordGeneration$generateWordsCmd = function (model) {
	var _v0 = model.cp;
	if (!_v0) {
		return $author$project$WordGeneration$generateWordsTemplate(model);
	} else {
		return $author$project$WordGeneration$generateWordsMarkov(model);
	}
};
var $author$project$WordGeneration$getAt = F2(
	function (index, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, index, list));
	});
var $elm$browser$Browser$Dom$getElement = _Browser_getElement;
var $author$project$Main$loadAllProjects = _Platform_outgoingPort(
	'loadAllProjects',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$savePreference = _Platform_outgoingPort('savePreference', $elm$core$Basics$identity);
var $author$project$Main$handleRegularProjectLoad = F2(
	function (model, project) {
		var _v0 = model.bx;
		if (!_v0.$) {
			var refId = _v0.a;
			if (_Utils_eq(project.bn, refId)) {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							b0: $elm$core$Maybe$Just(project)
						}),
					$elm$core$Platform$Cmd$none);
			} else {
				var updatedModel = _Utils_update(
					model,
					{O: project.bn, dh: project.ct.dh, a: project, r: _List_Nil, R: false, j: _List_Nil});
				var preferenceCmd = $author$project$Main$savePreference(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'currentProjectId',
								$elm$json$Json$Encode$int(project.bn))
							])));
				return _Utils_Tuple2(
					updatedModel,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								preferenceCmd,
								$author$project$Main$loadAllProjects(0)
							])));
			}
		} else {
			var updatedModel = _Utils_update(
				model,
				{O: project.bn, dh: project.ct.dh, a: project, r: _List_Nil, R: false, j: _List_Nil});
			var preferenceCmd = $author$project$Main$savePreference(
				$elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'currentProjectId',
							$elm$json$Json$Encode$int(project.bn))
						])));
			return _Utils_Tuple2(
				updatedModel,
				$elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							preferenceCmd,
							$author$project$Main$loadAllProjects(0)
						])));
		}
	});
var $author$project$Main$insertAtCursor = _Platform_outgoingPort(
	'insertAtCursor',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'fieldId',
					$elm$json$Json$Encode$string($.bj)),
					_Utils_Tuple2(
					'text',
					$elm$json$Json$Encode$string($.cb))
				]));
	});
var $author$project$PhonologyHelpers$isConsonantSound = function (phoneme) {
	var consonantPhonemes = _List_fromArray(
		['p', 'b', 't', 'd', 'k', 'g', 'm', 'n', 'ŋ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'l', 'r', 'j', 'ɾ', 'ɸ', 'β', 'tʃ', 'dʒ', 'ç', 'ʝ', 'x', 'ɣ', 'χ', 'ʁ', 'ħ', 'ʕ', 'ʔ', 'c', 'ɟ', 'q', 'ɢ', 'ɲ', 'ʎ', 'ʈ', 'ɽ', 'ʐ', 'ɖ', 'ɦ', 'ɬ', 'ɭ', 'ɮ', 'ɰ', 'ɱ', 'ɳ', 'ɴ', 'ɹ', 'ɻ', 'ʀ', 'ʂ', 'ʋ', 'ʕ̞', 'ʙ', 'ʟ']);
	return A2($elm$core$List$member, phoneme, consonantPhonemes);
};
var $author$project$PhonologyHelpers$isOtherSymbolSound = function (phoneme) {
	var otherSymbolPhonemes = _List_fromArray(
		['w', 'ʍ', 'ɥ', 'ɥ̊', 'ts', 'dz', 'tʃ', 'dʒ', 'tɕ', 'dʑ', 'tʂ', 'dʐ']);
	return A2($elm$core$List$member, phoneme, otherSymbolPhonemes);
};
var $author$project$PhonologyHelpers$isVowelSound = function (phoneme) {
	var vowelPhonemes = _List_fromArray(
		['a', 'e', 'i', 'o', 'u', 'ɑ', 'ɛ', 'ɪ', 'ɔ', 'ʊ', 'ə', 'y', 'ø', 'œ', 'ɨ', 'ʉ', 'ɯ', 'ɘ', 'ɵ', 'ɤ', 'ɜ', 'ɞ', 'ʌ', 'æ', 'ɒ', 'ä', 'ɐ', 'ɶ', 'ʏ']);
	return A2($elm$core$List$member, phoneme, vowelPhonemes);
};
var $author$project$Utilities$lexiconToCSV = function (lexicon) {
	var header = 'word,definition,pos,etymology,categories';
	var escapeCSVField = function (field) {
		return (A2($elm$core$String$contains, ',', field) || (A2($elm$core$String$contains, '\"', field) || A2($elm$core$String$contains, '\n', field))) ? ('\"' + (A3($elm$core$String$replace, '\"', '\"\"', field) + '\"')) : field;
	};
	var lexemeToRow = function (lexeme) {
		return A2(
			$elm$core$String$join,
			',',
			_List_fromArray(
				[
					escapeCSVField(lexeme.bR),
					escapeCSVField(lexeme.c9),
					escapeCSVField(lexeme.cG),
					escapeCSVField(lexeme.dc.cb),
					escapeCSVField(
					A2($elm$core$String$join, ';', lexeme.ce))
				]));
	};
	var rows = A2($elm$core$List$map, lexemeToRow, lexicon);
	return A2(
		$elm$core$String$join,
		'\n',
		A2($elm$core$List$cons, header, rows));
};
var $author$project$Main$loadProjectById = _Platform_outgoingPort('loadProjectById', $elm$json$Json$Encode$int);
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$String$map = _String_map;
var $author$project$UUIDHelpers$ensureLanguageUUID = function (language) {
	return $elm$core$String$isEmpty(language.ae) ? _Utils_update(
		language,
		{
			ae: $author$project$UUIDHelpers$generateDeterministicUUID(
				'language-' + $elm$core$String$fromInt(
					$elm$core$List$length(
						$elm$core$Dict$toList(language.dt))))
		}) : language;
};
var $author$project$UUIDHelpers$ensureLexemeUUIDs = function (lexiconDict) {
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (index, _v0) {
					var uuid = _v0.a;
					var lexeme = _v0.b;
					if ($elm$core$String$isEmpty(lexeme.ae)) {
						var newUUID = $author$project$UUIDHelpers$generateDeterministicUUID(
							'lexeme-' + ($elm$core$String$fromInt(index) + ('-' + (lexeme.bR + ('-' + lexeme.c9)))));
						var newLexeme = _Utils_update(
							lexeme,
							{ae: newUUID});
						return _Utils_Tuple2(newUUID, newLexeme);
					} else {
						return _Utils_Tuple2(lexeme.ae, lexeme);
					}
				}),
			$elm$core$Dict$toList(lexiconDict)));
};
var $author$project$UUIDHelpers$ensureFeatureUUIDs = function (features) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, feature) {
				return $elm$core$String$isEmpty(feature.ae) ? _Utils_update(
					feature,
					{
						ae: $author$project$UUIDHelpers$generateDeterministicUUID(
							'feature-' + ($elm$core$String$fromInt(index) + ('-' + feature.I)))
					}) : feature;
			}),
		features);
};
var $author$project$UUIDHelpers$ensureMorphemeUUIDs = function (morphemes) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, morpheme) {
				return $elm$core$String$isEmpty(morpheme.ae) ? _Utils_update(
					morpheme,
					{
						ae: $author$project$UUIDHelpers$generateDeterministicUUID(
							'morpheme-' + ($elm$core$String$fromInt(index) + ('-' + (morpheme.bR + ('-' + morpheme.di)))))
					}) : morpheme;
			}),
		morphemes);
};
var $author$project$UUIDHelpers$migrateMorphologyWithUUIDs = function (morphology) {
	return _Utils_update(
		morphology,
		{
			bQ: $author$project$UUIDHelpers$ensureFeatureUUIDs(morphology.bQ),
			bV: $author$project$UUIDHelpers$ensureMorphemeUUIDs(morphology.bV)
		});
};
var $author$project$UUIDHelpers$ensureCategoryUUIDs = function (categories) {
	return A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, category) {
				return $elm$core$String$isEmpty(category.ae) ? _Utils_update(
					category,
					{
						ae: $author$project$UUIDHelpers$generateDeterministicUUID(
							'category-' + ($elm$core$String$fromInt(index) + ('-' + category.I)))
					}) : category;
			}),
		categories);
};
var $author$project$UUIDHelpers$migratePhonologyWithUUIDs = function (phonology) {
	return _Utils_update(
		phonology,
		{
			ce: $author$project$UUIDHelpers$ensureCategoryUUIDs(phonology.ce)
		});
};
var $author$project$UUIDHelpers$migrateLanguageWithUUIDs = function (language) {
	var languageWithUUID = $author$project$UUIDHelpers$ensureLanguageUUID(language);
	var migratedLexicon = $author$project$UUIDHelpers$ensureLexemeUUIDs(languageWithUUID.dt);
	var migratedMorphology = $author$project$UUIDHelpers$migrateMorphologyWithUUIDs(languageWithUUID.dv);
	var migratedPhonology = $author$project$UUIDHelpers$migratePhonologyWithUUIDs(languageWithUUID.dE);
	return _Utils_update(
		languageWithUUID,
		{dt: migratedLexicon, dv: migratedMorphology, dE: migratedPhonology});
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$Utilities$parseCSVToLexicon = function (csvData) {
	var parseCSVLine = function (line) {
		var parseFields = F2(
			function (remaining, acc) {
				parseFields:
				while (true) {
					if ($elm$core$String$isEmpty(remaining)) {
						return $elm$core$List$reverse(acc);
					} else {
						if (A2($elm$core$String$startsWith, '\"', remaining)) {
							var rest = A2($elm$core$String$dropLeft, 1, remaining);
							var findEndQuote = F2(
								function (str, pos) {
									var _v12 = A2($elm$core$String$indexes, '\"', str);
									if (!_v12.b) {
										return $elm$core$Maybe$Nothing;
									} else {
										var indices = _v12;
										return $elm$core$List$head(
											A2(
												$elm$core$List$filter,
												function (i) {
													return _Utils_cmp(i, pos) > -1;
												},
												indices));
									}
								});
							var _v11 = A2(findEndQuote, rest, 0);
							if (!_v11.$) {
								var endPos = _v11.a;
								var field = A3(
									$elm$core$String$replace,
									'\"\"',
									'\"',
									A3($elm$core$String$slice, 0, endPos, rest));
								var afterQuote = A2($elm$core$String$dropLeft, endPos + 1, rest);
								var nextField = A2($elm$core$String$startsWith, ',', afterQuote) ? A2($elm$core$String$dropLeft, 1, afterQuote) : afterQuote;
								var $temp$remaining = nextField,
									$temp$acc = A2($elm$core$List$cons, field, acc);
								remaining = $temp$remaining;
								acc = $temp$acc;
								continue parseFields;
							} else {
								return $elm$core$List$reverse(acc);
							}
						} else {
							var _v13 = A2($elm$core$String$indexes, ',', remaining);
							if (!_v13.b) {
								return $elm$core$List$reverse(
									A2($elm$core$List$cons, remaining, acc));
							} else {
								var commaPos = _v13.a;
								var rest = A2($elm$core$String$dropLeft, commaPos + 1, remaining);
								var field = A2($elm$core$String$left, commaPos, remaining);
								var $temp$remaining = rest,
									$temp$acc = A2($elm$core$List$cons, field, acc);
								remaining = $temp$remaining;
								acc = $temp$acc;
								continue parseFields;
							}
						}
					}
				}
			});
		return A2(parseFields, line, _List_Nil);
	};
	var parseLine = function (line) {
		var _v1 = parseCSVLine(line);
		if ((_v1.b && _v1.b.b) && _v1.b.b.b) {
			if (_v1.b.b.b.b) {
				if (_v1.b.b.b.b.b) {
					var word = _v1.a;
					var _v2 = _v1.b;
					var definition = _v2.a;
					var _v3 = _v2.b;
					var pos = _v3.a;
					var _v4 = _v3.b;
					var etymology = _v4.a;
					var _v5 = _v4.b;
					var categories = _v5.a;
					return $elm$core$Maybe$Just(
						{
							ce: $elm$core$String$isEmpty(
								$elm$core$String$trim(categories)) ? _List_Nil : A2(
								$elm$core$List$filter,
								A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
								A2(
									$elm$core$List$map,
									$elm$core$String$trim,
									A2($elm$core$String$split, ';', categories))),
							c9: $elm$core$String$trim(definition),
							dc: {
								bZ: _List_Nil,
								cb: $elm$core$String$trim(etymology)
							},
							bR: $elm$core$String$trim(word),
							bV: _List_Nil,
							cA: $author$project$Utilities$removeSyllableSeparators(
								$elm$core$String$trim(word)),
							cG: $elm$core$String$trim(pos),
							dK: {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil},
							ae: ''
						});
				} else {
					var word = _v1.a;
					var _v6 = _v1.b;
					var definition = _v6.a;
					var _v7 = _v6.b;
					var pos = _v7.a;
					var _v8 = _v7.b;
					var etymology = _v8.a;
					return $elm$core$Maybe$Just(
						{
							ce: _List_Nil,
							c9: $elm$core$String$trim(definition),
							dc: {
								bZ: _List_Nil,
								cb: $elm$core$String$trim(etymology)
							},
							bR: $elm$core$String$trim(word),
							bV: _List_Nil,
							cA: $author$project$Utilities$removeSyllableSeparators(
								$elm$core$String$trim(word)),
							cG: $elm$core$String$trim(pos),
							dK: {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil},
							ae: ''
						});
				}
			} else {
				var word = _v1.a;
				var _v9 = _v1.b;
				var definition = _v9.a;
				var _v10 = _v9.b;
				var pos = _v10.a;
				return $elm$core$Maybe$Just(
					{
						ce: _List_Nil,
						c9: $elm$core$String$trim(definition),
						dc: {bZ: _List_Nil, cb: ''},
						bR: $elm$core$String$trim(word),
						bV: _List_Nil,
						cA: $author$project$Utilities$removeSyllableSeparators(
							$elm$core$String$trim(word)),
						cG: $elm$core$String$trim(pos),
						dK: {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil},
						ae: ''
					});
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	};
	var lines = A2($elm$core$String$split, '\n', csvData);
	var dataLines = function () {
		if (!lines.b) {
			return _List_Nil;
		} else {
			var rest = lines.b;
			return A2(
				$elm$core$List$filter,
				A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
				rest);
		}
	}();
	var parsedLexemes = A2($elm$core$List$filterMap, parseLine, dataLines);
	return ($elm$core$List$isEmpty(parsedLexemes) && (!$elm$core$List$isEmpty(dataLines))) ? $elm$core$Result$Err('Failed to parse CSV data') : $elm$core$Result$Ok(parsedLexemes);
};
var $author$project$Main$renameProjectById = _Platform_outgoingPort(
	'renameProjectById',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'newName',
					$elm$json$Json$Encode$string($.bW)),
					_Utils_Tuple2(
					'projectId',
					$elm$json$Json$Encode$int($.b_))
				]));
	});
var $author$project$Main$requestUUID = _Platform_outgoingPort(
	'requestUUID',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$saveLanguageFamily = _Platform_outgoingPort('saveLanguageFamily', $elm$core$Basics$identity);
var $author$project$Main$saveLanguageProject = _Platform_outgoingPort('saveLanguageProject', $elm$core$Basics$identity);
var $author$project$Main$saveTemplateToStorage = _Platform_outgoingPort('saveTemplateToStorage', $elm$core$Basics$identity);
var $author$project$Main$saveToStorage = _Platform_outgoingPort('saveToStorage', $elm$core$Basics$identity);
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$triggerCSVImport = _Platform_outgoingPort(
	'triggerCSVImport',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$triggerImport = _Platform_outgoingPort(
	'triggerImport',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$UpdateHelpers$updateProjectLanguage = F3(
	function (project, timestamp, language) {
		return {ch: project.ch, bn: project.bn, ct: language, cu: timestamp, I: project.I};
	});
var $author$project$UpdateHelpers$updateProjectName = F3(
	function (project, timestamp, newName) {
		return {ch: project.ch, bn: project.bn, ct: project.ct, cu: timestamp, I: newName};
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bv: input}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bO: input}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bu: input}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var label = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aB: label}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var language = model.a.ct;
				var phonology = language.dE;
				var categoryName = $elm$core$String$trim(model.M);
				var label = A2($author$project$Main$findUniqueLabel, categoryName, phonology.ce);
				return $elm$core$String$isEmpty(categoryName) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							at: $elm$core$Maybe$Just(label),
							u: $elm$core$Maybe$Just(
								A2($author$project$Model$ForSoundCategory, categoryName, label)),
							aB: $elm$core$String$fromChar(label),
							a$: true
						}),
					$author$project$Main$requestUUID(0));
			case 5:
				var label = msg.a;
				var language = model.a.ct;
				var phonology = language.dE;
				var categoryLabel = A2(
					$elm$core$Maybe$withDefault,
					'X',
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						$elm$core$String$uncons(label)));
				var updatedPhonology = _Utils_update(
					phonology,
					{
						ce: A2(
							$elm$core$List$filter,
							function (cat) {
								return !_Utils_eq(cat.dp, categoryLabel);
							},
							phonology.ce)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 6:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{M: '', bA: true}),
					$elm$core$Platform$Cmd$none);
			case 7:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{M: '', bA: false}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var label = msg.a;
				var category = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (cat) {
							return _Utils_eq(cat.dp, label);
						},
						model.a.ct.dE.ce));
				var categoryName = A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.I;
						},
						category));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							M: categoryName,
							at: $elm$core$Maybe$Just(label),
							aB: $elm$core$String$fromChar(label),
							a$: true
						}),
					$elm$core$Platform$Cmd$none);
			case 9:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{M: '', at: $elm$core$Maybe$Nothing, a$: false}),
					$elm$core$Platform$Cmd$none);
			case 10:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{M: input}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var newCategoryName = $elm$core$String$trim(model.M);
				var language = model.a.ct;
				var phonology = language.dE;
				var _v1 = model.at;
				if (_v1.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var oldLabel = _v1.a;
					var oldCategory = $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (cat) {
								return _Utils_eq(cat.dp, oldLabel);
							},
							phonology.ce));
					var newLabel = A2(
						$author$project$Main$findUniqueLabel,
						newCategoryName,
						A2(
							$elm$core$List$filter,
							function (cat) {
								return !_Utils_eq(cat.dp, oldLabel);
							},
							phonology.ce));
					var updatedCategories = A2(
						$elm$core$List$map,
						function (cat) {
							return _Utils_eq(cat.dp, oldLabel) ? _Utils_update(
								cat,
								{dp: newLabel, I: newCategoryName}) : cat;
						},
						phonology.ce);
					var updatedPatterns = A2(
						$elm$core$List$map,
						function (pattern) {
							return _Utils_update(
								pattern,
								{
									dB: A2(
										$elm$core$String$map,
										function (c) {
											return _Utils_eq(c, oldLabel) ? newLabel : c;
										},
										pattern.dB)
								});
						},
						phonology.dC);
					var updatedPhonology = _Utils_update(
						phonology,
						{ce: updatedCategories, dC: updatedPatterns});
					var updatedLanguage = _Utils_update(
						language,
						{dE: updatedPhonology});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								M: '',
								at: $elm$core$Maybe$Nothing,
								a: updatedProject,
								aB: $elm$core$String$fromChar(newLabel),
								a$: false
							}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				}
			case 12:
				var newPhoneme = $elm$core$String$trim(model.bv);
				var language = model.a.ct;
				var phonology = language.dE;
				var categoryLabel = A2(
					$elm$core$Maybe$withDefault,
					'C',
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						$elm$core$String$uncons(model.aB)));
				var updatedCategories = A2(
					$elm$core$List$map,
					function (cat) {
						return _Utils_eq(cat.dp, categoryLabel) ? (($elm$core$String$isEmpty(newPhoneme) || A2($elm$core$List$member, newPhoneme, cat.dM)) ? cat : _Utils_update(
							cat,
							{
								dM: _Utils_ap(
									cat.dM,
									_List_fromArray(
										[newPhoneme]))
							})) : cat;
					},
					phonology.ce);
				var updatedPhonology = _Utils_update(
					phonology,
					{ce: updatedCategories});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bv: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 13:
				var categoryLabel = msg.a;
				var phoneme = msg.b;
				var language = model.a.ct;
				var phonology = language.dE;
				var label = A2(
					$elm$core$Maybe$withDefault,
					'C',
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						$elm$core$String$uncons(categoryLabel)));
				var updatedCategories = A2(
					$elm$core$List$map,
					function (cat) {
						return _Utils_eq(cat.dp, label) ? _Utils_update(
							cat,
							{
								dM: A2(
									$elm$core$List$filter,
									function (p) {
										return !_Utils_eq(p, phoneme);
									},
									cat.dM)
							}) : cat;
					},
					phonology.ce);
				var updatedPhonology = _Utils_update(
					phonology,
					{ce: updatedCategories});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 14:
				var patternStr = $elm$core$String$trim(model.bu);
				var language = model.a.ct;
				var phonology = language.dE;
				var patternExists = A2(
					$elm$core$List$any,
					function (p) {
						return _Utils_eq(p.dB, patternStr);
					},
					phonology.dC);
				var updatedPhonology = ($elm$core$String$isEmpty(patternStr) || patternExists) ? phonology : _Utils_update(
					phonology,
					{
						dC: _Utils_ap(
							phonology.dC,
							_List_fromArray(
								[
									{I: patternStr, dB: patternStr}
								]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bu: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 15:
				var pattern = msg.a;
				var language = model.a.ct;
				var phonology = language.dE;
				var updatedPhonology = _Utils_update(
					phonology,
					{
						dC: A2(
							$elm$core$List$filter,
							function (p) {
								return !_Utils_eq(p.dB, pattern);
							},
							phonology.dC)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 16:
				var pattern = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b9: pattern}),
					$elm$core$Platform$Cmd$none);
			case 17:
				var pattern = msg.a;
				var updatedPatterns = A2($elm$core$List$member, pattern, model.aY) ? A2(
					$elm$core$List$filter,
					function (p) {
						return !_Utils_eq(p, pattern);
					},
					model.aY) : A2($elm$core$List$cons, pattern, model.aY);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aY: updatedPatterns}),
					$elm$core$Platform$Cmd$none);
			case 18:
				var form = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{U: form}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var orthography = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{V: orthography}),
					$elm$core$Platform$Cmd$none);
			case 20:
				var definition = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{S: definition}),
					$elm$core$Platform$Cmd$none);
			case 21:
				var pos = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{W: pos}),
					$elm$core$Platform$Cmd$none);
			case 22:
				var etymology = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{T: etymology}),
					$elm$core$Platform$Cmd$none);
			case 35:
				var query = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cQ: query}),
					$elm$core$Platform$Cmd$none);
			case 36:
				var pos = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cn: pos}),
					$elm$core$Platform$Cmd$none);
			case 23:
				var newWord = {
					ce: _List_Nil,
					c9: $elm$core$String$trim(model.S),
					dc: {
						bZ: _List_Nil,
						cb: $elm$core$String$trim(model.T)
					},
					bR: $elm$core$String$trim(model.U),
					bV: _List_Nil,
					cA: $elm$core$String$trim(model.V),
					cG: model.W,
					dK: {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil},
					ae: ''
				};
				return ($elm$core$String$isEmpty(newWord.bR) || $elm$core$String$isEmpty(newWord.c9)) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							u: $elm$core$Maybe$Just(
								$author$project$Model$ForLexeme(newWord))
						}),
					$author$project$Main$requestUUID(0));
			case 24:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bB: true}),
					$elm$core$Platform$Cmd$none);
			case 25:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bB: false, S: '', T: '', U: '', V: '', W: 'noun'}),
					$elm$core$Platform$Cmd$none);
			case 26:
				var uuid = msg.a;
				var maybeWord = A2($elm$core$Dict$get, uuid, model.a.ct.dt);
				if (!maybeWord.$) {
					var word = maybeWord.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								s: $elm$core$Maybe$Just(uuid),
								a0: true,
								S: word.c9,
								T: word.dc.cb,
								U: word.bR,
								V: word.cA,
								W: word.cG
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 27:
				var _v3 = model.s;
				if (!_v3.$) {
					var uuid = _v3.a;
					var language = model.a.ct;
					var existingWord = A2($elm$core$Dict$get, uuid, language.dt);
					var updatedWord = {
						ce: function () {
							if (!existingWord.$) {
								var existing = existingWord.a;
								return existing.ce;
							} else {
								return _List_Nil;
							}
						}(),
						c9: $elm$core$String$trim(model.S),
						dc: {
							bZ: A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									$elm$core$Maybe$andThen,
									function (e) {
										return $elm$core$Maybe$Just(e.bZ);
									},
									A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.dc;
										},
										existingWord))),
							cb: $elm$core$String$trim(model.T)
						},
						bR: $elm$core$String$trim(model.U),
						bV: function () {
							if (!existingWord.$) {
								var existing = existingWord.a;
								return existing.bV;
							} else {
								return _List_Nil;
							}
						}(),
						cA: $elm$core$String$trim(model.V),
						cG: model.W,
						dK: function () {
							if (!existingWord.$) {
								var existing = existingWord.a;
								return existing.dK;
							} else {
								return {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil};
							}
						}(),
						ae: uuid
					};
					var updatedLexicon = A3($elm$core$Dict$insert, uuid, updatedWord, language.dt);
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ap: '',
								s: $elm$core$Maybe$Nothing,
								a: updatedProject,
								r: _List_Nil,
								ay: '',
								a0: false,
								aE: '',
								j: A2($elm$core$List$cons, model.a, model.j),
								S: '',
								T: '',
								U: '',
								V: '',
								W: 'noun'
							}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 28:
				var uuid = msg.a;
				var language = model.a.ct;
				var updatedLexicon = A2($elm$core$Dict$remove, uuid, language.dt);
				var updatedLanguage = _Utils_update(
					language,
					{dt: updatedLexicon});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							r: _List_Nil,
							j: A2($elm$core$List$cons, model.a, model.j)
						}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 29:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ap: '', s: $elm$core$Maybe$Nothing, ay: '', a0: false, aE: '', S: '', T: '', U: '', V: '', W: 'noun'}),
					$elm$core$Platform$Cmd$none);
			case 30:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a0: false}),
					$elm$core$Platform$Cmd$none);
			case 31:
				var wordUuid = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bt: $elm$core$Maybe$Just(wordUuid),
							bH: true
						}),
					$elm$core$Platform$Cmd$none);
			case 32:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bt: $elm$core$Maybe$Nothing, bH: false}),
					$elm$core$Platform$Cmd$none);
			case 33:
				var wordUuid = msg.a;
				var morphemeIndex = msg.b;
				var language = model.a.ct;
				var lexeme = A2($elm$core$Dict$get, wordUuid, language.dt);
				var morphology = language.dv;
				var morpheme = A2($author$project$WordGeneration$getAt, morphemeIndex, morphology.bV);
				var _v7 = _Utils_Tuple2(lexeme, morpheme);
				if ((!_v7.a.$) && (!_v7.b.$)) {
					var lex = _v7.a.a;
					var morph = _v7.b.a;
					var newLexemeUUID = '';
					var ipaWithMorpheme = A2($author$project$MorphologyHelpers$applyMorpheme, morph, lex.bR);
					var inflectedIPA = A2($author$project$MorphologyHelpers$applyMorphophonemicRules, morphology.cy, ipaWithMorpheme);
					var formWithMorpheme = A2($author$project$MorphologyHelpers$applyMorpheme, morph, lex.cA);
					var inflectedForm = A2($author$project$MorphologyHelpers$applyMorphophonemicRules, morphology.cy, formWithMorpheme);
					var newLexeme = {
						ce: lex.ce,
						c9: lex.c9 + (' + ' + morph.di),
						dc: {bZ: _List_Nil, cb: 'Derived from \'' + (lex.cA + ('\' + ' + morph.bR))},
						bR: inflectedIPA,
						bV: _Utils_ap(
							lex.bV,
							_List_fromArray(
								[morph.di])),
						cA: inflectedForm,
						cG: lex.cG,
						dK: lex.dK,
						ae: newLexemeUUID
					};
					var updatedLexicon = A3($elm$core$Dict$insert, newLexemeUUID, newLexeme, language.dt);
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bt: $elm$core$Maybe$Nothing, a: updatedProject, bH: false}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 34:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 37:
				var pattern = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b9: pattern}),
					$elm$core$Platform$Cmd$none);
			case 38:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$random$Random$generate,
						$author$project$Msg$WordsGenerated,
						$author$project$WordGeneration$generateWordsCmd(model)));
			case 39:
				var words = msg.a;
				var language = model.a.ct;
				var updatedLanguage = _Utils_update(
					language,
					{dh: words});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dh: words, a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 40:
				var updatedProject = {ch: model.a.ch, bn: model.a.bn, ct: model.a.ct, cu: model.b, I: model.a.I};
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 41:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{br: true}),
					$author$project$Main$getCurrentTime(0));
			case 42:
				return _Utils_Tuple2(
					model,
					$author$project$Main$triggerImport(0));
			case 43:
				var jsonStr = msg.a;
				var _v8 = A2($elm$json$Json$Decode$decodeString, $author$project$JsonCodec$projectDecoder, jsonStr);
				if (!_v8.$) {
					var project = _v8.a;
					var updatedProject = _Utils_update(
						project,
						{ch: model.b, bn: 0, cu: model.b});
					var updatedModel = _Utils_update(
						model,
						{bo: $elm$core$Maybe$Nothing, a: updatedProject});
					return _Utils_Tuple2(
						updatedModel,
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					var error = _v8.a;
					var userFriendlyError = 'Failed to import project. The file may be corrupted or not a valid clctk export. ' + ('Technical details: ' + $elm$json$Json$Decode$errorToString(error));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bo: $elm$core$Maybe$Just(userFriendlyError)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 44:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bo: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 46:
				var timestamp = msg.a;
				return model.br ? _Utils_Tuple2(
					_Utils_update(
						model,
						{b: timestamp, br: false}),
					$author$project$Main$exportProject(
						A2($author$project$JsonCodec$encodeExport, timestamp, model.a))) : _Utils_Tuple2(
					_Utils_update(
						model,
						{b: timestamp}),
					$elm$core$Platform$Cmd$none);
			case 47:
				var uuid = msg.a;
				var _v9 = model.u;
				if (!_v9.$) {
					switch (_v9.a.$) {
						case 0:
							var lexeme = _v9.a.a;
							var lexemeWithUUID = _Utils_update(
								lexeme,
								{ae: uuid});
							var language = model.a.ct;
							var updatedLexicon = A3($elm$core$Dict$insert, uuid, lexemeWithUUID, language.dt);
							var updatedLanguage = _Utils_update(
								language,
								{dt: updatedLexicon});
							var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{u: $elm$core$Maybe$Nothing, a: updatedProject, bB: false, S: '', T: '', U: '', V: '', W: 'noun'}),
								$author$project$Main$saveToStorage(
									$author$project$JsonCodec$encodeProject(updatedProject)));
						case 1:
							var _v10 = _v9.a;
							var name = _v10.a;
							var label = _v10.b;
							var newCategory = {dp: label, I: name, dM: _List_Nil, ae: uuid};
							var language = model.a.ct;
							var phonology = language.dE;
							var updatedPhonology = _Utils_update(
								phonology,
								{
									ce: _Utils_ap(
										phonology.ce,
										_List_fromArray(
											[newCategory]))
								});
							var updatedLanguage = _Utils_update(
								language,
								{dE: updatedPhonology});
							var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{bO: '', u: $elm$core$Maybe$Nothing, a: updatedProject, bA: false}),
								$author$project$Main$saveToStorage(
									$author$project$JsonCodec$encodeProject(updatedProject)));
						case 2:
							var featureName = _v9.a.a;
							var newFeature = {I: featureName, ae: uuid, dR: _List_Nil};
							var language = model.a.ct;
							var morphology = language.dv;
							var updatedMorphology = _Utils_update(
								morphology,
								{
									bQ: _Utils_ap(
										morphology.bQ,
										_List_fromArray(
											[newFeature]))
								});
							var updatedLanguage = _Utils_update(
								language,
								{dv: updatedMorphology});
							var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{bi: '', u: $elm$core$Maybe$Nothing, a: updatedProject}),
								$author$project$Main$saveToStorage(
									$author$project$JsonCodec$encodeProject(updatedProject)));
						case 3:
							var morpheme = _v9.a.a;
							var morphemeWithUUID = _Utils_update(
								morpheme,
								{ae: uuid});
							var language = model.a.ct;
							var morphology = language.dv;
							var updatedMorphology = _Utils_update(
								morphology,
								{
									bV: _Utils_ap(
										morphology.bV,
										_List_fromArray(
											[morphemeWithUUID]))
								});
							var updatedLanguage = _Utils_update(
								language,
								{dv: updatedMorphology});
							var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{B: '', C: '', D: '', E: '', u: $elm$core$Maybe$Nothing, a: updatedProject, bC: false}),
								$author$project$Main$saveToStorage(
									$author$project$JsonCodec$encodeProject(updatedProject)));
						case 4:
							var family = _v9.a.a;
							var familyWithUUID = _Utils_update(
								family,
								{ae: uuid});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										x: '',
										y: '',
										z: $elm$core$Maybe$Nothing,
										m: _Utils_ap(
											model.m,
											_List_fromArray(
												[familyWithUUID])),
										u: $elm$core$Maybe$Nothing,
										ab: false
									}),
								$author$project$Main$saveLanguageFamily(
									$author$project$JsonCodec$encodeLanguageFamily(familyWithUUID)));
						case 5:
							var langProject = _v9.a.a;
							var projectWithUUID = _Utils_update(
								langProject,
								{ae: uuid});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										P: _Utils_ap(
											model.P,
											_List_fromArray(
												[projectWithUUID])),
										u: $elm$core$Maybe$Nothing,
										F: '',
										G: '',
										ac: false
									}),
								$author$project$Main$saveLanguageProject(
									$author$project$JsonCodec$encodeLanguageProject(projectWithUUID)));
						default:
							var language = _v9.a.a;
							var languageWithUUID = _Utils_update(
								language,
								{ae: uuid});
							var currentProject = model.a;
							var updatedProject = _Utils_update(
								currentProject,
								{ct: languageWithUUID});
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{u: $elm$core$Maybe$Nothing, a: updatedProject}),
								$author$project$Main$saveToStorage(
									$author$project$JsonCodec$encodeProject(updatedProject)));
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 45:
				var value = msg.a;
				var _v11 = A2($elm$json$Json$Decode$decodeValue, $author$project$JsonCodec$projectDecoder, value);
				if (!_v11.$) {
					var project = _v11.a;
					var migratedLanguage = $author$project$UUIDHelpers$migrateLanguageWithUUIDs(project.ct);
					var migratedProject = _Utils_update(
						project,
						{ct: migratedLanguage});
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{O: project.bn, dh: migratedLanguage.dh, a: migratedProject}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 48:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{be: input}),
					$elm$core$Platform$Cmd$none);
			case 49:
				var constraintType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{c7: constraintType}),
					$elm$core$Platform$Cmd$none);
			case 50:
				var sequence = $elm$core$String$trim(model.be);
				var language = model.a.ct;
				var phonology = language.dE;
				var description = A2($author$project$UpdateHelpers$constraintTypeToDescription, model.c7, sequence);
				var newConstraint = {c7: model.c7, aq: description, dL: sequence};
				var constraintExists = A2(
					$elm$core$List$any,
					function (c) {
						return _Utils_eq(c.dL, sequence) && _Utils_eq(c.c7, model.c7);
					},
					phonology.c8);
				var updatedPhonology = ($elm$core$String$isEmpty(sequence) || constraintExists) ? phonology : _Utils_update(
					phonology,
					{
						c8: _Utils_ap(
							phonology.c8,
							_List_fromArray(
								[newConstraint]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{be: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 51:
				var constraint = msg.a;
				var language = model.a.ct;
				var phonology = language.dE;
				var updatedPhonology = _Utils_update(
					phonology,
					{
						c8: A2(
							$elm$core$List$filter,
							function (c) {
								return !(_Utils_eq(c.dL, constraint.dL) && _Utils_eq(c.c7, constraint.c7));
							},
							phonology.c8)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 52:
				var tab = msg.a;
				var updatedTabSections = A3($elm$core$Dict$insert, model.ao, model.X, model.L);
				var defaultSection = function () {
					switch (tab) {
						case 'languages':
							return 'languages';
						case 'phonology':
							return 'ipa-charts';
						case 'morphology':
							return 'features';
						case 'lexicon':
							return 'lexicon';
						default:
							return 'languages';
					}
				}();
				var newSection = A2(
					$elm$core$Maybe$withDefault,
					defaultSection,
					A2($elm$core$Dict$get, tab, updatedTabSections));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{X: newSection, ao: tab, L: updatedTabSections}),
					$author$project$Main$savePreference(
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'activeTab',
									$elm$json$Json$Encode$string(tab)),
									_Utils_Tuple2(
									'activeSection',
									$elm$json$Json$Encode$string(newSection)),
									_Utils_Tuple2(
									'tabSections',
									$author$project$JsonCodec$encodeTabSections(updatedTabSections))
								]))));
			case 53:
				var section = msg.a;
				var updatedTabSections = A3($elm$core$Dict$insert, model.ao, section, model.L);
				var sectionCmd = function () {
					switch (section) {
						case 'languages':
							return $author$project$Main$loadAllProjects(0);
						case 'language-families':
							return $author$project$Main$loadAllLanguageFamilies(0);
						case 'templates':
							return $author$project$Main$loadAllTemplates(0);
						default:
							return $elm$core$Platform$Cmd$none;
					}
				}();
				var preferenceCmd = $author$project$Main$savePreference(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'activeSection',
								$elm$json$Json$Encode$string(section)),
								_Utils_Tuple2(
								'tabSections',
								$author$project$JsonCodec$encodeTabSections(updatedTabSections))
							])));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{X: section, aN: false, L: updatedTabSections}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[sectionCmd, preferenceCmd])));
			case 54:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bi: input}),
					$elm$core$Platform$Cmd$none);
			case 55:
				var featureName = msg.a;
				var input = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							av: A3($elm$core$Dict$insert, featureName, input, model.av)
						}),
					$elm$core$Platform$Cmd$none);
			case 56:
				var language = model.a.ct;
				var morphology = language.dv;
				var featureName = $elm$core$String$trim(model.bi);
				var featureExists = A2(
					$elm$core$List$any,
					function (f) {
						return _Utils_eq(f.I, featureName);
					},
					morphology.bQ);
				return ($elm$core$String$isEmpty(featureName) || featureExists) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							u: $elm$core$Maybe$Just(
								$author$project$Model$ForGrammaticalFeature(featureName))
						}),
					$author$project$Main$requestUUID(0));
			case 57:
				var featureName = msg.a;
				var value = $elm$core$String$trim(
					A2(
						$elm$core$Maybe$withDefault,
						'',
						A2($elm$core$Dict$get, featureName, model.av)));
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedFeatures = A2(
					$elm$core$List$map,
					function (feature) {
						return (_Utils_eq(feature.I, featureName) && ((!$elm$core$String$isEmpty(value)) && (!A2($elm$core$List$member, value, feature.dR)))) ? _Utils_update(
							feature,
							{
								dR: _Utils_ap(
									feature.dR,
									_List_fromArray(
										[value]))
							}) : feature;
					},
					morphology.bQ);
				var updatedMorphology = _Utils_update(
					morphology,
					{bQ: updatedFeatures});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							av: A2($elm$core$Dict$remove, featureName, model.av),
							a: updatedProject
						}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 58:
				var featureName = msg.a;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						bQ: A2(
							$elm$core$List$filter,
							function (f) {
								return !_Utils_eq(f.I, featureName);
							},
							morphology.bQ)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 59:
				var featureName = msg.a;
				var value = msg.b;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedFeatures = A2(
					$elm$core$List$map,
					function (feature) {
						return _Utils_eq(feature.I, featureName) ? _Utils_update(
							feature,
							{
								dR: A2(
									$elm$core$List$filter,
									function (v) {
										return !_Utils_eq(v, value);
									},
									feature.dR)
							}) : feature;
					},
					morphology.bQ);
				var updatedMorphology = _Utils_update(
					morphology,
					{bQ: updatedFeatures});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 60:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{C: input}),
					$elm$core$Platform$Cmd$none);
			case 61:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{D: input}),
					$elm$core$Platform$Cmd$none);
			case 62:
				var morphemeType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{H: morphemeType}),
					$elm$core$Platform$Cmd$none);
			case 63:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{B: input}),
					$elm$core$Platform$Cmd$none);
			case 64:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{E: input}),
					$elm$core$Platform$Cmd$none);
			case 65:
				var value = $elm$core$String$trim(model.E);
				var gloss = $elm$core$String$trim(model.D);
				var form = $elm$core$String$trim(model.C);
				var feature = $elm$core$String$trim(model.B);
				var newMorpheme = {df: feature, bR: form, di: gloss, du: model.H, ae: '', dQ: value};
				return ($elm$core$String$isEmpty(form) || $elm$core$String$isEmpty(gloss)) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							u: $elm$core$Maybe$Just(
								$author$project$Model$ForMorpheme(newMorpheme))
						}),
					$author$project$Main$requestUUID(0));
			case 66:
				var morpheme = msg.a;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						bV: A2(
							$elm$core$List$filter,
							function (m) {
								return !(_Utils_eq(m.bR, morpheme.bR) && _Utils_eq(m.di, morpheme.di));
							},
							morphology.bV)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 67:
				var index = msg.a;
				var morpheme = A2($author$project$WordGeneration$getAt, index, model.a.ct.dv.bV);
				if (!morpheme.$) {
					var m = morpheme.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								Z: $elm$core$Maybe$Just(index),
								B: m.df,
								C: m.bR,
								D: m.di,
								H: m.du,
								E: m.dQ,
								bG: true
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 68:
				var _v15 = model.Z;
				if (!_v15.$) {
					var index = _v15.a;
					var value = $elm$core$String$trim(model.E);
					var language = model.a.ct;
					var morphology = language.dv;
					var gloss = $elm$core$String$trim(model.D);
					var form = $elm$core$String$trim(model.C);
					var feature = $elm$core$String$trim(model.B);
					var existingUuid = A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.ae;
							},
							A2($author$project$WordGeneration$getAt, index, morphology.bV)));
					var updatedMorpheme = {df: feature, bR: form, di: gloss, du: model.H, ae: existingUuid, dQ: value};
					var updatedMorphemes = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, m) {
								return _Utils_eq(i, index) ? updatedMorpheme : m;
							}),
						morphology.bV);
					var updatedMorphology = ($elm$core$String$isEmpty(form) || $elm$core$String$isEmpty(gloss)) ? morphology : _Utils_update(
						morphology,
						{bV: updatedMorphemes});
					var updatedLanguage = _Utils_update(
						language,
						{dv: updatedMorphology});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{Z: $elm$core$Maybe$Nothing, B: '', C: '', D: '', H: 1, E: '', a: updatedProject, bG: false}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 69:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: $elm$core$Maybe$Nothing, B: '', C: '', D: '', H: 1, E: ''}),
					$elm$core$Platform$Cmd$none);
			case 70:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aP: input}),
					$elm$core$Platform$Cmd$none);
			case 71:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aQ: input}),
					$elm$core$Platform$Cmd$none);
			case 72:
				var featureName = msg.a;
				var newSelected = A2($elm$core$List$member, featureName, model.aa) ? A2(
					$elm$core$List$filter,
					function (f) {
						return !_Utils_eq(f, featureName);
					},
					model.aa) : _Utils_ap(
					model.aa,
					_List_fromArray(
						[featureName]));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aa: newSelected}),
					$elm$core$Platform$Cmd$none);
			case 73:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bp: input}),
					$elm$core$Platform$Cmd$none);
			case 74:
				var pos = $elm$core$String$trim(model.aQ);
				var paradigmName = $elm$core$String$trim(model.aP);
				var language = model.a.ct;
				var morphology = language.dv;
				var selectedFeatureObjects = A2(
					$elm$core$List$filterMap,
					function (fname) {
						return $elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (f) {
									return _Utils_eq(f.I, fname);
								},
								morphology.bQ));
					},
					model.aa);
				var combinations = $author$project$MorphologyHelpers$generateFeatureCombinations(selectedFeatureObjects);
				var base = $elm$core$String$trim(model.bp);
				var newParadigm = {
					c3: base,
					dg: A2(
						$elm$core$List$map,
						function (combo) {
							return {bQ: combo, bR: ''};
						},
						combinations),
					I: paradigmName,
					cG: pos
				};
				var updatedMorphology = ($elm$core$String$isEmpty(paradigmName) || ($elm$core$String$isEmpty(pos) || $elm$core$List$isEmpty(combinations))) ? morphology : _Utils_update(
					morphology,
					{
						cC: _Utils_ap(
							morphology.cC,
							_List_fromArray(
								[newParadigm]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bp: '', aP: '', aQ: '', a: updatedProject, aa: _List_Nil, bD: false}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 75:
				var paradigmName = msg.a;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						cC: A2(
							$elm$core$List$filter,
							function (p) {
								return !_Utils_eq(p.I, paradigmName);
							},
							morphology.cC)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 76:
				var paradigmName = msg.a;
				var newForm = msg.b;
				var featureCombination = msg.c;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.I, paradigmName) ? _Utils_update(
							paradigm,
							{
								dg: A2(
									$elm$core$List$map,
									function (combo) {
										return _Utils_eq(combo.bQ, featureCombination) ? _Utils_update(
											combo,
											{bR: newForm}) : combo;
									},
									paradigm.dg)
							}) : paradigm;
					},
					morphology.cC);
				var updatedMorphology = _Utils_update(
					morphology,
					{cC: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 77:
				var paradigmName = msg.a;
				var newBaseForm = msg.b;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.I, paradigmName) ? _Utils_update(
							paradigm,
							{c3: newBaseForm}) : paradigm;
					},
					morphology.cC);
				var updatedMorphology = _Utils_update(
					morphology,
					{cC: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 78:
				var paradigmName = msg.a;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.I, paradigmName) ? _Utils_update(
							paradigm,
							{
								dg: A2(
									$elm$core$List$map,
									function (combo) {
										return _Utils_update(
											combo,
											{
												bR: A4($author$project$MorphologyHelpers$generateInflectedForm, paradigm.c3, combo.bQ, morphology.bV, morphology.cy)
											});
									},
									paradigm.dg)
							}) : paradigm;
					},
					morphology.cC);
				var updatedMorphology = _Utils_update(
					morphology,
					{cC: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 79:
				var paradigmName = msg.a;
				var language = model.a.ct;
				var morphology = language.dv;
				var maybeDuplicate = A2(
					$elm$core$Maybe$map,
					function (original) {
						var baseName = A2($elm$core$String$endsWith, ' (Copy)', original.I) ? A2($elm$core$String$dropRight, 7, original.I) : original.I;
						var existingCopies = $elm$core$List$length(
							A2(
								$elm$core$List$filter,
								function (p) {
									return A2($elm$core$String$startsWith, baseName, p.I);
								},
								morphology.cC));
						var newName = (existingCopies === 1) ? (baseName + ' (Copy)') : (baseName + (' (Copy ' + ($elm$core$String$fromInt(existingCopies) + ')')));
						return _Utils_update(
							original,
							{
								dg: A2(
									$elm$core$List$map,
									function (fc) {
										return _Utils_update(
											fc,
											{bR: ''});
									},
									original.dg),
								I: newName
							});
					},
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (p) {
								return _Utils_eq(p.I, paradigmName);
							},
							morphology.cC)));
				var updatedMorphology = function () {
					if (!maybeDuplicate.$) {
						var duplicate = maybeDuplicate.a;
						return _Utils_update(
							morphology,
							{
								cC: _Utils_ap(
									morphology.cC,
									_List_fromArray(
										[duplicate]))
							});
					} else {
						return morphology;
					}
				}();
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 80:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aU: input}),
					$elm$core$Platform$Cmd$none);
			case 81:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aS: input}),
					$elm$core$Platform$Cmd$none);
			case 82:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aW: input}),
					$elm$core$Platform$Cmd$none);
			case 83:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aV: input}),
					$elm$core$Platform$Cmd$none);
			case 84:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aT: input}),
					$elm$core$Platform$Cmd$none);
			case 85:
				var ruleType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bz: ruleType}),
					$elm$core$Platform$Cmd$none);
			case 86:
				var target = $elm$core$String$trim(model.aW);
				var replacement = $elm$core$String$trim(model.aV);
				var name = $elm$core$String$trim(model.aU);
				var language = model.a.ct;
				var morphology = language.dv;
				var description = $elm$core$String$trim(model.aT);
				var context = $elm$core$String$trim(model.aS);
				var newRule = {cg: context, aq: description, I: name, dH: replacement, dJ: model.bz, dO: target};
				var updatedMorphology = ($elm$core$String$isEmpty(name) || ($elm$core$String$isEmpty(target) || $elm$core$String$isEmpty(replacement))) ? morphology : _Utils_update(
					morphology,
					{
						cy: _Utils_ap(
							morphology.cy,
							_List_fromArray(
								[newRule]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject, aS: '', aT: '', aU: '', aV: '', aW: '', bE: false}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 87:
				var rule = msg.a;
				var language = model.a.ct;
				var morphology = language.dv;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						cy: A2(
							$elm$core$List$filter,
							function (r) {
								return !(_Utils_eq(r.I, rule.I) && _Utils_eq(r.dO, rule.dO));
							},
							morphology.cy)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 88:
				var paradigmName = msg.a;
				var language = model.a.ct;
				var morphology = language.dv;
				var rules = morphology.cy;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.I, paradigmName) ? _Utils_update(
							paradigm,
							{
								dg: A2(
									$elm$core$List$map,
									function (combo) {
										return _Utils_update(
											combo,
											{
												bR: A2($author$project$MorphologyHelpers$applyMorphophonemicRules, rules, combo.bR)
											});
									},
									paradigm.dg)
							}) : paradigm;
					},
					morphology.cC);
				var updatedMorphology = _Utils_update(
					morphology,
					{cC: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{dv: updatedMorphology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 89:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aE: input}),
					$elm$core$Platform$Cmd$none);
			case 90:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ap: input}),
					$elm$core$Platform$Cmd$none);
			case 91:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ay: input}),
					$elm$core$Platform$Cmd$none);
			case 92:
				var _v17 = model.s;
				if (!_v17.$) {
					var uuid = _v17.a;
					var synonym = $elm$core$String$trim(model.aE);
					var language = model.a.ct;
					var updatedLexicon = (!$elm$core$String$isEmpty(synonym)) ? A3(
						$elm$core$Dict$update,
						uuid,
						$elm$core$Maybe$map(
							function (word) {
								var links = word.dK;
								var updatedLinks = _Utils_update(
									links,
									{
										cS: _Utils_ap(
											links.cS,
											_List_fromArray(
												[synonym]))
									});
								return _Utils_update(
									word,
									{dK: updatedLinks});
							}),
						language.dt) : language.dt;
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject, aE: ''}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 93:
				var _v18 = model.s;
				if (!_v18.$) {
					var uuid = _v18.a;
					var language = model.a.ct;
					var antonym = $elm$core$String$trim(model.ap);
					var updatedLexicon = (!$elm$core$String$isEmpty(antonym)) ? A3(
						$elm$core$Dict$update,
						uuid,
						$elm$core$Maybe$map(
							function (word) {
								var links = word.dK;
								var updatedLinks = _Utils_update(
									links,
									{
										cd: _Utils_ap(
											links.cd,
											_List_fromArray(
												[antonym]))
									});
								return _Utils_update(
									word,
									{dK: updatedLinks});
							}),
						language.dt) : language.dt;
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ap: '', a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 94:
				var _v19 = model.s;
				if (!_v19.$) {
					var uuid = _v19.a;
					var related = $elm$core$String$trim(model.ay);
					var language = model.a.ct;
					var updatedLexicon = (!$elm$core$String$isEmpty(related)) ? A3(
						$elm$core$Dict$update,
						uuid,
						$elm$core$Maybe$map(
							function (word) {
								var links = word.dK;
								var updatedLinks = _Utils_update(
									links,
									{
										cM: _Utils_ap(
											links.cM,
											_List_fromArray(
												[related]))
									});
								return _Utils_update(
									word,
									{dK: updatedLinks});
							}),
						language.dt) : language.dt;
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject, ay: ''}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 95:
				var synonym = msg.a;
				var _v20 = model.s;
				if (!_v20.$) {
					var uuid = _v20.a;
					var language = model.a.ct;
					var updatedLexicon = A3(
						$elm$core$Dict$update,
						uuid,
						$elm$core$Maybe$map(
							function (word) {
								var links = word.dK;
								var updatedLinks = _Utils_update(
									links,
									{
										cS: A2(
											$elm$core$List$filter,
											function (s) {
												return !_Utils_eq(s, synonym);
											},
											links.cS)
									});
								return _Utils_update(
									word,
									{dK: updatedLinks});
							}),
						language.dt);
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 96:
				var antonym = msg.a;
				var _v21 = model.s;
				if (!_v21.$) {
					var uuid = _v21.a;
					var language = model.a.ct;
					var updatedLexicon = A3(
						$elm$core$Dict$update,
						uuid,
						$elm$core$Maybe$map(
							function (word) {
								var links = word.dK;
								var updatedLinks = _Utils_update(
									links,
									{
										cd: A2(
											$elm$core$List$filter,
											function (a) {
												return !_Utils_eq(a, antonym);
											},
											links.cd)
									});
								return _Utils_update(
									word,
									{dK: updatedLinks});
							}),
						language.dt);
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 97:
				var related = msg.a;
				var _v22 = model.s;
				if (!_v22.$) {
					var uuid = _v22.a;
					var language = model.a.ct;
					var updatedLexicon = A3(
						$elm$core$Dict$update,
						uuid,
						$elm$core$Maybe$map(
							function (word) {
								var links = word.dK;
								var updatedLinks = _Utils_update(
									links,
									{
										cM: A2(
											$elm$core$List$filter,
											function (r) {
												return !_Utils_eq(r, related);
											},
											links.cM)
									});
								return _Utils_update(
									word,
									{dK: updatedLinks});
							}),
						language.dt);
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 98:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bs: input}),
					$elm$core$Platform$Cmd$none);
			case 99:
				var _v23 = model.s;
				if (!_v23.$) {
					var uuid = _v23.a;
					var trimmedCategory = $elm$core$String$trim(model.bs);
					if ($elm$core$String$isEmpty(trimmedCategory)) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var language = model.a.ct;
						var updatedLexicon = A3(
							$elm$core$Dict$update,
							uuid,
							$elm$core$Maybe$map(
								function (word) {
									return A2($elm$core$List$member, trimmedCategory, word.ce) ? word : _Utils_update(
										word,
										{
											ce: _Utils_ap(
												word.ce,
												_List_fromArray(
													[trimmedCategory]))
										});
								}),
							language.dt);
						var updatedLanguage = _Utils_update(
							language,
							{dt: updatedLexicon});
						var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{bs: '', a: updatedProject}),
							$author$project$Main$saveToStorage(
								$author$project$JsonCodec$encodeProject(updatedProject)));
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 100:
				var category = msg.a;
				var _v24 = model.s;
				if (!_v24.$) {
					var uuid = _v24.a;
					var language = model.a.ct;
					var updatedLexicon = A3(
						$elm$core$Dict$update,
						uuid,
						$elm$core$Maybe$map(
							function (word) {
								return _Utils_update(
									word,
									{
										ce: A2(
											$elm$core$List$filter,
											function (c) {
												return !_Utils_eq(c, category);
											},
											word.ce)
									});
							}),
						language.dt);
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 101:
				var category = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cm: category}),
					$elm$core$Platform$Cmd$none);
			case 102:
				var uuid = msg.a;
				var updatedSelection = A2($elm$core$List$member, uuid, model.q) ? A2(
					$elm$core$List$filter,
					function (u) {
						return !_Utils_eq(u, uuid);
					},
					model.q) : _Utils_ap(
					model.q,
					_List_fromArray(
						[uuid]));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{q: updatedSelection}),
					$elm$core$Platform$Cmd$none);
			case 103:
				var allUuids = $elm$core$Dict$keys(model.a.ct.dt);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{q: allUuids}),
					$elm$core$Platform$Cmd$none);
			case 104:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{q: _List_Nil}),
					$elm$core$Platform$Cmd$none);
			case 105:
				return $elm$core$List$isEmpty(model.q) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{bF: true}),
					$elm$core$Platform$Cmd$none);
			case 176:
				var language = model.a.ct;
				var updatedLexicon = A3(
					$elm$core$List$foldl,
					F2(
						function (uuidToRemove, lex) {
							return A2($elm$core$Dict$remove, uuidToRemove, lex);
						}),
					language.dt,
					model.q);
				var updatedLanguage = _Utils_update(
					language,
					{dt: updatedLexicon});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							r: _List_Nil,
							q: _List_Nil,
							bF: false,
							j: A2($elm$core$List$cons, model.a, model.j)
						}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 177:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bF: false}),
					$elm$core$Platform$Cmd$none);
			case 106:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bN: input}),
					$elm$core$Platform$Cmd$none);
			case 107:
				var language = model.a.ct;
				var updatedLexicon = A2(
					$elm$core$Dict$map,
					F2(
						function (uuid, word) {
							return A2($elm$core$List$member, uuid, model.q) ? _Utils_update(
								word,
								{cG: model.bN}) : word;
						}),
					language.dt);
				var updatedLanguage = _Utils_update(
					language,
					{dt: updatedLexicon});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							r: _List_Nil,
							q: _List_Nil,
							j: A2($elm$core$List$cons, model.a, model.j)
						}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 108:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ba: input}),
					$elm$core$Platform$Cmd$none);
			case 109:
				var trimmedCategory = $elm$core$String$trim(model.ba);
				if ($elm$core$String$isEmpty(trimmedCategory)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var language = model.a.ct;
					var updatedLexicon = A2(
						$elm$core$Dict$map,
						F2(
							function (uuid, word) {
								return A2($elm$core$List$member, uuid, model.q) ? (A2($elm$core$List$member, trimmedCategory, word.ce) ? word : _Utils_update(
									word,
									{
										ce: _Utils_ap(
											word.ce,
											_List_fromArray(
												[trimmedCategory]))
									})) : word;
							}),
						language.dt);
					var updatedLanguage = _Utils_update(
						language,
						{dt: updatedLexicon});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ba: '',
								a: updatedProject,
								r: _List_Nil,
								q: _List_Nil,
								j: A2($elm$core$List$cons, model.a, model.j)
							}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				}
			case 110:
				var language = model.a.ct;
				var selectedLexemes = A2(
					$elm$core$List$filterMap,
					function (uuid) {
						return A2($elm$core$Dict$get, uuid, language.dt);
					},
					model.q);
				var exportData = $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'clctk_version',
							$elm$json$Json$Encode$string('1.0.0')),
							_Utils_Tuple2(
							'export_type',
							$elm$json$Json$Encode$string('lexicon_selection')),
							_Utils_Tuple2(
							'export_date',
							$elm$json$Json$Encode$string(model.b)),
							_Utils_Tuple2(
							'project_name',
							$elm$json$Json$Encode$string(model.a.I)),
							_Utils_Tuple2(
							'lexicon',
							A2($elm$json$Json$Encode$list, $author$project$JsonCodec$encodeLexeme, selectedLexemes))
						]));
				return _Utils_Tuple2(
					model,
					$author$project$Main$exportProject(exportData));
			case 111:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{R: !model.R}),
					(!model.R) ? $author$project$Main$loadAllProjects(0) : $elm$core$Platform$Cmd$none);
			case 114:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ak: input}),
					$elm$core$Platform$Cmd$none);
			case 112:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ak: '', bI: true}),
					$elm$core$Platform$Cmd$none);
			case 113:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ak: '', bI: false}),
					$elm$core$Platform$Cmd$none);
			case 115:
				if ($elm$core$String$isEmpty(
					$elm$core$String$trim(model.ak))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var newProject = {
						ch: model.b,
						bn: 0,
						ct: {
							dh: _List_Nil,
							dq: $elm$core$Maybe$Nothing,
							dt: $elm$core$Dict$empty,
							dv: {bQ: _List_Nil, bV: _List_Nil, cy: _List_Nil, cC: _List_Nil},
							dE: {
								ce: _List_fromArray(
									[
										{
										dp: 'C',
										I: 'Consonants',
										dM: _List_fromArray(
											['p', 't', 'k', 'm', 'n', 's', 'l', 'r']),
										ae: ''
									},
										{
										dp: 'V',
										I: 'Vowels',
										dM: _List_fromArray(
											['a', 'e', 'i', 'o', 'u']),
										ae: ''
									}
									]),
								c8: _List_Nil,
								da: _List_Nil,
								cA: {cj: 0, cq: _List_Nil},
								dC: _List_fromArray(
									[
										{I: 'CV', dB: 'CV'},
										{I: 'CVC', dB: 'CVC'}
									])
							},
							ae: ''
						},
						cu: model.b,
						I: model.ak
					};
					var updatedModel = _Utils_update(
						model,
						{ak: '', a: newProject, bI: false, R: false});
					return _Utils_Tuple2(
						updatedModel,
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(newProject)));
				}
			case 116:
				var templateName = msg.a;
				var allTemplates = _Utils_ap($author$project$Templates$availableTemplates, model.a9);
				var maybeTemplate = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (t) {
							return _Utils_eq(t.I, templateName);
						},
						allTemplates));
				var defaultName = function () {
					if (!maybeTemplate.$) {
						var template = maybeTemplate.a;
						return template.I;
					} else {
						return '';
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aw: $elm$core$Maybe$Nothing,
							aj: defaultName,
							aC: true,
							aF: $elm$core$Maybe$Just(templateName)
						}),
					$elm$core$Platform$Cmd$none);
			case 117:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aw: $elm$core$Maybe$Nothing, aj: '', aC: false, aF: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 118:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aj: input}),
					$elm$core$Platform$Cmd$none);
			case 119:
				var familyId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aw: familyId}),
					$elm$core$Platform$Cmd$none);
			case 120:
				var _v26 = model.aF;
				if (!_v26.$) {
					var templateName = _v26.a;
					var allTemplates = _Utils_ap($author$project$Templates$availableTemplates, model.a9);
					var maybeTemplate = $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (t) {
								return _Utils_eq(t.I, templateName);
							},
							allTemplates));
					if (!maybeTemplate.$) {
						var template = maybeTemplate.a;
						var updatedTabSections = A3($elm$core$Dict$insert, 'languages', 'languages', model.L);
						var updatedLanguage = function () {
							var lang = template.ct;
							var familyUuid = function () {
								var _v28 = model.aw;
								if (!_v28.$) {
									var familyId = _v28.a;
									return A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.ae;
										},
										$elm$core$List$head(
											A2(
												$elm$core$List$filter,
												function (f) {
													return _Utils_eq(f.bn, familyId);
												},
												model.m)));
								} else {
									return $elm$core$Maybe$Nothing;
								}
							}();
							return _Utils_update(
								lang,
								{dq: familyUuid});
						}();
						var projectName = $elm$core$String$isEmpty(
							$elm$core$String$trim(model.aj)) ? template.I : $elm$core$String$trim(model.aj);
						var preferenceCmd = $author$project$Main$savePreference(
							$elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'activeSection',
										$elm$json$Json$Encode$string('languages')),
										_Utils_Tuple2(
										'tabSections',
										$author$project$JsonCodec$encodeTabSections(updatedTabSections))
									])));
						var newProject = {ch: model.b, bn: 0, ct: updatedLanguage, cu: model.b, I: projectName};
						var updatedModel = _Utils_update(
							model,
							{X: 'languages', O: 0, dh: newProject.ct.dh, aw: $elm$core$Maybe$Nothing, aj: '', a: newProject, r: _List_Nil, aC: false, R: false, L: updatedTabSections, aF: $elm$core$Maybe$Nothing, j: _List_Nil});
						return _Utils_Tuple2(
							updatedModel,
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										$author$project$Main$saveToStorage(
										$author$project$JsonCodec$encodeProject(newProject)),
										preferenceCmd,
										$author$project$Main$loadAllProjects(0)
									])));
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aC: false, aF: $elm$core$Maybe$Nothing}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aC: false}),
						$elm$core$Platform$Cmd$none);
				}
			case 121:
				var templateName = msg.a;
				var allTemplates = _Utils_ap($author$project$Templates$availableTemplates, model.a9);
				var maybeTemplate = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (t) {
							return _Utils_eq(t.I, templateName);
						},
						allTemplates));
				if (!maybeTemplate.$) {
					var template = maybeTemplate.a;
					var updatedTabSections = A3($elm$core$Dict$insert, 'languages', 'languages', model.L);
					var preferenceCmd = $author$project$Main$savePreference(
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'activeSection',
									$elm$json$Json$Encode$string('languages')),
									_Utils_Tuple2(
									'tabSections',
									$author$project$JsonCodec$encodeTabSections(updatedTabSections))
								])));
					var newProject = {ch: model.b, bn: 0, ct: template.ct, cu: model.b, I: template.I + ' Project'};
					var updatedModel = _Utils_update(
						model,
						{X: 'languages', a: newProject, R: false, L: updatedTabSections});
					return _Utils_Tuple2(
						updatedModel,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$saveToStorage(
									$author$project$JsonCodec$encodeProject(newProject)),
									preferenceCmd,
									$author$project$Main$loadAllProjects(0)
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 122:
				if ($elm$core$String$isEmpty(
					$elm$core$String$trim(model.aA))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var newTemplate = {aq: model.aX, bn: 0, $7: false, ct: model.a.ct, I: model.aA};
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aX: '', aA: '', bJ: false}),
						$author$project$Main$saveTemplateToStorage(
							$author$project$JsonCodec$encodeTemplate(newTemplate)));
				}
			case 123:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: true}),
					$elm$core$Platform$Cmd$none);
			case 124:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aX: '', aA: '', bJ: false}),
					$elm$core$Platform$Cmd$none);
			case 125:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aA: input}),
					$elm$core$Platform$Cmd$none);
			case 126:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aX: input}),
					$elm$core$Platform$Cmd$none);
			case 127:
				var templateId = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$deleteTemplateById(templateId));
			case 128:
				var newShowDefault = !model.aZ;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aZ: newShowDefault}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$savePreference(
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'showDefaultTemplates',
											$elm$json$Json$Encode$bool(newShowDefault))
										])))
							])));
			case 129:
				var newShowTemplates = !model.a1;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a1: newShowTemplates}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$savePreference(
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'showTemplatesSection',
											$elm$json$Json$Encode$bool(newShowTemplates))
										])))
							])));
			case 130:
				var value = msg.a;
				var _v30 = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list($author$project$JsonCodec$decodeTemplate),
					value);
				if (!_v30.$) {
					var templates = _v30.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a9: templates}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 131:
				var value = msg.a;
				var tabSections = A2(
					$elm$core$Result$withDefault,
					$elm$core$Dict$empty,
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2(
							$elm$json$Json$Decode$field,
							'tabSections',
							$elm$json$Json$Decode$dict($elm$json$Json$Decode$string)),
						value));
				var showTemplatesSection = A2(
					$elm$core$Result$withDefault,
					model.a1,
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'showTemplatesSection', $elm$json$Json$Decode$bool),
						value));
				var showDefaultTemplates = A2(
					$elm$core$Result$withDefault,
					model.aZ,
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'showDefaultTemplates', $elm$json$Json$Decode$bool),
						value));
				var maybeLastProjectId = $elm$core$Result$toMaybe(
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'currentProjectId', $elm$json$Json$Decode$int),
						value));
				var projectCmd = function () {
					if (!maybeLastProjectId.$) {
						var projectId = maybeLastProjectId.a;
						return $author$project$Main$loadProjectById(projectId);
					} else {
						return $elm$core$Platform$Cmd$none;
					}
				}();
				var activeTab = function (tab) {
					return (tab === 'projects') ? 'languages' : tab;
				}(
					A2(
						$elm$core$Result$withDefault,
						model.ao,
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2($elm$json$Json$Decode$field, 'activeTab', $elm$json$Json$Decode$string),
							value)));
				var activeSection = function (section) {
					switch (section) {
						case 'projects':
							return 'languages';
						case 'current-project':
							return 'languages';
						default:
							return section;
					}
				}(
					A2(
						$elm$core$Result$withDefault,
						model.X,
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2($elm$json$Json$Decode$field, 'activeSection', $elm$json$Json$Decode$string),
							value)));
				var sectionCmd = function () {
					switch (activeSection) {
						case 'languages':
							return $author$project$Main$loadAllProjects(0);
						case 'language-families':
							return $author$project$Main$loadAllLanguageFamilies(0);
						case 'templates':
							return $author$project$Main$loadAllTemplates(0);
						default:
							return $elm$core$Platform$Cmd$none;
					}
				}();
				var activeProjectUuid = $elm$core$Result$toMaybe(
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'activeProjectUuid', $elm$json$Json$Decode$string),
						value));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aH: activeProjectUuid, X: activeSection, ao: activeTab, aZ: showDefaultTemplates, a1: showTemplatesSection, L: tabSections}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[sectionCmd, projectCmd])));
			case 132:
				var projectId = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$loadProjectById(projectId));
			case 133:
				var projectId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bc: $elm$core$Maybe$Just(projectId)
						}),
					$elm$core$Platform$Cmd$none);
			case 174:
				var projectId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bc: $elm$core$Maybe$Nothing}),
					$author$project$Main$deleteProjectById(projectId));
			case 175:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bc: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 134:
				var projectId = msg.a;
				var currentName = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							az: currentName,
							by: $elm$core$Maybe$Just(projectId)
						}),
					$elm$core$Platform$Cmd$none);
			case 135:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{az: input}),
					$elm$core$Platform$Cmd$none);
			case 136:
				var projectId = msg.a;
				var trimmedName = $elm$core$String$trim(model.az);
				return $elm$core$String$isEmpty(trimmedName) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{az: '', by: $elm$core$Maybe$Nothing}),
					$author$project$Main$renameProjectById(
						{bW: trimmedName, b_: projectId}));
			case 137:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{az: '', by: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 138:
				var projectId = msg.a;
				var newName = msg.b;
				if ($elm$core$String$isEmpty(
					$elm$core$String$trim(newName))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (_Utils_eq(projectId, model.O)) {
						var updatedProject = {ch: model.a.ch, bn: model.a.bn, ct: model.a.ct, cu: model.b, I: newName};
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{a: updatedProject}),
							$author$project$Main$saveToStorage(
								$author$project$JsonCodec$encodeProject(updatedProject)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
			case 139:
				var projectId = msg.a;
				var maybeProject = _Utils_eq(projectId, model.O) ? $elm$core$Maybe$Just(model.a) : A2(
					$elm$core$Maybe$map,
					function (meta) {
						return model.a;
					},
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (p) {
								return _Utils_eq(p.bn, projectId);
							},
							model.b$)));
				var defaultName = function () {
					if (!maybeProject.$) {
						var proj = maybeProject.a;
						return proj.I + ' (Copy)';
					} else {
						return '';
					}
				}();
				var currentFamilyId = function () {
					if (_Utils_eq(projectId, model.O)) {
						var _v34 = model.a.ct.dq;
						if (!_v34.$) {
							var familyUuid = _v34.a;
							return A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.bn;
								},
								$elm$core$List$head(
									A2(
										$elm$core$List$filter,
										function (f) {
											return _Utils_eq(f.ae, familyUuid);
										},
										model.m)));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ar: currentFamilyId,
							af: defaultName,
							ax: $elm$core$Maybe$Just(projectId),
							a_: true
						}),
					$elm$core$Platform$Cmd$none);
			case 140:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ar: $elm$core$Maybe$Nothing, af: '', ax: $elm$core$Maybe$Nothing, a_: false}),
					$elm$core$Platform$Cmd$none);
			case 141:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{af: input}),
					$elm$core$Platform$Cmd$none);
			case 142:
				var familyId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ar: familyId}),
					$elm$core$Platform$Cmd$none);
			case 143:
				var _v36 = model.ax;
				if (!_v36.$) {
					var projectId = _v36.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a_: false}),
						$author$project$Main$loadProjectById(projectId));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a_: false}),
						$elm$core$Platform$Cmd$none);
				}
			case 144:
				var projectId = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$duplicateProjectById(projectId));
			case 145:
				var value = msg.a;
				var _v37 = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list($author$project$JsonCodec$decodeProjectMetadata),
					value);
				if (!_v37.$) {
					var projectList = _v37.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{b$: projectList}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 146:
				var value = msg.a;
				var _v38 = A2($elm$json$Json$Decode$decodeValue, $author$project$JsonCodec$decodeProject, value);
				if (!_v38.$) {
					var project = _v38.a;
					var _v39 = model.ax;
					if (!_v39.$) {
						var projectIdToDuplicate = _v39.a;
						if (_Utils_eq(project.bn, projectIdToDuplicate)) {
							var updatedModel = _Utils_update(
								model,
								{ar: $elm$core$Maybe$Nothing, af: '', ax: $elm$core$Maybe$Nothing});
							var updatedLanguage = function () {
								var lang = project.ct;
								var familyUuid = function () {
									var _v40 = model.ar;
									if (!_v40.$) {
										var familyId = _v40.a;
										return A2(
											$elm$core$Maybe$map,
											function ($) {
												return $.ae;
											},
											$elm$core$List$head(
												A2(
													$elm$core$List$filter,
													function (f) {
														return _Utils_eq(f.bn, familyId);
													},
													model.m)));
									} else {
										return $elm$core$Maybe$Nothing;
									}
								}();
								return _Utils_update(
									lang,
									{dq: familyUuid});
							}();
							var customName = $elm$core$String$isEmpty(
								$elm$core$String$trim(model.af)) ? (project.I + ' (Copy)') : $elm$core$String$trim(model.af);
							var duplicateProject = {ch: model.b, bn: 0, ct: updatedLanguage, cu: model.b, I: customName};
							return _Utils_Tuple2(
								updatedModel,
								$elm$core$Platform$Cmd$batch(
									_List_fromArray(
										[
											$author$project$Main$saveToStorage(
											$author$project$JsonCodec$encodeProject(duplicateProject)),
											$author$project$Main$loadAllProjects(0)
										])));
						} else {
							return A2($author$project$Main$handleRegularProjectLoad, model, project);
						}
					} else {
						return A2($author$project$Main$handleRegularProjectLoad, model, project);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 147:
				var method = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cp: method}),
					$elm$core$Platform$Cmd$none);
			case 148:
				var orderStr = msg.a;
				var _v41 = $elm$core$String$toInt(orderStr);
				if (!_v41.$) {
					var order = _v41.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								cw: A2(
									$elm$core$Basics$max,
									1,
									A2($elm$core$Basics$min, 5, order))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 149:
				var lengthStr = msg.a;
				var _v42 = $elm$core$String$toInt(lengthStr);
				if (!_v42.$) {
					var length = _v42.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bT: A2($elm$core$Basics$max, 1, length)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 150:
				var lengthStr = msg.a;
				var _v43 = $elm$core$String$toInt(lengthStr);
				if (!_v43.$) {
					var length = _v43.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								cv: A2($elm$core$Basics$max, model.bT, length)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 151:
				var lengthStr = msg.a;
				var _v44 = $elm$core$String$toInt(lengthStr);
				if (!_v44.$) {
					var length = _v44.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ca: A2(
									$elm$core$Basics$max,
									1,
									A2($elm$core$Basics$min, 10, length))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 152:
				var lengthStr = msg.a;
				var _v45 = $elm$core$String$toInt(lengthStr);
				if (!_v45.$) {
					var length = _v45.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								cU: A2(
									$elm$core$Basics$max,
									model.ca,
									A2($elm$core$Basics$min, 10, length))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 153:
				var countStr = msg.a;
				var _v46 = $elm$core$String$toInt(countStr);
				if (!_v46.$) {
					var count = _v46.a;
					var validCount = A2(
						$elm$core$List$member,
						count,
						_List_fromArray(
							[5, 10, 15, 25, 50])) ? count : 10;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cZ: validCount}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 154:
				var word = msg.a;
				var updatedGeneratedWords = A2(
					$elm$core$List$filter,
					function (w) {
						return !_Utils_eq(w, word);
					},
					model.dh);
				var newWordUUID = '';
				var language = model.a.ct;
				var ipaForm = $elm$core$String$trim(word);
				var orthographyForm = A4(
					$author$project$MorphologyHelpers$applyOrthography,
					language.dE,
					language.dE.cA.cq,
					language.dE.da,
					$author$project$Utilities$removeSyllableSeparators(ipaForm));
				var newWord = {
					ce: _List_Nil,
					c9: '',
					dc: {bZ: _List_Nil, cb: 'Generated word'},
					bR: ipaForm,
					bV: _List_Nil,
					cA: orthographyForm,
					cG: 'noun',
					dK: {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil},
					ae: newWordUUID
				};
				var wordExists = A2(
					$elm$core$List$any,
					function (w) {
						return _Utils_eq(w.bR, newWord.bR);
					},
					$elm$core$Dict$values(language.dt));
				var updatedLanguage = wordExists ? language : _Utils_update(
					language,
					{
						dt: A3($elm$core$Dict$insert, newWordUUID, newWord, language.dt)
					});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dh: updatedGeneratedWords, a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 155:
				var language = model.a.ct;
				var newWords = A2(
					$elm$core$List$map,
					function (word) {
						var wordUUID = '';
						var ipaForm = word;
						var orthographyForm = A4(
							$author$project$MorphologyHelpers$applyOrthography,
							language.dE,
							language.dE.cA.cq,
							language.dE.da,
							$author$project$Utilities$removeSyllableSeparators(ipaForm));
						return _Utils_Tuple2(
							wordUUID,
							{
								ce: _List_Nil,
								c9: '',
								dc: {bZ: _List_Nil, cb: 'Generated word'},
								bR: ipaForm,
								bV: _List_Nil,
								cA: orthographyForm,
								cG: 'noun',
								dK: {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil},
								ae: wordUUID
							});
					},
					A2(
						$elm$core$List$filter,
						function (word) {
							return !A2(
								$elm$core$List$any,
								function (w) {
									return _Utils_eq(w.bR, word);
								},
								$elm$core$Dict$values(language.dt));
						},
						A2($elm$core$List$map, $elm$core$String$trim, model.dh)));
				var updatedLanguage = _Utils_update(
					language,
					{
						dt: A3(
							$elm$core$List$foldl,
							F2(
								function (_v47, acc) {
									var uuid = _v47.a;
									var word = _v47.b;
									return A3($elm$core$Dict$insert, uuid, word, acc);
								}),
							language.dt,
							newWords)
					});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dh: _List_Nil, a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 156:
				var projectId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bx: $elm$core$Maybe$Just(projectId)
						}),
					$author$project$Main$loadProjectById(projectId));
			case 157:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b0: $elm$core$Maybe$Nothing, bx: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 158:
				var csvContent = $author$project$Utilities$lexiconToCSV(
					$elm$core$Dict$values(model.a.ct.dt));
				return _Utils_Tuple2(
					model,
					$author$project$Main$exportCSV(csvContent));
			case 159:
				return _Utils_Tuple2(
					model,
					$author$project$Main$triggerCSVImport(0));
			case 160:
				var csvData = msg.a;
				var _v48 = $author$project$Utilities$parseCSVToLexicon(csvData);
				if (!_v48.$) {
					var newLexemes = _v48.a;
					var language = model.a.ct;
					var existingForms = A2(
						$elm$core$List$map,
						function ($) {
							return $.bR;
						},
						$elm$core$Dict$values(language.dt));
					var uniqueNewLexemes = A2(
						$elm$core$List$filter,
						function (lex) {
							return !A2($elm$core$List$member, lex.bR, existingForms);
						},
						newLexemes);
					var newLexemesPairs = A2(
						$elm$core$List$map,
						function (lex) {
							return _Utils_Tuple2(lex.ae, lex);
						},
						uniqueNewLexemes);
					var updatedLanguage = _Utils_update(
						language,
						{
							dt: A3(
								$elm$core$List$foldl,
								F2(
									function (_v49, acc) {
										var uuid = _v49.a;
										var lex = _v49.b;
										return A3($elm$core$Dict$insert, uuid, lex, acc);
									}),
								language.dt,
								newLexemesPairs)
						});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 161:
				var pattern = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a3: pattern}),
					$elm$core$Platform$Cmd$none);
			case 162:
				var replacement = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a4: replacement}),
					$elm$core$Platform$Cmd$none);
			case 163:
				var context = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a2: context}),
					$elm$core$Platform$Cmd$none);
			case 164:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bK: true}),
					$elm$core$Platform$Cmd$none);
			case 165:
				var language = model.a.ct;
				var updatedLexicon = A2(
					$elm$core$Dict$map,
					F2(
						function (_v50, lexeme) {
							return A4($author$project$MorphologyHelpers$applySoundChangeToWord, model.a3, model.a4, model.a2, lexeme);
						}),
					language.dt);
				var updatedLanguage = _Utils_update(
					language,
					{dt: updatedLexicon});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							r: _List_Nil,
							bK: false,
							a2: '',
							a3: '',
							a4: '',
							j: A2($elm$core$List$cons, model.a, model.j)
						}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 166:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bK: false, a2: '', a3: '', a4: ''}),
					$elm$core$Platform$Cmd$none);
			case 167:
				var _v51 = model.j;
				if (!_v51.b) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var previousState = _v51.a;
					var remainingUndo = _v51.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a: previousState,
								r: A2($elm$core$List$cons, model.a, model.r),
								j: remainingUndo
							}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(previousState)));
				}
			case 168:
				var _v52 = model.r;
				if (!_v52.b) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var nextState = _v52.a;
					var remainingRedo = _v52.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a: nextState,
								r: remainingRedo,
								j: A2($elm$core$List$cons, model.a, model.j)
							}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(nextState)));
				}
			case 169:
				var cell = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							b1: $elm$core$Maybe$Just(cell),
							b7: true
						}),
					$elm$core$Platform$Cmd$none);
			case 170:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b1: $elm$core$Maybe$Nothing, b7: false}),
					$elm$core$Platform$Cmd$none);
			case 172:
				var cell = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							b2: $elm$core$Maybe$Just(cell),
							b6: true
						}),
					$elm$core$Platform$Cmd$none);
			case 173:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b2: $elm$core$Maybe$Nothing, b6: false}),
					$elm$core$Platform$Cmd$none);
			case 171:
				var phoneme = msg.a;
				var updatedProject = model.a;
				var language = model.a.ct;
				var phonology = language.dE;
				var allSounds = A2(
					$elm$core$List$concatMap,
					function ($) {
						return $.dM;
					},
					phonology.ce);
				var updatedSounds = function () {
					if (A2($elm$core$List$member, phoneme, allSounds)) {
						var updatedCategories = A2(
							$elm$core$List$map,
							function (cat) {
								return _Utils_update(
									cat,
									{
										dM: A2(
											$elm$core$List$filter,
											function (s) {
												return !_Utils_eq(s, phoneme);
											},
											cat.dM)
									});
							},
							phonology.ce);
						return updatedCategories;
					} else {
						var categoryName = $author$project$PhonologyHelpers$isOtherSymbolSound(phoneme) ? 'Consonants' : ($author$project$PhonologyHelpers$isConsonantSound(phoneme) ? 'Consonants' : ($author$project$PhonologyHelpers$isVowelSound(phoneme) ? 'Vowels' : 'Other'));
						var needsNewCategory = !A2(
							$elm$core$List$any,
							function (cat) {
								return _Utils_eq(cat.I, categoryName);
							},
							phonology.ce);
						var updatedCategories = A2(
							$elm$core$List$map,
							function (cat) {
								return _Utils_eq(cat.I, categoryName) ? _Utils_update(
									cat,
									{
										dM: _Utils_ap(
											cat.dM,
											_List_fromArray(
												[phoneme]))
									}) : cat;
							},
							phonology.ce);
						var finalCategories = function () {
							if (needsNewCategory) {
								var label = function () {
									switch (categoryName) {
										case 'Consonants':
											return 'C';
										case 'Vowels':
											return 'V';
										default:
											return 'O';
									}
								}();
								return _Utils_ap(
									phonology.ce,
									_List_fromArray(
										[
											{
											dp: label,
											I: categoryName,
											dM: _List_fromArray(
												[phoneme]),
											ae: ''
										}
										]));
							} else {
								return updatedCategories;
							}
						}();
						return finalCategories;
					}
				}();
				var updatedPhonology = _Utils_update(
					phonology,
					{ce: updatedSounds});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var finalProject = _Utils_update(
					updatedProject,
					{ct: updatedLanguage});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: finalProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(finalProject)));
			case 178:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bm: input}),
					$elm$core$Platform$Cmd$none);
			case 179:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bl: input}),
					$elm$core$Platform$Cmd$none);
			case 180:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aK: input}),
					$elm$core$Platform$Cmd$none);
			case 181:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bk: input}),
					$elm$core$Platform$Cmd$none);
			case 182:
				var trimmedPhoneme = $elm$core$String$trim(model.bm);
				var trimmedGrapheme = $elm$core$String$trim(model.bl);
				if ($elm$core$String$isEmpty(trimmedPhoneme) || $elm$core$String$isEmpty(trimmedGrapheme)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var trimmedContext = $elm$core$String$trim(model.bk);
					var language = model.a.ct;
					var phonology = language.dE;
					var orthography = phonology.cA;
					var exists = A2(
						$elm$core$List$any,
						function (m) {
							return _Utils_eq(m.dD, trimmedPhoneme) && _Utils_eq(m.cg, trimmedContext);
						},
						orthography.cq);
					var updatedMappings = exists ? A2(
						$elm$core$List$map,
						function (m) {
							return (_Utils_eq(m.dD, trimmedPhoneme) && _Utils_eq(m.cg, trimmedContext)) ? _Utils_update(
								m,
								{
									aq: $elm$core$String$trim(model.aK),
									dj: trimmedGrapheme
								}) : m;
						},
						orthography.cq) : _Utils_ap(
						orthography.cq,
						_List_fromArray(
							[
								{
								cg: trimmedContext,
								aq: $elm$core$String$trim(model.aK),
								dj: trimmedGrapheme,
								dD: trimmedPhoneme
							}
							]));
					var updatedOrthography = _Utils_update(
						orthography,
						{cq: updatedMappings});
					var updatedPhonology = _Utils_update(
						phonology,
						{cA: updatedOrthography});
					var updatedLanguage = _Utils_update(
						language,
						{dE: updatedPhonology});
					var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bk: '', aK: '', bl: '', bm: '', a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$JsonCodec$encodeProject(updatedProject)));
				}
			case 183:
				var phoneme = msg.a;
				var language = model.a.ct;
				var phonology = language.dE;
				var orthography = phonology.cA;
				var updatedMappings = A2(
					$elm$core$List$filter,
					function (m) {
						return !_Utils_eq(m.dD, phoneme);
					},
					orthography.cq);
				var updatedOrthography = _Utils_update(
					orthography,
					{cq: updatedMappings});
				var updatedPhonology = _Utils_update(
					phonology,
					{cA: updatedOrthography});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 184:
				var language = model.a.ct;
				var phonology = language.dE;
				var orthography = phonology.cA;
				var newDisplayMode = function () {
					var _v54 = orthography.cj;
					if (!_v54) {
						return 1;
					} else {
						return 0;
					}
				}();
				var updatedOrthography = _Utils_update(
					orthography,
					{cj: newDisplayMode});
				var updatedPhonology = _Utils_update(
					phonology,
					{cA: updatedOrthography});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 185:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{as: model.a.I, bg: true}),
					$elm$core$Platform$Cmd$none);
			case 186:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{as: input}),
					$elm$core$Platform$Cmd$none);
			case 187:
				var newName = $elm$core$String$trim(model.as);
				var updatedProject = $elm$core$String$isEmpty(newName) ? model.a : A3($author$project$UpdateHelpers$updateProjectName, model.a, model.b, newName);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{as: '', bg: false, a: updatedProject}),
					$elm$core$String$isEmpty(newName) ? $elm$core$Platform$Cmd$none : $elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$saveToStorage(
								$author$project$JsonCodec$encodeProject(updatedProject)),
								$author$project$Main$renameProjectById(
								{bW: newName, b_: model.O})
							])));
			case 188:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{as: '', bg: false}),
					$elm$core$Platform$Cmd$none);
			case 189:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: $elm$core$Maybe$Nothing, B: '', C: '', D: '', H: 1, E: '', bC: true}),
					$elm$core$Platform$Cmd$none);
			case 190:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: $elm$core$Maybe$Nothing, B: '', C: '', D: '', H: 1, E: '', bC: false}),
					$elm$core$Platform$Cmd$none);
			case 191:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: $elm$core$Maybe$Nothing, B: '', C: '', D: '', H: 1, E: '', bG: false}),
					$elm$core$Platform$Cmd$none);
			case 192:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bE: true}),
					$elm$core$Platform$Cmd$none);
			case 193:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aS: '', aT: '', aU: '', aV: '', aW: '', bz: 0, bE: false}),
					$elm$core$Platform$Cmd$none);
			case 194:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bD: true}),
					$elm$core$Platform$Cmd$none);
			case 195:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aP: '', aQ: '', aa: _List_Nil, bD: false}),
					$elm$core$Platform$Cmd$none);
			case 196:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bf: input}),
					$elm$core$Platform$Cmd$none);
			case 197:
				var newDiphthong = $elm$core$String$trim(model.bf);
				var language = model.a.ct;
				var phonology = language.dE;
				var diphthongExists = A2($elm$core$List$member, newDiphthong, phonology.da);
				var updatedPhonology = ($elm$core$String$isEmpty(newDiphthong) || diphthongExists) ? phonology : _Utils_update(
					phonology,
					{
						da: _Utils_ap(
							phonology.da,
							_List_fromArray(
								[newDiphthong]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bf: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 198:
				var diphthong = msg.a;
				var language = model.a.ct;
				var phonology = language.dE;
				var updatedPhonology = _Utils_update(
					phonology,
					{
						da: A2(
							$elm$core$List$filter,
							function (d) {
								return !_Utils_eq(d, diphthong);
							},
							phonology.da)
					});
				var updatedLanguage = _Utils_update(
					language,
					{dE: updatedPhonology});
				var updatedProject = A3($author$project$UpdateHelpers$updateProjectLanguage, model.a, model.b, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(updatedProject)));
			case 199:
				var fieldName = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aL: false,
							bS: $elm$core$Maybe$Just(fieldName),
							bq: $elm$core$Maybe$Nothing,
							aR: false
						}),
					A2(
						$elm$core$Task$attempt,
						$author$project$Msg$GotIPAFieldElement(fieldName),
						$elm$browser$Browser$Dom$getElement('ipa-input-' + fieldName)));
			case 200:
				var fieldName = msg.a;
				var result = msg.b;
				if (!result.$) {
					var element = result.a;
					var viewportY = element.bh.c$ + element.bh.f;
					var viewportX = element.bh.c_;
					var inputHeight = element.bh.f;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bq: $elm$core$Maybe$Just(
									{dn: inputHeight, c_: viewportX, c$: viewportY})
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 201:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aL: false, bS: $elm$core$Maybe$Nothing, bq: $elm$core$Maybe$Nothing, aR: false}),
					$elm$core$Platform$Cmd$none);
			case 202:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aL: !model.aL}),
					$elm$core$Platform$Cmd$none);
			case 203:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aR: !model.aR}),
					$elm$core$Platform$Cmd$none);
			case 204:
				var fieldName = msg.a;
				var symbol = msg.b;
				var fieldId = 'ipa-input-' + fieldName;
				return _Utils_Tuple2(
					model,
					$author$project$Main$insertAtCursor(
						{bj: fieldId, cb: symbol}));
			case 205:
				var fieldId = msg.a.bj;
				var position = msg.a.cH;
				var fieldName = A3($elm$core$String$replace, 'ipa-input-', '', fieldId);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bP: A3($elm$core$Dict$insert, fieldName, position, model.bP)
						}),
					$elm$core$Platform$Cmd$none);
			case 206:
				var height = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cX: height}),
					$elm$core$Platform$Cmd$none);
			case 207:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{y: input}),
					$elm$core$Platform$Cmd$none);
			case 208:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{x: input}),
					$elm$core$Platform$Cmd$none);
			case 209:
				var maybeId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{z: maybeId}),
					$elm$core$Platform$Cmd$none);
			case 210:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ag: $elm$core$Maybe$Nothing, x: '', y: '', z: $elm$core$Maybe$Nothing, ab: true}),
					$elm$core$Platform$Cmd$none);
			case 211:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ag: $elm$core$Maybe$Nothing, x: '', y: '', z: $elm$core$Maybe$Nothing, ab: false}),
					$elm$core$Platform$Cmd$none);
			case 212:
				var familyName = $elm$core$String$trim(model.y);
				if ($elm$core$String$isEmpty(familyName)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var parentUuid = function () {
						var _v57 = model.z;
						if (!_v57.$) {
							var parentId = _v57.a;
							return A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.ae;
								},
								$elm$core$List$head(
									A2(
										$elm$core$List$filter,
										function (f) {
											return _Utils_eq(f.bn, parentId);
										},
										model.m)));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}();
					var newFamily = {
						aq: $elm$core$String$trim(model.x),
						bn: 0,
						I: familyName,
						dA: parentUuid,
						dG: _List_Nil,
						ae: ''
					};
					var encodedFamily = $elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'id',
								$elm$json$Json$Encode$int(newFamily.bn)),
								_Utils_Tuple2(
								'uuid',
								$elm$json$Json$Encode$string(newFamily.ae)),
								_Utils_Tuple2(
								'name',
								$elm$json$Json$Encode$string(newFamily.I)),
								_Utils_Tuple2(
								'description',
								$elm$json$Json$Encode$string(newFamily.aq)),
								_Utils_Tuple2(
								'parentFamilyUuid',
								function () {
									var _v56 = newFamily.dA;
									if (!_v56.$) {
										var uuid = _v56.a;
										return $elm$json$Json$Encode$string(uuid);
									} else {
										return $elm$json$Json$Encode$null;
									}
								}()),
								_Utils_Tuple2(
								'projectUuids',
								A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, newFamily.dG))
							]));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{x: '', y: '', z: $elm$core$Maybe$Nothing, ab: false}),
						$author$project$Main$saveLanguageFamily(encodedFamily));
				}
			case 213:
				var familyId = msg.a;
				var familyToEdit = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (f) {
							return _Utils_eq(f.bn, familyId);
						},
						model.m));
				if (!familyToEdit.$) {
					var family = familyToEdit.a;
					var parentIdInput = function () {
						var _v59 = family.dA;
						if (!_v59.$) {
							var parentUuid = _v59.a;
							return A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.bn;
								},
								$elm$core$List$head(
									A2(
										$elm$core$List$filter,
										function (f) {
											return _Utils_eq(f.ae, parentUuid);
										},
										model.m)));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ag: $elm$core$Maybe$Just(familyId),
								x: family.aq,
								y: family.I,
								z: parentIdInput,
								ab: true
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 214:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ag: $elm$core$Maybe$Nothing, x: '', y: '', z: $elm$core$Maybe$Nothing, ab: false}),
					$elm$core$Platform$Cmd$none);
			case 215:
				var _v60 = model.ag;
				if (!_v60.$) {
					var familyId = _v60.a;
					var familyName = $elm$core$String$trim(model.y);
					if ($elm$core$String$isEmpty(familyName)) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var parentUuid = function () {
							var _v62 = model.z;
							if (!_v62.$) {
								var parentId = _v62.a;
								return A2(
									$elm$core$Maybe$map,
									function ($) {
										return $.ae;
									},
									$elm$core$List$head(
										A2(
											$elm$core$List$filter,
											function (f) {
												return _Utils_eq(f.bn, parentId);
											},
											model.m)));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}();
						var existingFamily = $elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (f) {
									return _Utils_eq(f.bn, familyId);
								},
								model.m));
						var existingFamilyUuid = A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.ae;
								},
								existingFamily));
						var existingProjectUuids = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.dG;
								},
								existingFamily));
						var updatedFamily = {
							aq: $elm$core$String$trim(model.x),
							bn: familyId,
							I: familyName,
							dA: parentUuid,
							dG: existingProjectUuids,
							ae: existingFamilyUuid
						};
						var encodedFamily = $elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'id',
									$elm$json$Json$Encode$int(updatedFamily.bn)),
									_Utils_Tuple2(
									'uuid',
									$elm$json$Json$Encode$string(updatedFamily.ae)),
									_Utils_Tuple2(
									'name',
									$elm$json$Json$Encode$string(updatedFamily.I)),
									_Utils_Tuple2(
									'description',
									$elm$json$Json$Encode$string(updatedFamily.aq)),
									_Utils_Tuple2(
									'parentFamilyUuid',
									function () {
										var _v61 = updatedFamily.dA;
										if (!_v61.$) {
											var uuid = _v61.a;
											return $elm$json$Json$Encode$string(uuid);
										} else {
											return $elm$json$Json$Encode$null;
										}
									}()),
									_Utils_Tuple2(
									'projectUuids',
									A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, updatedFamily.dG))
								]));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{ag: $elm$core$Maybe$Nothing, x: '', y: '', z: $elm$core$Maybe$Nothing, ab: false}),
							$author$project$Main$saveLanguageFamily(encodedFamily));
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 217:
				var familyId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bb: $elm$core$Maybe$Just(familyId)
						}),
					$elm$core$Platform$Cmd$none);
			case 216:
				var familyId = msg.a;
				var familyUuid = A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.ae;
						},
						$elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (f) {
									return _Utils_eq(f.bn, familyId);
								},
								model.m))));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bb: $elm$core$Maybe$Nothing}),
					$elm$core$String$isEmpty(familyUuid) ? $elm$core$Platform$Cmd$none : $author$project$Main$deleteLanguageFamilyById(familyUuid));
			case 218:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bb: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 219:
				var value = msg.a;
				var decodedFamilies = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list($author$project$JsonCodec$decodeLanguageFamily),
					value);
				if (!decodedFamilies.$) {
					var families = decodedFamilies.a;
					var migratedFamilies = A2($elm$core$List$map, $author$project$UUIDHelpers$ensureLanguageFamilyUUID, families);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{m: migratedFamilies}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 220:
				var maybeFamilyId = msg.a;
				var updatedProject = model.a;
				var updatedLanguage = updatedProject.ct;
				var maybeFamilyUuid = function () {
					if (!maybeFamilyId.$) {
						var familyId = maybeFamilyId.a;
						return A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.ae;
							},
							$elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (f) {
										return _Utils_eq(f.bn, familyId);
									},
									model.m)));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}();
				var newLanguage = _Utils_update(
					updatedLanguage,
					{dq: maybeFamilyUuid});
				var newProject = _Utils_update(
					updatedProject,
					{ct: newLanguage});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: newProject}),
					$author$project$Main$saveToStorage(
						$author$project$JsonCodec$encodeProject(newProject)));
			case 221:
				var input = msg.a;
				var _v65 = A4($author$project$MorphologyHelpers$applyOrthographyWithTracking, model.a.ct.dE, model.a.ct.dE.cA.cq, model.a.ct.dE.da, input);
				var outputText = _v65.a;
				var triggeredRules = _v65.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cB: input, cV: triggeredRules}),
					$elm$core$Platform$Cmd$none);
			case 222:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aN: !model.aN}),
					$elm$core$Platform$Cmd$none);
			case 223:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aN: false}),
					$elm$core$Platform$Cmd$none);
			case 224:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ah: $elm$core$Maybe$Nothing, F: '', G: '', ac: true}),
					$elm$core$Platform$Cmd$none);
			case 225:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ah: $elm$core$Maybe$Nothing, F: '', G: '', ac: false}),
					$elm$core$Platform$Cmd$none);
			case 226:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{G: input}),
					$elm$core$Platform$Cmd$none);
			case 227:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{F: input}),
					$elm$core$Platform$Cmd$none);
			case 228:
				var projectName = $elm$core$String$trim(model.G);
				if ($elm$core$String$isEmpty(projectName)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var newProject = {
						aq: $elm$core$String$trim(model.F),
						I: projectName,
						ae: ''
					};
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{F: '', G: '', ac: false}),
						$author$project$Main$saveLanguageProject(
							$author$project$JsonCodec$encodeLanguageProject(newProject)));
				}
			case 229:
				var uuid = msg.a;
				var projectToEdit = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (p) {
							return _Utils_eq(p.ae, uuid);
						},
						model.P));
				if (!projectToEdit.$) {
					var proj = projectToEdit.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ah: $elm$core$Maybe$Just(uuid),
								F: proj.aq,
								G: proj.I,
								ac: true
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 230:
				var _v67 = model.ah;
				if (!_v67.$) {
					var uuid = _v67.a;
					var updatedProjects = A2(
						$elm$core$List$map,
						function (p) {
							return _Utils_eq(p.ae, uuid) ? _Utils_update(
								p,
								{aq: model.F, I: model.G}) : p;
						},
						model.P);
					var projectToSave = $elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (p) {
								return _Utils_eq(p.ae, uuid);
							},
							updatedProjects));
					if (!projectToSave.$) {
						var proj = projectToSave.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{ah: $elm$core$Maybe$Nothing, P: updatedProjects, F: '', G: '', ac: false}),
							$author$project$Main$saveLanguageProject(
								$author$project$JsonCodec$encodeLanguageProject(proj)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 231:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ah: $elm$core$Maybe$Nothing, F: '', G: '', ac: false}),
					$elm$core$Platform$Cmd$none);
			case 232:
				var uuid = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bd: $elm$core$Maybe$Just(uuid)
						}),
					$elm$core$Platform$Cmd$none);
			case 233:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bd: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 234:
				var uuid = msg.a;
				var updatedProjects = A2(
					$elm$core$List$filter,
					function (p) {
						return !_Utils_eq(p.ae, uuid);
					},
					model.P);
				var updatedFilter = _Utils_eq(
					model.N,
					$elm$core$Maybe$Just(uuid)) ? $elm$core$Maybe$Nothing : model.N;
				var updatedFamilies = A2(
					$elm$core$List$map,
					function (f) {
						return _Utils_update(
							f,
							{
								dG: A2(
									$elm$core$List$filter,
									function (pId) {
										return !_Utils_eq(pId, uuid);
									},
									f.dG)
							});
					},
					model.m);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bd: $elm$core$Maybe$Nothing, N: updatedFilter, m: updatedFamilies, P: updatedProjects}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$deleteLanguageProjectByUuid(uuid),
								$elm$core$Platform$Cmd$batch(
								A2(
									$elm$core$List$map,
									function (f) {
										return $author$project$Main$saveLanguageFamily(
											$author$project$JsonCodec$encodeLanguageFamily(f));
									},
									updatedFamilies))
							])));
			case 235:
				var value = msg.a;
				var decodedProjects = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list($author$project$JsonCodec$decodeLanguageProject),
					value);
				if (!decodedProjects.$) {
					var projects = decodedProjects.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{P: projects}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 236:
				var projectUuid = msg.a;
				var familyUuid = msg.b;
				var updatedFamilies = A2(
					$elm$core$List$map,
					function (f) {
						return _Utils_eq(f.ae, familyUuid) ? (A2($elm$core$List$member, projectUuid, f.dG) ? _Utils_update(
							f,
							{
								dG: A2(
									$elm$core$List$filter,
									function (pId) {
										return !_Utils_eq(pId, projectUuid);
									},
									f.dG)
							}) : _Utils_update(
							f,
							{
								dG: A2($elm$core$List$cons, projectUuid, f.dG)
							})) : f;
					},
					model.m);
				var familyToSave = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (f) {
							return _Utils_eq(f.ae, familyUuid);
						},
						updatedFamilies));
				if (!familyToSave.$) {
					var family = familyToSave.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{m: updatedFamilies}),
						$author$project$Main$saveLanguageFamily(
							$author$project$JsonCodec$encodeLanguageFamily(family)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 237:
				var maybeUuid = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{N: maybeUuid}),
					$elm$core$Platform$Cmd$none);
			case 238:
				var maybeUuid = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aH: maybeUuid}),
					$author$project$Main$savePreference(
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'activeProjectUuid',
									function () {
										if (!maybeUuid.$) {
											var uuid = maybeUuid.a;
											return $elm$json$Json$Encode$string(uuid);
										} else {
											return $elm$json$Json$Encode$null;
										}
									}())
								]))));
			case 239:
				var newShowAll = !model.b5;
				var newFilter = function () {
					if (newShowAll) {
						return $elm$core$Maybe$Nothing;
					} else {
						var _v72 = model.aH;
						if (!_v72.$) {
							var uuid = _v72.a;
							return $elm$core$Maybe$Just(uuid);
						} else {
							return model.N;
						}
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{N: newFilter, b5: newShowAll}),
					$elm$core$Platform$Cmd$none);
			default:
				var newShowAll = !model.b4;
				var newFilter = function () {
					if (newShowAll) {
						return $elm$core$Maybe$Nothing;
					} else {
						var _v73 = model.aH;
						if (!_v73.$) {
							var uuid = _v73.a;
							return $elm$core$Maybe$Just(uuid);
						} else {
							return model.N;
						}
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{N: newFilter, b4: newShowAll}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Msg$AddLanguageFamily = {$: 212};
var $author$project$Msg$CloseAddLanguageFamilyModal = {$: 211};
var $author$project$Msg$NoOp = {$: 34};
var $author$project$Msg$SaveLanguageFamily = {$: 215};
var $author$project$Msg$UpdateFamilyDescriptionInput = function (a) {
	return {$: 208, a: a};
};
var $author$project$Msg$UpdateFamilyNameInput = function (a) {
	return {$: 207, a: a};
};
var $author$project$Msg$UpdateFamilyParentIdInput = function (a) {
	return {$: 209, a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $author$project$UpdateHelpers$onEnter = function (msg) {
	var isEnter = function (code) {
		return (code === 13) ? $elm$json$Json$Decode$succeed(msg) : $elm$json$Json$Decode$fail('not Enter');
	};
	return A2(
		$elm$html$Html$Events$on,
		'keydown',
		A2($elm$json$Json$Decode$andThen, isEnter, $elm$html$Html$Events$keyCode));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$ViewLanguages$viewAddLanguageFamilyModal = function (model) {
	var isEditing = !_Utils_eq(model.ag, $elm$core$Maybe$Nothing);
	var getFamilyPath = function (family) {
		var _v0 = family.dA;
		if (!_v0.$) {
			var parentId = _v0.a;
			var _v1 = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.ae, parentId);
					},
					model.m));
			if (!_v1.$) {
				var parent = _v1.a;
				return _Utils_ap(
					getFamilyPath(parent),
					_List_fromArray(
						[family.I]));
			} else {
				return _List_fromArray(
					[family.I]);
			}
		} else {
			return _List_fromArray(
				[family.I]);
		}
	};
	var availableParents = function () {
		var _v3 = model.ag;
		if (!_v3.$) {
			var editId = _v3.a;
			return A2(
				$elm$core$List$filter,
				function (f) {
					return !_Utils_eq(f.bn, editId);
				},
				model.m);
		} else {
			return model.m;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								isEditing ? 'Edit Language Family' : 'Add Language Family')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#555'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Define language families to organize your constructed languages into taxonomic groups.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Family Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.y),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateFamilyNameInput),
										$author$project$UpdateHelpers$onEnter(
										isEditing ? $author$project$Msg$SaveLanguageFamily : $author$project$Msg$AddLanguageFamily),
										$elm$html$Html$Attributes$placeholder('e.g., Indo-European, Germanic, Romance'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Description')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.x),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateFamilyDescriptionInput),
										$author$project$UpdateHelpers$onEnter(
										isEditing ? $author$project$Msg$SaveLanguageFamily : $author$project$Msg$AddLanguageFamily),
										$elm$html$Html$Attributes$placeholder('Brief description of this language family'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Parent Family (Optional)')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											if (val === 'none') {
												return $author$project$Msg$UpdateFamilyParentIdInput($elm$core$Maybe$Nothing);
											} else {
												var _v2 = $elm$core$String$toInt(val);
												if (!_v2.$) {
													var id = _v2.a;
													return $author$project$Msg$UpdateFamilyParentIdInput(
														$elm$core$Maybe$Just(id));
												} else {
													return $author$project$Msg$NoOp;
												}
											}
										}),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('none'),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(model.z, $elm$core$Maybe$Nothing))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(None - Top-level family)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (family) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(
														$elm$core$String$fromInt(family.bn)),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.z,
															$elm$core$Maybe$Just(family.bn)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														A2(
															$elm$core$String$join,
															' > ',
															getFamilyPath(family)))
													]));
										},
										availableParents)))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseAddLanguageFamilyModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#718096'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										isEditing ? $author$project$Msg$SaveLanguageFamily : $author$project$Msg$AddLanguageFamily),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										isEditing ? 'Save Changes' : 'Add Family')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddMorpheme = {$: 65};
var $author$project$Msg$BlurIPAField = {$: 201};
var $author$project$Msg$CloseAddMorphemeModal = {$: 190};
var $author$project$Msg$FocusIPAField = function (a) {
	return {$: 199, a: a};
};
var $author$project$Msg$SelectMorphemeType = function (a) {
	return {$: 62, a: a};
};
var $author$project$Msg$UpdateMorphemeFeatureInput = function (a) {
	return {$: 63, a: a};
};
var $author$project$Msg$UpdateMorphemeFormInput = function (a) {
	return {$: 60, a: a};
};
var $author$project$Msg$UpdateMorphemeGlossInput = function (a) {
	return {$: 61, a: a};
};
var $author$project$Msg$UpdateMorphemeValueInput = function (a) {
	return {$: 64, a: a};
};
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$ViewHelpers$morphemeTypeToString = function (morphemeType) {
	switch (morphemeType) {
		case 0:
			return 'Prefix';
		case 1:
			return 'Suffix';
		case 2:
			return 'Infix';
		default:
			return 'Circumfix';
	}
};
var $elm$html$Html$Events$onBlur = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'blur',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$ViewHelpers$stringToMorphemeType = function (str) {
	switch (str) {
		case 'Prefix':
			return 0;
		case 'Suffix':
			return 1;
		case 'Infix':
			return 2;
		case 'Circumfix':
			return 3;
		default:
			return 1;
	}
};
var $author$project$Msg$ToggleIPADropdown = {$: 202};
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$ViewHelpers$isConsonantCategoryByLabel = function (label) {
	var consonantLabels = _List_fromArray(
		['C', 'c', 'P', 'p', 'N', 'n', 'F', 'f', 'S', 's', 'L', 'l', 'R', 'r']);
	return A2($elm$core$List$member, label, consonantLabels);
};
var $author$project$ViewHelpers$isVowelCategoryByLabel = function (label) {
	var vowelLabels = _List_fromArray(
		['V', 'v']);
	return A2($elm$core$List$member, label, vowelLabels);
};
var $author$project$Msg$InsertIPASymbol = F2(
	function (a, b) {
		return {$: 204, a: a, b: b};
	});
var $author$project$ViewComponents$viewIPASymbol = F2(
	function (fieldName, symbol) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ipa-symbol-item'),
					A2(
					$elm$html$Html$Events$custom,
					'mousedown',
					$elm$json$Json$Decode$succeed(
						{
							g: A2($author$project$Msg$InsertIPASymbol, fieldName, symbol),
							h: true,
							i: false
						})),
					A2(
					$elm$html$Html$Events$custom,
					'touchstart',
					$elm$json$Json$Decode$succeed(
						{
							g: A2($author$project$Msg$InsertIPASymbol, fieldName, symbol),
							h: true,
							i: false
						})),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 8px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'background', '#f7fafc'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid transparent'),
					A2($elm$html$Html$Attributes$style, 'transition', 'all 0.15s'),
					A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
					A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
					A2($elm$html$Html$Attributes$style, 'user-select', 'none')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(symbol)
				]));
	});
var $author$project$ViewComponents$viewIPADropdown = F2(
	function (model, fieldName) {
		var _v0 = model.bS;
		if (_v0.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var activeField = _v0.a;
			if (!_Utils_eq(activeField, fieldName)) {
				return $elm$html$Html$text('');
			} else {
				var phonology = model.a.ct.dE;
				var vowels = A2(
					$elm$core$List$concatMap,
					function (cat) {
						return $author$project$ViewHelpers$isVowelCategoryByLabel(cat.dp) ? cat.dM : _List_Nil;
					},
					phonology.ce);
				var otherSymbols = A2(
					$elm$core$List$concatMap,
					function (cat) {
						return (!($author$project$ViewHelpers$isConsonantCategoryByLabel(cat.dp) || $author$project$ViewHelpers$isVowelCategoryByLabel(cat.dp))) ? cat.dM : _List_Nil;
					},
					phonology.ce);
				var diphthongs = phonology.da;
				var consonants = A2(
					$elm$core$List$concatMap,
					function (cat) {
						return $author$project$ViewHelpers$isConsonantCategoryByLabel(cat.dp) ? cat.dM : _List_Nil;
					},
					phonology.ce);
				var _v1 = model.bq;
				if (_v1.$ === 1) {
					return $elm$html$Html$text('');
				} else {
					var position = _v1.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ipa-dropdown-container'),
								A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
								A2(
								$elm$html$Html$Attributes$style,
								'top',
								$elm$core$String$fromFloat(position.c$) + 'px'),
								A2(
								$elm$html$Html$Attributes$style,
								'left',
								$elm$core$String$fromFloat(position.c_) + 'px'),
								A2($elm$html$Html$Attributes$style, 'z-index', '9999'),
								A2($elm$html$Html$Attributes$style, 'max-width', '400px'),
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ipa-dropdown-trigger'),
										A2(
										$elm$html$Html$Events$custom,
										'mousedown',
										$elm$json$Json$Decode$succeed(
											{g: $author$project$Msg$ToggleIPADropdown, h: true, i: false})),
										A2(
										$elm$html$Html$Events$custom,
										'touchstart',
										$elm$json$Json$Decode$succeed(
											{g: $author$project$Msg$ToggleIPADropdown, h: true, i: false})),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'padding', '4px 8px'),
										A2($elm$html$Html$Attributes$style, 'background', '#e6fffa'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #38b2ac'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '11px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
										A2($elm$html$Html$Attributes$style, 'color', '#234e52'),
										A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
										A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
										A2($elm$html$Html$Attributes$style, 'line-height', '1'),
										A2($elm$html$Html$Attributes$style, 'align-self', 'flex-start'),
										A2($elm$html$Html$Attributes$style, 'white-space', 'nowrap')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										model.aL ? 'IPA ▲' : 'IPA ▼')
									])),
								model.aL ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ipa-dropdown-content'),
										A2($elm$html$Html$Attributes$style, 'background', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', '2px solid #38b2ac'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
										A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 12px rgba(0,0,0,0.15)'),
										A2($elm$html$Html$Attributes$style, 'padding', '12px'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '4px'),
										A2($elm$html$Html$Attributes$style, 'max-height', '300px'),
										A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
										A2($elm$html$Html$Attributes$style, 'min-width', '300px'),
										A2($elm$html$Html$Attributes$style, 'max-width', 'min(500px, calc(100vw - 20px))'),
										A2($elm$html$Html$Attributes$style, 'opacity', '1')
									]),
								_List_fromArray(
									[
										(!$elm$core$List$isEmpty(consonants)) ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Consonants')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ipa-symbol-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '0')
													]),
												A2(
													$elm$core$List$map,
													$author$project$ViewComponents$viewIPASymbol(fieldName),
													consonants))
											])) : $elm$html$Html$text(''),
										(!$elm$core$List$isEmpty(vowels)) ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Vowels')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ipa-symbol-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '0')
													]),
												A2(
													$elm$core$List$map,
													$author$project$ViewComponents$viewIPASymbol(fieldName),
													vowels))
											])) : $elm$html$Html$text(''),
										(!$elm$core$List$isEmpty(diphthongs)) ? A2(
										$elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Diphthongs')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ipa-symbol-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '0')
													]),
												A2(
													$elm$core$List$map,
													$author$project$ViewComponents$viewIPASymbol(fieldName),
													diphthongs))
											])) : $elm$html$Html$text('')
									])) : $elm$html$Html$text('')
							]));
				}
			}
		}
	});
var $author$project$ViewApp$viewAddMorphemeModal = function (model) {
	var morphemeType = model.H;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseAddMorphemeModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Add New Morpheme')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Morpheme Form')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Enter the morpheme using IPA symbols (e.g., -s, un-, -in-, pre-...-ly)')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-morphemeForm'),
												$elm$html$Html$Attributes$placeholder('e.g., -s'),
												$elm$html$Html$Attributes$value(model.C),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeFormInput),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('morphemeForm')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%'),
												A2($elm$html$Html$Attributes$style, 'padding', '10px'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '1em')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'morphemeForm')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Gloss/Meaning')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., PL (plural)'),
										$elm$html$Html$Attributes$value(model.D),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeGlossInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Morpheme Type')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											return $author$project$Msg$SelectMorphemeType(
												$author$project$ViewHelpers$stringToMorphemeType(val));
										}),
										$elm$html$Html$Attributes$value(
										$author$project$ViewHelpers$morphemeTypeToString(morphemeType)),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Prefix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Prefix')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Suffix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Suffix')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Infix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Infix')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Circumfix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Circumfix')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Feature (optional)')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeFeatureInput),
										$elm$html$Html$Attributes$value(model.B),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(None)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (feature) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(feature.I)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(feature.I)
													]));
										},
										model.a.ct.dv.bQ)))
							])),
						function () {
						if (!$elm$core$String$isEmpty(model.B)) {
							var selectedFeature = $elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (f) {
										return _Utils_eq(f.I, model.B);
									},
									model.a.ct.dv.bQ));
							if (!selectedFeature.$) {
								var feature = selectedFeature.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$label,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'block'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
													A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
													A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Feature Value')
												])),
											A2(
											$elm$html$Html$select,
											_List_fromArray(
												[
													$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeValueInput),
													$elm$html$Html$Attributes$value(model.E),
													A2($elm$html$Html$Attributes$style, 'width', '100%'),
													A2($elm$html$Html$Attributes$style, 'padding', '10px'),
													A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
													A2($elm$html$Html$Attributes$style, 'font-size', '1em')
												]),
											_Utils_ap(
												_List_fromArray(
													[
														A2(
														$elm$html$Html$option,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$value('')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('(Select value)')
															]))
													]),
												A2(
													$elm$core$List$map,
													function (val) {
														return A2(
															$elm$html$Html$option,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$value(val)
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(val)
																]));
													},
													feature.dR)))
										]));
							} else {
								return $elm$html$Html$text('');
							}
						} else {
							return $elm$html$Html$text('');
						}
					}(),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseAddMorphemeModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#ddd'),
										A2($elm$html$Html$Attributes$style, 'color', '#333'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$AddMorpheme),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.C)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.D))),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2(
										$elm$html$Html$Attributes$style,
										'background',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.C)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.D))) ? '#ccc' : '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2(
										$elm$html$Html$Attributes$style,
										'cursor',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.C)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.D))) ? 'not-allowed' : 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✚ Add Morpheme')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$CloseAddParadigmModal = {$: 195};
var $author$project$Msg$GenerateParadigm = {$: 74};
var $author$project$Msg$ToggleFeatureSelection = function (a) {
	return {$: 72, a: a};
};
var $author$project$Msg$UpdateParadigmNameInput = function (a) {
	return {$: 70, a: a};
};
var $author$project$Msg$UpdateParadigmPosInput = function (a) {
	return {$: 71, a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $author$project$ViewHelpers$countCombinations = function (model) {
	var selectedFeatureObjects = A2(
		$elm$core$List$filterMap,
		function (fname) {
			return $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.I, fname);
					},
					model.a.ct.dv.bQ));
		},
		model.aa);
	var counts = A2(
		$elm$core$List$map,
		function (f) {
			return $elm$core$List$length(f.dR);
		},
		selectedFeatureObjects);
	return A3($elm$core$List$foldl, $elm$core$Basics$mul, 1, counts);
};
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$ViewApp$viewAddParadigmModal = function (model) {
	var totalCombinations = $author$project$ViewHelpers$countCombinations(model);
	var selectedFeaturesCount = $elm$core$List$length(
		A2(
			$elm$core$List$filter,
			function (f) {
				return A2($elm$core$List$member, f.I, model.aa);
			},
			model.a.ct.dv.bQ));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseAddParadigmModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '600px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2($elm$html$Html$Attributes$style, 'max-height', '80vh'),
						A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create New Paradigm')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Paradigm Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., Noun Declension'),
										$elm$html$Html$Attributes$value(model.aP),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateParadigmNameInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Part of Speech')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., noun, verb, adjective'),
										$elm$html$Html$Attributes$value(model.aQ),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateParadigmPosInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Select Features for Paradigm')
									])),
								$elm$core$List$isEmpty(model.a.ct.dv.bQ) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'color', '#666'),
										A2($elm$html$Html$Attributes$style, 'font-style', 'italic')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('No grammatical features defined yet. Go to the Features section to add some.')
									])) : A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('help-text'),
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Select which grammatical features this paradigm should include.')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'display', 'flex'),
												A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
												A2($elm$html$Html$Attributes$style, 'gap', '8px')
											]),
										A2(
											$elm$core$List$map,
											function (feature) {
												return A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'display', 'flex'),
															A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
															A2($elm$html$Html$Attributes$style, 'gap', '8px')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$input,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$type_('checkbox'),
																	$elm$html$Html$Attributes$checked(
																	A2($elm$core$List$member, feature.I, model.aa)),
																	$elm$html$Html$Events$onCheck(
																	function (_v0) {
																		return $author$project$Msg$ToggleFeatureSelection(feature.I);
																	}),
																	A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
																]),
															_List_Nil),
															A2(
															$elm$html$Html$label,
															_List_fromArray(
																[
																	A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																	A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	feature.I + (' (' + (A2($elm$core$String$join, ', ', feature.dR) + ')')))
																]))
														]));
											},
											model.a.ct.dv.bQ)),
										(selectedFeaturesCount > 0) ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-top', '10px'),
												A2($elm$html$Html$Attributes$style, 'padding', '8px'),
												A2($elm$html$Html$Attributes$style, 'background', '#e8f5e9'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'color', '#2e7d32')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												'Selected ' + ($elm$core$String$fromInt(selectedFeaturesCount) + (' feature(s). This will create ' + ($elm$core$String$fromInt(totalCombinations) + ' inflected form(s).'))))
											])) : $elm$html$Html$text('')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseAddParadigmModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#ddd'),
										A2($elm$html$Html$Attributes$style, 'color', '#333'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$GenerateParadigm),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.aP)) || ($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aQ)) || $elm$core$List$isEmpty(model.aa))),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2(
										$elm$html$Html$Attributes$style,
										'background',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aP)) || ($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aQ)) || $elm$core$List$isEmpty(model.aa))) ? '#ccc' : '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2(
										$elm$html$Html$Attributes$style,
										'cursor',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aP)) || ($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aQ)) || $elm$core$List$isEmpty(model.aa))) ? 'not-allowed' : 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✚ Generate Paradigm')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddLanguageProject = {$: 228};
var $author$project$Msg$CancelProjectEdit = {$: 231};
var $author$project$Msg$CloseAddProjectModal = {$: 225};
var $author$project$Msg$SaveProjectEdit = {$: 230};
var $author$project$Msg$UpdateProjectDescriptionInput = function (a) {
	return {$: 227, a: a};
};
var $author$project$Msg$UpdateProjectNameInput = function (a) {
	return {$: 226, a: a};
};
var $author$project$ViewLanguages$viewAddProjectModal = function (model) {
	var isEditing = !_Utils_eq(model.ah, $elm$core$Maybe$Nothing);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								isEditing ? 'Edit Project' : 'Add Project')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#555'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Projects are tags for organizing language families. They help you group related language families together.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Project Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.G),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateProjectNameInput),
										$elm$html$Html$Attributes$placeholder('e.g., Ancient Languages, Constructed Languages'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Description')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.F),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateProjectDescriptionInput),
										$elm$html$Html$Attributes$placeholder('Brief description of this project'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										isEditing ? $author$project$Msg$CancelProjectEdit : $author$project$Msg$CloseAddProjectModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#718096'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick(
										isEditing ? $author$project$Msg$SaveProjectEdit : $author$project$Msg$AddLanguageProject),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										isEditing ? 'Save Changes' : 'Add Project')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddMorphophonemicRule = {$: 86};
var $author$project$Msg$CloseAddRuleModal = {$: 193};
var $author$project$Msg$SelectRuleType = function (a) {
	return {$: 85, a: a};
};
var $author$project$Msg$UpdateRuleContextInput = function (a) {
	return {$: 81, a: a};
};
var $author$project$Msg$UpdateRuleDescriptionInput = function (a) {
	return {$: 84, a: a};
};
var $author$project$Msg$UpdateRuleNameInput = function (a) {
	return {$: 80, a: a};
};
var $author$project$Msg$UpdateRuleReplacementInput = function (a) {
	return {$: 83, a: a};
};
var $author$project$Msg$UpdateRuleTargetInput = function (a) {
	return {$: 82, a: a};
};
var $author$project$ViewHelpers$ruleTypeToString = function (ruleType) {
	switch (ruleType) {
		case 0:
			return 'Assimilation';
		case 1:
			return 'Dissimilation';
		case 2:
			return 'Vowel Harmony';
		default:
			return 'Consonant Gradation';
	}
};
var $author$project$ViewHelpers$selectRuleTypeFromString = function (str) {
	switch (str) {
		case 'Assimilation':
			return 0;
		case 'Dissimilation':
			return 1;
		case 'VowelHarmony':
			return 2;
		case 'ConsonantGradation':
			return 3;
		default:
			return 0;
	}
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Msg$TogglePatternDropdown = {$: 203};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$ViewComponents$viewPatternButton = F3(
	function (fieldName, symbol, tooltip) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pattern-symbol-item'),
					A2(
					$elm$html$Html$Events$custom,
					'mousedown',
					$elm$json$Json$Decode$succeed(
						{
							g: A2($author$project$Msg$InsertIPASymbol, fieldName, symbol),
							h: true,
							i: false
						})),
					A2(
					$elm$html$Html$Events$custom,
					'touchstart',
					$elm$json$Json$Decode$succeed(
						{
							g: A2($author$project$Msg$InsertIPASymbol, fieldName, symbol),
							h: true,
							i: false
						})),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'background', '#f7fafc'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'transition', 'all 0.15s'),
					A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
					A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
					A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
					$elm$html$Html$Attributes$title(tooltip)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(symbol)
				]));
	});
var $author$project$ViewComponents$viewSoundGroupButton = F2(
	function (fieldName, category) {
		var soundsList = A2($elm$core$String$join, ', ', category.dM);
		var tooltip = category.I + (': ' + soundsList);
		var buttonText = $elm$core$String$fromChar(category.dp);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('sound-group-item'),
					A2(
					$elm$html$Html$Events$custom,
					'mousedown',
					$elm$json$Json$Decode$succeed(
						{
							g: A2($author$project$Msg$InsertIPASymbol, fieldName, buttonText),
							h: true,
							i: false
						})),
					A2(
					$elm$html$Html$Events$custom,
					'touchstart',
					$elm$json$Json$Decode$succeed(
						{
							g: A2($author$project$Msg$InsertIPASymbol, fieldName, buttonText),
							h: true,
							i: false
						})),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 10px'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
					A2($elm$html$Html$Attributes$style, 'background', '#fef3c7'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #f59e0b'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'transition', 'all 0.15s'),
					A2($elm$html$Html$Attributes$style, 'font-size', '14px'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'color', '#78350f'),
					A2($elm$html$Html$Attributes$style, 'user-select', 'none'),
					$elm$html$Html$Attributes$title(tooltip)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(buttonText)
				]));
	});
var $author$project$ViewComponents$viewContextInputHelpers = F2(
	function (model, fieldName) {
		var _v0 = model.bS;
		if (_v0.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var activeField = _v0.a;
			if (!_Utils_eq(activeField, fieldName)) {
				return $elm$html$Html$text('');
			} else {
				var _v1 = model.bq;
				if (_v1.$ === 1) {
					return $elm$html$Html$text('');
				} else {
					var position = _v1.a;
					var phonology = model.a.ct.dE;
					var vowels = A2(
						$elm$core$List$concatMap,
						function (cat) {
							return $author$project$ViewHelpers$isVowelCategoryByLabel(cat.dp) ? cat.dM : _List_Nil;
						},
						phonology.ce);
					var otherSymbols = A2(
						$elm$core$List$concatMap,
						function (cat) {
							return (!($author$project$ViewHelpers$isConsonantCategoryByLabel(cat.dp) || $author$project$ViewHelpers$isVowelCategoryByLabel(cat.dp))) ? cat.dM : _List_Nil;
						},
						phonology.ce);
					var diphthongs = phonology.da;
					var customCategories = A2(
						$elm$core$List$filter,
						function (cat) {
							return (cat.dp !== 'C') && (cat.dp !== 'V');
						},
						phonology.ce);
					var consonants = A2(
						$elm$core$List$concatMap,
						function (cat) {
							return $author$project$ViewHelpers$isConsonantCategoryByLabel(cat.dp) ? cat.dM : _List_Nil;
						},
						phonology.ce);
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ipa-helpers-container'),
								A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
								A2(
								$elm$html$Html$Attributes$style,
								'top',
								$elm$core$String$fromFloat(position.c$) + 'px'),
								A2(
								$elm$html$Html$Attributes$style,
								'left',
								$elm$core$String$fromFloat(position.c_) + 'px'),
								A2($elm$html$Html$Attributes$style, 'z-index', '9999'),
								A2($elm$html$Html$Attributes$style, 'max-width', '600px'),
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'flex-direction', 'row'),
										A2($elm$html$Html$Attributes$style, 'gap', '4px'),
										A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
										A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('ipa-dropdown-trigger'),
												A2(
												$elm$html$Html$Events$custom,
												'mousedown',
												$elm$json$Json$Decode$succeed(
													{g: $author$project$Msg$ToggleIPADropdown, h: true, i: false})),
												A2(
												$elm$html$Html$Events$custom,
												'touchstart',
												$elm$json$Json$Decode$succeed(
													{g: $author$project$Msg$ToggleIPADropdown, h: true, i: false})),
												A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
												A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
												A2($elm$html$Html$Attributes$style, 'background', '#e6fffa'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #38b2ac'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
												A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
												A2($elm$html$Html$Attributes$style, 'color', '#234e52'),
												A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
												A2($elm$html$Html$Attributes$style, 'user-select', 'none')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.aL ? 'IPA ▲' : 'IPA ▼')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('pattern-dropdown-trigger'),
												A2(
												$elm$html$Html$Events$custom,
												'mousedown',
												$elm$json$Json$Decode$succeed(
													{g: $author$project$Msg$TogglePatternDropdown, h: true, i: false})),
												A2(
												$elm$html$Html$Events$custom,
												'touchstart',
												$elm$json$Json$Decode$succeed(
													{g: $author$project$Msg$TogglePatternDropdown, h: true, i: false})),
												A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
												A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
												A2($elm$html$Html$Attributes$style, 'background', '#fef3c7'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #f59e0b'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '12px'),
												A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
												A2($elm$html$Html$Attributes$style, 'color', '#78350f'),
												A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
												A2($elm$html$Html$Attributes$style, 'user-select', 'none')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.aR ? 'Pat ▲' : 'Pat ▼')
											]))
									])),
								model.aL ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ipa-dropdown-content'),
										A2($elm$html$Html$Attributes$style, 'background', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', '2px solid #38b2ac'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
										A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 12px rgba(0,0,0,0.15)'),
										A2($elm$html$Html$Attributes$style, 'padding', '12px'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '4px'),
										A2($elm$html$Html$Attributes$style, 'max-height', '300px'),
										A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
										A2($elm$html$Html$Attributes$style, 'min-width', '300px'),
										A2($elm$html$Html$Attributes$style, 'max-width', 'min(500px, calc(100vw - 20px))')
									]),
								_List_fromArray(
									[
										(!$elm$core$List$isEmpty(consonants)) ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Consonants')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ipa-symbol-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '0')
													]),
												A2(
													$elm$core$List$map,
													$author$project$ViewComponents$viewIPASymbol(fieldName),
													consonants))
											])) : $elm$html$Html$text(''),
										(!$elm$core$List$isEmpty(vowels)) ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Vowels')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ipa-symbol-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '0')
													]),
												A2(
													$elm$core$List$map,
													$author$project$ViewComponents$viewIPASymbol(fieldName),
													vowels))
											])) : $elm$html$Html$text(''),
										(!$elm$core$List$isEmpty(diphthongs)) ? A2(
										$elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Diphthongs')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ipa-symbol-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '0')
													]),
												A2(
													$elm$core$List$map,
													$author$project$ViewComponents$viewIPASymbol(fieldName),
													diphthongs))
											])) : $elm$html$Html$text('')
									])) : $elm$html$Html$text(''),
								model.aR ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('pattern-dropdown-content'),
										A2($elm$html$Html$Attributes$style, 'background', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', '2px solid #f59e0b'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
										A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 12px rgba(0,0,0,0.15)'),
										A2($elm$html$Html$Attributes$style, 'padding', '12px'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '4px'),
										A2($elm$html$Html$Attributes$style, 'max-height', '300px'),
										A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
										A2($elm$html$Html$Attributes$style, 'min-width', '300px'),
										A2($elm$html$Html$Attributes$style, 'max-width', 'min(500px, calc(100vw - 20px))'),
										A2($elm$html$Html$Attributes$style, 'margin-left', '8px')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Context Patterns')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('pattern-symbol-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '4px')
													]),
												_List_fromArray(
													[
														A3($author$project$ViewComponents$viewPatternButton, fieldName, '#', 'Word Boundary - Matches the start or end of a word/syllable'),
														A3($author$project$ViewComponents$viewPatternButton, fieldName, 'V', 'Vowel - Matches any vowel sound'),
														A3($author$project$ViewComponents$viewPatternButton, fieldName, 'V̆', 'Short Vowel - Matches short/lax vowels like ɪ, ɛ, æ, ʌ, ʊ, ɒ, ə'),
														A3($author$project$ViewComponents$viewPatternButton, fieldName, 'C', 'Consonant - Matches any consonant sound'),
														A3($author$project$ViewComponents$viewPatternButton, fieldName, '{}', 'Phoneme Choice - Use {a,e,i} to match any phoneme in the set'),
														A3($author$project$ViewComponents$viewPatternButton, fieldName, '_', 'Position - Marks where the target sound appears in the context')
													]))
											])),
										(!$elm$core$List$isEmpty(customCategories)) ? A2(
										$elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
														A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '6px'),
														A2($elm$html$Html$Attributes$style, 'font-size', '13px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Sound Groups')
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('sound-group-grid'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '4px')
													]),
												A2(
													$elm$core$List$map,
													$author$project$ViewComponents$viewSoundGroupButton(fieldName),
													customCategories))
											])) : $elm$html$Html$text('')
									])) : $elm$html$Html$text('')
							]));
				}
			}
		}
	});
var $author$project$ViewApp$viewAddRuleModal = function (model) {
	var ruleType = model.bz;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseAddRuleModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '600px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Add New Morphophonemic Rule')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Rule Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., Nasal Assimilation'),
										$elm$html$Html$Attributes$value(model.aU),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateRuleNameInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Rule Type')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											return $author$project$Msg$SelectRuleType(
												$author$project$ViewHelpers$selectRuleTypeFromString(val));
										}),
										$elm$html$Html$Attributes$value(
										$author$project$ViewHelpers$ruleTypeToString(ruleType)),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Assimilation')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Assimilation')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Dissimilation')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Dissimilation')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('VowelHarmony')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Vowel Harmony')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('ConsonantGradation')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Consonant Gradation')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Context Pattern')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Use _ to mark where the target sound occurs. Examples: _n (before n), V_ (after vowel), V_V (between vowels). Leave empty for unconditional change.')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-ruleContextInput'),
												$elm$html$Html$Attributes$placeholder('e.g., V_V (optional)'),
												$elm$html$Html$Attributes$value(model.aS),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateRuleContextInput),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('ruleContextInput')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%'),
												A2($elm$html$Html$Attributes$style, 'padding', '10px'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '1em')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewContextInputHelpers, model, 'ruleContextInput')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Target Sound')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('The sound that will be changed (e.g., t, k, a)')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-ruleTarget'),
												$elm$html$Html$Attributes$placeholder('e.g., t'),
												$elm$html$Html$Attributes$value(model.aW),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateRuleTargetInput),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('ruleTarget')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%'),
												A2($elm$html$Html$Attributes$style, 'padding', '10px'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '1em')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'ruleTarget')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Replacement Sound')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('What the target sound becomes (e.g., d, g, ə)')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-ruleReplacement'),
												$elm$html$Html$Attributes$placeholder('e.g., d'),
												$elm$html$Html$Attributes$value(model.aV),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateRuleReplacementInput),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('ruleReplacement')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%'),
												A2($elm$html$Html$Attributes$style, 'padding', '10px'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '1em')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'ruleReplacement')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Description (optional)')
									])),
								A2(
								$elm$html$Html$textarea,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$placeholder('Describe when and why this rule applies...'),
										$elm$html$Html$Attributes$value(model.aT),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateRuleDescriptionInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em'),
										A2($elm$html$Html$Attributes$style, 'min-height', '60px'),
										A2($elm$html$Html$Attributes$style, 'resize', 'vertical')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseAddRuleModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#ddd'),
										A2($elm$html$Html$Attributes$style, 'color', '#333'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$AddMorphophonemicRule),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.aU)) || ($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aW)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.aV)))),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2(
										$elm$html$Html$Attributes$style,
										'background',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aU)) || ($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aW)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.aV)))) ? '#ccc' : '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2(
										$elm$html$Html$Attributes$style,
										'cursor',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aU)) || ($elm$core$String$isEmpty(
											$elm$core$String$trim(model.aW)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.aV)))) ? 'not-allowed' : 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✚ Add Rule')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$CancelDeleteLanguageFamily = {$: 218};
var $author$project$Msg$DeleteLanguageFamily = function (a) {
	return {$: 216, a: a};
};
var $author$project$ViewLanguages$viewDeleteLanguageFamilyConfirm = F2(
	function (familyId, families) {
		var familyName = A2(
			$elm$core$Maybe$withDefault,
			'this family',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.I;
				},
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (f) {
							return _Utils_eq(f.bn, familyId);
						},
						families))));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', 'white'),
							A2($elm$html$Html$Attributes$style, 'padding', '30px'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
							A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
							A2($elm$html$Html$Attributes$style, 'width', '90%')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
									A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Confirm Delete')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', '#555')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Are you sure you want to delete ' + (familyName + '? This action cannot be undone.'))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Msg$CancelDeleteLanguageFamily),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
											A2($elm$html$Html$Attributes$style, 'background', '#718096'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Cancel')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$DeleteLanguageFamily(familyId)),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
											A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Delete')
										]))
								]))
						]))
				]));
	});
var $author$project$Msg$CancelDeleteProjectByUuid = {$: 233};
var $author$project$Msg$DeleteLanguageProjectByUuid = function (a) {
	return {$: 234, a: a};
};
var $author$project$ViewLanguages$viewDeleteProjectByUuidConfirm = F2(
	function (projectUuid, projects) {
		var projectName = A2(
			$elm$core$Maybe$withDefault,
			'this project',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.I;
				},
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (p) {
							return _Utils_eq(p.ae, projectUuid);
						},
						projects))));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', 'white'),
							A2($elm$html$Html$Attributes$style, 'padding', '30px'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
							A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
							A2($elm$html$Html$Attributes$style, 'width', '90%')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
									A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Confirm Delete')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', '#555')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Are you sure you want to delete the project \"' + (projectName + '\"? This will remove it from all language families. This action cannot be undone.'))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Msg$CancelDeleteProjectByUuid),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
											A2($elm$html$Html$Attributes$style, 'background', '#718096'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Cancel')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$DeleteLanguageProjectByUuid(projectUuid)),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
											A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Delete')
										]))
								]))
						]))
				]));
	});
var $author$project$Msg$CancelDeleteProject = {$: 175};
var $author$project$Msg$DeleteProject = function (a) {
	return {$: 133, a: a};
};
var $author$project$ViewLanguages$viewDeleteProjectConfirm = F2(
	function (projectId, projects) {
		var projectName = A2(
			$elm$core$Maybe$withDefault,
			'this project',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.I;
				},
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (p) {
							return _Utils_eq(p.bn, projectId);
						},
						projects))));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'width', '100%'),
					A2($elm$html$Html$Attributes$style, 'height', '100%'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', 'white'),
							A2($elm$html$Html$Attributes$style, 'padding', '30px'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
							A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
							A2($elm$html$Html$Attributes$style, 'width', '90%')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
									A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Confirm Delete')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', '#555')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Are you sure you want to delete \"' + (projectName + '\"? This will permanently remove the language and all its data. This action cannot be undone.'))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Msg$CancelDeleteProject),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
											A2($elm$html$Html$Attributes$style, 'background', '#718096'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Cancel')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$DeleteProject(projectId)),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
											A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Delete')
										]))
								]))
						]))
				]));
	});
var $author$project$Msg$CloseDuplicateProjectModal = {$: 140};
var $author$project$Msg$ConfirmDuplicateProject = {$: 143};
var $author$project$Msg$UpdateDuplicateProjectFamilyInput = function (a) {
	return {$: 142, a: a};
};
var $author$project$Msg$UpdateDuplicateProjectNameInput = function (a) {
	return {$: 141, a: a};
};
var $author$project$ViewLanguages$viewDuplicateProjectModal = function (model) {
	var getFamilyPath = function (family) {
		var _v0 = family.dA;
		if (!_v0.$) {
			var parentId = _v0.a;
			var _v1 = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.ae, parentId);
					},
					model.m));
			if (!_v1.$) {
				var parent = _v1.a;
				return _Utils_ap(
					getFamilyPath(parent),
					_List_fromArray(
						[family.I]));
			} else {
				return _List_fromArray(
					[family.I]);
			}
		} else {
			return _List_fromArray(
				[family.I]);
		}
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Duplicate Language')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#555'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Enter a name for the duplicated language and optionally select a language family.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Language Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.af),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateDuplicateProjectNameInput),
										$elm$html$Html$Attributes$placeholder('Enter language name'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Language Family (Optional)')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											if (val === 'none') {
												return $author$project$Msg$UpdateDuplicateProjectFamilyInput($elm$core$Maybe$Nothing);
											} else {
												var _v2 = $elm$core$String$toInt(val);
												if (!_v2.$) {
													var id = _v2.a;
													return $author$project$Msg$UpdateDuplicateProjectFamilyInput(
														$elm$core$Maybe$Just(id));
												} else {
													return $author$project$Msg$NoOp;
												}
											}
										}),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('none'),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(model.ar, $elm$core$Maybe$Nothing))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(No family)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (family) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(
														$elm$core$String$fromInt(family.bn)),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.ar,
															$elm$core$Maybe$Just(family.bn)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														A2(
															$elm$core$String$join,
															' > ',
															getFamilyPath(family)))
													]));
										},
										model.m)))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseDuplicateProjectModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#718096'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$ConfirmDuplicateProject),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#9C27B0'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Duplicate Language')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$CloseEditMorphemeModal = {$: 191};
var $author$project$Msg$SaveMorphemeEdit = {$: 68};
var $author$project$ViewApp$viewEditMorphemeModal = function (model) {
	var morphemeType = model.H;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseEditMorphemeModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Edit Morpheme')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Morpheme Form')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Enter the morpheme using IPA symbols (e.g., -s, un-, -in-, pre-...-ly)')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-morphemeForm'),
												$elm$html$Html$Attributes$placeholder('e.g., -s'),
												$elm$html$Html$Attributes$value(model.C),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeFormInput),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('morphemeForm')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%'),
												A2($elm$html$Html$Attributes$style, 'padding', '10px'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '1em')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'morphemeForm')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Gloss/Meaning')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., PL (plural)'),
										$elm$html$Html$Attributes$value(model.D),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeGlossInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Morpheme Type')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											return $author$project$Msg$SelectMorphemeType(
												$author$project$ViewHelpers$stringToMorphemeType(val));
										}),
										$elm$html$Html$Attributes$value(
										$author$project$ViewHelpers$morphemeTypeToString(morphemeType)),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Prefix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Prefix')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Suffix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Suffix')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Infix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Infix')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('Circumfix')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Circumfix')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Feature (optional)')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeFeatureInput),
										$elm$html$Html$Attributes$value(model.B),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(None)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (feature) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(feature.I)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(feature.I)
													]));
										},
										model.a.ct.dv.bQ)))
							])),
						function () {
						if (!$elm$core$String$isEmpty(model.B)) {
							var selectedFeature = $elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (f) {
										return _Utils_eq(f.I, model.B);
									},
									model.a.ct.dv.bQ));
							if (!selectedFeature.$) {
								var feature = selectedFeature.a;
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$label,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'block'),
													A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
													A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
													A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Feature Value')
												])),
											A2(
											$elm$html$Html$select,
											_List_fromArray(
												[
													$elm$html$Html$Events$onInput($author$project$Msg$UpdateMorphemeValueInput),
													$elm$html$Html$Attributes$value(model.E),
													A2($elm$html$Html$Attributes$style, 'width', '100%'),
													A2($elm$html$Html$Attributes$style, 'padding', '10px'),
													A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
													A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
													A2($elm$html$Html$Attributes$style, 'font-size', '1em')
												]),
											_Utils_ap(
												_List_fromArray(
													[
														A2(
														$elm$html$Html$option,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$value('')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('(Select value)')
															]))
													]),
												A2(
													$elm$core$List$map,
													function (val) {
														return A2(
															$elm$html$Html$option,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$value(val)
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(val)
																]));
													},
													feature.dR)))
										]));
							} else {
								return $elm$html$Html$text('');
							}
						} else {
							return $elm$html$Html$text('');
						}
					}(),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseEditMorphemeModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#ddd'),
										A2($elm$html$Html$Attributes$style, 'color', '#333'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$SaveMorphemeEdit),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.C)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.D))),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2(
										$elm$html$Html$Attributes$style,
										'background',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.C)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.D))) ? '#ccc' : '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2(
										$elm$html$Html$Attributes$style,
										'cursor',
										($elm$core$String$isEmpty(
											$elm$core$String$trim(model.C)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.D))) ? 'not-allowed' : 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('💾 Save Changes')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$CancelEditProjectName = {$: 188};
var $author$project$Msg$SaveEditProjectName = {$: 187};
var $author$project$Msg$StartEditProjectName = {$: 185};
var $author$project$Msg$UpdateEditProjectNameInput = function (a) {
	return {$: 186, a: a};
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$ViewApp$viewHeader = function (model) {
	return A3(
		$elm$html$Html$node,
		'header',
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px 30px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
						A2($elm$html$Html$Attributes$style, 'gap', '15px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin', '0'),
								A2($elm$html$Html$Attributes$style, 'font-size', '28px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '700')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('CLCTK')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('subtitle'),
								A2($elm$html$Html$Attributes$style, 'margin', '0'),
								A2($elm$html$Html$Attributes$style, 'padding-top', '4px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Language Construction Tool Kit')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
						A2($elm$html$Html$Attributes$style, 'gap', '15px'),
						A2($elm$html$Html$Attributes$style, 'color', 'white')
					]),
				_List_fromArray(
					[
						model.bg ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '8px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.as),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateEditProjectNameInput),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'font-size', '16px')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$SaveEditProjectName),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
										A2($elm$html$Html$Attributes$style, 'background', '#48bb78'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✓')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CancelEditProjectName),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
										A2($elm$html$Html$Attributes$style, 'background', '#718096'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✕')
									]))
							])) : A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin', '0'),
								A2($elm$html$Html$Attributes$style, 'font-size', '18px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '500')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(model.a.I)
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								model.bg ? $author$project$Msg$CancelEditProjectName : $author$project$Msg$StartEditProjectName),
								A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
								A2($elm$html$Html$Attributes$style, 'background', 'rgba(255, 255, 255, 0.1)'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', '1px solid rgba(255, 255, 255, 0.3)'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-size', '14px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.bg ? 'Cancel' : 'Rename Project')
							]))
					]))
			]));
};
var $author$project$Msg$ConfirmDeleteLanguageFamily = function (a) {
	return {$: 217, a: a};
};
var $author$project$Msg$OpenAddLanguageFamilyModal = {$: 210};
var $author$project$Msg$StartEditLanguageFamily = function (a) {
	return {$: 213, a: a};
};
var $author$project$Msg$ToggleShowAllFamilies = {$: 240};
var $author$project$Msg$UpdateCurrentProjectFilter = function (a) {
	return {$: 237, a: a};
};
var $author$project$Msg$UpdateProjectLanguageFamily = function (a) {
	return {$: 220, a: a};
};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$ViewLanguages$viewLanguageFamiliesManagement = function (model) {
	var getRootFamilyUuidHelper = function (familyUuid) {
		getRootFamilyUuidHelper:
		while (true) {
			var _v0 = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.ae, familyUuid);
					},
					model.m));
			if (!_v0.$) {
				var family = _v0.a;
				var _v1 = family.dA;
				if (!_v1.$) {
					var parentUuid = _v1.a;
					var $temp$familyUuid = parentUuid;
					familyUuid = $temp$familyUuid;
					continue getRootFamilyUuidHelper;
				} else {
					return familyUuid;
				}
			} else {
				return familyUuid;
			}
		}
	};
	var getFamilyPath = function (family) {
		var _v2 = family.dA;
		if (!_v2.$) {
			var parentId = _v2.a;
			var _v3 = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.ae, parentId);
					},
					model.m));
			if (!_v3.$) {
				var parent = _v3.a;
				return _Utils_ap(
					getFamilyPath(parent),
					_List_fromArray(
						[family.I]));
			} else {
				return _List_fromArray(
					[family.I]);
			}
		} else {
			return _List_fromArray(
				[family.I]);
		}
	};
	var familyBelongsToProject = function (family) {
		if (model.b4) {
			return true;
		} else {
			var _v7 = model.N;
			if (_v7.$ === 1) {
				return true;
			} else {
				var projectUuid = _v7.a;
				var rootUuid = getRootFamilyUuidHelper(family.ae);
				var rootFamily = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (f) {
							return _Utils_eq(f.ae, rootUuid);
						},
						model.m));
				if (!rootFamily.$) {
					var root = rootFamily.a;
					return A2($elm$core$List$member, projectUuid, root.dG);
				} else {
					return false;
				}
			}
		}
	};
	var filteredFamilies = A2($elm$core$List$filter, familyBelongsToProject, model.m);
	var availableParents = function () {
		var _v6 = model.ag;
		if (!_v6.$) {
			var editId = _v6.a;
			return A2(
				$elm$core$List$filter,
				function (f) {
					return !_Utils_eq(f.bn, editId);
				},
				model.m);
		} else {
			return model.m;
		}
	}();
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Language Families')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define language families and create taxonomies. Languages can belong to one family.')
					])),
				(!$elm$core$List$isEmpty(model.P)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px'),
						A2($elm$html$Html$Attributes$style, 'padding', '15px'),
						A2($elm$html$Html$Attributes$style, 'background', '#f0f8ff'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h4,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2d3748')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Filter by Project')
							])),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '8px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(model.b4),
										$elm$html$Html$Events$onInput(
										function (_v4) {
											return $author$project$Msg$ToggleShowAllFamilies;
										}),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Show all families regardless of project')
									]))
							])),
						(!model.b4) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Project:')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											return (val === 'all') ? $author$project$Msg$UpdateCurrentProjectFilter($elm$core$Maybe$Nothing) : $author$project$Msg$UpdateCurrentProjectFilter(
												$elm$core$Maybe$Just(val));
										}),
										A2($elm$html$Html$Attributes$style, 'padding', '8px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('all'),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(model.N, $elm$core$Maybe$Nothing))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(All Projects)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (project) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(project.ae),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.N,
															$elm$core$Maybe$Just(project.ae)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(project.I)
													]));
										},
										model.P)))
							])) : $elm$html$Html$text('')
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px'),
						A2($elm$html$Html$Attributes$style, 'padding', '15px'),
						A2($elm$html$Html$Attributes$style, 'background', '#f0f8ff'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2d3748')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Current Language Family')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(model.a.I + ':')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											if (val === 'none') {
												return $author$project$Msg$UpdateProjectLanguageFamily($elm$core$Maybe$Nothing);
											} else {
												var _v5 = $elm$core$String$toInt(val);
												if (!_v5.$) {
													var id = _v5.a;
													return $author$project$Msg$UpdateProjectLanguageFamily(
														$elm$core$Maybe$Just(id));
												} else {
													return $author$project$Msg$NoOp;
												}
											}
										}),
										A2($elm$html$Html$Attributes$style, 'padding', '8px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('none'),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(model.a.ct.dq, $elm$core$Maybe$Nothing))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(No family assigned)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (family) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(family.ae),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.a.ct.dq,
															$elm$core$Maybe$Just(family.ae)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														A2(
															$elm$core$String$join,
															' > ',
															getFamilyPath(family)))
													]));
										},
										model.m)))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$OpenAddLanguageFamilyModal),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '500')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('✚ Add Language Family')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '30px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2d3748')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Language Families')
							])),
						$elm$core$List$isEmpty(model.m) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#666'),
								A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
								A2($elm$html$Html$Attributes$style, 'padding', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No language families defined yet. Add one above!')
							])) : ($elm$core$List$isEmpty(filteredFamilies) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#666'),
								A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
								A2($elm$html$Html$Attributes$style, 'padding', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No language families match the current project filter.')
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						A2(
							$elm$core$List$map,
							function (family) {
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'padding', '12px'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'background', '#f9f9f9'),
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
											A2($elm$html$Html$Attributes$style, 'align-items', 'center')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'flex', '1')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
															A2($elm$html$Html$Attributes$style, 'font-size', '1em'),
															A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															A2(
																$elm$core$String$join,
																' > ',
																getFamilyPath(family)))
														])),
													(!$elm$core$String$isEmpty(family.aq)) ? A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
															A2($elm$html$Html$Attributes$style, 'color', '#555'),
															A2($elm$html$Html$Attributes$style, 'margin-top', '4px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(family.aq)
														])) : $elm$html$Html$text('')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'gap', '8px')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(
															$author$project$Msg$StartEditLanguageFamily(family.bn)),
															A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
															A2($elm$html$Html$Attributes$style, 'background', '#FF9800'),
															A2($elm$html$Html$Attributes$style, 'color', 'white'),
															A2($elm$html$Html$Attributes$style, 'border', 'none'),
															A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
															A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Edit')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(
															$author$project$Msg$ConfirmDeleteLanguageFamily(family.bn)),
															A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
															A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
															A2($elm$html$Html$Attributes$style, 'color', 'white'),
															A2($elm$html$Html$Attributes$style, 'border', 'none'),
															A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
															A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Delete')
														]))
												]))
										]));
							},
							filteredFamilies)))
					]))
			]));
};
var $author$project$Msg$DismissImportError = {$: 44};
var $author$project$Msg$ExportProject = {$: 41};
var $author$project$Msg$ImportProject = {$: 42};
var $author$project$Msg$OpenNewProjectModal = {$: 112};
var $author$project$Msg$ToggleShowAllLanguages = {$: 239};
var $author$project$ViewLanguages$getRootFamilyUuid = F2(
	function (familyUuid, families) {
		getRootFamilyUuid:
		while (true) {
			var _v0 = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.ae, familyUuid);
					},
					families));
			if (!_v0.$) {
				var family = _v0.a;
				var _v1 = family.dA;
				if (!_v1.$) {
					var parentUuid = _v1.a;
					var $temp$familyUuid = parentUuid,
						$temp$families = families;
					familyUuid = $temp$familyUuid;
					families = $temp$families;
					continue getRootFamilyUuid;
				} else {
					return familyUuid;
				}
			} else {
				return familyUuid;
			}
		}
	});
var $author$project$Msg$CancelRenameProject = {$: 137};
var $author$project$Msg$ConfirmDeleteProject = function (a) {
	return {$: 174, a: a};
};
var $author$project$Msg$ConfirmRenameProject = function (a) {
	return {$: 136, a: a};
};
var $author$project$Msg$OpenDuplicateProjectModal = function (a) {
	return {$: 139, a: a};
};
var $author$project$Msg$StartRenameProject = F2(
	function (a, b) {
		return {$: 134, a: a, b: b};
	});
var $author$project$Msg$SwitchToProject = function (a) {
	return {$: 132, a: a};
};
var $author$project$Msg$UpdateRenameInput = function (a) {
	return {$: 135, a: a};
};
var $author$project$ViewHelpers$formatTimestamp = function (timestamp) {
	return $elm$core$String$isEmpty(timestamp) ? 'Unknown' : A2($elm$core$String$left, 10, timestamp);
};
var $author$project$Msg$OpenSaveTemplateModal = {$: 123};
var $author$project$ViewLanguages$viewCurrentProjectActions = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'gap', '8px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						A2($author$project$Msg$StartRenameProject, model.O, model.a.I)),
						A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
						A2($elm$html$Html$Attributes$style, 'background', '#FF9800'),
						A2($elm$html$Html$Attributes$style, 'color', 'white'),
						A2($elm$html$Html$Attributes$style, 'border', 'none'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
						A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Rename')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Msg$OpenDuplicateProjectModal(model.O)),
						A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
						A2($elm$html$Html$Attributes$style, 'background', '#9C27B0'),
						A2($elm$html$Html$Attributes$style, 'color', 'white'),
						A2($elm$html$Html$Attributes$style, 'border', 'none'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
						A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Duplicate')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Msg$OpenSaveTemplateModal),
						A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
						A2($elm$html$Html$Attributes$style, 'background', '#2196F3'),
						A2($elm$html$Html$Attributes$style, 'color', 'white'),
						A2($elm$html$Html$Attributes$style, 'border', 'none'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
						A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Save as Template')
					]))
			]));
};
var $author$project$ViewLanguages$viewLanguageItem = F3(
	function (model, project, isCurrent) {
		var languageFamilyName = function () {
			var _v0 = model.a.ct.dq;
			if (!_v0.$) {
				var familyId = _v0.a;
				return A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.I;
						},
						$elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (f) {
									return _Utils_eq(f.ae, familyId);
								},
								model.m))));
			} else {
				return '';
			}
		}();
		var isRenaming = _Utils_eq(
			model.by,
			$elm$core$Maybe$Just(project.bn));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('project-item'),
					A2($elm$html$Html$Attributes$style, 'padding', '12px'),
					A2($elm$html$Html$Attributes$style, 'margin', '8px 0'),
					A2(
					$elm$html$Html$Attributes$style,
					'border',
					isCurrent ? '2px solid #4CAF50' : '1px solid #ddd'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isCurrent ? '#e8f5e9' : '#f9f9f9'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2(
					$elm$html$Html$Attributes$style,
					'cursor',
					((!isCurrent) && (!isRenaming)) ? 'pointer' : 'default'),
					$elm$html$Html$Events$onClick(
					((!isCurrent) && (!isRenaming)) ? $author$project$Msg$SwitchToProject(project.bn) : $author$project$Msg$NoOp)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex', '1')
						]),
					_List_fromArray(
						[
							isRenaming ? A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$value(model.az),
											$elm$html$Html$Events$onInput($author$project$Msg$UpdateRenameInput),
											$elm$html$Html$Events$onClick($author$project$Msg$NoOp),
											A2($elm$html$Html$Attributes$style, 'padding', '6px'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #4CAF50'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'font-size', '1em'),
											A2($elm$html$Html$Attributes$style, 'flex', '1')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$ConfirmRenameProject(project.bn)),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('✓')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Msg$CancelRenameProject),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'background', '#718096'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('✕')
										]))
								])) : A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
											A2($elm$html$Html$Attributes$style, 'font-size', '1.1em'),
											A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '2px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(project.I),
											isCurrent ? A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'color', '#4CAF50'),
													A2($elm$html$Html$Attributes$style, 'margin-left', '10px'),
													A2($elm$html$Html$Attributes$style, 'font-weight', 'normal'),
													A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(Current)')
												])) : $elm$html$Html$text('')
										])),
									(!$elm$core$String$isEmpty(languageFamilyName)) ? A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
											A2($elm$html$Html$Attributes$style, 'color', '#555'),
											A2($elm$html$Html$Attributes$style, 'margin-top', '2px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Family: ' + languageFamilyName)
										])) : $elm$html$Html$text(''),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
											A2($elm$html$Html$Attributes$style, 'color', '#888'),
											A2($elm$html$Html$Attributes$style, 'margin-top', '2px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											'Last modified: ' + $author$project$ViewHelpers$formatTimestamp(project.cu))
										]))
								]))
						])),
					(!isRenaming) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'gap', '8px'),
							$elm$html$Html$Events$onClick($author$project$Msg$NoOp)
						]),
					_List_fromArray(
						[
							isCurrent ? $author$project$ViewLanguages$viewCurrentProjectActions(model) : A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											A2($author$project$Msg$StartRenameProject, project.bn, project.I)),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'background', '#FF9800'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Rename')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$OpenDuplicateProjectModal(project.bn)),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'background', '#9C27B0'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Duplicate')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$ConfirmDeleteProject(project.bn)),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
											A2($elm$html$Html$Attributes$style, 'color', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Delete')
										]))
								]))
						])) : $elm$html$Html$text('')
				]));
	});
var $author$project$ViewLanguages$viewLanguagesManagement = function (model) {
	var languageBelongsToProject = function (proj) {
		if (model.b5) {
			return true;
		} else {
			var _v3 = model.N;
			if (_v3.$ === 1) {
				return true;
			} else {
				var projectUuid = _v3.a;
				var _v4 = _Utils_eq(proj.bn, model.O);
				if (_v4) {
					var _v5 = model.a.ct.dq;
					if (_v5.$ === 1) {
						return false;
					} else {
						var familyUuid = _v5.a;
						var rootFamilyUuid = A2($author$project$ViewLanguages$getRootFamilyUuid, familyUuid, model.m);
						var rootFamily = $elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (f) {
									return _Utils_eq(f.ae, rootFamilyUuid);
								},
								model.m));
						if (!rootFamily.$) {
							var family = rootFamily.a;
							return A2($elm$core$List$member, projectUuid, family.dG);
						} else {
							return false;
						}
					}
				} else {
					return true;
				}
			}
		}
	};
	var otherProjects = A2(
		$elm$core$List$filter,
		function (p) {
			return (!_Utils_eq(p.bn, model.O)) && languageBelongsToProject(p);
		},
		model.b$);
	var currentProject = $elm$core$List$head(
		A2(
			$elm$core$List$filter,
			function (p) {
				return _Utils_eq(p.bn, model.O);
			},
			model.b$));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Languages')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Manage your language construction projects. Click on a language to select it.')
					])),
				(!$elm$core$List$isEmpty(model.P)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px'),
						A2($elm$html$Html$Attributes$style, 'padding', '15px'),
						A2($elm$html$Html$Attributes$style, 'background', '#f0f8ff'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h4,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2d3748')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Filter by Project')
							])),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '8px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(model.b5),
										$elm$html$Html$Events$onInput(
										function (_v0) {
											return $author$project$Msg$ToggleShowAllLanguages;
										}),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Show all languages regardless of project')
									]))
							])),
						(!model.b5) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Project:')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											return (val === 'all') ? $author$project$Msg$UpdateCurrentProjectFilter($elm$core$Maybe$Nothing) : $author$project$Msg$UpdateCurrentProjectFilter(
												$elm$core$Maybe$Just(val));
										}),
										A2($elm$html$Html$Attributes$style, 'padding', '8px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('all'),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(model.N, $elm$core$Maybe$Nothing))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(All Projects)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (project) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(project.ae),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.N,
															$elm$core$Maybe$Just(project.ae)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(project.I)
													]));
										},
										model.P)))
							])) : $elm$html$Html$text('')
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('new-project-form'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$OpenNewProjectModal),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
								A2($elm$html$Html$Attributes$style, 'margin-right', '10px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('✚ Create New Language')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$ImportProject),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#718096'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '500')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Import from JSON')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$ExportProject),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#FF9800'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
								A2($elm$html$Html$Attributes$style, 'margin-left', '10px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Export Current')
							]))
					])),
				function () {
				var _v1 = model.bo;
				if (!_v1.$) {
					var errorMsg = _v1.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('error-message'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(errorMsg),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('small'),
										$elm$html$Html$Events$onClick($author$project$Msg$DismissImportError)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('×')
									]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				$elm$core$List$isEmpty(model.b$) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', '#666'),
						A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
						A2($elm$html$Html$Attributes$style, 'padding', '20px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('No languages found. Create your first language above!')
					])) : A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						function () {
						if (!currentProject.$) {
							var proj = currentProject.a;
							return A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
												A2($elm$html$Html$Attributes$style, 'margin-top', '20px'),
												A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Current Language')
											])),
										A3($author$project$ViewLanguages$viewLanguageItem, model, proj, true)
									]));
						} else {
							return $elm$html$Html$text('');
						}
					}(),
						(!$elm$core$List$isEmpty(otherProjects)) ? A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '30px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Other Languages (' + ($elm$core$String$fromInt(
											$elm$core$List$length(otherProjects)) + ')'))
									])),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (p) {
										return A3($author$project$ViewLanguages$viewLanguageItem, model, p, false);
									},
									otherProjects))
							])) : $elm$html$Html$text('')
					]))
			]));
};
var $author$project$Msg$ConfirmDeleteProjectByUuid = function (a) {
	return {$: 232, a: a};
};
var $author$project$Msg$OpenAddProjectModal = {$: 224};
var $author$project$Msg$SetActiveProject = function (a) {
	return {$: 238, a: a};
};
var $author$project$Msg$StartEditProject = function (a) {
	return {$: 229, a: a};
};
var $author$project$Msg$ToggleProjectOnFamily = F2(
	function (a, b) {
		return {$: 236, a: a, b: b};
	});
var $author$project$ViewLanguages$viewProjectsManagement = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Language Projects')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Projects are tags/collections for organizing language families. Only root families (without parents) can be assigned to projects.')
					])),
				(!$elm$core$List$isEmpty(model.P)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px'),
						A2($elm$html$Html$Attributes$style, 'padding', '15px'),
						A2($elm$html$Html$Attributes$style, 'background', '#f0f8ff'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h4,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2d3748')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Active Project')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Select an active project to use as the default filter in Languages and Language Families sections.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Active Project:')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											return (val === 'none') ? $author$project$Msg$SetActiveProject($elm$core$Maybe$Nothing) : $author$project$Msg$SetActiveProject(
												$elm$core$Maybe$Just(val));
										}),
										A2($elm$html$Html$Attributes$style, 'padding', '8px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('none'),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(model.aH, $elm$core$Maybe$Nothing))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(None)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (project) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(project.ae),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.aH,
															$elm$core$Maybe$Just(project.ae)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(project.I)
													]));
										},
										model.P)))
							]))
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$OpenAddProjectModal),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '500')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('✚ Add Project')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '30px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2d3748')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Projects')
							])),
						$elm$core$List$isEmpty(model.P) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#666'),
								A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
								A2($elm$html$Html$Attributes$style, 'padding', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No projects defined yet. Add one above!')
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						A2(
							$elm$core$List$map,
							function (project) {
								var rootFamilies = A2(
									$elm$core$List$filter,
									function (f) {
										return _Utils_eq(f.dA, $elm$core$Maybe$Nothing) && A2($elm$core$List$member, project.ae, f.dG);
									},
									model.m);
								var familyCount = $elm$core$List$length(rootFamilies);
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'padding', '12px'),
											A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'background', '#f9f9f9'),
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
											A2($elm$html$Html$Attributes$style, 'align-items', 'center')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'flex', '1')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
															A2($elm$html$Html$Attributes$style, 'font-size', '1em'),
															A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(project.I)
														])),
													(!$elm$core$String$isEmpty(project.aq)) ? A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
															A2($elm$html$Html$Attributes$style, 'color', '#555'),
															A2($elm$html$Html$Attributes$style, 'margin-top', '4px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(project.aq)
														])) : $elm$html$Html$text(''),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
															A2($elm$html$Html$Attributes$style, 'color', '#888'),
															A2($elm$html$Html$Attributes$style, 'margin-top', '4px')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(
															$elm$core$String$fromInt(familyCount) + (' root ' + ((familyCount === 1) ? 'family' : 'families')))
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'gap', '8px')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(
															$author$project$Msg$StartEditProject(project.ae)),
															A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
															A2($elm$html$Html$Attributes$style, 'background', '#FF9800'),
															A2($elm$html$Html$Attributes$style, 'color', 'white'),
															A2($elm$html$Html$Attributes$style, 'border', 'none'),
															A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
															A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Edit')
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick(
															$author$project$Msg$ConfirmDeleteProjectByUuid(project.ae)),
															A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
															A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
															A2($elm$html$Html$Attributes$style, 'color', 'white'),
															A2($elm$html$Html$Attributes$style, 'border', 'none'),
															A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
															A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Delete')
														]))
												]))
										]));
							},
							model.P))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '40px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2d3748')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Assign Families to Projects')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Only root families (families without a parent) can be assigned to projects. Sub-families inherit project membership from their root family.')
							])),
						$elm$core$List$isEmpty(model.P) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#666'),
								A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
								A2($elm$html$Html$Attributes$style, 'padding', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create a project first to assign families to it.')
							])) : ($elm$core$List$isEmpty(
						A2(
							$elm$core$List$filter,
							function (f) {
								return _Utils_eq(f.dA, $elm$core$Maybe$Nothing);
							},
							model.m)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#666'),
								A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
								A2($elm$html$Html$Attributes$style, 'padding', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create a root language family first to assign it to projects.')
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'gap', '15px')
							]),
						A2(
							$elm$core$List$filterMap,
							function (family) {
								return _Utils_eq(family.dA, $elm$core$Maybe$Nothing) ? $elm$core$Maybe$Just(
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'padding', '12px'),
												A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'background', '#f9f9f9')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
														A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
														A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(family.I)
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'display', 'flex'),
														A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
														A2($elm$html$Html$Attributes$style, 'gap', '8px')
													]),
												A2(
													$elm$core$List$map,
													function (project) {
														var isAssigned = A2($elm$core$List$member, project.ae, family.dG);
														return A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	$elm$html$Html$Events$onClick(
																	A2($author$project$Msg$ToggleProjectOnFamily, project.ae, family.ae)),
																	A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
																	A2(
																	$elm$html$Html$Attributes$style,
																	'background',
																	isAssigned ? '#4CAF50' : '#e0e0e0'),
																	A2(
																	$elm$html$Html$Attributes$style,
																	'color',
																	isAssigned ? 'white' : '#333'),
																	A2($elm$html$Html$Attributes$style, 'border', 'none'),
																	A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
																	A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
																	A2($elm$html$Html$Attributes$style, 'font-size', '14px')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	_Utils_ap(
																		isAssigned ? '✓ ' : '',
																		project.I))
																]));
													},
													model.P))
											]))) : $elm$core$Maybe$Nothing;
							},
							model.m)))
					]))
			]));
};
var $author$project$Msg$ToggleDefaultTemplates = {$: 128};
var $author$project$Msg$OpenLoadTemplateModal = function (a) {
	return {$: 116, a: a};
};
var $author$project$ViewLanguages$viewTemplateItem = F2(
	function (model, template) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'padding', '12px'),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'background', '#f9f9f9'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'flex', '1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
									A2($elm$html$Html$Attributes$style, 'font-size', '1.1em'),
									A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(template.I)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
									A2($elm$html$Html$Attributes$style, 'color', '#555'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '4px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(template.aq)
								]))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Msg$OpenLoadTemplateModal(template.I)),
							A2($elm$html$Html$Attributes$style, 'padding', '8px 16px'),
							A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
							A2($elm$html$Html$Attributes$style, 'color', 'white'),
							A2($elm$html$Html$Attributes$style, 'border', 'none'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Use Template')
						]))
				]));
	});
var $author$project$ViewLanguages$viewTemplatesManagement = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Templates')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Templates provide pre-configured phonology, phonotactics, and morphology to help you get started quickly.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$ToggleDefaultTemplates),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#9C27B0'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
								A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.aZ ? 'Hide Default Templates' : 'Show Default Templates')
							]))
					])),
				model.aZ ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '15px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Default Templates')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						A2(
							$elm$core$List$map,
							$author$project$ViewLanguages$viewTemplateItem(model),
							$author$project$Templates$availableTemplates))
					])) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(model.a9)) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '8px'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '15px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Your Templates')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px')
							]),
						A2(
							$elm$core$List$map,
							$author$project$ViewLanguages$viewTemplateItem(model),
							model.a9))
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', '#666'),
						A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
						A2($elm$html$Html$Attributes$style, 'padding', '20px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('No custom templates yet. Save your current project as a template to see it here!')
					]))
			]));
};
var $author$project$ViewLanguages$viewLanguagesSection = F2(
	function (model, section) {
		switch (section) {
			case 'languages':
				return $author$project$ViewLanguages$viewLanguagesManagement(model);
			case 'language-families':
				return $author$project$ViewLanguages$viewLanguageFamiliesManagement(model);
			case 'projects':
				return $author$project$ViewLanguages$viewProjectsManagement(model);
			case 'templates':
				return $author$project$ViewLanguages$viewTemplatesManagement(model);
			default:
				return $author$project$ViewLanguages$viewLanguagesManagement(model);
		}
	});
var $author$project$Msg$ApplySoundChanges = {$: 165};
var $author$project$Msg$CancelSoundChanges = {$: 166};
var $author$project$Msg$PreviewSoundChanges = {$: 164};
var $author$project$Msg$UpdateSoundChangeContext = function (a) {
	return {$: 163, a: a};
};
var $author$project$Msg$UpdateSoundChangePattern = function (a) {
	return {$: 161, a: a};
};
var $author$project$Msg$UpdateSoundChangeReplacement = function (a) {
	return {$: 162, a: a};
};
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$ViewLexicon$viewBulkSoundChange = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Bulk Sound Change Tool')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Apply systematic sound changes to all words in the lexicon (e.g., simulate linguistic drift)')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'grid'),
						A2($elm$html$Html$Attributes$style, 'grid-template-columns', '1fr 1fr 2fr'),
						A2($elm$html$Html$Attributes$style, 'gap', '15px'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Find Pattern')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-soundChangePattern'),
												$elm$html$Html$Attributes$placeholder('e.g., t'),
												$elm$html$Html$Attributes$value(model.a3),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateSoundChangePattern),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('soundChangePattern')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'soundChangePattern')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('What to replace')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Replace With')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-soundChangeReplacement'),
												$elm$html$Html$Attributes$placeholder('e.g., d'),
												$elm$html$Html$Attributes$value(model.a4),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateSoundChangeReplacement),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('soundChangeReplacement')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'soundChangeReplacement')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('New sound')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Context (optional)')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateSoundChangeContext),
										$elm$html$Html$Attributes$value(model.a2),
										A2($elm$html$Html$Attributes$style, 'width', '100%')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('All positions')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('V_V')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Between vowels (V_V)')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('_V')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Before vowel (_V)')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('V_')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('After vowel (V_)')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('#_')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Word-initial (#_)')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('_#')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Word-final (_#)')
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Where to apply change')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'display', 'flex'),
						A2($elm$html$Html$Attributes$style, 'gap', '10px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$PreviewSoundChanges),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#007bff'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
								$elm$html$Html$Attributes$disabled(
								$elm$core$String$isEmpty(model.a3) || $elm$core$String$isEmpty(model.a4))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('👁 Preview Changes')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$ApplySoundChanges),
								A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#28a745'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
								A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
								$elm$html$Html$Attributes$disabled(
								$elm$core$String$isEmpty(model.a3) || $elm$core$String$isEmpty(model.a4))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('✓ Apply to All Words')
							]))
					])),
				function () {
				if (model.bK) {
					var previewChanges = A2(
						$elm$core$List$map,
						A3($author$project$MorphologyHelpers$applySoundChangeToWord, model.a3, model.a4, model.a2),
						$elm$core$Dict$values(model.a.ct.dt));
					var zipped = A3(
						$elm$core$List$map2,
						$elm$core$Tuple$pair,
						$elm$core$Dict$values(model.a.ct.dt),
						previewChanges);
					var changedWords = A2(
						$elm$core$List$filter,
						function (_v1) {
							var orig = _v1.a;
							var changed = _v1.b;
							return !_Utils_eq(orig.bR, changed.bR);
						},
						zipped);
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '15px'),
								A2($elm$html$Html$Attributes$style, 'padding', '15px'),
								A2($elm$html$Html$Attributes$style, 'background', 'white'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
								A2($elm$html$Html$Attributes$style, 'border', '2px solid #007bff')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h4,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin-top', '0')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Preview: ' + ($elm$core$String$fromInt(
											$elm$core$List$length(changedWords)) + ' words will be changed'))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'max-height', '400px'),
										A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto')
									]),
								A2(
									$elm$core$List$map,
									function (_v0) {
										var orig = _v0.a;
										var changed = _v0.b;
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'padding', '8px'),
													A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #eee'),
													A2($elm$html$Html$Attributes$style, 'display', 'flex'),
													A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'color', '#c53030')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(orig.bR)
														])),
													A2(
													$elm$html$Html$span,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('→')
														])),
													A2(
													$elm$html$Html$span,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'color', '#38a169'),
															A2($elm$html$Html$Attributes$style, 'font-weight', '600')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(changed.bR)
														]))
												]));
									},
									A2($elm$core$List$take, 20, changedWords))),
								($elm$core$List$length(changedWords) > 20) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin-top', '10px'),
										A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
										A2($elm$html$Html$Attributes$style, 'color', '#666')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'... and ' + ($elm$core$String$fromInt(
											$elm$core$List$length(changedWords) - 20) + ' more'))
									])) : $elm$html$Html$text(''),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CancelSoundChanges),
										A2($elm$html$Html$Attributes$style, 'padding', '8px 16px'),
										A2($elm$html$Html$Attributes$style, 'background', '#6c757d'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '15px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $author$project$Msg$BatchAddCategory = {$: 109};
var $author$project$Msg$BatchDeleteWords = {$: 105};
var $author$project$Msg$BatchExportWords = {$: 110};
var $author$project$Msg$BatchUpdatePos = {$: 107};
var $author$project$Msg$CancelBatchDelete = {$: 177};
var $author$project$Msg$ClearReferenceProject = {$: 157};
var $author$project$Msg$ConfirmBatchDelete = {$: 176};
var $author$project$Msg$DeselectAllWords = {$: 104};
var $author$project$Msg$ExportLexiconCSV = {$: 158};
var $author$project$Msg$ImportLexiconCSV = {$: 159};
var $author$project$Msg$OpenAddModal = {$: 24};
var $author$project$Msg$SelectAllWords = {$: 103};
var $author$project$Msg$SelectReferenceProject = function (a) {
	return {$: 156, a: a};
};
var $author$project$Msg$UpdateBatchCategoryInput = function (a) {
	return {$: 108, a: a};
};
var $author$project$Msg$UpdateBatchPosInput = function (a) {
	return {$: 106, a: a};
};
var $author$project$Msg$UpdateFilterCategory = function (a) {
	return {$: 101, a: a};
};
var $author$project$Msg$UpdateFilterPos = function (a) {
	return {$: 36, a: a};
};
var $author$project$Msg$UpdateSearchQuery = function (a) {
	return {$: 35, a: a};
};
var $author$project$ViewHelpers$filterByCategory = F2(
	function (filterValue, lexeme) {
		return (filterValue === 'all') ? true : A2($elm$core$List$member, filterValue, lexeme.ce);
	});
var $author$project$ViewHelpers$filterByPos = F2(
	function (filterValue, lexeme) {
		return (filterValue === 'all') ? true : _Utils_eq(lexeme.cG, filterValue);
	});
var $author$project$ViewHelpers$filterBySearch = F2(
	function (query, lexeme) {
		if ($elm$core$String$isEmpty(query)) {
			return true;
		} else {
			var lowerQuery = $elm$core$String$toLower(query);
			var lowerPos = $elm$core$String$toLower(lexeme.cG);
			var lowerForm = $elm$core$String$toLower(lexeme.bR);
			var lowerDef = $elm$core$String$toLower(lexeme.c9);
			return A2($elm$core$String$contains, lowerQuery, lowerForm) || (A2($elm$core$String$contains, lowerQuery, lowerDef) || A2($elm$core$String$contains, lowerQuery, lowerPos));
		}
	});
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$ViewHelpers$getAllCategories = function (lexicon) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (cat, acc) {
				return A2($elm$core$List$member, cat, acc) ? acc : _Utils_ap(
					acc,
					_List_fromArray(
						[cat]));
			}),
		_List_Nil,
		$elm$core$List$sort(
			A2(
				$elm$core$List$concatMap,
				function ($) {
					return $.ce;
				},
				lexicon)));
};
var $author$project$ViewHelpers$searchRelevance = F2(
	function (query, lexeme) {
		if ($elm$core$String$isEmpty(query)) {
			return 0;
		} else {
			var lowerQuery = $elm$core$String$toLower(query);
			var lowerPos = $elm$core$String$toLower(lexeme.cG);
			var lowerForm = $elm$core$String$toLower(lexeme.bR);
			var lowerDef = $elm$core$String$toLower(lexeme.c9);
			return _Utils_eq(lowerForm, lowerQuery) ? 3 : (A2($elm$core$String$startsWith, lowerQuery, lowerForm) ? 2 : (A2($elm$core$String$contains, lowerQuery, lowerDef) ? 1 : (A2($elm$core$String$contains, lowerQuery, lowerPos) ? 0 : (-1))));
		}
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $author$project$Msg$AddWord = {$: 23};
var $author$project$Msg$CloseAddModal = {$: 25};
var $author$project$Msg$UpdateWordDefinition = function (a) {
	return {$: 20, a: a};
};
var $author$project$Msg$UpdateWordEtymology = function (a) {
	return {$: 22, a: a};
};
var $author$project$Msg$UpdateWordForm = function (a) {
	return {$: 18, a: a};
};
var $author$project$Msg$UpdateWordOrthography = function (a) {
	return {$: 19, a: a};
};
var $author$project$Msg$UpdateWordPos = function (a) {
	return {$: 21, a: a};
};
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $author$project$ViewLexicon$viewAddModal = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal-overlay'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseAddModal),
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'right', '0'),
				A2($elm$html$Html$Attributes$style, 'bottom', '0'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-content'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true))),
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'max-width', '600px'),
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2($elm$html$Html$Attributes$style, 'max-height', '90vh'),
						A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin', '0')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Add New Word')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseAddModal),
										$elm$html$Html$Attributes$class('close-button'),
										A2($elm$html$Html$Attributes$style, 'background', 'none'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'color', '#666')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('×')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('IPA Form (with syllable separators)')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Use periods to separate syllables (e.g., ka.ta.na)')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-wordForm'),
												$elm$html$Html$Attributes$placeholder('e.g., ka.ta'),
												$elm$html$Html$Attributes$value(model.U),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordForm),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('wordForm')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												$elm$html$Html$Attributes$autofocus(true)
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'wordForm')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Orthography (without separators)')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., kata'),
										$elm$html$Html$Attributes$value(model.V),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordOrthography)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Definition')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Enter definition'),
										$elm$html$Html$Attributes$value(model.S),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordDefinition)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Part of Speech')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordPos),
										$elm$html$Html$Attributes$value(model.W)
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('noun')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Noun')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('verb')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Verb')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('adjective')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Adjective')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('adverb')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Adverb')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('pronoun')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Pronoun')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('preposition')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Preposition')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('conjunction')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Conjunction')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('interjection')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Interjection')
											])),
										A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('particle')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Particle')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Etymology (optional)')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Use @ProjectName:word to link to words in other projects')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Origin or source of the word'),
										$elm$html$Html$Attributes$value(model.T),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordEtymology)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$AddWord),
										A2($elm$html$Html$Attributes$style, 'flex', '1'),
										A2($elm$html$Html$Attributes$style, 'padding', '12px'),
										A2($elm$html$Html$Attributes$style, 'background', '#4299e1'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.U)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.S)))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Save Word')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseAddModal),
										$elm$html$Html$Attributes$class('secondary'),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddAntonym = {$: 93};
var $author$project$Msg$AddLexemeCategory = {$: 99};
var $author$project$Msg$AddRelated = {$: 94};
var $author$project$Msg$AddSynonym = {$: 92};
var $author$project$Msg$CancelEdit = {$: 29};
var $author$project$Msg$CloseEditModal = {$: 30};
var $author$project$Msg$RemoveAntonym = function (a) {
	return {$: 96, a: a};
};
var $author$project$Msg$RemoveLexemeCategory = function (a) {
	return {$: 100, a: a};
};
var $author$project$Msg$RemoveRelated = function (a) {
	return {$: 97, a: a};
};
var $author$project$Msg$RemoveSynonym = function (a) {
	return {$: 95, a: a};
};
var $author$project$Msg$UpdateAntonymInput = function (a) {
	return {$: 90, a: a};
};
var $author$project$Msg$UpdateLexemeCategoryInput = function (a) {
	return {$: 98, a: a};
};
var $author$project$Msg$UpdateRelatedInput = function (a) {
	return {$: 91, a: a};
};
var $author$project$Msg$UpdateSynonymInput = function (a) {
	return {$: 89, a: a};
};
var $author$project$Msg$UpdateWord = {$: 27};
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$UpdateHelpers$isNonEmpty = function (str) {
	return $elm$core$String$trim(str) !== '';
};
var $author$project$ViewLexicon$viewEditModal = function (model) {
	var _v0 = model.s;
	if (!_v0.$) {
		var uuid = _v0.a;
		var stopProp = function (msg) {
			return {g: msg, h: false, i: true};
		};
		var currentWord = A2($elm$core$Dict$get, uuid, model.a.ct.dt);
		var semanticLinks = function () {
			if (!currentWord.$) {
				var word = currentWord.a;
				return word.dK;
			} else {
				return {cd: _List_Nil, cM: _List_Nil, cS: _List_Nil};
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('modal-overlay'),
					$elm$html$Html$Events$onClick($author$project$Msg$CloseEditModal),
					A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
					A2($elm$html$Html$Attributes$style, 'top', '0'),
					A2($elm$html$Html$Attributes$style, 'left', '0'),
					A2($elm$html$Html$Attributes$style, 'right', '0'),
					A2($elm$html$Html$Attributes$style, 'bottom', '0'),
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
					A2($elm$html$Html$Attributes$style, 'padding', '20px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-content'),
							A2(
							$elm$html$Html$Events$stopPropagationOn,
							'click',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($author$project$Msg$NoOp, true))),
							A2($elm$html$Html$Attributes$style, 'background', 'white'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '30px'),
							A2($elm$html$Html$Attributes$style, 'max-width', '600px'),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'max-height', '90vh'),
							A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
									A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin', '0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Edit Word')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Msg$CloseEditModal),
											$elm$html$Html$Attributes$class('close-button'),
											A2($elm$html$Html$Attributes$style, 'background', 'none'),
											A2($elm$html$Html$Attributes$style, 'border', 'none'),
											A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
											A2($elm$html$Html$Attributes$style, 'color', '#666')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('×')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('IPA Form (with syllable separators)')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-text'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Use periods to separate syllables (e.g., ka.ta.na)')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'position', 'relative')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('text'),
													$elm$html$Html$Attributes$id('ipa-input-wordForm'),
													$elm$html$Html$Attributes$placeholder('e.g., ka.ta'),
													$elm$html$Html$Attributes$value(model.U),
													$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordForm),
													$elm$html$Html$Events$onFocus(
													$author$project$Msg$FocusIPAField('wordForm')),
													$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField)
												]),
											_List_Nil),
											A2($author$project$ViewComponents$viewIPADropdown, model, 'wordForm')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Orthography (without separators)')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$placeholder('e.g., kata'),
											$elm$html$Html$Attributes$value(model.V),
											$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordOrthography)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Definition')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$placeholder('Enter definition'),
											$elm$html$Html$Attributes$value(model.S),
											$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordDefinition)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Part of Speech')
										])),
									A2(
									$elm$html$Html$select,
									_List_fromArray(
										[
											$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordPos),
											$elm$html$Html$Attributes$value(model.W)
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('noun')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Noun')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('verb')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Verb')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('adjective')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Adjective')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('adverb')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Adverb')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('pronoun')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Pronoun')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('preposition')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Preposition')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('conjunction')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Conjunction')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('interjection')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Interjection')
												])),
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('particle')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Particle')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Etymology (optional)')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-text'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Use @ProjectName:word to link to words in other projects')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$placeholder('Origin or source of the word'),
											$elm$html$Html$Attributes$value(model.T),
											$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordEtymology)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'border-top', '1px solid #e2e8f0'),
									A2($elm$html$Html$Attributes$style, 'padding-top', '20px'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-top', '0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Semantic Links')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-text'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Link this word to related words in your lexicon')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('form-group')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$label,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Synonyms')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('inline-form')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$input,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('text'),
															$elm$html$Html$Attributes$placeholder('Add synonym'),
															$elm$html$Html$Attributes$value(model.aE),
															$elm$html$Html$Events$onInput($author$project$Msg$UpdateSynonymInput),
															$author$project$UpdateHelpers$onEnter(
															$author$project$UpdateHelpers$isNonEmpty(model.aE) ? $author$project$Msg$AddSynonym : $author$project$Msg$NoOp),
															$elm$html$Html$Attributes$classList(
															_List_fromArray(
																[
																	_Utils_Tuple2(
																	'error',
																	(!$author$project$UpdateHelpers$isNonEmpty(model.aE)) && (model.aE !== ''))
																]))
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Msg$AddSynonym),
															$elm$html$Html$Attributes$class('plus-btn'),
															$elm$html$Html$Attributes$disabled(
															!$author$project$UpdateHelpers$isNonEmpty(model.aE))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('+')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('tag-list')
												]),
											A2(
												$elm$core$List$map,
												function (syn) {
													return A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('tag')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(syn),
																A2(
																$elm$html$Html$button,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('tag-remove'),
																		$elm$html$Html$Events$onClick(
																		$author$project$Msg$RemoveSynonym(syn))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('×')
																	]))
															]));
												},
												semanticLinks.cS))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('form-group')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$label,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Antonyms')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('inline-form')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$input,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('text'),
															$elm$html$Html$Attributes$placeholder('Add antonym'),
															$elm$html$Html$Attributes$value(model.ap),
															$elm$html$Html$Events$onInput($author$project$Msg$UpdateAntonymInput),
															$author$project$UpdateHelpers$onEnter(
															$author$project$UpdateHelpers$isNonEmpty(model.ap) ? $author$project$Msg$AddAntonym : $author$project$Msg$NoOp),
															$elm$html$Html$Attributes$classList(
															_List_fromArray(
																[
																	_Utils_Tuple2(
																	'error',
																	(!$author$project$UpdateHelpers$isNonEmpty(model.ap)) && (model.ap !== ''))
																]))
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Msg$AddAntonym),
															$elm$html$Html$Attributes$class('plus-btn'),
															$elm$html$Html$Attributes$disabled(
															!$author$project$UpdateHelpers$isNonEmpty(model.ap))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('+')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('tag-list')
												]),
											A2(
												$elm$core$List$map,
												function (ant) {
													return A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('tag')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(ant),
																A2(
																$elm$html$Html$button,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('tag-remove'),
																		$elm$html$Html$Events$onClick(
																		$author$project$Msg$RemoveAntonym(ant))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('×')
																	]))
															]));
												},
												semanticLinks.cd))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('form-group')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$label,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Related Words')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('inline-form')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$input,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('text'),
															$elm$html$Html$Attributes$placeholder('Add related word'),
															$elm$html$Html$Attributes$value(model.ay),
															$elm$html$Html$Events$onInput($author$project$Msg$UpdateRelatedInput),
															$author$project$UpdateHelpers$onEnter(
															$author$project$UpdateHelpers$isNonEmpty(model.ay) ? $author$project$Msg$AddRelated : $author$project$Msg$NoOp),
															$elm$html$Html$Attributes$classList(
															_List_fromArray(
																[
																	_Utils_Tuple2(
																	'error',
																	(!$author$project$UpdateHelpers$isNonEmpty(model.ay)) && (model.ay !== ''))
																]))
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Msg$AddRelated),
															$elm$html$Html$Attributes$class('plus-btn'),
															$elm$html$Html$Attributes$disabled(
															!$author$project$UpdateHelpers$isNonEmpty(model.ay))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('+')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('tag-list')
												]),
											A2(
												$elm$core$List$map,
												function (rel) {
													return A2(
														$elm$html$Html$span,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('tag')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(rel),
																A2(
																$elm$html$Html$button,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('tag-remove'),
																		$elm$html$Html$Events$onClick(
																		$author$project$Msg$RemoveRelated(rel))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('×')
																	]))
															]));
												},
												semanticLinks.cM))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'border-top', '1px solid #e2e8f0'),
									A2($elm$html$Html$Attributes$style, 'padding-top', '20px'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-top', '0')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Categories')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('help-text'),
											A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Organize words by semantic fields (e.g., body parts, kinship, nature)')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('form-group')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$label,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Add Category')
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('inline-form')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$input,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$type_('text'),
															$elm$html$Html$Attributes$placeholder('e.g., body parts, kinship'),
															$elm$html$Html$Attributes$value(model.bs),
															$elm$html$Html$Events$onInput($author$project$Msg$UpdateLexemeCategoryInput),
															$author$project$UpdateHelpers$onEnter(
															$author$project$UpdateHelpers$isNonEmpty(model.bs) ? $author$project$Msg$AddLexemeCategory : $author$project$Msg$NoOp),
															$elm$html$Html$Attributes$classList(
															_List_fromArray(
																[
																	_Utils_Tuple2(
																	'error',
																	(!$author$project$UpdateHelpers$isNonEmpty(model.bs)) && (model.bs !== ''))
																]))
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Msg$AddLexemeCategory),
															$elm$html$Html$Attributes$class('plus-btn'),
															$elm$html$Html$Attributes$disabled(
															!$author$project$UpdateHelpers$isNonEmpty(model.bs))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('+')
														]))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('tag-list')
												]),
											function () {
												if (!currentWord.$) {
													var word = currentWord.a;
													return A2(
														$elm$core$List$map,
														function (cat) {
															return A2(
																$elm$html$Html$span,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('tag')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text(cat),
																		A2(
																		$elm$html$Html$button,
																		_List_fromArray(
																			[
																				$elm$html$Html$Attributes$class('tag-remove'),
																				$elm$html$Html$Events$onClick(
																				$author$project$Msg$RemoveLexemeCategory(cat))
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('×')
																			]))
																	]));
														},
														word.ce);
												} else {
													return _List_Nil;
												}
											}())
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '10px'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Msg$UpdateWord),
											A2($elm$html$Html$Attributes$style, 'flex', '1')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Update Word')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Msg$CancelEdit),
											$elm$html$Html$Attributes$class('secondary'),
											A2($elm$html$Html$Attributes$style, 'flex', '1')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Cancel')
										]))
								]))
						]))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Msg$DeleteWord = function (a) {
	return {$: 28, a: a};
};
var $author$project$Msg$EditWord = function (a) {
	return {$: 26, a: a};
};
var $author$project$Msg$ToggleWordSelection = function (a) {
	return {$: 102, a: a};
};
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Types$ReferencePart = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Types$TextPart = function (a) {
	return {$: 0, a: a};
};
var $author$project$ViewHelpers$isWordChar = function (c) {
	return $elm$core$Char$isAlphaNum(c) || ((c === '-') || ((c === '_') || (c === '*')));
};
var $author$project$ViewHelpers$takeWhile = F2(
	function (predicate, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			var x = list.a;
			var xs = list.b;
			return predicate(x) ? A2(
				$elm$core$List$cons,
				x,
				A2($author$project$ViewHelpers$takeWhile, predicate, xs)) : _List_Nil;
		}
	});
var $author$project$ViewHelpers$extractWord = function (text) {
	var chars = $elm$core$String$toList(text);
	var wordChars = A2($author$project$ViewHelpers$takeWhile, $author$project$ViewHelpers$isWordChar, chars);
	return $elm$core$String$fromList(wordChars);
};
var $author$project$ViewHelpers$findNextReference = function (text) {
	var _v0 = A2($elm$core$String$indexes, '@', text);
	if (!_v0.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var firstIndex = _v0.a;
		var beforeAt = A2($elm$core$String$left, firstIndex, text);
		var afterAt = A2($elm$core$String$dropLeft, firstIndex + 1, text);
		var _v1 = A2($elm$core$String$indexes, ':', afterAt);
		if (!_v1.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var colonIndex = _v1.a;
			var projectName = A2($elm$core$String$left, colonIndex, afterAt);
			var afterColon = A2($elm$core$String$dropLeft, colonIndex + 1, afterAt);
			var word = $author$project$ViewHelpers$extractWord(afterColon);
			var afterWord = A2(
				$elm$core$String$dropLeft,
				$elm$core$String$length(word),
				afterColon);
			return ($elm$core$String$isEmpty(projectName) || $elm$core$String$isEmpty(word)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				{c1: afterWord, c4: beforeAt, dF: projectName, dT: word});
		}
	}
};
var $author$project$ViewHelpers$parseEtymologyHelper = F2(
	function (remaining, acc) {
		parseEtymologyHelper:
		while (true) {
			if ($elm$core$String$isEmpty(remaining)) {
				return $elm$core$List$reverse(acc);
			} else {
				var _v0 = $author$project$ViewHelpers$findNextReference(remaining);
				if (_v0.$ === 1) {
					return $elm$core$List$reverse(
						A2(
							$elm$core$List$cons,
							$author$project$Types$TextPart(remaining),
							acc));
				} else {
					var match = _v0.a;
					var newAcc = $elm$core$String$isEmpty(match.c4) ? A2(
						$elm$core$List$cons,
						A2($author$project$Types$ReferencePart, match.dF, match.dT),
						acc) : A2(
						$elm$core$List$cons,
						A2($author$project$Types$ReferencePart, match.dF, match.dT),
						A2(
							$elm$core$List$cons,
							$author$project$Types$TextPart(match.c4),
							acc));
					var $temp$remaining = match.c1,
						$temp$acc = newAcc;
					remaining = $temp$remaining;
					acc = $temp$acc;
					continue parseEtymologyHelper;
				}
			}
		}
	});
var $author$project$ViewHelpers$parseEtymologyReferences = function (text) {
	return A2($author$project$ViewHelpers$parseEtymologyHelper, text, _List_Nil);
};
var $author$project$ViewLexicon$viewEtymologyPart = function (part) {
	if (!part.$) {
		var text = part.a;
		return $elm$html$Html$text(text);
	} else {
		var projectName = part.a;
		var word = part.b;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('etymology-reference'),
					$elm$html$Html$Attributes$title('Reference to \'' + (word + ('\' in project \'' + (projectName + '\'')))),
					A2($elm$html$Html$Attributes$style, 'color', '#7c3aed'),
					A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
					A2($elm$html$Html$Attributes$style, 'cursor', 'help'),
					A2($elm$html$Html$Attributes$style, 'border-bottom', '1px dotted #7c3aed')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('@' + (projectName + (':' + word)))
				]));
	}
};
var $author$project$ViewLexicon$viewEtymology = function (etymology) {
	var parts = $author$project$ViewHelpers$parseEtymologyReferences(etymology.cb);
	return A2(
		$elm$html$Html$span,
		_List_Nil,
		A2($elm$core$List$map, $author$project$ViewLexicon$viewEtymologyPart, parts));
};
var $author$project$Msg$OpenMorphemeModal = function (a) {
	return {$: 31, a: a};
};
var $author$project$ViewLexicon$viewMorphemeApplication = F3(
	function (model, wordUuid, lexeme) {
		var morphemes = model.a.ct.dv.bV;
		return $elm$core$List$isEmpty(morphemes) ? $elm$html$Html$text('') : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('morpheme-application'),
					A2($elm$html$Html$Attributes$style, 'margin-top', '10px'),
					A2($elm$html$Html$Attributes$style, 'border-top', '1px solid #e5e7eb'),
					A2($elm$html$Html$Attributes$style, 'padding-top', '10px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'padding', '4px 8px'),
							A2($elm$html$Html$Attributes$style, 'font-size', '0.75em'),
							A2($elm$html$Html$Attributes$style, 'background', '#805ad5'),
							A2($elm$html$Html$Attributes$style, 'color', 'white'),
							A2($elm$html$Html$Attributes$style, 'border', 'none'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
							A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
							A2($elm$html$Html$Attributes$style, 'transition', 'all 0.2s'),
							$elm$html$Html$Events$onClick(
							$author$project$Msg$OpenMorphemeModal(wordUuid)),
							$elm$html$Html$Attributes$title('Apply morphemes to create a new word')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('+ Morphemes')
						]))
				]));
	});
var $author$project$ViewLexicon$viewSemanticLinks = function (links) {
	var hasLinks = (!$elm$core$List$isEmpty(links.cS)) || ((!$elm$core$List$isEmpty(links.cd)) || (!$elm$core$List$isEmpty(links.cM)));
	return hasLinks ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('semantic-links')
			]),
		_List_fromArray(
			[
				(!$elm$core$List$isEmpty(links.cS)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('link-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('link-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Synonyms: ')
							])),
						$elm$html$Html$text(
						A2($elm$core$String$join, ', ', links.cS))
					])) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(links.cd)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('link-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('link-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Antonyms: ')
							])),
						$elm$html$Html$text(
						A2($elm$core$String$join, ', ', links.cd))
					])) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(links.cM)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('link-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('link-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Related: ')
							])),
						$elm$html$Html$text(
						A2($elm$core$String$join, ', ', links.cM))
					])) : $elm$html$Html$text('')
			])) : $elm$html$Html$text('');
};
var $author$project$ViewLexicon$viewLexeme = F3(
	function (model, uuid, lexeme) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('word-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Attributes$checked(
							A2($elm$core$List$member, uuid, model.q)),
							$elm$html$Html$Events$onCheck(
							function (_v0) {
								return $author$project$Msg$ToggleWordSelection(uuid);
							}),
							$elm$html$Html$Attributes$class('word-checkbox')
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('word-content')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('word-header')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('word-forms')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('word-orthography')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(lexeme.cA)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('word-ipa')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(lexeme.bR)
												]))
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('word-pos')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(' (' + (lexeme.cG + ')'))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('word-definition')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(lexeme.c9)
								])),
							(!$elm$core$String$isEmpty(lexeme.dc.cb)) ? A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('word-etymology')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('etymology-label')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Etymology: ')
										])),
									$author$project$ViewLexicon$viewEtymology(lexeme.dc)
								])) : $elm$html$Html$text(''),
							$author$project$ViewLexicon$viewSemanticLinks(lexeme.dK),
							(!$elm$core$List$isEmpty(lexeme.ce)) ? A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('word-categories'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '8px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('tag-list')
										]),
									A2(
										$elm$core$List$map,
										function (cat) {
											return A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('tag'),
														A2($elm$html$Html$Attributes$style, 'background', '#e0f2fe'),
														A2($elm$html$Html$Attributes$style, 'color', '#0369a1')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(cat)
													]));
										},
										lexeme.ce))
								])) : $elm$html$Html$text(''),
							A3($author$project$ViewLexicon$viewMorphemeApplication, model, uuid, lexeme)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('word-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('secondary'),
									$elm$html$Html$Events$onClick(
									$author$project$Msg$EditWord(uuid))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Edit')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('danger'),
									$elm$html$Html$Events$onClick(
									$author$project$Msg$DeleteWord(uuid))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Delete')
								]))
						]))
				]));
	});
var $author$project$Msg$CloseMorphemeModal = {$: 32};
var $author$project$Msg$ApplyMorphemeToWord = F2(
	function (a, b) {
		return {$: 33, a: a, b: b};
	});
var $author$project$ViewLexicon$viewApplicableMorpheme = F5(
	function (model, wordUuid, lexeme, morphemeIndex, morpheme) {
		var rules = model.a.ct.dv.cy;
		var formWithMorpheme = A2($author$project$MorphologyHelpers$applyMorpheme, morpheme, lexeme.cA);
		var previewForm = A2($author$project$MorphologyHelpers$applyMorphophonemicRules, rules, formWithMorpheme);
		var wordExists = A2(
			$elm$core$List$any,
			function (lex) {
				return _Utils_eq(lex.cA, previewForm);
			},
			$elm$core$Dict$values(model.a.ct.dt));
		var textColor = wordExists ? '#9ca3af' : '#1f2937';
		var tooltipText = wordExists ? ('Word already exists: ' + previewForm) : (((!$elm$core$String$isEmpty(morpheme.df)) && (!$elm$core$String$isEmpty(morpheme.dQ))) ? (morpheme.df + ('=' + morpheme.dQ)) : ('Create new word: ' + previewForm));
		var cursorStyle = wordExists ? 'not-allowed' : 'pointer';
		var borderColor = wordExists ? '#cbd5e0' : '#d1d5db';
		var bgColor = wordExists ? '#e2e8f0' : '#f3f4f6';
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('morpheme-apply-button'),
					A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
					A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
					A2($elm$html$Html$Attributes$style, 'background', bgColor),
					A2($elm$html$Html$Attributes$style, 'border', '1px solid ' + borderColor),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2($elm$html$Html$Attributes$style, 'cursor', cursorStyle),
					A2($elm$html$Html$Attributes$style, 'transition', 'all 0.2s'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'flex-direction', 'column'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'flex-start'),
					wordExists ? $elm$html$Html$Attributes$disabled(true) : $elm$html$Html$Events$onClick(
					A2($author$project$Msg$ApplyMorphemeToWord, wordUuid, morphemeIndex)),
					$elm$html$Html$Attributes$title(tooltipText)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
							A2($elm$html$Html$Attributes$style, 'color', textColor)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(previewForm + (' (' + (morpheme.di + ')')))
						]))
				]));
	});
var $author$project$ViewLexicon$viewMorphemeModal = function (model) {
	var _v0 = model.bt;
	if (_v0.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		var wordUuid = _v0.a;
		var morphemes = model.a.ct.dv.bV;
		var lexeme = A2($elm$core$Dict$get, wordUuid, model.a.ct.dt);
		if (lexeme.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var lex = lexeme.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-overlay'),
						$elm$html$Html$Events$onClick($author$project$Msg$CloseMorphemeModal)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-content'),
								A2($elm$html$Html$Attributes$style, 'min-width', '500px'),
								A2($elm$html$Html$Attributes$style, 'max-width', '700px'),
								A2(
								$elm$html$Html$Events$stopPropagationOn,
								'click',
								$elm$json$Json$Decode$succeed(
									_Utils_Tuple2($author$project$Msg$NoOp, true)))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
										A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Apply Morpheme')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
										A2($elm$html$Html$Attributes$style, 'padding', '12px'),
										A2($elm$html$Html$Attributes$style, 'background', '#f7fafc'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '6px')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
												A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '4px')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Base word: ' + lex.cA)
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'font-size', '0.9em'),
												A2($elm$html$Html$Attributes$style, 'color', '#718096')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(lex.c9)
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'font-size', '0.9em'),
												A2($elm$html$Html$Attributes$style, 'color', '#4a5568'),
												A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Select a morpheme to apply. The morpheme will be applied with morphophonemic rules:')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'display', 'flex'),
												A2($elm$html$Html$Attributes$style, 'flex-wrap', 'wrap'),
												A2($elm$html$Html$Attributes$style, 'gap', '8px')
											]),
										A2(
											$elm$core$List$indexedMap,
											A3($author$project$ViewLexicon$viewApplicableMorpheme, model, wordUuid, lex),
											morphemes))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$CloseMorphemeModal),
												A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
												A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Close')
											]))
									]))
							]))
					]));
		}
	}
};
var $author$project$ViewLexicon$viewReferenceLexeme = function (lexeme) {
	return A2(
		$elm$html$Html$li,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('word-item'),
				A2($elm$html$Html$Attributes$style, 'background', '#f8f9fa')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('word-content'),
						A2($elm$html$Html$Attributes$style, 'flex', '1')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('word-header')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('word-form')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(lexeme.bR)
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('word-pos')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(' (' + (lexeme.cG + ')'))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('word-definition')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(lexeme.c9)
							])),
						(!$elm$core$String$isEmpty(lexeme.dc.cb)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('word-etymology')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('etymology-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Etymology: ')
									])),
								$author$project$ViewLexicon$viewEtymology(lexeme.dc)
							])) : $elm$html$Html$text(''),
						$author$project$ViewLexicon$viewSemanticLinks(lexeme.dK)
					]))
			]));
};
var $author$project$ViewLexicon$viewLexiconManagement = function (model) {
	var uuidLexicon = $elm$core$Dict$toList(model.a.ct.dt);
	var filteredLexicon = A2(
		$elm$core$List$sortBy,
		function (_v13) {
			var lexeme = _v13.b;
			return (-1) * A2($author$project$ViewHelpers$searchRelevance, model.cQ, lexeme);
		},
		A2(
			$elm$core$List$filter,
			function (_v12) {
				var lexeme = _v12.b;
				return A2($author$project$ViewHelpers$filterByCategory, model.cm, lexeme);
			},
			A2(
				$elm$core$List$filter,
				function (_v11) {
					var lexeme = _v11.b;
					return A2($author$project$ViewHelpers$filterByPos, model.cn, lexeme);
				},
				A2(
					$elm$core$List$filter,
					function (_v10) {
						var lexeme = _v10.b;
						return A2($author$project$ViewHelpers$filterBySearch, model.cQ, lexeme);
					},
					uuidLexicon))));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Lexicon')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Manage your language\'s vocabulary with definitions, parts of speech, and etymology')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$Undo),
								$elm$html$Html$Attributes$disabled(
								$elm$core$List$isEmpty(model.j)),
								$elm$html$Html$Attributes$title('Undo (Ctrl+Z)')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('⟲ Undo')
							])),
						$elm$html$Html$text(' '),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$Redo),
								$elm$html$Html$Attributes$disabled(
								$elm$core$List$isEmpty(model.r)),
								$elm$html$Html$Attributes$title('Redo (Ctrl+Y)')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('⟳ Redo')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group'),
						A2($elm$html$Html$Attributes$style, 'background', '#f0f9ff'),
						A2($elm$html$Html$Attributes$style, 'padding', '15px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Reference Project (for comparison)')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('View another project\'s lexicon alongside yours for reference and comparison')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								function (val) {
									if (val === 'none') {
										return $author$project$Msg$ClearReferenceProject;
									} else {
										var _v0 = $elm$core$String$toInt(val);
										if (!_v0.$) {
											var id = _v0.a;
											return $author$project$Msg$SelectReferenceProject(id);
										} else {
											return $author$project$Msg$ClearReferenceProject;
										}
									}
								}),
								$elm$html$Html$Attributes$value(
								function () {
									var _v1 = model.bx;
									if (!_v1.$) {
										var id = _v1.a;
										return $elm$core$String$fromInt(id);
									} else {
										return 'none';
									}
								}())
							]),
						_Utils_ap(
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('none')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('None - No reference project')
										]))
								]),
							A2(
								$elm$core$List$map,
								function (p) {
									return (!_Utils_eq(p.bn, model.O)) ? A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(p.bn))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(p.I)
											])) : A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(p.bn)),
												$elm$html$Html$Attributes$disabled(true)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(p.I + ' (current)')
											]));
								},
								model.b$)))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Search')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('Search by word form or definition'),
								$elm$html$Html$Attributes$value(model.cQ),
								$elm$html$Html$Events$onInput($author$project$Msg$UpdateSearchQuery)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Filter by Part of Speech')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput($author$project$Msg$UpdateFilterPos),
								$elm$html$Html$Attributes$value(model.cn)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('all')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('All')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('noun')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Noun')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('verb')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Verb')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('adjective')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Adjective')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('adverb')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Adverb')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('pronoun')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Pronoun')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('preposition')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Preposition')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('conjunction')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Conjunction')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('interjection')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Interjection')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('particle')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Particle')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Filter by Category')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput($author$project$Msg$UpdateFilterCategory),
								$elm$html$Html$Attributes$value(model.cm)
							]),
						_Utils_ap(
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('all')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('All')
										]))
								]),
							A2(
								$elm$core$List$map,
								function (cat) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(cat)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(cat)
											]));
								},
								$author$project$ViewHelpers$getAllCategories(
									$elm$core$Dict$values(model.a.ct.dt)))))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Msg$OpenAddModal),
						A2($elm$html$Html$Attributes$style, 'margin', '20px 0'),
						A2($elm$html$Html$Attributes$style, 'padding', '12px 24px'),
						A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
						A2($elm$html$Html$Attributes$style, 'background', '#38a169'),
						A2($elm$html$Html$Attributes$style, 'color', 'white'),
						A2($elm$html$Html$Attributes$style, 'border', 'none'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
						A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
						A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('➕ Add New Word')
					])),
				(!$elm$core$List$isEmpty(model.q)) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('batch-operations')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Batch Operations')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('batch-controls')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('batch-actions')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('selected-count')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(
													$elm$core$List$length(model.q)) + ' word(s) selected')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$DeselectAllWords)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Deselect All')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$BatchExportWords),
												A2($elm$html$Html$Attributes$style, 'background', '#4299e1')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Export Selected')
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('batch-actions')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-right', '10px')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Set Part of Speech:')
											])),
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(model.bN),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateBatchPosInput),
												A2($elm$html$Html$Attributes$style, 'width', 'auto'),
												A2($elm$html$Html$Attributes$style, 'margin-right', '10px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('-- Select POS --')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('noun')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Noun')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('verb')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Verb')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('adjective')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Adjective')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('adverb')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Adverb')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('pronoun')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Pronoun')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('preposition')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Preposition')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('conjunction')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Conjunction')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('interjection')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Interjection')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('particle')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Particle')
													]))
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$BatchUpdatePos),
												$elm$html$Html$Attributes$disabled(
												$elm$core$String$isEmpty(model.bN))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Apply')
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('batch-actions')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'margin-right', '10px')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Add Category:')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$placeholder('Category name'),
												$elm$html$Html$Attributes$value(model.ba),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateBatchCategoryInput),
												A2($elm$html$Html$Attributes$style, 'width', '150px'),
												A2($elm$html$Html$Attributes$style, 'margin-right', '10px')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$BatchAddCategory),
												$elm$html$Html$Attributes$disabled(
												$elm$core$String$isEmpty(model.ba))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Add to Selected')
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('batch-actions')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$ConfirmBatchDelete),
												$elm$html$Html$Attributes$class('danger'),
												A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('🗑 Delete Selected Words')
											]))
									]))
							]))
					])) : $elm$html$Html$text(''),
				model.bF ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-overlay')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-content')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('⚠️ Confirm Batch Delete')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'You are about to delete ' + ($elm$core$String$fromInt(
											$elm$core$List$length(model.q)) + ' word(s). This action cannot be undone.'))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'gap', '10px'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$BatchDeleteWords),
												$elm$html$Html$Attributes$class('danger'),
												A2($elm$html$Html$Attributes$style, 'flex', '1')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Delete Words')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$CancelBatchDelete),
												$elm$html$Html$Attributes$class('secondary'),
												A2($elm$html$Html$Attributes$style, 'flex', '1')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Cancel')
											]))
									]))
							]))
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('word-count')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							$elm$core$List$length(filteredLexicon)) + ' word(s)'),
						(!_Utils_eq(
						$elm$core$List$length(filteredLexicon),
						$elm$core$Dict$size(model.a.ct.dt))) ? $elm$html$Html$text(
						' (filtered from ' + ($elm$core$String$fromInt(
							$elm$core$Dict$size(model.a.ct.dt)) + ' total)')) : $elm$html$Html$text(''),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$ExportLexiconCSV),
								A2($elm$html$Html$Attributes$style, 'margin-left', '15px'),
								A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
								A2($elm$html$Html$Attributes$style, 'background', '#38a169')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('📥 Export CSV')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Msg$ImportLexiconCSV),
								A2($elm$html$Html$Attributes$style, 'margin-left', '8px'),
								A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
								A2($elm$html$Html$Attributes$style, 'background', '#4299e1')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('📤 Import CSV')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick(
								$elm$core$List$isEmpty(model.q) ? $author$project$Msg$SelectAllWords : $author$project$Msg$DeselectAllWords),
								A2($elm$html$Html$Attributes$style, 'margin-left', '8px'),
								A2($elm$html$Html$Attributes$style, 'padding', '6px 12px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$List$isEmpty(model.q) ? 'Select All' : 'Deselect All')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('word-list')
					]),
				A2(
					$elm$core$List$map,
					function (_v2) {
						var idx = _v2.a;
						var lexeme = _v2.b;
						return A3($author$project$ViewLexicon$viewLexeme, model, idx, lexeme);
					},
					filteredLexicon)),
				function () {
				var _v3 = model.b0;
				if (!_v3.$) {
					var refProj = _v3.a;
					var refLexicon = A2(
						$elm$core$List$filter,
						function (_v7) {
							var lexeme = _v7.b;
							return A2($author$project$ViewHelpers$filterByCategory, model.cm, lexeme);
						},
						A2(
							$elm$core$List$filter,
							function (_v6) {
								var lexeme = _v6.b;
								return A2($author$project$ViewHelpers$filterByPos, model.cn, lexeme);
							},
							A2(
								$elm$core$List$filter,
								function (_v5) {
									var lexeme = _v5.b;
									return A2($author$project$ViewHelpers$filterBySearch, model.cQ, lexeme);
								},
								A2(
									$elm$core$List$indexedMap,
									$elm$core$Tuple$pair,
									$elm$core$Dict$values(refProj.ct.dt)))));
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '30px'),
								A2($elm$html$Html$Attributes$style, 'padding-top', '20px'),
								A2($elm$html$Html$Attributes$style, 'border-top', '2px solid #4299e1')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', '#2c5282')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Reference: ' + refProj.I)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('word-count'),
										A2($elm$html$Html$Attributes$style, 'background', '#e6f2ff')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(
											$elm$core$List$length(refLexicon)) + ' word(s) in reference project')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('word-list')
									]),
								A2(
									$elm$core$List$map,
									function (_v4) {
										var idx = _v4.a;
										var lexeme = _v4.b;
										return $author$project$ViewLexicon$viewReferenceLexeme(lexeme);
									},
									refLexicon))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				function () {
				if (model.a0) {
					var _v8 = model.s;
					if (!_v8.$) {
						var uuid = _v8.a;
						var _v9 = A2($elm$core$Dict$get, uuid, model.a.ct.dt);
						if (!_v9.$) {
							var lexeme = _v9.a;
							return $author$project$ViewLexicon$viewEditModal(model);
						} else {
							return $elm$html$Html$text('');
						}
					} else {
						return $elm$html$Html$text('');
					}
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				model.bB ? $author$project$ViewLexicon$viewAddModal(model) : $elm$html$Html$text(''),
				model.bH ? $author$project$ViewLexicon$viewMorphemeModal(model) : $elm$html$Html$text('')
			]));
};
var $author$project$ViewLexicon$viewLexiconSection = F2(
	function (model, section) {
		switch (section) {
			case 'lexicon':
				return $author$project$ViewLexicon$viewLexiconManagement(model);
			case 'sound-changes':
				return $author$project$ViewLexicon$viewBulkSoundChange(model);
			default:
				return $author$project$ViewLexicon$viewLexiconManagement(model);
		}
	});
var $author$project$Msg$CloseLoadTemplateModal = {$: 117};
var $author$project$Msg$ConfirmLoadTemplate = {$: 120};
var $author$project$Msg$UpdateLoadTemplateFamilyInput = function (a) {
	return {$: 119, a: a};
};
var $author$project$Msg$UpdateLoadTemplateNameInput = function (a) {
	return {$: 118, a: a};
};
var $author$project$ViewLanguages$viewLoadTemplateModal = function (model) {
	var getFamilyPath = function (family) {
		var _v0 = family.dA;
		if (!_v0.$) {
			var parentId = _v0.a;
			var _v1 = $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.ae, parentId);
					},
					model.m));
			if (!_v1.$) {
				var parent = _v1.a;
				return _Utils_ap(
					getFamilyPath(parent),
					_List_fromArray(
						[family.I]));
			} else {
				return _List_fromArray(
					[family.I]);
			}
		} else {
			return _List_fromArray(
				[family.I]);
		}
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0,0,0,0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Load Template')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#555'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Enter a name for your new language and optionally select a language family.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Language Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$value(model.aj),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateLoadTemplateNameInput),
										$elm$html$Html$Attributes$placeholder('Enter language name'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Language Family (Optional)')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (val) {
											if (val === 'none') {
												return $author$project$Msg$UpdateLoadTemplateFamilyInput($elm$core$Maybe$Nothing);
											} else {
												var _v2 = $elm$core$String$toInt(val);
												if (!_v2.$) {
													var id = _v2.a;
													return $author$project$Msg$UpdateLoadTemplateFamilyInput(
														$elm$core$Maybe$Just(id));
												} else {
													return $author$project$Msg$NoOp;
												}
											}
										}),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #cbd5e0'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '14px')
									]),
								_Utils_ap(
									_List_fromArray(
										[
											A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value('none'),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(model.aw, $elm$core$Maybe$Nothing))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(No family)')
												]))
										]),
									A2(
										$elm$core$List$map,
										function (family) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(
														$elm$core$String$fromInt(family.bn)),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.aw,
															$elm$core$Maybe$Just(family.bn)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														A2(
															$elm$core$String$join,
															' > ',
															getFamilyPath(family)))
													]));
										},
										model.m)))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseLoadTemplateModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#718096'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$ConfirmLoadTemplate),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', '500')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Create Language')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddFeature = {$: 56};
var $author$project$Msg$UpdateFeatureNameInput = function (a) {
	return {$: 54, a: a};
};
var $author$project$Msg$AddFeatureValue = function (a) {
	return {$: 57, a: a};
};
var $author$project$Msg$RemoveFeature = function (a) {
	return {$: 58, a: a};
};
var $author$project$Msg$UpdateFeatureValueInput = F2(
	function (a, b) {
		return {$: 55, a: a, b: b};
	});
var $author$project$Msg$RemoveFeatureValue = F2(
	function (a, b) {
		return {$: 59, a: a, b: b};
	});
var $author$project$ViewMorphology$viewFeatureValue = F2(
	function (featureName, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('phoneme-tag')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(value),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							A2($author$project$Msg$RemoveFeatureValue, featureName, value))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('×')
						]))
				]));
	});
var $author$project$ViewMorphology$viewFeature = F2(
	function (model, feature) {
		var featureInput = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, feature.I, model.av));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('feature-group')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('feature-header')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(feature.I)
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('danger small'),
									$elm$html$Html$Events$onClick(
									$author$project$Msg$RemoveFeature(feature.I))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Remove Feature')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('feature-values')
						]),
					A2(
						$elm$core$List$map,
						$author$project$ViewMorphology$viewFeatureValue(feature.I),
						feature.dR)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-form')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$placeholder('Add value for ' + (feature.I + ' (e.g., singular, plural)')),
									$elm$html$Html$Attributes$value(featureInput),
									$elm$html$Html$Events$onInput(
									$author$project$Msg$UpdateFeatureValueInput(feature.I)),
									$author$project$UpdateHelpers$onEnter(
									$author$project$UpdateHelpers$isNonEmpty(featureInput) ? $author$project$Msg$AddFeatureValue(feature.I) : $author$project$Msg$NoOp),
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'error',
											(!$author$project$UpdateHelpers$isNonEmpty(featureInput)) && (featureInput !== ''))
										]))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Msg$AddFeatureValue(feature.I)),
									$elm$html$Html$Attributes$class('plus-btn'),
									$elm$html$Html$Attributes$disabled(
									!$author$project$UpdateHelpers$isNonEmpty(featureInput))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('+')
								]))
						]))
				]));
	});
var $author$project$ViewMorphology$viewFeatures = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Grammatical Features')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define grammatical features like person, number, tense, case, etc.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Add Feature')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('inline-form')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Feature name (e.g., Number, Person, Tense)'),
										$elm$html$Html$Attributes$value(model.bi),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateFeatureNameInput),
										$author$project$UpdateHelpers$onEnter(
										$author$project$UpdateHelpers$isNonEmpty(model.bi) ? $author$project$Msg$AddFeature : $author$project$Msg$NoOp),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2(
												'error',
												(!$author$project$UpdateHelpers$isNonEmpty(model.bi)) && (model.bi !== ''))
											]))
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$AddFeature),
										$elm$html$Html$Attributes$class('plus-btn'),
										$elm$html$Html$Attributes$disabled(
										!$author$project$UpdateHelpers$isNonEmpty(model.bi))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('+')
									]))
							]))
					])),
				$elm$core$List$isEmpty(model.a.ct.dv.bQ) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('No features defined yet. Add features above!')
					])) : A2(
				$elm$html$Html$div,
				_List_Nil,
				A2(
					$elm$core$List$map,
					$author$project$ViewMorphology$viewFeature(model),
					model.a.ct.dv.bQ))
			]));
};
var $author$project$Msg$OpenAddMorphemeModal = {$: 189};
var $author$project$Msg$EditMorpheme = function (a) {
	return {$: 67, a: a};
};
var $author$project$Msg$RemoveMorpheme = function (a) {
	return {$: 66, a: a};
};
var $author$project$ViewMorphology$viewMorpheme = F3(
	function (model, index, morpheme) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('morpheme-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('morpheme-content')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('word-form')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(morpheme.bR)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('morpheme-gloss')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('- ' + morpheme.di)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('morpheme-type')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									' [' + ($author$project$ViewHelpers$morphemeTypeToString(morpheme.du) + ']'))
								])),
							$elm$core$String$isEmpty(morpheme.df) ? $elm$html$Html$text('') : A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('morpheme-feature')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(' (' + (morpheme.df + ('=' + (morpheme.dQ + ')'))))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('word-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('secondary small'),
									$elm$html$Html$Events$onClick(
									$author$project$Msg$EditMorpheme(index))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Edit')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('danger small'),
									$elm$html$Html$Events$onClick(
									$author$project$Msg$RemoveMorpheme(morpheme))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Delete')
								]))
						]))
				]));
	});
var $author$project$ViewMorphology$viewMorphemes = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Morpheme Inventory')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define morphemes (prefixes, suffixes, infixes) with their meanings')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('plus-btn'),
						$elm$html$Html$Events$onClick($author$project$Msg$OpenAddMorphemeModal),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('+ Add Morpheme')
					])),
				$elm$core$List$isEmpty(model.a.ct.dv.bV) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('No morphemes defined yet. Click the button above to add morphemes!')
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('morpheme-list')
					]),
				A2(
					$elm$core$List$indexedMap,
					$author$project$ViewMorphology$viewMorpheme(model),
					model.a.ct.dv.bV))
			]));
};
var $author$project$Msg$OpenAddRuleModal = {$: 192};
var $author$project$Msg$RemoveMorphophonemicRule = function (a) {
	return {$: 87, a: a};
};
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$ViewMorphology$viewMorphophonemicRule = function (rule) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('morpheme-item')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('morpheme-details')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('morpheme-form')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$strong,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(rule.I)
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('morpheme-type')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										' [' + ($author$project$ViewHelpers$ruleTypeToString(rule.dJ) + ']'))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$isEmpty(rule.cg) ? (rule.dO + (' → ' + rule.dH)) : (rule.dO + (' → ' + (rule.dH + (' / ' + rule.cg)))))
							])),
						(!$elm$core$String$isEmpty(rule.aq)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(rule.aq)
							])) : $elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('danger small'),
						$elm$html$Html$Events$onClick(
						$author$project$Msg$RemoveMorphophonemicRule(rule))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Remove')
					]))
			]));
};
var $author$project$ViewMorphology$viewMorphophonemicRules = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Morphophonemic Rules')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define sound changes that occur at morpheme boundaries (assimilation, vowel harmony, etc.)')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('plus-btn'),
						$elm$html$Html$Events$onClick($author$project$Msg$OpenAddRuleModal),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('+ Add Rule')
					])),
				$elm$core$List$isEmpty(model.a.ct.dv.cy) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('No morphophonemic rules defined yet. Click the button above to add rules!')
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('morpheme-list')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Defined Rules')
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						A2($elm$core$List$map, $author$project$ViewMorphology$viewMorphophonemicRule, model.a.ct.dv.cy))
					]))
			]));
};
var $author$project$Msg$OpenAddParadigmModal = {$: 194};
var $author$project$Msg$ApplyRulesToParadigm = function (a) {
	return {$: 88, a: a};
};
var $author$project$Msg$AutoGenerateParadigmForms = function (a) {
	return {$: 78, a: a};
};
var $author$project$Msg$DuplicateParadigm = function (a) {
	return {$: 79, a: a};
};
var $author$project$Msg$RemoveParadigm = function (a) {
	return {$: 75, a: a};
};
var $author$project$Msg$UpdateParadigmBaseForm = F2(
	function (a, b) {
		return {$: 77, a: a, b: b};
	});
var $author$project$Msg$UpdateParadigmForm = F3(
	function (a, b, c) {
		return {$: 76, a: a, b: b, c: c};
	});
var $author$project$ViewMorphology$viewParadigmRow = F2(
	function (paradigmName, combination) {
		var isEmpty = $elm$core$String$isEmpty(
			$elm$core$String$trim(combination.bR));
		var cellClass = isEmpty ? 'paradigm-form paradigm-form-empty' : 'paradigm-form paradigm-form-filled';
		return A3(
			$elm$html$Html$node,
			'tr',
			_List_Nil,
			$elm$core$List$concat(
				_List_fromArray(
					[
						A2(
						$elm$core$List$map,
						function (_v0) {
							var value = _v0.b;
							return A3(
								$elm$html$Html$node,
								'td',
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(value)
									]));
						},
						combination.bQ),
						_List_fromArray(
						[
							A3(
							$elm$html$Html$node,
							'td',
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(cellClass)
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$value(combination.bR),
											$elm$html$Html$Events$onInput(
											function (newForm) {
												return A3($author$project$Msg$UpdateParadigmForm, paradigmName, newForm, combination.bQ);
											}),
											$elm$html$Html$Attributes$placeholder('Enter inflected form')
										]),
									_List_Nil)
								]))
						])
					])));
	});
var $author$project$ViewMorphology$viewParadigm = F2(
	function (morphology, paradigm) {
		var totalForms = $elm$core$List$length(paradigm.dg);
		var filledForms = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (fc) {
					return !$elm$core$String$isEmpty(
						$elm$core$String$trim(fc.bR));
				},
				paradigm.dg));
		var completionPercent = (totalForms > 0) ? ((filledForms / totalForms) * 100) : 0;
		var allFeatures = A3(
			$elm$core$List$foldl,
			F2(
				function (item, acc) {
					return A2($elm$core$List$member, item, acc) ? acc : A2($elm$core$List$cons, item, acc);
				}),
			_List_Nil,
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2(
					$elm$core$List$concatMap,
					function ($) {
						return $.bQ;
					},
					paradigm.dg)));
		var coveredFeatures = A2(
			$elm$core$List$filter,
			function (featureName) {
				return A2(
					$elm$core$List$any,
					function (m) {
						return _Utils_eq(m.df, featureName) && (!$elm$core$String$isEmpty(m.dQ));
					},
					morphology.bV);
			},
			allFeatures);
		var morphemeCoveragePercent = $elm$core$List$isEmpty(allFeatures) ? 100 : (($elm$core$List$length(coveredFeatures) / $elm$core$List$length(allFeatures)) * 100);
		var morphemeCoverageWarning = function () {
			if ((morphemeCoveragePercent < 100) && (!$elm$core$String$isEmpty(paradigm.c3))) {
				var missingFeatures = A2(
					$elm$core$List$filter,
					function (f) {
						return !A2($elm$core$List$member, f, coveredFeatures);
					},
					allFeatures);
				return '⚠ Missing morphemes for features: ' + A2($elm$core$String$join, ', ', missingFeatures);
			} else {
				return '';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('paradigm-card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('paradigm-header')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(paradigm.I)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('paradigm-pos')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('(' + (paradigm.cG + ')'))
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('paradigm-completion'),
											$elm$html$Html$Attributes$title(
											$elm$core$String$fromInt(filledForms) + (' of ' + ($elm$core$String$fromInt(totalForms) + ' forms filled')))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											' ' + ($elm$core$String$fromInt(filledForms) + ('/' + ($elm$core$String$fromInt(totalForms) + ' forms')))),
											(completionPercent === 100) ? $elm$html$Html$text(' ✓') : ((!completionPercent) ? $elm$html$Html$text(' ⚠') : $elm$html$Html$text(''))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('paradigm-actions')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('small'),
											$elm$html$Html$Events$onClick(
											$author$project$Msg$DuplicateParadigm(paradigm.I))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Duplicate')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$ApplyRulesToParadigm(paradigm.I))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Apply Rules')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('danger small'),
											$elm$html$Html$Events$onClick(
											$author$project$Msg$RemoveParadigm(paradigm.I))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Delete')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('paradigm-base-form')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Base Form:')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('text'),
									$elm$html$Html$Attributes$value(paradigm.c3),
									$elm$html$Html$Events$onInput(
									function (newBase) {
										return A2($author$project$Msg$UpdateParadigmBaseForm, paradigm.I, newBase);
									}),
									$elm$html$Html$Attributes$placeholder('Enter base/stem form'),
									A2($elm$html$Html$Attributes$style, 'width', '200px'),
									A2($elm$html$Html$Attributes$style, 'margin-right', '10px')
								]),
							_List_Nil),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Msg$AutoGenerateParadigmForms(paradigm.I)),
									$elm$html$Html$Attributes$disabled(
									$elm$core$String$isEmpty(paradigm.c3)),
									$elm$html$Html$Attributes$title(
									$elm$core$String$isEmpty(paradigm.c3) ? 'Enter a base form first' : 'Automatically generate inflected forms using morphemes and rules')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('🔄 Auto-Generate Forms')
								])),
							(!$elm$core$String$isEmpty(morphemeCoverageWarning)) ? A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('help-text warning'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '5px'),
									A2($elm$html$Html$Attributes$style, 'color', '#856404'),
									A2($elm$html$Html$Attributes$style, 'background-color', '#fff3cd'),
									A2($elm$html$Html$Attributes$style, 'padding', '8px'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(morphemeCoverageWarning)
								])) : A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('help-text'),
									A2($elm$html$Html$Attributes$style, 'margin-top', '5px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Enter a base form and click Auto-Generate to automatically apply matching morphemes and rules')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('paradigm-table')
						]),
					_List_fromArray(
						[
							A3(
							$elm$html$Html$node,
							'table',
							_List_Nil,
							_List_fromArray(
								[
									A3(
									$elm$html$Html$node,
									'thead',
									_List_Nil,
									_List_fromArray(
										[
											A3(
											$elm$html$Html$node,
											'tr',
											_List_Nil,
											$elm$core$List$concat(
												_List_fromArray(
													[
														function () {
														var _v0 = $elm$core$List$head(paradigm.dg);
														if (!_v0.$) {
															var combo = _v0.a;
															return A2(
																$elm$core$List$map,
																function (_v1) {
																	var fname = _v1.a;
																	return A3(
																		$elm$html$Html$node,
																		'th',
																		_List_Nil,
																		_List_fromArray(
																			[
																				$elm$html$Html$text(fname)
																			]));
																},
																combo.bQ);
														} else {
															return _List_Nil;
														}
													}(),
														_List_fromArray(
														[
															A3(
															$elm$html$Html$node,
															'th',
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text('Form')
																]))
														])
													])))
										])),
									A3(
									$elm$html$Html$node,
									'tbody',
									_List_Nil,
									A2(
										$elm$core$List$map,
										$author$project$ViewMorphology$viewParadigmRow(paradigm.I),
										paradigm.dg))
								]))
						]))
				]));
	});
var $author$project$ViewMorphology$viewParadigmWithContext = F2(
	function (morphology, paradigm) {
		return A2($author$project$ViewMorphology$viewParadigm, morphology, paradigm);
	});
var $author$project$ViewMorphology$viewParadigms = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Paradigm Builder')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Create inflection paradigms by selecting features and generating all combinations')
					])),
				$elm$core$List$isEmpty(model.a.ct.dv.bQ) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('warning-message')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('⚠ You need to define grammatical features first before creating paradigms.')
					])) : A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('plus-btn'),
						$elm$html$Html$Events$onClick($author$project$Msg$OpenAddParadigmModal),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('+ Create Paradigm')
					])),
				$elm$core$List$isEmpty(model.a.ct.dv.cC) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('No paradigms created yet.')
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('paradigm-list')
					]),
				A2(
					$elm$core$List$map,
					$author$project$ViewMorphology$viewParadigmWithContext(model.a.ct.dv),
					model.a.ct.dv.cC))
			]));
};
var $author$project$ViewMorphology$viewMorphologySection = F2(
	function (model, section) {
		switch (section) {
			case 'features':
				return $author$project$ViewMorphology$viewFeatures(model);
			case 'morphemes':
				return $author$project$ViewMorphology$viewMorphemes(model);
			case 'rules':
				return $author$project$ViewMorphology$viewMorphophonemicRules(model);
			case 'paradigms':
				return $author$project$ViewMorphology$viewParadigms(model);
			default:
				return $author$project$ViewMorphology$viewFeatures(model);
		}
	});
var $author$project$Msg$CloseNewProjectModal = {$: 113};
var $author$project$Msg$CreateNewProject = {$: 115};
var $author$project$Msg$UpdateNewProjectNameInput = function (a) {
	return {$: 114, a: a};
};
var $author$project$ViewApp$viewNewProjectModal = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseNewProjectModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create New Language')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Language Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., Proto-Elvish'),
										$elm$html$Html$Attributes$value(model.ak),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateNewProjectNameInput),
										$author$project$UpdateHelpers$onEnter($author$project$Msg$CreateNewProject),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseNewProjectModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#ddd'),
										A2($elm$html$Html$Attributes$style, 'color', '#333'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CreateNewProject),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.ak))),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2(
										$elm$html$Html$Attributes$style,
										'background',
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.ak)) ? '#ccc' : '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2(
										$elm$html$Html$Attributes$style,
										'cursor',
										$elm$core$String$isEmpty(
											$elm$core$String$trim(model.ak)) ? 'not-allowed' : 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✚ Create')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddConstraint = {$: 50};
var $author$project$Msg$SelectConstraintType = function (a) {
	return {$: 49, a: a};
};
var $author$project$Msg$UpdateConstraintInput = function (a) {
	return {$: 48, a: a};
};
var $author$project$ViewHelpers$constraintTypeExplanation = function (constraintType) {
	switch (constraintType) {
		case 0:
			return 'Prohibits a sequence of sounds from appearing anywhere in a word (e.g., *tl, *sr)';
		case 1:
			return 'Defines a pattern for allowed consonant clusters within syllables (e.g., CC allows 2-consonant clusters, CCC allows 3)';
		case 2:
			return 'Prohibits a sound or sequence from appearing at the beginning of a syllable';
		case 3:
			return 'Prohibits a sound or sequence from appearing at the end of a syllable';
		case 4:
			return 'Prohibits a sound or sequence from appearing at the beginning of a word';
		default:
			return 'Prohibits a sound or sequence from appearing at the end of a word';
	}
};
var $author$project$ViewHelpers$stringToConstraintType = function (str) {
	switch (str) {
		case 'IllegalCluster':
			return 0;
		case 'LegalCluster':
			return 1;
		case 'OnsetRestriction':
			return 2;
		case 'CodaRestriction':
			return 3;
		case 'NoWordInitial':
			return 4;
		case 'NoWordFinal':
			return 5;
		default:
			return 0;
	}
};
var $author$project$Msg$RemoveConstraint = function (a) {
	return {$: 51, a: a};
};
var $author$project$ViewPhonology$viewConstraint = function (constraint) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('phoneme-tag')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(constraint.aq),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Msg$RemoveConstraint(constraint))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('×')
					]))
			]));
};
var $author$project$ViewPhonology$viewConstraintsSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Phonotactic Constraints')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define phonotactic rules to control which sound sequences are allowed in your language')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Add Constraint')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('phoneme-list')
							]),
						A2($elm$core$List$map, $author$project$ViewPhonology$viewConstraint, model.a.ct.dE.c8)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'relative')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('inline-form')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												$elm$html$Html$Events$onInput(
												A2($elm$core$Basics$composeL, $author$project$Msg$SelectConstraintType, $author$project$ViewHelpers$stringToConstraintType)),
												A2($elm$html$Html$Attributes$style, 'flex', '0 0 auto'),
												A2($elm$html$Html$Attributes$style, 'width', '200px'),
												A2($elm$html$Html$Attributes$style, 'min-width', '200px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('IllegalCluster')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Illegal Cluster')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('LegalCluster')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Legal Cluster')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('OnsetRestriction')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Onset Restriction')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('CodaRestriction')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Coda Restriction')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('NoWordInitial')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('No Word-Initial')
													])),
												A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value('NoWordFinal')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('No Word-Final')
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'relative'),
												A2($elm$html$Html$Attributes$style, 'flex', '1'),
												A2($elm$html$Html$Attributes$style, 'display', 'flex')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$id('ipa-input-constraint'),
														$elm$html$Html$Attributes$placeholder(
														function () {
															var _v0 = model.c7;
															if (_v0 === 1) {
																return 'Pattern (e.g., CC, CCC, C(C)C)';
															} else {
																return 'Sequence (e.g., tl, ŋ, r)';
															}
														}()),
														$elm$html$Html$Attributes$value(model.be),
														$elm$html$Html$Events$onInput($author$project$Msg$UpdateConstraintInput),
														$elm$html$Html$Events$onFocus(
														$author$project$Msg$FocusIPAField('constraint')),
														$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
														$author$project$UpdateHelpers$onEnter(
														$author$project$UpdateHelpers$isNonEmpty(model.be) ? $author$project$Msg$AddConstraint : $author$project$Msg$NoOp),
														$elm$html$Html$Attributes$classList(
														_List_fromArray(
															[
																_Utils_Tuple2(
																'error',
																(!$author$project$UpdateHelpers$isNonEmpty(model.be)) && (model.be !== ''))
															])),
														A2($elm$html$Html$Attributes$style, 'flex', '1'),
														A2($elm$html$Html$Attributes$style, 'min-width', '200px')
													]),
												_List_Nil),
												A2($author$project$ViewComponents$viewIPADropdown, model, 'constraint')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$AddConstraint),
												$elm$html$Html$Attributes$class('plus-btn'),
												$elm$html$Html$Attributes$disabled(
												!$author$project$UpdateHelpers$isNonEmpty(model.be))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('+')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '8px'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$ViewHelpers$constraintTypeExplanation(model.c7))
							]))
					]))
			]));
};
var $author$project$Msg$AddDiphthong = {$: 197};
var $author$project$Msg$UpdateDiphthongInput = function (a) {
	return {$: 196, a: a};
};
var $author$project$Msg$RemoveDiphthong = function (a) {
	return {$: 198, a: a};
};
var $author$project$ViewPhonology$viewDiphthong = function (diphthong) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('phoneme-tag')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(diphthong),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Msg$RemoveDiphthong(diphthong))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('×')
					]))
			]));
};
var $author$project$ViewPhonology$viewDiphthongsSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Diphthongs')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define valid vowel combinations (diphthongs) in your language. These are treated as single units in word generation and orthography.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Defined Diphthongs')
							])),
						$elm$core$List$isEmpty(model.a.ct.dE.da) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No diphthongs defined yet. Add them below!')
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('phoneme-list')
							]),
						A2($elm$core$List$map, $author$project$ViewPhonology$viewDiphthong, model.a.ct.dE.da)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'relative')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('inline-form')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'relative'),
												A2($elm$html$Html$Attributes$style, 'flex', '1'),
												A2($elm$html$Html$Attributes$style, 'display', 'flex')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$id('ipa-input-diphthong'),
														$elm$html$Html$Attributes$placeholder('Diphthong (e.g., ai, au, oi, ei)'),
														$elm$html$Html$Attributes$value(model.bf),
														$elm$html$Html$Events$onInput($author$project$Msg$UpdateDiphthongInput),
														$elm$html$Html$Events$onFocus(
														$author$project$Msg$FocusIPAField('diphthong')),
														$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
														$author$project$UpdateHelpers$onEnter(
														$author$project$UpdateHelpers$isNonEmpty(model.bf) ? $author$project$Msg$AddDiphthong : $author$project$Msg$NoOp),
														$elm$html$Html$Attributes$classList(
														_List_fromArray(
															[
																_Utils_Tuple2(
																'error',
																(!$author$project$UpdateHelpers$isNonEmpty(model.bf)) && (model.bf !== ''))
															]))
													]),
												_List_Nil),
												A2($author$project$ViewComponents$viewIPADropdown, model, 'diphthong')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$AddDiphthong),
												$elm$html$Html$Attributes$class('plus-btn'),
												$elm$html$Html$Attributes$disabled(
												!$author$project$UpdateHelpers$isNonEmpty(model.bf))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('+')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '8px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Examples: ai, au, ei, oi, ui, ou, ɔɪ, aɪ, aʊ')
							]))
					]))
			]));
};
var $author$project$Msg$CloseIPACellInfoModal = {$: 173};
var $elm$html$Html$a = _VirtualDom_node('a');
var $author$project$IPAHelpers$backnessToString = function (backness) {
	switch (backness) {
		case 0:
			return 'Front';
		case 1:
			return 'Central';
		default:
			return 'Back';
	}
};
var $author$project$IPAHelpers$getConsonantPhonemesForCell = F2(
	function (place, manner) {
		var _v0 = _Utils_Tuple2(place, manner);
		_v0$42:
		while (true) {
			switch (_v0.b) {
				case 5:
					if (_v0.a === 3) {
						var _v27 = _v0.a;
						var _v28 = _v0.b;
						return _List_fromArray(
							['ɬ', 'ɮ']);
					} else {
						break _v0$42;
					}
				case 3:
					switch (_v0.a) {
						case 3:
							var _v23 = _v0.a;
							var _v24 = _v0.b;
							return _List_fromArray(
								['ɾ']);
						case 5:
							var _v41 = _v0.a;
							var _v42 = _v0.b;
							return _List_fromArray(
								['ɽ']);
						default:
							break _v0$42;
					}
				case 7:
					switch (_v0.a) {
						case 3:
							var _v31 = _v0.a;
							var _v32 = _v0.b;
							return _List_fromArray(
								['l']);
						case 5:
							var _v47 = _v0.a;
							var _v48 = _v0.b;
							return _List_fromArray(
								['ɭ']);
						case 6:
							var _v57 = _v0.a;
							var _v58 = _v0.b;
							return _List_fromArray(
								['ʎ']);
						case 7:
							var _v67 = _v0.a;
							var _v68 = _v0.b;
							return _List_fromArray(
								['ʟ']);
						default:
							break _v0$42;
					}
				case 1:
					switch (_v0.a) {
						case 0:
							var _v3 = _v0.a;
							var _v4 = _v0.b;
							return _List_fromArray(
								['m']);
						case 1:
							var _v9 = _v0.a;
							var _v10 = _v0.b;
							return _List_fromArray(
								['ɱ']);
						case 3:
							var _v19 = _v0.a;
							var _v20 = _v0.b;
							return _List_fromArray(
								['n']);
						case 5:
							var _v39 = _v0.a;
							var _v40 = _v0.b;
							return _List_fromArray(
								['ɳ']);
						case 6:
							var _v51 = _v0.a;
							var _v52 = _v0.b;
							return _List_fromArray(
								['ɲ']);
						case 7:
							var _v61 = _v0.a;
							var _v62 = _v0.b;
							return _List_fromArray(
								['ŋ']);
						case 8:
							var _v71 = _v0.a;
							var _v72 = _v0.b;
							return _List_fromArray(
								['ɴ']);
						default:
							break _v0$42;
					}
				case 2:
					switch (_v0.a) {
						case 0:
							var _v5 = _v0.a;
							var _v6 = _v0.b;
							return _List_fromArray(
								['ʙ']);
						case 3:
							var _v21 = _v0.a;
							var _v22 = _v0.b;
							return _List_fromArray(
								['r']);
						case 8:
							var _v73 = _v0.a;
							var _v74 = _v0.b;
							return _List_fromArray(
								['ʀ']);
						default:
							break _v0$42;
					}
				case 6:
					switch (_v0.a) {
						case 1:
							var _v13 = _v0.a;
							var _v14 = _v0.b;
							return _List_fromArray(
								['ʋ']);
						case 3:
							var _v29 = _v0.a;
							var _v30 = _v0.b;
							return _List_fromArray(
								['ɹ']);
						case 5:
							var _v45 = _v0.a;
							var _v46 = _v0.b;
							return _List_fromArray(
								['ɻ']);
						case 6:
							var _v55 = _v0.a;
							var _v56 = _v0.b;
							return _List_fromArray(
								['j']);
						case 7:
							var _v65 = _v0.a;
							var _v66 = _v0.b;
							return _List_fromArray(
								['ɰ']);
						case 9:
							var _v79 = _v0.a;
							var _v80 = _v0.b;
							return _List_fromArray(
								['ʕ̞']);
						default:
							break _v0$42;
					}
				case 0:
					switch (_v0.a) {
						case 0:
							var _v1 = _v0.a;
							var _v2 = _v0.b;
							return _List_fromArray(
								['p', 'b']);
						case 3:
							var _v17 = _v0.a;
							var _v18 = _v0.b;
							return _List_fromArray(
								['t', 'd']);
						case 4:
							var _v35 = _v0.a;
							var _v36 = _v0.b;
							return _List_Nil;
						case 5:
							var _v37 = _v0.a;
							var _v38 = _v0.b;
							return _List_fromArray(
								['ʈ', 'ɖ']);
						case 6:
							var _v49 = _v0.a;
							var _v50 = _v0.b;
							return _List_fromArray(
								['c', 'ɟ']);
						case 7:
							var _v59 = _v0.a;
							var _v60 = _v0.b;
							return _List_fromArray(
								['k', 'g']);
						case 8:
							var _v69 = _v0.a;
							var _v70 = _v0.b;
							return _List_fromArray(
								['q', 'ɢ']);
						case 10:
							var _v81 = _v0.a;
							var _v82 = _v0.b;
							return _List_fromArray(
								['ʔ']);
						default:
							break _v0$42;
					}
				case 4:
					switch (_v0.a) {
						case 0:
							var _v7 = _v0.a;
							var _v8 = _v0.b;
							return _List_fromArray(
								['ɸ', 'β']);
						case 1:
							var _v11 = _v0.a;
							var _v12 = _v0.b;
							return _List_fromArray(
								['f', 'v']);
						case 2:
							var _v15 = _v0.a;
							var _v16 = _v0.b;
							return _List_fromArray(
								['θ', 'ð']);
						case 3:
							var _v25 = _v0.a;
							var _v26 = _v0.b;
							return _List_fromArray(
								['s', 'z']);
						case 4:
							var _v33 = _v0.a;
							var _v34 = _v0.b;
							return _List_fromArray(
								['ʃ', 'ʒ']);
						case 5:
							var _v43 = _v0.a;
							var _v44 = _v0.b;
							return _List_fromArray(
								['ʂ', 'ʐ']);
						case 6:
							var _v53 = _v0.a;
							var _v54 = _v0.b;
							return _List_fromArray(
								['ç', 'ʝ']);
						case 7:
							var _v63 = _v0.a;
							var _v64 = _v0.b;
							return _List_fromArray(
								['x', 'ɣ']);
						case 8:
							var _v75 = _v0.a;
							var _v76 = _v0.b;
							return _List_fromArray(
								['χ', 'ʁ']);
						case 9:
							var _v77 = _v0.a;
							var _v78 = _v0.b;
							return _List_fromArray(
								['ħ', 'ʕ']);
						case 10:
							var _v83 = _v0.a;
							var _v84 = _v0.b;
							return _List_fromArray(
								['h', 'ɦ']);
						default:
							break _v0$42;
					}
				default:
					break _v0$42;
			}
		}
		return _List_Nil;
	});
var $author$project$IPAHelpers$getOtherSymbolPhonemes = function (symbolType) {
	switch (symbolType) {
		case 0:
			return _List_fromArray(
				['w']);
		case 1:
			return _List_fromArray(
				['ʍ']);
		case 2:
			return _List_fromArray(
				['ɥ̊']);
		case 3:
			return _List_fromArray(
				['ɥ']);
		case 4:
			return _List_fromArray(
				['ts']);
		case 5:
			return _List_fromArray(
				['dz']);
		case 6:
			return _List_fromArray(
				['tʃ']);
		case 7:
			return _List_fromArray(
				['dʒ']);
		case 8:
			return _List_fromArray(
				['tɕ']);
		case 9:
			return _List_fromArray(
				['dʑ']);
		case 10:
			return _List_fromArray(
				['tʂ']);
		default:
			return _List_fromArray(
				['dʐ']);
	}
};
var $author$project$IPAHelpers$getVowelPhonemesForCell = F2(
	function (height, backness) {
		var _v0 = _Utils_Tuple2(height, backness);
		_v0$17:
		while (true) {
			switch (_v0.b) {
				case 0:
					switch (_v0.a) {
						case 0:
							var _v1 = _v0.a;
							var _v2 = _v0.b;
							return _List_fromArray(
								['i', 'y']);
						case 1:
							var _v7 = _v0.a;
							var _v8 = _v0.b;
							return _List_fromArray(
								['ɪ', 'ʏ']);
						case 2:
							var _v11 = _v0.a;
							var _v12 = _v0.b;
							return _List_fromArray(
								['e', 'ø']);
						case 4:
							var _v19 = _v0.a;
							var _v20 = _v0.b;
							return _List_fromArray(
								['ɛ', 'œ']);
						case 5:
							var _v25 = _v0.a;
							var _v26 = _v0.b;
							return _List_fromArray(
								['æ']);
						case 6:
							var _v29 = _v0.a;
							var _v30 = _v0.b;
							return _List_fromArray(
								['a', 'ɶ']);
						default:
							break _v0$17;
					}
				case 1:
					switch (_v0.a) {
						case 0:
							var _v3 = _v0.a;
							var _v4 = _v0.b;
							return _List_fromArray(
								['ɨ', 'ʉ']);
						case 2:
							var _v13 = _v0.a;
							var _v14 = _v0.b;
							return _List_fromArray(
								['ɘ', 'ɵ']);
						case 3:
							var _v17 = _v0.a;
							var _v18 = _v0.b;
							return _List_fromArray(
								['ə']);
						case 4:
							var _v21 = _v0.a;
							var _v22 = _v0.b;
							return _List_fromArray(
								['ɜ', 'ɞ']);
						case 5:
							var _v27 = _v0.a;
							var _v28 = _v0.b;
							return _List_fromArray(
								['ɐ']);
						case 6:
							var _v31 = _v0.a;
							var _v32 = _v0.b;
							return _List_fromArray(
								['ä']);
						default:
							break _v0$17;
					}
				default:
					switch (_v0.a) {
						case 0:
							var _v5 = _v0.a;
							var _v6 = _v0.b;
							return _List_fromArray(
								['ɯ', 'u']);
						case 1:
							var _v9 = _v0.a;
							var _v10 = _v0.b;
							return _List_fromArray(
								['ʊ']);
						case 2:
							var _v15 = _v0.a;
							var _v16 = _v0.b;
							return _List_fromArray(
								['ɤ', 'o']);
						case 4:
							var _v23 = _v0.a;
							var _v24 = _v0.b;
							return _List_fromArray(
								['ʌ', 'ɔ']);
						case 6:
							var _v33 = _v0.a;
							var _v34 = _v0.b;
							return _List_fromArray(
								['ɑ', 'ɒ']);
						default:
							break _v0$17;
					}
			}
		}
		return _List_Nil;
	});
var $author$project$IPAHelpers$getWikimediaUrl = function (phoneme) {
	var fileMapping = _List_fromArray(
		[
			_Utils_Tuple2('p', 'Voiceless_bilabial_plosive.ogg'),
			_Utils_Tuple2('b', 'Voiced_bilabial_plosive.ogg'),
			_Utils_Tuple2('t', 'Voiceless_alveolar_plosive.ogg'),
			_Utils_Tuple2('d', 'Voiced_alveolar_plosive.ogg'),
			_Utils_Tuple2('ʈ', 'Voiceless_retroflex_plosive.ogg'),
			_Utils_Tuple2('ɖ', 'Voiced_retroflex_plosive.ogg'),
			_Utils_Tuple2('c', 'Voiceless_palatal_plosive.ogg'),
			_Utils_Tuple2('ɟ', 'Voiced_palatal_plosive.ogg'),
			_Utils_Tuple2('k', 'Voiceless_velar_plosive.ogg'),
			_Utils_Tuple2('ɡ', 'Voiced_velar_plosive.ogg'),
			_Utils_Tuple2('g', 'Voiced_velar_plosive.ogg'),
			_Utils_Tuple2('q', 'Voiceless_uvular_plosive.ogg'),
			_Utils_Tuple2('ɢ', 'Voiced_uvular_plosive.ogg'),
			_Utils_Tuple2('ʔ', 'Glottal_stop.ogg'),
			_Utils_Tuple2('m', 'Bilabial_nasal.ogg'),
			_Utils_Tuple2('ɱ', 'Labiodental_nasal.ogg'),
			_Utils_Tuple2('n', 'Alveolar_nasal.ogg'),
			_Utils_Tuple2('ɳ', 'Retroflex_nasal.ogg'),
			_Utils_Tuple2('ɲ', 'Palatal_nasal.ogg'),
			_Utils_Tuple2('ŋ', 'Velar_nasal.ogg'),
			_Utils_Tuple2('ɴ', 'Uvular_nasal.ogg'),
			_Utils_Tuple2('ʙ', 'Bilabial_trill.ogg'),
			_Utils_Tuple2('r', 'Alveolar_trill.ogg'),
			_Utils_Tuple2('ʀ', 'Uvular_trill.ogg'),
			_Utils_Tuple2('ɾ', 'Alveolar_tap.ogg'),
			_Utils_Tuple2('ɽ', 'Retroflex_flap.ogg'),
			_Utils_Tuple2('ɸ', 'Voiceless_bilabial_fricative.ogg'),
			_Utils_Tuple2('β', 'Voiced_bilabial_fricative.ogg'),
			_Utils_Tuple2('f', 'Voiceless_labiodental_fricative.ogg'),
			_Utils_Tuple2('v', 'Voiced_labiodental_fricative.ogg'),
			_Utils_Tuple2('θ', 'Voiceless_dental_fricative.ogg'),
			_Utils_Tuple2('ð', 'Voiced_dental_fricative.ogg'),
			_Utils_Tuple2('s', 'Voiceless_alveolar_sibilant.ogg'),
			_Utils_Tuple2('z', 'Voiced_alveolar_sibilant.ogg'),
			_Utils_Tuple2('ʃ', 'Voiceless_palato-alveolar_sibilant.ogg'),
			_Utils_Tuple2('ʒ', 'Voiced_palato-alveolar_sibilant.ogg'),
			_Utils_Tuple2('ʂ', 'Voiceless_retroflex_fricative.ogg'),
			_Utils_Tuple2('ʐ', 'Voiced_retroflex_fricative.ogg'),
			_Utils_Tuple2('ç', 'Voiceless_palatal_fricative.ogg'),
			_Utils_Tuple2('ʝ', 'Voiced_palatal_fricative.ogg'),
			_Utils_Tuple2('x', 'Voiceless_velar_fricative.ogg'),
			_Utils_Tuple2('ɣ', 'Voiced_velar_fricative.ogg'),
			_Utils_Tuple2('χ', 'Voiceless_uvular_fricative.ogg'),
			_Utils_Tuple2('ʁ', 'Voiced_uvular_fricative.ogg'),
			_Utils_Tuple2('ħ', 'Voiceless_pharyngeal_fricative.ogg'),
			_Utils_Tuple2('ʕ', 'Voiced_pharyngeal_fricative.ogg'),
			_Utils_Tuple2('h', 'Voiceless_glottal_fricative.ogg'),
			_Utils_Tuple2('ɦ', 'Voiced_glottal_fricative.ogg'),
			_Utils_Tuple2('ɬ', 'Voiceless_alveolar_lateral_fricative.ogg'),
			_Utils_Tuple2('ɮ', 'Voiced_alveolar_lateral_fricative.ogg'),
			_Utils_Tuple2('ʋ', 'Labiodental_approximant.ogg'),
			_Utils_Tuple2('ɹ', 'Alveolar_approximant.ogg'),
			_Utils_Tuple2('ɻ', 'Retroflex_approximant.ogg'),
			_Utils_Tuple2('j', 'Palatal_approximant.ogg'),
			_Utils_Tuple2('ɰ', 'Velar_approximant.ogg'),
			_Utils_Tuple2('w', 'Voiced_labio-velar_approximant.ogg'),
			_Utils_Tuple2('ɥ', 'Labial-palatal_approximant.ogg'),
			_Utils_Tuple2('l', 'Alveolar_lateral_approximant.ogg'),
			_Utils_Tuple2('ɭ', 'Retroflex_lateral_approximant.ogg'),
			_Utils_Tuple2('ʎ', 'Palatal_lateral_approximant.ogg'),
			_Utils_Tuple2('ʟ', 'Velar_lateral_approximant.ogg'),
			_Utils_Tuple2('a', 'Open_front_unrounded_vowel.ogg'),
			_Utils_Tuple2('e', 'Close-mid_front_unrounded_vowel.ogg'),
			_Utils_Tuple2('i', 'Close_front_unrounded_vowel.ogg'),
			_Utils_Tuple2('o', 'Close-mid_back_rounded_vowel.ogg'),
			_Utils_Tuple2('u', 'Close_back_rounded_vowel.ogg'),
			_Utils_Tuple2('y', 'Close_front_rounded_vowel.ogg'),
			_Utils_Tuple2('ø', 'Close-mid_front_rounded_vowel.ogg'),
			_Utils_Tuple2('œ', 'Open-mid_front_rounded_vowel.ogg'),
			_Utils_Tuple2('ɑ', 'Open_back_unrounded_vowel.ogg'),
			_Utils_Tuple2('ɒ', 'Open_back_rounded_vowel.ogg'),
			_Utils_Tuple2('ɔ', 'Open-mid_back_rounded_vowel.ogg'),
			_Utils_Tuple2('ə', 'Mid-central_vowel.ogg'),
			_Utils_Tuple2('ɛ', 'Open-mid_front_unrounded_vowel.ogg'),
			_Utils_Tuple2('ɜ', 'Open-mid_central_unrounded_vowel.ogg'),
			_Utils_Tuple2('ɞ', 'Open-mid_central_rounded_vowel.ogg'),
			_Utils_Tuple2('ɪ', 'Near-close_near-front_unrounded_vowel.ogg'),
			_Utils_Tuple2('ʊ', 'Near-close_near-back_rounded_vowel.ogg'),
			_Utils_Tuple2('ʌ', 'Open-mid_back_unrounded_vowel.ogg'),
			_Utils_Tuple2('æ', 'Near-open_front_unrounded_vowel.ogg'),
			_Utils_Tuple2('ɐ', 'Near-open_central_vowel.ogg'),
			_Utils_Tuple2('ɨ', 'Close_central_unrounded_vowel.ogg'),
			_Utils_Tuple2('ʉ', 'Close_central_rounded_vowel.ogg'),
			_Utils_Tuple2('ɯ', 'Close_back_unrounded_vowel.ogg'),
			_Utils_Tuple2('ɘ', 'Close-mid_central_unrounded_vowel.ogg'),
			_Utils_Tuple2('ɵ', 'Close-mid_central_rounded_vowel.ogg'),
			_Utils_Tuple2('ɤ', 'Close-mid_back_unrounded_vowel.ogg'),
			_Utils_Tuple2('ʏ', 'Near-close_near-front_rounded_vowel.ogg'),
			_Utils_Tuple2('ɶ', 'Open_front_rounded_vowel.ogg')
		]);
	var fileName = A2(
		$elm$core$Maybe$withDefault,
		'International_Phonetic_Alphabet.ogg',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			$elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (_v0) {
						var symbol = _v0.a;
						return _Utils_eq(symbol, phoneme);
					},
					fileMapping))));
	return 'https://commons.wikimedia.org/wiki/File:' + fileName;
};
var $author$project$IPAHelpers$heightToString = function (height) {
	switch (height) {
		case 0:
			return 'Close';
		case 1:
			return 'Near-Close';
		case 2:
			return 'Close-Mid';
		case 3:
			return 'Mid';
		case 4:
			return 'Open-Mid';
		case 5:
			return 'Near-Open';
		default:
			return 'Open';
	}
};
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $author$project$IPAHelpers$mannerToString = function (manner) {
	switch (manner) {
		case 0:
			return 'Plosive';
		case 1:
			return 'Nasal';
		case 2:
			return 'Trill';
		case 3:
			return 'Tap/Flap';
		case 4:
			return 'Fricative';
		case 5:
			return 'Lateral Fricative';
		case 6:
			return 'Approximant';
		case 7:
			return 'Lateral Approximant';
		default:
			return 'Other';
	}
};
var $author$project$IPAHelpers$otherSymbolTypeToString = function (symbolType) {
	switch (symbolType) {
		case 0:
			return 'Labial-velar approximant';
		case 1:
			return 'Voiceless labial-velar approximant';
		case 2:
			return 'Voiceless labial-palatal approximant';
		case 3:
			return 'Labial-palatal approximant';
		case 4:
			return 'Voiceless alveolar affricate';
		case 5:
			return 'Voiced alveolar affricate';
		case 6:
			return 'Voiceless postalveolar affricate';
		case 7:
			return 'Voiced postalveolar affricate';
		case 8:
			return 'Voiceless alveolo-palatal affricate';
		case 9:
			return 'Voiced alveolo-palatal affricate';
		case 10:
			return 'Voiceless retroflex affricate';
		default:
			return 'Voiced retroflex affricate';
	}
};
var $author$project$IPAHelpers$placeToString = function (place) {
	switch (place) {
		case 0:
			return 'Bilabial';
		case 1:
			return 'Labiodental';
		case 2:
			return 'Dental';
		case 3:
			return 'Alveolar';
		case 4:
			return 'Postalveolar';
		case 5:
			return 'Retroflex';
		case 6:
			return 'Palatal';
		case 7:
			return 'Velar';
		case 8:
			return 'Uvular';
		case 9:
			return 'Pharyngeal';
		case 10:
			return 'Glottal';
		default:
			return 'Other';
	}
};
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$ViewPhonology$viewIPACellInfoModal = function (model) {
	var _v0 = model.b2;
	if (_v0.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		var cell = _v0.a;
		var cellInfo = function () {
			switch (cell.$) {
				case 0:
					var place = cell.a;
					var manner = cell.b;
					var wikiTitle = A3(
						$elm$core$String$replace,
						' ',
						'_',
						$author$project$IPAHelpers$mannerToString(manner));
					var url = 'https://en.wikipedia.org/wiki/' + (wikiTitle + '_consonant');
					var title = $author$project$IPAHelpers$placeToString(place) + (' ' + $author$project$IPAHelpers$mannerToString(manner));
					var description = 'A ' + ($elm$core$String$toLower(
						$author$project$IPAHelpers$mannerToString(manner)) + (' consonant articulated at the ' + ($elm$core$String$toLower(
						$author$project$IPAHelpers$placeToString(place)) + ' place of articulation.')));
					return {
						aq: description,
						bw: A2($author$project$IPAHelpers$getConsonantPhonemesForCell, place, manner),
						bL: title,
						bM: url
					};
				case 1:
					var height = cell.a;
					var backness = cell.b;
					var wikiTitle = A3(
						$elm$core$String$replace,
						' ',
						'_',
						$author$project$IPAHelpers$heightToString(height) + ('_' + ($author$project$IPAHelpers$backnessToString(backness) + '_vowel')));
					var url = 'https://en.wikipedia.org/wiki/' + wikiTitle;
					var title = $author$project$IPAHelpers$heightToString(height) + (' ' + ($author$project$IPAHelpers$backnessToString(backness) + ' Vowel'));
					var description = 'A ' + ($elm$core$String$toLower(
						$author$project$IPAHelpers$heightToString(height)) + (' ' + ($elm$core$String$toLower(
						$author$project$IPAHelpers$backnessToString(backness)) + ' vowel.')));
					return {
						aq: description,
						bw: A2($author$project$IPAHelpers$getVowelPhonemesForCell, height, backness),
						bL: title,
						bM: url
					};
				default:
					var symbolType = cell.a;
					var url = 'https://en.wikipedia.org/wiki/International_Phonetic_Alphabet';
					var title = $author$project$IPAHelpers$otherSymbolTypeToString(symbolType);
					var description = 'Special IPA symbol: ' + title;
					return {
						aq: description,
						bw: $author$project$IPAHelpers$getOtherSymbolPhonemes(symbolType),
						bL: title,
						bM: url
					};
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('modal-overlay'),
					$elm$html$Html$Events$onClick($author$project$Msg$CloseIPACellInfoModal)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-content ipa-info-modal'),
							A2(
							$elm$html$Html$Events$stopPropagationOn,
							'click',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($author$project$Msg$NoOp, true)))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(cellInfo.bL)
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(cellInfo.aq)
								])),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href(cellInfo.bM),
									$elm$html$Html$Attributes$target('_blank'),
									A2($elm$html$Html$Attributes$style, 'display', 'block'),
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
									A2($elm$html$Html$Attributes$style, 'color', '#4299e1'),
									A2($elm$html$Html$Attributes$style, 'text-decoration', 'none')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('📖 Read more on Wikipedia →')
								])),
							A2(
							$elm$html$Html$h4,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Sounds in this category:')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ipa-info-phonemes')
								]),
							A2(
								$elm$core$List$map,
								function (phoneme) {
									var wikimediaUrl = $author$project$IPAHelpers$getWikimediaUrl(phoneme);
									return A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href(wikimediaUrl),
												$elm$html$Html$Attributes$target('_blank'),
												$elm$html$Html$Attributes$class('ipa-info-phoneme-link'),
												$elm$html$Html$Attributes$title('Click to hear sound sample on Wikimedia Commons')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(phoneme)
											]));
								},
								cellInfo.bw)),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('secondary'),
									$elm$html$Html$Events$onClick($author$project$Msg$CloseIPACellInfoModal),
									A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Close')
								]))
						]))
				]));
	}
};
var $author$project$Msg$CloseIPACellModal = {$: 170};
var $author$project$Msg$TogglePhonemeInCell = function (a) {
	return {$: 171, a: a};
};
var $author$project$ViewPhonology$viewIPACellModal = F2(
	function (model, allSounds) {
		var _v0 = model.b1;
		if (_v0.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var cell = _v0.a;
			var _v1 = function () {
				switch (cell.$) {
					case 0:
						var place = cell.a;
						var manner = cell.b;
						return _Utils_Tuple2(
							$author$project$IPAHelpers$placeToString(place) + (' ' + $author$project$IPAHelpers$mannerToString(manner)),
							A2($author$project$IPAHelpers$getConsonantPhonemesForCell, place, manner));
					case 1:
						var height = cell.a;
						var backness = cell.b;
						return _Utils_Tuple2(
							$author$project$IPAHelpers$heightToString(height) + (' ' + $author$project$IPAHelpers$backnessToString(backness)),
							A2($author$project$IPAHelpers$getVowelPhonemesForCell, height, backness));
					default:
						var symbolType = cell.a;
						return _Utils_Tuple2(
							$author$project$IPAHelpers$otherSymbolTypeToString(symbolType),
							$author$project$IPAHelpers$getOtherSymbolPhonemes(symbolType));
				}
			}();
			var cellTitle = _v1.a;
			var availablePhonemes = _v1.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-overlay'),
						$elm$html$Html$Events$onClick($author$project$Msg$CloseIPACellModal)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-content'),
								A2($elm$html$Html$Attributes$style, 'max-width', '500px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(cellTitle)
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Click a phoneme to add or remove it from your language:')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('phoneme-selector-grid')
									]),
								A2(
									$elm$core$List$map,
									function (phoneme) {
										var isIncluded = A2($elm$core$List$member, phoneme, allSounds);
										var className = isIncluded ? 'phoneme-selector-item included' : 'phoneme-selector-item';
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class(className),
													$elm$html$Html$Events$onClick(
													$author$project$Msg$TogglePhonemeInCell(phoneme)),
													$elm$html$Html$Attributes$title(
													isIncluded ? 'Click to remove' : 'Click to add')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(phoneme)
												]));
									},
									availablePhonemes)),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('secondary'),
										$elm$html$Html$Events$onClick($author$project$Msg$CloseIPACellModal),
										A2($elm$html$Html$Attributes$style, 'margin-top', '15px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Close')
									]))
							]))
					]));
		}
	});
var $author$project$Msg$OpenIPACellInfoModal = function (a) {
	return {$: 172, a: a};
};
var $author$project$Model$OtherSymbolCell = function (a) {
	return {$: 2, a: a};
};
var $author$project$Types$VoicedAlveolarAffricate = 5;
var $author$project$Types$VoicedAlveoloPalatalAffricate = 9;
var $author$project$Types$VoicedLabialPalatalApproximant = 3;
var $author$project$Types$VoicedLabialVelarApproximant = 0;
var $author$project$Types$VoicedPostalveolarAffricate = 7;
var $author$project$Types$VoicedRetroflexAffricate = 11;
var $author$project$Types$VoicelessAlveolarAffricate = 4;
var $author$project$Types$VoicelessAlveoloPalatalAffricate = 8;
var $author$project$Types$VoicelessLabialPalatalApproximant = 2;
var $author$project$Types$VoicelessLabialVelarApproximant = 1;
var $author$project$Types$VoicelessPostalveolarAffricate = 6;
var $author$project$Types$VoicelessRetroflexAffricate = 10;
var $author$project$IPAHelpers$classifyOtherSymbol = function (phoneme) {
	switch (phoneme) {
		case 'w':
			return $elm$core$Maybe$Just(0);
		case 'ʍ':
			return $elm$core$Maybe$Just(1);
		case 'ɥ̊':
			return $elm$core$Maybe$Just(2);
		case 'ɥ':
			return $elm$core$Maybe$Just(3);
		case 'ts':
			return $elm$core$Maybe$Just(4);
		case 'dz':
			return $elm$core$Maybe$Just(5);
		case 'tʃ':
			return $elm$core$Maybe$Just(6);
		case 'dʒ':
			return $elm$core$Maybe$Just(7);
		case 'tɕ':
			return $elm$core$Maybe$Just(8);
		case 'dʑ':
			return $elm$core$Maybe$Just(9);
		case 'tʂ':
			return $elm$core$Maybe$Just(10);
		case 'dʐ':
			return $elm$core$Maybe$Just(11);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$IPAHelpers$getIPAName = function (phoneme) {
	switch (phoneme) {
		case 'p':
			return 'Voiceless bilabial plosive';
		case 'b':
			return 'Voiced bilabial plosive';
		case 't':
			return 'Voiceless alveolar plosive';
		case 'd':
			return 'Voiced alveolar plosive';
		case 'ʈ':
			return 'Voiceless retroflex plosive';
		case 'ɖ':
			return 'Voiced retroflex plosive';
		case 'c':
			return 'Voiceless palatal plosive';
		case 'ɟ':
			return 'Voiced palatal plosive';
		case 'k':
			return 'Voiceless velar plosive';
		case 'g':
			return 'Voiced velar plosive';
		case 'q':
			return 'Voiceless uvular plosive';
		case 'ɢ':
			return 'Voiced uvular plosive';
		case 'ʔ':
			return 'Glottal stop';
		case 'm':
			return 'Voiced bilabial nasal';
		case 'ɱ':
			return 'Voiced labiodental nasal';
		case 'n':
			return 'Voiced alveolar nasal';
		case 'ɳ':
			return 'Voiced retroflex nasal';
		case 'ɲ':
			return 'Voiced palatal nasal';
		case 'ŋ':
			return 'Voiced velar nasal';
		case 'ɴ':
			return 'Voiced uvular nasal';
		case 'ʙ':
			return 'Voiced bilabial trill';
		case 'r':
			return 'Voiced alveolar trill';
		case 'ʀ':
			return 'Voiced uvular trill';
		case 'ⱱ':
			return 'Voiced labiodental flap';
		case 'ɾ':
			return 'Voiced alveolar tap';
		case 'ɽ':
			return 'Voiced retroflex flap';
		case 'ɸ':
			return 'Voiceless bilabial fricative';
		case 'β':
			return 'Voiced bilabial fricative';
		case 'f':
			return 'Voiceless labiodental fricative';
		case 'v':
			return 'Voiced labiodental fricative';
		case 'θ':
			return 'Voiceless dental fricative';
		case 'ð':
			return 'Voiced dental fricative';
		case 's':
			return 'Voiceless alveolar fricative';
		case 'z':
			return 'Voiced alveolar fricative';
		case 'ʃ':
			return 'Voiceless postalveolar fricative';
		case 'ʒ':
			return 'Voiced postalveolar fricative';
		case 'ʂ':
			return 'Voiceless retroflex fricative';
		case 'ʐ':
			return 'Voiced retroflex fricative';
		case 'ç':
			return 'Voiceless palatal fricative';
		case 'ʝ':
			return 'Voiced palatal fricative';
		case 'x':
			return 'Voiceless velar fricative';
		case 'ɣ':
			return 'Voiced velar fricative';
		case 'χ':
			return 'Voiceless uvular fricative';
		case 'ʁ':
			return 'Voiced uvular fricative';
		case 'ħ':
			return 'Voiceless pharyngeal fricative';
		case 'ʕ':
			return 'Voiced pharyngeal fricative';
		case 'h':
			return 'Voiceless glottal fricative';
		case 'ɦ':
			return 'Voiced glottal fricative';
		case 'ɬ':
			return 'Voiceless alveolar lateral fricative';
		case 'ɮ':
			return 'Voiced alveolar lateral fricative';
		case 'ʋ':
			return 'Voiced labiodental approximant';
		case 'ɹ':
			return 'Voiced alveolar approximant';
		case 'ɻ':
			return 'Voiced retroflex approximant';
		case 'j':
			return 'Voiced palatal approximant';
		case 'ɰ':
			return 'Voiced velar approximant';
		case 'ʕ̞':
			return 'Voiced pharyngeal approximant';
		case 'l':
			return 'Voiced alveolar lateral approximant';
		case 'ɭ':
			return 'Voiced retroflex lateral approximant';
		case 'ʎ':
			return 'Voiced palatal lateral approximant';
		case 'ʟ':
			return 'Voiced velar lateral approximant';
		case 'w':
			return 'Voiced labial-velar approximant';
		case 'ʍ':
			return 'Voiceless labial-velar fricative';
		case 'ɥ':
			return 'Voiced labial-palatal approximant';
		case 'ɥ̊':
			return 'Voiceless labial-palatal approximant';
		case 'ts':
			return 'Voiceless alveolar affricate';
		case 'dz':
			return 'Voiced alveolar affricate';
		case 'tʃ':
			return 'Voiceless postalveolar affricate';
		case 'dʒ':
			return 'Voiced postalveolar affricate';
		case 'tɕ':
			return 'Voiceless alveolo-palatal affricate';
		case 'dʑ':
			return 'Voiced alveolo-palatal affricate';
		case 'tʂ':
			return 'Voiceless retroflex affricate';
		case 'dʐ':
			return 'Voiced retroflex affricate';
		case 'i':
			return 'Close front unrounded vowel';
		case 'y':
			return 'Close front rounded vowel';
		case 'ɨ':
			return 'Close central unrounded vowel';
		case 'ʉ':
			return 'Close central rounded vowel';
		case 'ɯ':
			return 'Close back unrounded vowel';
		case 'u':
			return 'Close back rounded vowel';
		case 'ɪ':
			return 'Near-close front unrounded vowel';
		case 'ʏ':
			return 'Near-close front rounded vowel';
		case 'ʊ':
			return 'Near-close back rounded vowel';
		case 'e':
			return 'Close-mid front unrounded vowel';
		case 'ø':
			return 'Close-mid front rounded vowel';
		case 'ɘ':
			return 'Close-mid central unrounded vowel';
		case 'ɵ':
			return 'Close-mid central rounded vowel';
		case 'ɤ':
			return 'Close-mid back unrounded vowel';
		case 'o':
			return 'Close-mid back rounded vowel';
		case 'ə':
			return 'Mid central vowel (schwa)';
		case 'ɛ':
			return 'Open-mid front unrounded vowel';
		case 'œ':
			return 'Open-mid front rounded vowel';
		case 'ɜ':
			return 'Open-mid central unrounded vowel';
		case 'ɞ':
			return 'Open-mid central rounded vowel';
		case 'ʌ':
			return 'Open-mid back unrounded vowel';
		case 'ɔ':
			return 'Open-mid back rounded vowel';
		case 'æ':
			return 'Near-open front unrounded vowel';
		case 'ɐ':
			return 'Near-open central vowel';
		case 'a':
			return 'Open front unrounded vowel';
		case 'ɶ':
			return 'Open front rounded vowel';
		case 'ä':
			return 'Open central unrounded vowel';
		case 'ɑ':
			return 'Open back unrounded vowel';
		case 'ɒ':
			return 'Open back rounded vowel';
		default:
			return phoneme;
	}
};
var $author$project$ViewPhonology$viewOtherSymbolsChart = F2(
	function (allSounds, model) {
		var getSoundsForCell = function (symbolType) {
			return A2(
				$elm$core$List$filter,
				function (sound) {
					var _v0 = $author$project$IPAHelpers$classifyOtherSymbol(sound);
					if (!_v0.$) {
						var st = _v0.a;
						return _Utils_eq(st, symbolType);
					} else {
						return false;
					}
				},
				A2($elm$core$List$filter, $author$project$PhonologyHelpers$isOtherSymbolSound, allSounds));
		};
		var makeCell = function (symbolType) {
			var cellSounds = getSoundsForCell(symbolType);
			var availablePhonemes = $author$project$IPAHelpers$getOtherSymbolPhonemes(symbolType);
			var cellContent = $elm$core$List$isEmpty(availablePhonemes) ? _List_Nil : A2(
				$elm$core$List$map,
				function (phoneme) {
					var isIncluded = A2($elm$core$List$member, phoneme, cellSounds);
					var className = isIncluded ? 'ipa-phoneme-display ipa-phoneme-included' : 'ipa-phoneme-display ipa-phoneme-not-included';
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(className),
								A2(
								$elm$html$Html$Events$stopPropagationOn,
								'click',
								$elm$json$Json$Decode$succeed(
									_Utils_Tuple2(
										$author$project$Msg$TogglePhonemeInCell(phoneme),
										true))),
								$elm$html$Html$Attributes$title(
								$author$project$IPAHelpers$getIPAName(phoneme))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(phoneme)
							]));
				},
				availablePhonemes);
			var hasChoices = !$elm$core$List$isEmpty(availablePhonemes);
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						hasChoices ? 'ipa-cell-hoverable' : 'ipa-cell-non-clickable'),
						hasChoices ? $elm$html$Html$Events$onClick(
						$author$project$Msg$OpenIPACellInfoModal(
							$author$project$Model$OtherSymbolCell(symbolType))) : $elm$html$Html$Events$onClick($author$project$Msg$NoOp),
						hasChoices ? $elm$html$Html$Attributes$title('Hover to see all sounds, click for info') : $elm$html$Html$Attributes$title('')
					]),
				cellContent);
		};
		var approximantsSection = _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell'),
						A2($elm$html$Html$Attributes$style, 'grid-column', '1 / -1')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Approximants')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-row-header')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Labial-velar')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Labial-palatal')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-row-header')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Voiceless')
					])),
				makeCell(1),
				makeCell(2),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-row-header')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Voiced')
					])),
				makeCell(0),
				makeCell(3)
			]);
		var affricatesSection = _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell'),
						A2($elm$html$Html$Attributes$style, 'grid-column', '1 / -1')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Affricates')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-row-header')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Alveolar')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Postalveolar')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Alveolo-palatal')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Retroflex')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-row-header')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Voiceless')
					])),
				makeCell(4),
				makeCell(6),
				makeCell(8),
				makeCell(10),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-row-header')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Voiced')
					])),
				makeCell(5),
				makeCell(7),
				makeCell(9),
				makeCell(11)
			]);
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ipa-grid'),
							A2($elm$html$Html$Attributes$style, 'grid-template-columns', '120px 1fr 1fr'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
						]),
					approximantsSection),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ipa-grid'),
							A2($elm$html$Html$Attributes$style, 'grid-template-columns', '120px 1fr 1fr 1fr 1fr')
						]),
					affricatesSection)
				]));
	});
var $author$project$Types$Alveolar = 3;
var $author$project$Types$Approximant = 6;
var $author$project$Types$Bilabial = 0;
var $author$project$Model$ConsonantCell = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Types$Dental = 2;
var $author$project$Types$Fricative = 4;
var $author$project$Types$Glottal = 10;
var $author$project$Types$Labiodental = 1;
var $author$project$Types$LateralApproximant = 7;
var $author$project$Types$LateralFricative = 5;
var $author$project$Types$Nasal = 1;
var $author$project$Types$Palatal = 6;
var $author$project$Types$Pharyngeal = 9;
var $author$project$Types$Plosive = 0;
var $author$project$Types$Postalveolar = 4;
var $author$project$Types$Retroflex = 5;
var $author$project$Types$TapFlap = 3;
var $author$project$Types$Trill = 2;
var $author$project$Types$Uvular = 8;
var $author$project$Types$Velar = 7;
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Types$OtherManner = 8;
var $author$project$Types$OtherPlace = 11;
var $author$project$IPAHelpers$classifyConsonant = function (phoneme) {
	switch (phoneme) {
		case 'p':
			return {c: 0, d: 0};
		case 'b':
			return {c: 0, d: 0};
		case 'm':
			return {c: 1, d: 0};
		case 'ɸ':
			return {c: 4, d: 0};
		case 'β':
			return {c: 4, d: 0};
		case 'ʙ':
			return {c: 2, d: 0};
		case 'f':
			return {c: 4, d: 1};
		case 'v':
			return {c: 4, d: 1};
		case 'ɱ':
			return {c: 1, d: 1};
		case 'ʋ':
			return {c: 6, d: 1};
		case 'θ':
			return {c: 4, d: 2};
		case 'ð':
			return {c: 4, d: 2};
		case 't':
			return {c: 0, d: 3};
		case 'd':
			return {c: 0, d: 3};
		case 'n':
			return {c: 1, d: 3};
		case 's':
			return {c: 4, d: 3};
		case 'z':
			return {c: 4, d: 3};
		case 'r':
			return {c: 2, d: 3};
		case 'ɾ':
			return {c: 3, d: 3};
		case 'l':
			return {c: 7, d: 3};
		case 'ɬ':
			return {c: 5, d: 3};
		case 'ɮ':
			return {c: 5, d: 3};
		case 'ɹ':
			return {c: 6, d: 3};
		case 'ʃ':
			return {c: 4, d: 4};
		case 'ʒ':
			return {c: 4, d: 4};
		case 'tʃ':
			return {c: 8, d: 4};
		case 'dʒ':
			return {c: 8, d: 4};
		case 'ʈ':
			return {c: 0, d: 5};
		case 'ɖ':
			return {c: 0, d: 5};
		case 'ɳ':
			return {c: 1, d: 5};
		case 'ʂ':
			return {c: 4, d: 5};
		case 'ʐ':
			return {c: 4, d: 5};
		case 'ɽ':
			return {c: 3, d: 5};
		case 'ɻ':
			return {c: 6, d: 5};
		case 'ɭ':
			return {c: 7, d: 5};
		case 'c':
			return {c: 0, d: 6};
		case 'ɟ':
			return {c: 0, d: 6};
		case 'ç':
			return {c: 4, d: 6};
		case 'ʝ':
			return {c: 4, d: 6};
		case 'ɲ':
			return {c: 1, d: 6};
		case 'j':
			return {c: 6, d: 6};
		case 'ʎ':
			return {c: 7, d: 6};
		case 'k':
			return {c: 0, d: 7};
		case 'g':
			return {c: 0, d: 7};
		case 'ŋ':
			return {c: 1, d: 7};
		case 'x':
			return {c: 4, d: 7};
		case 'ɣ':
			return {c: 4, d: 7};
		case 'ɰ':
			return {c: 6, d: 7};
		case 'ʟ':
			return {c: 7, d: 7};
		case 'q':
			return {c: 0, d: 8};
		case 'ɢ':
			return {c: 0, d: 8};
		case 'ɴ':
			return {c: 1, d: 8};
		case 'ʀ':
			return {c: 2, d: 8};
		case 'χ':
			return {c: 4, d: 8};
		case 'ʁ':
			return {c: 4, d: 8};
		case 'ħ':
			return {c: 4, d: 9};
		case 'ʕ':
			return {c: 4, d: 9};
		case 'ʕ̞':
			return {c: 6, d: 9};
		case 'h':
			return {c: 4, d: 10};
		case 'ɦ':
			return {c: 4, d: 10};
		case 'ʔ':
			return {c: 0, d: 10};
		default:
			return {c: 8, d: 11};
	}
};
var $author$project$ViewPhonology$viewStaticConsonantChart = F2(
	function (allSounds, model) {
		var shouldMergeCoronal = function (manner) {
			return manner !== 4;
		};
		var places = _List_fromArray(
			[
				_Utils_Tuple2(0, 'Bilabial'),
				_Utils_Tuple2(1, 'Labio-dental'),
				_Utils_Tuple2(2, 'Dental'),
				_Utils_Tuple2(3, 'Alveolar'),
				_Utils_Tuple2(4, 'Post-alveolar'),
				_Utils_Tuple2(5, 'Retroflex'),
				_Utils_Tuple2(6, 'Palatal'),
				_Utils_Tuple2(7, 'Velar'),
				_Utils_Tuple2(8, 'Uvular'),
				_Utils_Tuple2(9, 'Pharyngeal'),
				_Utils_Tuple2(10, 'Glottal')
			]);
		var manners = _List_fromArray(
			[
				_Utils_Tuple2(0, 'Plosive'),
				_Utils_Tuple2(1, 'Nasal'),
				_Utils_Tuple2(2, 'Trill'),
				_Utils_Tuple2(3, 'Tap or Flap'),
				_Utils_Tuple2(4, 'Fricative'),
				_Utils_Tuple2(5, 'Lateral fricative'),
				_Utils_Tuple2(6, 'Approximant'),
				_Utils_Tuple2(7, 'Lateral approximant')
			]);
		var headerRow = A2(
			$elm$core$List$cons,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_Nil),
			A2(
				$elm$core$List$cons,
				A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ipa-header-cell')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Bilabial')
						])),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ipa-header-cell')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Labio-dental')
							])),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ipa-header-cell'),
									A2($elm$html$Html$Attributes$attribute, 'colspan', '3'),
									A2($elm$html$Html$Attributes$attribute, 'style', 'grid-column: span 3;')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Dental/Alveolar')
								])),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('ipa-header-cell')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Retroflex')
									])),
							A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ipa-header-cell')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Palatal')
										])),
								A2(
									$elm$core$List$cons,
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('ipa-header-cell')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Velar')
											])),
									A2(
										$elm$core$List$cons,
										A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('ipa-header-cell')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Uvular')
												])),
										A2(
											$elm$core$List$cons,
											A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('ipa-header-cell')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Pharyngeal')
													])),
											A2(
												$elm$core$List$cons,
												A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('ipa-header-cell')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Glottal')
														])),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$class('ipa-header-cell')
															]),
														_List_Nil)
													])))))))))));
		var getSoundsForCoronalCell = function (manner) {
			return A2(
				$elm$core$List$filter,
				function (sound) {
					var classification = $author$project$IPAHelpers$classifyConsonant(sound);
					return ((classification.d === 2) || ((classification.d === 3) || (classification.d === 4))) && _Utils_eq(classification.c, manner);
				},
				A2($elm$core$List$filter, $author$project$PhonologyHelpers$isConsonantSound, allSounds));
		};
		var getSoundsForCell = F2(
			function (place, manner) {
				return A2(
					$elm$core$List$filter,
					function (sound) {
						var classification = $author$project$IPAHelpers$classifyConsonant(sound);
						return _Utils_eq(classification.d, place) && _Utils_eq(classification.c, manner);
					},
					A2($elm$core$List$filter, $author$project$PhonologyHelpers$isConsonantSound, allSounds));
			});
		var mannerRows = A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var manner = _v0.a;
				var mannerLabel = _v0.b;
				var rowHeaderRight = A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ipa-row-header')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(mannerLabel)
						]));
				var rowHeader = A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ipa-row-header')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(mannerLabel)
						]));
				var createCell = F2(
					function (cellPlace, cellManner) {
						var cellSounds = A2(getSoundsForCell, cellPlace, cellManner);
						var availablePhonemes = A2($author$project$IPAHelpers$getConsonantPhonemesForCell, cellPlace, cellManner);
						var cellContent = $elm$core$List$isEmpty(availablePhonemes) ? _List_Nil : A2(
							$elm$core$List$map,
							function (phoneme) {
								var isIncluded = A2($elm$core$List$member, phoneme, cellSounds);
								var className = isIncluded ? 'ipa-phoneme-display ipa-phoneme-included' : 'ipa-phoneme-display ipa-phoneme-not-included';
								return A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(className),
											A2(
											$elm$html$Html$Events$stopPropagationOn,
											'click',
											$elm$json$Json$Decode$succeed(
												_Utils_Tuple2(
													$author$project$Msg$TogglePhonemeInCell(phoneme),
													true))),
											$elm$html$Html$Attributes$title(
											$author$project$IPAHelpers$getIPAName(phoneme))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(phoneme)
										]));
							},
							availablePhonemes);
						var hasChoices = !$elm$core$List$isEmpty(availablePhonemes);
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									hasChoices ? 'ipa-cell-hoverable' : 'ipa-cell-non-clickable'),
									hasChoices ? $elm$html$Html$Events$onClick(
									$author$project$Msg$OpenIPACellInfoModal(
										A2($author$project$Model$ConsonantCell, cellPlace, cellManner))) : $elm$html$Html$Events$onClick($author$project$Msg$NoOp),
									hasChoices ? $elm$html$Html$Attributes$title('Hover to see all sounds, click for info') : $elm$html$Html$Attributes$title('')
								]),
							cellContent);
					});
				var cells = function () {
					if (shouldMergeCoronal(manner)) {
						var velarCell = A2(createCell, 7, manner);
						var uvularCell = A2(createCell, 8, manner);
						var retroflexCell = A2(createCell, 5, manner);
						var pharyngealCell = A2(createCell, 9, manner);
						var palatalCell = A2(createCell, 6, manner);
						var labioDentalCell = A2(createCell, 1, manner);
						var glottalCell = A2(createCell, 10, manner);
						var coronalSounds = getSoundsForCoronalCell(manner);
						var coronalPhonemes = _Utils_ap(
							A2($author$project$IPAHelpers$getConsonantPhonemesForCell, 2, manner),
							_Utils_ap(
								A2($author$project$IPAHelpers$getConsonantPhonemesForCell, 3, manner),
								A2($author$project$IPAHelpers$getConsonantPhonemesForCell, 4, manner)));
						var coronalCell = function () {
							var hasChoices = !$elm$core$List$isEmpty(coronalPhonemes);
							var cellContent = $elm$core$List$isEmpty(coronalPhonemes) ? _List_Nil : A2(
								$elm$core$List$map,
								function (phoneme) {
									var isIncluded = A2($elm$core$List$member, phoneme, coronalSounds);
									var className = isIncluded ? 'ipa-phoneme-display ipa-phoneme-included' : 'ipa-phoneme-display ipa-phoneme-not-included';
									return A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(className),
												A2(
												$elm$html$Html$Events$stopPropagationOn,
												'click',
												$elm$json$Json$Decode$succeed(
													_Utils_Tuple2(
														$author$project$Msg$TogglePhonemeInCell(phoneme),
														true))),
												$elm$html$Html$Attributes$title(
												$author$project$IPAHelpers$getIPAName(phoneme))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(phoneme)
											]));
								},
								coronalPhonemes);
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(
										hasChoices ? 'ipa-cell-hoverable' : 'ipa-cell-non-clickable'),
										A2($elm$html$Html$Attributes$attribute, 'style', 'grid-column: span 3;'),
										hasChoices ? $elm$html$Html$Attributes$title('Hover to see all sounds, click for info') : $elm$html$Html$Attributes$title('')
									]),
								cellContent);
						}();
						var bilabialCell = A2(createCell, 0, manner);
						return _List_fromArray(
							[bilabialCell, labioDentalCell, coronalCell, retroflexCell, palatalCell, velarCell, uvularCell, pharyngealCell, glottalCell]);
					} else {
						return A2(
							$elm$core$List$map,
							function (_v1) {
								var place = _v1.a;
								return A2(createCell, place, manner);
							},
							places);
					}
				}();
				return A2(
					$elm$core$List$cons,
					rowHeader,
					_Utils_ap(
						cells,
						_List_fromArray(
							[rowHeaderRight])));
			},
			manners);
		var allRows = _Utils_ap(headerRow, mannerRows);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ipa-grid consonant-grid-static')
				]),
			allRows);
	});
var $author$project$Types$Back = 2;
var $author$project$Types$Central = 1;
var $author$project$Types$Close = 0;
var $author$project$Types$CloseMid = 2;
var $author$project$Types$Front = 0;
var $author$project$Types$Mid = 3;
var $author$project$Types$NearClose = 1;
var $author$project$Types$NearOpen = 5;
var $author$project$Types$Open = 6;
var $author$project$Types$OpenMid = 4;
var $author$project$Model$VowelCell = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$IPAHelpers$classifyVowel = function (phoneme) {
	switch (phoneme) {
		case 'i':
			return {e: 0, f: 0};
		case 'y':
			return {e: 0, f: 0};
		case 'ɨ':
			return {e: 1, f: 0};
		case 'ʉ':
			return {e: 1, f: 0};
		case 'ɯ':
			return {e: 2, f: 0};
		case 'u':
			return {e: 2, f: 0};
		case 'ɪ':
			return {e: 0, f: 1};
		case 'ʏ':
			return {e: 0, f: 1};
		case 'ʊ':
			return {e: 2, f: 1};
		case 'e':
			return {e: 0, f: 2};
		case 'ø':
			return {e: 0, f: 2};
		case 'ɘ':
			return {e: 1, f: 2};
		case 'ɵ':
			return {e: 1, f: 2};
		case 'ɤ':
			return {e: 2, f: 2};
		case 'o':
			return {e: 2, f: 2};
		case 'ə':
			return {e: 1, f: 3};
		case 'ɛ':
			return {e: 0, f: 4};
		case 'œ':
			return {e: 0, f: 4};
		case 'ɜ':
			return {e: 1, f: 4};
		case 'ɞ':
			return {e: 1, f: 4};
		case 'ʌ':
			return {e: 2, f: 4};
		case 'ɔ':
			return {e: 2, f: 4};
		case 'æ':
			return {e: 0, f: 5};
		case 'ɐ':
			return {e: 1, f: 5};
		case 'a':
			return {e: 0, f: 6};
		case 'ɶ':
			return {e: 0, f: 6};
		case 'ɑ':
			return {e: 2, f: 6};
		case 'ɒ':
			return {e: 2, f: 6};
		default:
			return {e: 1, f: 6};
	}
};
var $author$project$ViewPhonology$viewStaticVowelChart = F2(
	function (allSounds, model) {
		var heights = _List_fromArray(
			[
				_Utils_Tuple2(0, 'Close'),
				_Utils_Tuple2(1, 'Near-close'),
				_Utils_Tuple2(2, 'Close-mid'),
				_Utils_Tuple2(3, 'Mid'),
				_Utils_Tuple2(4, 'Open-mid'),
				_Utils_Tuple2(5, 'Near-open'),
				_Utils_Tuple2(6, 'Open')
			]);
		var headerRow = _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Height \\ Backness')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Front')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Central')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('ipa-header-cell')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Back')
					]))
			]);
		var getSoundsForCell = F2(
			function (height, backness) {
				return A2(
					$elm$core$List$filter,
					function (sound) {
						var classification = $author$project$IPAHelpers$classifyVowel(sound);
						return _Utils_eq(classification.f, height) && _Utils_eq(classification.e, backness);
					},
					A2($elm$core$List$filter, $author$project$PhonologyHelpers$isVowelSound, allSounds));
			});
		var backnesses = _List_fromArray(
			[
				_Utils_Tuple2(0, 'Front'),
				_Utils_Tuple2(1, 'Central'),
				_Utils_Tuple2(2, 'Back')
			]);
		var heightRows = A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var height = _v0.a;
				var heightLabel = _v0.b;
				var rowHeader = A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ipa-row-header')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(heightLabel)
						]));
				var cells = A2(
					$elm$core$List$map,
					function (_v1) {
						var backness = _v1.a;
						var cellSounds = A2(getSoundsForCell, height, backness);
						var availablePhonemes = A2($author$project$IPAHelpers$getVowelPhonemesForCell, height, backness);
						var cellContent = $elm$core$List$isEmpty(availablePhonemes) ? _List_Nil : A2(
							$elm$core$List$map,
							function (phoneme) {
								var isIncluded = A2($elm$core$List$member, phoneme, cellSounds);
								var className = isIncluded ? 'ipa-phoneme-display ipa-phoneme-included' : 'ipa-phoneme-display ipa-phoneme-not-included';
								return A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class(className),
											A2(
											$elm$html$Html$Events$stopPropagationOn,
											'click',
											$elm$json$Json$Decode$succeed(
												_Utils_Tuple2(
													$author$project$Msg$TogglePhonemeInCell(phoneme),
													true))),
											$elm$html$Html$Attributes$title(
											$author$project$IPAHelpers$getIPAName(phoneme))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(phoneme)
										]));
							},
							availablePhonemes);
						var hasChoices = !$elm$core$List$isEmpty(availablePhonemes);
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									hasChoices ? 'ipa-cell-hoverable' : 'ipa-cell-non-clickable'),
									hasChoices ? $elm$html$Html$Events$onClick(
									$author$project$Msg$OpenIPACellInfoModal(
										A2($author$project$Model$VowelCell, height, backness))) : $elm$html$Html$Events$onClick($author$project$Msg$NoOp),
									hasChoices ? $elm$html$Html$Attributes$title('Hover to see all sounds, click for info') : $elm$html$Html$Attributes$title('')
								]),
							cellContent);
					},
					backnesses);
				return A2($elm$core$List$cons, rowHeader, cells);
			},
			heights);
		var allRows = _Utils_ap(headerRow, heightRows);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('ipa-grid vowel-grid')
				]),
			allRows);
	});
var $author$project$ViewPhonology$viewIPACharts = function (model) {
	var customCategories = A2(
		$elm$core$List$filter,
		function (cat) {
			return (cat.dp !== 'C') && (cat.dp !== 'V');
		},
		model.a.ct.dE.ce);
	var allSounds = A2(
		$elm$core$List$concatMap,
		function ($) {
			return $.dM;
		},
		model.a.ct.dE.ce);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('IPA Charts')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Click on any phoneme to add/remove it from your inventory.')
					])),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px'),
						A2($elm$html$Html$Attributes$style, 'text-align', 'center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Consonants (Pulmonic)')
					])),
				A2($author$project$ViewPhonology$viewStaticConsonantChart, allSounds, model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '30px'),
						A2($elm$html$Html$Attributes$style, 'text-align', 'center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Other Symbols')
					])),
				A2($author$project$ViewPhonology$viewOtherSymbolsChart, allSounds, model),
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '30px'),
						A2($elm$html$Html$Attributes$style, 'text-align', 'center')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Vowels')
					])),
				A2($author$project$ViewPhonology$viewStaticVowelChart, allSounds, model),
				model.b7 ? A2($author$project$ViewPhonology$viewIPACellModal, model, allSounds) : $elm$html$Html$text(''),
				model.b6 ? $author$project$ViewPhonology$viewIPACellInfoModal(model) : $elm$html$Html$text('')
			]));
};
var $author$project$Msg$AddGraphemeMapping = {$: 182};
var $author$project$Msg$UpdateGraphemeContextInput = function (a) {
	return {$: 181, a: a};
};
var $author$project$Msg$UpdateGraphemeDescriptionInput = function (a) {
	return {$: 180, a: a};
};
var $author$project$Msg$UpdateGraphemeGraphemeInput = function (a) {
	return {$: 179, a: a};
};
var $author$project$Msg$UpdateGraphemePhonemeInput = function (a) {
	return {$: 178, a: a};
};
var $author$project$Msg$UpdateOrthographyTestInput = function (a) {
	return {$: 221, a: a};
};
var $author$project$Msg$RemoveGraphemeMapping = function (a) {
	return {$: 183, a: a};
};
var $author$project$ViewPhonology$viewGraphemeMappingWithHighlight = F3(
	function (triggeredRules, phonology, mapping) {
		var isTriggered = A2(
			$elm$core$List$member,
			_Utils_Tuple2(mapping.dD, mapping.cg),
			triggeredRules);
		var hasInvalidVowelSequence = function () {
			if ($elm$core$List$isEmpty(phonology.da)) {
				return false;
			} else {
				var vowels = A2(
					$elm$core$List$concatMap,
					function ($) {
						return $.dM;
					},
					A2(
						$elm$core$List$filter,
						function (cat) {
							return (cat.dp === 'V') || ($elm$core$String$toLower(cat.I) === 'vowels');
						},
						phonology.ce));
				var findLongestVowelMatch = F2(
					function (vowelList, str) {
						return $elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (v) {
									return A2($elm$core$String$startsWith, v, str);
								},
								A2(
									$elm$core$List$sortBy,
									function (v) {
										return -$elm$core$String$length(v);
									},
									vowelList)));
					});
				var checkForInvalidSequence = function (remaining) {
					checkForInvalidSequence:
					while (true) {
						if ($elm$core$String$isEmpty(remaining)) {
							return false;
						} else {
							var _v0 = A2(findLongestVowelMatch, vowels, remaining);
							if (_v0.$ === 1) {
								var $temp$remaining = A2($elm$core$String$dropLeft, 1, remaining);
								remaining = $temp$remaining;
								continue checkForInvalidSequence;
							} else {
								var firstVowel = _v0.a;
								var afterFirst = A2(
									$elm$core$String$dropLeft,
									$elm$core$String$length(firstVowel),
									remaining);
								var _v1 = A2(findLongestVowelMatch, vowels, afterFirst);
								if (_v1.$ === 1) {
									var $temp$remaining = afterFirst;
									remaining = $temp$remaining;
									continue checkForInvalidSequence;
								} else {
									var secondVowel = _v1.a;
									var combination = _Utils_ap(firstVowel, secondVowel);
									var isValidDiphthong = A2($elm$core$List$member, combination, phonology.da);
									if (!isValidDiphthong) {
										return true;
									} else {
										var $temp$remaining = A2(
											$elm$core$String$dropLeft,
											$elm$core$String$length(secondVowel),
											afterFirst);
										remaining = $temp$remaining;
										continue checkForInvalidSequence;
									}
								}
							}
						}
					}
				};
				return checkForInvalidSequence(mapping.dD);
			}
		}();
		var bgColor = hasInvalidVowelSequence ? '#fee2e2' : (isTriggered ? '#d1fae5' : '');
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('phoneme-tag'),
					A2($elm$html$Html$Attributes$style, 'display', 'inline-flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'gap', '8px'),
					A2($elm$html$Html$Attributes$style, 'background-color', bgColor),
					isTriggered ? A2($elm$html$Html$Attributes$style, 'border', '2px solid #10b981') : A2($elm$html$Html$Attributes$style, 'border', ''),
					isTriggered ? A2($elm$html$Html$Attributes$style, 'box-shadow', '0 2px 4px rgba(16, 185, 129, 0.2)') : A2($elm$html$Html$Attributes$style, 'box-shadow', ''),
					A2($elm$html$Html$Attributes$style, 'transition', 'all 0.2s')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							hasInvalidVowelSequence ? A2($elm$html$Html$Attributes$style, 'color', '#dc2626') : (isTriggered ? A2($elm$html$Html$Attributes$style, 'color', '#065f46') : A2($elm$html$Html$Attributes$style, 'color', ''))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(mapping.dD + (' → ' + mapping.dj)),
							(!$elm$core$String$isEmpty(mapping.cg)) ? A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'color', '#0369a1'),
									A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
									A2($elm$html$Html$Attributes$style, 'margin-left', '4px')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(' / ' + mapping.cg)
								])) : $elm$html$Html$text('')
						])),
					(!$elm$core$String$isEmpty(mapping.aq)) ? A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#666'),
							A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('(' + (mapping.aq + ')'))
						])) : $elm$html$Html$text(''),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Msg$RemoveGraphemeMapping(mapping.dD)),
							$elm$html$Html$Attributes$class('remove-btn'),
							A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('×')
						]))
				]));
	});
var $author$project$ViewPhonology$viewOrthographySection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Orthography & Romanization')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define how IPA phonemes map to orthographic symbols. Words will display both IPA (with syllable separators) and orthography. You can specify contexts to make mappings conditional (e.g., \'e\' → \'e\' before r/t, but \'e\' → \'i\' elsewhere). Note: Context patterns support C (consonant), V (vowel), and V̆ (short vowel), but not custom categories.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group'),
						A2($elm$html$Html$Attributes$style, 'background', '#f0f9ff'),
						A2($elm$html$Html$Attributes$style, 'padding', '15px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Test your orthography rules by entering an IPA word with syllable separators (e.g., ka.ta.na). Rules that are triggered will be highlighted in green below.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'stretch'),
								A2($elm$html$Html$Attributes$style, 'gap', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative'),
										A2($elm$html$Html$Attributes$style, 'flex', '0 0 45%'),
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'align-items', 'stretch')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$id('ipa-input-orthographyTest'),
												$elm$html$Html$Attributes$placeholder('e.g., ka.ta.na or ma.ɲa.na'),
												$elm$html$Html$Attributes$value(model.cB),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateOrthographyTestInput),
												$elm$html$Html$Events$onFocus(
												$author$project$Msg$FocusIPAField('orthographyTest')),
												$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
												A2($elm$html$Html$Attributes$style, 'width', '100%'),
												A2($elm$html$Html$Attributes$style, 'padding', '10px'),
												A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
												A2($elm$html$Html$Attributes$style, 'border', '2px solid #0369a1'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box')
											]),
										_List_Nil),
										A2($author$project$ViewComponents$viewIPADropdown, model, 'orthographyTest')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'font-size', '24px'),
										A2($elm$html$Html$Attributes$style, 'color', '#64748b'),
										A2($elm$html$Html$Attributes$style, 'flex', '0 0 auto'),
										A2($elm$html$Html$Attributes$style, 'display', 'flex'),
										A2($elm$html$Html$Attributes$style, 'align-items', 'center')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('→')
									])),
								function () {
								var orthographyOutput = $elm$core$String$isEmpty(model.cB) ? '' : A4($author$project$MorphologyHelpers$applyOrthography, model.a.ct.dE, model.a.ct.dE.cA.cq, model.a.ct.dE.da, model.cB);
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'padding', '10px 15px'),
											A2($elm$html$Html$Attributes$style, 'background', 'white'),
											A2($elm$html$Html$Attributes$style, 'border', '2px solid #10b981'),
											A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
											A2($elm$html$Html$Attributes$style, 'font-size', '18px'),
											A2($elm$html$Html$Attributes$style, 'font-weight', '600'),
											A2($elm$html$Html$Attributes$style, 'color', '#065f46'),
											A2($elm$html$Html$Attributes$style, 'display', 'flex'),
											A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
											A2($elm$html$Html$Attributes$style, 'flex', '1'),
											A2($elm$html$Html$Attributes$style, 'min-width', '0'),
											A2($elm$html$Html$Attributes$style, 'box-sizing', 'border-box')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$isEmpty(orthographyOutput) ? '...' : orthographyOutput)
										]));
							}()
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Grapheme Mappings')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Define how phonemes are written. Supports digraphs (e.g., /θ/ → th) and context-based rules (e.g., e → e / _{r,t} means \'e\' becomes \'e\' before r or t).')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('phoneme-list')
							]),
						A2(
							$elm$core$List$map,
							A2($author$project$ViewPhonology$viewGraphemeMappingWithHighlight, model.cV, model.a.ct.dE),
							model.a.ct.dE.cA.cq)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'relative')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('inline-form')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'relative'),
												A2($elm$html$Html$Attributes$style, 'display', 'inline-block')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$id('ipa-input-graphemePhoneme'),
														$elm$html$Html$Attributes$placeholder('Phoneme (e.g., θ, ʃ, tʃ)'),
														$elm$html$Html$Attributes$value(model.bm),
														$elm$html$Html$Events$onInput($author$project$Msg$UpdateGraphemePhonemeInput),
														$elm$html$Html$Events$onFocus(
														$author$project$Msg$FocusIPAField('graphemePhoneme')),
														$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
														$author$project$UpdateHelpers$onEnter(
														($author$project$UpdateHelpers$isNonEmpty(model.bm) && $author$project$UpdateHelpers$isNonEmpty(model.bl)) ? $author$project$Msg$AddGraphemeMapping : $author$project$Msg$NoOp),
														$elm$html$Html$Attributes$classList(
														_List_fromArray(
															[
																_Utils_Tuple2(
																'error',
																(!$author$project$UpdateHelpers$isNonEmpty(model.bm)) && (model.bm !== ''))
															])),
														A2($elm$html$Html$Attributes$style, 'width', '150px')
													]),
												_List_Nil),
												A2($author$project$ViewComponents$viewIPADropdown, model, 'graphemePhoneme')
											])),
										$elm$html$Html$text(' → '),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$placeholder('Grapheme (e.g., th, sh, ch)'),
												$elm$html$Html$Attributes$value(model.bl),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateGraphemeGraphemeInput),
												$author$project$UpdateHelpers$onEnter(
												($author$project$UpdateHelpers$isNonEmpty(model.bm) && $author$project$UpdateHelpers$isNonEmpty(model.bl)) ? $author$project$Msg$AddGraphemeMapping : $author$project$Msg$NoOp),
												$elm$html$Html$Attributes$classList(
												_List_fromArray(
													[
														_Utils_Tuple2(
														'error',
														(!$author$project$UpdateHelpers$isNonEmpty(model.bl)) && (model.bl !== ''))
													])),
												A2($elm$html$Html$Attributes$style, 'width', '150px')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'relative'),
												A2($elm$html$Html$Attributes$style, 'display', 'inline-block')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$id('ipa-input-graphemeContext'),
														$elm$html$Html$Attributes$placeholder('Context (e.g., _C, V_, _{r,t})'),
														$elm$html$Html$Attributes$value(model.bk),
														$elm$html$Html$Events$onInput($author$project$Msg$UpdateGraphemeContextInput),
														$elm$html$Html$Events$onFocus(
														$author$project$Msg$FocusIPAField('graphemeContext')),
														$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
														$author$project$UpdateHelpers$onEnter(
														($author$project$UpdateHelpers$isNonEmpty(model.bm) && $author$project$UpdateHelpers$isNonEmpty(model.bl)) ? $author$project$Msg$AddGraphemeMapping : $author$project$Msg$NoOp),
														A2($elm$html$Html$Attributes$style, 'width', '150px'),
														$elm$html$Html$Attributes$title('Optional context: _C (before consonant), V_ (after vowel), V̆_ (after short vowel), _{r,t} (before r or t)')
													]),
												_List_Nil),
												A2($author$project$ViewComponents$viewContextInputHelpers, model, 'graphemeContext')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$placeholder('Description (optional)'),
												$elm$html$Html$Attributes$value(model.aK),
												$elm$html$Html$Events$onInput($author$project$Msg$UpdateGraphemeDescriptionInput),
												$author$project$UpdateHelpers$onEnter(
												($author$project$UpdateHelpers$isNonEmpty(model.bm) && $author$project$UpdateHelpers$isNonEmpty(model.bl)) ? $author$project$Msg$AddGraphemeMapping : $author$project$Msg$NoOp),
												A2($elm$html$Html$Attributes$style, 'width', '200px')
											]),
										_List_Nil),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$AddGraphemeMapping),
												$elm$html$Html$Attributes$class('plus-btn'),
												$elm$html$Html$Attributes$disabled(
												!($author$project$UpdateHelpers$isNonEmpty(model.bm) && $author$project$UpdateHelpers$isNonEmpty(model.bl)))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('+')
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddPattern = {$: 14};
var $author$project$Msg$OpenAddCategoryModal = {$: 6};
var $author$project$Msg$UpdatePatternInput = function (a) {
	return {$: 2, a: a};
};
var $author$project$Msg$AddCategory = {$: 4};
var $author$project$Msg$CloseAddCategoryModal = {$: 7};
var $author$project$Msg$UpdateCategoryNameInput = function (a) {
	return {$: 10, a: a};
};
var $author$project$ViewPhonology$viewAddCategoryModal = function (model) {
	var isValid = !$elm$core$String$isEmpty(
		$elm$core$String$trim(model.M));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal-overlay'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseAddCategoryModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-content'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true))),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Add Sound Category')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create a new custom sound category. A unique letter will be automatically assigned as the label.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Category Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., Stops, Fricatives, Liquids'),
										$elm$html$Html$Attributes$value(model.M),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateCategoryNameInput),
										$author$project$UpdateHelpers$onEnter(
										isValid ? $author$project$Msg$AddCategory : $author$project$Msg$NoOp),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('error', (!isValid) && (model.M !== ''))
											])),
										A2($elm$html$Html$Attributes$style, 'width', '100%')
									]),
								_List_Nil),
								((!isValid) && (model.M !== '')) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text error-text'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '8px'),
										A2($elm$html$Html$Attributes$style, 'color', '#ef4444')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Category name cannot be empty.')
									])) : A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '8px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('After creating, you can add sounds to this category.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$AddCategory),
										$elm$html$Html$Attributes$class('primary'),
										$elm$html$Html$Attributes$disabled(!isValid),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Create Category')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseAddCategoryModal),
										$elm$html$Html$Attributes$class('secondary'),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$AddPhoneme = {$: 12};
var $author$project$Msg$CloseEditCategoryModal = {$: 9};
var $author$project$Msg$SaveCategoryEdit = {$: 11};
var $author$project$Msg$RemovePhoneme = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var $author$project$ViewPhonology$viewPhoneme = F2(
	function (categoryLabel, phoneme) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('phoneme-tag')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(phoneme),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							A2($author$project$Msg$RemovePhoneme, categoryLabel, phoneme))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('×')
						]))
				]));
	});
var $author$project$ViewPhonology$viewEditCategoryModal = function (model) {
	var labelStr = A2(
		$elm$core$Maybe$withDefault,
		'',
		A2($elm$core$Maybe$map, $elm$core$String$fromChar, model.at));
	var isValid = !$elm$core$String$isEmpty(
		$elm$core$String$trim(model.M));
	var isSelected = _Utils_eq(model.aB, labelStr);
	var category = A2(
		$elm$core$Maybe$andThen,
		function (label) {
			return $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (cat) {
						return _Utils_eq(cat.dp, label);
					},
					model.a.ct.dE.ce));
		},
		model.at);
	var allPhonologySounds = A2(
		$elm$core$List$concatMap,
		function ($) {
			return $.dM;
		},
		model.a.ct.dE.ce);
	var soundsInPhonology = A2(
		$elm$core$Maybe$withDefault,
		_List_Nil,
		A2(
			$elm$core$Maybe$map,
			function (cat) {
				return A2(
					$elm$core$List$filter,
					function (sound) {
						return A2($elm$core$List$member, sound, allPhonologySounds);
					},
					cat.dM);
			},
			category));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal-overlay'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseEditCategoryModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-content'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true))),
						A2($elm$html$Html$Attributes$style, 'max-width', '600px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Edit Sound Category')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Category Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., Stops, Fricatives, Liquids'),
										$elm$html$Html$Attributes$value(model.M),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateCategoryNameInput),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('error', (!isValid) && (model.M !== ''))
											])),
										A2($elm$html$Html$Attributes$style, 'width', '100%')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '8px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Changing the name will automatically update the label and adjust any syllable patterns that use it.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Sounds in Category')
									])),
								$elm$core$List$isEmpty(soundsInPhonology) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', '#888'),
										A2($elm$html$Html$Attributes$style, 'font-style', 'italic'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 0')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('No sounds in this category yet.')
									])) : A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('phoneme-list'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
									]),
								A2(
									$elm$core$List$map,
									$author$project$ViewPhonology$viewPhoneme(labelStr),
									soundsInPhonology))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ipa-add-section'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'position', 'relative')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('inline-form')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														A2($elm$html$Html$Attributes$style, 'position', 'relative'),
														A2($elm$html$Html$Attributes$style, 'flex', '1'),
														A2($elm$html$Html$Attributes$style, 'display', 'flex')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$input,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$type_('text'),
																$elm$html$Html$Attributes$id('ipa-input-phoneme'),
																$elm$html$Html$Attributes$placeholder('Add sound (IPA symbol)'),
																$elm$html$Html$Attributes$value(model.bv),
																$elm$html$Html$Events$onInput($author$project$Msg$UpdatePhonemeInput),
																$elm$html$Html$Events$onFocus(
																$author$project$Msg$FocusIPAField('phoneme')),
																$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
																$author$project$UpdateHelpers$onEnter(
																$author$project$UpdateHelpers$isNonEmpty(model.bv) ? $author$project$Msg$AddPhoneme : $author$project$Msg$NoOp),
																$elm$html$Html$Attributes$classList(
																_List_fromArray(
																	[
																		_Utils_Tuple2(
																		'error',
																		(!$author$project$UpdateHelpers$isNonEmpty(model.bv)) && (model.bv !== ''))
																	]))
															]),
														_List_Nil),
														A2($author$project$ViewComponents$viewIPADropdown, model, 'phoneme')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick($author$project$Msg$AddPhoneme),
														$elm$html$Html$Attributes$class('plus-btn'),
														$elm$html$Html$Attributes$disabled(
														!$author$project$UpdateHelpers$isNonEmpty(model.bv))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('+')
													]))
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$SaveCategoryEdit),
										$elm$html$Html$Attributes$class('primary'),
										$elm$html$Html$Attributes$disabled(!isValid),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Save Changes')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseEditCategoryModal),
										$elm$html$Html$Attributes$class('secondary'),
										A2($elm$html$Html$Attributes$style, 'flex', '1')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$RemovePattern = function (a) {
	return {$: 15, a: a};
};
var $author$project$Msg$TogglePatternSelection = function (a) {
	return {$: 17, a: a};
};
var $author$project$ViewPhonology$viewSavedPattern = F2(
	function (selectedPatterns, pattern) {
		var isSelected = A2($elm$core$List$member, pattern.dB, selectedPatterns);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pattern-tag')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('checkbox-label')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('checkbox'),
									$elm$html$Html$Attributes$checked(isSelected),
									$elm$html$Html$Events$onClick(
									$author$project$Msg$TogglePatternSelection(pattern.dB))
								]),
							_List_Nil),
							$elm$html$Html$text(' ' + pattern.dB)
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Msg$RemovePattern(pattern.dB))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('×')
						]))
				]));
	});
var $author$project$Msg$OpenEditCategoryModal = function (a) {
	return {$: 8, a: a};
};
var $author$project$Msg$RemoveCategory = function (a) {
	return {$: 5, a: a};
};
var $author$project$ViewPhonology$viewSoundCategoryCard = F2(
	function (model, category) {
		var labelStr = $elm$core$String$fromChar(category.dp);
		var allPhonologySounds = A2(
			$elm$core$List$concatMap,
			function ($) {
				return $.dM;
			},
			model.a.ct.dE.ce);
		var soundsInPhonology = A2(
			$elm$core$List$filter,
			function (sound) {
				return A2($elm$core$List$member, sound, allPhonologySounds);
			},
			category.dM);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
					A2($elm$html$Html$Attributes$style, 'padding', '20px'),
					A2($elm$html$Html$Attributes$style, 'background', '#fff')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'display', 'flex'),
							A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
							A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h4,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '0'),
									A2($elm$html$Html$Attributes$style, 'font-size', '1.1em')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(category.I + (' (' + (labelStr + ')')))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'display', 'flex'),
									A2($elm$html$Html$Attributes$style, 'gap', '8px')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$OpenEditCategoryModal(category.dp)),
											$elm$html$Html$Attributes$class('secondary'),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('✏ Edit')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick(
											$author$project$Msg$RemoveCategory(labelStr)),
											$elm$html$Html$Attributes$class('danger small'),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('× Delete')
										]))
								]))
						])),
					$elm$core$List$isEmpty(soundsInPhonology) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'color', '#888'),
							A2($elm$html$Html$Attributes$style, 'font-style', 'italic')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('No sounds in this category yet. Click Edit to add sounds.')
						])) : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('phoneme-list')
						]),
					A2(
						$elm$core$List$map,
						$author$project$ViewPhonology$viewPhoneme(labelStr),
						soundsInPhonology))
				]));
	});
var $author$project$ViewPhonology$viewSyllablePatternsSection = function (model) {
	var customCategories = A2(
		$elm$core$List$filter,
		function (cat) {
			return (cat.dp !== 'C') && (cat.dp !== 'V');
		},
		model.a.ct.dE.ce);
	var allLabels = A2(
		$elm$core$String$join,
		', ',
		A2(
			$elm$core$List$map,
			function (cat) {
				return $elm$core$String$fromChar(cat.dp);
			},
			model.a.ct.dE.ce));
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Syllable Patterns')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Define syllable structure templates used for word generation. Use category labels and parentheses for optional elements.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '30px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Saved Syllable Patterns')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('pattern-list')
							]),
						A2(
							$elm$core$List$map,
							$author$project$ViewPhonology$viewSavedPattern(model.aY),
							model.a.ct.dE.dC)),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'position', 'relative')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('inline-form')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$style, 'position', 'relative'),
												A2($elm$html$Html$Attributes$style, 'flex', '1'),
												A2($elm$html$Html$Attributes$style, 'display', 'flex')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$input,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('text'),
														$elm$html$Html$Attributes$id('ipa-input-pattern'),
														$elm$html$Html$Attributes$placeholder('Pattern (e.g., CV, C(C)V, (C)V(C))'),
														$elm$html$Html$Attributes$value(model.bu),
														$elm$html$Html$Events$onInput($author$project$Msg$UpdatePatternInput),
														$elm$html$Html$Events$onFocus(
														$author$project$Msg$FocusIPAField('pattern')),
														$elm$html$Html$Events$onBlur($author$project$Msg$BlurIPAField),
														$author$project$UpdateHelpers$onEnter(
														$author$project$UpdateHelpers$isNonEmpty(model.bu) ? $author$project$Msg$AddPattern : $author$project$Msg$NoOp),
														$elm$html$Html$Attributes$classList(
														_List_fromArray(
															[
																_Utils_Tuple2(
																'error',
																(!$author$project$UpdateHelpers$isNonEmpty(model.bu)) && (model.bu !== ''))
															]))
													]),
												_List_Nil),
												A2($author$project$ViewComponents$viewIPADropdown, model, 'pattern')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Msg$AddPattern),
												$elm$html$Html$Attributes$class('plus-btn'),
												$elm$html$Html$Attributes$disabled(
												!$author$project$UpdateHelpers$isNonEmpty(model.bu))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('+')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Available labels: ' + (allLabels + '. Examples: CV (simple), CVC (closed), (C)V(C) (optional), C(C)V (cluster)'))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-top', '30px')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'space-between'),
								A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin', '0')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Sound Categories')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$OpenAddCategoryModal),
										$elm$html$Html$Attributes$class('primary'),
										A2($elm$html$Html$Attributes$style, 'padding', '8px 16px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('+ Add Category')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('User-defined sound categories that can be used in syllable patterns and constraints.')
							])),
						(!$elm$core$List$isEmpty(customCategories)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'grid'),
								A2($elm$html$Html$Attributes$style, 'gap', '15px')
							]),
						A2(
							$elm$core$List$map,
							$author$project$ViewPhonology$viewSoundCategoryCard(model),
							customCategories)) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'padding', '30px'),
								A2($elm$html$Html$Attributes$style, 'text-align', 'center'),
								A2($elm$html$Html$Attributes$style, 'color', '#888'),
								A2($elm$html$Html$Attributes$style, 'border', '2px dashed #ddd'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '8px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No custom sound categories yet. Click \'Add Category\' to create one.')
							]))
					])),
				model.bA ? $author$project$ViewPhonology$viewAddCategoryModal(model) : $elm$html$Html$text(''),
				model.a$ ? $author$project$ViewPhonology$viewEditCategoryModal(model) : $elm$html$Html$text('')
			]));
};
var $author$project$Msg$AddAllGeneratedWordsToLexicon = {$: 155};
var $author$project$Msg$GenerateWords = {$: 38};
var $author$project$Model$MarkovGeneration = 1;
var $author$project$Msg$SelectGenerationMethod = function (a) {
	return {$: 147, a: a};
};
var $author$project$Msg$UpdateMarkovMaxLength = function (a) {
	return {$: 150, a: a};
};
var $author$project$Msg$UpdateMarkovMinLength = function (a) {
	return {$: 149, a: a};
};
var $author$project$Msg$UpdateMarkovOrder = function (a) {
	return {$: 148, a: a};
};
var $author$project$Msg$UpdateTemplateMaxSyllables = function (a) {
	return {$: 152, a: a};
};
var $author$project$Msg$UpdateTemplateMinSyllables = function (a) {
	return {$: 151, a: a};
};
var $author$project$Msg$UpdateWordGenerationCount = function (a) {
	return {$: 153, a: a};
};
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$Msg$AddGeneratedWordToLexicon = function (a) {
	return {$: 154, a: a};
};
var $author$project$ViewPhonology$viewGeneratedWord = F2(
	function (phonology, word) {
		var orthographyForm = A4(
			$author$project$MorphologyHelpers$applyOrthography,
			phonology,
			phonology.cA.cq,
			phonology.da,
			$author$project$Utilities$removeSyllableSeparators(word));
		var ipaForm = word;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('generated-word')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('generated-word-forms')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('generated-word-ipa')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(ipaForm)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('generated-word-ortho')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(orthographyForm)
								]))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('add-to-lexicon-btn'),
							$elm$html$Html$Events$onClick(
							$author$project$Msg$AddGeneratedWordToLexicon(word)),
							$elm$html$Html$Attributes$title('Add to lexicon')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('+')
						]))
				]));
	});
var $author$project$ViewPhonology$viewPatternButton = F2(
	function (selectedPatterns, pattern) {
		var isSelected = A2($elm$core$List$member, pattern.dB, selectedPatterns);
		var buttonClass = isSelected ? 'pattern-button pattern-button-selected' : 'pattern-button';
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(buttonClass),
					$elm$html$Html$Events$onClick(
					$author$project$Msg$TogglePatternSelection(pattern.dB))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(pattern.dB)
				]));
	});
var $author$project$ViewPhonology$viewWordGeneratorSection = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('section')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Generate words using template patterns or Markov chains trained on your lexicon')
					])),
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Word Generator')
					])),
				$elm$core$List$isEmpty(model.dh) ? $elm$html$Html$text('') : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('generated-words-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('generated-words-header')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('generated-words-title')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Generated Words')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('add-all-btn'),
										$elm$html$Html$Events$onClick($author$project$Msg$AddAllGeneratedWordsToLexicon),
										$elm$html$Html$Attributes$title('Add all generated words to the lexicon at once')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('➕ Add All to Lexicon')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('generated-words')
							]),
						A2(
							$elm$core$List$map,
							$author$project$ViewPhonology$viewGeneratedWord(model.a.ct.dE),
							model.dh))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Number of Words to Generate')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$elm$core$String$fromInt(model.cZ)),
								$elm$html$Html$Events$onInput($author$project$Msg$UpdateWordGenerationCount)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('5')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('5')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('10')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('10')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('15')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('15')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('25')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('25')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('50')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('50')
									]))
							]))
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Msg$GenerateWords)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Generate ' + ($elm$core$String$fromInt(model.cZ) + (' Word' + ((model.cZ === 1) ? '' : 's'))))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Generation Method')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('radio-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('radio-label')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$name('generationMethod'),
												$elm$html$Html$Attributes$checked(!model.cp),
												$elm$html$Html$Events$onClick(
												$author$project$Msg$SelectGenerationMethod(0))
											]),
										_List_Nil),
										$elm$html$Html$text(' Template-Based (uses syllable patterns)')
									])),
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('radio-label')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('radio'),
												$elm$html$Html$Attributes$name('generationMethod'),
												$elm$html$Html$Attributes$checked(model.cp === 1),
												$elm$html$Html$Events$onClick(
												$author$project$Msg$SelectGenerationMethod(1))
											]),
										_List_Nil),
										$elm$html$Html$text(' Markov Chain (learns from lexicon)')
									]))
							]))
					])),
				(!model.cp) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						(!$elm$core$List$isEmpty(model.a.ct.dE.dC)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Syllable Patterns')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Click patterns to select/deselect. When generating multi-syllable words, each syllable uses a randomly selected pattern from your selection.')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('pattern-list')
									]),
								A2(
									$elm$core$List$map,
									$author$project$ViewPhonology$viewPatternButton(model.aY),
									model.a.ct.dE.dC))
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No saved patterns. Add patterns in the Syllable Patterns section.')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Min Syllables: ' + $elm$core$String$fromInt(model.ca))
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('range'),
										$elm$html$Html$Attributes$min('1'),
										$elm$html$Html$Attributes$max('10'),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.ca)),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateTemplateMinSyllables)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Max Syllables: ' + $elm$core$String$fromInt(model.cU))
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('range'),
										$elm$html$Html$Attributes$min(
										$elm$core$String$fromInt(model.ca)),
										$elm$html$Html$Attributes$max('10'),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.cU)),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateTemplateMaxSyllables)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('When multiple syllable patterns are selected, each syllable randomly picks from your selection')
									]))
							]))
					])) : $elm$html$Html$text(''),
				(model.cp === 1) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Note: Markov generation requires words in your lexicon. You have ' + ($elm$core$String$fromInt(
									$elm$core$Dict$size(model.a.ct.dt)) + ' words.'))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('N-gram Order (1-5)')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('number'),
										$elm$html$Html$Attributes$min('1'),
										$elm$html$Html$Attributes$max('5'),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.cw)),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateMarkovOrder)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('help-text')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Higher values produce words more similar to your lexicon')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Min Syllables')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('number'),
										$elm$html$Html$Attributes$min('1'),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.bT)),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateMarkovMinLength)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Max Syllables')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('number'),
										$elm$html$Html$Attributes$min(
										$elm$core$String$fromInt(model.bT)),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.cv)),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateMarkovMaxLength)
									]),
								_List_Nil)
							]))
					])) : $elm$html$Html$text('')
			]));
};
var $author$project$ViewPhonology$viewPhonologySection = F2(
	function (model, section) {
		switch (section) {
			case 'ipa-charts':
				return $author$project$ViewPhonology$viewIPACharts(model);
			case 'constraints':
				return $author$project$ViewPhonology$viewConstraintsSection(model);
			case 'diphthongs':
				return $author$project$ViewPhonology$viewDiphthongsSection(model);
			case 'orthography':
				return $author$project$ViewPhonology$viewOrthographySection(model);
			case 'syllable-patterns':
				return $author$project$ViewPhonology$viewSyllablePatternsSection(model);
			case 'word-generator':
				return $author$project$ViewPhonology$viewWordGeneratorSection(model);
			default:
				return $author$project$ViewPhonology$viewIPACharts(model);
		}
	});
var $author$project$Msg$CloseSaveTemplateModal = {$: 124};
var $author$project$Msg$SaveCurrentProjectAsTemplate = {$: 122};
var $author$project$Msg$UpdateSaveAsTemplateDescInput = function (a) {
	return {$: 126, a: a};
};
var $author$project$Msg$UpdateSaveAsTemplateNameInput = function (a) {
	return {$: 125, a: a};
};
var $author$project$ViewApp$viewSaveTemplateModal = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'position', 'fixed'),
				A2($elm$html$Html$Attributes$style, 'top', '0'),
				A2($elm$html$Html$Attributes$style, 'left', '0'),
				A2($elm$html$Html$Attributes$style, 'width', '100%'),
				A2($elm$html$Html$Attributes$style, 'height', '100%'),
				A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
				A2($elm$html$Html$Attributes$style, 'display', 'flex'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				$elm$html$Html$Events$onClick($author$project$Msg$CloseSaveTemplateModal)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0,0,0,0.1)'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '90%'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Msg$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Save Current Project as Template')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Template Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., My Custom Template'),
										$elm$html$Html$Attributes$value(model.aA),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateSaveAsTemplateNameInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'display', 'block'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Description')
									])),
								A2(
								$elm$html$Html$textarea,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$placeholder('Describe this template...'),
										$elm$html$Html$Attributes$value(model.aX),
										$elm$html$Html$Events$onInput($author$project$Msg$UpdateSaveAsTemplateDescInput),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px'),
										A2($elm$html$Html$Attributes$style, 'border', '1px solid #ddd'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em'),
										A2($elm$html$Html$Attributes$style, 'min-height', '80px'),
										A2($elm$html$Html$Attributes$style, 'resize', 'vertical')
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'display', 'flex'),
								A2($elm$html$Html$Attributes$style, 'gap', '10px'),
								A2($elm$html$Html$Attributes$style, 'justify-content', 'flex-end')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$CloseSaveTemplateModal),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#ddd'),
										A2($elm$html$Html$Attributes$style, 'color', '#333'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Msg$SaveCurrentProjectAsTemplate),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#FF9800'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '1em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('💾 Save Template')
									]))
							]))
					]))
			]));
};
var $author$project$Msg$CloseMobileSidebar = {$: 223};
var $author$project$Msg$ToggleMobileSidebar = {$: 222};
var $author$project$Msg$SwitchSection = function (a) {
	return {$: 53, a: a};
};
var $author$project$ViewApp$viewSectionButton = F2(
	function (activeSection, _v0) {
		var sectionId = _v0.a;
		var sectionLabel = _v0.b;
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					_Utils_eq(activeSection, sectionId) ? 'section-button active' : 'section-button'),
					$elm$html$Html$Events$onClick(
					$author$project$Msg$SwitchSection(sectionId))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(sectionLabel)
				]));
	});
var $author$project$ViewApp$viewTabWithSidebar = F4(
	function (model, tabName, sections, sectionViewFn) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('tab-container')
				]),
			_List_fromArray(
				[
					model.aN ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mobile-sidebar-overlay active'),
							$elm$html$Html$Events$onClick($author$project$Msg$CloseMobileSidebar)
						]),
					_List_Nil) : $elm$html$Html$text(''),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							model.aN ? 'section-sidebar mobile-open' : 'section-sidebar')
						]),
					A2(
						$elm$core$List$map,
						$author$project$ViewApp$viewSectionButton(model.X),
						sections)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('section-content')
						]),
					_List_fromArray(
						[
							A2(sectionViewFn, model, model.X)
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mobile-menu-toggle'),
							$elm$html$Html$Events$onClick($author$project$Msg$ToggleMobileSidebar),
							A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Toggle menu')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							model.aN ? '✕' : '☰')
						]))
				]));
	});
var $author$project$Msg$SwitchTab = function (a) {
	return {$: 52, a: a};
};
var $author$project$ViewApp$viewTabs = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('tabs')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						(model.ao === 'languages') ? 'tab active' : 'tab'),
						$elm$html$Html$Events$onClick(
						$author$project$Msg$SwitchTab('languages'))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Languages')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						(model.ao === 'phonology') ? 'tab active' : 'tab'),
						$elm$html$Html$Events$onClick(
						$author$project$Msg$SwitchTab('phonology'))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Phonology & Generator')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						(model.ao === 'morphology') ? 'tab active' : 'tab'),
						$elm$html$Html$Events$onClick(
						$author$project$Msg$SwitchTab('morphology'))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Morphology')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						(model.ao === 'lexicon') ? 'tab active' : 'tab'),
						$elm$html$Html$Events$onClick(
						$author$project$Msg$SwitchTab('lexicon'))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Lexicon')
					]))
			]));
};
var $author$project$ViewApp$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('app')
			]),
		_List_fromArray(
			[
				$author$project$ViewApp$viewHeader(model),
				$author$project$ViewApp$viewTabs(model),
				function () {
				var _v0 = model.ao;
				switch (_v0) {
					case 'languages':
						return A4(
							$author$project$ViewApp$viewTabWithSidebar,
							model,
							'languages',
							_List_fromArray(
								[
									_Utils_Tuple2('languages', 'Languages'),
									_Utils_Tuple2('language-families', 'Language Families'),
									_Utils_Tuple2('projects', 'Projects'),
									_Utils_Tuple2('templates', 'Templates')
								]),
							$author$project$ViewLanguages$viewLanguagesSection);
					case 'phonology':
						return A4(
							$author$project$ViewApp$viewTabWithSidebar,
							model,
							'phonology',
							_List_fromArray(
								[
									_Utils_Tuple2('ipa-charts', 'IPA Charts'),
									_Utils_Tuple2('constraints', 'Phonotactic Constraints'),
									_Utils_Tuple2('diphthongs', 'Diphthongs'),
									_Utils_Tuple2('orthography', 'Orthography'),
									_Utils_Tuple2('syllable-patterns', 'Syllable Patterns'),
									_Utils_Tuple2('word-generator', 'Word Generator')
								]),
							$author$project$ViewPhonology$viewPhonologySection);
					case 'morphology':
						return A4(
							$author$project$ViewApp$viewTabWithSidebar,
							model,
							'morphology',
							_List_fromArray(
								[
									_Utils_Tuple2('features', 'Grammatical Features'),
									_Utils_Tuple2('morphemes', 'Morpheme Inventory'),
									_Utils_Tuple2('rules', 'Morphophonemic Rules'),
									_Utils_Tuple2('paradigms', 'Paradigm Builder')
								]),
							$author$project$ViewMorphology$viewMorphologySection);
					case 'lexicon':
						return A4(
							$author$project$ViewApp$viewTabWithSidebar,
							model,
							'lexicon',
							_List_fromArray(
								[
									_Utils_Tuple2('lexicon', 'Lexicon Management'),
									_Utils_Tuple2('sound-changes', 'Bulk Sound Change')
								]),
							$author$project$ViewLexicon$viewLexiconSection);
					default:
						return A4(
							$author$project$ViewApp$viewTabWithSidebar,
							model,
							'languages',
							_List_fromArray(
								[
									_Utils_Tuple2('languages', 'Languages'),
									_Utils_Tuple2('language-families', 'Language Families'),
									_Utils_Tuple2('projects', 'Projects'),
									_Utils_Tuple2('templates', 'Templates')
								]),
							$author$project$ViewLanguages$viewLanguagesSection);
				}
			}(),
				function () {
				var _v1 = model.bc;
				if (!_v1.$) {
					var projectId = _v1.a;
					return A2($author$project$ViewLanguages$viewDeleteProjectConfirm, projectId, model.b$);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				function () {
				var _v2 = model.bb;
				if (!_v2.$) {
					var familyId = _v2.a;
					return A2($author$project$ViewLanguages$viewDeleteLanguageFamilyConfirm, familyId, model.m);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				model.aC ? $author$project$ViewLanguages$viewLoadTemplateModal(model) : $elm$html$Html$text(''),
				model.a_ ? $author$project$ViewLanguages$viewDuplicateProjectModal(model) : $elm$html$Html$text(''),
				model.ab ? $author$project$ViewLanguages$viewAddLanguageFamilyModal(model) : $elm$html$Html$text(''),
				model.ac ? $author$project$ViewLanguages$viewAddProjectModal(model) : $elm$html$Html$text(''),
				function () {
				var _v3 = model.bd;
				if (!_v3.$) {
					var uuid = _v3.a;
					return A2($author$project$ViewLanguages$viewDeleteProjectByUuidConfirm, uuid, model.P);
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				model.bC ? $author$project$ViewApp$viewAddMorphemeModal(model) : $elm$html$Html$text(''),
				model.bG ? $author$project$ViewApp$viewEditMorphemeModal(model) : $elm$html$Html$text(''),
				model.bE ? $author$project$ViewApp$viewAddRuleModal(model) : $elm$html$Html$text(''),
				model.bD ? $author$project$ViewApp$viewAddParadigmModal(model) : $elm$html$Html$text(''),
				model.bJ ? $author$project$ViewApp$viewSaveTemplateModal(model) : $elm$html$Html$text(''),
				model.bI ? $author$project$ViewApp$viewNewProjectModal(model) : $elm$html$Html$text('')
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{dm: $author$project$Main$init, dN: $author$project$Main$subscriptions, dP: $author$project$Main$update, dS: $author$project$ViewApp$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));