import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Loader, AlertCircle } from 'lucide-react';

// CSS styles
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #f8fafc;
    color: #334155;
    line-height: 1.6;
  }

  .app {
    min-height: 100vh;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .header {
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    color: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .header p {
    opacity: 0.8;
    font-size: 16px;
  }

  .controls {
    background: white;
    padding: 24px;
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .search-section {
    margin-bottom: 24px;
  }

  .search-group {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
  }

  .search-field {
    flex: 1;
    min-width: 250px;
  }

  .search-field label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #374151;
  }

  .search-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .filters-section {
    border-top: 1px solid #e5e7eb;
    padding-top: 24px;
  }

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .filter-group {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }

  .filter-label {
    font-weight: 600;
    margin-bottom: 12px;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter-options {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
  }

  .filter-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .filter-option:hover {
    background-color: #f9fafb;
  }

  .filter-option:last-child {
    border-bottom: none;
  }

  .filter-option input {
    margin-right: 8px;
  }

  .filter-option label {
    cursor: pointer;
    flex: 1;
    font-size: 14px;
  }

  .filter-count {
    color: #6b7280;
    font-size: 12px;
    background: #f3f4f6;
    padding: 2px 6px;
    border-radius: 10px;
  }

  .filter-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-secondary {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }

  .btn-secondary:hover {
    background: #e5e7eb;
  }

  .results-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .results-header {
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .results-count {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }

  .selection-info {
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 14px;
  }

  .selected-count {
    color: #3b82f6;
    font-weight: 500;
  }

  .selection-error {
    color: #dc2626;
    font-weight: 500;
  }

  .table-container {
    overflow: hidden;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th {
    background: #f8fafc;
    padding: 14px 16px;
    text-align: left;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.2s;
  }

  .table th:hover {
    background: #f1f5f9;
  }

  .table th.sortable {
    position: relative;
  }

  .sort-icon {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
  }

  .table td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
  }

  .table tr:hover {
    background: #f8fafc;
  }

  .checkbox {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  .object-type {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .object-type-payload {
    background: #dcfce7;
    color: #166534;
  }

  .object-type-rocket {
    background: #dbeafe;
    color: #1e40af;
  }

  .object-type-debris {
    background: #fef3c7;
    color: #92400e;
  }

  .object-type-unknown {
    background: #f3f4f6;
    color: #374151;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px;
    flex-direction: column;
    gap: 16px;
  }

  .loading-spinner {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .error {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 60px;
    flex-direction: column;
    gap: 16px;
    color: #dc2626;
  }

  .proceed-section {
    padding: 20px 24px;
    border-top: 1px solid #e5e7eb;
    background: #f8fafc;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .virtual-list {
    height: 600px;
    overflow: auto;
  }

  .virtual-row {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.2s;
  }

  .virtual-row:hover {
    background: #f8fafc;
  }

  .virtual-cell {
    padding: 12px 16px;
    font-size: 14px;
    border-right: 1px solid #f3f4f6;
  }

  .virtual-cell:last-child {
    border-right: none;
  }

  .selected-page {
    padding: 40px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .selected-list {
    list-style: none;
    margin: 20px 0;
  }

  .selected-item {
    padding: 12px;
    margin: 8px 0;
    background: #f8fafc;
    border-radius: 6px;
    border-left: 4px solid #3b82f6;
  }

  @media (max-width: 768px) {
    .app {
      padding: 12px;
    }
    
    .search-group {
      flex-direction: column;
    }
    
    .filters-grid {
      grid-template-columns: 1fr;
    }
    
    .filter-actions {
      justify-content: stretch;
    }
    
    .filter-actions .btn {
      flex: 1;
    }
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

// Types
interface Satellite {
  noradCatId: string;
  intlDes: string;
  name: string;
  launchDate: string;
  decayDate: string | null;
  objectType: string;
  launchSiteCode: string;
  countryCode: string;
  orbitCode: string;
}

interface FilterCounts {
  [key: string]: number;
}

// Constants
const OBJECT_TYPES = ['PAYLOAD', 'ROCKET BODY', 'DEBRIS', 'UNKNOWN'];
const ORBIT_CODES = ['LEO', 'LEO1', 'LEO2', 'LEO3', 'LEO4', 'MEO', 'GEO', 'HEO', 'IGO', 'EGO', 'NSO', 'GTO', 'GHO', 'HAO', 'MGO', 'LMO', 'UFO', 'ESO', 'UNKNOWN'];

// Virtual List Component
const VirtualList: React.FC<{
  items: Satellite[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string, selected: boolean) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}> = ({ items, selectedIds, onSelectionChange, onSort, sortField, sortDirection }) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemHeight = 49;
  const containerHeight = 600;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 5, items.length);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(Math.max(0, newStartIndex - 2));
  };

  const getObjectTypeClass = (type: string) => {
    switch (type) {
      case 'PAYLOAD': return 'object-type object-type-payload';
      case 'ROCKET BODY': return 'object-type object-type-rocket';
      case 'DEBRIS': return 'object-type object-type-debris';
      default: return 'object-type object-type-unknown';
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="sort-icon" /> : <ChevronDown className="sort-icon" />;
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <input type="checkbox" className="checkbox" disabled />
            </th>
            <th className="sortable" onClick={() => onSort('name')}>
              Name <SortIcon field="name" />
            </th>
            <th className="sortable" onClick={() => onSort('noradCatId')}>
              NORAD ID <SortIcon field="noradCatId" />
            </th>
            <th>Orbit Code</th>
            <th>Object Type</th>
            <th>Country</th>
            <th className="sortable" onClick={() => onSort('launchDate')}>
              Launch Date <SortIcon field="launchDate" />
            </th>
          </tr>
        </thead>
      </table>
      <div 
        className="virtual-list" 
        onScroll={handleScroll}
        style={{ height: containerHeight }}
      >
        <div style={{ height: items.length * itemHeight, position: 'relative' }}>
          {items.slice(startIndex, endIndex).map((item, index) => (
            <div
              key={item.noradCatId}
              className="virtual-row"
              style={{
                position: 'absolute',
                top: (startIndex + index) * itemHeight,
                left: 0,
                right: 0,
                height: itemHeight,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div className="virtual-cell" style={{ width: '50px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectedIds.has(item.noradCatId)}
                  onChange={(e) => onSelectionChange(item.noradCatId, e.target.checked)}
                />
              </div>
              <div className="virtual-cell" style={{ flex: '1.5', fontWeight: '500' }}>
                {item.name}
              </div>
              <div className="virtual-cell" style={{ flex: '1' }}>
                {item.noradCatId}
              </div>
              <div className="virtual-cell" style={{ flex: '1' }}>
                {item.orbitCode}
              </div>
              <div className="virtual-cell" style={{ flex: '1' }}>
                <span className={getObjectTypeClass(item.objectType)}>
                  {item.objectType}
                </span>
              </div>
              <div className="virtual-cell" style={{ flex: '1' }}>
                {item.countryCode}
              </div>
              <div className="virtual-cell" style={{ flex: '1' }}>
                {item.launchDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
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
        <div className="selected-page">
          <h1>Selected Satellites ({selectedSatellitesData.length})</h1>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowSelectedPage(false)}
            style={{ marginBottom: '20px' }}
          >
            ← Back to Search
          </button>
          <ul className="selected-list">
            {selectedSatellitesData.map(sat => (
              <li key={sat.noradCatId} className="selected-item">
                <strong>{sat.name}</strong> - {sat.noradCatId}
              </li>
            ))}
          </ul>
        </div>
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
        <div className="search-section">
          <div className="search-group">
            <div className="search-field">
              <label>Search by Name</label>
              <input
                type="text"
                className="search-input"
                placeholder="Enter satellite name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>
            <div className="search-field">
              <label>Search by NORAD ID</label>
              <input
                type="text"
                className="search-input"
                placeholder="Enter NORAD ID..."
                value={searchNoradId}
                onChange={(e) => setSearchNoradId(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <div className="filter-label">
                <Filter size={16} />
                Object Type
              </div>
              <div className="filter-options">
                {OBJECT_TYPES.map(type => (
                  <div key={type} className="filter-option">
                    <input
                      type="checkbox"
                      id={`obj-${type}`}
                      checked={selectedObjectTypes.has(type)}
                      onChange={(e) => {
                        const newSet = new Set(selectedObjectTypes);
                        if (e.target.checked) {
                          newSet.add(type);
                        } else {
                          newSet.delete(type);
                        }
                        setSelectedObjectTypes(newSet);
                      }}
                    />
                    <label htmlFor={`obj-${type}`}>{type}</label>
                    <span className="filter-count">{filterCounts[type] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <div className="filter-label">
                <Filter size={16} />
                Orbit Code
              </div>
              <div className="filter-options">
                {ORBIT_CODES.map(code => (
                  <div key={code} className="filter-option">
                    <input
                      type="checkbox"
                      id={`orbit-${code}`}
                      checked={selectedOrbitCodes.has(code)}
                      onChange={(e) => {
                        const newSet = new Set(selectedOrbitCodes);
                        if (e.target.checked) {
                          newSet.add(code);
                        } else {
                          newSet.delete(code);
                        }
                        setSelectedOrbitCodes(newSet);
                      }}
                    />
                    <label htmlFor={`orbit-${code}`}>{code}</label>
                    <span className="filter-count">{filterCounts[code] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
            <button className="btn btn-primary" onClick={handleApplyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
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