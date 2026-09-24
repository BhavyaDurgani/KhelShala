import React from 'react';
import type { Game } from '../../types';
import { CybercrimeCityGame } from './CybercrimeCityGame';
import { AlgorithmCityGame } from './AlgorithmCityGame';
import { RoboticsKinematicsGame } from './robotics/RoboticsKinematicsGame';
import { AINeuralPipelineGame } from './ai/AINeuralPipelineGame';
import { CloudDevOpsGame } from './cloud/CloudDevOpsGame';

interface GameLauncherProps {
  game: Game;
  onExit?: () => void;
}

export const GameLauncher: React.FC<GameLauncherProps> = ({ game, onExit }) => {
  // 1. Cybersecurity: Cybercrime City
  if (game.slug === 'cybercrime-city' || game.id === 'game_cybercrime_city') {
    return <CybercrimeCityGame onExit={onExit} />;
  }

  // 2. Software Engineering & DSA: Algorithm City
  if (game.slug === 'algorithm-city' || game.id === 'game_algorithm_city') {
    return <AlgorithmCityGame onExit={onExit} />;
  }

  // 3. Robotics & Embedded: Robotics Kinematics
  if (game.slug === 'robotics-kinematics' || game.id === 'game_robotics_vector') {
    return <RoboticsKinematicsGame onExit={onExit} />;
  }

  // 4. AI & Data Engineering: Neural Net & Data Pipeline Lab
  if (game.slug === 'ai-neural-pipeline' || game.id === 'game_ai_pipeline') {
    return <AINeuralPipelineGame onExit={onExit} />;
  }

  // 5. Cloud & DevOps: CloudReliability Microservices Grid
  if (game.slug === 'cloud-reliability-grid' || game.id === 'game_cloud_devops') {
    return <CloudDevOpsGame onExit={onExit} />;
  }

  // Fallback default
  return <CybercrimeCityGame onExit={onExit} />;
};
