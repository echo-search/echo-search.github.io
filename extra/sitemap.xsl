<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

<xsl:template match="/">
  <html>
    <head>
      <title>Sitemap</title>
      <meta charset="UTF-8">
      <link rel="icon" href="/favicon.ico" type="image/x-icon">
      <style>
        body { font-family: Arial, sans-serif; background: #fafafa; padding: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f4f4f4; text-align: left; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style>
    </head>
    <body>
      <h1>Sitemap</h1>
      <table>
        <tr>
          <th>URL</th>
          <th>Last Modified</th>
          <th>Change Frequency</th>
          <th>Priority</th>
        </tr>
        <xsl:for-each select="s:urlset/s:url">
          <tr>
            <td><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
            <td><xsl:value-of select="s:lastmod"/></td>
            <td><xsl:value-of select="s:changefreq"/></td>
            <td><xsl:value-of select="s:priority"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
