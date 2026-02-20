// frontend/src/pages/CompaniesPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import CompanyTable from '../components/CompanyTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import mockCompanies from '../utils/mockCompanies';
import { saveSearch } from '../utils/localStorage';

const CompaniesPage = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    industries: [],
    locations: [],
    employees: []
  });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  // Load saved search from navigation state
  useEffect(() => {
    if (location.state?.savedSearch) {
      const { query, filters } = location.state.savedSearch;
      setSearchTerm(query || '');
      if (filters) {
        setFilters(filters);
      }
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    setLoading(true);
    
    let result = [...mockCompanies];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(company => 
        company.name.toLowerCase().includes(term) ||
        company.description.toLowerCase().includes(term) ||
        company.industry.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.industries.length > 0) {
      result = result.filter(company => filters.industries.includes(company.industry));
    }
    if (filters.locations.length > 0) {
      result = result.filter(company => filters.locations.includes(company.location));
    }
    if (filters.employees.length > 0) {
      result = result.filter(company => filters.employees.includes(company.employees));
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setLoading(false);
    return result;
  }, [searchTerm, filters, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(start, start + itemsPerPage);
  }, [filteredCompanies, currentPage]);

  const handleSaveCurrentSearch = () => {
    const searchParams = {
      query: searchTerm,
      filters: filters,
      savedAt: new Date().toISOString()
    };
    saveSearch(searchParams);
    
    // Show a temporary success message
    const btn = document.getElementById('save-search-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Saved! ✓';
    btn.classList.add('bg-green-600', 'text-white');
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.classList.remove('bg-green-600', 'text-white');
    }, 2000);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Discover Companies</h1>
        <p className="text-sm text-gray-500 mt-1">
          Find and track high-signal companies matching your thesis
        </p>
      </div>

      {/* Search and Save Section */}
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <button
          id="save-search-btn"
          onClick={handleSaveCurrentSearch}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <BookmarkIcon className="h-4 w-4 mr-2" />
          Save Search
        </button>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-80 flex-shrink-0">
          <FilterPanel onFilterChange={setFilters} activeFilters={filters} />
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Results header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{paginatedCompanies.length}</span> of{' '}
              <span className="font-medium">{filteredCompanies.length}</span> companies
            </p>
            {(searchTerm || filters.industries.length > 0 || filters.locations.length > 0 || filters.employees.length > 0) && (
              <p className="text-sm text-gray-500">
                Filters applied: {' '}
                {searchTerm && <span className="text-primary-600">"{searchTerm}"</span>}
                {filters.industries.length > 0 && <span className="ml-1">• {filters.industries.length} industries</span>}
                {filters.locations.length > 0 && <span className="ml-1">• {filters.locations.length} locations</span>}
                {filters.employees.length > 0 && <span className="ml-1">• {filters.employees.length} sizes</span>}
              </p>
            )}
          </div>

          {/* Table */}
          {loading ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <>
              {paginatedCompanies.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500 mb-2">No companies found</p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              ) : (
                <>
                  <CompanyTable
                    companies={paginatedCompanies}
                    onSort={setSortConfig}
                    sortConfig={sortConfig}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200">
                      <div className="flex-1 flex justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Page <span className="font-medium">{currentPage}</span> of{' '}
                            <span className="font-medium">{totalPages}</span>
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">First</span>
                              <span>First</span>
                            </button>
                            <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Previous</span>
                              <span>Previous</span>
                            </button>
                            
                            {/* Page Numbers */}
                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }
                              
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                    currentPage === pageNum
                                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                            
                            <button
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Next</span>
                              <span>Next</span>
                            </button>
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span className="sr-only">Last</span>
                              <span>Last</span>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick Stats (Optional) */}
      {filteredCompanies.length > 0 && !loading && (
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Companies</p>
            <p className="text-2xl font-semibold text-gray-900">{filteredCompanies.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Industries</p>
            <p className="text-2xl font-semibold text-gray-900">
              {new Set(filteredCompanies.map(c => c.industry)).size}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Locations</p>
            <p className="text-2xl font-semibold text-gray-900">
              {new Set(filteredCompanies.map(c => c.location)).size}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Avg. Founded Year</p>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(filteredCompanies.reduce((acc, c) => acc + parseInt(c.founded), 0) / filteredCompanies.length)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesPage;