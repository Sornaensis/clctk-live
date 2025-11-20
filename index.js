// Initialize the Elm application after database is ready
let app = null;

// IndexedDB setup
const DB_NAME = 'clctk-db';
const DB_VERSION = 9;  // Increment version for UUID migration of 'languages' table
const STORE_NAME = 'languages';
const TEMPLATE_STORE_NAME = 'templates';
const FAMILY_STORE_NAME = 'language-families';
const PROJECT_STORE_NAME = 'language-projects';
const APP_VERSION = '2.0.0';  // IPA chart redesign version

let db = null;

// Open IndexedDB
function openDatabase() {
  return new Promise((resolve, reject) => {
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
      const transaction = event.target.transaction;
      const oldVersion = event.oldVersion;
      
      // Migrate from 'projects' to 'languages' table (version 7 -> 8)
      if (oldVersion < 8 && database.objectStoreNames.contains('projects')) {
        // Read all data from old 'projects' store
        const oldStore = transaction.objectStore('projects');
        const getAllRequest = oldStore.getAll();
        
        getAllRequest.onsuccess = () => {
          const allData = getAllRequest.result;
          
          // Delete old store
          database.deleteObjectStore('projects');
          
          // Create new 'languages' store
          const newStore = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          
          // Copy data to new store (this will happen in the same transaction)
          allData.forEach(item => {
            newStore.add(item);
          });
          
          console.log('Migrated', allData.length, 'items from projects to languages table');
        };
      }
      
      // Migrate from id-based to uuid-based keyPath (version 8 -> 9)
      if (oldVersion < 9 && database.objectStoreNames.contains(STORE_NAME)) {
        // Read all data from current 'languages' store
        const oldStore = transaction.objectStore(STORE_NAME);
        const getAllRequest = oldStore.getAll();
        
        getAllRequest.onsuccess = () => {
          const allData = getAllRequest.result;
          
          // Generate UUIDs for records that don't have them
          allData.forEach(item => {
            if (!item.uuid || item.uuid === '') {
              item.uuid = generateUUID();
            }
            // Remove the old id field as it's no longer needed
            delete item.id;
          });
          
          // Delete old store
          database.deleteObjectStore(STORE_NAME);
          
          // Create new 'languages' store with uuid as keyPath
          const newStore = database.createObjectStore(STORE_NAME, { keyPath: 'uuid' });
          
          // Copy data to new store with UUIDs
          allData.forEach(item => {
            newStore.add(item);
          });
          
          console.log('Migrated', allData.length, 'languages from id-based to uuid-based keyPath');
        };
      }
      
      // Create or update the object store for languages
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'uuid' });
      }
      
      // Create templates store
      if (!database.objectStoreNames.contains(TEMPLATE_STORE_NAME)) {
        database.createObjectStore(TEMPLATE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      
      // Create language families store
      if (!database.objectStoreNames.contains(FAMILY_STORE_NAME)) {
        database.createObjectStore(FAMILY_STORE_NAME, { keyPath: 'uuid' });
      } else {
        // Migrate existing store from id to uuid if needed
        if (transaction.objectStoreNames.contains(FAMILY_STORE_NAME)) {
          const familyStore = transaction.objectStore(FAMILY_STORE_NAME);
          // Delete old store and recreate with UUID key
          database.deleteObjectStore(FAMILY_STORE_NAME);
          database.createObjectStore(FAMILY_STORE_NAME, { keyPath: 'uuid' });
        }
      }
      
      // Create language projects store
      if (!database.objectStoreNames.contains(PROJECT_STORE_NAME)) {
        database.createObjectStore(PROJECT_STORE_NAME, { keyPath: 'uuid' });
      }
    };
  });
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
}

// Save template to IndexedDB
function saveTemplateToIndexedDB(templateData) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([TEMPLATE_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(TEMPLATE_STORE_NAME);

  // If id is 0 or not set, let IndexedDB auto-assign
  if (!templateData.id || templateData.id === 0) {
    delete templateData.id;
    const request = store.add(templateData);
    request.onsuccess = () => {
      console.log('New template created with ID:', request.result);
      // Reload templates
      loadAllTemplates();
    };
    request.onerror = () => {
      console.error('Failed to save new template to IndexedDB');
    };
  } else {
    // Update existing template
    const request = store.put(templateData);
    request.onsuccess = () => {
      console.log('Template updated in IndexedDB');
      loadAllTemplates();
    };
    request.onerror = () => {
      console.error('Failed to update template in IndexedDB');
    };
  }
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



// Migration function for IPA chart redesign
function migrateToIPAChart() {
  try {
    const preferences = JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    
    // Check if migration has already been done
    if (preferences.appVersion === APP_VERSION) {
      console.log('Already migrated to version', APP_VERSION);
      return Promise.resolve();
    }
    
    console.log('Starting migration to IPA chart version', APP_VERSION);
    
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      
      // Clear all projects as they use the old category system
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = () => {
        console.log('Old projects cleared during migration');
        // Mark migration as complete
        savePreference({ appVersion: APP_VERSION, migrationDate: new Date().toISOString() });
        resolve();
      };
      
      clearRequest.onerror = () => {
        console.error('Failed to clear old projects during migration');
        reject(new Error('Migration failed'));
      };
    });
  } catch (error) {
    console.error('Migration error:', error);
    return Promise.reject(error);
  }
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
    console.log('Database initialized');
    // Run migration before loading projects
    return migrateToIPAChart();
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
    console.error('Database initialization or migration failed:', error);
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
