/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
			},
		],
	},
	reactStrictMode: true,
	swcMinify: true, // Enable SWC minification for improved performance
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production', // Remove console.log in production
	},
};

module.exports = nextConfig;
