/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-articles variant.
 * Base block: cards
 * Source: https://www.mphasis.com/home.html
 * Selector: .container.main > .full-width-container:nth-child(4)
 * Validated via Playwright - all 4 articles extracted correctly
 * Generated: 2026-05-18
 *
 * Extracts thought leadership article cards from .hotspot-box elements.
 * Each article has a heading (h3), excerpt paragraph (italic text), and CTA link.
 * Target: One row per article, single cell with heading + excerpt + link.
 */
export default function parse(element, { document }) {
  // Find all hotspot-box article containers within the element
  const articles = element.querySelectorAll('.hotspot-box');
  const cells = [];

  articles.forEach((article) => {
    // Get the tag-footer which contains the article content
    const tagFooter = article.querySelector('.tag-footer');
    if (!tagFooter) return;

    // Extract heading (first h3 within tag-footer)
    const heading = tagFooter.querySelector('h3');

    // Extract excerpt - the paragraph containing italic text (the meaningful content)
    const paragraphs = tagFooter.querySelectorAll('p');
    let excerpt = null;
    for (const p of paragraphs) {
      // Find the paragraph with actual text content (not empty, not just "Know More")
      const text = p.textContent.trim();
      if (text && text !== 'Know More' && text.length > 20) {
        excerpt = p;
        break;
      }
    }

    // Extract CTA link (the actual anchor element)
    const link = tagFooter.querySelector('a[href]');

    // Build cell content - heading + excerpt + link in a single cell
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (excerpt) cellContent.push(excerpt);
    if (link) cellContent.push(link);

    // Each article is one row with a single cell
    if (cellContent.length > 0) {
      cells.push(cellContent);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-articles', cells });
  element.replaceWith(block);
}
