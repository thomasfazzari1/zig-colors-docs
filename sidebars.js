/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  docsSidebar: [
    "intro",
    "getting-started",
    {
      type: "category",
      label: "API Reference",
      items: [
        "api/colors",
        "api/styles",
        "api/backgrounds",
        "api/rgb-hex",
        "api/utilities",
      ],
    },
    {
      type: "category",
      label: "Examples",
      items: [
        "examples/basic-usage",
        "examples/advanced-styling",
        "examples/real-world",
      ],
    },
  ],
};

export default sidebars;
