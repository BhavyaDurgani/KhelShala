import React from 'react';
import { AlgorithmCityMain } from './algorithm/AlgorithmCityMain';

export const AlgorithmCityGame: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  return <AlgorithmCityMain onExit={onExit} />;
};
