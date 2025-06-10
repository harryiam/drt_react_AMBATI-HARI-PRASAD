import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import VirtualList from "../components/VirtualList";
import PaginatedTableList from '../components/PaginatedTableList';
import SelectedList from '../components/SelectedList';
import FiltersSection from '../components/FiltersSection';
import SearchSection from '../components/SearchSection';
import { Satellite, FilterCounts, OBJECT_TYPES, ORBIT_CODES } from '../types';
import '../styles.css';

const SatelliteTracker: React.FC = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [searchNoradId, setSearchNoradId] = useState('');
  const [selectedObjectTypes, setSelectedObjectTypes] = useState<Set<string>>(new Set(OBJECT_TYPES));
  const [selectedOrbitCodes, setSelectedOrbitCodes] = useState<Set<string>>(new Set());
  const [selectedSatellites, setSelectedSatellites] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showSelectedPage, setShowSelectedPage] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [filterCounts, setFilterCounts] = useState<FilterCounts>({});

  // Load selected satellites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedSatellites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedSatellites(new Set(parsed));
      } catch (e) {
        console.error('Failed to load selected satellites:', e);
      }
    }
  }, []);

  // Save selected satellites to localStorage
  useEffect(() => {
    localStorage.setItem('selectedSatellites', JSON.stringify(Array.from(selectedSatellites)));
  }, [selectedSatellites]);

  // Debounced API call
  const fetchSatellites = useCallback(async (searchParams: {
    name?: string;
    noradId?: string;
    objectTypes?: string[];
    orbitCodes?: string[];
  }) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      
      if (searchParams.objectTypes && searchParams.objectTypes.length > 0) {
        params.append('objectTypes', searchParams.objectTypes.join(','));
      }
      
      params.append('attributes', 'noradCatId,intlDes,name,launchDate,decayDate,objectType,launchSiteCode,countryCode,orbitCode');

      const response = await fetch(`https://backend.digantara.dev/v1/satellites?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.statusCode && data.statusCode !== 200) {
        throw new Error(data.message || 'API Error');
      }

      let filteredData = data.data || [];

      // Apply client-side filters
      if (searchParams.name) {
        filteredData = filteredData.filter((sat: Satellite) =>
          sat.name.toLowerCase().includes(searchParams.name!.toLowerCase())
        );
      }

      if (searchParams.noradId) {
        filteredData = filteredData.filter((sat: Satellite) =>
          sat.noradCatId.includes(searchParams.noradId!)
        );
      }

      if (searchParams.orbitCodes && searchParams.orbitCodes.length > 0) {
        filteredData = filteredData.filter((sat: Satellite) =>
          searchParams.orbitCodes!.some(code => sat.orbitCode.includes(code))
        );
      }

      // Calculate filter counts
      const counts: FilterCounts = {};
      OBJECT_TYPES.forEach(type => {
        counts[type] = filteredData.filter((sat: Satellite) => sat.objectType === type).length;
      });
      ORBIT_CODES.forEach(code => {
        counts[code] = filteredData.filter((sat: Satellite) => sat.orbitCode.includes(code)).length;
      });

      setFilterCounts(counts);
      setSatellites(filteredData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch satellites');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSatellites({ objectTypes: Array.from(selectedObjectTypes) });
  }, [fetchSatellites, selectedObjectTypes]);

  // Handle search
  const handleSearch = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchSatellites({
        name: searchName,
        noradId: searchNoradId,
        objectTypes: Array.from(selectedObjectTypes),
        orbitCodes: Array.from(selectedOrbitCodes)
      });
    }
  }, [searchName, searchNoradId, selectedObjectTypes, selectedOrbitCodes, fetchSatellites]);

  // Handle filter application
  const handleApplyFilters = () => {
    fetchSatellites({
      name: searchName,
      noradId: searchNoradId,
      objectTypes: Array.from(selectedObjectTypes),
      orbitCodes: Array.from(selectedOrbitCodes)
    });
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setSearchName('');
    setSearchNoradId('');
    setSelectedObjectTypes(new Set(OBJECT_TYPES));
    setSelectedOrbitCodes(new Set());
    fetchSatellites({ objectTypes: OBJECT_TYPES });
  };

  // Handle selection
  const handleSelectionChange = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedSatellites);
    
    if (selected) {
      if (newSelected.size >= 10) {
        setSelectionError('Maximum 10 selections allowed');
        return;
      }
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    
    setSelectionError(null);
    setSelectedSatellites(newSelected);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort satellites
  const sortedSatellites = useMemo(() => {
    return [...satellites].sort((a, b) => {
      let aVal = a[sortField as keyof Satellite] || 0;
      let bVal = b[sortField as keyof Satellite] || 0;
      
      if (sortField === 'noradCatId') {
        aVal = parseInt(aVal as string) || 0;
        bVal = parseInt(bVal as string) || 0;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [satellites, sortField, sortDirection]);

  // Handle proceed to selected page
  const handleProceed = () => {
    setShowSelectedPage(true);
  };

  // Get selected satellites data
  const selectedSatellitesData = useMemo(() => {
    return satellites.filter(sat => selectedSatellites.has(sat.noradCatId));
  }, [satellites, selectedSatellites]);

  if (showSelectedPage) {
    return (
      <div className="app">
        <SelectedList 
          selectedSatellitesData={selectedSatellitesData}
          onGoBack={() => setShowSelectedPage(false)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <div className="header">
        <h1>🛰️ Digantara Satellite Tracker</h1>
        <p>Search, filter, and analyze space objects from our satellite catalog</p>
      </div>

      <div className="controls">
        <SearchSection
          searchName={searchName}
          setSearchName={setSearchName}
          searchNoradId={searchNoradId}
          setSearchNoradId={setSearchNoradId}
          onSearch={handleSearch}
        />

        <FiltersSection
          selectedObjectTypes={selectedObjectTypes}
          setSelectedObjectTypes={setSelectedObjectTypes}
          selectedOrbitCodes={selectedOrbitCodes}
          setSelectedOrbitCodes={setSelectedOrbitCodes}
          filterCounts={filterCounts}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      <div className="results-container">
        <div className="results-header">
          <div className="results-count">
            {satellites.length} satellites found
          </div>
          <div className="selection-info">
            <span className="selected-count">
              {selectedSatellites.size} selected
            </span>
            {selectionError && (
              <span className="selection-error">{selectionError}</span>
            )}
          </div>
        </div>

        {loading && (
          <div className="loading">
            <Loader className="loading-spinner" size={32} />
            <p>Loading satellites...</p>
          </div>
        )}

        {error && (
          <div className="error">
            <AlertCircle size={32} />
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchSatellites({ objectTypes: Array.from(selectedObjectTypes) })}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <VirtualList
            items={sortedSatellites}
            selectedIds={selectedSatellites}
            onSelectionChange={handleSelectionChange}
            onSort={handleSort}
            sortField={sortField}
            sortDirection={sortDirection}
          />
        //   <PaginatedTableList
        //   items={sortedSatellites}
        //   selectedIds={selectedSatellites}
        //   onSelectionChange={handleSelectionChange}
        //   onSort={handleSort}
        //   sortField={sortField}
        //   sortDirection={sortDirection}
        // />
        )}

        {selectedSatellites.size > 0 && (
          <div className="proceed-section">
            <span>Ready to proceed with {selectedSatellites.size} selected satellites</span>
            <button className="btn btn-primary" onClick={handleProceed}>
              Proceed →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatelliteTracker;