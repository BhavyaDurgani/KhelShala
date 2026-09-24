import React, { useEffect, useRef } from 'react';
import { CyberCity3DScene } from '../../../engine/cyber/cyberCity3D';
import type { Sector, AttackGraph } from '../../../types/cyber';

interface Props {
  sectors: Sector[];
  attackGraph: AttackGraph;
  onSectorSelect?: (sectorId: string) => void;
}

export const CyberCity3DCanvas: React.FC<Props> = ({
  sectors,
  attackGraph,
  onSectorSelect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<CyberCity3DScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize 3D Scene
    const scene = new CyberCity3DScene(containerRef.current, onSectorSelect);
    sceneRef.current = scene;

    scene.updateSectors(sectors);
    scene.updateAttackGraph(attackGraph);
    scene.triggerCinematicCameraIntro();

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateSectors(sectors);
      sceneRef.current.updateAttackGraph(attackGraph);
    }
  }, [sectors, attackGraph]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl"
    />
  );
};
