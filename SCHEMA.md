# SCHEMA.md — zhishi 数据规范

---

## 命名规则

- 所有文件名用 **英文或拼音**，禁止汉字
- 格式：`{主题}-{关键词}-{日期}.md`
- 示例：`ai-product-thinking-20260604.md`

---

## Frontmatter 字段

### 笔记（notes/）

```yaml
---
title: 标题                           # 必填
source: URL                           # 可选，有来源时填
date: YYYY-MM-DD                      # 必填，入库日期
rating: ⭐ 强推荐 / 👍 可存 / 👎 不推荐   # 必填
tags: [标签1, 标签2]                   # 必填，至少 1 个
related: [文件名1.md, 文件名2.md]       # 可选，关联脚本自动填写
---
```

### 主题页（wiki/）

```yaml
---
title: 主题名称                         # 必填
type: 主题页 / 实体页                   # 必填
created: YYYY-MM-DD                    # 必填
updated: YYYY-MM-DD                    # 必填，每次修改更新
related: [文件名1.md, 文件名2.md]       # 可选
---
```

### index.md 条目格式

```markdown
- &#91;&#91;文件名&#93;&#93; — 一句话描述
```
