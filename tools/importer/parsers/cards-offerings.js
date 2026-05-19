/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-offerings
 * Base block: cards
 * Source: https://www.mphasis.com/home.html
 * Selector: .offerings-grid
 * Generated: 2026-05-18
 *
 * Source structure: .offerings-grid contains <a> elements, each with:
 *   - <img> (icon/image)
 *   - <span> (service name text)
 * Target: Cards block with 2 columns per row (image | linked text)
 */
export default function parse(element, { document }) {
  // Extract all offering links from the grid
  const offeringLinks = element.querySelectorAll('a[href]');

  const cells = [];

  offeringLinks.forEach((link) => {
    // Column 1: icon image
    const img = link.querySelector('img');

    // Column 2: linked text (preserve the link with the service name)
    const span = link.querySelector('span');
    const linkText = span ? span.textContent.trim() : link.textContent.trim();

    // Only create a row if we have meaningful content
    if (!linkText && !img) return;

    const anchor = document.createElement('a');
    anchor.setAttribute('href', link.getAttribute('href'));
    anchor.textContent = linkText;

    // Build the row: [image cell, text cell]
    const imageCell = img ? img.cloneNode(true) : '';
    const textCell = anchor;

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-offerings', cells });
  element.replaceWith(block);
}
