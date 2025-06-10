// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import { Satellite } from '../types';
// import '../styles.css';

// interface VirtualListProps {
//   items: Satellite[];
//   selectedIds: Set<string>;
//   onSelectionChange: (id: string, selected: boolean) => void;
//   onSort: (field: string) => void;
//   sortField: string;
//   sortDirection: 'asc' | 'desc';
// }

// const VirtualList: React.FC<VirtualListProps> = ({ items, selectedIds, onSelectionChange, onSort, sortField, sortDirection }) => {
//   const [startIndex, setStartIndex] = useState(0);
//   const itemHeight = 49;
//   const containerHeight = 600;
//   const visibleCount = Math.ceil(containerHeight / itemHeight);
//   const endIndex = Math.min(startIndex + visibleCount + 5, items.length);

//   const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
//     const scrollTop = e.currentTarget.scrollTop;
//     const newStartIndex = Math.floor(scrollTop / itemHeight);
//     setStartIndex(Math.max(0, newStartIndex - 2));
//   };

//   const getObjectTypeClass = (type: string) => {
//     switch (type) {
//       case 'PAYLOAD': return 'object-type object-type-payload';
//       case 'ROCKET BODY': return 'object-type object-type-rocket';
//       case 'DEBRIS': return 'object-type object-type-debris';
//       default: return 'object-type object-type-unknown';
//     }
//   };

//   const SortIcon = ({ field }: { field: string }) => {
//     if (sortField !== field) return null;
//     return sortDirection === 'asc' ? <ChevronUp className="sort-icon" /> : <ChevronDown className="sort-icon" />;
//   };

//   return (
//     <div className="table-container">
//       <table className="table">
//         <thead>
//           <tr>
//             <th style={{ width: '50px' }}>
//               <input type="checkbox" className="checkbox" disabled />
//             </th>
//             <th className="sortable" onClick={() => onSort('name')}>
//               Name <SortIcon field="name" />
//             </th>
//             <th className="sortable" onClick={() => onSort('noradCatId')}>
//               NORAD ID <SortIcon field="noradCatId" />
//             </th>
//             <th>Orbit Code</th>
//             <th>Object Type</th>
//             <th>Country</th>
//             <th className="sortable" onClick={() => onSort('launchDate')}>
//               Launch Date <SortIcon field="launchDate" />
//             </th>
//           </tr>
//         </thead>
//       </table>
//       <div 
//         className="virtual-list" 
//         onScroll={handleScroll}
//         style={{ height: containerHeight }}
//       >
//         <div style={{ height: items.length * itemHeight, position: 'relative' }}>
//           {items.slice(startIndex, endIndex).map((item, index) => (
//             <div
//               key={item.noradCatId}
//               className="virtual-row"
//               style={{
//                 position: 'absolute',
//                 top: (startIndex + index) * itemHeight,
//                 left: 0,
//                 right: 0,
//                 height: itemHeight,
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               <div className="virtual-cell" style={{ width: '50px', textAlign: 'center' }}>
//                 <input
//                   type="checkbox"
//                   className="checkbox"
//                   checked={selectedIds.has(item.noradCatId)}
//                   onChange={(e) => onSelectionChange(item.noradCatId, e.target.checked)}
//                 />
//               </div>
//               <div className="virtual-cell" style={{ flex: '1.5', fontWeight: '500' }}>
//                 {item.name}
//               </div>
//               <div className="virtual-cell">
//                 {item.noradCatId}
//               </div>
//               <div className="virtual-cell">
//                 {item.orbitCode}
//               </div>
//               <div className="virtual-cell">
//                 <span className={getObjectTypeClass(item.objectType)}>
//                   {item.objectType}
//                 </span>
//               </div>
//               <div className="virtual-cell">
//                 {item.countryCode}
//               </div>
//               <div className="virtual-cell">
//                 {item.launchDate}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VirtualList;

import React, { useState, useEffect, useRef } from 'react';
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

const VirtualList: React.FC<VirtualListProps> = ({ 
  items, 
  selectedIds, 
  onSelectionChange, 
  onSort, 
  sortField, 
  sortDirection 
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const itemHeight = 49;
  const containerHeight = 600;
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const bufferSize = 5;
  
  // Calculate visible range with buffer
  const endIndex = Math.min(startIndex + visibleCount + bufferSize, items.length);
  const visibleStartIndex = Math.max(0, startIndex - bufferSize);
  const visibleItems = items.slice(visibleStartIndex, endIndex);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(Math.max(0, newStartIndex));
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

  // Define column widths to ensure alignment
  const columnWidths = {
    checkbox: '60px',
    name: '300px',
    noradId: '120px',
    orbitCode: '120px',
    objectType: '140px',
    country: '100px',
    launchDate: '120px'
  };

  return (
    <div className="virtual-table-container">
      {/* Fixed Header */}
      <div className="virtual-table-header">
        <div className="virtual-header-row">
          <div className="virtual-header-cell" style={{ width: columnWidths.checkbox }}>
            <input type="checkbox" className="checkbox" disabled />
          </div>
          <div 
            className="virtual-header-cell sortable" 
            style={{ width: columnWidths.name }}
            onClick={() => onSort('name')}
          >
            Name <SortIcon field="name" />
          </div>
          <div 
            className="virtual-header-cell sortable" 
            style={{ width: columnWidths.noradId }}
            onClick={() => onSort('noradCatId')}
          >
            NORAD ID <SortIcon field="noradCatId" />
          </div>
          <div className="virtual-header-cell" style={{ width: columnWidths.orbitCode }}>
            Orbit Code
          </div>
          <div className="virtual-header-cell" style={{ width: columnWidths.objectType }}>
            Object Type
          </div>
          <div className="virtual-header-cell" style={{ width: columnWidths.country }}>
            Country
          </div>
          <div 
            className="virtual-header-cell sortable" 
            style={{ width: columnWidths.launchDate }}
            onClick={() => onSort('launchDate')}
          >
            Launch Date <SortIcon field="launchDate" />
          </div>
        </div>
      </div>

      {/* Virtual Scrollable Content */}
      <div 
        className="virtual-scrollable-container" 
        onScroll={handleScroll}
        ref={scrollContainerRef}
        style={{ height: containerHeight }}
      >
        {/* Total height div to maintain scroll behavior */}
        <div style={{ height: items.length * itemHeight, position: 'relative' }}>
          {/* Render only visible items */}
          {visibleItems.map((item, index) => {
            const actualIndex = visibleStartIndex + index;
            return (
              <div
                key={item.noradCatId}
                className="virtual-data-row"
                style={{
                  position: 'absolute',
                  top: actualIndex * itemHeight,
                  left: 0,
                  right: 0,
                  height: itemHeight,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <div className="virtual-data-cell" style={{ width: columnWidths.checkbox }}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedIds.has(item.noradCatId)}
                    onChange={(e) => onSelectionChange(item.noradCatId, e.target.checked)}
                  />
                </div>
                <div className="virtual-data-cell" style={{ width: columnWidths.name }}>
                  <span className="cell-content" title={item.name}>
                    {item.name}
                  </span>
                </div>
                <div className="virtual-data-cell" style={{ width: columnWidths.noradId }}>
                  <span className="cell-content">
                    {item.noradCatId}
                  </span>
                </div>
                <div className="virtual-data-cell" style={{ width: columnWidths.orbitCode }}>
                  <span className="cell-content">
                    {item.orbitCode}
                  </span>
                </div>
                <div className="virtual-data-cell" style={{ width: columnWidths.objectType }}>
                  <span className={getObjectTypeClass(item.objectType)}>
                    {item.objectType}
                  </span>
                </div>
                <div className="virtual-data-cell" style={{ width: columnWidths.country }}>
                  <span className="cell-content">
                    {item.countryCode}
                  </span>
                </div>
                <div className="virtual-data-cell" style={{ width: columnWidths.launchDate }}>
                  <span className="cell-content">
                    {item.launchDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;