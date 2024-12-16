/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: '/3d-lightsaber-configurator/',
  basePath: "/3d-lightsaber-configurator",
  env: {
    NEXT_PUBLIC_BASE_PATH: '/3d-lightsaber-configurator'
  }
};

export default nextConfig;
