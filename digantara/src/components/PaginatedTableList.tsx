import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { Satellite } from '../types';
import '../styles.css';

interface PaginatedTableListProps {
  items: Satellite[];
  selectedIds: Set<string>;
  onSelectionChange: (id: string, selected: boolean) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
}

const PaginatedTableList: React.FC<PaginatedTableListProps> = ({ 
  items, 
  selectedIds, 
  onSelectionChange, 
  onSort, 
  sortField, 
  sortDirection 
}) => {
  const [displayedItems, setDisplayedItems] = useState<Satellite[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const tableBodyRef = useRef<HTMLDivElement>(null);
  
  const ITEMS_PER_PAGE = 50;
  const LOAD_MORE_THRESHOLD = 35; // Load more when 35 items from the end

  // Reset displayed items when items change (new search/filter)
  useEffect(() => {
    setDisplayedItems(items.slice(0, ITEMS_PER_PAGE));
    setCurrentPage(1);
  }, [items]);

  const loadMoreItems = useCallback(async () => {
    if (isLoadingMore) return;
    
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const endIndex = nextPage * ITEMS_PER_PAGE;
    
    if (startIndex >= items.length) return; // No more items to load
    
    setIsLoadingMore(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItems = items.slice(startIndex, endIndex);
    setDisplayedItems(prev => [...prev, ...newItems]);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
  }, [currentPage, items, isLoadingMore]);

  const handleScroll = useCallback(() => {
    if (!tableBodyRef.current || isLoadingMore) return;
    
    const { scrollTop, scrollHeight, clientHeight } = tableBodyRef.current;
    const scrollPosition = scrollTop + clientHeight;
    const threshold = scrollHeight - (LOAD_MORE_THRESHOLD * 49); // 49px is approximate row height
    
    if (scrollPosition >= threshold) {
      loadMoreItems();
    }
  }, [loadMoreItems, isLoadingMore]);

  useEffect(() => {
    const tableBody = tableBodyRef.current;
    if (tableBody) {
      tableBody.addEventListener('scroll', handleScroll);
      return () => tableBody.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

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
        <thead className="table-header">
          <tr>
            <th className="checkbox-column">
              <input type="checkbox" className="checkbox" disabled />
            </th>
            <th className="sortable name-column" onClick={() => onSort('name')}>
              Name <SortIcon field="name" />
            </th>
            <th className="sortable norad-column" onClick={() => onSort('noradCatId')}>
              NORAD ID <SortIcon field="noradCatId" />
            </th>
            <th className="orbit-column">Orbit Code</th>
            <th className="type-column">Object Type</th>
            <th className="country-column">Country</th>
            <th className="sortable date-column" onClick={() => onSort('launchDate')}>
              Launch Date <SortIcon field="launchDate" />
            </th>
          </tr>
        </thead>
      </table>
      
      <div className="table-body-container" ref={tableBodyRef}>
        <table className="table">
          <tbody>
            {displayedItems.map((item) => (
              <tr key={item.noradCatId} className="table-row">
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedIds.has(item.noradCatId)}
                    onChange={(e) => onSelectionChange(item.noradCatId, e.target.checked)}
                  />
                </td>
                <td className="name-column">
                  <span className="cell-content" title={item.name}>
                    {item.name}
                  </span>
                </td>
                <td className="norad-column">
                  <span className="cell-content">
                    {item.noradCatId}
                  </span>
                </td>
                <td className="orbit-column">
                  <span className="cell-content">
                    {item.orbitCode}
                  </span>
                </td>
                <td className="type-column">
                  <span className={getObjectTypeClass(item.objectType)}>
                    {item.objectType}
                  </span>
                </td>
                <td className="country-column">
                  <span className="cell-content">
                    {item.countryCode}
                  </span>
                </td>
                <td className="date-column">
                  <span className="cell-content">
                    {item.launchDate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {isLoadingMore && (
          <div className="loading-more">
            <Loader className="loading-spinner" size={20} />
            <span>Loading more satellites...</span>
          </div>
        )}
        
        {displayedItems.length >= items.length && items.length > ITEMS_PER_PAGE && (
          <div className="end-message">
            <span>All {items.length} satellites loaded</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaginatedTableList;