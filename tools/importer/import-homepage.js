/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHomepageParser from './parsers/carousel-homepage.js';
import cardsApproachParser from './parsers/cards-approach.js';
import cardsOfferingsParser from './parsers/cards-offerings.js';
import cardsArticlesParser from './parsers/cards-articles.js';
import cardsResourcesParser from './parsers/cards-resources.js';
import columnsNewsParser from './parsers/columns-news.js';

// TRANSFORMER IMPORTS
import mphasisCleanupTransformer from './transformers/mphasis-cleanup.js';
import mphasisSectionsTransformer from './transformers/mphasis-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-homepage': carouselHomepageParser,
  'cards-approach': cardsApproachParser,
  'cards-offerings': cardsOfferingsParser,
  'cards-articles': cardsArticlesParser,
  'cards-resources': cardsResourcesParser,
  'columns-news': columnsNewsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  mphasisCleanupTransformer,
  mphasisSectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Main homepage with hero banner, featured content, news highlights, and CTAs',
  urls: [
    'https://www.mphasis.com/home.html',
  ],
  blocks: [
    {
      name: 'carousel-homepage',
      instances: ['section.hero-carousel'],
    },
    {
      name: 'cards-approach',
      instances: ['.approach'],
    },
    {
      name: 'cards-offerings',
      instances: ['.offerings-grid'],
    },
    {
      name: 'cards-articles',
      instances: ['.container.main > .full-width-container:nth-child(4)'],
    },
    {
      name: 'cards-resources',
      instances: ['.column-control:has(.hotspot .tag)'],
    },
    {
      name: 'columns-news',
      instances: ['.latest-tabs'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: 'section.hero-carousel',
      style: null,
      blocks: ['carousel-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Our Approach',
      selector: 'section.our-approach',
      style: null,
      blocks: ['cards-approach'],
      defaultContent: ['section.our-approach > h3', 'section.our-approach > p'],
    },
    {
      id: 'section-3',
      name: 'Our Offerings',
      selector: 'section.our-offerings',
      style: null,
      blocks: ['cards-offerings'],
      defaultContent: ['section.our-offerings > h3'],
    },
    {
      id: 'section-4',
      name: 'Thought Leadership',
      selector: 'section.thought-leadership',
      style: 'dark',
      blocks: ['cards-articles'],
      defaultContent: ['.tl-intro'],
    },
    {
      id: 'section-5',
      name: 'Resources',
      selector: 'section.resources',
      style: null,
      blocks: ['cards-resources'],
      defaultContent: ['section.resources > h3', 'section.resources > a'],
    },
    {
      id: 'section-6',
      name: 'Latest at Mphasis',
      selector: 'section.latest-at-mphasis',
      style: 'dark',
      blocks: ['columns-news'],
      defaultContent: ['section.latest-at-mphasis > h3'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
