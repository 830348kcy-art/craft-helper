/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // data/ 폴더의 JSON을 서버 컴포넌트에서 import 가능하게
  webpack(config) {
    return config;
  },
};
module.exports = nextConfig;
