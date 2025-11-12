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
	if (region.b0.bL === region.b4.bL)
	{
		return 'on line ' + region.b0.bL;
	}
	return 'on lines ' + region.b0.bL + ' through ' + region.b4.bL;
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
		impl.cD,
		impl.cN,
		impl.cL,
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
		cE: func(record.cE),
		cK: record.cK,
		cI: record.cI
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
		var message = !tag ? value : tag < 3 ? value.a : value.cE;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.cK;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.cI) && event.preventDefault(),
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
		impl.cD,
		impl.cN,
		impl.cL,
		function(sendToApp, initialModel) {
			var view = impl.cO;
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
		impl.cD,
		impl.cN,
		impl.cL,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.b$ && impl.b$(sendToApp)
			var view = impl.cO;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cw);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.cM) && (_VirtualDom_doc.title = title = doc.cM);
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
	var onUrlChange = impl.cF;
	var onUrlRequest = impl.cG;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		b$: function(sendToApp)
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
							&& curr.cj === next.cj
							&& curr.b8 === next.b8
							&& curr.cf.a === next.cf.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		cD: function(flags)
		{
			return A3(impl.cD, flags, _Browser_getUrl(), key);
		},
		cO: impl.cO,
		cN: impl.cN,
		cL: impl.cL
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
		? { cB: 'hidden', cx: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { cB: 'mozHidden', cx: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { cB: 'msHidden', cx: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { cB: 'webkitHidden', cx: 'webkitvisibilitychange' }
		: { cB: 'hidden', cx: 'visibilitychange' };
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
		cn: _Browser_getScene(),
		cq: {
			cs: _Browser_window.pageXOffset,
			ct: _Browser_window.pageYOffset,
			cr: _Browser_doc.documentElement.clientWidth,
			t: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		cr: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		t: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			cn: {
				cr: node.scrollWidth,
				t: node.scrollHeight
			},
			cq: {
				cs: node.scrollLeft,
				ct: node.scrollTop,
				cr: node.clientWidth,
				t: node.clientHeight
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
			cn: _Browser_getScene(),
			cq: {
				cs: x,
				ct: y,
				cr: _Browser_doc.documentElement.clientWidth,
				t: _Browser_doc.documentElement.clientHeight
			},
			cz: {
				cs: x + rect.left,
				ct: y + rect.top,
				cr: rect.width,
				t: rect.height
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
		if (!builder.L) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.Q),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.Q);
		} else {
			var treeLen = builder.L * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.T) : builder.T;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.L);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.Q) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.Q);
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
					{T: nodeList, L: (len / $elm$core$Array$branchFactor) | 0, Q: tail});
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
		return {b7: fragment, b8: host, cd: path, cf: port_, cj: protocol, ck: query};
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
var $author$project$Main$Assimilation = 0;
var $author$project$Main$DisplayIPA = 0;
var $author$project$Main$IllegalCluster = 0;
var $author$project$Main$Suffix = 1;
var $author$project$Main$TemplateGeneration = 0;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$getCurrentTime = _Platform_outgoingPort(
	'getCurrentTime',
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
			aV: 'phonology',
			aH: '',
			a6: '',
			bG: 'noun',
			bH: '',
			a7: $elm$core$Maybe$Nothing,
			a8: '',
			x: 0,
			aB: 1,
			i: '',
			aW: $elm$core$Maybe$Nothing,
			X: $elm$core$Maybe$Nothing,
			b6: $elm$core$Maybe$Nothing,
			ba: '',
			bb: '',
			bI: 'all',
			bJ: 'all',
			B: _List_Nil,
			aJ: 0,
			aY: '',
			bc: '',
			bd: '',
			be: $elm$core$Maybe$Nothing,
			bf: '',
			bK: false,
			bg: '',
			bM: 4,
			a_: 2,
			a$: 2,
			ai: '',
			as: '',
			at: '',
			bh: $elm$core$Maybe$Nothing,
			aE: 1,
			au: '',
			aF: '',
			bi: '',
			bj: '',
			bk: '',
			bl: '',
			a: {
				_: '',
				o: 1,
				c: {
					B: _List_Nil,
					e: _List_Nil,
					j: {p: _List_Nil, q: _List_Nil, P: _List_Nil, y: _List_Nil},
					b: 'Proto-Language',
					n: {
						k: _List_fromArray(
							[
								{
								J: 'C',
								b: 'Consonants',
								u: _List_fromArray(
									['p', 't', 'k', 'm', 'n', 's', 'l', 'r'])
							},
								{
								J: 'V',
								b: 'Vowels',
								u: _List_fromArray(
									['a', 'e', 'i', 'o', 'u'])
							}
							]),
						U: _List_Nil,
						r: {aC: 0, S: _List_Nil},
						aa: _List_fromArray(
							[
								{b: 'CV', w: 'CV'},
								{b: 'CVC', w: 'CVC'}
							])
					}
				},
				ah: '',
				b: 'My Conlang Project'
			},
			aL: _List_Nil,
			Z: _List_Nil,
			bN: $elm$core$Maybe$Nothing,
			bm: $elm$core$Maybe$Nothing,
			aM: '',
			aN: '',
			bn: $elm$core$Maybe$Nothing,
			bo: '',
			bp: '',
			bq: '',
			br: '',
			bs: '',
			aO: 0,
			a3: '',
			aP: '',
			bt: '',
			bu: 'C',
			ap: _List_Nil,
			bO: $elm$core$Maybe$Nothing,
			ax: _List_Nil,
			F: _List_Nil,
			bv: false,
			bw: false,
			aQ: true,
			a4: false,
			bP: false,
			bx: false,
			by: false,
			aq: false,
			bz: false,
			bA: false,
			aG: true,
			aR: '',
			ay: '',
			az: '',
			bQ: 'CV',
			aS: '',
			bC: 3,
			aT: 1,
			E: _List_Nil,
			bD: _List_Nil,
			ad: '',
			ak: '',
			ae: '',
			al: 10,
			am: '',
			an: 'noun'
		},
		$elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Main$getCurrentTime(0),
					$author$project$Main$loadAllTemplates(0),
					$author$project$Main$loadPreferences(0)
				])));
};
var $author$project$Main$ImportDataReceived = function (a) {
	return {$: 37, a: a};
};
var $author$project$Main$LexiconCSVImported = function (a) {
	return {$: 142, a: a};
};
var $author$project$Main$LoadedFromStorage = function (a) {
	return {$: 39, a: a};
};
var $author$project$Main$ReceivedAllProjects = function (a) {
	return {$: 127, a: a};
};
var $author$project$Main$ReceivedAllTemplates = function (a) {
	return {$: 117, a: a};
};
var $author$project$Main$ReceivedCurrentTime = function (a) {
	return {$: 40, a: a};
};
var $author$project$Main$ReceivedPreferences = function (a) {
	return {$: 118, a: a};
};
var $author$project$Main$ReceivedProject = function (a) {
	return {$: 128, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $author$project$Main$Redo = {$: 150};
var $author$project$Main$Undo = {$: 149};
var $author$project$Main$UpdatePhonemeInput = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$keyDecoder = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (key, ctrl) {
			return (ctrl && (key === 'z')) ? $author$project$Main$Undo : ((ctrl && (key === 'y')) ? $author$project$Main$Redo : ((ctrl && (key === 'Z')) ? $author$project$Main$Redo : $author$project$Main$UpdatePhonemeInput('')));
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
		return {ce: pids, co: subs};
	});
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
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
		return {b5: event, b9: key};
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
			state.ce,
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
		var key = _v0.b9;
		var event = _v0.b5;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.co);
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
var $author$project$Main$receiveAllProjects = _Platform_incomingPort('receiveAllProjects', $elm$json$Json$Decode$value);
var $author$project$Main$receiveAllTemplates = _Platform_incomingPort('receiveAllTemplates', $elm$json$Json$Decode$value);
var $author$project$Main$receiveCSVData = _Platform_incomingPort('receiveCSVData', $elm$json$Json$Decode$string);
var $author$project$Main$receiveCurrentTime = _Platform_incomingPort('receiveCurrentTime', $elm$json$Json$Decode$string);
var $author$project$Main$receiveImportData = _Platform_incomingPort('receiveImportData', $elm$json$Json$Decode$string);
var $author$project$Main$receivePreferences = _Platform_incomingPort('receivePreferences', $elm$json$Json$Decode$value);
var $author$project$Main$receiveProject = _Platform_incomingPort('receiveProject', $elm$json$Json$Decode$value);
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$loadFromStorage($author$project$Main$LoadedFromStorage),
				$author$project$Main$receiveCurrentTime($author$project$Main$ReceivedCurrentTime),
				$author$project$Main$receiveImportData($author$project$Main$ImportDataReceived),
				$author$project$Main$receiveAllProjects($author$project$Main$ReceivedAllProjects),
				$author$project$Main$receiveProject($author$project$Main$ReceivedProject),
				$author$project$Main$receiveCSVData($author$project$Main$LexiconCSVImported),
				$author$project$Main$receiveAllTemplates($author$project$Main$ReceivedAllTemplates),
				$author$project$Main$receivePreferences($author$project$Main$ReceivedPreferences),
				$elm$browser$Browser$Events$onKeyDown($author$project$Main$keyDecoder)
			]));
};
var $author$project$Main$DisplayOrthography = 1;
var $author$project$Main$WordsGenerated = function (a) {
	return {$: 33, a: a};
};
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
var $author$project$Main$applyMorpheme = F2(
	function (morpheme, base) {
		if ($elm$core$String$isEmpty(base)) {
			return base;
		} else {
			var morphForm = A3(
				$elm$core$String$replace,
				'...',
				'',
				A3($elm$core$String$replace, '-', '', morpheme.g));
			var _v0 = morpheme.K;
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
					var parts = A2($elm$core$String$contains, '-', morpheme.g) ? A2(
						$elm$core$List$filter,
						function (s) {
							return (s !== '...') && (s !== '');
						},
						A2($elm$core$String$split, '-', morpheme.g)) : (A2($elm$core$String$contains, '...', morpheme.g) ? A2($elm$core$String$split, '...', morpheme.g) : _List_Nil);
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
var $author$project$Main$replaceAfterPattern = F4(
	function (target, replacement, before, word) {
		var pattern = _Utils_ap(before, target);
		var newPattern = _Utils_ap(before, replacement);
		return A3($elm$core$String$replace, pattern, newPattern, word);
	});
var $author$project$Main$replaceBeforePattern = F4(
	function (target, replacement, after, word) {
		var pattern = _Utils_ap(target, after);
		var newPattern = _Utils_ap(replacement, after);
		return A3($elm$core$String$replace, pattern, newPattern, word);
	});
var $author$project$Main$replaceBetweenPattern = F5(
	function (target, replacement, before, after, word) {
		var pattern = _Utils_ap(
			before,
			_Utils_ap(target, after));
		var newPattern = _Utils_ap(
			before,
			_Utils_ap(replacement, after));
		return A3($elm$core$String$replace, pattern, newPattern, word);
	});
var $author$project$Main$applyContextualRule = F2(
	function (rule, word) {
		var parts = A2($elm$core$String$split, '_', rule.ar);
		var result = function () {
			if ((parts.b && parts.b.b) && (!parts.b.b.b)) {
				var before = parts.a;
				var _v1 = parts.b;
				var after = _v1.a;
				return ($elm$core$String$isEmpty(before) && (!$elm$core$String$isEmpty(after))) ? A4($author$project$Main$replaceBeforePattern, rule.ab, rule.aj, after, word) : (((!$elm$core$String$isEmpty(before)) && $elm$core$String$isEmpty(after)) ? A4($author$project$Main$replaceAfterPattern, rule.ab, rule.aj, before, word) : (((!$elm$core$String$isEmpty(before)) && (!$elm$core$String$isEmpty(after))) ? A5($author$project$Main$replaceBetweenPattern, rule.ab, rule.aj, before, after, word) : word));
			} else {
				return word;
			}
		}();
		return result;
	});
var $author$project$Main$applyRule = F2(
	function (rule, word) {
		return $elm$core$String$isEmpty(rule.ar) ? A3($elm$core$String$replace, rule.ab, rule.aj, word) : A2($author$project$Main$applyContextualRule, rule, word);
	});
var $author$project$Main$applyMorphophonemicRules = F2(
	function (rules, word) {
		return A3($elm$core$List$foldl, $author$project$Main$applyRule, word, rules);
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Main$applyOrthography = F2(
	function (mappings, word) {
		var sortedMappings = A2(
			$elm$core$List$sortBy,
			function (m) {
				return -$elm$core$String$length(m.f);
			},
			mappings);
		var applyMapping = function (remaining) {
			if ($elm$core$String$isEmpty(remaining)) {
				return '';
			} else {
				var _v0 = A2(
					$elm$core$List$filter,
					function (m) {
						return A2($elm$core$String$startsWith, m.f, remaining);
					},
					sortedMappings);
				if (_v0.b) {
					var firstMatch = _v0.a;
					return _Utils_ap(
						firstMatch.h,
						applyMapping(
							A2(
								$elm$core$String$dropLeft,
								$elm$core$String$length(firstMatch.f),
								remaining)));
				} else {
					return _Utils_ap(
						A2($elm$core$String$left, 1, remaining),
						applyMapping(
							A2($elm$core$String$dropLeft, 1, remaining)));
				}
			}
		};
		return applyMapping(word);
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
var $author$project$Main$isVowelChar = function (c) {
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
var $author$project$Main$matchesPatternAfterVowel = F3(
	function (patternChars, chars, previousChar) {
		var patternLen = $elm$core$List$length(patternChars);
		var extracted = A2($elm$core$List$take, patternLen, chars);
		return _Utils_eq(extracted, patternChars) && function () {
			if (!previousChar.$) {
				var c = previousChar.a;
				return $author$project$Main$isVowelChar(c);
			} else {
				return false;
			}
		}();
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Main$replaceAfterVowelHelper = F4(
	function (patternChars, replacement, chars, previousChar) {
		replaceAfterVowelHelper:
		while (true) {
			if (!chars.b) {
				return _List_Nil;
			} else {
				if (A3($author$project$Main$matchesPatternAfterVowel, patternChars, chars, previousChar)) {
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
								$author$project$Main$replaceAfterVowelHelper,
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
var $author$project$Main$replaceAfterVowel = F3(
	function (pattern, replacement, word) {
		var patternChars = $elm$core$String$toList(pattern);
		var chars = $elm$core$String$toList(word);
		return $elm$core$String$fromList(
			A4($author$project$Main$replaceAfterVowelHelper, patternChars, replacement, chars, $elm$core$Maybe$Nothing));
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$matchesPatternBeforeVowel = F2(
	function (patternChars, chars) {
		var patternLen = $elm$core$List$length(patternChars);
		var extracted = A2($elm$core$List$take, patternLen, chars);
		var afterPattern = A2($elm$core$List$drop, patternLen, chars);
		return _Utils_eq(extracted, patternChars) && function () {
			var _v0 = $elm$core$List$head(afterPattern);
			if (!_v0.$) {
				var c = _v0.a;
				return $author$project$Main$isVowelChar(c);
			} else {
				return false;
			}
		}();
	});
var $author$project$Main$replaceBeforeVowelHelper = F3(
	function (patternChars, replacement, chars) {
		if (!chars.b) {
			return _List_Nil;
		} else {
			if (A2($author$project$Main$matchesPatternBeforeVowel, patternChars, chars)) {
				return A3(
					$author$project$Main$replaceBeforeVowelHelper,
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
						A3($author$project$Main$replaceBeforeVowelHelper, patternChars, replacement, rest));
				} else {
					return _List_Nil;
				}
			}
		}
	});
var $author$project$Main$replaceBeforeVowel = F3(
	function (pattern, replacement, word) {
		var patternChars = $elm$core$String$toList(pattern);
		var chars = $elm$core$String$toList(word);
		return $elm$core$String$fromList(
			A3($author$project$Main$replaceBeforeVowelHelper, patternChars, replacement, chars));
	});
var $author$project$Main$matchesPatternBetweenVowels = F3(
	function (patternChars, chars, previousChar) {
		var patternLen = $elm$core$List$length(patternChars);
		var extracted = A2($elm$core$List$take, patternLen, chars);
		var afterPattern = A2($elm$core$List$drop, patternLen, chars);
		return _Utils_eq(extracted, patternChars) && function () {
			if (!previousChar.$) {
				var prevC = previousChar.a;
				return $author$project$Main$isVowelChar(prevC) && function () {
					var _v1 = $elm$core$List$head(afterPattern);
					if (!_v1.$) {
						var nextC = _v1.a;
						return $author$project$Main$isVowelChar(nextC);
					} else {
						return false;
					}
				}();
			} else {
				return false;
			}
		}();
	});
var $author$project$Main$replaceBetweenVowelsHelper = F4(
	function (patternChars, replacement, chars, previousChar) {
		replaceBetweenVowelsHelper:
		while (true) {
			if (!chars.b) {
				return _List_Nil;
			} else {
				if (A3($author$project$Main$matchesPatternBetweenVowels, patternChars, chars, previousChar)) {
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
								$author$project$Main$replaceBetweenVowelsHelper,
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
var $author$project$Main$replaceBetweenVowels = F3(
	function (pattern, replacement, word) {
		var patternChars = $elm$core$String$toList(pattern);
		var chars = $elm$core$String$toList(word);
		return $elm$core$String$fromList(
			A4($author$project$Main$replaceBetweenVowelsHelper, patternChars, replacement, chars, $elm$core$Maybe$Nothing));
	});
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $author$project$Main$replaceWordFinal = F3(
	function (pattern, replacement, word) {
		return A2($elm$core$String$endsWith, pattern, word) ? _Utils_ap(
			A2(
				$elm$core$String$dropRight,
				$elm$core$String$length(pattern),
				word),
			replacement) : word;
	});
var $author$project$Main$replaceWordInitial = F3(
	function (pattern, replacement, word) {
		return A2($elm$core$String$startsWith, pattern, word) ? _Utils_ap(
			replacement,
			A2(
				$elm$core$String$dropLeft,
				$elm$core$String$length(pattern),
				word)) : word;
	});
var $author$project$Main$applySoundChangeWithContext = F4(
	function (pattern, replacement, context, word) {
		var contextPattern = A3($elm$core$String$replace, '_', pattern, context);
		return (context === '#_') ? A3($author$project$Main$replaceWordInitial, pattern, replacement, word) : ((context === '_#') ? A3($author$project$Main$replaceWordFinal, pattern, replacement, word) : (A2($elm$core$String$contains, '_V', context) ? A3($author$project$Main$replaceBeforeVowel, pattern, replacement, word) : (A2($elm$core$String$contains, 'V_', context) ? A3($author$project$Main$replaceAfterVowel, pattern, replacement, word) : (A2($elm$core$String$contains, 'V_V', context) ? A3($author$project$Main$replaceBetweenVowels, pattern, replacement, word) : A3(
			$elm$core$String$replace,
			contextPattern,
			A3($elm$core$String$replace, pattern, replacement, contextPattern),
			word)))));
	});
var $author$project$Main$applySoundChange = F4(
	function (pattern, replacement, context, word) {
		return $elm$core$String$isEmpty(pattern) ? word : ($elm$core$String$isEmpty(context) ? A3($elm$core$String$replace, pattern, replacement, word) : A4($author$project$Main$applySoundChangeWithContext, pattern, replacement, context, word));
	});
var $author$project$Main$applySoundChangeToWord = F4(
	function (pattern, replacement, context, lexeme) {
		var newForm = A4($author$project$Main$applySoundChange, pattern, replacement, context, lexeme.g);
		return _Utils_update(
			lexeme,
			{g: newForm});
	});
var $author$project$Main$CodaRestriction = 2;
var $author$project$Main$Dissimilation = 1;
var $author$project$Main$OnsetRestriction = 1;
var $author$project$Main$englishTemplate = {
	d: 'A template based on English phonology with common Germanic patterns',
	o: 0,
	aZ: true,
	c: {
		B: _List_Nil,
		e: _List_Nil,
		j: {
			p: _List_fromArray(
				[
					{
					b: 'Number',
					R: _List_fromArray(
						['singular', 'plural'])
				},
					{
					b: 'Tense',
					R: _List_fromArray(
						['present', 'past', 'future'])
				},
					{
					b: 'Person',
					R: _List_fromArray(
						['1st', '2nd', '3rd'])
				}
				]),
			q: _List_fromArray(
				[
					{C: 'Number', g: '-s', D: 'PL', K: 1, G: 'plural'},
					{C: 'Tense', g: '-ed', D: 'PST', K: 1, G: 'past'},
					{C: '', g: '-ing', D: 'PROG', K: 1, G: ''}
				]),
			P: _List_fromArray(
				[
					{ar: 'V_', d: 's becomes z after vowels', b: 'Voicing Assimilation', aj: 'z', a2: 0, ab: 's'},
					{ar: 'e_', d: 'e deletes before another e', b: 'E-deletion', aj: '', a2: 1, ab: 'e'}
				]),
			y: _List_Nil
		},
		b: 'New English-like Language',
		n: {
			k: _List_fromArray(
				[
					{
					J: 'C',
					b: 'Consonants',
					u: _List_fromArray(
						['p', 'b', 't', 'd', 'k', 'g', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'tʃ', 'dʒ', 'm', 'n', 'ŋ', 'l', 'r', 'w', 'j'])
				},
					{
					J: 'V',
					b: 'Vowels',
					u: _List_fromArray(
						['i', 'ɪ', 'e', 'ɛ', 'æ', 'ɑ', 'ɔ', 'o', 'ʊ', 'u', 'ʌ', 'ə'])
				}
				]),
			U: _List_fromArray(
				[
					{x: 0, d: 'Illegal cluster: *tl', z: 'tl'},
					{x: 0, d: 'Illegal cluster: *dl', z: 'dl'},
					{x: 1, d: 'ŋ not allowed in syllable onset', z: 'ŋ'},
					{x: 2, d: 'h not allowed in syllable coda', z: 'h'},
					{x: 2, d: 'w not allowed in syllable coda', z: 'w'},
					{x: 2, d: 'j not allowed in syllable coda', z: 'j'}
				]),
			r: {
				aC: 0,
				S: _List_fromArray(
					[
						{d: 'voiceless bilabial stop', h: 'p', f: 'p'},
						{d: 'voiced bilabial stop', h: 'b', f: 'b'},
						{d: 'voiceless alveolar stop', h: 't', f: 't'},
						{d: 'voiced alveolar stop', h: 'd', f: 'd'},
						{d: 'voiceless velar stop', h: 'k', f: 'k'},
						{d: 'voiced velar stop', h: 'g', f: 'g'},
						{d: 'voiceless labiodental fricative', h: 'f', f: 'f'},
						{d: 'voiced labiodental fricative', h: 'v', f: 'v'},
						{d: 'voiceless dental fricative', h: 'th', f: 'θ'},
						{d: 'voiced dental fricative', h: 'dh', f: 'ð'},
						{d: 'voiceless alveolar fricative', h: 's', f: 's'},
						{d: 'voiced alveolar fricative', h: 'z', f: 'z'},
						{d: 'voiceless postalveolar fricative', h: 'sh', f: 'ʃ'},
						{d: 'voiced postalveolar fricative', h: 'zh', f: 'ʒ'},
						{d: 'voiceless glottal fricative', h: 'h', f: 'h'},
						{d: 'voiceless postalveolar affricate', h: 'ch', f: 'tʃ'},
						{d: 'voiced postalveolar affricate', h: 'j', f: 'dʒ'},
						{d: 'bilabial nasal', h: 'm', f: 'm'},
						{d: 'alveolar nasal', h: 'n', f: 'n'},
						{d: 'velar nasal', h: 'ng', f: 'ŋ'},
						{d: 'alveolar lateral approximant', h: 'l', f: 'l'},
						{d: 'alveolar approximant', h: 'r', f: 'r'},
						{d: 'labio-velar approximant', h: 'w', f: 'w'},
						{d: 'palatal approximant', h: 'y', f: 'j'},
						{d: 'close front unrounded vowel', h: 'ee', f: 'i'},
						{d: 'near-close front unrounded vowel', h: 'i', f: 'ɪ'},
						{d: 'close-mid front unrounded vowel', h: 'ay', f: 'e'},
						{d: 'open-mid front unrounded vowel', h: 'e', f: 'ɛ'},
						{d: 'near-open front unrounded vowel', h: 'a', f: 'æ'},
						{d: 'open back unrounded vowel', h: 'ah', f: 'ɑ'},
						{d: 'open-mid back rounded vowel', h: 'aw', f: 'ɔ'},
						{d: 'close-mid back rounded vowel', h: 'oh', f: 'o'},
						{d: 'near-close back rounded vowel', h: 'oo', f: 'ʊ'},
						{d: 'close back rounded vowel', h: 'oo', f: 'u'},
						{d: 'open-mid back unrounded vowel', h: 'u', f: 'ʌ'},
						{d: 'mid central vowel (schwa)', h: 'uh', f: 'ə'}
					])
			},
			aa: _List_fromArray(
				[
					{b: 'V', w: 'V'},
					{b: 'CV', w: 'CV'},
					{b: 'CVC', w: 'CVC'},
					{b: 'CVCC', w: 'CVCC'},
					{b: 'CCV', w: 'CCV'},
					{b: 'CCVC', w: 'CCVC'}
				])
		}
	},
	b: 'English-inspired'
};
var $author$project$Main$NoWordFinal = 4;
var $author$project$Main$VowelHarmony = 2;
var $author$project$Main$quenyaTemplate = {
	d: 'A template based on Tolkien\'s Quenya with a flowing, vowel-rich phonology',
	o: 0,
	aZ: true,
	c: {
		B: _List_Nil,
		e: _List_Nil,
		j: {
			p: _List_fromArray(
				[
					{
					b: 'Number',
					R: _List_fromArray(
						['singular', 'plural', 'dual'])
				},
					{
					b: 'Case',
					R: _List_fromArray(
						['nominative', 'genitive', 'dative', 'accusative', 'locative', 'instrumental'])
				}
				]),
			q: _List_fromArray(
				[
					{C: 'Number', g: '-r', D: 'PL', K: 1, G: 'plural'},
					{C: 'Number', g: '-t', D: 'DU', K: 1, G: 'dual'},
					{C: 'Case', g: '-o', D: 'GEN', K: 1, G: 'genitive'},
					{C: 'Case', g: '-n', D: 'DAT', K: 1, G: 'dative'},
					{C: 'Case', g: '-eː', D: 'ACC', K: 1, G: 'accusative'},
					{C: 'Case', g: '-seː', D: 'LOC', K: 1, G: 'locative'},
					{C: 'Case', g: '-nen', D: 'INST', K: 1, G: 'instrumental'}
				]),
			P: _List_fromArray(
				[
					{ar: '', d: 'e becomes i in certain contexts', b: 'Vowel Harmony', aj: 'i', a2: 2, ab: 'e'}
				]),
			y: _List_Nil
		},
		b: 'New Quenya-like Language',
		n: {
			k: _List_fromArray(
				[
					{
					J: 'C',
					b: 'Consonants',
					u: _List_fromArray(
						['p', 't', 'k', 'm', 'n', 'ɲ', 'ŋ', 'f', 's', 'h', 'l', 'r', 'w', 'j'])
				},
					{
					J: 'V',
					b: 'Vowels',
					u: _List_fromArray(
						['a', 'e', 'i', 'o', 'u', 'aː', 'eː', 'iː', 'oː', 'uː'])
				}
				]),
			U: _List_fromArray(
				[
					{x: 0, d: 'Illegal cluster: *nm', z: 'nm'},
					{x: 0, d: 'Illegal cluster: *fn', z: 'fn'},
					{x: 1, d: 'ŋ not allowed in syllable onset', z: 'ŋ'},
					{x: 2, d: 'h not allowed in syllable coda', z: 'h'},
					{x: 4, d: 'w not allowed word-finally', z: 'w'}
				]),
			r: {
				aC: 0,
				S: _List_fromArray(
					[
						{d: 'voiceless bilabial stop', h: 'p', f: 'p'},
						{d: 'voiceless alveolar stop', h: 't', f: 't'},
						{d: 'voiceless velar stop (spelled \'c\')', h: 'c', f: 'k'},
						{d: 'bilabial nasal', h: 'm', f: 'm'},
						{d: 'alveolar nasal', h: 'n', f: 'n'},
						{d: 'palatal nasal', h: 'ny', f: 'ɲ'},
						{d: 'velar nasal', h: 'ng', f: 'ŋ'},
						{d: 'voiceless labiodental fricative', h: 'f', f: 'f'},
						{d: 'voiceless alveolar fricative', h: 's', f: 's'},
						{d: 'voiceless glottal fricative', h: 'h', f: 'h'},
						{d: 'alveolar lateral approximant', h: 'l', f: 'l'},
						{d: 'alveolar trill', h: 'r', f: 'r'},
						{d: 'labio-velar approximant (spelled \'v\')', h: 'v', f: 'w'},
						{d: 'palatal approximant', h: 'y', f: 'j'},
						{d: 'open front unrounded vowel', h: 'a', f: 'a'},
						{d: 'close-mid front unrounded vowel', h: 'e', f: 'e'},
						{d: 'close front unrounded vowel', h: 'i', f: 'i'},
						{d: 'close-mid back rounded vowel', h: 'o', f: 'o'},
						{d: 'close back rounded vowel', h: 'u', f: 'u'},
						{d: 'long open front unrounded vowel', h: 'á', f: 'aː'},
						{d: 'long close-mid front unrounded vowel', h: 'é', f: 'eː'},
						{d: 'long close front unrounded vowel', h: 'í', f: 'iː'},
						{d: 'long close-mid back rounded vowel', h: 'ó', f: 'oː'},
						{d: 'long close back rounded vowel', h: 'ú', f: 'uː'}
					])
			},
			aa: _List_fromArray(
				[
					{b: 'V', w: 'V'},
					{b: 'CV', w: 'CV'},
					{b: 'CVV', w: 'CVV'},
					{b: 'CVC', w: 'CVC'}
				])
		}
	},
	b: 'Quenya-inspired'
};
var $author$project$Main$availableTemplates = _List_fromArray(
	[$author$project$Main$quenyaTemplate, $author$project$Main$englishTemplate]);
var $elm$json$Json$Encode$bool = _Json_wrap;
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
var $author$project$Main$constraintTypeToDescription = F2(
	function (constraintType, sequence) {
		switch (constraintType) {
			case 0:
				return 'Illegal cluster: *' + sequence;
			case 1:
				return 'Not allowed in onset: ' + sequence;
			case 2:
				return 'Not allowed in coda: ' + sequence;
			case 3:
				return 'Not allowed word-initially: ' + sequence;
			default:
				return 'Not allowed word-finally: ' + sequence;
		}
	});
var $author$project$Main$Project = F5(
	function (id, name, created, lastModified, language) {
		return {_: created, o: id, c: language, ah: lastModified, b: name};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Main$Language = F5(
	function (name, phonology, morphology, lexicon, generatedWords) {
		return {B: generatedWords, e: lexicon, j: morphology, b: name, n: phonology};
	});
var $author$project$Main$Lexeme = F8(
	function (form, orthography, definition, pos, etymology, semanticLinks, categories, morphemes) {
		return {k: categories, I: definition, V: etymology, g: form, q: morphemes, r: orthography, A: pos, v: semanticLinks};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$Main$removeSyllableSeparators = function (word) {
	return A3($elm$core$String$replace, '.', '', word);
};
var $author$project$Main$SemanticLinks = F3(
	function (synonyms, antonyms, related) {
		return {H: antonyms, M: related, O: synonyms};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Main$semanticLinksDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$SemanticLinks,
	A2(
		$elm$json$Json$Decode$field,
		'synonyms',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'antonyms',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
	A2(
		$elm$json$Json$Decode$field,
		'related',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $author$project$Main$lexemeDecoder = A9(
	$elm$json$Json$Decode$map8,
	$author$project$Main$Lexeme,
	A2($elm$json$Json$Decode$field, 'form', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'orthography', $elm$json$Json$Decode$string),
				A2(
				$elm$json$Json$Decode$map,
				$author$project$Main$removeSyllableSeparators,
				A2($elm$json$Json$Decode$field, 'form', $elm$json$Json$Decode$string))
			])),
	A2($elm$json$Json$Decode$field, 'definition', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'pos', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'etymology', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'semanticLinks', $author$project$Main$semanticLinksDecoder),
				$elm$json$Json$Decode$succeed(
				{H: _List_Nil, M: _List_Nil, O: _List_Nil})
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'categories',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'morphemes',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$Main$Morphology = F4(
	function (features, morphemes, paradigms, morphophonemicRules) {
		return {p: features, q: morphemes, P: morphophonemicRules, y: paradigms};
	});
var $author$project$Main$GrammaticalFeature = F2(
	function (name, values) {
		return {b: name, R: values};
	});
var $author$project$Main$grammaticalFeatureDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$GrammaticalFeature,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2(
		$elm$json$Json$Decode$field,
		'values',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
var $elm$json$Json$Decode$map4 = _Json_map4;
var $author$project$Main$Morpheme = F5(
	function (form, gloss, morphemeType, feature, value) {
		return {C: feature, g: form, D: gloss, K: morphemeType, G: value};
	});
var $author$project$Main$Circumfix = 3;
var $author$project$Main$Infix = 2;
var $author$project$Main$Prefix = 0;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $author$project$Main$morphemeTypeDecoder = A2(
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
var $author$project$Main$morphemeDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Main$Morpheme,
	A2($elm$json$Json$Decode$field, 'form', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'gloss', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'morphemeType', $author$project$Main$morphemeTypeDecoder),
	A2($elm$json$Json$Decode$field, 'feature', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$string));
var $author$project$Main$MorphophonemicRule = F6(
	function (name, ruleType, context, target, replacement, description) {
		return {ar: context, d: description, b: name, aj: replacement, a2: ruleType, ab: target};
	});
var $elm$json$Json$Decode$map6 = _Json_map6;
var $author$project$Main$ConsonantGradation = 3;
var $author$project$Main$ruleTypeDecoder = A2(
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
var $author$project$Main$morphophonemicRuleDecoder = A7(
	$elm$json$Json$Decode$map6,
	$author$project$Main$MorphophonemicRule,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'ruleType', $author$project$Main$ruleTypeDecoder),
	A2($elm$json$Json$Decode$field, 'context', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'target', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'replacement', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string));
var $author$project$Main$Paradigm = F4(
	function (name, pos, baseForm, featureCombinations) {
		return {aA: baseForm, W: featureCombinations, b: name, A: pos};
	});
var $author$project$Main$FeatureCombination = F2(
	function (features, form) {
		return {p: features, g: form};
	});
var $author$project$Main$featureCombinationDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$FeatureCombination,
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
var $author$project$Main$paradigmDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$Paradigm,
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
		$elm$json$Json$Decode$list($author$project$Main$featureCombinationDecoder)));
var $author$project$Main$morphologyDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$Morphology,
	A2(
		$elm$json$Json$Decode$field,
		'features',
		$elm$json$Json$Decode$list($author$project$Main$grammaticalFeatureDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'morphemes',
		$elm$json$Json$Decode$list($author$project$Main$morphemeDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'paradigms',
		$elm$json$Json$Decode$list($author$project$Main$paradigmDecoder)),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'morphophonemicRules',
				$elm$json$Json$Decode$list($author$project$Main$morphophonemicRuleDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $author$project$Main$Phonology = F4(
	function (categories, patterns, constraints, orthography) {
		return {k: categories, U: constraints, r: orthography, aa: patterns};
	});
var $author$project$Main$PhonotacticConstraint = F3(
	function (constraintType, sequence, description) {
		return {x: constraintType, d: description, z: sequence};
	});
var $author$project$Main$NoWordInitial = 3;
var $author$project$Main$constraintTypeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (str) {
		switch (str) {
			case 'IllegalCluster':
				return $elm$json$Json$Decode$succeed(0);
			case 'OnsetRestriction':
				return $elm$json$Json$Decode$succeed(1);
			case 'CodaRestriction':
				return $elm$json$Json$Decode$succeed(2);
			case 'NoWordInitial':
				return $elm$json$Json$Decode$succeed(3);
			case 'NoWordFinal':
				return $elm$json$Json$Decode$succeed(4);
			default:
				return $elm$json$Json$Decode$fail('Unknown constraint type: ' + str);
		}
	},
	$elm$json$Json$Decode$string);
var $author$project$Main$constraintDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$PhonotacticConstraint,
	A2($elm$json$Json$Decode$field, 'constraintType', $author$project$Main$constraintTypeDecoder),
	A2($elm$json$Json$Decode$field, 'sequence', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string));
var $author$project$Main$Orthography = F2(
	function (graphemeMappings, displayMode) {
		return {aC: displayMode, S: graphemeMappings};
	});
var $author$project$Main$GraphemeMapping = F3(
	function (phoneme, grapheme, description) {
		return {d: description, h: grapheme, f: phoneme};
	});
var $author$project$Main$graphemeMappingDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$GraphemeMapping,
	A2($elm$json$Json$Decode$field, 'phoneme', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'grapheme', $elm$json$Json$Decode$string),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string),
				$elm$json$Json$Decode$succeed('')
			])));
var $author$project$Main$orthographyDisplayModeDecoder = A2(
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
var $author$project$Main$orthographyDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$Orthography,
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'graphemeMappings',
				$elm$json$Json$Decode$list($author$project$Main$graphemeMappingDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'displayMode', $author$project$Main$orthographyDisplayModeDecoder),
				$elm$json$Json$Decode$succeed(0)
			])));
var $author$project$Main$SoundCategory = F3(
	function (name, label, sounds) {
		return {J: label, b: name, u: sounds};
	});
var $author$project$Main$soundCategoryDecoder = A4(
	$elm$json$Json$Decode$map3,
	$author$project$Main$SoundCategory,
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
var $author$project$Main$SyllablePattern = F2(
	function (name, pattern) {
		return {b: name, w: pattern};
	});
var $author$project$Main$syllablePatternDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$Main$SyllablePattern,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'pattern', $elm$json$Json$Decode$string));
var $author$project$Main$phonologyDecoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$Phonology,
	A2(
		$elm$json$Json$Decode$field,
		'categories',
		$elm$json$Json$Decode$list($author$project$Main$soundCategoryDecoder)),
	A2(
		$elm$json$Json$Decode$field,
		'patterns',
		$elm$json$Json$Decode$list($author$project$Main$syllablePatternDecoder)),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'constraints',
				$elm$json$Json$Decode$list($author$project$Main$constraintDecoder)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'orthography', $author$project$Main$orthographyDecoder),
				$elm$json$Json$Decode$succeed(
				{aC: 0, S: _List_Nil})
			])));
var $author$project$Main$languageDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Main$Language,
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'phonology', $author$project$Main$phonologyDecoder),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'morphology', $author$project$Main$morphologyDecoder),
				$elm$json$Json$Decode$succeed(
				{p: _List_Nil, q: _List_Nil, P: _List_Nil, y: _List_Nil})
			])),
	A2(
		$elm$json$Json$Decode$field,
		'lexicon',
		$elm$json$Json$Decode$list($author$project$Main$lexemeDecoder)),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'generatedWords',
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(_List_Nil)
			])));
var $author$project$Main$projectDecoder = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Main$Project,
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
	A2($elm$json$Json$Decode$field, 'language', $author$project$Main$languageDecoder));
var $author$project$Main$decodeProject = $author$project$Main$projectDecoder;
var $author$project$Main$ProjectMetadata = F4(
	function (id, name, created, lastModified) {
		return {_: created, o: id, ah: lastModified, b: name};
	});
var $author$project$Main$decodeProjectMetadata = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$ProjectMetadata,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'created', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'lastModified', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$Main$LanguageTemplate = F5(
	function (id, name, description, language, isDefault) {
		return {d: description, o: id, aZ: isDefault, c: language, b: name};
	});
var $author$project$Main$decodeTemplate = A6(
	$elm$json$Json$Decode$map5,
	$author$project$Main$LanguageTemplate,
	A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'language', $author$project$Main$languageDecoder),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$field, 'isDefault', $elm$json$Json$Decode$bool),
				$elm$json$Json$Decode$succeed(false)
			])));
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Main$deleteProjectById = _Platform_outgoingPort('deleteProjectById', $elm$json$Json$Encode$int);
var $author$project$Main$deleteTemplateById = _Platform_outgoingPort('deleteTemplateById', $elm$json$Json$Encode$int);
var $author$project$Main$duplicateProjectById = _Platform_outgoingPort('duplicateProjectById', $elm$json$Json$Encode$int);
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
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
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$encodeSemanticLinks = function (links) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'synonyms',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, links.O)),
				_Utils_Tuple2(
				'antonyms',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, links.H)),
				_Utils_Tuple2(
				'related',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, links.M))
			]));
};
var $author$project$Main$encodeLexeme = function (lexeme) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'form',
				$elm$json$Json$Encode$string(lexeme.g)),
				_Utils_Tuple2(
				'orthography',
				$elm$json$Json$Encode$string(lexeme.r)),
				_Utils_Tuple2(
				'definition',
				$elm$json$Json$Encode$string(lexeme.I)),
				_Utils_Tuple2(
				'pos',
				$elm$json$Json$Encode$string(lexeme.A)),
				_Utils_Tuple2(
				'etymology',
				$elm$json$Json$Encode$string(lexeme.V)),
				_Utils_Tuple2(
				'semanticLinks',
				$author$project$Main$encodeSemanticLinks(lexeme.v)),
				_Utils_Tuple2(
				'categories',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, lexeme.k)),
				_Utils_Tuple2(
				'morphemes',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, lexeme.q))
			]));
};
var $author$project$Main$encodeGrammaticalFeature = function (feature) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(feature.b)),
				_Utils_Tuple2(
				'values',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, feature.R))
			]));
};
var $author$project$Main$encodeMorphemeType = function (morphemeType) {
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
var $author$project$Main$encodeMorpheme = function (morpheme) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'form',
				$elm$json$Json$Encode$string(morpheme.g)),
				_Utils_Tuple2(
				'gloss',
				$elm$json$Json$Encode$string(morpheme.D)),
				_Utils_Tuple2(
				'morphemeType',
				$author$project$Main$encodeMorphemeType(morpheme.K)),
				_Utils_Tuple2(
				'feature',
				$elm$json$Json$Encode$string(morpheme.C)),
				_Utils_Tuple2(
				'value',
				$elm$json$Json$Encode$string(morpheme.G))
			]));
};
var $author$project$Main$encodeRuleType = function (ruleType) {
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
var $author$project$Main$encodeMorphophonemicRule = function (rule) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(rule.b)),
				_Utils_Tuple2(
				'ruleType',
				$author$project$Main$encodeRuleType(rule.a2)),
				_Utils_Tuple2(
				'context',
				$elm$json$Json$Encode$string(rule.ar)),
				_Utils_Tuple2(
				'target',
				$elm$json$Json$Encode$string(rule.ab)),
				_Utils_Tuple2(
				'replacement',
				$elm$json$Json$Encode$string(rule.aj)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(rule.d))
			]));
};
var $author$project$Main$encodeFeatureCombination = function (combination) {
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
					combination.p)),
				_Utils_Tuple2(
				'form',
				$elm$json$Json$Encode$string(combination.g))
			]));
};
var $author$project$Main$encodeParadigm = function (paradigm) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(paradigm.b)),
				_Utils_Tuple2(
				'pos',
				$elm$json$Json$Encode$string(paradigm.A)),
				_Utils_Tuple2(
				'baseForm',
				$elm$json$Json$Encode$string(paradigm.aA)),
				_Utils_Tuple2(
				'featureCombinations',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeFeatureCombination, paradigm.W))
			]));
};
var $author$project$Main$encodeMorphology = function (morphology) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'features',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeGrammaticalFeature, morphology.p)),
				_Utils_Tuple2(
				'morphemes',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeMorpheme, morphology.q)),
				_Utils_Tuple2(
				'paradigms',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeParadigm, morphology.y)),
				_Utils_Tuple2(
				'morphophonemicRules',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeMorphophonemicRule, morphology.P))
			]));
};
var $author$project$Main$encodeConstraintType = function (constraintType) {
	return $elm$json$Json$Encode$string(
		function () {
			switch (constraintType) {
				case 0:
					return 'IllegalCluster';
				case 1:
					return 'OnsetRestriction';
				case 2:
					return 'CodaRestriction';
				case 3:
					return 'NoWordInitial';
				default:
					return 'NoWordFinal';
			}
		}());
};
var $author$project$Main$encodeConstraint = function (constraint) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'constraintType',
				$author$project$Main$encodeConstraintType(constraint.x)),
				_Utils_Tuple2(
				'sequence',
				$elm$json$Json$Encode$string(constraint.z)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(constraint.d))
			]));
};
var $author$project$Main$encodeGraphemeMapping = function (mapping) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'phoneme',
				$elm$json$Json$Encode$string(mapping.f)),
				_Utils_Tuple2(
				'grapheme',
				$elm$json$Json$Encode$string(mapping.h)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(mapping.d))
			]));
};
var $author$project$Main$encodeOrthographyDisplayMode = function (mode) {
	return $elm$json$Json$Encode$string(
		function () {
			if (!mode) {
				return 'DisplayIPA';
			} else {
				return 'DisplayOrthography';
			}
		}());
};
var $author$project$Main$encodeOrthography = function (orthography) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'graphemeMappings',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeGraphemeMapping, orthography.S)),
				_Utils_Tuple2(
				'displayMode',
				$author$project$Main$encodeOrthographyDisplayMode(orthography.aC))
			]));
};
var $author$project$Main$encodeSoundCategory = function (category) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(category.b)),
				_Utils_Tuple2(
				'label',
				$elm$json$Json$Encode$string(
					$elm$core$String$fromChar(category.J))),
				_Utils_Tuple2(
				'sounds',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, category.u))
			]));
};
var $author$project$Main$encodeSyllablePattern = function (pattern) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(pattern.b)),
				_Utils_Tuple2(
				'pattern',
				$elm$json$Json$Encode$string(pattern.w))
			]));
};
var $author$project$Main$encodePhonology = function (phonology) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'categories',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeSoundCategory, phonology.k)),
				_Utils_Tuple2(
				'patterns',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeSyllablePattern, phonology.aa)),
				_Utils_Tuple2(
				'constraints',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeConstraint, phonology.U)),
				_Utils_Tuple2(
				'orthography',
				$author$project$Main$encodeOrthography(phonology.r))
			]));
};
var $author$project$Main$encodeLanguage = function (language) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(language.b)),
				_Utils_Tuple2(
				'phonology',
				$author$project$Main$encodePhonology(language.n)),
				_Utils_Tuple2(
				'morphology',
				$author$project$Main$encodeMorphology(language.j)),
				_Utils_Tuple2(
				'lexicon',
				A2($elm$json$Json$Encode$list, $author$project$Main$encodeLexeme, language.e)),
				_Utils_Tuple2(
				'generatedWords',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$string, language.B))
			]));
};
var $author$project$Main$encodeProject = function (project) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(project.o)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(project.b)),
				_Utils_Tuple2(
				'created',
				$elm$json$Json$Encode$string(project._)),
				_Utils_Tuple2(
				'lastModified',
				$elm$json$Json$Encode$string(project.ah)),
				_Utils_Tuple2(
				'language',
				$author$project$Main$encodeLanguage(project.c))
			]));
};
var $author$project$Main$encodeExport = F2(
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
					$author$project$Main$encodeProject(project))
				]));
	});
var $author$project$Main$encodeTemplate = function (template) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(template.o)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(template.b)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(template.d)),
				_Utils_Tuple2(
				'isDefault',
				$elm$json$Json$Encode$bool(template.aZ)),
				_Utils_Tuple2(
				'language',
				$author$project$Main$encodeLanguage(template.c))
			]));
};
var $author$project$Main$exportCSV = _Platform_outgoingPort('exportCSV', $elm$json$Json$Encode$string);
var $author$project$Main$exportProject = _Platform_outgoingPort('exportProject', $elm$core$Basics$identity);
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
var $author$project$Main$generateFeatureCombinations = function (features) {
	if (!features.b) {
		return _List_fromArray(
			[_List_Nil]);
	} else {
		var first = features.a;
		var rest = features.b;
		var restCombinations = $author$project$Main$generateFeatureCombinations(rest);
		var firstValues = A2(
			$elm$core$List$map,
			function (v) {
				return _Utils_Tuple2(first.b, v);
			},
			first.R);
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
var $elm$core$String$trim = _String_trim;
var $author$project$Main$generateInflectedForm = F4(
	function (baseForm, features, morphemes, rules) {
		if ($elm$core$String$isEmpty(
			$elm$core$String$trim(baseForm))) {
			return '';
		} else {
			var matchingMorphemes = A2(
				$elm$core$List$sortBy,
				function (m) {
					var _v1 = m.K;
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
								return _Utils_eq(morpheme.C, featureName) && _Utils_eq(morpheme.G, featureValue);
							},
							features);
					},
					morphemes));
			var formWithMorphemes = A3($elm$core$List$foldl, $author$project$Main$applyMorpheme, baseForm, matchingMorphemes);
			var finalForm = A2($author$project$Main$applyMorphophonemicRules, rules, formWithMorphemes);
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
var $author$project$Main$addNgram = F2(
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
var $author$project$Main$extractNgrams = F2(
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
var $author$project$Main$buildNgramModel = F2(
	function (order, words) {
		var markedWords = A2(
			$elm$core$List$map,
			function (w) {
				return '^' + (w + '$');
			},
			words);
		return A3(
			$elm$core$List$foldl,
			$author$project$Main$addNgram,
			$elm$core$Dict$empty,
			A2(
				$elm$core$List$concatMap,
				$author$project$Main$extractNgrams(order),
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
var $elm$core$Bitwise$and = _Bitwise_and;
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
var $author$project$Main$randomFromList = function (list) {
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
var $author$project$Main$generateMarkovHelper = F4(
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
					return A4($author$project$Main$generateMarkovHelper, order, model, newPrefix, newGenerated);
				}
			},
			$author$project$Main$randomFromList(possibleNext))));
	});
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
var $author$project$Main$generateMarkovWord = F2(
	function (model, ngramModel) {
		var startPrefix = A2($elm$core$String$repeat, model.a$, '^');
		return A2(
			$elm$random$Random$map,
			A2($elm$core$String$replace, '$', ''),
			A2(
				$elm$random$Random$map,
				A2($elm$core$String$replace, '^', ''),
				A4($author$project$Main$generateMarkovHelper, model.a$, ngramModel, startPrefix, '')));
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
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
var $author$project$Main$combineGenerators = function (generators) {
	if (!generators.b) {
		return $elm$random$Random$constant('');
	} else {
		var first = generators.a;
		var rest = generators.b;
		return A3(
			$elm$random$Random$map2,
			$elm$core$Basics$append,
			first,
			$author$project$Main$combineGenerators(rest));
	}
};
var $author$project$Main$charToGenerator = F2(
	function (phonology, _char) {
		var maybeCategory = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (cat) {
					return _Utils_eq(cat.J, _char);
				},
				phonology.k));
		if (!maybeCategory.$) {
			var category = maybeCategory.a;
			return $author$project$Main$randomFromList(category.u);
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
var $author$project$Main$elementToGenerator = F2(
	function (phonology, element) {
		switch (element.$) {
			case 0:
				var _char = element.a;
				return A2($author$project$Main$charToGenerator, phonology, _char);
			case 1:
				var _char = element.a;
				return A2(
					$elm$random$Random$andThen,
					function (include) {
						return include ? A2($author$project$Main$charToGenerator, phonology, _char) : $elm$random$Random$constant('');
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
						$author$project$Main$charToGenerator(phonology),
						A2($elm$random$Random$uniform, first, rest));
				}
		}
	});
var $author$project$Main$Choice = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$Optional = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$Required = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $author$project$Main$extractUntilCloseParenHelper = F2(
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
var $author$project$Main$extractUntilCloseParen = function (chars) {
	return A2($author$project$Main$extractUntilCloseParenHelper, chars, _List_Nil);
};
var $author$project$Main$parsePatternHelper = F2(
	function (chars, acc) {
		parsePatternHelper:
		while (true) {
			if (!chars.b) {
				return $elm$core$List$reverse(acc);
			} else {
				if ('(' === chars.a) {
					var rest = chars.b;
					var _v1 = $author$project$Main$extractUntilCloseParen(rest);
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
							$author$project$Main$Choice(choices),
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
									$author$project$Main$Optional(_char),
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
						$author$project$Main$Required(_char),
						acc);
					chars = $temp$chars;
					acc = $temp$acc;
					continue parsePatternHelper;
				}
			}
		}
	});
var $author$project$Main$parsePattern = function (pattern) {
	return A2(
		$author$project$Main$parsePatternHelper,
		$elm$core$String$toList(pattern),
		_List_Nil);
};
var $author$project$Main$generateFromPattern = F2(
	function (pattern, phonology) {
		return $author$project$Main$combineGenerators(
			A2(
				$elm$core$List$map,
				$author$project$Main$elementToGenerator(phonology),
				$author$project$Main$parsePattern(pattern)));
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
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$Main$generateMultiSyllableWord = function (model) {
	var syllableCountGenerator = A2($elm$random$Random$int, model.aT, model.bC);
	var phonology = model.a.c.n;
	var patternsToUse = $elm$core$List$isEmpty(model.ax) ? _List_fromArray(
		['CV']) : A2($elm$core$List$map, $elm$core$String$toUpper, model.ax);
	var generateOneSyllable = function () {
		if (!patternsToUse.b) {
			return A2($author$project$Main$generateFromPattern, 'CV', phonology);
		} else {
			if (!patternsToUse.b.b) {
				var singlePattern = patternsToUse.a;
				return A2($author$project$Main$generateFromPattern, singlePattern, phonology);
			} else {
				var multiplePatterns = patternsToUse;
				return A2(
					$elm$random$Random$andThen,
					function (pattern) {
						return A2($author$project$Main$generateFromPattern, pattern, phonology);
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
				$elm$core$String$concat,
				A2($elm$random$Random$list, count, generateOneSyllable));
		},
		syllableCountGenerator);
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$String$indices = _String_indexes;
var $elm$core$String$toLower = _String_toLower;
var $author$project$Main$checkConstraint = F3(
	function (phonology, word, constraint) {
		var vowels = A2(
			$elm$core$List$concatMap,
			function ($) {
				return $.u;
			},
			A2(
				$elm$core$List$filter,
				function (cat) {
					return (cat.J === 'V') || ($elm$core$String$toLower(cat.b) === 'vowels');
				},
				phonology.k));
		var isVowel = function (s) {
			return A2($elm$core$List$member, s, vowels);
		};
		var chars = A2(
			$elm$core$List$map,
			$elm$core$String$fromChar,
			$elm$core$String$toList(word));
		var _v0 = constraint.x;
		switch (_v0) {
			case 0:
				return !A2($elm$core$String$contains, constraint.z, word);
			case 1:
				var startsWithSequence = A2($elm$core$String$startsWith, constraint.z, word);
				var appearsAfterVowel = A2(
					$elm$core$List$any,
					function (index) {
						if (index > 0) {
							var before = A3($elm$core$String$slice, index - 1, index, word);
							return isVowel(before);
						} else {
							return false;
						}
					},
					A2($elm$core$String$indices, constraint.z, word));
				return !(startsWithSequence || appearsAfterVowel);
			case 2:
				var endsWithSequence = A2($elm$core$String$endsWith, constraint.z, word);
				var appearsBeforeVowel = A2(
					$elm$core$List$any,
					function (index) {
						var afterIndex = index + $elm$core$String$length(constraint.z);
						if (_Utils_cmp(
							afterIndex,
							$elm$core$String$length(word)) < 0) {
							var after = A3($elm$core$String$slice, afterIndex, afterIndex + 1, word);
							return isVowel(after);
						} else {
							return false;
						}
					},
					A2($elm$core$String$indices, constraint.z, word));
				return !(endsWithSequence || appearsBeforeVowel);
			case 3:
				return !A2($elm$core$String$startsWith, constraint.z, word);
			default:
				return !A2($elm$core$String$endsWith, constraint.z, word);
		}
	});
var $author$project$Main$isValidWord = F3(
	function (phonology, constraints, word) {
		return A2(
			$elm$core$List$all,
			A2($author$project$Main$checkConstraint, phonology, word),
			constraints);
	});
var $author$project$Main$isVowelSound = function (phoneme) {
	var vowelPhonemes = _List_fromArray(
		['a', 'e', 'i', 'o', 'u', 'ɑ', 'ɛ', 'ɪ', 'ɔ', 'ʊ', 'ə', 'y', 'ø', 'œ', 'ɨ', 'ʉ', 'ɯ', 'ɘ', 'ɵ', 'ɤ', 'ɜ', 'ɞ', 'ʌ', 'æ', 'ɒ']);
	return A2($elm$core$List$member, phoneme, vowelPhonemes);
};
var $author$project$Main$syllabifyHelper = F3(
	function (remaining, acc, seenVowel) {
		syllabifyHelper:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(acc);
			} else {
				var c = remaining.a;
				var rest = remaining.b;
				var charStr = $elm$core$String$fromChar(c);
				var isVowel = $author$project$Main$isVowelSound(charStr);
				if (isVowel && seenVowel) {
					var $temp$remaining = rest,
						$temp$acc = A2(
						$elm$core$List$cons,
						c,
						A2($elm$core$List$cons, '.', acc)),
						$temp$seenVowel = true;
					remaining = $temp$remaining;
					acc = $temp$acc;
					seenVowel = $temp$seenVowel;
					continue syllabifyHelper;
				} else {
					var $temp$remaining = rest,
						$temp$acc = A2($elm$core$List$cons, c, acc),
						$temp$seenVowel = isVowel || seenVowel;
					remaining = $temp$remaining;
					acc = $temp$acc;
					seenVowel = $temp$seenVowel;
					continue syllabifyHelper;
				}
			}
		}
	});
var $author$project$Main$syllabifyIPA = function (word) {
	var chars = $elm$core$String$toList(word);
	var syllabifiedChars = A3($author$project$Main$syllabifyHelper, chars, _List_Nil, false);
	return $elm$core$String$fromList(syllabifiedChars);
};
var $author$project$Main$generateWordsTemplate = function (model) {
	var phonology = model.a.c.n;
	var candidateCount = $elm$core$List$isEmpty(phonology.U) ? model.al : (model.al * 5);
	return A2(
		$elm$random$Random$map,
		$elm$core$List$map($author$project$Main$syllabifyIPA),
		A2(
			$elm$random$Random$map,
			$elm$core$List$take(model.al),
			A2(
				$elm$random$Random$map,
				$elm$core$List$filter(
					A2($author$project$Main$isValidWord, phonology, phonology.U)),
				A2(
					$elm$random$Random$list,
					candidateCount,
					$author$project$Main$generateMultiSyllableWord(model)))));
};
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Main$isValidWordLength = F3(
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
var $author$project$Main$generateWordsMarkov = function (model) {
	var phonology = model.a.c.n;
	var lexicon = A2(
		$elm$core$List$map,
		$author$project$Main$removeSyllableSeparators,
		A2(
			$elm$core$List$map,
			function ($) {
				return $.g;
			},
			model.a.c.e));
	var ngramModel = A2($author$project$Main$buildNgramModel, model.a$, lexicon);
	var candidateCount = $elm$core$List$isEmpty(phonology.U) ? model.al : (model.al * 5);
	return $elm$core$Dict$isEmpty(ngramModel) ? $author$project$Main$generateWordsTemplate(model) : A2(
		$elm$random$Random$map,
		$elm$core$List$map($author$project$Main$syllabifyIPA),
		A2(
			$elm$random$Random$map,
			$elm$core$List$take(model.al),
			A2(
				$elm$random$Random$map,
				$elm$core$List$filter(
					A2($author$project$Main$isValidWordLength, model.a_, model.bM)),
				A2(
					$elm$random$Random$map,
					$elm$core$List$filter(
						A2($author$project$Main$isValidWord, phonology, phonology.U)),
					A2(
						$elm$random$Random$list,
						candidateCount,
						A2($author$project$Main$generateMarkovWord, model, ngramModel))))));
};
var $author$project$Main$generateWordsCmd = function (model) {
	var _v0 = model.aJ;
	if (!_v0) {
		return $author$project$Main$generateWordsTemplate(model);
	} else {
		return $author$project$Main$generateWordsMarkov(model);
	}
};
var $author$project$Main$getAt = F2(
	function (index, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, index, list));
	});
var $author$project$Main$isConsonantSound = function (phoneme) {
	var consonantPhonemes = _List_fromArray(
		['p', 'b', 't', 'd', 'k', 'g', 'm', 'n', 'ŋ', 'f', 'v', 'θ', 'ð', 's', 'z', 'ʃ', 'ʒ', 'h', 'l', 'r', 'j', 'ɾ', 'ɸ', 'β', 'tʃ', 'dʒ', 'ç', 'ʝ', 'x', 'ɣ', 'χ', 'ʁ', 'ħ', 'ʕ', 'ʔ', 'c', 'ɟ', 'q', 'ɢ', 'ɲ', 'ʎ', 'ʈ', 'ɽ', 'ʐ']);
	return A2($elm$core$List$member, phoneme, consonantPhonemes);
};
var $author$project$Main$isOtherSymbolSound = function (phoneme) {
	var otherSymbolPhonemes = _List_fromArray(
		['w', 'ʍ', 'ɥ', 'ɥ̊', 'ts', 'dz', 'tʃ', 'dʒ', 'tɕ', 'dʑ', 'tʂ', 'dʐ']);
	return A2($elm$core$List$member, phoneme, otherSymbolPhonemes);
};
var $author$project$Main$lexiconToCSV = function (lexicon) {
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
					escapeCSVField(lexeme.g),
					escapeCSVField(lexeme.I),
					escapeCSVField(lexeme.A),
					escapeCSVField(lexeme.V),
					escapeCSVField(
					A2($elm$core$String$join, ';', lexeme.k))
				]));
	};
	var rows = A2($elm$core$List$map, lexemeToRow, lexicon);
	return A2(
		$elm$core$String$join,
		'\n',
		A2($elm$core$List$cons, header, rows));
};
var $author$project$Main$loadAllProjects = _Platform_outgoingPort(
	'loadAllProjects',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$loadProjectById = _Platform_outgoingPort('loadProjectById', $elm$json$Json$Encode$int);
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$parseCSVToLexicon = function (csvData) {
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
							k: $elm$core$String$isEmpty(
								$elm$core$String$trim(categories)) ? _List_Nil : A2(
								$elm$core$List$filter,
								A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
								A2(
									$elm$core$List$map,
									$elm$core$String$trim,
									A2($elm$core$String$split, ';', categories))),
							I: $elm$core$String$trim(definition),
							V: $elm$core$String$trim(etymology),
							g: $elm$core$String$trim(word),
							q: _List_Nil,
							r: $author$project$Main$removeSyllableSeparators(
								$elm$core$String$trim(word)),
							A: $elm$core$String$trim(pos),
							v: {H: _List_Nil, M: _List_Nil, O: _List_Nil}
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
							k: _List_Nil,
							I: $elm$core$String$trim(definition),
							V: $elm$core$String$trim(etymology),
							g: $elm$core$String$trim(word),
							q: _List_Nil,
							r: $author$project$Main$removeSyllableSeparators(
								$elm$core$String$trim(word)),
							A: $elm$core$String$trim(pos),
							v: {H: _List_Nil, M: _List_Nil, O: _List_Nil}
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
						k: _List_Nil,
						I: $elm$core$String$trim(definition),
						V: '',
						g: $elm$core$String$trim(word),
						q: _List_Nil,
						r: $author$project$Main$removeSyllableSeparators(
							$elm$core$String$trim(word)),
						A: $elm$core$String$trim(pos),
						v: {H: _List_Nil, M: _List_Nil, O: _List_Nil}
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
					$elm$json$Json$Encode$string($.cb)),
					_Utils_Tuple2(
					'projectId',
					$elm$json$Json$Encode$int($.ci))
				]));
	});
var $author$project$Main$savePreference = _Platform_outgoingPort('savePreference', $elm$core$Basics$identity);
var $author$project$Main$saveTemplateToStorage = _Platform_outgoingPort('saveTemplateToStorage', $elm$core$Basics$identity);
var $author$project$Main$saveToStorage = _Platform_outgoingPort('saveToStorage', $elm$core$Basics$identity);
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
var $author$project$Main$updateProjectLanguage = F3(
	function (project, timestamp, language) {
		return {_: project._, o: project.o, c: language, ah: timestamp, b: project.b};
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
						{bl: input}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bH: input}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bk: input}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var label = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bu: label}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var language = model.a.c;
				var phonology = language.n;
				var categoryName = $elm$core$String$trim(model.bH);
				var label = A2(
					$elm$core$Maybe$withDefault,
					'X',
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						$elm$core$String$uncons(
							$elm$core$String$toUpper(
								A2($elm$core$String$left, 1, categoryName)))));
				var labelExists = A2(
					$elm$core$List$any,
					function (cat) {
						return _Utils_eq(cat.J, label);
					},
					phonology.k);
				var updatedPhonology = ($elm$core$String$isEmpty(categoryName) || labelExists) ? phonology : _Utils_update(
					phonology,
					{
						k: _Utils_ap(
							phonology.k,
							_List_fromArray(
								[
									{J: label, b: categoryName, u: _List_Nil}
								]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bH: '',
							a: updatedProject,
							bu: $elm$core$String$fromChar(label)
						}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 5:
				var label = msg.a;
				var language = model.a.c;
				var phonology = language.n;
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
						k: A2(
							$elm$core$List$filter,
							function (cat) {
								return !_Utils_eq(cat.J, categoryLabel);
							},
							phonology.k)
					});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 6:
				var newPhoneme = $elm$core$String$trim(model.bl);
				var language = model.a.c;
				var phonology = language.n;
				var categoryLabel = A2(
					$elm$core$Maybe$withDefault,
					'C',
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$first,
						$elm$core$String$uncons(model.bu)));
				var updatedCategories = A2(
					$elm$core$List$map,
					function (cat) {
						return _Utils_eq(cat.J, categoryLabel) ? (($elm$core$String$isEmpty(newPhoneme) || A2($elm$core$List$member, newPhoneme, cat.u)) ? cat : _Utils_update(
							cat,
							{
								u: _Utils_ap(
									cat.u,
									_List_fromArray(
										[newPhoneme]))
							})) : cat;
					},
					phonology.k);
				var updatedPhonology = _Utils_update(
					phonology,
					{k: updatedCategories});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bl: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 7:
				var categoryLabel = msg.a;
				var phoneme = msg.b;
				var language = model.a.c;
				var phonology = language.n;
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
						return _Utils_eq(cat.J, label) ? _Utils_update(
							cat,
							{
								u: A2(
									$elm$core$List$filter,
									function (p) {
										return !_Utils_eq(p, phoneme);
									},
									cat.u)
							}) : cat;
					},
					phonology.k);
				var updatedPhonology = _Utils_update(
					phonology,
					{k: updatedCategories});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 8:
				var patternStr = $elm$core$String$trim(model.bk);
				var language = model.a.c;
				var phonology = language.n;
				var patternExists = A2(
					$elm$core$List$any,
					function (p) {
						return _Utils_eq(p.w, patternStr);
					},
					phonology.aa);
				var updatedPhonology = ($elm$core$String$isEmpty(patternStr) || patternExists) ? phonology : _Utils_update(
					phonology,
					{
						aa: _Utils_ap(
							phonology.aa,
							_List_fromArray(
								[
									{b: patternStr, w: patternStr}
								]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bk: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 9:
				var pattern = msg.a;
				var language = model.a.c;
				var phonology = language.n;
				var updatedPhonology = _Utils_update(
					phonology,
					{
						aa: A2(
							$elm$core$List$filter,
							function (p) {
								return !_Utils_eq(p.w, pattern);
							},
							phonology.aa)
					});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 10:
				var pattern = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bQ: pattern}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var pattern = msg.a;
				var updatedPatterns = A2($elm$core$List$member, pattern, model.ax) ? A2(
					$elm$core$List$filter,
					function (p) {
						return !_Utils_eq(p, pattern);
					},
					model.ax) : A2($elm$core$List$cons, pattern, model.ax);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ax: updatedPatterns}),
					$elm$core$Platform$Cmd$none);
			case 12:
				var form = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ae: form}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var orthography = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{am: orthography}),
					$elm$core$Platform$Cmd$none);
			case 14:
				var definition = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ad: definition}),
					$elm$core$Platform$Cmd$none);
			case 15:
				var pos = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{an: pos}),
					$elm$core$Platform$Cmd$none);
			case 16:
				var etymology = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ak: etymology}),
					$elm$core$Platform$Cmd$none);
			case 29:
				var query = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bt: query}),
					$elm$core$Platform$Cmd$none);
			case 30:
				var pos = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bJ: pos}),
					$elm$core$Platform$Cmd$none);
			case 17:
				var newWord = {
					k: _List_Nil,
					I: $elm$core$String$trim(model.ad),
					V: $elm$core$String$trim(model.ak),
					g: $elm$core$String$trim(model.ae),
					q: _List_Nil,
					r: $elm$core$String$trim(model.am),
					A: model.an,
					v: {H: _List_Nil, M: _List_Nil, O: _List_Nil}
				};
				var language = model.a.c;
				var updatedLanguage = ($elm$core$String$isEmpty(newWord.g) || $elm$core$String$isEmpty(newWord.I)) ? language : _Utils_update(
					language,
					{
						e: _Utils_ap(
							language.e,
							_List_fromArray(
								[newWord]))
					});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject, bv: false, ad: '', ak: '', ae: '', am: '', an: 'noun'}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 18:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bv: true}),
					$elm$core$Platform$Cmd$none);
			case 19:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bv: false, ad: '', ak: '', ae: '', am: '', an: 'noun'}),
					$elm$core$Platform$Cmd$none);
			case 20:
				var index = msg.a;
				var maybeWord = A2($author$project$Main$getAt, index, model.a.c.e);
				if (!maybeWord.$) {
					var word = maybeWord.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								X: $elm$core$Maybe$Just(index),
								a4: true,
								ad: word.I,
								ak: word.V,
								ae: word.g,
								am: word.r,
								an: word.A
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 21:
				var _v2 = model.X;
				if (!_v2.$) {
					var index = _v2.a;
					var language = model.a.c;
					var updatedWord = {
						k: function () {
							var _v3 = A2($author$project$Main$getAt, index, language.e);
							if (!_v3.$) {
								var existingWord = _v3.a;
								return existingWord.k;
							} else {
								return _List_Nil;
							}
						}(),
						I: $elm$core$String$trim(model.ad),
						V: $elm$core$String$trim(model.ak),
						g: $elm$core$String$trim(model.ae),
						q: function () {
							var _v4 = A2($author$project$Main$getAt, index, language.e);
							if (!_v4.$) {
								var existingWord = _v4.a;
								return existingWord.q;
							} else {
								return _List_Nil;
							}
						}(),
						r: $elm$core$String$trim(model.am),
						A: model.an,
						v: function () {
							var _v5 = A2($author$project$Main$getAt, index, language.e);
							if (!_v5.$) {
								var existingWord = _v5.a;
								return existingWord.v;
							} else {
								return {H: _List_Nil, M: _List_Nil, O: _List_Nil};
							}
						}()
					};
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								return _Utils_eq(i, index) ? updatedWord : word;
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aH: '',
								X: $elm$core$Maybe$Nothing,
								a: updatedProject,
								Z: _List_Nil,
								aM: '',
								a4: false,
								aS: '',
								E: A2($elm$core$List$cons, model.a, model.E),
								ad: '',
								ak: '',
								ae: '',
								am: '',
								an: 'noun'
							}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 22:
				var index = msg.a;
				var language = model.a.c;
				var updatedLexicon = _Utils_ap(
					A2($elm$core$List$take, index, language.e),
					A2($elm$core$List$drop, index + 1, language.e));
				var updatedLanguage = _Utils_update(
					language,
					{e: updatedLexicon});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							Z: _List_Nil,
							E: A2($elm$core$List$cons, model.a, model.E)
						}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 23:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aH: '', X: $elm$core$Maybe$Nothing, aM: '', a4: false, aS: '', ad: '', ak: '', ae: '', am: '', an: 'noun'}),
					$elm$core$Platform$Cmd$none);
			case 24:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a4: false}),
					$elm$core$Platform$Cmd$none);
			case 25:
				var wordIndex = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bh: $elm$core$Maybe$Just(wordIndex),
							bx: true
						}),
					$elm$core$Platform$Cmd$none);
			case 26:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bh: $elm$core$Maybe$Nothing, bx: false}),
					$elm$core$Platform$Cmd$none);
			case 27:
				var wordIndex = msg.a;
				var morphemeIndex = msg.b;
				var language = model.a.c;
				var lexeme = A2($author$project$Main$getAt, wordIndex, language.e);
				var morphology = language.j;
				var morpheme = A2($author$project$Main$getAt, morphemeIndex, morphology.q);
				var _v6 = _Utils_Tuple2(lexeme, morpheme);
				if ((!_v6.a.$) && (!_v6.b.$)) {
					var lex = _v6.a.a;
					var morph = _v6.b.a;
					var ipaWithMorpheme = A2($author$project$Main$applyMorpheme, morph, lex.g);
					var inflectedIPA = A2($author$project$Main$applyMorphophonemicRules, morphology.P, ipaWithMorpheme);
					var formWithMorpheme = A2($author$project$Main$applyMorpheme, morph, lex.r);
					var inflectedForm = A2($author$project$Main$applyMorphophonemicRules, morphology.P, formWithMorpheme);
					var newLexeme = {
						k: lex.k,
						I: lex.I + (' + ' + morph.D),
						V: 'Derived from \'' + (lex.r + ('\' + ' + morph.g)),
						g: inflectedIPA,
						q: _Utils_ap(
							lex.q,
							_List_fromArray(
								[morph.D])),
						r: inflectedForm,
						A: lex.A,
						v: lex.v
					};
					var updatedLexicon = _Utils_ap(
						language.e,
						_List_fromArray(
							[newLexeme]));
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bh: $elm$core$Maybe$Nothing, a: updatedProject, bx: false}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 28:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 31:
				var pattern = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bQ: pattern}),
					$elm$core$Platform$Cmd$none);
			case 32:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$random$Random$generate,
						$author$project$Main$WordsGenerated,
						$author$project$Main$generateWordsCmd(model)));
			case 33:
				var words = msg.a;
				var language = model.a.c;
				var updatedLanguage = _Utils_update(
					language,
					{B: words});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{B: words, a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 34:
				var updatedProject = {_: model.a._, o: model.a.o, c: model.a.c, ah: model.i, b: model.a.b};
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 35:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bK: true}),
					$author$project$Main$getCurrentTime(0));
			case 36:
				return _Utils_Tuple2(
					model,
					$author$project$Main$triggerImport(0));
			case 37:
				var jsonStr = msg.a;
				var _v7 = A2($elm$json$Json$Decode$decodeString, $author$project$Main$projectDecoder, jsonStr);
				if (!_v7.$) {
					var project = _v7.a;
					var updatedProject = _Utils_update(
						project,
						{_: model.i, o: 0, ah: model.i});
					var updatedModel = _Utils_update(
						model,
						{be: $elm$core$Maybe$Nothing, a: updatedProject});
					return _Utils_Tuple2(
						updatedModel,
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					var error = _v7.a;
					var userFriendlyError = 'Failed to import project. The file may be corrupted or not a valid clctk export. ' + ('Technical details: ' + $elm$json$Json$Decode$errorToString(error));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								be: $elm$core$Maybe$Just(userFriendlyError)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 38:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{be: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 40:
				var timestamp = msg.a;
				return model.bK ? _Utils_Tuple2(
					_Utils_update(
						model,
						{i: timestamp, bK: false}),
					$author$project$Main$exportProject(
						A2($author$project$Main$encodeExport, timestamp, model.a))) : _Utils_Tuple2(
					_Utils_update(
						model,
						{i: timestamp}),
					$elm$core$Platform$Cmd$none);
			case 39:
				var value = msg.a;
				var _v8 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$projectDecoder, value);
				if (!_v8.$) {
					var project = _v8.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aB: project.o, B: project.c.B, a: project}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 41:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a8: input}),
					$elm$core$Platform$Cmd$none);
			case 42:
				var constraintType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{x: constraintType}),
					$elm$core$Platform$Cmd$none);
			case 43:
				var sequence = $elm$core$String$trim(model.a8);
				var language = model.a.c;
				var phonology = language.n;
				var description = A2($author$project$Main$constraintTypeToDescription, model.x, sequence);
				var newConstraint = {x: model.x, d: description, z: sequence};
				var constraintExists = A2(
					$elm$core$List$any,
					function (c) {
						return _Utils_eq(c.z, sequence) && _Utils_eq(c.x, model.x);
					},
					phonology.U);
				var updatedPhonology = ($elm$core$String$isEmpty(sequence) || constraintExists) ? phonology : _Utils_update(
					phonology,
					{
						U: _Utils_ap(
							phonology.U,
							_List_fromArray(
								[newConstraint]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a8: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 44:
				var constraint = msg.a;
				var language = model.a.c;
				var phonology = language.n;
				var updatedPhonology = _Utils_update(
					phonology,
					{
						U: A2(
							$elm$core$List$filter,
							function (c) {
								return !(_Utils_eq(c.z, constraint.z) && _Utils_eq(c.x, constraint.x));
							},
							phonology.U)
					});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 45:
				var tab = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aV: tab}),
					$elm$core$Platform$Cmd$none);
			case 46:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ba: input}),
					$elm$core$Platform$Cmd$none);
			case 47:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bb: input}),
					$elm$core$Platform$Cmd$none);
			case 48:
				var language = model.a.c;
				var morphology = language.j;
				var featureName = $elm$core$String$trim(model.ba);
				var featureExists = A2(
					$elm$core$List$any,
					function (f) {
						return _Utils_eq(f.b, featureName);
					},
					morphology.p);
				var updatedMorphology = ($elm$core$String$isEmpty(featureName) || featureExists) ? morphology : _Utils_update(
					morphology,
					{
						p: _Utils_ap(
							morphology.p,
							_List_fromArray(
								[
									{b: featureName, R: _List_Nil}
								]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ba: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 49:
				var featureName = msg.a;
				var value = $elm$core$String$trim(model.bb);
				var language = model.a.c;
				var morphology = language.j;
				var updatedFeatures = A2(
					$elm$core$List$map,
					function (feature) {
						return (_Utils_eq(feature.b, featureName) && ((!$elm$core$String$isEmpty(value)) && (!A2($elm$core$List$member, value, feature.R)))) ? _Utils_update(
							feature,
							{
								R: _Utils_ap(
									feature.R,
									_List_fromArray(
										[value]))
							}) : feature;
					},
					morphology.p);
				var updatedMorphology = _Utils_update(
					morphology,
					{p: updatedFeatures});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bb: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 50:
				var featureName = msg.a;
				var language = model.a.c;
				var morphology = language.j;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						p: A2(
							$elm$core$List$filter,
							function (f) {
								return !_Utils_eq(f.b, featureName);
							},
							morphology.p)
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 51:
				var featureName = msg.a;
				var value = msg.b;
				var language = model.a.c;
				var morphology = language.j;
				var updatedFeatures = A2(
					$elm$core$List$map,
					function (feature) {
						return _Utils_eq(feature.b, featureName) ? _Utils_update(
							feature,
							{
								R: A2(
									$elm$core$List$filter,
									function (v) {
										return !_Utils_eq(v, value);
									},
									feature.R)
							}) : feature;
					},
					morphology.p);
				var updatedMorphology = _Utils_update(
					morphology,
					{p: updatedFeatures});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 52:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{as: input}),
					$elm$core$Platform$Cmd$none);
			case 53:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{at: input}),
					$elm$core$Platform$Cmd$none);
			case 54:
				var morphemeType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aE: morphemeType}),
					$elm$core$Platform$Cmd$none);
			case 55:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ai: input}),
					$elm$core$Platform$Cmd$none);
			case 56:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{au: input}),
					$elm$core$Platform$Cmd$none);
			case 57:
				var value = $elm$core$String$trim(model.au);
				var language = model.a.c;
				var morphology = language.j;
				var gloss = $elm$core$String$trim(model.at);
				var form = $elm$core$String$trim(model.as);
				var feature = $elm$core$String$trim(model.ai);
				var newMorpheme = {C: feature, g: form, D: gloss, K: model.aE, G: value};
				var updatedMorphology = ($elm$core$String$isEmpty(form) || $elm$core$String$isEmpty(gloss)) ? morphology : _Utils_update(
					morphology,
					{
						q: _Utils_ap(
							morphology.q,
							_List_fromArray(
								[newMorpheme]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ai: '', as: '', at: '', au: '', a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 58:
				var morpheme = msg.a;
				var language = model.a.c;
				var morphology = language.j;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						q: A2(
							$elm$core$List$filter,
							function (m) {
								return !(_Utils_eq(m.g, morpheme.g) && _Utils_eq(m.D, morpheme.D));
							},
							morphology.q)
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 59:
				var index = msg.a;
				var morpheme = A2($author$project$Main$getAt, index, model.a.c.j.q);
				if (!morpheme.$) {
					var m = morpheme.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aW: $elm$core$Maybe$Just(index),
								ai: m.C,
								as: m.g,
								at: m.D,
								aE: m.K,
								au: m.G
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 60:
				var _v10 = model.aW;
				if (!_v10.$) {
					var index = _v10.a;
					var value = $elm$core$String$trim(model.au);
					var language = model.a.c;
					var morphology = language.j;
					var gloss = $elm$core$String$trim(model.at);
					var form = $elm$core$String$trim(model.as);
					var feature = $elm$core$String$trim(model.ai);
					var updatedMorpheme = {C: feature, g: form, D: gloss, K: model.aE, G: value};
					var updatedMorphemes = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, m) {
								return _Utils_eq(i, index) ? updatedMorpheme : m;
							}),
						morphology.q);
					var updatedMorphology = ($elm$core$String$isEmpty(form) || $elm$core$String$isEmpty(gloss)) ? morphology : _Utils_update(
						morphology,
						{q: updatedMorphemes});
					var updatedLanguage = _Utils_update(
						language,
						{j: updatedMorphology});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aW: $elm$core$Maybe$Nothing, ai: '', as: '', at: '', aE: 1, au: '', a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 61:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aW: $elm$core$Maybe$Nothing, ai: '', as: '', at: '', aE: 1, au: ''}),
					$elm$core$Platform$Cmd$none);
			case 62:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bi: input}),
					$elm$core$Platform$Cmd$none);
			case 63:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bj: input}),
					$elm$core$Platform$Cmd$none);
			case 64:
				var featureName = msg.a;
				var newSelected = A2($elm$core$List$member, featureName, model.ap) ? A2(
					$elm$core$List$filter,
					function (f) {
						return !_Utils_eq(f, featureName);
					},
					model.ap) : _Utils_ap(
					model.ap,
					_List_fromArray(
						[featureName]));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ap: newSelected}),
					$elm$core$Platform$Cmd$none);
			case 65:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bf: input}),
					$elm$core$Platform$Cmd$none);
			case 66:
				var pos = $elm$core$String$trim(model.bj);
				var paradigmName = $elm$core$String$trim(model.bi);
				var language = model.a.c;
				var morphology = language.j;
				var selectedFeatureObjects = A2(
					$elm$core$List$filterMap,
					function (fname) {
						return $elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (f) {
									return _Utils_eq(f.b, fname);
								},
								morphology.p));
					},
					model.ap);
				var combinations = $author$project$Main$generateFeatureCombinations(selectedFeatureObjects);
				var base = $elm$core$String$trim(model.bf);
				var newParadigm = {
					aA: base,
					W: A2(
						$elm$core$List$map,
						function (combo) {
							return {p: combo, g: ''};
						},
						combinations),
					b: paradigmName,
					A: pos
				};
				var updatedMorphology = ($elm$core$String$isEmpty(paradigmName) || ($elm$core$String$isEmpty(pos) || $elm$core$List$isEmpty(combinations))) ? morphology : _Utils_update(
					morphology,
					{
						y: _Utils_ap(
							morphology.y,
							_List_fromArray(
								[newParadigm]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bf: '', bi: '', bj: '', a: updatedProject, ap: _List_Nil}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 67:
				var paradigmName = msg.a;
				var language = model.a.c;
				var morphology = language.j;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						y: A2(
							$elm$core$List$filter,
							function (p) {
								return !_Utils_eq(p.b, paradigmName);
							},
							morphology.y)
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 68:
				var paradigmName = msg.a;
				var newForm = msg.b;
				var featureCombination = msg.c;
				var language = model.a.c;
				var morphology = language.j;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.b, paradigmName) ? _Utils_update(
							paradigm,
							{
								W: A2(
									$elm$core$List$map,
									function (combo) {
										return _Utils_eq(combo.p, featureCombination) ? _Utils_update(
											combo,
											{g: newForm}) : combo;
									},
									paradigm.W)
							}) : paradigm;
					},
					morphology.y);
				var updatedMorphology = _Utils_update(
					morphology,
					{y: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 69:
				var paradigmName = msg.a;
				var newBaseForm = msg.b;
				var language = model.a.c;
				var morphology = language.j;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.b, paradigmName) ? _Utils_update(
							paradigm,
							{aA: newBaseForm}) : paradigm;
					},
					morphology.y);
				var updatedMorphology = _Utils_update(
					morphology,
					{y: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 70:
				var paradigmName = msg.a;
				var language = model.a.c;
				var morphology = language.j;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.b, paradigmName) ? _Utils_update(
							paradigm,
							{
								W: A2(
									$elm$core$List$map,
									function (combo) {
										return _Utils_update(
											combo,
											{
												g: A4($author$project$Main$generateInflectedForm, paradigm.aA, combo.p, morphology.q, morphology.P)
											});
									},
									paradigm.W)
							}) : paradigm;
					},
					morphology.y);
				var updatedMorphology = _Utils_update(
					morphology,
					{y: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 71:
				var paradigmName = msg.a;
				var language = model.a.c;
				var morphology = language.j;
				var maybeDuplicate = A2(
					$elm$core$Maybe$map,
					function (original) {
						var baseName = A2($elm$core$String$endsWith, ' (Copy)', original.b) ? A2($elm$core$String$dropRight, 7, original.b) : original.b;
						var existingCopies = $elm$core$List$length(
							A2(
								$elm$core$List$filter,
								function (p) {
									return A2($elm$core$String$startsWith, baseName, p.b);
								},
								morphology.y));
						var newName = (existingCopies === 1) ? (baseName + ' (Copy)') : (baseName + (' (Copy ' + ($elm$core$String$fromInt(existingCopies) + ')')));
						return _Utils_update(
							original,
							{
								W: A2(
									$elm$core$List$map,
									function (fc) {
										return _Utils_update(
											fc,
											{g: ''});
									},
									original.W),
								b: newName
							});
					},
					$elm$core$List$head(
						A2(
							$elm$core$List$filter,
							function (p) {
								return _Utils_eq(p.b, paradigmName);
							},
							morphology.y)));
				var updatedMorphology = function () {
					if (!maybeDuplicate.$) {
						var duplicate = maybeDuplicate.a;
						return _Utils_update(
							morphology,
							{
								y: _Utils_ap(
									morphology.y,
									_List_fromArray(
										[duplicate]))
							});
					} else {
						return morphology;
					}
				}();
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 72:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bq: input}),
					$elm$core$Platform$Cmd$none);
			case 73:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bo: input}),
					$elm$core$Platform$Cmd$none);
			case 74:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bs: input}),
					$elm$core$Platform$Cmd$none);
			case 75:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{br: input}),
					$elm$core$Platform$Cmd$none);
			case 76:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bp: input}),
					$elm$core$Platform$Cmd$none);
			case 77:
				var ruleType = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aO: ruleType}),
					$elm$core$Platform$Cmd$none);
			case 78:
				var target = $elm$core$String$trim(model.bs);
				var replacement = $elm$core$String$trim(model.br);
				var name = $elm$core$String$trim(model.bq);
				var language = model.a.c;
				var morphology = language.j;
				var description = $elm$core$String$trim(model.bp);
				var context = $elm$core$String$trim(model.bo);
				var newRule = {ar: context, d: description, b: name, aj: replacement, a2: model.aO, ab: target};
				var updatedMorphology = ($elm$core$String$isEmpty(name) || ($elm$core$String$isEmpty(target) || $elm$core$String$isEmpty(replacement))) ? morphology : _Utils_update(
					morphology,
					{
						P: _Utils_ap(
							morphology.P,
							_List_fromArray(
								[newRule]))
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject, bo: '', bp: '', bq: '', br: '', bs: ''}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 79:
				var rule = msg.a;
				var language = model.a.c;
				var morphology = language.j;
				var updatedMorphology = _Utils_update(
					morphology,
					{
						P: A2(
							$elm$core$List$filter,
							function (r) {
								return !(_Utils_eq(r.b, rule.b) && _Utils_eq(r.ab, rule.ab));
							},
							morphology.P)
					});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 80:
				var paradigmName = msg.a;
				var language = model.a.c;
				var morphology = language.j;
				var rules = morphology.P;
				var updatedParadigms = A2(
					$elm$core$List$map,
					function (paradigm) {
						return _Utils_eq(paradigm.b, paradigmName) ? _Utils_update(
							paradigm,
							{
								W: A2(
									$elm$core$List$map,
									function (combo) {
										return _Utils_update(
											combo,
											{
												g: A2($author$project$Main$applyMorphophonemicRules, rules, combo.g)
											});
									},
									paradigm.W)
							}) : paradigm;
					},
					morphology.y);
				var updatedMorphology = _Utils_update(
					morphology,
					{y: updatedParadigms});
				var updatedLanguage = _Utils_update(
					language,
					{j: updatedMorphology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
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
						{aH: input}),
					$elm$core$Platform$Cmd$none);
			case 83:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aM: input}),
					$elm$core$Platform$Cmd$none);
			case 84:
				var _v12 = model.X;
				if (!_v12.$) {
					var index = _v12.a;
					var synonym = $elm$core$String$trim(model.aS);
					var language = model.a.c;
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								if (_Utils_eq(i, index) && (!$elm$core$String$isEmpty(synonym))) {
									var links = word.v;
									var updatedLinks = _Utils_update(
										links,
										{
											O: _Utils_ap(
												links.O,
												_List_fromArray(
													[synonym]))
										});
									return _Utils_update(
										word,
										{v: updatedLinks});
								} else {
									return word;
								}
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject, aS: ''}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 85:
				var _v13 = model.X;
				if (!_v13.$) {
					var index = _v13.a;
					var language = model.a.c;
					var antonym = $elm$core$String$trim(model.aH);
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								if (_Utils_eq(i, index) && (!$elm$core$String$isEmpty(antonym))) {
									var links = word.v;
									var updatedLinks = _Utils_update(
										links,
										{
											H: _Utils_ap(
												links.H,
												_List_fromArray(
													[antonym]))
										});
									return _Utils_update(
										word,
										{v: updatedLinks});
								} else {
									return word;
								}
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aH: '', a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 86:
				var _v14 = model.X;
				if (!_v14.$) {
					var index = _v14.a;
					var related = $elm$core$String$trim(model.aM);
					var language = model.a.c;
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								if (_Utils_eq(i, index) && (!$elm$core$String$isEmpty(related))) {
									var links = word.v;
									var updatedLinks = _Utils_update(
										links,
										{
											M: _Utils_ap(
												links.M,
												_List_fromArray(
													[related]))
										});
									return _Utils_update(
										word,
										{v: updatedLinks});
								} else {
									return word;
								}
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject, aM: ''}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 87:
				var synonym = msg.a;
				var _v15 = model.X;
				if (!_v15.$) {
					var index = _v15.a;
					var language = model.a.c;
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								if (_Utils_eq(i, index)) {
									var links = word.v;
									var updatedLinks = _Utils_update(
										links,
										{
											O: A2(
												$elm$core$List$filter,
												function (s) {
													return !_Utils_eq(s, synonym);
												},
												links.O)
										});
									return _Utils_update(
										word,
										{v: updatedLinks});
								} else {
									return word;
								}
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 88:
				var antonym = msg.a;
				var _v16 = model.X;
				if (!_v16.$) {
					var index = _v16.a;
					var language = model.a.c;
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								if (_Utils_eq(i, index)) {
									var links = word.v;
									var updatedLinks = _Utils_update(
										links,
										{
											H: A2(
												$elm$core$List$filter,
												function (a) {
													return !_Utils_eq(a, antonym);
												},
												links.H)
										});
									return _Utils_update(
										word,
										{v: updatedLinks});
								} else {
									return word;
								}
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 89:
				var related = msg.a;
				var _v17 = model.X;
				if (!_v17.$) {
					var index = _v17.a;
					var language = model.a.c;
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								if (_Utils_eq(i, index)) {
									var links = word.v;
									var updatedLinks = _Utils_update(
										links,
										{
											M: A2(
												$elm$core$List$filter,
												function (r) {
													return !_Utils_eq(r, related);
												},
												links.M)
										});
									return _Utils_update(
										word,
										{v: updatedLinks});
								} else {
									return word;
								}
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 90:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bg: input}),
					$elm$core$Platform$Cmd$none);
			case 91:
				var _v18 = model.X;
				if (!_v18.$) {
					var index = _v18.a;
					var trimmedCategory = $elm$core$String$trim(model.bg);
					if ($elm$core$String$isEmpty(trimmedCategory)) {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						var language = model.a.c;
						var updatedLexicon = A2(
							$elm$core$List$indexedMap,
							F2(
								function (i, word) {
									return _Utils_eq(i, index) ? (A2($elm$core$List$member, trimmedCategory, word.k) ? word : _Utils_update(
										word,
										{
											k: _Utils_ap(
												word.k,
												_List_fromArray(
													[trimmedCategory]))
										})) : word;
								}),
							language.e);
						var updatedLanguage = _Utils_update(
							language,
							{e: updatedLexicon});
						var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{bg: '', a: updatedProject}),
							$author$project$Main$saveToStorage(
								$author$project$Main$encodeProject(updatedProject)));
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 92:
				var category = msg.a;
				var _v19 = model.X;
				if (!_v19.$) {
					var index = _v19.a;
					var language = model.a.c;
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								return _Utils_eq(i, index) ? _Utils_update(
									word,
									{
										k: A2(
											$elm$core$List$filter,
											function (c) {
												return !_Utils_eq(c, category);
											},
											word.k)
									}) : word;
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 93:
				var category = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bI: category}),
					$elm$core$Platform$Cmd$none);
			case 94:
				var index = msg.a;
				var updatedSelection = A2($elm$core$List$member, index, model.F) ? A2(
					$elm$core$List$filter,
					function (i) {
						return !_Utils_eq(i, index);
					},
					model.F) : _Utils_ap(
					model.F,
					_List_fromArray(
						[index]));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{F: updatedSelection}),
					$elm$core$Platform$Cmd$none);
			case 95:
				var allIndices = A2(
					$elm$core$List$range,
					0,
					$elm$core$List$length(model.a.c.e) - 1);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{F: allIndices}),
					$elm$core$Platform$Cmd$none);
			case 96:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{F: _List_Nil}),
					$elm$core$Platform$Cmd$none);
			case 97:
				return $elm$core$List$isEmpty(model.F) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{bw: true}),
					$elm$core$Platform$Cmd$none);
			case 156:
				var sortedIndices = A2(
					$elm$core$List$sortBy,
					function (i) {
						return -i;
					},
					model.F);
				var language = model.a.c;
				var updatedLexicon = A3(
					$elm$core$List$foldl,
					F2(
						function (indexToRemove, lex) {
							return _Utils_ap(
								A2($elm$core$List$take, indexToRemove, lex),
								A2($elm$core$List$drop, indexToRemove + 1, lex));
						}),
					language.e,
					sortedIndices);
				var updatedLanguage = _Utils_update(
					language,
					{e: updatedLexicon});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							Z: _List_Nil,
							F: _List_Nil,
							bw: false,
							E: A2($elm$core$List$cons, model.a, model.E)
						}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 157:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bw: false}),
					$elm$core$Platform$Cmd$none);
			case 98:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bG: input}),
					$elm$core$Platform$Cmd$none);
			case 99:
				var language = model.a.c;
				var updatedLexicon = A2(
					$elm$core$List$indexedMap,
					F2(
						function (i, word) {
							return A2($elm$core$List$member, i, model.F) ? _Utils_update(
								word,
								{A: model.bG}) : word;
						}),
					language.e);
				var updatedLanguage = _Utils_update(
					language,
					{e: updatedLexicon});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							Z: _List_Nil,
							F: _List_Nil,
							E: A2($elm$core$List$cons, model.a, model.E)
						}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 100:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a6: input}),
					$elm$core$Platform$Cmd$none);
			case 101:
				var trimmedCategory = $elm$core$String$trim(model.a6);
				if ($elm$core$String$isEmpty(trimmedCategory)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var language = model.a.c;
					var updatedLexicon = A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, word) {
								return A2($elm$core$List$member, i, model.F) ? (A2($elm$core$List$member, trimmedCategory, word.k) ? word : _Utils_update(
									word,
									{
										k: _Utils_ap(
											word.k,
											_List_fromArray(
												[trimmedCategory]))
									})) : word;
							}),
						language.e);
					var updatedLanguage = _Utils_update(
						language,
						{e: updatedLexicon});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a6: '',
								a: updatedProject,
								Z: _List_Nil,
								F: _List_Nil,
								E: A2($elm$core$List$cons, model.a, model.E)
							}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				}
			case 102:
				var language = model.a.c;
				var selectedLexemes = A2(
					$elm$core$List$filterMap,
					function (i) {
						return A2($author$project$Main$getAt, i, language.e);
					},
					model.F);
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
							$elm$json$Json$Encode$string(model.i)),
							_Utils_Tuple2(
							'language_name',
							$elm$json$Json$Encode$string(language.b)),
							_Utils_Tuple2(
							'lexicon',
							A2($elm$json$Json$Encode$list, $author$project$Main$encodeLexeme, selectedLexemes))
						]));
				return _Utils_Tuple2(
					model,
					$author$project$Main$exportProject(exportData));
			case 103:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aq: !model.aq}),
					(!model.aq) ? $author$project$Main$loadAllProjects(0) : $elm$core$Platform$Cmd$none);
			case 106:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aF: input}),
					$elm$core$Platform$Cmd$none);
			case 104:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aF: '', by: true}),
					$elm$core$Platform$Cmd$none);
			case 105:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aF: '', by: false}),
					$elm$core$Platform$Cmd$none);
			case 107:
				if ($elm$core$String$isEmpty(
					$elm$core$String$trim(model.aF))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var newProject = {
						_: model.i,
						o: 0,
						c: {
							B: _List_Nil,
							e: _List_Nil,
							j: {p: _List_Nil, q: _List_Nil, P: _List_Nil, y: _List_Nil},
							b: 'Proto-Language',
							n: {
								k: _List_fromArray(
									[
										{
										J: 'C',
										b: 'Consonants',
										u: _List_fromArray(
											['p', 't', 'k', 'm', 'n', 's', 'l', 'r'])
									},
										{
										J: 'V',
										b: 'Vowels',
										u: _List_fromArray(
											['a', 'e', 'i', 'o', 'u'])
									}
									]),
								U: _List_Nil,
								r: {aC: 0, S: _List_Nil},
								aa: _List_fromArray(
									[
										{b: 'CV', w: 'CV'},
										{b: 'CVC', w: 'CVC'}
									])
							}
						},
						ah: model.i,
						b: model.aF
					};
					var updatedModel = _Utils_update(
						model,
						{aF: '', a: newProject, by: false, aq: false});
					return _Utils_Tuple2(
						updatedModel,
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(newProject)));
				}
			case 108:
				var templateName = msg.a;
				var allTemplates = _Utils_ap($author$project$Main$availableTemplates, model.bD);
				var maybeTemplate = $elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (t) {
							return _Utils_eq(t.b, templateName);
						},
						allTemplates));
				if (!maybeTemplate.$) {
					var template = maybeTemplate.a;
					var newProject = {_: model.i, o: 0, c: template.c, ah: model.i, b: template.b + ' Project'};
					var updatedModel = _Utils_update(
						model,
						{a: newProject, aq: false});
					return _Utils_Tuple2(
						updatedModel,
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(newProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 109:
				if ($elm$core$String$isEmpty(
					$elm$core$String$trim(model.aP))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var newTemplate = {d: model.a3, o: 0, aZ: false, c: model.a.c, b: model.aP};
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a3: '', aP: '', bz: false}),
						$author$project$Main$saveTemplateToStorage(
							$author$project$Main$encodeTemplate(newTemplate)));
				}
			case 110:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bz: true}),
					$elm$core$Platform$Cmd$none);
			case 111:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a3: '', aP: '', bz: false}),
					$elm$core$Platform$Cmd$none);
			case 112:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aP: input}),
					$elm$core$Platform$Cmd$none);
			case 113:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a3: input}),
					$elm$core$Platform$Cmd$none);
			case 114:
				var templateId = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$deleteTemplateById(templateId));
			case 115:
				var newShowDefault = !model.aQ;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aQ: newShowDefault}),
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
			case 116:
				var newShowTemplates = !model.aG;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aG: newShowTemplates}),
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
			case 117:
				var value = msg.a;
				var _v21 = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list($author$project$Main$decodeTemplate),
					value);
				if (!_v21.$) {
					var templates = _v21.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bD: templates}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 118:
				var value = msg.a;
				var showTemplatesSection = A2(
					$elm$core$Result$withDefault,
					model.aG,
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'showTemplatesSection', $elm$json$Json$Decode$bool),
						value));
				var showDefaultTemplates = A2(
					$elm$core$Result$withDefault,
					model.aQ,
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'showDefaultTemplates', $elm$json$Json$Decode$bool),
						value));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aQ: showDefaultTemplates, aG: showTemplatesSection}),
					$elm$core$Platform$Cmd$none);
			case 119:
				var projectId = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$loadProjectById(projectId));
			case 120:
				var projectId = msg.a;
				return _Utils_eq(projectId, model.aB) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a7: $elm$core$Maybe$Just(projectId)
						}),
					$elm$core$Platform$Cmd$none);
			case 154:
				var projectId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a7: $elm$core$Maybe$Nothing}),
					$author$project$Main$deleteProjectById(projectId));
			case 155:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a7: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 121:
				var projectId = msg.a;
				var currentName = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aN: currentName,
							bn: $elm$core$Maybe$Just(projectId)
						}),
					$elm$core$Platform$Cmd$none);
			case 122:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aN: input}),
					$elm$core$Platform$Cmd$none);
			case 123:
				var projectId = msg.a;
				var trimmedName = $elm$core$String$trim(model.aN);
				return $elm$core$String$isEmpty(trimmedName) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{aN: '', bn: $elm$core$Maybe$Nothing}),
					$author$project$Main$renameProjectById(
						{cb: trimmedName, ci: projectId}));
			case 124:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aN: '', bn: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 125:
				var projectId = msg.a;
				var newName = msg.b;
				if ($elm$core$String$isEmpty(
					$elm$core$String$trim(newName))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (_Utils_eq(projectId, model.aB)) {
						var updatedProject = {_: model.a._, o: model.a.o, c: model.a.c, ah: model.i, b: newName};
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{a: updatedProject}),
							$author$project$Main$saveToStorage(
								$author$project$Main$encodeProject(updatedProject)));
					} else {
						return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					}
				}
			case 126:
				var projectId = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$duplicateProjectById(projectId));
			case 127:
				var value = msg.a;
				var _v22 = A2(
					$elm$json$Json$Decode$decodeValue,
					$elm$json$Json$Decode$list($author$project$Main$decodeProjectMetadata),
					value);
				if (!_v22.$) {
					var projectList = _v22.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aL: projectList}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 128:
				var value = msg.a;
				var _v23 = A2($elm$json$Json$Decode$decodeValue, $author$project$Main$decodeProject, value);
				if (!_v23.$) {
					var project = _v23.a;
					var _v24 = model.bm;
					if (!_v24.$) {
						var refId = _v24.a;
						return _Utils_eq(project.o, refId) ? _Utils_Tuple2(
							_Utils_update(
								model,
								{
									bN: $elm$core$Maybe$Just(project)
								}),
							$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
							_Utils_update(
								model,
								{aB: project.o, B: project.c.B, a: project, Z: _List_Nil, aq: false, E: _List_Nil}),
							$elm$core$Platform$Cmd$none);
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{aB: project.o, B: project.c.B, a: project, Z: _List_Nil, aq: false, E: _List_Nil}),
							$elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 129:
				var method = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aJ: method}),
					$elm$core$Platform$Cmd$none);
			case 130:
				var orderStr = msg.a;
				var _v25 = $elm$core$String$toInt(orderStr);
				if (!_v25.$) {
					var order = _v25.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a$: A2(
									$elm$core$Basics$max,
									1,
									A2($elm$core$Basics$min, 5, order))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 131:
				var lengthStr = msg.a;
				var _v26 = $elm$core$String$toInt(lengthStr);
				if (!_v26.$) {
					var length = _v26.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a_: A2($elm$core$Basics$max, 1, length)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 132:
				var lengthStr = msg.a;
				var _v27 = $elm$core$String$toInt(lengthStr);
				if (!_v27.$) {
					var length = _v27.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bM: A2($elm$core$Basics$max, model.a_, length)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 133:
				var lengthStr = msg.a;
				var _v28 = $elm$core$String$toInt(lengthStr);
				if (!_v28.$) {
					var length = _v28.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aT: A2(
									$elm$core$Basics$max,
									1,
									A2($elm$core$Basics$min, 10, length))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 134:
				var lengthStr = msg.a;
				var _v29 = $elm$core$String$toInt(lengthStr);
				if (!_v29.$) {
					var length = _v29.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bC: A2(
									$elm$core$Basics$max,
									model.aT,
									A2($elm$core$Basics$min, 10, length))
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 135:
				var countStr = msg.a;
				var _v30 = $elm$core$String$toInt(countStr);
				if (!_v30.$) {
					var count = _v30.a;
					var validCount = A2(
						$elm$core$List$member,
						count,
						_List_fromArray(
							[5, 10, 15, 25, 50])) ? count : 10;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{al: validCount}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 136:
				var word = msg.a;
				var updatedGeneratedWords = A2(
					$elm$core$List$filter,
					function (w) {
						return !_Utils_eq(w, word);
					},
					model.B);
				var language = model.a.c;
				var ipaForm = $elm$core$String$trim(word);
				var orthographyForm = A2(
					$author$project$Main$applyOrthography,
					language.n.r.S,
					$author$project$Main$removeSyllableSeparators(ipaForm));
				var newWord = {
					k: _List_Nil,
					I: '',
					V: 'Generated word',
					g: ipaForm,
					q: _List_Nil,
					r: orthographyForm,
					A: 'noun',
					v: {H: _List_Nil, M: _List_Nil, O: _List_Nil}
				};
				var wordExists = A2(
					$elm$core$List$any,
					function (w) {
						return _Utils_eq(w.g, newWord.g);
					},
					language.e);
				var updatedLanguage = wordExists ? language : _Utils_update(
					language,
					{
						e: _Utils_ap(
							language.e,
							_List_fromArray(
								[newWord]))
					});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{B: updatedGeneratedWords, a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 137:
				var language = model.a.c;
				var newWords = A2(
					$elm$core$List$map,
					function (word) {
						var ipaForm = word;
						var orthographyForm = A2(
							$author$project$Main$applyOrthography,
							language.n.r.S,
							$author$project$Main$removeSyllableSeparators(ipaForm));
						return {
							k: _List_Nil,
							I: '',
							V: 'Generated word',
							g: ipaForm,
							q: _List_Nil,
							r: orthographyForm,
							A: 'noun',
							v: {H: _List_Nil, M: _List_Nil, O: _List_Nil}
						};
					},
					A2(
						$elm$core$List$filter,
						function (word) {
							return !A2(
								$elm$core$List$any,
								function (w) {
									return _Utils_eq(w.g, word);
								},
								language.e);
						},
						A2($elm$core$List$map, $elm$core$String$trim, model.B)));
				var updatedLanguage = _Utils_update(
					language,
					{
						e: _Utils_ap(language.e, newWords)
					});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{B: _List_Nil, a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 138:
				var projectId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bm: $elm$core$Maybe$Just(projectId)
						}),
					$author$project$Main$loadProjectById(projectId));
			case 139:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bN: $elm$core$Maybe$Nothing, bm: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 140:
				var csvContent = $author$project$Main$lexiconToCSV(model.a.c.e);
				return _Utils_Tuple2(
					model,
					$author$project$Main$exportCSV(csvContent));
			case 141:
				return _Utils_Tuple2(
					model,
					$author$project$Main$triggerCSVImport(0));
			case 142:
				var csvData = msg.a;
				var _v31 = $author$project$Main$parseCSVToLexicon(csvData);
				if (!_v31.$) {
					var newLexemes = _v31.a;
					var language = model.a.c;
					var existingForms = A2(
						$elm$core$List$map,
						function ($) {
							return $.g;
						},
						language.e);
					var uniqueNewLexemes = A2(
						$elm$core$List$filter,
						function (lex) {
							return !A2($elm$core$List$member, lex.g, existingForms);
						},
						newLexemes);
					var updatedLanguage = _Utils_update(
						language,
						{
							e: _Utils_ap(language.e, uniqueNewLexemes)
						});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 143:
				var pattern = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ay: pattern}),
					$elm$core$Platform$Cmd$none);
			case 144:
				var replacement = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{az: replacement}),
					$elm$core$Platform$Cmd$none);
			case 145:
				var context = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aR: context}),
					$elm$core$Platform$Cmd$none);
			case 146:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bA: true}),
					$elm$core$Platform$Cmd$none);
			case 147:
				var language = model.a.c;
				var updatedLexicon = A2(
					$elm$core$List$map,
					A3($author$project$Main$applySoundChangeToWord, model.ay, model.az, model.aR),
					language.e);
				var updatedLanguage = _Utils_update(
					language,
					{e: updatedLexicon});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: updatedProject,
							Z: _List_Nil,
							bA: false,
							aR: '',
							ay: '',
							az: '',
							E: A2($elm$core$List$cons, model.a, model.E)
						}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			case 148:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bA: false, aR: '', ay: '', az: ''}),
					$elm$core$Platform$Cmd$none);
			case 149:
				var _v32 = model.E;
				if (!_v32.b) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var previousState = _v32.a;
					var remainingUndo = _v32.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a: previousState,
								Z: A2($elm$core$List$cons, model.a, model.Z),
								E: remainingUndo
							}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(previousState)));
				}
			case 150:
				var _v33 = model.Z;
				if (!_v33.b) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var nextState = _v33.a;
					var remainingRedo = _v33.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a: nextState,
								Z: remainingRedo,
								E: A2($elm$core$List$cons, model.a, model.E)
							}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(nextState)));
				}
			case 151:
				var cell = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bO: $elm$core$Maybe$Just(cell),
							bP: true
						}),
					$elm$core$Platform$Cmd$none);
			case 152:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bO: $elm$core$Maybe$Nothing, bP: false}),
					$elm$core$Platform$Cmd$none);
			case 153:
				var phoneme = msg.a;
				var updatedProject = model.a;
				var language = model.a.c;
				var phonology = language.n;
				var allSounds = A2(
					$elm$core$List$concatMap,
					function ($) {
						return $.u;
					},
					phonology.k);
				var updatedSounds = function () {
					if (A2($elm$core$List$member, phoneme, allSounds)) {
						var updatedCategories = A2(
							$elm$core$List$map,
							function (cat) {
								return _Utils_update(
									cat,
									{
										u: A2(
											$elm$core$List$filter,
											function (s) {
												return !_Utils_eq(s, phoneme);
											},
											cat.u)
									});
							},
							phonology.k);
						return updatedCategories;
					} else {
						var categoryName = $author$project$Main$isOtherSymbolSound(phoneme) ? 'Consonants' : ($author$project$Main$isConsonantSound(phoneme) ? 'Consonants' : ($author$project$Main$isVowelSound(phoneme) ? 'Vowels' : 'Other'));
						var needsNewCategory = !A2(
							$elm$core$List$any,
							function (cat) {
								return _Utils_eq(cat.b, categoryName);
							},
							phonology.k);
						var updatedCategories = A2(
							$elm$core$List$map,
							function (cat) {
								return _Utils_eq(cat.b, categoryName) ? _Utils_update(
									cat,
									{
										u: _Utils_ap(
											cat.u,
											_List_fromArray(
												[phoneme]))
									}) : cat;
							},
							phonology.k);
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
									phonology.k,
									_List_fromArray(
										[
											{
											J: label,
											b: categoryName,
											u: _List_fromArray(
												[phoneme])
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
					{k: updatedSounds});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var finalProject = _Utils_update(
					updatedProject,
					{c: updatedLanguage});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: finalProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(finalProject)));
			case 158:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bd: input}),
					$elm$core$Platform$Cmd$none);
			case 159:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bc: input}),
					$elm$core$Platform$Cmd$none);
			case 160:
				var input = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aY: input}),
					$elm$core$Platform$Cmd$none);
			case 161:
				var trimmedPhoneme = $elm$core$String$trim(model.bd);
				var trimmedGrapheme = $elm$core$String$trim(model.bc);
				if ($elm$core$String$isEmpty(trimmedPhoneme) || $elm$core$String$isEmpty(trimmedGrapheme)) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var language = model.a.c;
					var phonology = language.n;
					var orthography = phonology.r;
					var exists = A2(
						$elm$core$List$any,
						function (m) {
							return _Utils_eq(m.f, trimmedPhoneme);
						},
						orthography.S);
					var updatedMappings = exists ? A2(
						$elm$core$List$map,
						function (m) {
							return _Utils_eq(m.f, trimmedPhoneme) ? _Utils_update(
								m,
								{
									d: $elm$core$String$trim(model.aY),
									h: trimmedGrapheme
								}) : m;
						},
						orthography.S) : _Utils_ap(
						orthography.S,
						_List_fromArray(
							[
								{
								d: $elm$core$String$trim(model.aY),
								h: trimmedGrapheme,
								f: trimmedPhoneme
							}
							]));
					var updatedOrthography = _Utils_update(
						orthography,
						{S: updatedMappings});
					var updatedPhonology = _Utils_update(
						phonology,
						{r: updatedOrthography});
					var updatedLanguage = _Utils_update(
						language,
						{n: updatedPhonology});
					var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aY: '', bc: '', bd: '', a: updatedProject}),
						$author$project$Main$saveToStorage(
							$author$project$Main$encodeProject(updatedProject)));
				}
			case 162:
				var phoneme = msg.a;
				var language = model.a.c;
				var phonology = language.n;
				var orthography = phonology.r;
				var updatedMappings = A2(
					$elm$core$List$filter,
					function (m) {
						return !_Utils_eq(m.f, phoneme);
					},
					orthography.S);
				var updatedOrthography = _Utils_update(
					orthography,
					{S: updatedMappings});
				var updatedPhonology = _Utils_update(
					phonology,
					{r: updatedOrthography});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
			default:
				var language = model.a.c;
				var phonology = language.n;
				var orthography = phonology.r;
				var newDisplayMode = function () {
					var _v35 = orthography.aC;
					if (!_v35) {
						return 1;
					} else {
						return 0;
					}
				}();
				var updatedOrthography = _Utils_update(
					orthography,
					{aC: newDisplayMode});
				var updatedPhonology = _Utils_update(
					phonology,
					{r: updatedOrthography});
				var updatedLanguage = _Utils_update(
					language,
					{n: updatedPhonology});
				var updatedProject = A3($author$project$Main$updateProjectLanguage, model.a, model.i, updatedLanguage);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: updatedProject}),
					$author$project$Main$saveToStorage(
						$author$project$Main$encodeProject(updatedProject)));
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
var $author$project$Main$DismissImportError = {$: 38};
var $author$project$Main$ExportProject = {$: 35};
var $author$project$Main$ImportProject = {$: 36};
var $author$project$Main$SaveProject = {$: 34};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
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
var $author$project$Main$viewActions = function (model) {
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
						$elm$html$Html$text('Project Actions')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$SaveProject)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Save Project')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('secondary'),
						$elm$html$Html$Events$onClick($author$project$Main$ExportProject)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Export as JSON')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('secondary'),
						$elm$html$Html$Events$onClick($author$project$Main$ImportProject)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Import from JSON')
					])),
				function () {
				var _v0 = model.be;
				if (!_v0.$) {
					var errorMsg = _v0.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('error-message')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(errorMsg),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('small'),
										$elm$html$Html$Events$onClick($author$project$Main$DismissImportError)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('×')
									]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $author$project$Main$CancelDeleteProject = {$: 155};
var $author$project$Main$ConfirmDeleteProject = function (a) {
	return {$: 154, a: a};
};
var $author$project$Main$NoOp = {$: 28};
var $elm$html$Html$p = _VirtualDom_node('p');
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
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$viewDeleteProjectConfirm = F2(
	function (projectId, projects) {
		var projectName = A2(
			$elm$core$Maybe$withDefault,
			'Unknown Project',
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.b;
				},
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						function (p) {
							return _Utils_eq(p.o, projectId);
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
					A2($elm$html$Html$Attributes$style, 'background', 'rgba(0, 0, 0, 0.5)'),
					A2($elm$html$Html$Attributes$style, 'display', 'flex'),
					A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
					A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
					A2($elm$html$Html$Attributes$style, 'padding', '20px'),
					$elm$html$Html$Events$onClick($author$project$Main$CancelDeleteProject)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$style, 'background', 'white'),
							A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
							A2($elm$html$Html$Attributes$style, 'padding', '30px'),
							A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
							A2($elm$html$Html$Attributes$style, 'width', '100%'),
							A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)'),
							A2(
							$elm$html$Html$Events$stopPropagationOn,
							'click',
							$elm$json$Json$Decode$succeed(
								_Utils_Tuple2($author$project$Main$NoOp, true)))
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h2,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
									A2($elm$html$Html$Attributes$style, 'color', '#d32f2f')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('⚠️ Delete Project?')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '20px 0')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Are you sure you want to delete the project \"'),
									A2(
									$elm$html$Html$strong,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(projectName)
										])),
									$elm$html$Html$text('\"?')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$style, 'margin', '20px 0'),
									A2($elm$html$Html$Attributes$style, 'color', '#666')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('This will permanently delete all data in this project, including phonology, morphology, and lexicon. This action cannot be undone.')
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
											$elm$html$Html$Events$onClick($author$project$Main$CancelDeleteProject),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
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
											$author$project$Main$ConfirmDeleteProject(projectId)),
											$elm$html$Html$Attributes$class('danger'),
											A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
											A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Delete Project')
										]))
								]))
						]))
				]));
	});
var $author$project$Main$OpenSaveTemplateModal = {$: 110};
var $author$project$Main$ToggleProjectList = {$: 103};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $author$project$Main$CloseNewProjectModal = {$: 105};
var $author$project$Main$CreateNewProject = {$: 107};
var $author$project$Main$UpdateNewProjectNameInput = function (a) {
	return {$: 106, a: a};
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
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
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewNewProjectModal = function (model) {
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
				$elm$html$Html$Events$onClick($author$project$Main$CloseNewProjectModal)
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
							_Utils_Tuple2($author$project$Main$NoOp, true)))
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
								$elm$html$Html$text('Create New Project')
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
										$elm$html$Html$text('Project Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., My New Language'),
										$elm$html$Html$Attributes$value(model.aF),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateNewProjectNameInput),
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
										$elm$html$Html$Events$onClick($author$project$Main$CloseNewProjectModal),
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
										$elm$html$Html$Events$onClick($author$project$Main$CreateNewProject),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#4CAF50'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
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
var $author$project$Main$OpenNewProjectModal = {$: 104};
var $author$project$Main$ToggleDefaultTemplates = {$: 115};
var $author$project$Main$ToggleTemplatesSection = {$: 116};
var $elm$html$Html$h4 = _VirtualDom_node('h4');
var $author$project$Main$CancelRenameProject = {$: 124};
var $author$project$Main$ConfirmRenameProject = function (a) {
	return {$: 123, a: a};
};
var $author$project$Main$DeleteProject = function (a) {
	return {$: 120, a: a};
};
var $author$project$Main$DuplicateProject = function (a) {
	return {$: 126, a: a};
};
var $author$project$Main$StartRenameProject = F2(
	function (a, b) {
		return {$: 121, a: a, b: b};
	});
var $author$project$Main$SwitchToProject = function (a) {
	return {$: 119, a: a};
};
var $author$project$Main$UpdateRenameInput = function (a) {
	return {$: 122, a: a};
};
var $author$project$Main$formatTimestamp = function (timestamp) {
	return $elm$core$String$isEmpty(timestamp) ? 'Unknown' : A2($elm$core$String$left, 10, timestamp);
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Main$viewProjectItem = F2(
	function (model, project) {
		var isRenaming = _Utils_eq(
			model.bn,
			$elm$core$Maybe$Just(project.o));
		var isCurrentProject = _Utils_eq(project.o, model.aB);
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
					isCurrentProject ? '2px solid #4CAF50' : '1px solid #ddd'),
					A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
					A2(
					$elm$html$Html$Attributes$style,
					'background',
					isCurrentProject ? '#e8f5e9' : '#f9f9f9'),
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
											$elm$html$Html$Attributes$value(model.aN),
											$elm$html$Html$Events$onInput($author$project$Main$UpdateRenameInput),
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
											$author$project$Main$ConfirmRenameProject(project.o)),
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
											$elm$html$Html$Events$onClick($author$project$Main$CancelRenameProject),
											A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
											A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
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
											A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(project.b),
											isCurrentProject ? A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$style, 'margin-left', '10px'),
													A2($elm$html$Html$Attributes$style, 'color', '#4CAF50'),
													A2($elm$html$Html$Attributes$style, 'font-size', '0.8em')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('(Current)')
												])) : $elm$html$Html$text('')
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
											$elm$html$Html$text(
											'Last modified: ' + $author$project$Main$formatTimestamp(project.ah))
										]))
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
									A2($author$project$Main$StartRenameProject, project.o, project.b)),
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
									$author$project$Main$DuplicateProject(project.o)),
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
							(!isCurrentProject) ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Main$SwitchToProject(project.o)),
									A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
									A2($elm$html$Html$Attributes$style, 'background', '#2196F3'),
									A2($elm$html$Html$Attributes$style, 'color', 'white'),
									A2($elm$html$Html$Attributes$style, 'border', 'none'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Open')
								])) : $elm$html$Html$text(''),
							(!isCurrentProject) ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Main$DeleteProject(project.o)),
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
								])) : $elm$html$Html$text('')
						]))
				]));
	});
var $author$project$Main$DeleteTemplate = function (a) {
	return {$: 114, a: a};
};
var $author$project$Main$LoadTemplate = function (a) {
	return {$: 108, a: a};
};
var $author$project$Main$viewTemplateItem = F2(
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
									A2($elm$html$Html$Attributes$style, 'font-size', '1em'),
									A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(template.b),
									template.aZ ? A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											A2($elm$html$Html$Attributes$style, 'margin-left', '8px'),
											A2($elm$html$Html$Attributes$style, 'color', '#9C27B0'),
											A2($elm$html$Html$Attributes$style, 'font-size', '0.75em'),
											A2($elm$html$Html$Attributes$style, 'font-weight', 'normal')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('(Default)')
										])) : $elm$html$Html$text('')
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
									$elm$html$Html$text(template.d)
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
									$author$project$Main$LoadTemplate(template.b)),
									A2($elm$html$Html$Attributes$style, 'padding', '8px 16px'),
									A2($elm$html$Html$Attributes$style, 'background', '#2196F3'),
									A2($elm$html$Html$Attributes$style, 'color', 'white'),
									A2($elm$html$Html$Attributes$style, 'border', 'none'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Load Template')
								])),
							(!template.aZ) ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Main$DeleteTemplate(template.o)),
									A2($elm$html$Html$Attributes$style, 'padding', '8px 12px'),
									A2($elm$html$Html$Attributes$style, 'background', '#f44336'),
									A2($elm$html$Html$Attributes$style, 'color', 'white'),
									A2($elm$html$Html$Attributes$style, 'border', 'none'),
									A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
									A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Delete')
								])) : $elm$html$Html$text('')
						]))
				]));
	});
var $author$project$Main$viewProjectList = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('project-list'),
				A2($elm$html$Html$Attributes$style, 'background', 'white'),
				A2($elm$html$Html$Attributes$style, 'border', '2px solid #4CAF50'),
				A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px'),
				A2($elm$html$Html$Attributes$style, 'margin-top', '15px'),
				A2($elm$html$Html$Attributes$style, 'box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Your Projects')
					])),
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
								$elm$html$Html$Events$onClick($author$project$Main$OpenNewProjectModal),
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
								$elm$html$Html$text('✚ Create New Project')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-bottom', '20px'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
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
								A2($elm$html$Html$Attributes$style, 'padding', '12px'),
								A2($elm$html$Html$Attributes$style, 'background', '#f9f9f9'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h4,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', '#2c3e50'),
										A2($elm$html$Html$Attributes$style, 'margin', '0'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										$elm$html$Html$Events$onClick($author$project$Main$ToggleTemplatesSection)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										(model.aG ? '▼ ' : '▶ ') + 'Templates')
									])),
								model.aG ? A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$Events$stopPropagationOn,
										'click',
										$elm$json$Json$Decode$succeed(
											_Utils_Tuple2($author$project$Main$ToggleDefaultTemplates, true))),
										A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
										A2($elm$html$Html$Attributes$style, 'background', '#9C27B0'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-size', '0.85em')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										model.aQ ? 'Hide Default Templates' : 'Show Default Templates')
									])) : $elm$html$Html$text('')
							])),
						model.aG ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '10px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', '#666'),
										A2($elm$html$Html$Attributes$style, 'font-size', '0.9em'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Templates provide pre-configured phonology, phonotactics, and morphology to help you get started quickly.')
									])),
								model.aQ ? A2(
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
											$author$project$Main$viewTemplateItem(model),
											$author$project$Main$availableTemplates))
									])) : $elm$html$Html$text(''),
								(!$elm$core$List$isEmpty(model.bD)) ? A2(
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
											$author$project$Main$viewTemplateItem(model),
											model.bD))
									])) : $elm$html$Html$text('')
							])) : $elm$html$Html$text('')
					])),
				$elm$core$List$isEmpty(model.aL) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', '#666'),
						A2($elm$html$Html$Attributes$style, 'font-style', 'italic')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('No projects found. Create your first project above!')
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
								A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px'),
								A2($elm$html$Html$Attributes$style, 'color', '#2c3e50')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Found ' + ($elm$core$String$fromInt(
									$elm$core$List$length(model.aL)) + ' project(s)'))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						A2(
							$elm$core$List$map,
							$author$project$Main$viewProjectItem(model),
							model.aL))
					]))
			]));
};
var $author$project$Main$CloseSaveTemplateModal = {$: 111};
var $author$project$Main$SaveCurrentProjectAsTemplate = {$: 109};
var $author$project$Main$UpdateSaveAsTemplateDescInput = function (a) {
	return {$: 113, a: a};
};
var $author$project$Main$UpdateSaveAsTemplateNameInput = function (a) {
	return {$: 112, a: a};
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Main$viewSaveTemplateModal = function (model) {
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
				$elm$html$Html$Events$onClick($author$project$Main$CloseSaveTemplateModal)
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
							_Utils_Tuple2($author$project$Main$NoOp, true)))
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
										$elm$html$Html$Attributes$value(model.aP),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateSaveAsTemplateNameInput),
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
										$elm$html$Html$Attributes$value(model.a3),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateSaveAsTemplateDescInput),
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
										$elm$html$Html$Events$onClick($author$project$Main$CloseSaveTemplateModal),
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
										$elm$html$Html$Events$onClick($author$project$Main$SaveCurrentProjectAsTemplate),
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
var $author$project$Main$viewHeader = function (model) {
	return A3(
		$elm$html$Html$node,
		'header',
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('CLCTK - Comprehensive Language Construction Tool Kit')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('subtitle')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Project: ' + (model.a.b + (' | Language: ' + model.a.c.b))),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$OpenSaveTemplateModal),
								A2($elm$html$Html$Attributes$style, 'margin-left', '15px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.85em'),
								A2($elm$html$Html$Attributes$style, 'padding', '6px 12px'),
								A2($elm$html$Html$Attributes$style, 'background', '#FF9800'),
								A2($elm$html$Html$Attributes$style, 'color', 'white'),
								A2($elm$html$Html$Attributes$style, 'border', 'none'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
								A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('💾 Save as Template')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$ToggleProjectList),
								A2($elm$html$Html$Attributes$style, 'margin-left', '15px'),
								A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.aq ? 'Hide Projects' : 'Manage Projects')
							]))
					])),
				model.aq ? $author$project$Main$viewProjectList(model) : $elm$html$Html$text(''),
				model.bz ? $author$project$Main$viewSaveTemplateModal(model) : $elm$html$Html$text(''),
				model.by ? $author$project$Main$viewNewProjectModal(model) : $elm$html$Html$text('')
			]));
};
var $author$project$Main$ApplySoundChanges = {$: 147};
var $author$project$Main$BatchAddCategory = {$: 101};
var $author$project$Main$BatchDeleteWords = {$: 97};
var $author$project$Main$BatchExportWords = {$: 102};
var $author$project$Main$BatchUpdatePos = {$: 99};
var $author$project$Main$CancelSoundChanges = {$: 148};
var $author$project$Main$ClearReferenceProject = {$: 139};
var $author$project$Main$DeselectAllWords = {$: 96};
var $author$project$Main$ExportLexiconCSV = {$: 140};
var $author$project$Main$ImportLexiconCSV = {$: 141};
var $author$project$Main$OpenAddModal = {$: 18};
var $author$project$Main$PreviewSoundChanges = {$: 146};
var $author$project$Main$SelectAllWords = {$: 95};
var $author$project$Main$SelectReferenceProject = function (a) {
	return {$: 138, a: a};
};
var $author$project$Main$UpdateBatchCategoryInput = function (a) {
	return {$: 100, a: a};
};
var $author$project$Main$UpdateBatchPosInput = function (a) {
	return {$: 98, a: a};
};
var $author$project$Main$UpdateFilterCategory = function (a) {
	return {$: 93, a: a};
};
var $author$project$Main$UpdateFilterPos = function (a) {
	return {$: 30, a: a};
};
var $author$project$Main$UpdateSearchQuery = function (a) {
	return {$: 29, a: a};
};
var $author$project$Main$UpdateSoundChangeContext = function (a) {
	return {$: 145, a: a};
};
var $author$project$Main$UpdateSoundChangePattern = function (a) {
	return {$: 143, a: a};
};
var $author$project$Main$UpdateSoundChangeReplacement = function (a) {
	return {$: 144, a: a};
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Main$filterByCategory = F2(
	function (filterValue, lexeme) {
		return (filterValue === 'all') ? true : A2($elm$core$List$member, filterValue, lexeme.k);
	});
var $author$project$Main$filterByPos = F2(
	function (filterValue, lexeme) {
		return (filterValue === 'all') ? true : _Utils_eq(lexeme.A, filterValue);
	});
var $author$project$Main$filterBySearch = F2(
	function (query, lexeme) {
		if ($elm$core$String$isEmpty(query)) {
			return true;
		} else {
			var lowerQuery = $elm$core$String$toLower(query);
			var lowerPos = $elm$core$String$toLower(lexeme.A);
			var lowerForm = $elm$core$String$toLower(lexeme.g);
			var lowerDef = $elm$core$String$toLower(lexeme.I);
			return A2($elm$core$String$contains, lowerQuery, lowerForm) || (A2($elm$core$String$contains, lowerQuery, lowerDef) || A2($elm$core$String$contains, lowerQuery, lowerPos));
		}
	});
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Main$getAllCategories = function (lexicon) {
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
					return $.k;
				},
				lexicon)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$Main$searchRelevance = F2(
	function (query, lexeme) {
		if ($elm$core$String$isEmpty(query)) {
			return 0;
		} else {
			var lowerQuery = $elm$core$String$toLower(query);
			var lowerPos = $elm$core$String$toLower(lexeme.A);
			var lowerForm = $elm$core$String$toLower(lexeme.g);
			var lowerDef = $elm$core$String$toLower(lexeme.I);
			return _Utils_eq(lowerForm, lowerQuery) ? 3 : (A2($elm$core$String$startsWith, lowerQuery, lowerForm) ? 2 : (A2($elm$core$String$contains, lowerQuery, lowerDef) ? 1 : (A2($elm$core$String$contains, lowerQuery, lowerPos) ? 0 : (-1))));
		}
	});
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Main$AddWord = {$: 17};
var $author$project$Main$CloseAddModal = {$: 19};
var $author$project$Main$UpdateWordDefinition = function (a) {
	return {$: 14, a: a};
};
var $author$project$Main$UpdateWordEtymology = function (a) {
	return {$: 16, a: a};
};
var $author$project$Main$UpdateWordForm = function (a) {
	return {$: 12, a: a};
};
var $author$project$Main$UpdateWordOrthography = function (a) {
	return {$: 13, a: a};
};
var $author$project$Main$UpdateWordPos = function (a) {
	return {$: 15, a: a};
};
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $author$project$Main$viewAddModal = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modal-overlay'),
				$elm$html$Html$Events$onClick($author$project$Main$CloseAddModal),
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
							_Utils_Tuple2($author$project$Main$NoOp, true))),
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
										$elm$html$Html$Events$onClick($author$project$Main$CloseAddModal),
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
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., ka.ta'),
										$elm$html$Html$Attributes$value(model.ae),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateWordForm),
										$elm$html$Html$Attributes$autofocus(true)
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
										$elm$html$Html$text('Orthography (without separators)')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., kata'),
										$elm$html$Html$Attributes$value(model.am),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateWordOrthography)
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
										$elm$html$Html$Attributes$value(model.ad),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateWordDefinition)
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
										$elm$html$Html$Events$onInput($author$project$Main$UpdateWordPos),
										$elm$html$Html$Attributes$value(model.an)
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
										$elm$html$Html$Attributes$value(model.ak),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateWordEtymology)
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
										$elm$html$Html$Events$onClick($author$project$Main$AddWord),
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
											$elm$core$String$trim(model.ae)) || $elm$core$String$isEmpty(
											$elm$core$String$trim(model.ad)))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Save Word')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$CloseAddModal),
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
var $author$project$Main$CancelBatchDelete = {$: 157};
var $author$project$Main$ConfirmBatchDelete = {$: 156};
var $author$project$Main$viewBatchDeleteConfirm = function (selectedWords) {
	var wordCount = $elm$core$List$length(selectedWords);
	var wordText = (wordCount === 1) ? 'word' : 'words';
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
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'justify-content', 'center'),
				A2($elm$html$Html$Attributes$style, 'z-index', '1000'),
				A2($elm$html$Html$Attributes$style, 'padding', '20px'),
				$elm$html$Html$Events$onClick($author$project$Main$CancelBatchDelete)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'background', 'white'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'padding', '30px'),
						A2($elm$html$Html$Attributes$style, 'max-width', '500px'),
						A2($elm$html$Html$Attributes$style, 'width', '100%'),
						A2($elm$html$Html$Attributes$style, 'box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)'),
						A2(
						$elm$html$Html$Events$stopPropagationOn,
						'click',
						$elm$json$Json$Decode$succeed(
							_Utils_Tuple2($author$project$Main$NoOp, true)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '0'),
								A2($elm$html$Html$Attributes$style, 'color', '#d32f2f')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('⚠️ Delete Selected Words?')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin', '20px 0')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'Are you sure you want to delete ' + ($elm$core$String$fromInt(wordCount) + (' ' + (wordText + '?'))))
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin', '20px 0'),
								A2($elm$html$Html$Attributes$style, 'color', '#666')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('This action can be undone using the Undo button (⟲).')
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
										$elm$html$Html$Events$onClick($author$project$Main$CancelBatchDelete),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
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
										$elm$html$Html$Events$onClick($author$project$Main$ConfirmBatchDelete),
										$elm$html$Html$Attributes$class('danger'),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Delete ' + ($elm$core$String$fromInt(wordCount) + (' ' + wordText)))
									]))
							]))
					]))
			]));
};
var $author$project$Main$AddAntonym = {$: 85};
var $author$project$Main$AddLexemeCategory = {$: 91};
var $author$project$Main$AddRelated = {$: 86};
var $author$project$Main$AddSynonym = {$: 84};
var $author$project$Main$CancelEdit = {$: 23};
var $author$project$Main$CloseEditModal = {$: 24};
var $author$project$Main$RemoveAntonym = function (a) {
	return {$: 88, a: a};
};
var $author$project$Main$RemoveLexemeCategory = function (a) {
	return {$: 92, a: a};
};
var $author$project$Main$RemoveRelated = function (a) {
	return {$: 89, a: a};
};
var $author$project$Main$RemoveSynonym = function (a) {
	return {$: 87, a: a};
};
var $author$project$Main$UpdateAntonymInput = function (a) {
	return {$: 82, a: a};
};
var $author$project$Main$UpdateLexemeCategoryInput = function (a) {
	return {$: 90, a: a};
};
var $author$project$Main$UpdateRelatedInput = function (a) {
	return {$: 83, a: a};
};
var $author$project$Main$UpdateSynonymInput = function (a) {
	return {$: 81, a: a};
};
var $author$project$Main$UpdateWord = {$: 21};
var $author$project$Main$viewEditModal = function (model) {
	var _v0 = model.X;
	if (!_v0.$) {
		var index = _v0.a;
		var stopProp = function (msg) {
			return {cE: msg, cI: false, cK: true};
		};
		var currentWord = A2($author$project$Main$getAt, index, model.a.c.e);
		var semanticLinks = function () {
			if (!currentWord.$) {
				var word = currentWord.a;
				return word.v;
			} else {
				return {H: _List_Nil, M: _List_Nil, O: _List_Nil};
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('modal-overlay'),
					$elm$html$Html$Events$onClick($author$project$Main$CloseEditModal),
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
								_Utils_Tuple2($author$project$Main$NoOp, true))),
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
											$elm$html$Html$Events$onClick($author$project$Main$CloseEditModal),
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
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$placeholder('e.g., ka.ta'),
											$elm$html$Html$Attributes$value(model.ae),
											$elm$html$Html$Events$onInput($author$project$Main$UpdateWordForm)
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
											$elm$html$Html$text('Orthography (without separators)')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('text'),
											$elm$html$Html$Attributes$placeholder('e.g., kata'),
											$elm$html$Html$Attributes$value(model.am),
											$elm$html$Html$Events$onInput($author$project$Main$UpdateWordOrthography)
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
											$elm$html$Html$Attributes$value(model.ad),
											$elm$html$Html$Events$onInput($author$project$Main$UpdateWordDefinition)
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
											$elm$html$Html$Events$onInput($author$project$Main$UpdateWordPos),
											$elm$html$Html$Attributes$value(model.an)
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
											$elm$html$Html$Attributes$value(model.ak),
											$elm$html$Html$Events$onInput($author$project$Main$UpdateWordEtymology)
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
															$elm$html$Html$Attributes$value(model.aS),
															$elm$html$Html$Events$onInput($author$project$Main$UpdateSynonymInput)
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Main$AddSynonym)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Add')
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
																		$author$project$Main$RemoveSynonym(syn))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('×')
																	]))
															]));
												},
												semanticLinks.O))
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
															$elm$html$Html$Attributes$value(model.aH),
															$elm$html$Html$Events$onInput($author$project$Main$UpdateAntonymInput)
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Main$AddAntonym)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Add')
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
																		$author$project$Main$RemoveAntonym(ant))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('×')
																	]))
															]));
												},
												semanticLinks.H))
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
															$elm$html$Html$Attributes$value(model.aM),
															$elm$html$Html$Events$onInput($author$project$Main$UpdateRelatedInput)
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Main$AddRelated)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Add')
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
																		$author$project$Main$RemoveRelated(rel))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('×')
																	]))
															]));
												},
												semanticLinks.M))
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
															$elm$html$Html$Attributes$value(model.bg),
															$elm$html$Html$Events$onInput($author$project$Main$UpdateLexemeCategoryInput)
														]),
													_List_Nil),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Events$onClick($author$project$Main$AddLexemeCategory)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Add')
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
																				$author$project$Main$RemoveLexemeCategory(cat))
																			]),
																		_List_fromArray(
																			[
																				$elm$html$Html$text('×')
																			]))
																	]));
														},
														word.k);
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
											$elm$html$Html$Events$onClick($author$project$Main$UpdateWord),
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
											$elm$html$Html$Events$onClick($author$project$Main$CancelEdit),
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
var $author$project$Main$DeleteWord = function (a) {
	return {$: 22, a: a};
};
var $author$project$Main$EditWord = function (a) {
	return {$: 20, a: a};
};
var $author$project$Main$ToggleWordSelection = function (a) {
	return {$: 94, a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$li = _VirtualDom_node('li');
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
var $author$project$Main$ReferencePart = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Main$TextPart = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$isWordChar = function (c) {
	return $elm$core$Char$isAlphaNum(c) || ((c === '-') || ((c === '_') || (c === '*')));
};
var $author$project$Main$takeWhile = F2(
	function (predicate, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			var x = list.a;
			var xs = list.b;
			return predicate(x) ? A2(
				$elm$core$List$cons,
				x,
				A2($author$project$Main$takeWhile, predicate, xs)) : _List_Nil;
		}
	});
var $author$project$Main$extractWord = function (text) {
	var chars = $elm$core$String$toList(text);
	var wordChars = A2($author$project$Main$takeWhile, $author$project$Main$isWordChar, chars);
	return $elm$core$String$fromList(wordChars);
};
var $author$project$Main$findNextReference = function (text) {
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
			var word = $author$project$Main$extractWord(afterColon);
			var afterWord = A2(
				$elm$core$String$dropLeft,
				$elm$core$String$length(word),
				afterColon);
			return ($elm$core$String$isEmpty(projectName) || $elm$core$String$isEmpty(word)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				{bY: afterWord, bV: beforeAt, bW: projectName, bX: word});
		}
	}
};
var $author$project$Main$parseEtymologyHelper = F2(
	function (remaining, acc) {
		parseEtymologyHelper:
		while (true) {
			if ($elm$core$String$isEmpty(remaining)) {
				return $elm$core$List$reverse(acc);
			} else {
				var _v0 = $author$project$Main$findNextReference(remaining);
				if (_v0.$ === 1) {
					return $elm$core$List$reverse(
						A2(
							$elm$core$List$cons,
							$author$project$Main$TextPart(remaining),
							acc));
				} else {
					var match = _v0.a;
					var newAcc = $elm$core$String$isEmpty(match.bV) ? A2(
						$elm$core$List$cons,
						A2($author$project$Main$ReferencePart, match.bW, match.bX),
						acc) : A2(
						$elm$core$List$cons,
						A2($author$project$Main$ReferencePart, match.bW, match.bX),
						A2(
							$elm$core$List$cons,
							$author$project$Main$TextPart(match.bV),
							acc));
					var $temp$remaining = match.bY,
						$temp$acc = newAcc;
					remaining = $temp$remaining;
					acc = $temp$acc;
					continue parseEtymologyHelper;
				}
			}
		}
	});
var $author$project$Main$parseEtymologyReferences = function (text) {
	return A2($author$project$Main$parseEtymologyHelper, text, _List_Nil);
};
var $author$project$Main$viewEtymologyPart = function (part) {
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
var $author$project$Main$viewEtymology = function (etymology) {
	var parts = $author$project$Main$parseEtymologyReferences(etymology);
	return A2(
		$elm$html$Html$span,
		_List_Nil,
		A2($elm$core$List$map, $author$project$Main$viewEtymologyPart, parts));
};
var $author$project$Main$OpenMorphemeModal = function (a) {
	return {$: 25, a: a};
};
var $author$project$Main$viewMorphemeApplication = F3(
	function (model, wordIndex, lexeme) {
		var morphemes = model.a.c.j.q;
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
							$author$project$Main$OpenMorphemeModal(wordIndex)),
							$elm$html$Html$Attributes$title('Apply morphemes to create a new word')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('+ Morphemes')
						]))
				]));
	});
var $author$project$Main$viewSemanticLinks = function (links) {
	var hasLinks = (!$elm$core$List$isEmpty(links.O)) || ((!$elm$core$List$isEmpty(links.H)) || (!$elm$core$List$isEmpty(links.M)));
	return hasLinks ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('semantic-links')
			]),
		_List_fromArray(
			[
				(!$elm$core$List$isEmpty(links.O)) ? A2(
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
						A2($elm$core$String$join, ', ', links.O))
					])) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(links.H)) ? A2(
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
						A2($elm$core$String$join, ', ', links.H))
					])) : $elm$html$Html$text(''),
				(!$elm$core$List$isEmpty(links.M)) ? A2(
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
						A2($elm$core$String$join, ', ', links.M))
					])) : $elm$html$Html$text('')
			])) : $elm$html$Html$text('');
};
var $author$project$Main$viewLexeme = F3(
	function (model, index, lexeme) {
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
							A2($elm$core$List$member, index, model.F)),
							$elm$html$Html$Events$onCheck(
							function (_v0) {
								return $author$project$Main$ToggleWordSelection(index);
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
													$elm$html$Html$text(lexeme.r)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('word-ipa')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(lexeme.g)
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
											$elm$html$Html$text(' (' + (lexeme.A + ')'))
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
									$elm$html$Html$text(lexeme.I)
								])),
							(!$elm$core$String$isEmpty(lexeme.V)) ? A2(
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
									$author$project$Main$viewEtymology(lexeme.V)
								])) : $elm$html$Html$text(''),
							$author$project$Main$viewSemanticLinks(lexeme.v),
							(!$elm$core$List$isEmpty(lexeme.k)) ? A2(
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
										lexeme.k))
								])) : $elm$html$Html$text(''),
							A3($author$project$Main$viewMorphemeApplication, model, index, lexeme)
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
									$author$project$Main$EditWord(index))
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
									$author$project$Main$DeleteWord(index))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Delete')
								]))
						]))
				]));
	});
var $author$project$Main$CloseMorphemeModal = {$: 26};
var $author$project$Main$ApplyMorphemeToWord = F2(
	function (a, b) {
		return {$: 27, a: a, b: b};
	});
var $author$project$Main$viewApplicableMorpheme = F5(
	function (model, wordIndex, lexeme, morphemeIndex, morpheme) {
		var rules = model.a.c.j.P;
		var formWithMorpheme = A2($author$project$Main$applyMorpheme, morpheme, lexeme.r);
		var previewForm = A2($author$project$Main$applyMorphophonemicRules, rules, formWithMorpheme);
		var wordExists = A2(
			$elm$core$List$any,
			function (lex) {
				return _Utils_eq(lex.r, previewForm);
			},
			model.a.c.e);
		var textColor = wordExists ? '#9ca3af' : '#1f2937';
		var tooltipText = wordExists ? ('Word already exists: ' + previewForm) : (((!$elm$core$String$isEmpty(morpheme.C)) && (!$elm$core$String$isEmpty(morpheme.G))) ? (morpheme.C + ('=' + morpheme.G)) : ('Create new word: ' + previewForm));
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
					A2($author$project$Main$ApplyMorphemeToWord, wordIndex, morphemeIndex)),
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
							$elm$html$Html$text(previewForm + (' (' + (morpheme.D + ')')))
						]))
				]));
	});
var $author$project$Main$viewMorphemeModal = function (model) {
	var _v0 = model.bh;
	if (_v0.$ === 1) {
		return $elm$html$Html$text('');
	} else {
		var wordIndex = _v0.a;
		var morphemes = model.a.c.j.q;
		var lexeme = A2($author$project$Main$getAt, wordIndex, model.a.c.e);
		if (lexeme.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var lex = lexeme.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-overlay'),
						$elm$html$Html$Events$onClick($author$project$Main$CloseMorphemeModal)
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
									_Utils_Tuple2($author$project$Main$NoOp, true)))
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
												$elm$html$Html$text('Base word: ' + lex.r)
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
												$elm$html$Html$text(lex.I)
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
											A3($author$project$Main$viewApplicableMorpheme, model, wordIndex, lex),
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
												$elm$html$Html$Events$onClick($author$project$Main$CloseMorphemeModal),
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
var $author$project$Main$viewReferenceLexeme = function (lexeme) {
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
										$elm$html$Html$text(lexeme.g)
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('word-pos')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(' (' + (lexeme.A + ')'))
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
								$elm$html$Html$text(lexeme.I)
							])),
						(!$elm$core$String$isEmpty(lexeme.V)) ? A2(
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
								$author$project$Main$viewEtymology(lexeme.V)
							])) : $elm$html$Html$text(''),
						$author$project$Main$viewSemanticLinks(lexeme.v)
					]))
			]));
};
var $author$project$Main$viewLexicon = function (model) {
	var indexedLexicon = A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, model.a.c.e);
	var filteredLexicon = A2(
		$elm$core$List$sortBy,
		function (_v9) {
			var lexeme = _v9.b;
			return (-1) * A2($author$project$Main$searchRelevance, model.bt, lexeme);
		},
		A2(
			$elm$core$List$filter,
			function (_v8) {
				var lexeme = _v8.b;
				return A2($author$project$Main$filterByCategory, model.bI, lexeme);
			},
			A2(
				$elm$core$List$filter,
				function (_v7) {
					var lexeme = _v7.b;
					return A2($author$project$Main$filterByPos, model.bJ, lexeme);
				},
				A2(
					$elm$core$List$filter,
					function (_v6) {
						var lexeme = _v6.b;
						return A2($author$project$Main$filterBySearch, model.bt, lexeme);
					},
					indexedLexicon))));
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
								$elm$html$Html$Events$onClick($author$project$Main$Undo),
								$elm$html$Html$Attributes$disabled(
								$elm$core$List$isEmpty(model.E)),
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
								$elm$html$Html$Events$onClick($author$project$Main$Redo),
								$elm$html$Html$Attributes$disabled(
								$elm$core$List$isEmpty(model.Z)),
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
										return $author$project$Main$ClearReferenceProject;
									} else {
										var _v0 = $elm$core$String$toInt(val);
										if (!_v0.$) {
											var id = _v0.a;
											return $author$project$Main$SelectReferenceProject(id);
										} else {
											return $author$project$Main$ClearReferenceProject;
										}
									}
								}),
								$elm$html$Html$Attributes$value(
								function () {
									var _v1 = model.bm;
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
									return (!_Utils_eq(p.o, model.aB)) ? A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(p.o))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(p.b)
											])) : A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$elm$core$String$fromInt(p.o)),
												$elm$html$Html$Attributes$disabled(true)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(p.b + ' (current)')
											]));
								},
								model.aL)))
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
								$elm$html$Html$Attributes$value(model.bt),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateSearchQuery)
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
								$elm$html$Html$Events$onInput($author$project$Main$UpdateFilterPos),
								$elm$html$Html$Attributes$value(model.bJ)
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
								$elm$html$Html$Events$onInput($author$project$Main$UpdateFilterCategory),
								$elm$html$Html$Attributes$value(model.bI)
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
								$author$project$Main$getAllCategories(model.a.c.e))))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('sound-change-tool'),
						A2($elm$html$Html$Attributes$style, 'background', '#fff3cd'),
						A2($elm$html$Html$Attributes$style, 'border', '2px solid #ffc107'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
						A2($elm$html$Html$Attributes$style, 'padding', '20px'),
						A2($elm$html$Html$Attributes$style, 'margin', '20px 0')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#856404'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '0')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('🔧 Bulk Sound Change Tool')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text'),
								A2($elm$html$Html$Attributes$style, 'color', '#856404'),
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
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$placeholder('e.g., t'),
												$elm$html$Html$Attributes$value(model.ay),
												$elm$html$Html$Events$onInput($author$project$Main$UpdateSoundChangePattern),
												A2($elm$html$Html$Attributes$style, 'width', '100%')
											]),
										_List_Nil),
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
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$placeholder('e.g., d'),
												$elm$html$Html$Attributes$value(model.az),
												$elm$html$Html$Events$onInput($author$project$Main$UpdateSoundChangeReplacement),
												A2($elm$html$Html$Attributes$style, 'width', '100%')
											]),
										_List_Nil),
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
												$elm$html$Html$Events$onInput($author$project$Main$UpdateSoundChangeContext),
												$elm$html$Html$Attributes$value(model.aR),
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
										$elm$html$Html$Events$onClick($author$project$Main$PreviewSoundChanges),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#007bff'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(model.ay) || $elm$core$String$isEmpty(model.az))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('👁 Preview Changes')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$ApplySoundChanges),
										A2($elm$html$Html$Attributes$style, 'padding', '10px 20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#28a745'),
										A2($elm$html$Html$Attributes$style, 'color', 'white'),
										A2($elm$html$Html$Attributes$style, 'border', 'none'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
										A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
										A2($elm$html$Html$Attributes$style, 'font-weight', 'bold'),
										$elm$html$Html$Attributes$disabled(
										$elm$core$String$isEmpty(model.ay) || $elm$core$String$isEmpty(model.az))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✓ Apply to All Words')
									]))
							])),
						function () {
						if (model.bA) {
							var previewChanges = A2(
								$elm$core$List$map,
								A3($author$project$Main$applySoundChangeToWord, model.ay, model.az, model.aR),
								model.a.c.e);
							var zipped = A3($elm$core$List$map2, $elm$core$Tuple$pair, model.a.c.e, previewChanges);
							var changedWords = A2(
								$elm$core$List$filter,
								function (_v3) {
									var orig = _v3.a;
									var changed = _v3.b;
									return !_Utils_eq(orig.g, changed.g);
								},
								zipped);
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'margin-top', '15px'),
										A2($elm$html$Html$Attributes$style, 'padding', '15px'),
										A2($elm$html$Html$Attributes$style, 'background', 'white'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '6px')
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
												A2($elm$html$Html$Attributes$style, 'max-height', '200px'),
												A2($elm$html$Html$Attributes$style, 'overflow-y', 'auto')
											]),
										A2(
											$elm$core$List$map,
											function (_v2) {
												var orig = _v2.a;
												var changed = _v2.b;
												return A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															A2($elm$html$Html$Attributes$style, 'padding', '5px 0'),
															A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid #eee')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(orig.g + (' → ' + changed.g))
														]));
											},
											A2($elm$core$List$take, 10, changedWords))),
										($elm$core$List$length(changedWords) > 10) ? A2(
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
													$elm$core$List$length(changedWords) - 10) + ' more'))
											])) : $elm$html$Html$text(''),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Main$CancelSoundChanges),
												A2($elm$html$Html$Attributes$style, 'padding', '8px 16px'),
												A2($elm$html$Html$Attributes$style, 'background', '#6c757d'),
												A2($elm$html$Html$Attributes$style, 'color', 'white'),
												A2($elm$html$Html$Attributes$style, 'border', 'none'),
												A2($elm$html$Html$Attributes$style, 'border-radius', '4px'),
												A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
												A2($elm$html$Html$Attributes$style, 'margin-top', '10px')
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
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$OpenAddModal),
						A2($elm$html$Html$Attributes$style, 'margin', '20px 0'),
						A2($elm$html$Html$Attributes$style, 'padding', '12px 24px'),
						A2($elm$html$Html$Attributes$style, 'font-size', '16px'),
						A2($elm$html$Html$Attributes$style, 'background', '#4299e1'),
						A2($elm$html$Html$Attributes$style, 'color', 'white'),
						A2($elm$html$Html$Attributes$style, 'border', 'none'),
						A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
						A2($elm$html$Html$Attributes$style, 'cursor', 'pointer'),
						A2($elm$html$Html$Attributes$style, 'font-weight', 'bold')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('+ Add New Word')
					])),
				$elm$core$List$isEmpty(filteredLexicon) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$core$List$isEmpty(model.a.c.e) ? A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('No words in lexicon yet. Add some words above!'),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('csv-operations'),
										A2($elm$html$Html$Attributes$style, 'padding', '20px'),
										A2($elm$html$Html$Attributes$style, 'background', '#f7fafc'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h4,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Bulk CSV Import')
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
												$elm$html$Html$text('Quickly populate your lexicon by importing a CSV file (format: word,definition,pos,etymology,categories)')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Main$ImportLexiconCSV)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('📤 Import from CSV')
											]))
									]))
							])) : $elm$html$Html$text('No words match your search or filter criteria.')
					])) : A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						(!$elm$core$List$isEmpty(model.a.c.e)) ? A2(
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
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('small'),
												$elm$html$Html$Events$onClick($author$project$Main$SelectAllWords)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Select All')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('small secondary'),
												$elm$html$Html$Events$onClick($author$project$Main$DeselectAllWords)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Deselect All')
											])),
										(!$elm$core$List$isEmpty(model.F)) ? A2(
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
															$elm$core$List$length(model.F)) + ' word(s) selected')
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
														$elm$html$Html$select,
														_List_fromArray(
															[
																$elm$html$Html$Events$onInput($author$project$Main$UpdateBatchPosInput),
																$elm$html$Html$Attributes$value(model.bG)
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
															])),
														A2(
														$elm$html$Html$button,
														_List_fromArray(
															[
																$elm$html$Html$Events$onClick($author$project$Main$BatchUpdatePos)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Change POS')
															]))
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
																$elm$html$Html$Attributes$placeholder('Add category'),
																$elm$html$Html$Attributes$value(model.a6),
																$elm$html$Html$Events$onInput($author$project$Main$UpdateBatchCategoryInput)
															]),
														_List_Nil),
														A2(
														$elm$html$Html$button,
														_List_fromArray(
															[
																$elm$html$Html$Events$onClick($author$project$Main$BatchAddCategory)
															]),
														_List_fromArray(
															[
																$elm$html$Html$text('Add Category')
															]))
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick($author$project$Main$BatchExportWords)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Export Selected')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('danger'),
														$elm$html$Html$Events$onClick($author$project$Main$BatchDeleteWords)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Delete Selected')
													]))
											])) : $elm$html$Html$text('')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('csv-operations'),
										A2($elm$html$Html$Attributes$style, 'margin-top', '15px'),
										A2($elm$html$Html$Attributes$style, 'padding-top', '15px'),
										A2($elm$html$Html$Attributes$style, 'border-top', '1px solid #e2e8f0')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h4,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Bulk CSV Operations')
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
												$elm$html$Html$text('Import/export your entire lexicon as CSV (format: word,definition,pos,etymology,categories)')
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
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Events$onClick($author$project$Main$ExportLexiconCSV),
														A2($elm$html$Html$Attributes$style, 'margin-right', '10px')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('📥 Export Lexicon as CSV')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('secondary'),
														$elm$html$Html$Events$onClick($author$project$Main$ImportLexiconCSV)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('📤 Import from CSV')
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
								'Showing ' + ($elm$core$String$fromInt(
									$elm$core$List$length(filteredLexicon)) + (' of ' + ($elm$core$String$fromInt(
									$elm$core$List$length(model.a.c.e)) + ' words'))))
							])),
						A2(
						$elm$html$Html$ul,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('word-list')
							]),
						A2(
							$elm$core$List$map,
							function (_v4) {
								var index = _v4.a;
								var lexeme = _v4.b;
								return A3($author$project$Main$viewLexeme, model, index, lexeme);
							},
							filteredLexicon))
					])),
				function () {
				var _v5 = model.bN;
				if (!_v5.$) {
					var refProject = _v5.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-top', '30px'),
								A2($elm$html$Html$Attributes$style, 'padding', '20px'),
								A2($elm$html$Html$Attributes$style, 'background', '#f8f9fa'),
								A2($elm$html$Html$Attributes$style, 'border-radius', '8px'),
								A2($elm$html$Html$Attributes$style, 'border', '2px solid #4299e1')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', '#2d3748'),
										A2($elm$html$Html$Attributes$style, 'margin-bottom', '15px')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Reference: ' + refProject.b)
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
										$elm$html$Html$text('Read-only view of the reference project\'s lexicon for comparison')
									])),
								$elm$core$List$isEmpty(refProject.c.e) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										A2($elm$html$Html$Attributes$style, 'color', '#718096'),
										A2($elm$html$Html$Attributes$style, 'font-style', 'italic')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Reference project has no words in lexicon.')
									])) : A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('word-count'),
												A2($elm$html$Html$Attributes$style, 'background', '#e2e8f0')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$fromInt(
													$elm$core$List$length(refProject.c.e)) + ' words in reference lexicon')
											])),
										A2(
										$elm$html$Html$ul,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('word-list')
											]),
										A2($elm$core$List$map, $author$project$Main$viewReferenceLexeme, refProject.c.e))
									]))
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				model.a4 ? $author$project$Main$viewEditModal(model) : $elm$html$Html$text(''),
				model.bv ? $author$project$Main$viewAddModal(model) : $elm$html$Html$text(''),
				model.bw ? $author$project$Main$viewBatchDeleteConfirm(model.F) : $elm$html$Html$text(''),
				model.bx ? $author$project$Main$viewMorphemeModal(model) : $elm$html$Html$text('')
			]));
};
var $author$project$Main$AddFeature = {$: 48};
var $author$project$Main$UpdateFeatureNameInput = function (a) {
	return {$: 46, a: a};
};
var $author$project$Main$AddFeatureValue = function (a) {
	return {$: 49, a: a};
};
var $author$project$Main$RemoveFeature = function (a) {
	return {$: 50, a: a};
};
var $author$project$Main$UpdateFeatureValueInput = function (a) {
	return {$: 47, a: a};
};
var $author$project$Main$RemoveFeatureValue = F2(
	function (a, b) {
		return {$: 51, a: a, b: b};
	});
var $author$project$Main$viewFeatureValue = F2(
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
							A2($author$project$Main$RemoveFeatureValue, featureName, value))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('×')
						]))
				]));
	});
var $author$project$Main$viewFeature = F2(
	function (model, feature) {
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
									$elm$html$Html$text(feature.b)
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('danger small'),
									$elm$html$Html$Events$onClick(
									$author$project$Main$RemoveFeature(feature.b))
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
						$author$project$Main$viewFeatureValue(feature.b),
						feature.R)),
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
									$elm$html$Html$Attributes$placeholder('Add value for ' + (feature.b + ' (e.g., singular, plural)')),
									$elm$html$Html$Attributes$value(model.bb),
									$elm$html$Html$Events$onInput($author$project$Main$UpdateFeatureValueInput)
								]),
							_List_Nil),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Main$AddFeatureValue(feature.b))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Add Value')
								]))
						]))
				]));
	});
var $author$project$Main$viewFeatures = function (model) {
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
										$elm$html$Html$Attributes$value(model.ba),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateFeatureNameInput)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$AddFeature)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Add Feature')
									]))
							]))
					])),
				$elm$core$List$isEmpty(model.a.c.j.p) ? A2(
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
					$author$project$Main$viewFeature(model),
					model.a.c.j.p))
			]));
};
var $author$project$Main$AddMorpheme = {$: 57};
var $author$project$Main$CancelMorphemeEdit = {$: 61};
var $author$project$Main$SaveMorphemeEdit = {$: 60};
var $author$project$Main$SelectMorphemeType = function (a) {
	return {$: 54, a: a};
};
var $author$project$Main$UpdateMorphemeFeatureInput = function (a) {
	return {$: 55, a: a};
};
var $author$project$Main$UpdateMorphemeFormInput = function (a) {
	return {$: 52, a: a};
};
var $author$project$Main$UpdateMorphemeGlossInput = function (a) {
	return {$: 53, a: a};
};
var $author$project$Main$UpdateMorphemeValueInput = function (a) {
	return {$: 56, a: a};
};
var $author$project$Main$morphemeTypeToString = function (morphemeType) {
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
var $author$project$Main$stringToMorphemeType = function (str) {
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
var $author$project$Main$EditMorpheme = function (a) {
	return {$: 59, a: a};
};
var $author$project$Main$RemoveMorpheme = function (a) {
	return {$: 58, a: a};
};
var $author$project$Main$viewMorpheme = F3(
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
									$elm$html$Html$text(morpheme.g)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('morpheme-gloss')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('- ' + morpheme.D)
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
									' [' + ($author$project$Main$morphemeTypeToString(morpheme.K) + ']'))
								])),
							$elm$core$String$isEmpty(morpheme.C) ? $elm$html$Html$text('') : A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('morpheme-feature')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(' (' + (morpheme.C + ('=' + (morpheme.G + ')'))))
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
									$author$project$Main$EditMorpheme(index))
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
									$author$project$Main$RemoveMorpheme(morpheme))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Delete')
								]))
						]))
				]));
	});
var $author$project$Main$viewMorphemes = function (model) {
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
								$elm$html$Html$text('Morpheme Form')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('e.g., -s, un-, -ed'),
								$elm$html$Html$Attributes$value(model.as),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateMorphemeFormInput)
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
								$elm$html$Html$text('Gloss/Meaning')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('e.g., PL, NEG, PAST'),
								$elm$html$Html$Attributes$value(model.at),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateMorphemeGlossInput)
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
								$elm$html$Html$text('Morpheme Type')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								A2($elm$core$Basics$composeL, $author$project$Main$SelectMorphemeType, $author$project$Main$stringToMorphemeType)),
								$elm$html$Html$Attributes$value(
								$author$project$Main$morphemeTypeToString(model.aE))
							]),
						_List_fromArray(
							[
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
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Feature (optional)')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput($author$project$Main$UpdateMorphemeFeatureInput),
								$elm$html$Html$Attributes$value(model.ai)
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
											$elm$html$Html$text('-- Select Feature --')
										]))
								]),
							A2(
								$elm$core$List$map,
								function (feature) {
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(feature.b)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(feature.b)
											]));
								},
								model.a.c.j.p)))
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
								$elm$html$Html$text('Feature Value (optional)')
							])),
						function () {
						if ($elm$core$String$isEmpty(model.ai)) {
							return A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$disabled(true)
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
												$elm$html$Html$text('-- Select a Feature first --')
											]))
									]));
						} else {
							var selectedFeature = $elm$core$List$head(
								A2(
									$elm$core$List$filter,
									function (f) {
										return _Utils_eq(f.b, model.ai);
									},
									model.a.c.j.p));
							var featureValues = function () {
								if (!selectedFeature.$) {
									var feature = selectedFeature.a;
									return feature.R;
								} else {
									return _List_Nil;
								}
							}();
							return A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput($author$project$Main$UpdateMorphemeValueInput),
										$elm$html$Html$Attributes$value(model.au)
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
													$elm$html$Html$text('-- Select Value --')
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
										featureValues)));
						}
					}()
					])),
				_Utils_eq(model.aW, $elm$core$Maybe$Nothing) ? A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$AddMorpheme)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Add Morpheme')
					])) : A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$SaveMorphemeEdit)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Save Edit')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$CancelMorphemeEdit)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Cancel')
							]))
					])),
				$elm$core$List$isEmpty(model.a.c.j.q) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('No morphemes defined yet. Add morphemes above!')
					])) : A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('morpheme-list')
					]),
				A2(
					$elm$core$List$indexedMap,
					$author$project$Main$viewMorpheme(model),
					model.a.c.j.q))
			]));
};
var $author$project$Main$AddMorphophonemicRule = {$: 78};
var $author$project$Main$SelectRuleType = function (a) {
	return {$: 77, a: a};
};
var $author$project$Main$UpdateRuleContextInput = function (a) {
	return {$: 73, a: a};
};
var $author$project$Main$UpdateRuleDescriptionInput = function (a) {
	return {$: 76, a: a};
};
var $author$project$Main$UpdateRuleNameInput = function (a) {
	return {$: 72, a: a};
};
var $author$project$Main$UpdateRuleReplacementInput = function (a) {
	return {$: 75, a: a};
};
var $author$project$Main$UpdateRuleTargetInput = function (a) {
	return {$: 74, a: a};
};
var $author$project$Main$selectRuleTypeFromString = function (str) {
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
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Main$RemoveMorphophonemicRule = function (a) {
	return {$: 79, a: a};
};
var $author$project$Main$ruleTypeToString = function (ruleType) {
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
var $author$project$Main$viewMorphophonemicRule = function (rule) {
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
										$elm$html$Html$text(rule.b)
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
										' [' + ($author$project$Main$ruleTypeToString(rule.a2) + ']'))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$isEmpty(rule.ar) ? (rule.ab + (' → ' + rule.aj)) : (rule.ab + (' → ' + (rule.aj + (' / ' + rule.ar)))))
							])),
						(!$elm$core$String$isEmpty(rule.d)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(rule.d)
							])) : $elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('danger small'),
						$elm$html$Html$Events$onClick(
						$author$project$Main$RemoveMorphophonemicRule(rule))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Remove')
					]))
			]));
};
var $author$project$Main$viewMorphophonemicRules = function (model) {
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
								$elm$html$Html$text('Rule Name')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('e.g., Nasal Assimilation, Vowel Harmony'),
								$elm$html$Html$Attributes$value(model.bq),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateRuleNameInput)
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
								$elm$html$Html$text('Rule Type')
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Events$onInput(
								A2($elm$core$Basics$composeR, $author$project$Main$selectRuleTypeFromString, $author$project$Main$SelectRuleType))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('Assimilation'),
										$elm$html$Html$Attributes$selected(!model.aO)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Assimilation')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('Dissimilation'),
										$elm$html$Html$Attributes$selected(model.aO === 1)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Dissimilation')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('VowelHarmony'),
										$elm$html$Html$Attributes$selected(model.aO === 2)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Vowel Harmony')
									])),
								A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('ConsonantGradation'),
										$elm$html$Html$Attributes$selected(model.aO === 3)
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
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('e.g., _n (before \'n\'), V_ (after vowel)'),
								$elm$html$Html$Attributes$value(model.bo),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateRuleContextInput)
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
								$elm$html$Html$text('Use _ to mark position of target sound. Leave empty for unconditional change.')
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
								$elm$html$Html$text('Target Sound(s)')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('e.g., t, k, p (sounds to change)'),
								$elm$html$Html$Attributes$value(model.bs),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateRuleTargetInput)
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
								$elm$html$Html$text('Replacement Sound(s)')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('e.g., n, g, b (what they become)'),
								$elm$html$Html$Attributes$value(model.br),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateRuleReplacementInput)
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
								$elm$html$Html$text('Description (optional)')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$placeholder('e.g., /t/ becomes /n/ before nasals'),
								$elm$html$Html$Attributes$value(model.bp),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateRuleDescriptionInput)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$AddMorphophonemicRule)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Add Rule')
					])),
				$elm$core$List$isEmpty(model.a.c.j.P) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('help-text')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('No morphophonemic rules defined yet. Add rules above!')
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
						A2($elm$core$List$map, $author$project$Main$viewMorphophonemicRule, model.a.c.j.P))
					]))
			]));
};
var $author$project$Main$GenerateParadigm = {$: 66};
var $author$project$Main$UpdateInflectionBase = function (a) {
	return {$: 65, a: a};
};
var $author$project$Main$UpdateParadigmNameInput = function (a) {
	return {$: 62, a: a};
};
var $author$project$Main$UpdateParadigmPosInput = function (a) {
	return {$: 63, a: a};
};
var $author$project$Main$countCombinations = function (model) {
	var selectedFeatureObjects = A2(
		$elm$core$List$filterMap,
		function (fname) {
			return $elm$core$List$head(
				A2(
					$elm$core$List$filter,
					function (f) {
						return _Utils_eq(f.b, fname);
					},
					model.a.c.j.p));
		},
		model.ap);
	var counts = A2(
		$elm$core$List$map,
		function (f) {
			return $elm$core$List$length(f.R);
		},
		selectedFeatureObjects);
	return A3($elm$core$List$foldl, $elm$core$Basics$mul, 1, counts);
};
var $author$project$Main$ToggleFeatureSelection = function (a) {
	return {$: 64, a: a};
};
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $author$project$Main$viewFeatureCheckbox = F2(
	function (model, feature) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('feature-checkbox')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Attributes$id('feature-' + feature.b),
							$elm$html$Html$Attributes$checked(
							A2($elm$core$List$member, feature.b, model.ap)),
							$elm$html$Html$Events$onClick(
							$author$project$Main$ToggleFeatureSelection(feature.b))
						]),
					_List_Nil),
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for('feature-' + feature.b)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							feature.b + (' (' + ($elm$core$String$fromInt(
								$elm$core$List$length(feature.R)) + ' values)')))
						]))
				]));
	});
var $author$project$Main$ApplyRulesToParadigm = function (a) {
	return {$: 80, a: a};
};
var $author$project$Main$AutoGenerateParadigmForms = function (a) {
	return {$: 70, a: a};
};
var $author$project$Main$DuplicateParadigm = function (a) {
	return {$: 71, a: a};
};
var $author$project$Main$RemoveParadigm = function (a) {
	return {$: 67, a: a};
};
var $author$project$Main$UpdateParadigmBaseForm = F2(
	function (a, b) {
		return {$: 69, a: a, b: b};
	});
var $author$project$Main$UpdateParadigmForm = F3(
	function (a, b, c) {
		return {$: 68, a: a, b: b, c: c};
	});
var $author$project$Main$viewParadigmRow = F2(
	function (paradigmName, combination) {
		var isEmpty = $elm$core$String$isEmpty(
			$elm$core$String$trim(combination.g));
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
						combination.p),
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
											$elm$html$Html$Attributes$value(combination.g),
											$elm$html$Html$Events$onInput(
											function (newForm) {
												return A3($author$project$Main$UpdateParadigmForm, paradigmName, newForm, combination.p);
											}),
											$elm$html$Html$Attributes$placeholder('Enter inflected form')
										]),
									_List_Nil)
								]))
						])
					])));
	});
var $author$project$Main$viewParadigm = F2(
	function (morphology, paradigm) {
		var totalForms = $elm$core$List$length(paradigm.W);
		var filledForms = $elm$core$List$length(
			A2(
				$elm$core$List$filter,
				function (fc) {
					return !$elm$core$String$isEmpty(
						$elm$core$String$trim(fc.g));
				},
				paradigm.W));
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
						return $.p;
					},
					paradigm.W)));
		var coveredFeatures = A2(
			$elm$core$List$filter,
			function (featureName) {
				return A2(
					$elm$core$List$any,
					function (m) {
						return _Utils_eq(m.C, featureName) && (!$elm$core$String$isEmpty(m.G));
					},
					morphology.q);
			},
			allFeatures);
		var morphemeCoveragePercent = $elm$core$List$isEmpty(allFeatures) ? 100 : (($elm$core$List$length(coveredFeatures) / $elm$core$List$length(allFeatures)) * 100);
		var morphemeCoverageWarning = function () {
			if ((morphemeCoveragePercent < 100) && (!$elm$core$String$isEmpty(paradigm.aA))) {
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
											$elm$html$Html$text(paradigm.b)
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('paradigm-pos')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('(' + (paradigm.A + ')'))
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
											$author$project$Main$DuplicateParadigm(paradigm.b))
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
											$author$project$Main$ApplyRulesToParadigm(paradigm.b))
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
											$author$project$Main$RemoveParadigm(paradigm.b))
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
									$elm$html$Html$Attributes$value(paradigm.aA),
									$elm$html$Html$Events$onInput(
									function (newBase) {
										return A2($author$project$Main$UpdateParadigmBaseForm, paradigm.b, newBase);
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
									$author$project$Main$AutoGenerateParadigmForms(paradigm.b)),
									$elm$html$Html$Attributes$disabled(
									$elm$core$String$isEmpty(paradigm.aA)),
									$elm$html$Html$Attributes$title(
									$elm$core$String$isEmpty(paradigm.aA) ? 'Enter a base form first' : 'Automatically generate inflected forms using morphemes and rules')
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
														var _v0 = $elm$core$List$head(paradigm.W);
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
																combo.p);
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
										$author$project$Main$viewParadigmRow(paradigm.b),
										paradigm.W))
								]))
						]))
				]));
	});
var $author$project$Main$viewParadigmWithContext = F2(
	function (morphology, paradigm) {
		return A2($author$project$Main$viewParadigm, morphology, paradigm);
	});
var $author$project$Main$viewParadigms = function (model) {
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
				$elm$core$List$isEmpty(model.a.c.j.p) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('warning-message')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('⚠ You need to define grammatical features first before creating paradigms.')
					])) : A2(
				$elm$html$Html$div,
				_List_Nil,
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
										$elm$html$Html$text('Paradigm Name')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., Noun Declension, Verb Conjugation'),
										$elm$html$Html$Attributes$value(model.bi),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateParadigmNameInput)
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
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., noun, verb, adjective'),
										$elm$html$Html$Attributes$value(model.bj),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateParadigmPosInput)
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
										$elm$html$Html$text('Select Features to Include')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('feature-checkboxes')
									]),
								A2(
									$elm$core$List$map,
									$author$project$Main$viewFeatureCheckbox(model),
									model.a.c.j.p))
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
										$elm$html$Html$text('Base Form (for reference)')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('e.g., stem or root form'),
										$elm$html$Html$Attributes$value(model.bf),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateInflectionBase)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Main$GenerateParadigm)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Generate Paradigm')
							])),
						(!$elm$core$List$isEmpty(model.ap)) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								'This will create ' + ($elm$core$String$fromInt(
									$author$project$Main$countCombinations(model)) + ' forms based on selected features'))
							])) : $elm$html$Html$text('')
					])),
				$elm$core$List$isEmpty(model.a.c.j.y) ? A2(
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
					$author$project$Main$viewParadigmWithContext(model.a.c.j),
					model.a.c.j.y))
			]));
};
var $author$project$Main$viewMorphology = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Main$viewFeatures(model),
				$author$project$Main$viewMorphemes(model),
				$author$project$Main$viewMorphophonemicRules(model),
				$author$project$Main$viewParadigms(model)
			]));
};
var $author$project$Main$AddConstraint = {$: 43};
var $author$project$Main$AddGraphemeMapping = {$: 161};
var $author$project$Main$AddPattern = {$: 8};
var $author$project$Main$SelectConstraintType = function (a) {
	return {$: 42, a: a};
};
var $author$project$Main$UpdateConstraintInput = function (a) {
	return {$: 41, a: a};
};
var $author$project$Main$UpdateGraphemeDescriptionInput = function (a) {
	return {$: 160, a: a};
};
var $author$project$Main$UpdateGraphemeGraphemeInput = function (a) {
	return {$: 159, a: a};
};
var $author$project$Main$UpdateGraphemePhonemeInput = function (a) {
	return {$: 158, a: a};
};
var $author$project$Main$UpdatePatternInput = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$constraintTypeExplanation = function (constraintType) {
	switch (constraintType) {
		case 0:
			return 'Prohibits a sequence of sounds from appearing anywhere in a word (e.g., *tl, *sr)';
		case 1:
			return 'Prohibits a sound or sequence from appearing at the beginning of a syllable';
		case 2:
			return 'Prohibits a sound or sequence from appearing at the end of a syllable';
		case 3:
			return 'Prohibits a sound or sequence from appearing at the beginning of a word';
		default:
			return 'Prohibits a sound or sequence from appearing at the end of a word';
	}
};
var $author$project$Main$stringToConstraintType = function (str) {
	switch (str) {
		case 'IllegalCluster':
			return 0;
		case 'OnsetRestriction':
			return 1;
		case 'CodaRestriction':
			return 2;
		case 'NoWordInitial':
			return 3;
		case 'NoWordFinal':
			return 4;
		default:
			return 0;
	}
};
var $author$project$Main$RemoveConstraint = function (a) {
	return {$: 44, a: a};
};
var $author$project$Main$viewConstraint = function (constraint) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('phoneme-tag')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(constraint.d),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Main$RemoveConstraint(constraint))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('×')
					]))
			]));
};
var $author$project$Main$RemoveGraphemeMapping = function (a) {
	return {$: 162, a: a};
};
var $author$project$Main$viewGraphemeMapping = function (mapping) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('phoneme-tag'),
				A2($elm$html$Html$Attributes$style, 'display', 'inline-flex'),
				A2($elm$html$Html$Attributes$style, 'align-items', 'center'),
				A2($elm$html$Html$Attributes$style, 'gap', '8px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(mapping.f + (' → ' + mapping.h))
					])),
				(!$elm$core$String$isEmpty(mapping.d)) ? A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'color', '#666'),
						A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('(' + (mapping.d + ')'))
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						$author$project$Main$RemoveGraphemeMapping(mapping.f)),
						$elm$html$Html$Attributes$class('remove-btn'),
						A2($elm$html$Html$Attributes$style, 'font-size', '0.9em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('×')
					]))
			]));
};
var $author$project$Main$CloseIPACellModal = {$: 152};
var $author$project$Main$TogglePhonemeInCell = function (a) {
	return {$: 153, a: a};
};
var $author$project$Main$backnessToString = function (backness) {
	switch (backness) {
		case 0:
			return 'Front';
		case 1:
			return 'Central';
		default:
			return 'Back';
	}
};
var $author$project$Main$getConsonantPhonemesForCell = F2(
	function (place, manner) {
		var _v0 = _Utils_Tuple2(place, manner);
		_v0$41:
		while (true) {
			switch (_v0.b) {
				case 5:
					if (_v0.a === 3) {
						var _v25 = _v0.a;
						var _v26 = _v0.b;
						return _List_fromArray(
							['ɬ', 'ɮ']);
					} else {
						break _v0$41;
					}
				case 3:
					switch (_v0.a) {
						case 3:
							var _v21 = _v0.a;
							var _v22 = _v0.b;
							return _List_fromArray(
								['ɾ']);
						case 5:
							var _v39 = _v0.a;
							var _v40 = _v0.b;
							return _List_fromArray(
								['ɽ']);
						default:
							break _v0$41;
					}
				case 7:
					switch (_v0.a) {
						case 3:
							var _v29 = _v0.a;
							var _v30 = _v0.b;
							return _List_fromArray(
								['l']);
						case 5:
							var _v45 = _v0.a;
							var _v46 = _v0.b;
							return _List_fromArray(
								['ɭ']);
						case 6:
							var _v55 = _v0.a;
							var _v56 = _v0.b;
							return _List_fromArray(
								['ʎ']);
						case 7:
							var _v65 = _v0.a;
							var _v66 = _v0.b;
							return _List_fromArray(
								['ʟ']);
						default:
							break _v0$41;
					}
				case 1:
					switch (_v0.a) {
						case 0:
							var _v3 = _v0.a;
							var _v4 = _v0.b;
							return _List_fromArray(
								['m', 'ɱ']);
						case 3:
							var _v17 = _v0.a;
							var _v18 = _v0.b;
							return _List_fromArray(
								['n']);
						case 5:
							var _v37 = _v0.a;
							var _v38 = _v0.b;
							return _List_fromArray(
								['ɳ']);
						case 6:
							var _v49 = _v0.a;
							var _v50 = _v0.b;
							return _List_fromArray(
								['ɲ']);
						case 7:
							var _v59 = _v0.a;
							var _v60 = _v0.b;
							return _List_fromArray(
								['ŋ']);
						case 8:
							var _v69 = _v0.a;
							var _v70 = _v0.b;
							return _List_fromArray(
								['ɴ']);
						default:
							break _v0$41;
					}
				case 2:
					switch (_v0.a) {
						case 0:
							var _v5 = _v0.a;
							var _v6 = _v0.b;
							return _List_fromArray(
								['ʙ']);
						case 3:
							var _v19 = _v0.a;
							var _v20 = _v0.b;
							return _List_fromArray(
								['r']);
						case 8:
							var _v71 = _v0.a;
							var _v72 = _v0.b;
							return _List_fromArray(
								['ʀ']);
						default:
							break _v0$41;
					}
				case 6:
					switch (_v0.a) {
						case 1:
							var _v11 = _v0.a;
							var _v12 = _v0.b;
							return _List_fromArray(
								['ʋ']);
						case 3:
							var _v27 = _v0.a;
							var _v28 = _v0.b;
							return _List_fromArray(
								['ɹ']);
						case 5:
							var _v43 = _v0.a;
							var _v44 = _v0.b;
							return _List_fromArray(
								['ɻ']);
						case 6:
							var _v53 = _v0.a;
							var _v54 = _v0.b;
							return _List_fromArray(
								['j']);
						case 7:
							var _v63 = _v0.a;
							var _v64 = _v0.b;
							return _List_fromArray(
								['ɰ']);
						case 9:
							var _v77 = _v0.a;
							var _v78 = _v0.b;
							return _List_fromArray(
								['ʕ̞']);
						default:
							break _v0$41;
					}
				case 0:
					switch (_v0.a) {
						case 0:
							var _v1 = _v0.a;
							var _v2 = _v0.b;
							return _List_fromArray(
								['p', 'b']);
						case 3:
							var _v15 = _v0.a;
							var _v16 = _v0.b;
							return _List_fromArray(
								['t', 'd']);
						case 4:
							var _v33 = _v0.a;
							var _v34 = _v0.b;
							return _List_Nil;
						case 5:
							var _v35 = _v0.a;
							var _v36 = _v0.b;
							return _List_fromArray(
								['ʈ', 'ɖ']);
						case 6:
							var _v47 = _v0.a;
							var _v48 = _v0.b;
							return _List_fromArray(
								['c', 'ɟ']);
						case 7:
							var _v57 = _v0.a;
							var _v58 = _v0.b;
							return _List_fromArray(
								['k', 'g']);
						case 8:
							var _v67 = _v0.a;
							var _v68 = _v0.b;
							return _List_fromArray(
								['q', 'ɢ']);
						case 10:
							var _v79 = _v0.a;
							var _v80 = _v0.b;
							return _List_fromArray(
								['ʔ']);
						default:
							break _v0$41;
					}
				case 4:
					switch (_v0.a) {
						case 0:
							var _v7 = _v0.a;
							var _v8 = _v0.b;
							return _List_fromArray(
								['ɸ', 'β']);
						case 1:
							var _v9 = _v0.a;
							var _v10 = _v0.b;
							return _List_fromArray(
								['f', 'v']);
						case 2:
							var _v13 = _v0.a;
							var _v14 = _v0.b;
							return _List_fromArray(
								['θ', 'ð']);
						case 3:
							var _v23 = _v0.a;
							var _v24 = _v0.b;
							return _List_fromArray(
								['s', 'z']);
						case 4:
							var _v31 = _v0.a;
							var _v32 = _v0.b;
							return _List_fromArray(
								['ʃ', 'ʒ']);
						case 5:
							var _v41 = _v0.a;
							var _v42 = _v0.b;
							return _List_fromArray(
								['ʂ', 'ʐ']);
						case 6:
							var _v51 = _v0.a;
							var _v52 = _v0.b;
							return _List_fromArray(
								['ç', 'ʝ']);
						case 7:
							var _v61 = _v0.a;
							var _v62 = _v0.b;
							return _List_fromArray(
								['x', 'ɣ']);
						case 8:
							var _v73 = _v0.a;
							var _v74 = _v0.b;
							return _List_fromArray(
								['χ', 'ʁ']);
						case 9:
							var _v75 = _v0.a;
							var _v76 = _v0.b;
							return _List_fromArray(
								['ħ', 'ʕ']);
						case 10:
							var _v81 = _v0.a;
							var _v82 = _v0.b;
							return _List_fromArray(
								['h', 'ɦ']);
						default:
							break _v0$41;
					}
				default:
					break _v0$41;
			}
		}
		return _List_Nil;
	});
var $author$project$Main$getOtherSymbolPhonemes = function (symbolType) {
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
var $author$project$Main$getVowelPhonemesForCell = F2(
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
var $author$project$Main$heightToString = function (height) {
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
var $author$project$Main$mannerToString = function (manner) {
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
var $author$project$Main$otherSymbolTypeToString = function (symbolType) {
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
var $author$project$Main$placeToString = function (place) {
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
var $author$project$Main$viewIPACellModal = F2(
	function (model, allSounds) {
		var _v0 = model.bO;
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
							$author$project$Main$placeToString(place) + (' ' + $author$project$Main$mannerToString(manner)),
							A2($author$project$Main$getConsonantPhonemesForCell, place, manner));
					case 1:
						var height = cell.a;
						var backness = cell.b;
						return _Utils_Tuple2(
							$author$project$Main$heightToString(height) + (' ' + $author$project$Main$backnessToString(backness)),
							A2($author$project$Main$getVowelPhonemesForCell, height, backness));
					default:
						var symbolType = cell.a;
						return _Utils_Tuple2(
							$author$project$Main$otherSymbolTypeToString(symbolType),
							$author$project$Main$getOtherSymbolPhonemes(symbolType));
				}
			}();
			var cellTitle = _v1.a;
			var availablePhonemes = _v1.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-overlay'),
						$elm$html$Html$Events$onClick($author$project$Main$CloseIPACellModal)
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
													$author$project$Main$TogglePhonemeInCell(phoneme)),
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
										$elm$html$Html$Events$onClick($author$project$Main$CloseIPACellModal),
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
var $author$project$Main$OpenIPACellModal = function (a) {
	return {$: 151, a: a};
};
var $author$project$Main$OtherSymbolCell = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$VoicedAlveolarAffricate = 5;
var $author$project$Main$VoicedAlveoloPalatalAffricate = 9;
var $author$project$Main$VoicedLabialPalatalApproximant = 3;
var $author$project$Main$VoicedLabialVelarApproximant = 0;
var $author$project$Main$VoicedPostalveolarAffricate = 7;
var $author$project$Main$VoicedRetroflexAffricate = 11;
var $author$project$Main$VoicelessAlveolarAffricate = 4;
var $author$project$Main$VoicelessAlveoloPalatalAffricate = 8;
var $author$project$Main$VoicelessLabialPalatalApproximant = 2;
var $author$project$Main$VoicelessLabialVelarApproximant = 1;
var $author$project$Main$VoicelessPostalveolarAffricate = 6;
var $author$project$Main$VoicelessRetroflexAffricate = 10;
var $author$project$Main$classifyOtherSymbol = function (phoneme) {
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
var $author$project$Main$viewOtherSymbolsChart = F2(
	function (allSounds, model) {
		var getSoundsForCell = function (symbolType) {
			return A2(
				$elm$core$List$filter,
				function (sound) {
					var _v0 = $author$project$Main$classifyOtherSymbol(sound);
					if (!_v0.$) {
						var st = _v0.a;
						return _Utils_eq(st, symbolType);
					} else {
						return false;
					}
				},
				A2($elm$core$List$filter, $author$project$Main$isOtherSymbolSound, allSounds));
		};
		var makeCell = function (symbolType) {
			var cellSounds = getSoundsForCell(symbolType);
			var cellContent = $elm$core$List$isEmpty(cellSounds) ? _List_Nil : A2(
				$elm$core$List$map,
				function (s) {
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ipa-phoneme-display')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(s)
							]));
				},
				cellSounds);
			var availablePhonemes = $author$project$Main$getOtherSymbolPhonemes(symbolType);
			var hasChoices = !$elm$core$List$isEmpty(availablePhonemes);
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						hasChoices ? 'ipa-cell-clickable' : 'ipa-cell-non-clickable'),
						hasChoices ? $elm$html$Html$Events$onClick(
						$author$project$Main$OpenIPACellModal(
							$author$project$Main$OtherSymbolCell(symbolType))) : $elm$html$Html$Events$onClick($author$project$Main$NoOp),
						hasChoices ? $elm$html$Html$Attributes$title('Click to add/remove sounds') : $elm$html$Html$Attributes$title('')
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
var $author$project$Main$RemovePattern = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$TogglePatternSelection = function (a) {
	return {$: 11, a: a};
};
var $author$project$Main$viewSavedPattern = F2(
	function (selectedPatterns, pattern) {
		var isSelected = A2($elm$core$List$member, pattern.w, selectedPatterns);
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
									$author$project$Main$TogglePatternSelection(pattern.w))
								]),
							_List_Nil),
							$elm$html$Html$text(' ' + pattern.w)
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick(
							$author$project$Main$RemovePattern(pattern.w))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('×')
						]))
				]));
	});
var $author$project$Main$Alveolar = 3;
var $author$project$Main$Approximant = 6;
var $author$project$Main$Bilabial = 0;
var $author$project$Main$ConsonantCell = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Main$Dental = 2;
var $author$project$Main$Fricative = 4;
var $author$project$Main$Glottal = 10;
var $author$project$Main$Labiodental = 1;
var $author$project$Main$LateralApproximant = 7;
var $author$project$Main$LateralFricative = 5;
var $author$project$Main$Nasal = 1;
var $author$project$Main$Palatal = 6;
var $author$project$Main$Pharyngeal = 9;
var $author$project$Main$Plosive = 0;
var $author$project$Main$Postalveolar = 4;
var $author$project$Main$Retroflex = 5;
var $author$project$Main$TapFlap = 3;
var $author$project$Main$Trill = 2;
var $author$project$Main$Uvular = 8;
var $author$project$Main$Velar = 7;
var $author$project$Main$OtherManner = 8;
var $author$project$Main$OtherPlace = 11;
var $author$project$Main$classifyConsonant = function (phoneme) {
	switch (phoneme) {
		case 'p':
			return {l: 0, m: 0};
		case 'b':
			return {l: 0, m: 0};
		case 'm':
			return {l: 1, m: 0};
		case 'ɸ':
			return {l: 4, m: 0};
		case 'β':
			return {l: 4, m: 0};
		case 'f':
			return {l: 4, m: 1};
		case 'v':
			return {l: 4, m: 1};
		case 'θ':
			return {l: 4, m: 2};
		case 'ð':
			return {l: 4, m: 2};
		case 't':
			return {l: 0, m: 3};
		case 'd':
			return {l: 0, m: 3};
		case 'n':
			return {l: 1, m: 3};
		case 's':
			return {l: 4, m: 3};
		case 'z':
			return {l: 4, m: 3};
		case 'r':
			return {l: 2, m: 3};
		case 'ɾ':
			return {l: 3, m: 3};
		case 'l':
			return {l: 7, m: 3};
		case 'ʃ':
			return {l: 4, m: 4};
		case 'ʒ':
			return {l: 4, m: 4};
		case 'tʃ':
			return {l: 8, m: 4};
		case 'dʒ':
			return {l: 8, m: 4};
		case 'ʈ':
			return {l: 0, m: 5};
		case 'ʐ':
			return {l: 4, m: 5};
		case 'ɽ':
			return {l: 3, m: 5};
		case 'c':
			return {l: 0, m: 6};
		case 'ɟ':
			return {l: 0, m: 6};
		case 'ç':
			return {l: 4, m: 6};
		case 'ʝ':
			return {l: 4, m: 6};
		case 'ɲ':
			return {l: 1, m: 6};
		case 'j':
			return {l: 6, m: 6};
		case 'ʎ':
			return {l: 7, m: 6};
		case 'k':
			return {l: 0, m: 7};
		case 'g':
			return {l: 0, m: 7};
		case 'ŋ':
			return {l: 1, m: 7};
		case 'x':
			return {l: 4, m: 7};
		case 'ɣ':
			return {l: 4, m: 7};
		case 'q':
			return {l: 0, m: 8};
		case 'ɢ':
			return {l: 0, m: 8};
		case 'χ':
			return {l: 4, m: 8};
		case 'ʁ':
			return {l: 4, m: 8};
		case 'ħ':
			return {l: 4, m: 9};
		case 'ʕ':
			return {l: 4, m: 9};
		case 'h':
			return {l: 4, m: 10};
		case 'ʔ':
			return {l: 0, m: 10};
		default:
			return {l: 8, m: 11};
	}
};
var $author$project$Main$viewStaticConsonantChart = F2(
	function (allSounds, model) {
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
			_Utils_ap(
				A2(
					$elm$core$List$map,
					function (_v2) {
						var label = _v2.b;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('ipa-header-cell')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(label)
								]));
					},
					places),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('ipa-header-cell')
							]),
						_List_Nil)
					])));
		var getSoundsForCell = F2(
			function (place, manner) {
				return A2(
					$elm$core$List$filter,
					function (sound) {
						var classification = $author$project$Main$classifyConsonant(sound);
						return _Utils_eq(classification.m, place) && _Utils_eq(classification.l, manner);
					},
					A2($elm$core$List$filter, $author$project$Main$isConsonantSound, allSounds));
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
				var cells = A2(
					$elm$core$List$map,
					function (_v1) {
						var place = _v1.a;
						var cellSounds = A2(getSoundsForCell, place, manner);
						var cellContent = $elm$core$List$isEmpty(cellSounds) ? _List_Nil : A2(
							$elm$core$List$map,
							function (s) {
								return A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ipa-phoneme-display')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(s)
										]));
							},
							cellSounds);
						var availablePhonemes = A2($author$project$Main$getConsonantPhonemesForCell, place, manner);
						var hasChoices = !$elm$core$List$isEmpty(availablePhonemes);
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									hasChoices ? 'ipa-cell-clickable' : 'ipa-cell-non-clickable'),
									hasChoices ? $elm$html$Html$Events$onClick(
									$author$project$Main$OpenIPACellModal(
										A2($author$project$Main$ConsonantCell, place, manner))) : $elm$html$Html$Events$onClick($author$project$Main$NoOp),
									hasChoices ? $elm$html$Html$Attributes$title('Click to add/remove sounds') : $elm$html$Html$Attributes$title('')
								]),
							cellContent);
					},
					places);
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
var $author$project$Main$Back = 2;
var $author$project$Main$Central = 1;
var $author$project$Main$Close = 0;
var $author$project$Main$CloseMid = 2;
var $author$project$Main$Front = 0;
var $author$project$Main$Mid = 3;
var $author$project$Main$NearClose = 1;
var $author$project$Main$NearOpen = 5;
var $author$project$Main$Open = 6;
var $author$project$Main$OpenMid = 4;
var $author$project$Main$VowelCell = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Main$classifyVowel = function (phoneme) {
	switch (phoneme) {
		case 'i':
			return {s: 0, t: 0};
		case 'y':
			return {s: 0, t: 0};
		case 'ɨ':
			return {s: 1, t: 0};
		case 'ʉ':
			return {s: 1, t: 0};
		case 'ɯ':
			return {s: 2, t: 0};
		case 'u':
			return {s: 2, t: 0};
		case 'ɪ':
			return {s: 0, t: 1};
		case 'ʊ':
			return {s: 2, t: 1};
		case 'e':
			return {s: 0, t: 2};
		case 'ø':
			return {s: 0, t: 2};
		case 'ɘ':
			return {s: 1, t: 2};
		case 'ɵ':
			return {s: 1, t: 2};
		case 'ɤ':
			return {s: 2, t: 2};
		case 'o':
			return {s: 2, t: 2};
		case 'ə':
			return {s: 1, t: 3};
		case 'ɛ':
			return {s: 0, t: 4};
		case 'œ':
			return {s: 0, t: 4};
		case 'ɜ':
			return {s: 1, t: 4};
		case 'ɞ':
			return {s: 1, t: 4};
		case 'ʌ':
			return {s: 2, t: 4};
		case 'ɔ':
			return {s: 2, t: 4};
		case 'æ':
			return {s: 0, t: 5};
		case 'a':
			return {s: 0, t: 6};
		case 'ɑ':
			return {s: 2, t: 6};
		case 'ɒ':
			return {s: 2, t: 6};
		default:
			return {s: 1, t: 6};
	}
};
var $author$project$Main$viewStaticVowelChart = F2(
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
						var classification = $author$project$Main$classifyVowel(sound);
						return _Utils_eq(classification.t, height) && _Utils_eq(classification.s, backness);
					},
					A2($elm$core$List$filter, $author$project$Main$isVowelSound, allSounds));
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
						var cellContent = $elm$core$List$isEmpty(cellSounds) ? _List_Nil : A2(
							$elm$core$List$map,
							function (s) {
								return A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('ipa-phoneme-display')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(s)
										]));
							},
							cellSounds);
						var availablePhonemes = A2($author$project$Main$getVowelPhonemesForCell, height, backness);
						var hasChoices = !$elm$core$List$isEmpty(availablePhonemes);
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(
									hasChoices ? 'ipa-cell-clickable' : 'ipa-cell-non-clickable'),
									hasChoices ? $elm$html$Html$Events$onClick(
									$author$project$Main$OpenIPACellModal(
										A2($author$project$Main$VowelCell, height, backness))) : $elm$html$Html$Events$onClick($author$project$Main$NoOp),
									hasChoices ? $elm$html$Html$Attributes$title('Click to add/remove sounds') : $elm$html$Html$Attributes$title('')
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
var $author$project$Main$viewPhonology = function (model) {
	var allSounds = A2(
		$elm$core$List$concatMap,
		function ($) {
			return $.u;
		},
		model.a.c.n.k);
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
						$elm$html$Html$text('Phonology')
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
				A2($author$project$Main$viewStaticConsonantChart, allSounds, model),
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
				A2($author$project$Main$viewOtherSymbolsChart, allSounds, model),
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
				A2($author$project$Main$viewStaticVowelChart, allSounds, model),
				model.bP ? A2($author$project$Main$viewIPACellModal, model, allSounds) : $elm$html$Html$text(''),
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
							$author$project$Main$viewSavedPattern(model.ax),
							model.a.c.n.aa)),
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
										$elm$html$Html$Attributes$placeholder('Pattern (e.g., CV, C(C)V, (C)V(C))'),
										$elm$html$Html$Attributes$value(model.bk),
										$elm$html$Html$Events$onInput($author$project$Main$UpdatePatternInput)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$AddPattern)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Save Pattern')
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
								$elm$html$Html$text('Use category labels (e.g., C, V) and parentheses () for optional sounds')
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
								$elm$html$Html$text('Phonotactic Constraints')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('phoneme-list')
							]),
						A2($elm$core$List$map, $author$project$Main$viewConstraint, model.a.c.n.U)),
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
										A2($elm$core$Basics$composeL, $author$project$Main$SelectConstraintType, $author$project$Main$stringToConstraintType)),
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
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Sequence (e.g., tl, ŋ, r)'),
										$elm$html$Html$Attributes$value(model.a8),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateConstraintInput),
										A2($elm$html$Html$Attributes$style, 'flex', '1'),
										A2($elm$html$Html$Attributes$style, 'min-width', '200px')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$AddConstraint)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Add Constraint')
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
								$author$project$Main$constraintTypeExplanation(model.x))
							]))
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
						$elm$html$Html$h3,
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
								$elm$html$Html$text('Define how IPA phonemes map to orthographic symbols. Words will display both IPA (with syllable separators) and orthography.')
							])),
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
								$elm$html$Html$text('Define how phonemes are written. Supports digraphs (e.g., /θ/ → th, /ʃ/ → sh).')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('phoneme-list')
							]),
						A2($elm$core$List$map, $author$project$Main$viewGraphemeMapping, model.a.c.n.r.S)),
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
										$elm$html$Html$Attributes$placeholder('Phoneme (e.g., θ, ʃ, tʃ)'),
										$elm$html$Html$Attributes$value(model.bd),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateGraphemePhonemeInput),
										A2($elm$html$Html$Attributes$style, 'width', '150px')
									]),
								_List_Nil),
								$elm$html$Html$text(' → '),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Grapheme (e.g., th, sh, ch)'),
										$elm$html$Html$Attributes$value(model.bc),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateGraphemeGraphemeInput),
										A2($elm$html$Html$Attributes$style, 'width', '150px')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('text'),
										$elm$html$Html$Attributes$placeholder('Description (optional)'),
										$elm$html$Html$Attributes$value(model.aY),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateGraphemeDescriptionInput),
										A2($elm$html$Html$Attributes$style, 'width', '200px')
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Main$AddGraphemeMapping)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Add Mapping')
									]))
							]))
					]))
			]));
};
var $author$project$Main$SwitchTab = function (a) {
	return {$: 45, a: a};
};
var $author$project$Main$viewTabs = function (model) {
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
						(model.aV === 'phonology') ? 'tab active' : 'tab'),
						$elm$html$Html$Events$onClick(
						$author$project$Main$SwitchTab('phonology'))
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
						(model.aV === 'morphology') ? 'tab active' : 'tab'),
						$elm$html$Html$Events$onClick(
						$author$project$Main$SwitchTab('morphology'))
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
						(model.aV === 'lexicon') ? 'tab active' : 'tab'),
						$elm$html$Html$Events$onClick(
						$author$project$Main$SwitchTab('lexicon'))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Lexicon')
					]))
			]));
};
var $author$project$Main$AddAllGeneratedWordsToLexicon = {$: 137};
var $author$project$Main$GenerateWords = {$: 32};
var $author$project$Main$MarkovGeneration = 1;
var $author$project$Main$SelectGenerationMethod = function (a) {
	return {$: 129, a: a};
};
var $author$project$Main$UpdateMarkovMaxLength = function (a) {
	return {$: 132, a: a};
};
var $author$project$Main$UpdateMarkovMinLength = function (a) {
	return {$: 131, a: a};
};
var $author$project$Main$UpdateMarkovOrder = function (a) {
	return {$: 130, a: a};
};
var $author$project$Main$UpdateTemplateMaxSyllables = function (a) {
	return {$: 134, a: a};
};
var $author$project$Main$UpdateTemplateMinSyllables = function (a) {
	return {$: 133, a: a};
};
var $author$project$Main$UpdateWordGenerationCount = function (a) {
	return {$: 135, a: a};
};
var $elm$html$Html$Attributes$max = $elm$html$Html$Attributes$stringProperty('max');
var $elm$html$Html$Attributes$min = $elm$html$Html$Attributes$stringProperty('min');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$Main$AddGeneratedWordToLexicon = function (a) {
	return {$: 136, a: a};
};
var $author$project$Main$viewGeneratedWord = F2(
	function (orthography, word) {
		var orthographyForm = A2(
			$author$project$Main$applyOrthography,
			orthography.S,
			$author$project$Main$removeSyllableSeparators(word));
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
							$author$project$Main$AddGeneratedWordToLexicon(word)),
							$elm$html$Html$Attributes$title('Add to lexicon')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('+')
						]))
				]));
	});
var $author$project$Main$viewPatternButton = F2(
	function (selectedPatterns, pattern) {
		var isSelected = A2($elm$core$List$member, pattern.w, selectedPatterns);
		var buttonClass = isSelected ? 'pattern-button pattern-button-selected' : 'pattern-button';
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(buttonClass),
					$elm$html$Html$Events$onClick(
					$author$project$Main$TogglePatternSelection(pattern.w))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(pattern.w)
				]));
	});
var $author$project$Main$viewWordGenerator = function (model) {
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
						$elm$html$Html$text('Word Generator')
					])),
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
												$elm$html$Html$Attributes$checked(!model.aJ),
												$elm$html$Html$Events$onClick(
												$author$project$Main$SelectGenerationMethod(0))
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
												$elm$html$Html$Attributes$checked(model.aJ === 1),
												$elm$html$Html$Events$onClick(
												$author$project$Main$SelectGenerationMethod(1))
											]),
										_List_Nil),
										$elm$html$Html$text(' Markov Chain (learns from lexicon)')
									]))
							]))
					])),
				(!model.aJ) ? A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						(!$elm$core$List$isEmpty(model.a.c.n.aa)) ? A2(
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
									$author$project$Main$viewPatternButton(model.ax),
									model.a.c.n.aa))
							])) : A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('help-text')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No saved patterns. Add patterns in the Phonology section above.')
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
										'Min Syllables: ' + $elm$core$String$fromInt(model.aT))
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('range'),
										$elm$html$Html$Attributes$min('1'),
										$elm$html$Html$Attributes$max('10'),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.aT)),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateTemplateMinSyllables)
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
										'Max Syllables: ' + $elm$core$String$fromInt(model.bC))
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('range'),
										$elm$html$Html$Attributes$min(
										$elm$core$String$fromInt(model.aT)),
										$elm$html$Html$Attributes$max('10'),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.bC)),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateTemplateMaxSyllables)
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
				(model.aJ === 1) ? A2(
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
									$elm$core$List$length(model.a.c.e)) + ' words.'))
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
										$elm$core$String$fromInt(model.a$)),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateMarkovOrder)
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
										$elm$core$String$fromInt(model.a_)),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateMarkovMinLength)
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
										$elm$core$String$fromInt(model.a_)),
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(model.bM)),
										$elm$html$Html$Events$onInput($author$project$Main$UpdateMarkovMaxLength)
									]),
								_List_Nil)
							]))
					])) : $elm$html$Html$text(''),
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
								$elm$core$String$fromInt(model.al)),
								$elm$html$Html$Events$onInput($author$project$Main$UpdateWordGenerationCount)
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
						$elm$html$Html$Events$onClick($author$project$Main$GenerateWords)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Generate ' + ($elm$core$String$fromInt(model.al) + (' Word' + ((model.al === 1) ? '' : 's'))))
					])),
				$elm$core$List$isEmpty(model.B) ? $elm$html$Html$text('') : A2(
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
										$elm$html$Html$Events$onClick($author$project$Main$AddAllGeneratedWordsToLexicon),
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
							$author$project$Main$viewGeneratedWord(model.a.c.n.r),
							model.B))
					]))
			]));
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('app')
			]),
		_List_fromArray(
			[
				$author$project$Main$viewHeader(model),
				$author$project$Main$viewTabs(model),
				function () {
				var _v0 = model.aV;
				switch (_v0) {
					case 'phonology':
						return A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$author$project$Main$viewPhonology(model),
									$author$project$Main$viewWordGenerator(model)
								]));
					case 'morphology':
						return $author$project$Main$viewMorphology(model);
					case 'lexicon':
						return $author$project$Main$viewLexicon(model);
					default:
						return A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$author$project$Main$viewPhonology(model),
									$author$project$Main$viewWordGenerator(model)
								]));
				}
			}(),
				$author$project$Main$viewActions(model),
				function () {
				var _v1 = model.a7;
				if (!_v1.$) {
					var projectId = _v1.a;
					return A2($author$project$Main$viewDeleteProjectConfirm, projectId, model.aL);
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{cD: $author$project$Main$init, cL: $author$project$Main$subscriptions, cN: $author$project$Main$update, cO: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));