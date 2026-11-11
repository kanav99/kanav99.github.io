<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:media="http://search.yahoo.com/mrss/"
  exclude-result-prefixes="atom media">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/atom:feed">
    <html lang="{ @xml:lang }">
      <head>
        <title><xsl:value-of select="atom:title"/> · Feed</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          :root {
            color-scheme: light dark;
            --background: #fff;
            --text: #333;
            --muted: #666;
            --link: #082840;
            --border: #e0e0e0;
            --panel: #f6f8fa;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --background: #15202b;
              --text: #dad8d8;
              --muted: #a9b5c1;
              --link: #1493fb;
              --border: #354452;
              --panel: #1b2936;
            }
          }
          * { box-sizing: border-box; }
          body {
            max-width: 50rem;
            margin: 0 auto;
            padding: 2rem 1rem;
            background: var(--background);
            color: var(--text);
            font: 1rem/1.6 -apple-system, system-ui, sans-serif;
            overflow-wrap: anywhere;
          }
          a { color: var(--link); text-underline-offset: .2em; }
          a:hover { text-decoration-thickness: 2px; }
          a:focus-visible { outline: 2px solid var(--link); outline-offset: 4px; }
          header { padding-bottom: 1.5rem; border-bottom: 1px dashed var(--border); }
          .post-image { display: block; width: 100%; max-height: 20rem; object-fit: cover; margin-bottom: 1rem; border-radius: .5rem; }
          h1 { margin: .75rem 0 0; font-size: clamp(1.75rem, 5vw, 2.25rem); line-height: 1.2; }
          h2 { font-size: 1.25rem; }
          h3 { margin: 0 0 .25rem; font-size: 1.2rem; line-height: 1.4; }
          p { margin: .75rem 0 0; }
          .label, time { color: var(--muted); font-size: .875rem; }
          .label { margin: 0; letter-spacing: .08em; text-transform: uppercase; }
          .subscribe { margin: 2rem 0; padding: 1.25rem; border: 1px solid var(--border); border-radius: .5rem; background: var(--panel); }
          .subscribe h2 { margin: 0; }
          .feed-url { display: block; margin-top: .75rem; font-family: ui-monospace, monospace; font-size: .875rem; }
          ol { margin: 0; padding: 0; list-style: none; }
          li { padding: 1.25rem 0; border-bottom: 1px solid var(--border); }
        </style>
      </head>
      <body>
        <header>
          <p class="label">Web feed</p>
          <h1><xsl:value-of select="atom:title"/></h1>
          <p><xsl:value-of select="atom:subtitle"/></p>
          <p><a href="{atom:link[not(@rel) or @rel='alternate'][1]/@href}">Visit website &#x2192;</a></p>
        </header>
        <main>
          <section class="subscribe" aria-labelledby="subscribe-heading">
            <h2 id="subscribe-heading">Subscribe to new posts</h2>
            <p>Copy this feed URL into your newsreader to receive new posts with their full content.</p>
            <a class="feed-url" href="{atom:link[@rel='self']/@href}"><xsl:value-of select="atom:link[@rel='self']/@href"/></a>
            <p>New to RSS and Atom? <a href="https://aboutfeeds.com">Learn how feeds work.</a></p>
          </section>
          <section aria-labelledby="posts-heading">
            <h2 id="posts-heading">Recent posts</h2>
            <ol><xsl:apply-templates select="atom:entry"/></ol>
          </section>
        </main>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="atom:entry">
    <li>
      <article>
        <xsl:if test="media:thumbnail">
          <img class="post-image" src="{media:thumbnail/@url}" alt="" loading="lazy"/>
        </xsl:if>
        <h3><a href="{atom:link[not(@rel) or @rel='alternate'][1]/@href}"><xsl:value-of select="atom:title"/></a></h3>
        <time datetime="{atom:updated}"><xsl:value-of select="substring(atom:updated, 1, 10)"/></time>
      </article>
    </li>
  </xsl:template>
</xsl:stylesheet>
