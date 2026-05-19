/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-generic.js
  var import_generic_exports = {};
  __export(import_generic_exports, {
    default: () => import_generic_default
  });

  // tools/importer/transformers/mphasis-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    const { document } = payload;
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".optanon-alert-box-wrapper",
        '[class*="cookie-script"]',
        "dialog",
        "#chatbot",
        "#botContainer",
        '[id*="webchat"]',
        '[class*="webchat"]',
        '[class*="chatbot"]',
        '[class*="bot-framework"]',
        '[class*="socialnetworkshare"]',
        '[class*="share-module"]',
        "#notification-sound",
        "#genericVideoBox",
        "audio",
        "video[autoplay]"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        'nav[role="navigation"]',
        "noscript",
        "iframe",
        "link",
        "script",
        "style",
        '[aria-hidden="true"]'
      ]);
    }
  }

  // tools/importer/import-generic.js
  var transformers = [transform];
  function executeTransformers(hookName, element, payload) {
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, payload);
      } catch (e) {
      }
    });
  }
  var import_generic_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const selectorsToRemove = [
        "header",
        "footer",
        "nav.breadcrumb",
        ".cookie-banner",
        "#onetrust-consent-sdk",
        ".chatbot",
        ".chat-widget",
        ".social-share",
        "script",
        "style",
        "noscript",
        "iframe"
      ];
      selectorsToRemove.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => el.remove());
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: "generic"
        }
      }];
    }
  };
  return __toCommonJS(import_generic_exports);
})();
