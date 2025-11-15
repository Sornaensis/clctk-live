// Initialize the Elm application
const app = Elm.Main.init({
  node: document.getElementById('app')
});

// IndexedDB setup
const DB_NAME = 'clctk-db';
const DB_VERSION = 5;  // Increment version for language families
const STORE_NAME = 'projects';
const TEMPLATE_STORE_NAME = 'templates';
const FAMILY_STORE_NAME = 'language-families';
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
      
      // Create or update the object store for projects
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      
      // Create templates store
      if (!database.objectStoreNames.contains(TEMPLATE_STORE_NAME)) {
        database.createObjectStore(TEMPLATE_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
      
      // Create language families store
      if (!database.objectStoreNames.contains(FAMILY_STORE_NAME)) {
        database.createObjectStore(FAMILY_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Save project to IndexedDB
function saveToIndexedDB(projectData) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);

  // Add timestamp if not present
  const dataToStore = {
    ...projectData,
    lastModified: projectData.lastModified || new Date().toISOString()
  };

  // If id is 0 or not set, let IndexedDB auto-assign
  if (!dataToStore.id || dataToStore.id === 0) {
    delete dataToStore.id;
    const request = store.add(dataToStore);
    request.onsuccess = () => {
      console.log('New project created with ID:', request.result);
      // Load the newly created project back
      loadProjectByIdInternal(request.result);
    };
    request.onerror = () => {
      console.error('Failed to save new project to IndexedDB');
    };
  } else {
    // Update existing project
    const request = store.put(dataToStore);
    request.onsuccess = () => {
      console.log('Project updated in IndexedDB');
    };
    request.onerror = () => {
      console.error('Failed to update project in IndexedDB');
    };
  }
}

// Load the first project or a specific project from IndexedDB
function loadFromIndexedDB() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  
  // Try to get a project - first try ID 1, then get the first one
  const request = store.get(1);

  request.onsuccess = () => {
    if (request.result) {
      console.log('Project loaded from IndexedDB');
      app.ports.loadFromStorage.send(request.result);
    } else {
      // If no project with ID 1, try to get the first project
      const cursorRequest = store.openCursor();
      cursorRequest.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          console.log('First project loaded from IndexedDB');
          app.ports.loadFromStorage.send(cursor.value);
        } else {
          console.log('No projects found in IndexedDB');
        }
      };
    }
  };

  request.onerror = () => {
    console.error('Failed to load project from IndexedDB');
  };
}

// Load all projects (metadata only)
function loadAllProjects() {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();

  request.onsuccess = () => {
    const projects = request.result.map(p => ({
      id: p.id,
      name: p.name,
      created: p.created || '',
      lastModified: p.lastModified || ''
    }));
    console.log('All projects loaded:', projects.length);
    app.ports.receiveAllProjects.send(projects);
  };

  request.onerror = () => {
    console.error('Failed to load all projects');
  };
}

// Load a specific project by ID
function loadProjectByIdInternal(projectId) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readonly');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.get(projectId);

  request.onsuccess = () => {
    if (request.result) {
      console.log('Project loaded by ID:', projectId);
      app.ports.receiveProject.send(request.result);
    } else {
      console.error('Project not found with ID:', projectId);
    }
  };

  request.onerror = () => {
    console.error('Failed to load project by ID');
  };
}

// Delete a project by ID
function deleteProjectById(projectId) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const request = store.delete(projectId);

  request.onsuccess = () => {
    console.log('Project deleted:', projectId);
    // Reload the project list
    loadAllProjects();
  };

  request.onerror = () => {
    console.error('Failed to delete project');
  };
}

// Duplicate a project by ID
function duplicateProjectById(projectId) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  // First, load the project to duplicate
  const readTransaction = db.transaction([STORE_NAME], 'readonly');
  const readStore = readTransaction.objectStore(STORE_NAME);
  const getRequest = readStore.get(projectId);

  getRequest.onsuccess = () => {
    if (!getRequest.result) {
      console.error('Project not found with ID:', projectId);
      return;
    }

    const originalProject = getRequest.result;
    
    // Smart naming: avoid "Copy (Copy)" by using numbering
    let baseName = originalProject.name;
    if (baseName.endsWith(' (Copy)')) {
      baseName = baseName.substring(0, baseName.length - 7);
    } else if (baseName.match(/ \(Copy \d+\)$/)) {
      // Remove " (Copy N)" from the end
      baseName = baseName.replace(/ \(Copy \d+\)$/, '');
    }
    
    // Load all projects to find existing copies
    const allProjectsRequest = readStore.getAll();
    
    allProjectsRequest.onsuccess = () => {
      const allProjects = allProjectsRequest.result;
      
      // Count how many projects start with the base name
      const existingCopies = allProjects.filter(p => 
        p.name.startsWith(baseName)
      ).length;
      
      // Generate the new name
      let newName;
      if (existingCopies === 1) {
        newName = baseName + ' (Copy)';
      } else {
        newName = baseName + ' (Copy ' + existingCopies + ')';
      }
      
      // Create a duplicate with the new name and timestamps
      const duplicateProject = {
        ...originalProject,
        name: newName,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      
      // Remove the ID so IndexedDB will auto-assign a new one
      delete duplicateProject.id;

      // Save the duplicate
      const writeTransaction = db.transaction([STORE_NAME], 'readwrite');
      const writeStore = writeTransaction.objectStore(STORE_NAME);
      const addRequest = writeStore.add(duplicateProject);

      addRequest.onsuccess = () => {
        console.log('Project duplicated with new ID:', addRequest.result);
        // Reload the project list to show the new duplicate
        loadAllProjects();
      };

      addRequest.onerror = () => {
        console.error('Failed to duplicate project');
      };
    };
    
    allProjectsRequest.onerror = () => {
      console.error('Failed to load all projects for duplication');
    };
  };

  getRequest.onerror = () => {
    console.error('Failed to load project for duplication');
  };
}

// Rename a project by ID
function renameProjectById(projectId, newName) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([STORE_NAME], 'readwrite');
  const store = transaction.objectStore(STORE_NAME);
  const getRequest = store.get(projectId);

  getRequest.onsuccess = () => {
    if (!getRequest.result) {
      console.error('Project not found with ID:', projectId);
      return;
    }

    const project = getRequest.result;
    project.name = newName;
    project.lastModified = new Date().toISOString();

    const updateRequest = store.put(project);

    updateRequest.onsuccess = () => {
      console.log('Project renamed successfully');
      // Reload the project list to show the updated name
      loadAllProjects();
      // If this is the current project, also reload it to update the UI
      loadProjectByIdInternal(projectId);
    };

    updateRequest.onerror = () => {
      console.error('Failed to rename project');
    };
  };

  getRequest.onerror = () => {
    console.error('Failed to load project for renaming');
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

// Port subscriptions
app.ports.saveToStorage.subscribe((data) => {
  saveToIndexedDB(data);
});

app.ports.exportProject.subscribe((data) => {
  exportProjectToFile(data);
});

app.ports.getCurrentTime.subscribe(() => {
  const timestamp = new Date().toISOString();
  app.ports.receiveCurrentTime.send(timestamp);
});

app.ports.loadAllProjects.subscribe(() => {
  loadAllProjects();
});

app.ports.deleteProjectById.subscribe((projectId) => {
  deleteProjectById(projectId);
});

app.ports.duplicateProjectById.subscribe((projectId) => {
  duplicateProjectById(projectId);
});

app.ports.renameProjectById.subscribe((data) => {
  renameProjectById(data.projectId, data.newName);
});

app.ports.loadProjectById.subscribe((projectId) => {
  loadProjectByIdInternal(projectId);
});

// Handle import trigger
app.ports.triggerImport.subscribe(() => {
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
app.ports.exportCSV.subscribe((csvContent) => {
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
app.ports.triggerCSVImport.subscribe(() => {
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

// Port subscriptions for templates
app.ports.saveTemplateToStorage.subscribe((data) => {
  saveTemplateToIndexedDB(data);
});

app.ports.loadAllTemplates.subscribe(() => {
  // If database is not ready, wait a bit and try again
  if (!db) {
    setTimeout(() => {
      loadAllTemplates();
    }, 100);
  } else {
    loadAllTemplates();
  }
});

app.ports.deleteTemplateById.subscribe((templateId) => {
  deleteTemplateById(templateId);
});

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

app.ports.savePreference.subscribe((data) => {
  savePreference(data);
});

app.ports.loadPreferences.subscribe(() => {
  loadPreferences();
});

// Language Family Management Functions

// Save language family to IndexedDB
function saveLanguageFamilyToIndexedDB(familyData) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([FAMILY_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(FAMILY_STORE_NAME);

  // If id is 0 or not set, let IndexedDB auto-assign
  if (!familyData.id || familyData.id === 0) {
    delete familyData.id;
    const request = store.add(familyData);
    request.onsuccess = () => {
      console.log('New language family created with ID:', request.result);
      // Reload language families
      loadAllLanguageFamilies();
    };
    request.onerror = () => {
      console.error('Failed to save new language family to IndexedDB');
    };
  } else {
    // Update existing family
    const request = store.put(familyData);
    request.onsuccess = () => {
      console.log('Language family updated in IndexedDB');
      loadAllLanguageFamilies();
    };
    request.onerror = () => {
      console.error('Failed to update language family in IndexedDB');
    };
  }
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

// Delete a language family by ID
function deleteLanguageFamilyById(familyId) {
  if (!db) {
    console.error('Database not initialized');
    return;
  }

  const transaction = db.transaction([FAMILY_STORE_NAME], 'readwrite');
  const store = transaction.objectStore(FAMILY_STORE_NAME);
  const request = store.delete(familyId);

  request.onsuccess = () => {
    console.log('Language family deleted:', familyId);
    // Reload the family list
    loadAllLanguageFamilies();
  };

  request.onerror = () => {
    console.error('Failed to delete language family');
  };
}

// Port subscriptions for language families
app.ports.saveLanguageFamily.subscribe((data) => {
  saveLanguageFamilyToIndexedDB(data);
});

app.ports.loadAllLanguageFamilies.subscribe(() => {
  // If database is not ready, wait a bit and try again
  if (!db) {
    setTimeout(() => {
      loadAllLanguageFamilies();
    }, 100);
  } else {
    loadAllLanguageFamilies();
  }
});

app.ports.deleteLanguageFamilyById.subscribe((familyId) => {
  deleteLanguageFamilyById(familyId);
});

// Handle cursor position insertions
app.ports.insertAtCursor.subscribe((data) => {
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

// Initialize database and load existing data
openDatabase()
  .then(() => {
    console.log('Database initialized');
    // Run migration before loading projects
    return migrateToIPAChart();
  })
  .then(() => {
    loadFromIndexedDB();
    loadAllTemplates();
    loadPreferences();
  })
  .catch((error) => {
    console.error('Database initialization or migration failed:', error);
    // Still try to load what we can
    loadAllTemplates();
    loadPreferences();
  });
