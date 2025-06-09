import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Filter, Loader, AlertCircle, Check, ChevronDown } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';

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

interface ApiResponse {
  data: Satellite[];
  counts?: {
    total: string;
    PAYLOAD: string;
    'ROCKET BODY': string;
    UNKNOWN: string;
    DEBRIS: string;
  };
}

interface Filters {
  objectTypes: string[];
  orbitCodes: string[];
}

interface SortConfig {
  key: keyof Satellite;
  direction: 'asc' | 'desc';
}

const OBJECT_TYPES = ['PAYLOAD', 'ROCKET BODY', 'DEBRIS', 'UNKNOWN'];
const ORBIT_CODES = ['LEO', 'LEO1', 'LEO2', 'LEO3', 'LEO4', 'MEO', 'GEO', 'HEO', 'IGO', 'EGO', 'NSO', 'GTO', 'GHO', 'HAO', 'MGO', 'LMO', 'UFO', 'ESO', 'UNKNOWN'];

const SatelliteTracker: React.FC = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    objectTypes: OBJECT_TYPES,
    orbitCodes: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showSelected, setShowSelected] = useState(false);
  const [counts, setCounts] = useState<ApiResponse['counts']>();

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch satellites
  const fetchSatellites = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.objectTypes.length > 0) {
        params.append('objectTypes', filters.objectTypes.join(','));
      }
      params.append('attributes', 'noradCatId,intlDes,name,launchDate,decayDate,objectType,launchSiteCode,countryCode,orbitCode');
      
      const response = await fetch(`https://backend.digantara.dev/v1/satellites?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      setSatellites(data.data || []);
      setCounts(data.counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch satellites');
      setSatellites([]);
    } finally {
      setLoading(false);
    }
  }, [filters.objectTypes]);

  useEffect(() => {
    fetchSatellites();
  }, [fetchSatellites]);

  // Filter and sort satellites
  const filteredAndSortedSatellites = useMemo(() => {
    let filtered = satellites.filter(satellite => {
      const matchesSearch = !searchQuery || 
        satellite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        satellite.noradCatId.includes(searchQuery);
      
      const matchesOrbitCode = filters.orbitCodes.length === 0 || 
        filters.orbitCodes.some(code => satellite.orbitCode.includes(code));
      
      return matchesSearch && matchesOrbitCode;
    });

    // Sort
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [satellites, searchQuery, filters.orbitCodes, sortConfig]);

  // Load selected items from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedSatellites');
    if (saved) {
      try {
        const selectedIds = JSON.parse(saved);
        setSelectedRows(new Set(selectedIds));
      } catch {
        // Ignore invalid JSON
      }
    }
  }, []);

  // Save selected items to localStorage
  useEffect(() => {
    localStorage.setItem('selectedSatellites', JSON.stringify([...selectedRows]));
  }, [selectedRows]);

  const handleSort = (key: keyof Satellite) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowSelect = (noradCatId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noradCatId)) {
        newSet.delete(noradCatId);
      } else if (newSet.size < 10) {
        newSet.add(noradCatId);
      }
      return newSet;
    });
  };

  const handleFilterChange = (type: 'objectTypes' | 'orbitCodes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value) 
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const applyFilters = () => {
    setShowFilters(false);
    // Filters are applied reactively, so just close the panel
  };

  const getSelectedSatellites = () => {
    return satellites.filter(sat => selectedRows.has(sat.noradCatId));
  };

  // Virtual list row renderer
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const satellite = filteredAndSortedSatellites[index];
    const isSelected = selectedRows.has(satellite.noradCatId);
    
    return (
      <div style={style} className="flex items-center border-b border-gray-200 hover:bg-gray-50">
        <div className="w-12 flex justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleRowSelect(satellite.noradCatId)}
            disabled={!isSelected && selectedRows.size >= 10}
            className="w-4 h-4 text-blue-600"
          />
        </div>
        <div className="flex-1 grid grid-cols-6 gap-4 px-4 py-3 text-sm">
          <div className="truncate font-medium">{satellite.name}</div>
          <div className="truncate">{satellite.noradCatId}</div>
          <div className="truncate">{satellite.orbitCode}</div>
          <div className="truncate">{satellite.objectType}</div>
          <div className="truncate">{satellite.countryCode}</div>
          <div className="truncate">{satellite.launchDate}</div>
        </div>
      </div>
    );
  };

  if (showSelected) {
    const selectedSatellites = getSelectedSatellites();
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Selected Satellites</h1>
              <button
                onClick={() => setShowSelected(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Back to Search
              </button>
            </div>
            <div className="space-y-3">
              {selectedSatellites.map(satellite => (
                <div key={satellite.noradCatId} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="font-medium">{satellite.name}</span>
                  <span className="text-gray-500">{satellite.noradCatId}</span>
                </div>
              ))}
              {selectedSatellites.length === 0 && (
                <p className="text-gray-500 text-center py-8">No satellites selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🛰️ Digantara Satellite Tracker</h1>
          <p className="text-gray-600">Search and analyze space objects in our catalog</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or NORAD Cat ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && setSearchQuery(searchTerm)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border-t pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Object Types</h3>
                  <div className="space-y-2">
                    {OBJECT_TYPES.map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.objectTypes.includes(type)}
                          onChange={() => handleFilterChange('objectTypes', type)}
                          className="w-4 h-4 text-blue-600 mr-2"
                        />
                        <span className="text-sm">{type}</span>
                        {counts && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({counts[type as keyof typeof counts] || '0'})
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Orbit Codes</h3>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {ORBIT_CODES.map(code => (
                      <label key={code} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.orbitCodes.includes(code)}
                          onChange={() => handleFilterChange('orbitCodes', code)}
                          className="w-4 h-4 text-blue-600 mr-2"
                        />
                        <span className="text-xs">{code}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Selection Status */}
        {selectedRows.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-blue-600" />
                <span className="text-blue-800">
                  {selectedRows.size} satellite{selectedRows.size !== 1 ? 's' : ''} selected
                  {selectedRows.size >= 10 && <span className="text-red-600 ml-2">(Maximum reached)</span>}
                </span>
              </div>
              <button
                onClick={() => setShowSelected(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Selected
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Satellites ({filteredAndSortedSatellites.length.toLocaleString()})
              </h2>
              {counts && (
                <div className="text-sm text-gray-600">
                  Total in catalog: {parseInt(counts.total).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Table Header */}
          <div className="flex items-center border-b border-gray-200 bg-gray-50">
            <div className="w-12"></div>
            <div className="flex-1 grid grid-cols-6 gap-4 px-4 py-3 text-sm font-medium text-gray-700">
              <button
                onClick={() => handleSort('name')}
                className="text-left hover:text-gray-900 flex items-center gap-1"
              >
                Name
                {sortConfig.key === 'name' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <button
                onClick={() => handleSort('noradCatId')}
                className="text-left hover:text-gray-900 flex items-center gap-1"
              >
                NORAD ID
                {sortConfig.key === 'noradCatId' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <div>Orbit Code</div>
              <div>Object Type</div>
              <button
                onClick={() => handleSort('countryCode')}
                className="text-left hover:text-gray-900 flex items-center gap-1"
              >
                Country
                {sortConfig.key === 'countryCode' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              <button
                onClick={() => handleSort('launchDate')}
                className="text-left hover:text-gray-900 flex items-center gap-1"
              >
                Launch Date
                {sortConfig.key === 'launchDate' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-96">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading satellites...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <span className="ml-2 text-red-600">{error}</span>
              </div>
            ) : filteredAndSortedSatellites.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-500">No satellites found</span>
              </div>
            ) : (
              <List
                height={384}
                itemCount={filteredAndSortedSatellites.length}
                itemSize={50}
                width="100%"
              >
                {Row}
              </List>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteTracker;