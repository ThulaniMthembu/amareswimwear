/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	images: {
		unoptimized: true,
	},
	// Remove basePath and assetPrefix
};

module.exports = nextConfig;
