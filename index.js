// Initialize the Elm application after database is ready
let app = null;

// IndexedDB setup
const DB_NAME = 'clctk-db';
// Note: Version reset from 9 to 1 to start fresh with simplified schema.
// Complex migration logic was removed in favor of clean slate approach.
// Users upgrading from older versions will have their database recreated.
// Version 2: Updated templates to use UUID instead of auto-increment ID
const DB_VERSION = 2;
const STORE_NAME = 'languages';
const TEMPLATE_STORE_NAME = 'templates';
const FAMILY_STORE_NAME = 'language-families';
const PROJECT_STORE_NAME = 'language-projects';
const APP_VERSION = '1.0.0';  // Reset to 1.0 with simplified database

let db = null;

// Open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
    console.log('Opening database...');
    
    // Try to open the database first to check its version
    const checkRequest = indexedDB.open(DB_NAME);
    
    checkRequest.onsuccess = (event) => {
      const existingDb = event.target.result;
      const currentVersion = existingDb.version;
      existingDb.close();
      
      console.log(`Found existing database with version ${currentVersion}`);
      
      // If database exists with a different version (and not a brand new db), delete and recreate
      if (currentVersion > 0 && currentVersion !== DB_VERSION) {
        console.log(`Database version mismatch (current: ${currentVersion}, expected: ${DB_VERSION}). Deleting old database...`);
        
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
        
        deleteRequest.onsuccess = () => {
          console.log('Old database deleted successfully');
          openDatabaseInternal(resolve, reject);
        };
        
        deleteRequest.onerror = (event) => {
          console.error('Failed to delete old database:', event);
          reject(new Error('Failed to delete incompatible database version'));
        };
        
        deleteRequest.onblocked = () => {
          console.error('Database deletion blocked - please close all other tabs with this app');
          reject(new Error('Cannot upgrade database - other tabs are using it. Please close all other tabs and try again.'));
        };
      } else {
        // Database is compatible or new, open it normally
        console.log(`Database version ${currentVersion === DB_VERSION ? 'matches' : 'will be initialized to'} ${DB_VERSION}, opening...`);
        openDatabaseInternal(resolve, reject);
      }
    };
    
    checkRequest.onerror = (event) => {
      // Could be that database doesn't exist, or there's a permission/storage issue
      console.log('Database check failed, attempting to create new database...');
      console.log('If this fails, check browser permissions and storage quota');
      openDatabaseInternal(resolve, reject);
    };
  });
}

function openDatabaseInternal(resolve, reject) {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = () => {
    reject(new Error('Failed to open database'));
  };

  request.onsuccess = () => {
    db = request.result;
    resolve(db);
  };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      const oldVersion = event.oldVersion;
      
      console.log(`Database upgrade: version ${oldVersion} -> ${DB_VERSION}`);
      
      // Clear any existing object stores (clean slate approach)
      const storeNames = Array.from(database.objectStoreNames);
      storeNames.forEach(storeName => {
        console.log(`Removing old object store: ${storeName}`);
        database.deleteObjectStore(storeName);
      });
      
      // Create all object stores fresh
      console.log('Creating languages store with uuid keyPath');
      database.createObjectStore(STORE_NAME, { keyPath: 'uuid' });
      
      console.log('Creating templates store with uuid keyPath');
      database.createObjectStore(TEMPLATE_STORE_NAME, { keyPath: 'uuid' });
      
      console.log('Creating language-families store with uuid keyPath');
      database.createObjectStore(FAMILY_STORE_NAME, { keyPath: 'uuid' });
      
      console.log('Creating language-projects store with uuid keyPath');
      database.createObjectStore(PROJECT_STORE_NAME, { keyPath: 'uuid' });
      
      console.log('Database schema created successfully');
    };
}

// Generate a UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Save language to IndexedDB
function saveToIndexedDB(languageData) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // Add timestamp if not present
  const dataToStore = {
    ...languageData,
    lastModified: languageData.lastModified || new Date().toISOString()
  };

  // If uuid is empty or not set, generate one
  if (!dataToStore.uuid || dataToStore.uuid === '') {
    dataToStore.uuid = generateUUID();
    const request = store.add(dataToStore);
    request.onsuccess = () => {
      console.log('New language created with UUID:', dataToStore.uuid);
      // Load the newly created language back
      loadProjectByIdInternal(dataToStore.uuid);
    };
    request.onerror = () => {
      console.error('Failed to save new language to IndexedDB');
    };
  } else {
    // Update existing language
    const request = store.put(dataToStore);
    request.onsuccess = () => {
      console.log('Language updated in IndexedDB');
    };
    request.onerror = () => {
      console.error('Failed to update language in IndexedDB');
    };
  }
}

// Load the first language or a specific language from IndexedDB
function loadFromIndexedDB() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  
  // Try to get the first language
  const cursorRequest = store.openCursor();
  cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
      console.log('First language loaded from IndexedDB');
      app.ports.loadFromStorage.send(cursor.value);
    } else {
      console.log('No languages found in IndexedDB');
    }
  };

  cursorRequest.onerror = () => {
    console.error('Failed to load language from IndexedDB');
  };
}

// Load all languages (metadata only)
function loadAllProjects() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();

  request.onsuccess = () => {
    const languages = request.result.map(lang => ({
      uuid: lang.uuid,
      name: lang.name,
      created: lang.created || '',
      lastModified: lang.lastModified || ''
    }));
    console.log('All languages loaded:', languages.length);
    app.ports.receiveAllProjects.send(languages);
  };

  request.onerror = () => {
    console.error('Failed to load all languages');
  };
}

// Load a specific language by UUID
function loadProjectByIdInternal(languageUuid) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(languageUuid);

  request.onsuccess = () => {
    if (request.result) {
      console.log('Language loaded by UUID:', languageUuid);
      app.ports.receiveProject.send(request.result);
    } else {
      console.error('Language not found with UUID:', languageUuid);
    }
  };

  request.onerror = () => {
    console.error('Failed to load language by UUID');
  };
}

// Delete a language by UUID
function deleteProjectById(languageUuid) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.delete(languageUuid);

  request.onsuccess = () => {
    console.log('Language deleted:', languageUuid);
    // Reload the language list
    loadAllProjects();
  };

  request.onerror = () => {
    console.error('Failed to delete language');
  };
}

// Duplicate a language by UUID
function duplicateProjectById(languageUuid) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  // First, load the language to duplicate
  const readTransaction = db.transaction([STORE_NAME], 'readonly');
  const readStore = readTransaction.objectStore(STORE_NAME);
  const getRequest = readStore.get(languageUuid);

  getRequest.onsuccess = () => {
    if (!getRequest.result) {
      console.error('Language not found with UUID:', languageUuid);
      return;
    }

    const originalLanguage = getRequest.result;
    
    // Smart naming: avoid "Copy (Copy)" by using numbering
    let baseName = originalLanguage.name;
    if (baseName.endsWith(' (Copy)')) {
      baseName = baseName.substring(0, baseName.length - 7);
    } else if (baseName.match(/ \(Copy \d+\)$/)) {
      // Remove " (Copy N)" from the end
      baseName = baseName.replace(/ \(Copy \d+\)$/, '');
    }
    
    // Load all languages to find existing copies
    const allLanguagesRequest = readStore.getAll();
    
    allLanguagesRequest.onsuccess = () => {
      const allLanguages = allLanguagesRequest.result;
      
      // Count how many languages start with the base name
      const existingCopies = allLanguages.filter(lang => 
        lang.name.startsWith(baseName)
      ).length;
      
      // Generate the new name
      let newName;
      if (existingCopies === 1) {
        newName = baseName + ' (Copy)';
      } else {
        newName = baseName + ' (Copy ' + existingCopies + ')';
      }
      
      // Create a duplicate with the new name, new UUID, and timestamps
      const duplicateLanguage = {
        ...originalLanguage,
        uuid: generateUUID(),
        name: newName,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };

      // Save the duplicate
      const writeTransaction = db.transaction([STORE_NAME], 'readwrite');
      const writeStore = writeTransaction.objectStore(STORE_NAME);
      const addRequest = writeStore.add(duplicateLanguage);

      addRequest.onsuccess = () => {
        console.log('Language duplicated with new UUID:', duplicateLanguage.uuid);
        // Reload the language list to show the new duplicate
        loadAllProjects();
      };

      addRequest.onerror = () => {
        console.error('Failed to duplicate language');
      };
    };
    
    allLanguagesRequest.onerror = () => {
      console.error('Failed to load all languages for duplication');
    };
  };

  getRequest.onerror = () => {
    console.error('Failed to load language for duplication');
  };
}

// Rename a language by UUID
function renameProjectById(languageUuid, newName) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const getRequest = store.get(languageUuid);

  getRequest.onsuccess = () => {
    if (!getRequest.result) {
      console.error('Language not found with UUID:', languageUuid);
      return;
    }

    const language = getRequest.result;
    language.name = newName;
    language.lastModified = new Date().toISOString();

    const updateRequest = store.put(language);

    updateRequest.onsuccess = () => {
      console.log('Language renamed successfully');
      // Reload the language list to show the updated name
      loadAllProjects();
      // If this is the current language, also reload it to update the UI
      loadProjectByIdInternal(languageUuid);
    };

    updateRequest.onerror = () => {
      console.error('Failed to rename language');
    };
  };

  getRequest.onerror = () => {
    console.error('Failed to load language for renaming');
  };
}

// Export project as JSON file
function exportProjectToFile(exportData) {
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `clctk-export-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  console.log('Project exported as JSON');
}

// Port subscriptions setup function
function setupPortSubscriptions() {
  if (!app) {
    console.error('App not initialized yet');
    return;
  }

  // Helper function to safely subscribe to a port
  function safeSubscribe(portName, callback) {
    try {
      if (app.ports && app.ports[portName] && app.ports[portName].subscribe) {
        app.ports[portName].subscribe(callback);
      } else {
        console.warn(`Port ${portName} not available`);
      }
    } catch (error) {
      console.error(`Error subscribing to port ${portName}:`, error);
    }
  }

  safeSubscribe('saveToStorage', (data) => {
    saveToIndexedDB(data);
  });

  safeSubscribe('exportProject', (data) => {
    exportProjectToFile(data);
  });

  safeSubscribe('getCurrentTime', () => {
    const timestamp = new Date().toISOString();
    app.ports.receiveCurrentTime.send(timestamp);
  });

  safeSubscribe('loadAllProjects', () => {
    loadAllProjects();
  });

  safeSubscribe('deleteProjectById', (projectId) => {
    deleteProjectById(projectId);
  });

  safeSubscribe('duplicateProjectById', (projectId) => {
    duplicateProjectById(projectId);
  });

  safeSubscribe('renameProjectById', (data) => {
    renameProjectById(data.projectId, data.newName);
  });

  safeSubscribe('loadProjectById', (projectId) => {
    loadProjectByIdInternal(projectId);
  });

  // Handle import trigger
  safeSubscribe('triggerImport', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonStr = e.target.result;
          // Parse to validate it's valid JSON
          const parsed = JSON.parse(jsonStr);
          // Send the project data (not the wrapper)
          if (parsed.project) {
            app.ports.receiveImportData.send(JSON.stringify(parsed.project));
          } else {
            // If it's already a project object (old format), send as is
            app.ports.receiveImportData.send(jsonStr);
          }
        } catch (error) {
          console.error('Failed to parse imported JSON:', error);
          // Send invalid JSON to trigger Elm-side error handling
          app.ports.receiveImportData.send('{"invalid": true}');
        }
      };
      reader.onerror = () => {
        console.error('Failed to read file');
        // Send invalid JSON to trigger Elm-side error handling
        app.ports.receiveImportData.send('{"invalid": true}');
      };
      reader.readAsText(file);
    }
  };
  
  input.click();
  });

  // Export lexicon as CSV
  safeSubscribe('exportCSV', (csvContent) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'lexicon-' + new Date().toISOString().split('T')[0] + '.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  });

  // Import CSV file
  safeSubscribe('triggerCSVImport', () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.csv,text/csv';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        app.ports.receiveCSVData.send(event.target.result);
      };
      reader.onerror = () => {
        console.error('Failed to read CSV file');
        // Send empty string to trigger error handling
        app.ports.receiveCSVData.send('');
      };
      reader.readAsText(file);
    }
  };
  
  input.click();
  });

  // Port subscriptions for templates
  safeSubscribe('saveTemplateToStorage', (data) => {
    saveTemplateToIndexedDB(data);
  });

  safeSubscribe('loadAllTemplates', () => {
    // If database is not ready, wait a bit and try again
    if (!db) {
      setTimeout(() => {
        loadAllTemplates();
      }, 100);
    } else {
      loadAllTemplates();
    }
  });

  safeSubscribe('deleteTemplateById', (templateId) => {
    deleteTemplateById(templateId);
  });

  safeSubscribe('savePreference', (data) => {
    savePreference(data);
  });

  safeSubscribe('loadPreferences', () => {
    loadPreferences();
  });

  // Port subscriptions for language families
  safeSubscribe('saveLanguageFamily', (data) => {
    saveLanguageFamilyToIndexedDB(data);
  });

  safeSubscribe('loadAllLanguageFamilies', () => {
    // If database is not ready, wait a bit and try again
    if (!db) {
      setTimeout(() => {
        loadAllLanguageFamilies();
      }, 100);
    } else {
      loadAllLanguageFamilies();
    }
  });

  safeSubscribe('deleteLanguageFamilyById', (familyId) => {
    deleteLanguageFamilyById(familyId);
  });

  // Port subscriptions for language projects
  safeSubscribe('saveLanguageProject', (data) => {
    saveLanguageProjectToIndexedDB(data);
  });

  safeSubscribe('loadAllLanguageProjects', () => {
    // If database is not ready, wait a bit and try again
    if (!db) {
      setTimeout(() => {
        loadAllLanguageProjects();
      }, 100);
    } else {
      loadAllLanguageProjects();
    }
  });

  safeSubscribe('deleteLanguageProjectByUuid', (projectUuid) => {
    deleteLanguageProjectByUuid(projectUuid);
  });

  // Handle cursor position insertions
  safeSubscribe('insertAtCursor', (data) => {
    const element = document.getElementById(data.fieldId);
    if (element) {
      const start = element.selectionStart || 0;
      const end = element.selectionEnd || 0;
      const value = element.value;
      
      // Insert text at cursor position
      const newValue = value.substring(0, start) + data.text + value.substring(end);
      element.value = newValue;
      
      // Set cursor position after inserted text
      const newCursorPos = start + data.text.length;
      element.selectionStart = newCursorPos;
      element.selectionEnd = newCursorPos;
      
      // Trigger input event to update Elm model
      const event = new Event('input', { bubbles: true });
      element.dispatchEvent(event);
      
      // Optionally refocus the element
      element.focus();
    }
  });

  // UUID generation
  safeSubscribe('requestUUID', () => {
    // Use crypto.randomUUID if available, otherwise fallback to a simple implementation
    let uuid;
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      uuid = crypto.randomUUID();
    } else {
      // Fallback UUID v4 implementation
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    app.ports.receiveUUID.send(uuid);
  });

  // eSpeak TTS port subscriptions
  safeSubscribe('speakPhoneme', (phoneme) => {
    console.log('[Port] speakPhoneme received:', phoneme);
    speakPhonemeWithEspeak(phoneme);
  });

  safeSubscribe('stopSpeaking', () => {
    console.log('[Port] stopSpeaking received');
    stopCurrentSpeech();
  });
}

// Save template to IndexedDB
function saveTemplateToIndexedDB(templateData) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([TEMPLATE_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(TEMPLATE_STORE_NAME);

  // Generate UUID if not present
  if (!templateData.uuid || templateData.uuid === '') {
    templateData.uuid = generateUUID();
  }
  
  const request = store.put(templateData);
  request.onsuccess = () => {
    console.log('Template saved with UUID:', templateData.uuid);
    // Reload templates
    loadAllTemplates();
  };
  request.onerror = () => {
    console.error('Failed to save template to IndexedDB');
  };
}

// Load all templates
function loadAllTemplates() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([TEMPLATE_STORE_NAME], 'readonly');
  const store = transaction.objectStore(TEMPLATE_STORE_NAME);
  const request = store.getAll();

  request.onsuccess = () => {
    console.log('All templates loaded:', request.result.length);
    app.ports.receiveAllTemplates.send(request.result);
  };

  request.onerror = () => {
    console.error('Failed to load all templates');
  };
}

// Delete a template by ID
function deleteTemplateById(templateId) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([TEMPLATE_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(TEMPLATE_STORE_NAME);
  const request = store.delete(templateId);

  request.onsuccess = () => {
    console.log('Template deleted:', templateId);
    // Reload the template list
    loadAllTemplates();
  };

  request.onerror = () => {
    console.error('Failed to delete template');
  };
}

// Preferences management using localStorage
const PREFERENCES_KEY = 'clctk-preferences';

function savePreference(data) {
  try {
    let preferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    // Merge new preferences
    Object.assign(preferences, data);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    console.log('Preference saved:', data);
  } catch (error) {
    console.error('Failed to save preference:', error);
  }
}

function loadPreferences() {
  try {
    const preferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    console.log('Preferences loaded:', preferences);
    app.ports.receivePreferences.send(preferences);
  } catch (error) {
    console.error('Failed to load preferences:', error);
    app.ports.receivePreferences.send({});
  }
}



// Language Family Management Functions

// Save language family to IndexedDB
function saveLanguageFamilyToIndexedDB(familyData) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  // Generate UUID if not present
  if (!familyData.uuid || familyData.uuid === '') {
    familyData.uuid = generateUUID();
  }

  const transaction = db.transaction([FAMILY_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(FAMILY_STORE_NAME);
  
  const request = store.put(familyData);
  request.onsuccess = () => {
    console.log('Language family saved:', familyData.uuid);
    // Reload language families
    loadAllLanguageFamilies();
  };
  request.onerror = () => {
    console.error('Failed to save language family to IndexedDB');
  };
}

// Load all language families
function loadAllLanguageFamilies() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([FAMILY_STORE_NAME], 'readonly');
  const store = transaction.objectStore(FAMILY_STORE_NAME);
  const request = store.getAll();

  request.onsuccess = () => {
    console.log('All language families loaded:', request.result.length);
    app.ports.receiveAllLanguageFamilies.send(request.result);
  };

  request.onerror = () => {
    console.error('Failed to load all language families');
  };
}

// Delete a language family by UUID
function deleteLanguageFamilyById(familyUuid) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([FAMILY_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(FAMILY_STORE_NAME);
  const request = store.delete(familyUuid);

  request.onsuccess = () => {
    console.log('Language family deleted:', familyUuid);
    // Reload the family list
    loadAllLanguageFamilies();
  };

  request.onerror = () => {
    console.error('Failed to delete language family');
  };
}



// Language Projects functions
function saveLanguageProjectToIndexedDB(projectData) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  // Generate UUID if not present
  if (!projectData.uuid || projectData.uuid === '') {
    projectData.uuid = generateUUID();
  }

  const transaction = db.transaction([PROJECT_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(PROJECT_STORE_NAME);
  
  const request = store.put(projectData);
  request.onsuccess = () => {
    console.log('Language project saved:', projectData.uuid);
    // Reload language projects
    loadAllLanguageProjects();
  };
  request.onerror = () => {
    console.error('Failed to save language project to IndexedDB');
  };
}

// Load all language projects
function loadAllLanguageProjects() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([PROJECT_STORE_NAME], 'readonly');
  const store = transaction.objectStore(PROJECT_STORE_NAME);
  const request = store.getAll();

  request.onsuccess = () => {
    console.log('All language projects loaded:', request.result.length);
    app.ports.receiveAllLanguageProjects.send(request.result);
  };

  request.onerror = () => {
    console.error('Failed to load all language projects');
  };
}

// Delete a language project by UUID
function deleteLanguageProjectByUuid(projectUuid) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([PROJECT_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(PROJECT_STORE_NAME);
  const request = store.delete(projectUuid);

  request.onsuccess = () => {
    console.log('Language project deleted:', projectUuid);
    // Reload the project list
    loadAllLanguageProjects();
  };

  request.onerror = () => {
    console.error('Failed to delete language project');
  };
}



// Save app version to preferences
function initializeAppVersion() {
  try {
    const preferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    
    // Set or update app version
    if (preferences.appVersion !== APP_VERSION) {
      console.log('Initializing app version', APP_VERSION);
      savePreference({ appVersion: APP_VERSION, initialized: new Date().toISOString() });
    }
    
    return Promise.resolve();
  } catch (error) {
    console.error('Version initialization error:', error);
    return Promise.reject(error);
  }
}


// ============================================
// eSpeak-ng TTS Integration
// ============================================
//
// This library has been rebuilt from the echogarden-project/espeak-ng fork
// with the espeakPHONEMES flag enabled. The [[...]] bracket notation now works
// for phoneme input.
//
// Build source: https://github.com/echogarden-project/espeak-ng (fork branch)
// Key change in espeakng_glue.cpp:
//   espeak_Synth(aText, 0, 0, POS_CHARACTER, 0, espeakCHARS_UTF8 | espeakSSML | espeakPHONEMES, NULL, NULL);
//
// ============================================

// IPA to eSpeak phoneme mapping
// 
// eSpeak-ng phoneme names are based on Kirshenbaum ASCII-IPA with some X-SAMPA influences.
// This mapping converts IPA symbols to eSpeak phoneme notation.
//
// References:
// - Kirshenbaum ASCII-IPA: https://github.com/espeak-ng/espeak-ng/blob/master/docs/phonemes/kirshenbaum.md
// - X-SAMPA: https://github.com/espeak-ng/espeak-ng/blob/master/docs/phonemes/xsampa.md
// - eSpeak phonemes: https://github.com/espeak-ng/espeak-ng/blob/master/docs/phonemes.md
// - English lexical sets: https://github.com/espeak-ng/espeak-ng/blob/master/docs/languages/gmw/en.md
//
// The mapping follows: IPA → Kirshenbaum/X-SAMPA → eSpeak phoneme name
//
const ipaToEspeakMap = {
  // ============================================
  // CONSONANTS
  // ============================================
  
  // --- Plosives (stops) ---
  // Kirshenbaum: p, b, t, d, t., d., c, J, k, g, q, G, ?
  'p': 'p',
  'b': 'b',
  't': 't',
  'd': 'd',
  'ʈ': 't`',              // Retroflex t (X-SAMPA: t`, Kirshenbaum: t.)
  'ɖ': 'd`',              // Retroflex d (X-SAMPA: d`, Kirshenbaum: d.)
  'c': 'c',               // Voiceless palatal plosive
  'ɟ': 'J\\',             // Voiced palatal plosive (X-SAMPA: J\, Kirshenbaum: J)
  'k': 'k',
  'g': 'g',
  'ɡ': 'g',               // IPA g variant (U+0261)
  'q': 'q',               // Voiceless uvular plosive
  'ɢ': 'G\\',             // Voiced uvular plosive (X-SAMPA: G\, Kirshenbaum: G)
  'ʔ': '?',               // Glottal stop
  
  // --- Nasals ---
  // Kirshenbaum: m, M, n, n., n^, N, n"
  'm': 'm',               // Bilabial nasal
  'ɱ': 'F',               // Labiodental nasal (X-SAMPA: F, Kirshenbaum: M)
  'n': 'n',               // Alveolar nasal
  'ɳ': 'n`',              // Retroflex nasal (X-SAMPA: n`, Kirshenbaum: n.)
  'ɲ': 'J',               // Palatal nasal (X-SAMPA: J, Kirshenbaum: n^)
  'ŋ': 'N',               // Velar nasal
  'ɴ': 'N\\',             // Uvular nasal (X-SAMPA: N\, Kirshenbaum: n")
  
  // --- Trills ---
  // Kirshenbaum: r<trl>, B<trl>, R<trl>
  'ʙ': 'B\\',             // Bilabial trill (X-SAMPA: B\)
  'r': 'r',               // Alveolar trill
  'ʀ': 'R\\',             // Uvular trill (X-SAMPA: R\)
  
  // --- Taps/Flaps ---
  // Kirshenbaum: *, r.
  'ⱱ': 'v\\',             // Labiodental flap (X-SAMPA: v\)
  'ɾ': '4',               // Alveolar tap (X-SAMPA: 4, Kirshenbaum: *)
  'ɽ': 'r`',              // Retroflex flap (X-SAMPA: r`)
  
  // --- Fricatives ---
  // Kirshenbaum: P, B, f, v, T, D, s, z, S, Z, s., z., C, C<vcd>, x, Q, X, g", H, H<vcd>, h, h<?>
  'ɸ': 'p\\',             // Voiceless bilabial fricative (X-SAMPA: p\, Kirshenbaum: P)
  'β': 'B',               // Voiced bilabial fricative
  'f': 'f',               // Voiceless labiodental fricative
  'v': 'v',               // Voiced labiodental fricative
  'θ': 'T',               // Voiceless dental fricative
  'ð': 'D',               // Voiced dental fricative
  's': 's',               // Voiceless alveolar fricative
  'z': 'z',               // Voiced alveolar fricative
  'ʃ': 'S',               // Voiceless postalveolar fricative
  'ʒ': 'Z',               // Voiced postalveolar fricative
  'ʂ': 's`',              // Voiceless retroflex fricative (X-SAMPA: s`)
  'ʐ': 'z`',              // Voiced retroflex fricative (X-SAMPA: z`)
  'ɕ': 's\\',             // Voiceless alveolo-palatal fricative (X-SAMPA: s\)
  'ʑ': 'z\\',             // Voiced alveolo-palatal fricative (X-SAMPA: z\)
  'ç': 'C',               // Voiceless palatal fricative
  'ʝ': 'j\\',             // Voiced palatal fricative (X-SAMPA: j\, Kirshenbaum: C<vcd>)
  'x': 'x',               // Voiceless velar fricative
  'ɣ': 'G',               // Voiced velar fricative (X-SAMPA: G, Kirshenbaum: Q)
  'χ': 'X',               // Voiceless uvular fricative
  'ʁ': 'R',               // Voiced uvular fricative (X-SAMPA: R, Kirshenbaum: g")
  'ħ': 'X\\',             // Voiceless pharyngeal fricative (X-SAMPA: X\, Kirshenbaum: H)
  'ʕ': '?\\',             // Voiced pharyngeal fricative (X-SAMPA: ?\, Kirshenbaum: H<vcd>)
  'h': 'h',               // Voiceless glottal fricative
  'ɦ': 'h\\',             // Voiced glottal fricative (X-SAMPA: h\, Kirshenbaum: h<?>)
  
  // --- Lateral fricatives ---
  // Kirshenbaum: K, K<vcd>
  'ɬ': 'K',               // Voiceless alveolar lateral fricative
  'ɮ': 'K\\',             // Voiced alveolar lateral fricative (X-SAMPA: K\)
  
  // --- Approximants ---
  // Kirshenbaum: r (for English r), j, w
  'ʋ': 'v\\',             // Labiodental approximant (X-SAMPA: v\, same as labiodental flap)
  'ɹ': 'r\\',             // Alveolar approximant (X-SAMPA: r\, English "r")
  'ɻ': 'r\\`',            // Retroflex approximant (X-SAMPA: r\`)
  'j': 'j',               // Palatal approximant
  'ɰ': 'M\\',             // Velar approximant (X-SAMPA: M\)
  
  // --- Lateral approximants ---
  // Kirshenbaum: l, l., l^, L
  'l': 'l',               // Alveolar lateral approximant
  'ɫ': 'L',               // Velarized alveolar lateral ("dark l") (Kirshenbaum: L)
  'ɭ': 'l`',              // Retroflex lateral approximant (X-SAMPA: l`)
  'ʎ': 'L',               // Palatal lateral approximant (X-SAMPA: L, Kirshenbaum: l^)
  'ʟ': 'L\\',             // Velar lateral approximant (X-SAMPA: L\)
  
  // --- Other consonants (co-articulated) ---
  // Kirshenbaum: w (from Other Symbols)
  'w': 'w',               // Voiced labial-velar approximant
  'ʍ': 'W',               // Voiceless labial-velar fricative (X-SAMPA: W)
  'ɥ': 'H',               // Labial-palatal approximant (X-SAMPA: H)
  'ɥ̊': 'H',               // Voiceless labial-palatal approximant
  
  // --- Affricates ---
  // eSpeak treats affricates as consonant sequences
  'ts': 'ts',             // Voiceless alveolar affricate
  'dz': 'dz',             // Voiced alveolar affricate
  'tʃ': 'tS',             // Voiceless postalveolar affricate
  'dʒ': 'dZ',             // Voiced postalveolar affricate
  't͡s': 'ts',             // With tie bar
  'd͡z': 'dz',             // With tie bar
  't͡ʃ': 'tS',             // With tie bar
  'd͡ʒ': 'dZ',             // With tie bar
  'tɕ': 'ts\\',           // Voiceless alveolo-palatal affricate
  'dʑ': 'dz\\',           // Voiced alveolo-palatal affricate
  't͡ɕ': 'ts\\',           // With tie bar
  'd͡ʑ': 'dz\\',           // With tie bar
  'tʂ': 't`s`',           // Voiceless retroflex affricate
  'dʐ': 'd`z`',           // Voiced retroflex affricate
  't͡ʂ': 't`s`',           // With tie bar
  'd͡ʐ': 'd`z`',           // With tie bar
  'pf': 'pf',             // Voiceless labiodental affricate
  'bv': 'bv',             // Voiced labiodental affricate
  
  // ============================================
  // VOWELS
  // ============================================
  
  // --- Close (high) vowels ---
  // Kirshenbaum: i, y, i", u", u-, u
  // Using long vowel notation (i:, u:) for clearer pronunciation in eSpeak
  'i': 'i:',              // Close front unrounded
  'y': 'y:',              // Close front rounded
  'ɨ': '1',               // Close central unrounded (X-SAMPA: 1, Kirshenbaum: i")
  'ʉ': '}',               // Close central rounded (X-SAMPA: }, Kirshenbaum: u")
  'ɯ': 'M',               // Close back unrounded (X-SAMPA: M, Kirshenbaum: u-)
  'u': 'u:',              // Close back rounded
  
  // --- Near-close vowels ---
  // Kirshenbaum: I, I., U
  'ɪ': 'I',               // Near-close front unrounded (KIT)
  'ʏ': 'Y',               // Near-close front rounded (X-SAMPA: Y, Kirshenbaum: I.)
  'ʊ': 'U',               // Near-close back rounded (FOOT)
  
  // --- Close-mid vowels ---
  // Kirshenbaum: e, Y, @<umd>, o-, o
  'e': 'e',               // Close-mid front unrounded
  'ø': '2',               // Close-mid front rounded (X-SAMPA: 2, Kirshenbaum: Y)
  'ɘ': '@\\',             // Close-mid central unrounded (X-SAMPA: @\, Kirshenbaum: @<umd>)
  'ɵ': '8',               // Close-mid central rounded (X-SAMPA: 8)
  'ɤ': '7',               // Close-mid back unrounded (X-SAMPA: 7, Kirshenbaum: o-)
  'o': 'o',               // Close-mid back rounded
  
  // --- Mid vowels ---
  // Kirshenbaum: @
  'ə': '@',               // Mid central (schwa)
  
  // --- Open-mid vowels ---
  // Kirshenbaum: E, W, V", O", V, O
  'ɛ': 'E',               // Open-mid front unrounded (DRESS)
  'œ': '9',               // Open-mid front rounded (X-SAMPA: 9, Kirshenbaum: W)
  'ɜ': '3',               // Open-mid central unrounded (X-SAMPA: 3, Kirshenbaum: V")
  'ɞ': '3\\',             // Open-mid central rounded (X-SAMPA: 3\, Kirshenbaum: O")
  'ʌ': 'V',               // Open-mid back unrounded (STRUT)
  'ɔ': 'O',               // Open-mid back rounded (THOUGHT)
  
  // --- Near-open vowels ---
  // Kirshenbaum: &, &"
  'æ': '{',               // Near-open front unrounded (TRAP) (X-SAMPA: {, Kirshenbaum: &)
  'ɐ': '6',               // Near-open central (X-SAMPA: 6, Kirshenbaum: &")
  
  // --- Open (low) vowels ---
  // Kirshenbaum: a, a., A, A.
  'a': 'a',               // Open front unrounded
  'ɶ': '&',               // Open front rounded (X-SAMPA: &, Kirshenbaum: a.)
  'ä': 'a',               // Open central unrounded (centralized a)
  'ɑ': 'A',               // Open back unrounded (PALM)
  'ɒ': 'Q',               // Open back rounded (LOT in RP) (X-SAMPA: Q, Kirshenbaum: A.)
  
  // --- Rhotic vowels ---
  // These are common in American English
  'ɚ': '@`',              // Schwa with r-coloring (LETTER in AmE) (X-SAMPA: @`)
  'ɝ': '3`',              // Open-mid central unrounded with r-coloring (NURSE in AmE)
  'ɑ˞': 'A`',             // Open back unrounded with r-coloring
  'ɔ˞': 'O`',             // Open-mid back rounded with r-coloring
  
  // ============================================
  // DIPHTHONGS
  // ============================================
  // Common English diphthongs - concatenate vowel symbols
  // Kirshenbaum/eSpeak: eI, aI, OI, oU, aU
  
  // FACE diphthong
  'eɪ': 'eI',
  'ei': 'eI',
  
  // PRICE diphthong
  'aɪ': 'aI',
  'ai': 'aI',
  
  // CHOICE diphthong
  'ɔɪ': 'OI',
  'oi': 'OI',
  
  // GOAT diphthong (GenAm)
  'oʊ': 'oU',
  'ou': 'oU',
  
  // GOAT diphthong (British RP)
  'əʊ': '@U',
  
  // MOUTH diphthong
  'aʊ': 'aU',
  'au': 'aU',
  
  // NEAR diphthong
  'ɪə': 'I@',
  'ɪɚ': 'I@`',            // American English variant
  
  // SQUARE diphthong
  'eə': 'e@',
  'ɛə': 'E@',
  'ɛɚ': 'E@`',            // American English variant
  
  // CURE diphthong
  'ʊə': 'U@',
  'ʊɚ': 'U@`',            // American English variant
  
  // Additional diphthongs
  'ʊɪ': 'UI',             // As in some dialects
  'æɪ': '{I',             // Raised PRICE variant
  'ɑɪ': 'AI',             // As in some dialects
  'ɔʊ': 'OU',             // As in some dialects
  
  // ============================================
  // SUPRASEGMENTALS
  // ============================================
  
  // --- Stress markers ---
  // Kirshenbaum: ' for primary, , for secondary
  'ˈ': "'",               // Primary stress (before syllable)
  'ˌ': ',',               // Secondary stress
  
  // --- Length markers ---
  // Kirshenbaum: : for long
  'ː': ':',               // Long vowel marker (IPA modifier letter triangular colon)
  ':': ':',               // ASCII colon (sometimes used interchangeably)
  'ˑ': ':',               // Half-long (treat as long for simplicity)
  
  // --- Syllable markers ---
  '.': '.',               // Syllable boundary
  '|': '|',               // Minor (foot) group
  '‖': '||',              // Major (intonation) group
  
  // ============================================
  // DIACRITICS
  // ============================================
  // These modify the preceding phoneme
  
  // --- Palatalized consonants ---
  // Kirshenbaum: ; or <;> (feature {pzd})
  // X-SAMPA: _j suffix, eSpeak uses ' for palatalization
  'pʲ': "p'", 'bʲ': "b'", 'tʲ': "t'", 'dʲ': "d'",
  'kʲ': "k'", 'gʲ': "g'",
  'mʲ': "m'", 'nʲ': "n'", 'ŋʲ': "N'",
  'fʲ': "f'", 'vʲ': "v'", 'sʲ': "s'", 'zʲ': "z'",
  'ʃʲ': "S'", 'ʒʲ': "Z'", 'xʲ': "x'", 'ɣʲ': "G'",
  'hʲ': "h'", 'lʲ': "l'", 'rʲ': "r'", 'ɾʲ': "4'", 'wʲ': "w'",
  'ɲʲ': "J'", 'jʲ': "j'",
  
  // --- Aspirated consonants ---
  // Kirshenbaum: <h> after consonant
  // X-SAMPA: _h suffix
  'pʰ': 'p_h', 'tʰ': 't_h', 'kʰ': 'k_h', 'qʰ': 'q_h',
  'ʈʰ': 't`_h', 'cʰ': 'c_h',
  'tsʰ': 'ts_h', 'tʃʰ': 'tS_h', 'tɕʰ': 'ts\\_h', 'tʂʰ': 't`s`_h',
  'bʰ': 'b_h', 'dʰ': 'd_h', 'gʰ': 'g_h',  // Breathy voiced (murmured) stops
  
  // --- Labialized consonants ---
  // Kirshenbaum: <w> after consonant
  'kʷ': 'k_w', 'gʷ': 'g_w', 'qʷ': 'q_w',
  'xʷ': 'x_w', 'ɣʷ': 'G_w',
  
  // --- Velarized consonants ---
  // Kirshenbaum: ~ (same as nasalization for vowels)
  'lˠ': 'L',              // Velarized l (same as dark l)
  'nˠ': 'n_G',            // Velarized n
  
  // --- Pharyngealized (emphatic) consonants ---
  // Common in Arabic and other Semitic languages
  'tˤ': 't_?\\',          // Pharyngealized t
  'dˤ': 'd_?\\',          // Pharyngealized d
  'sˤ': 's_?\\',          // Pharyngealized s
  'ðˤ': 'D_?\\',          // Pharyngealized ð
  
  // --- Nasalized vowels ---
  // Kirshenbaum: ~ after vowel
  'ã': 'a~',              // Nasalized a
  'ẽ': 'e~',              // Nasalized e
  'ĩ': 'i~',              // Nasalized i
  'õ': 'o~',              // Nasalized o
  'ũ': 'u~',              // Nasalized u
  'æ̃': '{~',              // Nasalized æ
  'ɛ̃': 'E~',              // Nasalized ɛ (French "vin")
  'œ̃': '9~',              // Nasalized œ (French "un")
  'ɔ̃': 'O~',              // Nasalized ɔ (French "bon")
  'ɑ̃': 'A~',              // Nasalized ɑ (French "an")
  
  // --- Voiceless vowels/sonorants ---
  // Kirshenbaum: <vls> or ring below
  'n̥': 'n_0',             // Voiceless n
  'm̥': 'm_0',             // Voiceless m
  'l̥': 'l_0',             // Voiceless l
  'r̥': 'r_0',             // Voiceless r
  'ɹ̥': 'r\\_0',           // Voiceless ɹ
  
  // --- Syllabic consonants ---
  // Kirshenbaum: . under consonant
  'n̩': 'n=',              // Syllabic n (as in "button")
  'm̩': 'm=',              // Syllabic m
  'l̩': 'l=',              // Syllabic l (as in "bottle")
  'r̩': 'r=',              // Syllabic r
  
  // --- Dental consonants ---
  // Kirshenbaum: [ after consonant (dental diacritic)
  't̪': 't_d',             // Dental t
  'd̪': 'd_d',             // Dental d
  'n̪': 'n_d',             // Dental n
  'l̪': 'l_d',             // Dental l
  
  // --- Ejective consonants ---
  // Common in many languages (Caucasian, Mayan, etc.)
  "p'": 'p_>',            // Ejective p
  "t'": 't_>',            // Ejective t
  "k'": 'k_>',            // Ejective k
  "q'": 'q_>',            // Ejective q
  "ts'": 'ts_>',          // Ejective ts
  "tʃ'": 'tS_>',          // Ejective tʃ
  'pʼ': 'p_>',            // With modifier letter apostrophe
  'tʼ': 't_>',
  'kʼ': 'k_>',
  'qʼ': 'q_>',
  'tsʼ': 'ts_>',
  'tʃʼ': 'tS_>',
  
  // --- Implosive consonants ---
  // Voiced ingressive stops
  'ɓ': 'b_<',             // Bilabial implosive
  'ɗ': 'd_<',             // Alveolar implosive
  'ʄ': 'J\\_<',           // Palatal implosive
  'ɠ': 'g_<',             // Velar implosive
  'ʛ': 'G\\_<',           // Uvular implosive
  
  // --- Click consonants ---
  // Common in Khoisan and Bantu languages
  'ʘ': 'O\\',             // Bilabial click
  'ǀ': '|\\',             // Dental click
  'ǃ': '!\\',             // Alveolar click
  'ǂ': '=\\',             // Palatoalveolar click
  'ǁ': '|\\|\\',          // Alveolar lateral click
  
  // ============================================
  // ENGLISH-SPECIFIC VOWEL MAPPINGS
  // ============================================
  // These are useful for English TTS (lexical set notation)
  // Based on eSpeak's English phoneme documentation
  
  // Short vowels (using eSpeak English phoneme names)
  // KIT: ɪ -> I (already mapped)
  // DRESS: e/ɛ -> E (mapped as ɛ)
  // TRAP: æ -> a (eSpeak English uses 'a' not '{')
  // LOT: ɒ/ɑ -> 0 (eSpeak specific)
  // STRUT: ʌ -> V (already mapped)
  // FOOT: ʊ -> U (already mapped)
  
  // Long vowels
  // FLEECE: iː -> i:
  'iː': 'i:',
  // PALM: ɑː -> A:
  'ɑː': 'A:',
  // THOUGHT: ɔː -> O:
  'ɔː': 'O:',
  // GOOSE: uː -> u:
  'uː': 'u:',
  // NURSE: ɜː -> 3:
  'ɜː': '3:',
  
  // Reduced vowels
  // COMMA: ə -> @ (already mapped)
  // LETTER (AmE): ɚ -> @` (already mapped)
  // happY: i -> i (short high front)
  
  // Additional long vowel variants
  'eː': 'e:',             // Long e
  'oː': 'o:',             // Long o
  'æː': '{:',             // Long æ (some dialects)
  'aː': 'a:',             // Long a
};

// Convert IPA phoneme to eSpeak format
function ipaToEspeak(ipa) {
  // Check exact match first
  if (ipaToEspeakMap[ipa]) {
    return ipaToEspeakMap[ipa];
  }
  // For unmapped phonemes, return as-is and let eSpeak try
  return ipa;
}

// Get all IPA phonemes sorted by length (longest first) for greedy matching
// This ensures multi-character phonemes like "tʃ" are matched before "t"
// Note: This is computed once at module load since ipaToEspeakMap is constant
const sortedIpaPhonemes = Object.keys(ipaToEspeakMap).sort((a, b) => b.length - a.length);

// Common IPA characters that might not be in our mapping but are valid phonemes
// This includes less common symbols and diacritics
const validIpaCharacters = new Set([
  // Characters from the mapping
  ...Object.keys(ipaToEspeakMap).flatMap(k => [...k]),
  // Stress markers
  'ˈ', 'ˌ',                     // Primary and secondary stress
  // Length markers
  ':', 'ː', 'ˑ',                // Long, half-long
  // Syllable/group markers
  '.', '|', '‖',                // Syllable, foot, intonation boundaries
  // Tie bars for affricates
  '͡', '͜',                       // Combining tie bar above/below
  // Common IPA diacritics (combining characters)
  '̃',                           // Combining tilde (nasalization) U+0303
  '̩',                           // Combining vertical line below (syllabic) U+0329
  '̥',                           // Combining ring below (voiceless) U+0325
  '̊',                           // Combining ring above (voiceless) U+030A
  '̤',                           // Combining diaeresis below (breathy voiced) U+0324
  '̰',                           // Combining tilde below (creaky voiced) U+0330
  'ʰ',                           // Modifier letter small h (aspiration)
  'ʲ',                           // Modifier letter small j (palatalization)
  'ʷ',                           // Modifier letter small w (labialization)
  'ˠ',                           // Modifier letter small gamma (velarization)
  'ˤ',                           // Modifier letter small reversed glottal stop (pharyngealization)
  'ˀ',                           // Modifier letter glottal stop
  'ʼ',                           // Modifier letter apostrophe (ejective)
  "'",                           // ASCII apostrophe (also used for ejectives)
  '˞',                           // Modifier letter rhotic hook (rhoticity)
  // Combining diacritics (Unicode code points)
  '\u0303',                      // Combining tilde
  '\u0329',                      // Combining vertical line below
  '\u0325',                      // Combining ring below
  '\u030A',                      // Combining ring above
  '\u0324',                      // Combining diaeresis below
  '\u0330',                      // Combining tilde below
  '\u031A',                      // Combining left angle above (unreleased)
  '\u032A',                      // Combining bridge below (dental)
  '\u033A',                      // Combining inverted bridge below (apical)
  '\u033B',                      // Combining square below (laminal)
  '\u033C',                      // Combining seagull below (linguolabial)
  '\u0339',                      // Combining right half ring below (more rounded)
  '\u031C',                      // Combining left half ring below (less rounded)
  '\u031F',                      // Combining plus sign below (advanced)
  '\u0320',                      // Combining minus sign below (retracted)
  '\u0308',                      // Combining diaeresis (centralized)
  '\u033D',                      // Combining x above (mid-centralized)
  '\u0318',                      // Combining left tack below (ATR)
  '\u0319',                      // Combining right tack below (RTR)
]);

// Parse an IPA string into individual phonemes using greedy matching
// This handles multi-character phonemes like "tʃ", "dʒ", "pʲ", etc.
function parseIpaString(ipaString) {
  const phonemes = [];
  // Normalize IPA length marker (ː U+02D0) to ASCII colon (: U+003A)
  // eSpeak uses ASCII colon for length in phoneme notation
  let remaining = ipaString.replace(/ː/g, ':');
  
  while (remaining.length > 0) {
    let matched = false;
    
    // Try to match longest phoneme first
    for (const phoneme of sortedIpaPhonemes) {
      if (remaining.startsWith(phoneme)) {
        phonemes.push(phoneme);
        remaining = remaining.slice(phoneme.length);
        matched = true;
        break;
      }
    }
    
    // If no mapped phoneme found, take one character
    if (!matched) {
      const char = remaining.charAt(0);
      // Log unmapped characters for debugging (only if they look like they should be IPA)
      if (validIpaCharacters.has(char)) {
        console.log('[eSpeak] Unmapped IPA character:', char, 'code:', char.charCodeAt(0));
      }
      phonemes.push(char);
      remaining = remaining.slice(1);
    }
  }
  
  return phonemes;
}

// Check if a string is a single phoneme (exists in the mapping or is a single IPA character)
function isSinglePhoneme(input) {
  // Check if it's directly in our phoneme map
  if (ipaToEspeakMap[input]) {
    return true;
  }
  // Check if it's a single character that's a valid IPA character
  if (input.length === 1 && validIpaCharacters.has(input)) {
    return true;
  }
  // Multi-character strings that aren't in the map are likely words
  return false;
}

// Convert an IPA word (multi-phoneme string) to eSpeak X-SAMPA format
// Each phoneme is converted individually and joined
function ipaWordToEspeak(ipaWord) {
  const phonemes = parseIpaString(ipaWord);
  const espeakPhonemes = [];
  
  for (let i = 0; i < phonemes.length; i++) {
    const p = phonemes[i];
    const mapped = ipaToEspeakMap[p];
    
    // Handle standalone colons (length markers)
    // Skip if the previous phoneme already ends with a colon (long vowel)
    // Otherwise, pass through the colon as a length modifier
    if (p === ':' && i > 0) {
      // Since i > 0, we've processed at least one phoneme before this colon
      const prevMapped = espeakPhonemes[espeakPhonemes.length - 1];
      if (prevMapped && prevMapped.endsWith(':')) {
        // Previous phoneme is already long, skip this redundant colon
        continue;
      }
      // Previous phoneme is not long, so add the colon as a length modifier
      espeakPhonemes.push(':');
      continue;
    }
    
    if (!mapped && p.length > 0) {
      console.log('[eSpeak] No mapping for phoneme:', p, '- passing through as-is');
    }
    espeakPhonemes.push(mapped || p);
  }
  
  return espeakPhonemes.join('');
}

// eSpeak TTS instance
let espeakInstance = null;
let espeakReady = false;
let audioContext = null;

// Track ongoing synthesis to prevent overlapping sounds
let synthesisInProgress = false;
let synthesisTimeoutId = null;

// Constants for eSpeak synthesis
// Note: Event types are strings because the worker converts numeric types to strings
// via eventTypes array: ["list_terminated","word","sentence","mark","play","end","msg_terminated","phoneme","samplerate"]
const ESPEAK_EVENT_END = 'end';
const ESPEAK_EVENT_MSG_TERMINATED = 'msg_terminated';
const SYNTHESIS_TIMEOUT_MS = 2000;

// Consonant phonemes that need a vowel (schwa) appended for clearer articulation
// This is a module-level constant to avoid recreating the array on each function call
const CONSONANT_PHONEMES = new Set([
  // Plosives (stops)
  'p', 'b', 't', 'd', 'k', 'g', 'q', 'ʔ', 'c', 'ɟ', 'ʈ', 'ɖ', 'ɢ', 'ɡ',
  // Nasals
  'm', 'n', 'ŋ', 'ɲ', 'ɴ', 'ɱ', 'ɳ',
  // Trills
  'r', 'ʀ', 'ʙ',
  // Taps/Flaps
  'ɾ', 'ɽ', 'ⱱ',
  // Fricatives
  'f', 'v', 's', 'z', 'ʃ', 'ʒ', 'θ', 'ð', 'x', 'ɣ', 'h', 'ç', 'χ', 'ħ', 'ʕ', 'ɬ', 'ɮ',
  'ɸ', 'β', 'ʂ', 'ʐ', 'ɕ', 'ʑ', 'ʝ', 'ʁ', 'ɦ',
  // Lateral approximants
  'l', 'ʎ', 'ɭ', 'ʟ', 'ɫ',
  // Approximants
  'w', 'j', 'ɥ', 'ʋ', 'ɹ', 'ɰ', 'ɻ', 'ʍ',
  // Implosives
  'ɓ', 'ɗ', 'ʄ', 'ɠ', 'ʛ',
  // Clicks
  'ʘ', 'ǀ', 'ǃ', 'ǂ', 'ǁ'
]);

// Initialize eSpeak TTS
function initEspeak() {
  return new Promise((resolve, reject) => {
    console.log('[eSpeak] initEspeak called, ready:', espeakReady, 'instance:', !!espeakInstance);
    
    if (espeakReady && espeakInstance) {
      console.log('[eSpeak] Already initialized, reusing instance');
      resolve(espeakInstance);
      return;
    }
    
    try {
      // Check if eSpeakNG is available
      if (typeof eSpeakNG === 'undefined') {
        console.error('[eSpeak] eSpeakNG constructor not found - check if espeakng.min.js is loaded');
        reject(new Error('eSpeakNG not loaded'));
        return;
      }
      
      console.log('[eSpeak] eSpeakNG constructor found:', typeof eSpeakNG);
      
      // Determine worker path based on current page location
      // This handles deployment in subdirectories or different base URLs
      const basePath = window.location.pathname.replace(/\/[^\/]*$/, '');
      const workerPath = basePath + '/public/espeak-ng/espeakng.worker.js';
      
      console.log('[eSpeak] Worker path:', workerPath);
      console.log('[eSpeak] Base path:', basePath);
      console.log('[eSpeak] Creating new eSpeakNG instance...');
      
      espeakInstance = new eSpeakNG(workerPath, function() {
        espeakReady = true;
        console.log('[eSpeak] Worker ready callback fired');
        console.log('[eSpeak] eSpeak-ng TTS initialized successfully');
        
        // List available voices for debugging
        console.log('[eSpeak] Listing available voices...');
        espeakInstance.list_voices(function(voices) {
          console.log('[eSpeak] Available voices:', voices.length, 'voices');
          if (voices.length > 0) {
            console.log('[eSpeak] First voice:', voices[0]);
            console.log('[eSpeak] All voice names:', voices.map(v => v.name).join(', '));
          } else {
            console.warn('[eSpeak] WARNING: No voices available - synthesis will likely fail');
          }
        });
        
        // Set voice parameters for clearer phoneme pronunciation
        // Rate range: 80-450 (default: 175). Using 120 for slower, clearer playback
        // Pitch range: 0-99 (default: 50). Using 40 for a slightly deeper, more natural tone
        console.log('[eSpeak] Setting rate to 120 and pitch to 40');
        espeakInstance.set_rate(120);
        espeakInstance.set_pitch(40);
        
        // Set the voice to British English (en-gb) for clearer, more natural pronunciation
        // en-gb tends to have crisper phoneme articulation compared to generic 'en'
        // Using the callback to ensure voice is fully loaded before resolving
        // Add a timeout fallback in case the callback never fires
        console.log('[eSpeak] Setting voice to "en-gb"...');
        let resolved = false;
        
        // Helper to resolve only once
        const resolveOnce = () => {
          if (!resolved) {
            resolved = true;
            resolve(espeakInstance);
          }
        };
        
        // Set a timeout to resolve even if voice callback doesn't fire
        const voiceTimeout = setTimeout(() => {
          console.warn('[eSpeak] Voice setting callback did not fire within timeout, resolving anyway');
          resolveOnce();
        }, 2000); // 2 second timeout
        
        espeakInstance.set_voice('en-gb', function() {
          clearTimeout(voiceTimeout);
          console.log('[eSpeak] Voice "en-gb" set successfully');
          resolveOnce();
        });
      });
      
      console.log('[eSpeak] eSpeakNG instance created, waiting for ready callback...');
    } catch (error) {
      console.error('[eSpeak] Failed to initialize eSpeak:', error);
      console.error('[eSpeak] Error stack:', error.stack);
      reject(error);
    }
  });
}

// eSpeak synthesis sample rate (fixed by eSpeak-ng)
const ESPEAK_SAMPLE_RATE = 22050;

// Play audio samples from eSpeak
// The eSpeak worker returns stereo interleaved Float32Array data.
// The data format is: [L0, R0, L1, R1, ...] where L=R for each sample.
// This function accepts either an ArrayBuffer or Float32Array.
// 
// IMPORTANT: eSpeak synthesizes audio at 22050 Hz, but browser AudioContexts
// typically run at 44100 Hz or 48000 Hz. We must resample the audio to match
// the browser's sample rate, otherwise the audio will sound like a "chipmunk"
// (too fast and high-pitched) due to the sample rate mismatch.
async function playAudioSamples(samples) {
  console.log('[eSpeak Audio] playAudioSamples called');
  console.log('[eSpeak Audio] Samples type:', typeof samples, 'Constructor:', samples?.constructor?.name);
  
  // Validate samples input
  if (!samples) {
    console.error('[eSpeak Audio] No samples provided');
    return;
  }
  
  // Handle both ArrayBuffer and Float32Array inputs
  let float32Samples;
  if (samples instanceof Float32Array) {
    float32Samples = samples;
    console.log('[eSpeak Audio] Samples length (Float32Array):', float32Samples.length);
  } else if (samples instanceof ArrayBuffer) {
    console.log('[eSpeak Audio] Samples byteLength:', samples.byteLength);
    if (samples.byteLength === 0) {
      console.warn('[eSpeak Audio] Empty samples buffer (byteLength === 0)');
      return;
    }
    float32Samples = new Float32Array(samples);
  } else {
    console.error('[eSpeak Audio] Invalid samples type');
    return;
  }
  
  if (float32Samples.length === 0) {
    console.warn('[eSpeak Audio] Empty Float32Array');
    return;
  }
  
  try {
    // Create AudioContext if not exists
    if (!audioContext) {
      console.log('[eSpeak Audio] Creating new AudioContext...');
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        console.error('[eSpeak Audio] AudioContext not supported in this browser');
        return;
      }
      audioContext = new AudioContextClass();
      console.log('[eSpeak Audio] AudioContext created, state:', audioContext.state, 'sampleRate:', audioContext.sampleRate);
    } else {
      console.log('[eSpeak Audio] Reusing existing AudioContext, state:', audioContext.state, 'sampleRate:', audioContext.sampleRate);
    }
    
    // Handle AudioContext state
    if (audioContext.state === 'closed') {
      console.log('[eSpeak Audio] AudioContext is closed, creating new one...');
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioContextClass();
      console.log('[eSpeak Audio] New AudioContext created, state:', audioContext.state, 'sampleRate:', audioContext.sampleRate);
    }
    
    // Resume AudioContext if suspended (required by browser autoplay policy)
    // This must be called in response to a user gesture (click/tap)
    if (audioContext.state === 'suspended') {
      console.log('[eSpeak Audio] AudioContext suspended, attempting to resume...');
      try {
        await audioContext.resume();
        console.log('[eSpeak Audio] AudioContext resumed successfully, new state:', audioContext.state);
      } catch (e) {
        console.error('[eSpeak Audio] Failed to resume AudioContext:', e);
        return;
      }
    }
    
    console.log('[eSpeak Audio] Float32 samples length:', float32Samples.length);
    
    // Log first few samples for debugging
    if (float32Samples.length > 0) {
      const samplePreview = Array.from(float32Samples.slice(0, 10)).map(v => v.toFixed(4));
      console.log('[eSpeak Audio] First 10 samples:', samplePreview);
      
      // Check if all samples are zero (silence)
      const hasNonZero = float32Samples.some(v => Math.abs(v) > 0.0001);
      if (!hasNonZero) {
        console.warn('[eSpeak Audio] WARNING: All samples appear to be zero/silence');
      }
    }
    
    // The worker doubles the sample count for stereo interleaving,
    // so the actual mono sample count is half the array length.
    // Use floor to handle any edge case of odd-length data.
    const monoSampleCount = Math.floor(float32Samples.length / 2);
    
    console.log('[eSpeak Audio] Creating audio buffer with', monoSampleCount, 'mono samples at', ESPEAK_SAMPLE_RATE, 'Hz');
    
    if (monoSampleCount === 0) {
      console.warn('[eSpeak Audio] No mono samples to play');
      return;
    }
    
    // Extract mono samples from interleaved stereo data (take every other sample)
    const monoSamples = new Float32Array(monoSampleCount);
    for (let i = 0; i < monoSampleCount; i++) {
      monoSamples[i] = float32Samples[i * 2];
    }
    
    // Log channel data stats
    let minVal = Infinity, maxVal = -Infinity;
    for (let i = 0; i < monoSamples.length; i++) {
      if (monoSamples[i] < minVal) minVal = monoSamples[i];
      if (monoSamples[i] > maxVal) maxVal = monoSamples[i];
    }
    console.log('[eSpeak Audio] Channel data range: min=', minVal.toFixed(4), 'max=', maxVal.toFixed(4));
    
    // Get the target sample rate from the AudioContext
    const targetSampleRate = audioContext.sampleRate;
    console.log('[eSpeak Audio] Target sample rate:', targetSampleRate, 'Source sample rate:', ESPEAK_SAMPLE_RATE);
    
    // Resample the audio from eSpeak's 22050 Hz to the browser's sample rate
    // This prevents the "chipmunk" effect caused by sample rate mismatch
    const resampledBuffer = await resampleAudio(monoSamples, ESPEAK_SAMPLE_RATE, targetSampleRate);
    
    // Create source and play the resampled buffer
    const source = audioContext.createBufferSource();
    source.buffer = resampledBuffer;
    source.connect(audioContext.destination);
    
    console.log('[eSpeak Audio] Starting audio playback with resampled buffer...');
    source.start();
    console.log('[eSpeak Audio] Audio playback started successfully');
    
  } catch (error) {
    console.error('[eSpeak Audio] Error during audio playback:', error);
    console.error('[eSpeak Audio] Error stack:', error.stack);
  }
}

// Resample audio from source sample rate to target sample rate using OfflineAudioContext
// This ensures proper playback regardless of the browser's native sample rate
async function resampleAudio(monoSamples, sourceSampleRate, targetSampleRate) {
  // Validate sample rates to prevent division by zero or unexpected results
  if (!sourceSampleRate || sourceSampleRate <= 0 || !targetSampleRate || targetSampleRate <= 0) {
    console.error('[eSpeak Audio] Invalid sample rates:', sourceSampleRate, targetSampleRate);
    throw new Error('Invalid sample rates for resampling');
  }
  
  // Calculate the duration in seconds and the number of output samples
  const duration = monoSamples.length / sourceSampleRate;
  const outputSampleCount = Math.ceil(duration * targetSampleRate);
  
  console.log('[eSpeak Audio] Resampling:', monoSamples.length, 'samples from', sourceSampleRate, 'Hz to', targetSampleRate, 'Hz');
  console.log('[eSpeak Audio] Output sample count:', outputSampleCount, 'Duration:', duration.toFixed(3), 'seconds');
  
  // Check for OfflineAudioContext support (may not be available in older browsers)
  const OfflineAudioContextClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OfflineAudioContextClass) {
    console.error('[eSpeak Audio] OfflineAudioContext not supported in this browser');
    throw new Error('OfflineAudioContext not supported');
  }
  
  try {
    // Create an OfflineAudioContext for resampling
    // OfflineAudioContext renders audio as fast as possible (not real-time)
    const offlineCtx = new OfflineAudioContextClass(1, outputSampleCount, targetSampleRate);
    
    // Create a buffer at the source sample rate with the original samples
    const sourceBuffer = offlineCtx.createBuffer(1, monoSamples.length, sourceSampleRate);
    sourceBuffer.getChannelData(0).set(monoSamples);
    
    // Create a buffer source and connect it to the offline context's destination
    const bufferSource = offlineCtx.createBufferSource();
    bufferSource.buffer = sourceBuffer;
    bufferSource.connect(offlineCtx.destination);
    bufferSource.start(0);
    
    // Render the audio - this performs the resampling
    const renderedBuffer = await offlineCtx.startRendering();
    
    console.log('[eSpeak Audio] Resampling complete, output buffer length:', renderedBuffer.length);
    
    return renderedBuffer;
  } catch (error) {
    console.error('[eSpeak Audio] Error during audio resampling:', error);
    throw error;
  }
}

// Helper function to clear synthesis state
function clearSynthesisState() {
  console.log('[eSpeak] clearSynthesisState called, synthesisInProgress was:', synthesisInProgress);
  synthesisInProgress = false;
  if (synthesisTimeoutId !== null) {
    console.log('[eSpeak] Clearing timeout');
    clearTimeout(synthesisTimeoutId);
    synthesisTimeoutId = null;
  }
}

// Speak a phoneme or word using eSpeak
// The rebuilt eSpeak library supports [[...]] bracket notation for phoneme input.
// Phonemes are converted to X-SAMPA format and wrapped in brackets.
function speakPhonemeWithEspeak(ipaInput) {
  console.log('[eSpeak] speakPhonemeWithEspeak called with input:', ipaInput);
  
  // If synthesis is already in progress, ignore the request
  // This prevents overlapping sounds from multiple rapid clicks
  if (synthesisInProgress) {
    console.log('[eSpeak] Synthesis already in progress, ignoring request');
    return;
  }
  
  console.log('[eSpeak] Starting synthesis process...');
  
  initEspeak().then(espeak => {
    // Determine if this is a single phoneme or a word (multiple phonemes)
    const isWord = !isSinglePhoneme(ipaInput);
    
    // Build input for eSpeak using phoneme notation [[...]]
    // The rebuilt eSpeak library now has espeakPHONEMES flag enabled,
    // which allows [[...]] bracket notation to be interpreted as phonemes.
    let synthInput;
    
    if (isWord) {
      // For words: parse into phonemes, convert each to X-SAMPA, join them
      // No schwa is added since vowels are naturally present in the word
      const espeakWord = ipaWordToEspeak(ipaInput);
      // Use bracket notation for phoneme input
      synthInput = '[[' + espeakWord + ']]';
      console.log('[eSpeak] Speaking word:', ipaInput);
      console.log('[eSpeak] Parsed phonemes:', parseIpaString(ipaInput));
      console.log('[eSpeak] eSpeak word:', espeakWord);
    } else {
      // For single phonemes: convert to X-SAMPA
      // Add schwa after consonants to make them audible
      const espeakPhoneme = ipaToEspeakMap[ipaInput] || ipaInput;
      
      if (isConsonantLike(ipaInput)) {
        // Add schwa after consonant for articulation: "p" -> "[[p@]]"
        synthInput = '[[' + espeakPhoneme + '@]]';
      } else {
        // For vowels and other sounds, just use the phoneme directly
        synthInput = '[[' + espeakPhoneme + ']]';
      }
      console.log('[eSpeak] Speaking phoneme:', ipaInput);
      console.log('[eSpeak] eSpeak phoneme:', espeakPhoneme);
    }
    
    console.log('[eSpeak] Synth input:', synthInput);
    
    synthesisInProgress = true;
    
    // Accumulate all audio sample chunks before playing
    // The eSpeak worker calls the callback multiple times with chunks of audio data
    const accumulatedSamples = [];
    
    espeak.synthesize(synthInput, function(samples, events) {
      console.log('[eSpeak Callback] Received callback');
      console.log('[eSpeak Callback] samples:', samples);
      console.log('[eSpeak Callback] samples byteLength:', samples?.byteLength);
      
      if (samples && samples.byteLength > 0) {
        // The echogarden worker returns Int16 samples as ArrayBuffer
        // Convert Int16 samples to Float32 normalized to [-1, 1]
        const int16Samples = new Int16Array(samples);
        const float32Chunk = new Float32Array(int16Samples.length);
        for (let i = 0; i < int16Samples.length; i++) {
          float32Chunk[i] = int16Samples[i] / 32768;
        }
        
        // Count non-zero samples efficiently without creating intermediate array
        let nonZeroCount = 0;
        for (let i = 0; i < float32Chunk.length; i++) {
          if (Math.abs(float32Chunk[i]) > 0.0001) {
            nonZeroCount++;
          }
        }
        console.log('[eSpeak Audio] Chunk: total=' + float32Chunk.length + ', non-zero=' + nonZeroCount);
        
        if (nonZeroCount > 0) {
          accumulatedSamples.push(float32Chunk);
          console.log('[eSpeak Callback] Accumulated chunk, total chunks:', accumulatedSamples.length);
        } else {
          console.warn('[eSpeak Callback] WARNING: Received all-zero samples chunk');
        }
      }
      
      // Check if synthesis is complete
      const hasEndEvent = events && events.some(e => 
        e.type === ESPEAK_EVENT_END || e.type === ESPEAK_EVENT_MSG_TERMINATED
      );
      
      if (hasEndEvent) {
        console.log('[eSpeak Callback] End event received, playing accumulated audio');
        
        // Combine all accumulated chunks into a single Float32Array
        if (accumulatedSamples.length > 0) {
          const totalLength = accumulatedSamples.reduce((sum, chunk) => sum + chunk.length, 0);
          const combinedSamples = new Float32Array(totalLength);
          let offset = 0;
          for (const chunk of accumulatedSamples) {
            combinedSamples.set(chunk, offset);
            offset += chunk.length;
          }
          console.log('[eSpeak Callback] Combined', accumulatedSamples.length, 'chunks into', totalLength, 'samples');
          playAudioSamples(combinedSamples);
        } else {
          console.warn('[eSpeak Callback] No audio samples accumulated');
        }
        
        clearSynthesisState();
      }
      
      return false;
    });
    
    // Set a timeout to reset the synthesis flag
    synthesisTimeoutId = setTimeout(() => {
      console.log('[eSpeak] Synthesis timeout reached, clearing state');
      clearSynthesisState();
    }, SYNTHESIS_TIMEOUT_MS);
  }).catch(error => {
    clearSynthesisState();
    console.error('[eSpeak] eSpeak TTS not available:', error);
    console.error('[eSpeak] Error stack:', error.stack);
  });
}

// Helper function to check if a phoneme is consonant-like
// (needs a vowel to be articulated clearly)
function isConsonantLike(phoneme) {
  // Check if the first character is a consonant
  // This handles simple phonemes like 'p' and complex ones like 'pʰ'
  if (phoneme.length === 0) return false;
  
  const firstChar = phoneme.charAt(0);
  return CONSONANT_PHONEMES.has(firstChar);
}

// Stop any current speech (note: eSpeak.js doesn't have a stop method, 
// so we just don't do anything)
function stopCurrentSpeech() {
  console.log('[eSpeak] stopCurrentSpeech called');
  // eSpeak.js synthesis is fire-and-forget, can't be stopped mid-way
  // This is a no-op but included for API completeness
}

// Show loading message while initializing
const appContainer = document.getElementById('app');
appContainer.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
    <div style="text-align: center;">
      <div style="font-size: 24px; font-weight: bold; color: #4a5568; margin-bottom: 16px;">CLCTK - Comprehensive Language Construction Tool Kit</div>
      <div style="font-size: 16px; color: #718096; margin-bottom: 24px;">Initializing database...</div>
      <div style="width: 48px; height: 48px; border: 4px solid #e2e8f0; border-top-color: #805ad5; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    </div>
  </div>
  <style>
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
`;

// Initialize database and load existing data
openDatabase()
  .then(() => {
    console.log('Database initialized successfully');
    // Initialize app version
    return initializeAppVersion();
  })
  .then(() => {
    console.log('Initializing Elm application...');
    // Initialize the Elm application after database is ready
    app = Elm.Main.init({
      node: document.getElementById('app')
    });
    
    // Set up port subscriptions after app is initialized
    setupPortSubscriptions();
    
    // Load initial data
    loadFromIndexedDB();
    loadAllTemplates();
    loadPreferences();
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    // Show error message
    appContainer.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
        <div style="text-align: center; max-width: 600px; padding: 20px;">
          <div style="font-size: 24px; font-weight: bold; color: #c53030; margin-bottom: 16px;">⚠️ Database Initialization Failed</div>
          <div style="font-size: 16px; color: #718096; margin-bottom: 24px;">
            The application failed to initialize the database. This may be due to browser restrictions or storage issues.
          </div>
          <div style="background: #fff5f5; border: 1px solid #fc8181; color: #742a2a; padding: 12px; border-radius: 4px; font-size: 14px; text-align: left; font-family: monospace;">
            ${error.message || 'Unknown error'}
          </div>
          <button onclick="location.reload()" style="margin-top: 24px; background: #805ad5; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 500;">
            Try Again
          </button>
        </div>
      </div>
    `;
  });
