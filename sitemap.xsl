<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
    <head>
      <title>Sitemap</title>
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
        <xsl:for-each select="urlset/url">
          <tr>
            <td><a href="{loc}"><xsl:value-of select="loc"/></a></td>
            <td><xsl:value-of select="lastmod"/></td>
            <td><xsl:value-of select="changefreq"/></td>
            <td><xsl:value-of select="priority"/></td>
          </tr>
        </xsl:for-each>
      </table>
    </body>
  </html>
</xsl:template>

</xsl:stylesheet>
