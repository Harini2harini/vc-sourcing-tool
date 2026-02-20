// frontend/src/components/CompanyTable.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon, BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { saveToList, getLists } from '../utils/localStorage';

const CompanyTable = ({ companies, onSort, sortConfig }) => {
  const navigate = useNavigate();
  const [savedCompanies, setSavedCompanies] = useState(() => {
    const lists = getLists();
    // Flatten all saved company IDs from all lists
    return Object.values(lists).flat();
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    onSort({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4 inline ml-1" /> : 
      <ChevronDownIcon className="h-4 w-4 inline ml-1" />;
  };

  const handleSaveToList = (e, companyId) => {
    e.stopPropagation(); // Prevent row click
    const listName = prompt('Enter list name to save to:');
    if (listName) {
      saveToList(listName, companyId);
      setSavedCompanies([...savedCompanies, companyId]);
    }
  };

  const isCompanySaved = (companyId) => {
    return savedCompanies.includes(companyId);
  };

  const columns = [
    { key: 'name', label: 'Company' },
    { key: 'industry', label: 'Industry' },
    { key: 'location', label: 'Location' },
    { key: 'founded', label: 'Founded' },
    { key: 'employees', label: 'Employees' },
    { key: 'actions', label: '', sortable: false }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => column.sortable !== false && handleSort(column.key)}
              >
                <span className="flex items-center">
                  {column.label}
                  {column.sortable !== false && getSortIcon(column.key)}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map((company) => (
            <tr
              key={company.id}
              onClick={() => navigate(`/companies/${company.id}`)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-lg object-cover"
                      src={company.logo}
                      alt={company.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=random`;
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{company.name}</div>
                    <div className="text-sm text-gray-500">{company.description.substring(0, 60)}...</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                  {company.industry}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {company.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {company.founded}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {company.employees}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button
                  onClick={(e) => handleSaveToList(e, company.id)}
                  className="text-gray-400 hover:text-primary-600 transition-colors"
                  title="Save to list"
                >
                  {isCompanySaved(company.id) ? (
                    <BookmarkSolid className="h-5 w-5 text-primary-600" />
                  ) : (
                    <BookmarkOutline className="h-5 w-5" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTable;