// frontend/src/utils/localStorage.js

// Lists management
export const getLists = () => {
  const lists = localStorage.getItem('vc-lists');
  return lists ? JSON.parse(lists) : {};
};

export const createList = (listName) => {
  const lists = getLists();
  if (!lists[listName]) {
    lists[listName] = [];
    localStorage.setItem('vc-lists', JSON.stringify(lists));
  }
  return lists;
};

export const saveToList = (listName, companyId) => {
  const lists = getLists();
  if (!lists[listName]) {
    lists[listName] = [];
  }
  if (!lists[listName].includes(companyId)) {
    lists[listName].push(companyId);
    localStorage.setItem('vc-lists', JSON.stringify(lists));
  }
  return lists;
};

export const removeFromList = (listName, companyId) => {
  const lists = getLists();
  if (lists[listName]) {
    lists[listName] = lists[listName].filter(id => id !== companyId);
    localStorage.setItem('vc-lists', JSON.stringify(lists));
  }
  return lists;
};

export const deleteList = (listName) => {
  const lists = getLists();
  delete lists[listName];
  localStorage.setItem('vc-lists', JSON.stringify(lists));
  return lists;
};

// Notes management
export const getNotes = () => {
  const notes = localStorage.getItem('vc-notes');
  return notes ? JSON.parse(notes) : {};
};

export const saveNote = (companyId, note) => {
  const notes = getNotes();
  notes[companyId] = {
    content: note,
    timestamp: new Date().toISOString()
  };
  localStorage.setItem('vc-notes', JSON.stringify(notes));
  return notes;
};

export const getNote = (companyId) => {
  const notes = getNotes();
  return notes[companyId] || null;
};

// Saved searches management
export const getSavedSearches = () => {
  const searches = localStorage.getItem('vc-searches');
  return searches ? JSON.parse(searches) : [];
};

export const saveSearch = (searchParams) => {
  const searches = getSavedSearches();
  const newSearch = {
    id: Date.now().toString(),
    ...searchParams,
    savedAt: new Date().toISOString()
  };
  searches.push(newSearch);
  localStorage.setItem('vc-searches', JSON.stringify(searches));
  return searches;
};

export const deleteSavedSearch = (searchId) => {
  const searches = getSavedSearches();
  const filtered = searches.filter(s => s.id !== searchId);
  localStorage.setItem('vc-searches', JSON.stringify(filtered));
  return filtered;
};

// Enrichment cache
export const getEnrichmentCache = (companyId) => {
  const cache = localStorage.getItem('vc-enrichment-cache');
  const parsed = cache ? JSON.parse(cache) : {};
  return parsed[companyId] || null;
};

export const saveEnrichmentCache = (companyId, data) => {
  const cache = localStorage.getItem('vc-enrichment-cache');
  const parsed = cache ? JSON.parse(cache) : {};
  parsed[companyId] = {
    ...data,
    cachedAt: new Date().toISOString()
  };
  localStorage.setItem('vc-enrichment-cache', JSON.stringify(parsed));
  return parsed;
};