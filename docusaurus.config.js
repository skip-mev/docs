// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Skip Docs',
  tagline: 'Dinosaurs are cool',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
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
      navbar: {
        title: 'My Site',
        logo: {
          alt: 'My Site Logo',
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
				  label: 'Validator',
				  to: '/validator'
			  },
			  {
				  label: 'Searcher',
				  to: '/searcher'
			  },
			  {
				  label: 'Chain Configuration',
				  to: '/chain-configuration'
			  }
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://www.notion.so/d0360204395040ccbc260dd2d1e35104',
              },
              {
                label: 'Chat Telegram',
                href: 'https://t.me/+nwk3BENlQbsxMGNh',
              },
              {
                label: 'Announcements Telegram',
                href: 'https://t.me/+cOqB4ALhPdMwZDMx',
              },
              {
                label: 'Juno Telegram',
                href: 'https://t.me/+3MR5EP3Vc2gxNTFh',
              },
              {
                label: 'Evmos Telegram',
                href: 'https://t.me/+55HtDJdMH-VkYjMx',
              }
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
        copyright: `Copyright © ${new Date().getFullYear()} Skip Protocol. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
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
