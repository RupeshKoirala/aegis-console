/**
 * Analyst notes on indicators support a tiny markdown: **bold**, `code` and [text](url). Notes are written by users
 * (and imported from partner feeds!), so they are UNTRUSTED. An attacker who gets `<img src=x onerror=...>` to run in
 * the console reads every token in the page: a total compromise of a security product.
 */

/** TODO 1: escape the five HTML-special characters: & < > " '  →  &amp; &lt; &gt; &quot; &#39;   (& FIRST!) */
export function escapeHtml(text: string): string {
  return text;
}

/**
 * TODO 2: only allow http:, https: and mailto: links. Anything else (javascript:, data:, vbscript:, relative tricks)
 * → null. Parse with new URL(url) (it throws on garbage → null) and check .protocol.
 */
export function safeUrl(url: string): string | null {
  return url;
}

/**
 * TODO 3: render the mini-markdown to HTML. ORDER MATTERS: escape the whole text FIRST, then add our own tags:
 *   **x** → <strong>x</strong>      `x` → <code>x</code>
 *   [text](url) → <a href="URL" rel="noopener noreferrer" target="_blank">text</a>   if safeUrl(url) accepts it
 *                 otherwise just the text (no link)
 * (After escaping, the url inside (…) may contain &amp; for &: unescape &amp; back to & before safeUrl.)
 */
export function renderNote(markdown: string): string {
  return markdown.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
