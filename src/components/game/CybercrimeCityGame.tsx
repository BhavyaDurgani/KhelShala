import React from 'react';
import { CyberCityMain } from './cybercrime/CyberCityMain';

export const CybercrimeCityGame: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  return <CyberCityMain onExit={onExit} />;
};
