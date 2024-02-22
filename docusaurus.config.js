// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Skip Protocol Docs',
  tagline: 'Documentation for skip protocol!',
  url: 'https://skip-protocol-docs.netlify.app',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'skip-mev', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
	docs: {
	  routeBasePath: '/',
	  sidebarPath: require.resolve('./sidebars.js'),
	  // Please change this to your repo.
	  // Remove this to remove the "edit this page" links.
	  editUrl:
	  'https://github.com/skip-mev/docs/tree/main',
	},
	blog: false,
	theme: {
	  customCss: require.resolve('./src/css/custom.css'),
	},
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  ({
	image: 'img/skip-og-image.jpg', // used for og:image, e.g., for social media previews 
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'Skip Protocol',
      logo: {
	alt: 'Skip Protocl Logo',
	src: 'img/logo.svg',
      },
      items: [
	{
	  href: 'https://skip.money',
	  label: 'Skip Site',
	  position: 'right',
	},
      ],
    },
    footer: {
      style: 'dark',
      links: [
	{
	  title: 'Docs',
	  items: [
		{
			label: 'About',
			to: '/'
		  },
	    {
	      	label: 'Slinky',
	      	to: '/slinky/overview'
	    },
		{
			label: 'Block SDK',
			to: '/blocksdk/overview'
		  },
	  ],
	},
	{
	  title: 'Community',
	  items: [
	    {
	      label: 'Discord',
	      href: 'https://skip.money/discord',
	    },
	  ],
	},
	{
	  title: 'More',
	  items: [
	    {
	      label: 'GitHub',
	      href: 'https://github.com/skip-mev',
	    },
	    {
	      label: 'Twitter',
	      href: 'https://twitter.com/skipprotocol',
	    },
	  ],
	},
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Skip Protocol`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      // add additional languages for syntax highlighting here
      additionalLanguages: ['toml']
    },
  }),
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
	hashed: true,
	docsRouteBasePath: '/', // needs to match routeBasePath of docs
      }),
    ],
  ],
};

module.exports = config;
