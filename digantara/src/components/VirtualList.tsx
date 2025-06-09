import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Satellite } from '../types';
import '../styles.css';

interface VirtualListProps {
  items: Satellite[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string, selected: boolean) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

const VirtualList: React.FC<VirtualListProps> = ({ items, selectedIds, onSelectionChange, onSort, sortField, sortDirection }) => {
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
              <div className="virtual-cell">
                {item.noradCatId}
              </div>
              <div className="virtual-cell">
                {item.orbitCode}
              </div>
              <div className="virtual-cell">
                <span className={getObjectTypeClass(item.objectType)}>
                  {item.objectType}
                </span>
              </div>
              <div className="virtual-cell">
                {item.countryCode}
              </div>
              <div className="virtual-cell">
                {item.launchDate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;