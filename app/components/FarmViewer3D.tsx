"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getFarmSchematic } from "@/lib/farm-schematics";
import {
  farmBlockTextureUrl,
  farmBlockFallbackColor,
  isTransparentFarmBlock,
} from "@/lib/farm-textures";

type Props = { farmId: string };

function loadTexture(
  loader: THREE.TextureLoader,
  blockName: string
): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    loader.load(
      farmBlockTextureUrl(blockName),
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        resolve(tex);
      },
      undefined,
      () => {
        const c = farmBlockFallbackColor(blockName);
        const data = new Uint8Array([
          (c >> 16) & 255,
          (c >> 8) & 255,
          c & 255,
          255,
        ]);
        const tex = new THREE.DataTexture(data, 1, 1);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        tex.needsUpdate = true;
        resolve(tex);
      }
    );
  });
}

export function FarmViewer3D({ farmId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const schematic = getFarmSchematic(farmId);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !schematic) return;

    let disposed = false;
    const width = el.clientWidth;
    const height = 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.sortObjects = true;
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.02;

    scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const sun = new THREE.DirectionalLight(0xffffff, 0.9);
    sun.position.set(10, 16, 8);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xdbeafe, 0.35);
    fill.position.set(-8, 6, -10);
    scene.add(fill);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const group = new THREE.Group();
    scene.add(group);

    const uniqueBlocks = [...new Set(schematic.blocks.map((b) => b.block))];

    Promise.all(
      uniqueBlocks.map(async (name) => [name, await loadTexture(loader, name)] as const)
    ).then((entries) => {
      if (disposed) {
        entries.forEach(([, t]) => t.dispose());
        return;
      }

      const texMap = new Map(entries);

      for (const voxel of schematic.blocks) {
        const tex = texMap.get(voxel.block)!;
        const transparent = isTransparentFarmBlock(voxel.block);

        const mat = new THREE.MeshLambertMaterial({
          map: tex,
          transparent,
          opacity: transparent ? (voxel.block === "유리" ? 0.38 : 0.72) : 1,
          depthWrite: !transparent,
          side: transparent ? THREE.DoubleSide : THREE.FrontSide,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(voxel.x, voxel.y, voxel.z);
        if (transparent) mesh.renderOrder = 2;
        group.add(mesh);
      }

      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      group.position.sub(center);

      const dist = schematic.cameraDistance ?? 14;
      camera.position.set(dist * 0.7, dist * 0.52, dist * 0.78);
      controls.target.set(0, 0.5, 0);
      controls.update();

      const grid = new THREE.GridHelper(24, 24, 0x6b7280, 0x4b5563);
      grid.position.y = box.min.y - center.y - 0.51;
      scene.add(grid);

      setReady(true);
    });

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth;
      if (w < 1) return;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      disposed = true;
      setReady(false);
      cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();
      geo.dispose();
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => {
          const lambert = m as THREE.MeshLambertMaterial;
          lambert.map?.dispose();
          m.dispose();
        });
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [farmId, schematic]);

  if (!schematic) return null;

  return (
    <figure className="my-5 flex flex-col items-center">
      <div
        ref={containerRef}
        className="relative w-full max-w-[640px] h-[360px] rounded-xl border border-zinc-700 shadow-lg overflow-hidden bg-sky-200 dark:bg-sky-950"
        role="img"
        aria-label={schematic.caption}
      >
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500 bg-zinc-900/80">
            3D 모델 로딩…
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-zinc-500 text-center">
        🧊 {schematic.caption} · 드래그 회전 · 스크롤 확대
      </p>
    </figure>
  );
}
