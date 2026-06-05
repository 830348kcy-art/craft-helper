"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { getFarmSchematic } from "@/lib/farm-schematics";
import { farmBlockTextureUrl, isTransparentFarmBlock } from "@/lib/farm-textures";

type Props = { farmId: string };

export function FarmViewer3D({ farmId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const schematic = getFarmSchematic(farmId);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !schematic) return;

    const width = el.clientWidth;
    const height = 360;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18181b);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2.05;

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const dir = new THREE.DirectionalLight(0xffffff, 0.85);
    dir.position.set(8, 14, 10);
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0x93c5fd, 0.25);
    fill.position.set(-6, 4, -8);
    scene.add(fill);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");

    const textureCache = new Map<string, THREE.Texture>();
    const getTexture = (blockName: string) => {
      let tex = textureCache.get(blockName);
      if (!tex) {
        tex = loader.load(farmBlockTextureUrl(blockName));
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        textureCache.set(blockName, tex);
      }
      return tex;
    };

    const group = new THREE.Group();
    const geo = new THREE.BoxGeometry(1, 1, 1);

    for (const v of schematic.blocks) {
      const transparent = isTransparentFarmBlock(v.block);
      const mat = new THREE.MeshLambertMaterial({
        map: getTexture(v.block),
        transparent,
        opacity: transparent ? 0.72 : 1,
        depthWrite: !transparent,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(v.x, v.y, v.z);
      group.add(mesh);
    }

    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());
    group.position.sub(center);
    scene.add(group);

    const dist = schematic.cameraDistance ?? 14;
    camera.position.set(dist * 0.75, dist * 0.55, dist * 0.85);
    controls.target.set(0, 0, 0);
    controls.update();

    const grid = new THREE.GridHelper(20, 20, 0x3f3f46, 0x27272a);
    grid.position.y = box.min.y - center.y - 0.51;
    scene.add(grid);

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
      cancelAnimationFrame(frameId);
      ro.disconnect();
      controls.dispose();
      geo.dispose();
      textureCache.forEach((t) => t.dispose());
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((m) => m.dispose());
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
        className="w-full max-w-[640px] h-[360px] rounded-xl border border-zinc-700 shadow-lg overflow-hidden bg-zinc-900"
        role="img"
        aria-label={schematic.caption}
      />
      <p className="mt-2 text-xs text-zinc-500 text-center">
        🧊 {schematic.caption} · 드래그로 회전 · 스크롤로 확대
      </p>
    </figure>
  );
}
