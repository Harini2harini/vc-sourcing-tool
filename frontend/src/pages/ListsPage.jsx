// frontend/src/pages/ListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusIcon, 
  TrashIcon, 
  EyeIcon,
  DocumentArrowDownIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { getLists, createList, deleteList, removeFromList } from '../utils/localStorage';
import mockCompanies from '../utils/mockCompanies';

const ListsPage = () => {
  const [lists, setLists] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [listCompanies, setListCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = () => {
    const savedLists = getLists();
    setLists(savedLists);
  };

  const handleCreateList = () => {
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName('');
      setShowCreateModal(false);
      loadLists();
    }
  };

  const handleDeleteList = (listName) => {
    if (window.confirm(`Are you sure you want to delete "${listName}"?`)) {
      deleteList(listName);
      if (selectedList === listName) {
        setSelectedList(null);
        setListCompanies([]);
      }
      loadLists();
    }
  };

  const handleViewList = (listName) => {
    setSelectedList(listName);
    const companyIds = lists[listName] || [];
    const companies = mockCompanies.filter(c => companyIds.includes(c.id));
    setListCompanies(companies);
  };

  const handleRemoveFromList = (companyId) => {
    if (selectedList) {
      removeFromList(selectedList, companyId);
      // Update the view
      const updatedCompanies = listCompanies.filter(c => c.id !== companyId);
      setListCompanies(updatedCompanies);
      // Reload lists to update counts
      loadLists();
      
      if (updatedCompanies.length === 0) {
        setSelectedList(null);
      }
    }
  };

  const handleExportList = (listName, companies) => {
    // Create CSV content
    const headers = ['Name', 'Industry', 'Location', 'Founded', 'Employees', 'Website'];
    const csvRows = [];
    
    // Add headers
    csvRows.push(headers.join(','));
    
    // Add data rows
    companies.forEach(company => {
      const row = [
        `"${company.name}"`,
        `"${company.industry}"`,
        `"${company.location}"`,
        company.founded,
        `"${company.employees}"`,
        `"${company.website}"`
      ];
      csvRows.push(row.join(','));
    });
    
    // Create and download CSV file
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listName}-companies.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportAllLists = () => {
    const allCompanies = [];
    
    Object.entries(lists).forEach(([listName, companyIds]) => {
      const companies = mockCompanies.filter(c => companyIds.includes(c.id));
      companies.forEach(company => {
        allCompanies.push({
          list: listName,
          ...company
        });
      });
    });

    // Create CSV for all lists
    const headers = ['List Name', 'Company Name', 'Industry', 'Location', 'Founded', 'Employees', 'Website'];
    const csvRows = [headers.join(',')];
    
    allCompanies.forEach(company => {
      const row = [
        `"${company.list}"`,
        `"${company.name}"`,
        `"${company.industry}"`,
        `"${company.location}"`,
        company.founded,
        `"${company.employees}"`,
        `"${company.website}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-lists-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const closeListView = () => {
    setSelectedList(null);
    setListCompanies([]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Lists</h1>
          <p className="text-sm text-gray-500 mt-1">
            Organize and manage your saved companies
          </p>
        </div>
        <div className="flex space-x-3">
          {Object.keys(lists).length > 0 && (
            <button
              onClick={handleExportAllLists}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export All
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New List
          </button>
        </div>
      </div>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Create New List</h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateList}
                disabled={!newListName.trim()}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Lists Grid or List Detail View */}
        {selectedList ? (
          // List Detail View
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <button
                    onClick={closeListView}
                    className="mr-4 text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedList}</h2>
                    <p className="text-sm text-gray-500">
                      {listCompanies.length} {listCompanies.length === 1 ? 'company' : 'companies'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExportList(selectedList, listCompanies)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleDeleteList(selectedList)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Delete List
                  </button>
                </div>
              </div>

              {/* Companies in List */}
              {listCompanies.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>No companies in this list yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {listCompanies.map(company => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-10 w-10 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=random`;
                          }}
                        />
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-gray-900">{company.name}</h4>
                          <p className="text-sm text-gray-500">{company.industry} • {company.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/companies/${company.id}`)}
                          className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-white"
                          title="View company"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromList(company.id)}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white"
                          title="Remove from list"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Lists Grid View
          <div className="flex-1">
            {Object.keys(lists).length === 0 ? (
              <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No lists yet. Create your first list to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(lists).map(([listName, companies]) => (
                  <div
                    key={listName}
                    className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{listName}</h3>
                      <button
                        onClick={() => handleDeleteList(listName)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {companies.length} {companies.length === 1 ? 'company' : 'companies'}
                    </p>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleViewList(listName)}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View List →
                      </button>
                      {companies.length > 0 && (
                        <button
                          onClick={() => {
                            const companyDetails = mockCompanies.filter(c => companies.includes(c.id));
                            handleExportList(listName, companyDetails);
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700"
                          title="Export to CSV"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListsPage;