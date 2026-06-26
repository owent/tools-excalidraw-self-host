# Custom Fonts

`config/custom-fonts.json` is the source of truth for Excalidraw font menu entries.

## Local-Only Policy

- The workflow does not download, copy, vendor, or publish font files.
- Each configured font is a menu entry backed by generated CSS that uses only `local(...)` font-family references.
- The font renders only when the visitor's operating system or browser environment already has a matching local font installed.
- `localNames` should include the display label plus common Chinese and English family names when known.
- Do not add vague entries such as "other popular artistic fonts" without explicit local font-family names.

## Current Entries

- Sarasa, Noto, Maple Mono, and Microsoft YaHei entries are local font aliases only.
- macOS-oriented aliases include SF Pro, SF Compact, SF Mono, PingFang SC, Heiti SC, Hiragino Sans GB, Kaiti SC, HanziPen SC, Hannotate SC, Baoli SC, Libian SC, LingWai SC, Weibei SC, Xingkai SC, Yuanti SC, Apple Chancery, Snell Roundhand, American Typewriter, Avenir Next, and Helvetica Neue.
- Android and Google-oriented aliases include Roboto, Roboto Condensed, Roboto Slab, Roboto Serif, Roboto Mono, Droid Sans, Droid Serif, Droid Sans Mono, Google Sans, Google Sans Text, and Google Sans Display.
- Linux-oriented aliases include Ubuntu Sans, Ubuntu, Ubuntu Mono, Cantarell, Adwaita Sans, Adwaita Mono, Inter, DejaVu Sans, Liberation Sans, Liberation Mono, Nimbus Sans, FreeSans, WenQuanYi Micro Hei, WenQuanYi Zen Hei, Source Han Sans SC, and Source Han Serif SC.
- Additional artistic aliases include LXGW WenKai, ZCOOL KuaiLe, ZCOOL QingKe HuangYou, ZCOOL XiaoWei, Ma Shan Zheng, Long Cang, Zhi Mang Xing, and Liu Jian Mao Cao.
- `Microsoft YaHei` remains local-only because it is proprietary.
- The requested `更纱黑体 Slab SC*` names remain local aliases; no distributable font package is required because this repo no longer bundles fonts.
