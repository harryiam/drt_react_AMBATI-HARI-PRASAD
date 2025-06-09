import React from 'react';
import { Satellite } from '../types';
import '../styles.css';

interface SelectedListProps {
  selectedSatellitesData: Satellite[];
  onGoBack: () => void;
}

const SelectedList: React.FC<SelectedListProps> = ({ selectedSatellitesData, onGoBack }) => {
  return (
    <div className="selected-page">
      <h1>Selected Satellites ({selectedSatellitesData.length})</h1>
      <button 
        className="btn btn-secondary" 
        onClick={onGoBack}
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
  );
};

export default SelectedList;