/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'sandbox.payfast.co.za',
			},
			{
				protocol: 'https',
				hostname: 'www.payfast.co.za',
			},
			{
				protocol: 'https',
				hostname: 'firebasestorage.googleapis.com',
			},
		],
	},
	reactStrictMode: true,
	env: {
		PAYFAST_PASSPHRASE: process.env.PAYFAST_PASSPHRASE,
	},
};

module.exports = nextConfig;
