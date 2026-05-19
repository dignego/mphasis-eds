/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mphasis section breaks and section metadata.
 * Adds <hr> between sections and Section Metadata blocks for styled sections.
 * Selectors validated against migration-work/cleaned.html.
 *
 * Sections from page-templates.json (homepage template):
 *   1. section.hero-carousel (no style)
 *   2. section.our-approach (no style)
 *   3. section.our-offerings (no style)
 *   4. section.thought-leadership (style: "dark")
 *   5. section.resources (no style)
 *   6. section.latest-at-mphasis (style: "dark")
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

    // Process sections in reverse order to avoid position shifts
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section element if it has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: [['style', section.style]],
        });
        sectionEl.after(metaBlock);
      }

      // Add <hr> before each section that is not the first
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
