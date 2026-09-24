import React, { useEffect, useRef } from 'react';
import { Warehouse3DScene } from '../../../engine/algorithm/warehouse3D';
import type { PackageItem, ExecutionFrame } from '../../../types/algorithm';

interface Props {
  packages: PackageItem[];
  activeFrame?: ExecutionFrame | null;
  onPackageSelect?: (pkgId: number) => void;
}

export const Warehouse3DCanvas: React.FC<Props> = ({
  packages,
  activeFrame,
  onPackageSelect,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<Warehouse3DScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new Warehouse3DScene(containerRef.current, onPackageSelect);
    sceneRef.current = scene;
    scene.updatePackages(packages);

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updatePackages(packages);
    }
  }, [packages]);

  useEffect(() => {
    if (sceneRef.current && activeFrame) {
      sceneRef.current.renderExecutionFrame(activeFrame, packages);
    }
  }, [activeFrame, packages]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950"
    />
  );
};
