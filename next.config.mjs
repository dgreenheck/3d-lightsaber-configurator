/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NODE_ENV === 'production' ? '/3d-lightsaber-configurator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/3d-lightsaber-configurator' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/3d-lightsaber-configurator' : ''
  }
};

export default nextConfig;