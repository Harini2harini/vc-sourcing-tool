// frontend/src/components/FilterPanel.jsx
import React, { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import mockCompanies from '../utils/mockCompanies';

const FilterPanel = ({ onFilterChange, activeFilters }) => {
  const [industries, setIndustries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [employeeRanges, setEmployeeRanges] = useState([]);
  const [localFilters, setLocalFilters] = useState(activeFilters || {
    industries: [],
    locations: [],
    employees: []
  });

  // Extract unique values from mock data
  useEffect(() => {
    const uniqueIndustries = [...new Set(mockCompanies.map(c => c.industry))].sort();
    const uniqueLocations = [...new Set(mockCompanies.map(c => c.location))].sort();
    const uniqueEmployees = [...new Set(mockCompanies.map(c => c.employees))].sort();
    
    setIndustries(uniqueIndustries);
    setLocations(uniqueLocations);
    setEmployeeRanges(uniqueEmployees);
  }, []);

  useEffect(() => {
    setLocalFilters(activeFilters || {
      industries: [],
      locations: [],
      employees: []
    });
  }, [activeFilters]);

  const handleIndustryChange = (industry) => {
    const updated = localFilters.industries.includes(industry)
      ? localFilters.industries.filter(i => i !== industry)
      : [...localFilters.industries, industry];
    
    const newFilters = { ...localFilters, industries: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (location) => {
    const updated = localFilters.locations.includes(location)
      ? localFilters.locations.filter(l => l !== location)
      : [...localFilters.locations, location];
    
    const newFilters = { ...localFilters, locations: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleEmployeeChange = (range) => {
    const updated = localFilters.employees.includes(range)
      ? localFilters.employees.filter(e => e !== range)
      : [...localFilters.employees, range];
    
    const newFilters = { ...localFilters, employees: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = { industries: [], locations: [], employees: [] };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const getActiveFilterCount = () => {
    return localFilters.industries.length + localFilters.locations.length + localFilters.employees.length;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="font-medium text-gray-900">Filters</h3>
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      {/* Industry filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Industry</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {industries.map(industry => (
            <label key={industry} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={localFilters.industries.includes(industry)}
                onChange={() => handleIndustryChange(industry)}
              />
              <span className="ml-2 text-sm text-gray-600">{industry}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location filter */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {locations.map(location => (
            <label key={location} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={localFilters.locations.includes(location)}
                onChange={() => handleLocationChange(location)}
              />
              <span className="ml-2 text-sm text-gray-600">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Employee range filter */}
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Employees</h4>
        <div className="space-y-2">
          {employeeRanges.map(range => (
            <label key={range} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={localFilters.employees.includes(range)}
                onChange={() => handleEmployeeChange(range)}
              />
              <span className="ml-2 text-sm text-gray-600">{range}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;