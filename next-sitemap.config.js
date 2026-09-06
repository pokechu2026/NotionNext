const BLOG = require('./blog.config')

/**
 * 通常没啥用，sitemap交给 /pages/sitemap.xml.js 动态生成
 */
module.exports = {
  siteUrl: BLOG.LINK,
  changefreq: 'daily',
  priority: 0.7,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    // /p/ 為對外提案等私下分享的靜態頁，不進索引
    policies: [{ userAgent: '*', allow: '/', disallow: ['/p/'] }]
  },
  sitemapSize: 7000
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
