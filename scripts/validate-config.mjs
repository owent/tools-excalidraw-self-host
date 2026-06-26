#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const requiredFontLabels = [
  "更纱黑体 SC",
  "更纱黑体 SC Light",
  "更纱黑体 SC SemiBold",
  "更纱黑体 Slab SC",
  "更纱黑体 Slab SC Light",
  "更纱黑体 Slab SC SemiBold",
  "等距更纱黑体 SC",
  "等距更纱黑体 SC Light",
  "等距更纱黑体 SC SemiBold",
  "等距更纱黑体 Slab SC",
  "等距更纱黑体 Slab SC Light",
  "等距更纱黑体 Slab SC SemiBold",
  "Sarasa Gothic SC",
  "Sarasa Gothic SC Light",
  "Sarasa Gothic SC SemiBold",
  "Sarasa Mono SC",
  "Sarasa Mono SC Light",
  "Sarasa Mono SC SemiBold",
  "Sarasa Term SC",
  "Sarasa Term SC Light",
  "Sarasa Term SC SemiBold",
  "Maple Mono Normal NF CN",
  "Maple Mono Normal NF CN Light",
  "Maple Mono Normal NF CN Medium",
  "Maple Mono Normal NF CN SemiBold",
  "Maple Mono Normal NF CN ExtraBold",
  "Maple Mono Normal NF CN Thin",
  "Noto Sans",
  "Noto Sans Black",
  "Noto Sans Medium",
  "Noto Sans SemiBold",
  "Noto Sans Light",
  "Noto Sans Thin",
  "Noto Sans CJK SC",
  "Noto Sans CJK SC Black",
  "Noto Sans CJK SC Medium",
  "Noto Sans CJK SC Light",
  "Noto Sans CJK SC Thin",
  "Noto Sans SC",
  "Noto Sans SC Black",
  "Noto Sans SC Medium",
  "Noto Sans SC Light",
  "Noto Sans SC Thin",
  "Noto Sans Mono",
  "Noto Sans Mono Black",
  "Noto Sans Mono Medium",
  "Noto Sans Mono SemiBold",
  "Noto Sans Mono Light",
  "Noto Sans Mono CJK SC",
  "Noto Sans Mono CJK SC Medium",
  "Noto Serif",
  "Noto Serif Black",
  "Noto Serif Medium",
  "Noto Serif SemiBold",
  "Noto Serif Light",
  "Noto Serif Thin",
  "Noto Serif CJK SC",
  "Noto Serif CJK SC Black",
  "Noto Serif CJK SC Medium",
  "Noto Serif CJK SC Light",
  "Noto Serif CJK SC Thin",
  "Noto Serif SC",
  "Noto Serif SC Black",
  "Noto Serif SC Medium",
  "Noto Serif SC Light",
  "Noto Serif SC Thin",
  "Microsoft YaHei",
  "SF Pro",
  "SF Pro Display",
  "SF Pro Text",
  "SF Compact",
  "SF Mono",
  "PingFang SC",
  "PingFang SC Light",
  "PingFang SC Medium",
  "PingFang SC Semibold",
  "PingFang SC Thin",
  "PingFang SC Ultralight",
  "Heiti SC Light",
  "Heiti SC Medium",
  "STHeiti",
  "Hiragino Sans GB W3",
  "Hiragino Sans GB W6",
  "Kaiti SC",
  "Kaiti SC Bold",
  "Kaiti SC Black",
  "HanziPen SC",
  "HanziPen SC Bold",
  "Hannotate SC",
  "Baoli SC",
  "Libian SC",
  "LingWai SC",
  "Weibei SC",
  "Xingkai SC Light",
  "Xingkai SC Bold",
  "Yuanti SC",
  "Yuanti SC Light",
  "Yuanti SC Bold",
  "Apple Chancery",
  "Snell Roundhand",
  "American Typewriter",
  "Avenir Next",
  "Avenir Next Condensed",
  "Helvetica Neue",
  "Roboto",
  "Roboto Light",
  "Roboto Medium",
  "Roboto Black",
  "Roboto Thin",
  "Roboto Condensed",
  "Roboto Slab",
  "Roboto Serif",
  "Roboto Mono",
  "Droid Sans",
  "Droid Sans Fallback",
  "Droid Serif",
  "Droid Sans Mono",
  "Google Sans",
  "Google Sans Text",
  "Google Sans Display",
  "Ubuntu Sans",
  "Ubuntu Sans Medium",
  "Ubuntu Sans Bold",
  "Ubuntu",
  "Ubuntu Light",
  "Ubuntu Medium",
  "Ubuntu Condensed",
  "Ubuntu Mono",
  "Cantarell",
  "Cantarell Light",
  "Cantarell Medium",
  "Cantarell Semi-Bold",
  "Cantarell Bold",
  "Adwaita Sans",
  "Adwaita Mono",
  "Inter",
  "DejaVu Sans",
  "DejaVu Sans Condensed",
  "DejaVu Sans Mono",
  "Liberation Sans",
  "Liberation Sans Narrow",
  "Liberation Mono",
  "Nimbus Sans",
  "FreeSans",
  "WenQuanYi Micro Hei",
  "WenQuanYi Zen Hei",
  "Source Han Sans SC",
  "Source Han Serif SC",
  "LXGW WenKai",
  "LXGW WenKai GB",
  "ZCOOL KuaiLe",
  "ZCOOL QingKe HuangYou",
  "ZCOOL XiaoWei",
  "Ma Shan Zheng",
  "Long Cang",
  "Zhi Mang Xing",
  "Liu Jian Mao Cao",
];

const errors = [];

const manifest = await readJson("config/custom-fonts.json");
validateManifest(manifest);
await validateWorkflow();
await validateDocs();
await validateSkill();

if (errors.length > 0) {
  console.error(JSON.stringify({ ok: false, errors }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      fonts: manifest.fonts.length,
      localOnly: manifest.fonts.filter((font) => font.localOnly).length,
    },
    null,
    2,
  ),
);

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"));
}

function validateManifest(value) {
  if (value.schema !== 1) {
    errors.push("config/custom-fonts.json schema must be 1");
  }
  if (!Number.isInteger(value.uiBaseId) || value.uiBaseId <= 1000) {
    errors.push("config/custom-fonts.json uiBaseId must be greater than 1000");
  }
  if (value.downloadSources) {
    errors.push("config/custom-fonts.json must not define downloadSources; fonts are local-only");
  }
  if (value.fontAssetRoot) {
    errors.push("config/custom-fonts.json must not define fontAssetRoot; fonts are local-only");
  }
  if (!Array.isArray(value.fonts)) {
    errors.push("config/custom-fonts.json fonts must be an array");
    return;
  }
  const ids = new Set();
  const labels = new Set();
  for (const font of value.fonts) {
    if (!/^[a-z0-9-]+$/.test(font.id ?? "")) {
      errors.push(`invalid font id: ${font.id}`);
    }
    if (!font.label) {
      errors.push(`font ${font.id} is missing label`);
    }
    if (!["sans-serif", "serif", "monospace"].includes(font.fallback)) {
      errors.push(`font ${font.id} has invalid fallback ${font.fallback}`);
    }
    if (!font.localOnly) {
      errors.push(`font ${font.id} must be localOnly`);
    }
    if (font.source || font.assetPatterns) {
      errors.push(`font ${font.id} must not reference downloadable assets`);
    }
    if (!Array.isArray(font.localNames) || font.localNames.length === 0) {
      errors.push(`font ${font.id} needs localNames`);
    }
    if (ids.has(font.id)) {
      errors.push(`duplicate font id: ${font.id}`);
    }
    if (labels.has(font.label)) {
      errors.push(`duplicate font label: ${font.label}`);
    }
    ids.add(font.id);
    labels.add(font.label);
  }

  for (const label of requiredFontLabels) {
    if (!labels.has(label)) {
      errors.push(`missing requested font label: ${label}`);
    }
  }
}

async function validateWorkflow() {
  const workflow = await readFile(".github/workflows/deploy-gh-pages.yml", "utf8");
  for (const expected of [
    "branches: [main]",
    "cron: \"17 18 * * 0\"",
    "timezone: Asia/Shanghai",
    "SITE_DOMAIN: excalidraw.x-ha.com",
    "actions/checkout@main",
    "actions/setup-node@main",
    "node-version-file: ${{ env.UPSTREAM_DIR }}/package.json",
    "check-latest: true",
    "actions/upload-pages-artifact@main",
    "actions/deploy-pages@main",
    "HEAD:gh-pages",
  ]) {
    if (!workflow.includes(expected)) {
      errors.push(`workflow missing ${expected}`);
    }
  }

  for (const forbidden of [
    { name: "hardcoded Node version", pattern: /\n\s*node-version:\s*[0-9]/ },
    { name: "hardcoded Corepack package-manager version", pattern: /corepack prepare \S+@[0-9]/ },
    { name: "versioned checkout action ref", pattern: /actions\/checkout@v[0-9]/ },
    { name: "versioned setup-node action ref", pattern: /actions\/setup-node@v[0-9]/ },
    { name: "versioned upload-pages-artifact action ref", pattern: /actions\/upload-pages-artifact@v[0-9]/ },
    { name: "versioned deploy-pages action ref", pattern: /actions\/deploy-pages@v[0-9]/ },
    { name: "font download step", pattern: /Download open font assets/ },
    { name: "font asset directory", pattern: /FONT_ASSET_DIR/ },
    { name: "font asset patch argument", pattern: /--font-assets/ },
  ]) {
    if (forbidden.pattern.test(workflow)) {
      errors.push(`workflow still pins a build tool version: ${forbidden.name}`);
    }
  }
}
async function validateDocs() {
  const sourceIndex = await readFile("docs/ai/source-index.md", "utf8");
  for (const expected of [
    "Excalidraw repository",
    "GitHub Pages publishing source",
    "Local custom font references",
  ]) {
    if (!sourceIndex.includes(expected)) {
      errors.push(`source index missing ${expected}`);
    }
  }
}

async function validateSkill() {
  const skill = await readFile(".agents/skills/excalidraw-pages-deploy/SKILL.md", "utf8");
  if (!skill.includes("name: excalidraw-pages-deploy")) {
    errors.push("skill name mismatch");
  }
  if (!skill.includes("Use when: maintaining this repo's self-hosted Excalidraw")) {
    errors.push("skill description is missing expected trigger text");
  }
}
