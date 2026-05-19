/* eslint-disable */
/* global WebImporter */
// Validated manually against live DOM via Playwright evaluate

/**
 * Parser for cards-approach variant.
 * Base block: cards
 * Source: https://www.mphasis.com/home.html
 * Selector: .approach
 * Generated: 2026-05-18
 *
 * Live DOM structure per .approach card:
 *   - <p><b>Title Text</b></p> (title with bold)
 *   - <div><hr></div> (separator - skip)
 *   - <p>Description text</p> (description paragraph)
 *   - <p><a><img>KNOW MORE</a></p> (CTA link in paragraph)
 *
 * Target structure: Single row with one cell containing title + description + link.
 * The validator calls this parser once per .approach element found.
 */
export default function parse(element, { document }) {
  const paragraphs = element.querySelectorAll(':scope > p');
  const cells = [];
  const cellContent = [];

  // First <p> contains the title (usually wrapped in <b>)
  if (paragraphs.length > 0) {
    cellContent.push(paragraphs[0]);
  }

  // Find the description paragraph (skip title, find non-link paragraph)
  for (let i = 1; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    // Skip paragraphs that only contain a link (CTA paragraph)
    if (p.querySelector('a') && p.textContent.trim().replace(/KNOW MORE/i, '').replace(/read more/i, '').trim().length === 0) {
      continue;
    }
    // This is the description paragraph
    if (p.textContent.trim().length > 0) {
      cellContent.push(p);
      break;
    }
  }

  // Find the CTA link
  const link = element.querySelector('a[href]');
  if (link) {
    // Create a clean link element without the image icon
    const cleanLink = document.createElement('a');
    cleanLink.href = link.href;
    cleanLink.textContent = link.textContent.trim() || 'KNOW MORE';
    cellContent.push(cleanLink);
  }

  if (cellContent.length > 0) {
    cells.push(cellContent);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-approach', cells });
  element.replaceWith(block);
}
