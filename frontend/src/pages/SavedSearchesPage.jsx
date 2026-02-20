// frontend/src/pages/SavedSearchesPage.jsx
import React, { useState, useEffect } from 'react';
import { getSavedSearches, deleteSavedSearch } from '../utils/localStorage';
import { TrashIcon, PlayIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const SavedSearchesPage = () => {
  const [searches, setSearches] = useState([]);
  const [expandedSearch, setExpandedSearch] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSearches();
  }, []);

  const loadSearches = () => {
    const savedSearches = getSavedSearches();
    // Sort by most recent first
    savedSearches.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    setSearches(savedSearches);
  };

  const handleDelete = (searchId) => {
    if (window.confirm('Are you sure you want to delete this saved search?')) {
      deleteSavedSearch(searchId);
      loadSearches();
      if (expandedSearch === searchId) {
        setExpandedSearch(null);
      }
    }
  };

  const handleRunSearch = (search) => {
    // Navigate to companies page with search params
    // We'll pass the search params via state
    navigate('/companies', { 
      state: { 
        savedSearch: {
          query: search.query,
          filters: search.filters
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getFilterSummary = (filters) => {
    const parts = [];
    if (filters?.industries?.length > 0) {
      parts.push(`${filters.industries.length} industries`);
    }
    if (filters?.locations?.length > 0) {
      parts.push(`${filters.locations.length} locations`);
    }
    if (filters?.employees?.length > 0) {
      parts.push(`${filters.employees.length} employee ranges`);
    }
    return parts.join(' • ') || 'No filters';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Searches</h1>
        <p className="text-sm text-gray-500 mt-1">
          Re-run your previously saved discovery searches
        </p>
      </div>

      {/* Searches List */}
      {searches.length === 0 ? (
        <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-500">No saved searches yet. Save a search from the Discover page to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((search) => (
            <div
              key={search.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Search Header */}
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {search.query || 'All Companies'}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {getFilterSummary(search.filters)}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Saved {formatDate(search.savedAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleRunSearch(search)}
                      className="inline-flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Run Search
                    </button>
                    <button
                      onClick={() => setExpandedSearch(expandedSearch === search.id ? null : search.id)}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      {expandedSearch === search.id ? 'Show less' : 'Show details'}
                    </button>
                    <button
                      onClick={() => handleDelete(search.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                      title="Delete search"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedSearch === search.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Search Details</h4>
                  
                  {/* Search Query */}
                  {search.query && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Search Query</p>
                      <p className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-200">
                        "{search.query}"
                      </p>
                    </div>
                  )}

                  {/* Filters */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Industries */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Industries</p>
                      {search.filters?.industries?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {search.filters.industries.map(ind => (
                            <span key={ind} className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded">
                              {ind}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">All industries</p>
                      )}
                    </div>

                    {/* Locations */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Locations</p>
                      {search.filters?.locations?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {search.filters.locations.map(loc => (
                            <span key={loc} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                              {loc}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">All locations</p>
                      )}
                    </div>

                    {/* Employee Ranges */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Company Size</p>
                      {search.filters?.employees?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {search.filters.employees.map(emp => (
                            <span key={emp} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                              {emp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400">All sizes</p>
                      )}
                    </div>
                  </div>

                  {/* Saved At Timestamp */}
                  <div className="mt-4 text-xs text-gray-400">
                    Saved on {new Date(search.savedAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Usage Tips */}
      {searches.length > 0 && (
        <div className="mt-8 bg-primary-50 rounded-lg p-4 border border-primary-100">
          <h3 className="text-sm font-medium text-primary-800 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-primary-700 space-y-1 list-disc list-inside">
            <li>Click "Run Search" to apply saved filters to the Discover page</li>
            <li>Save searches with different combinations to track multiple investment theses</li>
            <li>Delete old searches to keep your list focused</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SavedSearchesPage;