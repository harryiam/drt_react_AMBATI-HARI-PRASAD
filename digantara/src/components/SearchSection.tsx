import React from 'react';
import '../styles.css';

interface SearchSectionProps {
  searchName: string;
  setSearchName: (value: string) => void;
  searchNoradId: string;
  setSearchNoradId: (value: string) => void;
  onSearch: (e: React.KeyboardEvent) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchName,
  setSearchName,
  searchNoradId,
  setSearchNoradId,
  onSearch
}) => {
  return (
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
            onKeyPress={onSearch}
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
            onKeyPress={onSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchSection;