/* eslint-disable */
/* global WebImporter */

// Generic import script for pages without template-specific parsers
// Imports content as-is with basic cleanup

import mphasisCleanupTransformer from './transformers/mphasis-cleanup.js';

const transformers = [mphasisCleanupTransformer];

function executeTransformers(hookName, element, payload) {
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, payload);
    } catch (e) {
      // skip failed transformers
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute cleanup transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Remove common non-content elements
    const selectorsToRemove = [
      'header', 'footer', 'nav.breadcrumb',
      '.cookie-banner', '#onetrust-consent-sdk',
      '.chatbot', '.chat-widget', '.social-share',
      'script', 'style', 'noscript', 'iframe',
    ];
    selectorsToRemove.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // 3. Execute afterTransform
    executeTransformers('afterTransform', main, payload);

    // 4. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 5. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: 'generic',
      },
    }];
  },
};
