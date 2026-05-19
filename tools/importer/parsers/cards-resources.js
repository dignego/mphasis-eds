/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-resources variant.
 * Base block: cards
 * Source selector: .column-control:has(.hotspot .tag)
 * Source: https://www.mphasis.com/home.html
 * Generated: 2026-05-18
 *
 * Extracts resource cards (no images) with category label, title heading, and download link.
 * Each .hotspot with a .tag becomes one row with a single cell containing category, heading, and CTA.
 *
 * Live DOM structure:
 *   .column-control > ... > .row > .col-* > .hotspot > .hotspot-box.hotspot-small-box
 *     .tag (category label, e.g. "Brochure")
 *     .tag-footer > h3 (resource title)
 *     .tag-footer > a (CTA link, e.g. "KNOW MORE" to PDF)
 */
export default function parse(element, { document }) {
  // Find all hotspot cards within the column-control container
  // Live page uses .hotspot > .hotspot-box with .tag for category
  // Source HTML fallback uses .resource-card with span.category
  const hotspots = element.querySelectorAll('.hotspot');
  const resourceCards = element.querySelectorAll('.resource-card');

  const cells = [];

  if (hotspots.length > 0) {
    // Live page structure
    hotspots.forEach((hotspot) => {
      const box = hotspot.querySelector('.hotspot-box, .hotspot-small-box');
      if (!box) return;

      // Extract category label from .tag div
      const tag = box.querySelector('.tag');

      // Extract heading - could be in .tag-footer or directly in box
      const heading = box.querySelector('h3, h2, h4');

      // Extract CTA link
      const link = box.querySelector('a');

      const cellContent = [];

      if (tag) {
        const categoryEl = document.createElement('p');
        categoryEl.textContent = tag.textContent.trim();
        cellContent.push(categoryEl);
      }

      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        cellContent.push(h3);
      }

      if (link) {
        const a = document.createElement('a');
        a.href = link.href || link.getAttribute('href') || '';
        a.textContent = link.textContent.trim() || 'KNOW MORE';
        cellContent.push(a);
      }

      if (cellContent.length > 0) {
        cells.push(cellContent);
      }
    });
  } else if (resourceCards.length > 0) {
    // Fallback: source.html structure with .resource-card
    resourceCards.forEach((card) => {
      const category = card.querySelector('span.category, .category');
      const heading = card.querySelector('h3, h2, h4');
      const link = card.querySelector('a');

      const cellContent = [];

      if (category) {
        const categoryEl = document.createElement('p');
        categoryEl.textContent = category.textContent.trim();
        cellContent.push(categoryEl);
      }

      if (heading) {
        cellContent.push(heading);
      }

      if (link) {
        cellContent.push(link);
      }

      if (cellContent.length > 0) {
        cells.push(cellContent);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resources', cells });
  element.replaceWith(block);
}
