# Trigger Evaluation

## Should Trigger

- "更新 Excalidraw self-host 的 GitHub Pages 部署 workflow"
- "每周自动拉取最新 Excalidraw 并发布到 gh-pages"
- "给 excalidraw.x-ha.com 的 Pages 部署补 CNAME 和 DNS 文档"
- "把 Noto Sans SC 加进 Excalidraw 字体菜单"
- "Sarasa Gothic SC 字体下载失败，修一下 CI"
- "检查 gh-pages 分支是不是发布了最新 Excalidraw"
- "升级 actions/deploy-pages 版本并更新来源索引"
- "Excalidraw 上游改了 font metadata，调整 patch 脚本"

## Should Not Trigger

- "给 README 改个错别字"
- "解释 Excalidraw 是什么"
- "帮我画一个流程图"
- "写一个无关的 React 组件"
- "安装一个本地字体到 Windows"
- "审查另一个仓库的 GitHub Pages workflow"
- "创建一个新的通用 Skill"
- "翻译一段中文"

## Notes

- Keep the trigger narrow to this repository's Excalidraw, GitHub Pages, deployment, and custom font maintenance.
- If a future task shows false positives, edit the `description` before adding more keywords.
