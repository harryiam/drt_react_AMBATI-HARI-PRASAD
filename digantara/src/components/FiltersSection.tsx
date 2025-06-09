import React from 'react';
import { Filter } from 'lucide-react';
import { OBJECT_TYPES, ORBIT_CODES, FilterCounts } from '../types';
import '../styles.css';

interface FiltersSectionProps {
  selectedObjectTypes: Set<string>;
  setSelectedObjectTypes: (set: Set<string>) => void;
  selectedOrbitCodes: Set<string>;
  setSelectedOrbitCodes: (set: Set<string>) => void;
  filterCounts: FilterCounts;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  selectedObjectTypes,
  setSelectedObjectTypes,
  selectedOrbitCodes,
  setSelectedOrbitCodes,
  filterCounts,
  onApplyFilters,
  onResetFilters
}) => {
  return (
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
        <button className="btn btn-secondary" onClick={onResetFilters}>
          Reset Filters
        </button>
        <button className="btn btn-primary" onClick={onApplyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FiltersSection;