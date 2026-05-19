/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-homepage
 * Base block: carousel
 * Source: https://www.mphasis.com/home.html
 * Selector: section.hero-carousel
 * Generated: 2026-05-18
 *
 * Extracts slides from the hero carousel. Each slide has:
 * - Column 1: background image (extracted from inline style or img tag)
 * - Column 2: optional heading (h1), optional description (p), optional CTA links (a)
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll('.carousel-item, [class*="carousel-slide"], [class*="slide"]');
  const cells = [];

  slides.forEach((slide) => {
    // Column 1: Extract background image
    // Images may be in inline style background-image or as img tags
    let imageCell = [];
    const styleAttr = slide.getAttribute('style') || '';
    const bgMatch = styleAttr.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);

    if (bgMatch) {
      // Create an img element from the background-image URL
      const img = document.createElement('img');
      img.src = bgMatch[1];
      img.alt = '';
      imageCell.push(img);
    } else {
      // Fallback: look for an img tag inside the slide
      const imgEl = slide.querySelector('img, picture img, [class*="bg"] img');
      if (imgEl) {
        imageCell.push(imgEl);
      }
    }

    // Column 2: Extract text content (heading, description, CTAs)
    const contentCell = [];

    // Heading (h1, h2, h3 or heading-class element)
    const heading = slide.querySelector('h1, h2, h3, [class*="heading"], [class*="title"]');
    if (heading) {
      contentCell.push(heading);
    }

    // Description paragraph(s)
    const descriptions = slide.querySelectorAll('p, [class*="description"], [class*="subtitle"]');
    descriptions.forEach((desc) => {
      contentCell.push(desc);
    });

    // CTA links
    const ctaLinks = slide.querySelectorAll('a');
    ctaLinks.forEach((link) => {
      contentCell.push(link);
    });

    // Build the row: [image column, content column]
    // Only add the row if there is at least an image or content
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-homepage', cells });
  element.replaceWith(block);
}
