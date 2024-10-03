/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.SITE_URL || 'https://amareswimwear.com',
	generateRobotsTxt: true,
	exclude: ['/admin/*', '/checkout/*'],
	robotsTxtOptions: {
		additionalSitemaps: [
			'https://amareswimwear.com/server-sitemap.xml', // if you have a server-side generated sitemap
		],
	},
};
