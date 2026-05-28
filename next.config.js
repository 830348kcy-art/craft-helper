/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  output: "export",           // 완전 정적 빌드
  basePath,                   // GitHub Pages 서브 경로 (/craft-helper)
  assetPrefix: basePath,
  trailingSlash: true,        // GitHub Pages 경로 호환
  reactStrictMode: true,
  images: {
    unoptimized: true,        // 정적 배포 시 Image Optimization 비활성화
  },
  webpack(config) {
    return config;
  },
};

module.exports = nextConfig;
