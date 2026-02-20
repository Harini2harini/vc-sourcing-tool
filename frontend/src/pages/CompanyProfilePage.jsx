// frontend/src/pages/CompanyProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowPathIcon, BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import LoadingSpinner from '../components/LoadingSpinner';
import mockCompanies from '../utils/mockCompanies';
import { enrichCompany } from '../services/api';
import {
  saveToList,
  getLists,
  saveNote,
  getNote,
  getEnrichmentCache,
  saveEnrichmentCache
} from '../utils/localStorage';

const CompanyProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = mockCompanies.find(c => c.id === parseInt(id));

  // State
  const [enrichmentData, setEnrichmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [note, setNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showListDropdown, setShowListDropdown] = useState(false);
  const [lists, setLists] = useState([]);

  // Load cached data on mount
  useEffect(() => {
    if (!company) return;

    // Check for cached enrichment
    const cached = getEnrichmentCache(company.id);
    if (cached) {
      setEnrichmentData(cached);
    }

    // Load saved note
    const savedNote = getNote(company.id);
    if (savedNote) {
      setNote(savedNote.content);
    }

    // Check if company is saved in any list
    const allLists = getLists();
    setLists(Object.keys(allLists));
    const isCompanySaved = Object.values(allLists).some(list =>
      list.includes(company.id)
    );
    setIsSaved(isCompanySaved);
  }, [company]);

  if (!company) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Company not found</p>
          <button
            onClick={() => navigate('/companies')}
            className="mt-2 text-primary-600 hover:text-primary-700"
          >
            ← Back to companies
          </button>
        </div>
      </div>
    );
  }

  const handleEnrich = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await enrichCompany(company.website);
      setEnrichmentData(data);
      // Cache the results
      saveEnrichmentCache(company.id, data);
    } catch (err) {
      setError(err.message || 'Failed to enrich company data. Please try again.');
      console.error('Enrichment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = () => {
    setSavingNote(true);
    saveNote(company.id, note);
    setTimeout(() => setSavingNote(false), 500); // Simulate save
  };

  const handleSaveToList = (listName) => {
    saveToList(listName, company.id);
    setIsSaved(true);
    setShowListDropdown(false);
  };

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/companies')}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-4 w-4 mr-1" />
        Back to companies
      </button>

      {/* Company Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <img
              src={company.logo}
              alt={company.name}
              className="h-16 w-16 rounded-lg object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=random&size=64`;
              }}
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm"
              >
                {company.website}
              </a>
            </div>
          </div>

          {/* Save to List Button */}
          <div className="relative">
            <button
              onClick={() => setShowListDropdown(!showListDropdown)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {isSaved ? (
                <BookmarkSolid className="h-5 w-5 text-primary-600 mr-2" />
              ) : (
                <BookmarkOutline className="h-5 w-5 mr-2" />
              )}
              {isSaved ? 'Saved' : 'Save to List'}
            </button>

            {/* List dropdown */}
            {showListDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                {lists.length > 0 ? (
                  lists.map(listName => (
                    <button
                      key={listName}
                      onClick={() => handleSaveToList(listName)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {listName}
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">
                    No lists yet. Create one in "My Lists"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Company details grid */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Industry</p>
            <p className="font-medium">{company.industry}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{company.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Founded</p>
            <p className="font-medium">{company.founded}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Employees</p>
            <p className="font-medium">{company.employees}</p>
          </div>
        </div>
      </div>

      {/* Enrichment Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Enrichment</h2>
          <button
            onClick={handleEnrich}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                <span className="ml-2">Enriching...</span>
              </>
            ) : (
              <>
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                {enrichmentData ? 'Re-enrich' : 'Enrich Company'}
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {enrichmentData && (
          <div className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
              <p className="text-gray-600 bg-gray-50 rounded-lg p-3">
                {enrichmentData.summary}
              </p>
            </div>

            {/* What they do - Bullets */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">What they do</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {enrichmentData.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {enrichmentData.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Signals */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Signals</h3>
              <div className="grid grid-cols-2 gap-3">
                {enrichmentData.signals.map((signal, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 flex items-start">
                    <span className="text-xl mr-2">{signal.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{signal.type}</p>
                      <p className="text-xs text-gray-600">{signal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Sources</h3>
              <div className="space-y-1">
                {enrichmentData.sources.map((source, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {source.url}
                    </a>
                    <span className="ml-2">
                      (fetched: {new Date(source.fetched_at).toLocaleString()})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!enrichmentData && !loading && !error && (
          <div className="text-center py-12 text-gray-500">
            <p>Click "Enrich Company" to fetch live data from their website</p>
          </div>
        )}
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your notes about this company..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          rows="4"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleSaveNote}
            disabled={savingNote}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {savingNote ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;