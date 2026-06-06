"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getFarmSchematic } from "@/lib/farm-schematics";
import {
  CHEST_FRONT_MARKER,
  getBlockFaceUrls,
  isTransparentBlock,
} from "@/lib/farm-block-faces";

type Props = { farmId: string };

function createChestFrontTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#8b6914";
  ctx.fillRect(0, 0, 16, 16);
  ctx.fillStyle = "#6b4f10";
  ctx.fillRect(0, 0, 16, 1);
  ctx.fillRect(0, 15, 16, 1);
  ctx.fillRect(0, 0, 1, 16);
  ctx.fillRect(15, 0, 1, 16);
  ctx.fillStyle = "#c6c6c6";
  ctx.fillRect(7, 6, 2, 4);
  ctx.fillStyle = "#4a4a4a";
  ctx.fillRect(7, 7, 2, 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

function loadTexture(
  loader: THREE.TextureLoader,
  url: string,
  fallbackColor: number
): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    loader.load(
      url,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        resolve(tex);
      },
      undefined,
      () => {
        const c = fallbackColor;
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

function makeMaterial(
  tex: THREE.Texture,
  blockName: string
): THREE.MeshLambertMaterial {
  const transparent = isTransparentBlock(blockName);
  return new THREE.MeshLambertMaterial({
    map: tex,
    transparent,
    opacity: transparent ? (blockName === "유리" ? 0.42 : 0.75) : 1,
    depthWrite: !transparent,
    side: transparent ? THREE.DoubleSide : THREE.FrontSide,
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
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.sortObjects = true;
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.02;

    scene.add(new THREE.AmbientLight(0xffffff, 0.68));
    const sun = new THREE.DirectionalLight(0xffffff, 0.92);
    sun.position.set(10, 16, 8);
    scene.add(sun);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const group = new THREE.Group();
    scene.add(group);

    const urlSet = new Set<string>();
    for (const voxel of schematic.blocks) {
      for (const u of getBlockFaceUrls(voxel.block, voxel.facing)) {
        urlSet.add(u);
      }
    }

    Promise.all(
      [...urlSet].map(async (u) => {
        if (u === CHEST_FRONT_MARKER) {
          return [u, createChestFrontTexture()] as const;
        }
        return [u, await loadTexture(loader, u, 0x888888)] as const;
      })
    ).then((entries) => {
      if (disposed) {
        entries.forEach(([, t]) => t.dispose());
        return;
      }

      const texCache = new Map(entries);

      for (const voxel of schematic.blocks) {
        const faceUrls = getBlockFaceUrls(voxel.block, voxel.facing);
        const materials = faceUrls.map((u) =>
          makeMaterial(texCache.get(u)!, voxel.block)
        );
        const mesh = new THREE.Mesh(geo, materials);
        mesh.position.set(voxel.x, voxel.y, voxel.z);
        if (isTransparentBlock(voxel.block)) mesh.renderOrder = 2;
        group.add(mesh);
      }

      const box = new THREE.Box3().setFromObject(group);
      const center = box.getCenter(new THREE.Vector3());
      group.position.sub(center);

      const dist = schematic.cameraDistance ?? 14;
      camera.position.set(dist * 0.72, dist * 0.5, dist * 0.8);
      controls.target.set(0, 0.4, 0);
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
