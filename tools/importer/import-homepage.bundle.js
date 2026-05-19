/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-homepage.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll('.carousel-item, [class*="carousel-slide"], [class*="slide"]');
    const cells = [];
    slides.forEach((slide) => {
      let imageCell = [];
      const styleAttr = slide.getAttribute("style") || "";
      const bgMatch = styleAttr.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
      if (bgMatch) {
        const img = document.createElement("img");
        img.src = bgMatch[1];
        img.alt = "";
        imageCell.push(img);
      } else {
        const imgEl = slide.querySelector('img, picture img, [class*="bg"] img');
        if (imgEl) {
          imageCell.push(imgEl);
        }
      }
      const contentCell = [];
      const heading = slide.querySelector('h1, h2, h3, [class*="heading"], [class*="title"]');
      if (heading) {
        contentCell.push(heading);
      }
      const descriptions = slide.querySelectorAll('p, [class*="description"], [class*="subtitle"]');
      descriptions.forEach((desc) => {
        contentCell.push(desc);
      });
      const ctaLinks = slide.querySelectorAll("a");
      ctaLinks.forEach((link) => {
        contentCell.push(link);
      });
      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-approach.js
  function parse2(element, { document }) {
    const paragraphs = element.querySelectorAll(":scope > p");
    const cells = [];
    const cellContent = [];
    if (paragraphs.length > 0) {
      cellContent.push(paragraphs[0]);
    }
    for (let i = 1; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      if (p.querySelector("a") && p.textContent.trim().replace(/KNOW MORE/i, "").replace(/read more/i, "").trim().length === 0) {
        continue;
      }
      if (p.textContent.trim().length > 0) {
        cellContent.push(p);
        break;
      }
    }
    const link = element.querySelector("a[href]");
    if (link) {
      const cleanLink = document.createElement("a");
      cleanLink.href = link.href;
      cleanLink.textContent = link.textContent.trim() || "KNOW MORE";
      cellContent.push(cleanLink);
    }
    if (cellContent.length > 0) {
      cells.push(cellContent);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-approach", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-offerings.js
  function parse3(element, { document }) {
    const offeringLinks = element.querySelectorAll("a[href]");
    const cells = [];
    offeringLinks.forEach((link) => {
      const img = link.querySelector("img");
      const span = link.querySelector("span");
      const linkText = span ? span.textContent.trim() : link.textContent.trim();
      if (!linkText && !img) return;
      const anchor = document.createElement("a");
      anchor.setAttribute("href", link.getAttribute("href"));
      anchor.textContent = linkText;
      const imageCell = img ? img.cloneNode(true) : "";
      const textCell = anchor;
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-offerings", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-articles.js
  function parse4(element, { document }) {
    const articles = element.querySelectorAll(".hotspot-box");
    const cells = [];
    articles.forEach((article) => {
      const tagFooter = article.querySelector(".tag-footer");
      if (!tagFooter) return;
      const heading = tagFooter.querySelector("h3");
      const paragraphs = tagFooter.querySelectorAll("p");
      let excerpt = null;
      for (const p of paragraphs) {
        const text = p.textContent.trim();
        if (text && text !== "Know More" && text.length > 20) {
          excerpt = p;
          break;
        }
      }
      const link = tagFooter.querySelector("a[href]");
      const cellContent = [];
      if (heading) cellContent.push(heading);
      if (excerpt) cellContent.push(excerpt);
      if (link) cellContent.push(link);
      if (cellContent.length > 0) {
        cells.push(cellContent);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-articles", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resources.js
  function parse5(element, { document }) {
    const hotspots = element.querySelectorAll(".hotspot");
    const resourceCards = element.querySelectorAll(".resource-card");
    const cells = [];
    if (hotspots.length > 0) {
      hotspots.forEach((hotspot) => {
        const box = hotspot.querySelector(".hotspot-box, .hotspot-small-box");
        if (!box) return;
        const tag = box.querySelector(".tag");
        const heading = box.querySelector("h3, h2, h4");
        const link = box.querySelector("a");
        const cellContent = [];
        if (tag) {
          const categoryEl = document.createElement("p");
          categoryEl.textContent = tag.textContent.trim();
          cellContent.push(categoryEl);
        }
        if (heading) {
          const h3 = document.createElement("h3");
          h3.textContent = heading.textContent.trim();
          cellContent.push(h3);
        }
        if (link) {
          const a = document.createElement("a");
          a.href = link.href || link.getAttribute("href") || "";
          a.textContent = link.textContent.trim() || "KNOW MORE";
          cellContent.push(a);
        }
        if (cellContent.length > 0) {
          cells.push(cellContent);
        }
      });
    } else if (resourceCards.length > 0) {
      resourceCards.forEach((card) => {
        const category = card.querySelector("span.category, .category");
        const heading = card.querySelector("h3, h2, h4");
        const link = card.querySelector("a");
        const cellContent = [];
        if (category) {
          const categoryEl = document.createElement("p");
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
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resources", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-news.js
  function parse6(element, { document }) {
    const panels = element.querySelectorAll(":scope > .tab-panel");
    const cells = [];
    const row = [];
    panels.forEach((panel) => {
      const columnContent = [];
      const heading = panel.querySelector("h5, h4, h3, h2");
      if (heading) {
        columnContent.push(heading);
      }
      const list = panel.querySelector("ul");
      if (list) {
        columnContent.push(list);
      }
      const eventDiv = panel.querySelector(".event, div.event");
      if (eventDiv) {
        const eventChildren = eventDiv.querySelectorAll("p, a");
        eventChildren.forEach((child) => {
          columnContent.push(child);
        });
      }
      row.push(columnContent);
    });
    cells.push(row);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-news", cells });
    element.replaceWith(block);
  }

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

  // tools/importer/transformers/mphasis-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: [["style", section.style]]
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-homepage": parse,
    "cards-approach": parse2,
    "cards-offerings": parse3,
    "cards-articles": parse4,
    "cards-resources": parse5,
    "columns-news": parse6
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Main homepage with hero banner, featured content, news highlights, and CTAs",
    urls: [
      "https://www.mphasis.com/home.html"
    ],
    blocks: [
      {
        name: "carousel-homepage",
        instances: ["section.hero-carousel"]
      },
      {
        name: "cards-approach",
        instances: [".approach"]
      },
      {
        name: "cards-offerings",
        instances: [".offerings-grid"]
      },
      {
        name: "cards-articles",
        instances: [".container.main > .full-width-container:nth-child(4)"]
      },
      {
        name: "cards-resources",
        instances: [".column-control:has(.hotspot .tag)"]
      },
      {
        name: "columns-news",
        instances: [".latest-tabs"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: "section.hero-carousel",
        style: null,
        blocks: ["carousel-homepage"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Our Approach",
        selector: "section.our-approach",
        style: null,
        blocks: ["cards-approach"],
        defaultContent: ["section.our-approach > h3", "section.our-approach > p"]
      },
      {
        id: "section-3",
        name: "Our Offerings",
        selector: "section.our-offerings",
        style: null,
        blocks: ["cards-offerings"],
        defaultContent: ["section.our-offerings > h3"]
      },
      {
        id: "section-4",
        name: "Thought Leadership",
        selector: "section.thought-leadership",
        style: "dark",
        blocks: ["cards-articles"],
        defaultContent: [".tl-intro"]
      },
      {
        id: "section-5",
        name: "Resources",
        selector: "section.resources",
        style: null,
        blocks: ["cards-resources"],
        defaultContent: ["section.resources > h3", "section.resources > a"]
      },
      {
        id: "section-6",
        name: "Latest at Mphasis",
        selector: "section.latest-at-mphasis",
        style: "dark",
        blocks: ["columns-news"],
        defaultContent: ["section.latest-at-mphasis > h3"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
