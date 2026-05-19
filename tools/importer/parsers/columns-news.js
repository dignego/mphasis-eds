/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-news
 * Base block: columns
 * Source: https://www.mphasis.com/home.html
 * Selector: .latest-tabs
 * Generated: 2026-05-18
 *
 * Extracts a 3-column layout from .latest-tabs containing:
 * - Column 1 (Press Release): h5 heading + list of PDF links
 * - Column 2 (Latest News): h5 heading + list of date+link items
 * - Column 3 (Events): h5 heading + event details (date, venue, link)
 *
 * Target structure: Columns block with single row, 3 cells (one per column).
 */
export default function parse(element, { document }) {
  // Extract all tab-panel columns
  const panels = element.querySelectorAll(':scope > .tab-panel');

  const cells = [];
  const row = [];

  panels.forEach((panel) => {
    // Build content array for this column
    const columnContent = [];

    // Extract heading (h5 in source)
    const heading = panel.querySelector('h5, h4, h3, h2');
    if (heading) {
      columnContent.push(heading);
    }

    // Extract list items (Press Release and Latest News panels)
    const list = panel.querySelector('ul');
    if (list) {
      columnContent.push(list);
    }

    // Extract event content (Events panel - has div.event instead of ul)
    const eventDiv = panel.querySelector('.event, div.event');
    if (eventDiv) {
      // Get all paragraphs and links from the event div
      const eventChildren = eventDiv.querySelectorAll('p, a');
      eventChildren.forEach((child) => {
        columnContent.push(child);
      });
    }

    row.push(columnContent);
  });

  // Single row with 3 cells (one per column)
  cells.push(row);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-news', cells });
  element.replaceWith(block);
}
