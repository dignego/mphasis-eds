/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Mphasis site-wide cleanup.
 * Removes non-authorable content (header, footer, cookie/tracking elements).
 * Selectors validated against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  const { document } = payload;

  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.optanon-alert-box-wrapper',
      '[class*="cookie-script"]',
      'dialog',
      '#chatbot',
      '#botContainer',
      '[id*="webchat"]',
      '[class*="webchat"]',
      '[class*="chatbot"]',
      '[class*="bot-framework"]',
      '[class*="socialnetworkshare"]',
      '[class*="share-module"]',
      '#notification-sound',
      '#genericVideoBox',
      'audio',
      'video[autoplay]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav[role="navigation"]',
      'noscript',
      'iframe',
      'link',
      'script',
      'style',
      '[aria-hidden="true"]',
    ]);
  }
}
