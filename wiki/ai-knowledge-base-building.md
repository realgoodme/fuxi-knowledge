---
title: AI 知识库搭建方法论
type: 主题页
created: 2026-06-22
updated: 2026-06-22
aliases: [zhishi, fuxi, 知识库搭建, AI学习之路]
related: [weihe-yao-da-zhishiku, ai-product-thinking-20260604, ai-architecture-thinking-20260610, ai-tech-thinking-20260609]
---

# AI 知识库搭建方法论

## 概述

zhishi（产品名，最早内部代号 fuxi）是阿 sir 自主研发的个人 AI 知识库。核心理念受卡帕西「把有趣的想法编译长存」启发，但走出了自己的路——**编译 > 检索，往回织不往后堆**。

本主题页将分散在 AI 学习之路系列（07~09）+ 产品设计文档中的方法论整合到一起，提供整体的架构视图。

## 核心理念

### 1. 编译层 — 知识库的灵魂

> 不是把素材堆进去，而是每次加新素材时，AI 回头更新已有知识之间的关联。

与「收藏夹模式」的根本区别：收藏夹是**堆积**，编译层是**织网**。参见 [[wiki/fanchangshi-xiezuo|反常识写作方法]] 中的认知论讨论。

### 2. 进存取三问

架构设计的核心思维框架——先倒推「取」（怎么输出），再想「存」（怎么存），最后定「进」（怎么输入）：

- **进**（输入）：链接、PDF、想法，手动丢给 AI
- **存**（四层）：raw 原料层 → notes 笔记层 → wiki 编译层 → index 索引层
- **取**（输出）：问答流、选题流、周报流

详见 [[notes/ai-architecture-thinking-20260610|AI 学习之路·实战篇08：架构思维（笔记）]]

### 3. 往回织机制

每次入库走五步：抓原文 → 写摘要 → 更新索引 → 织入 wiki → 记入选题池。其中「织入 wiki」是整套系统与普通笔记的最本质区别。

参见 [[notes/ai-product-thinking-20260604|产品思维笔记]] 中关于「找需求先找焦虑」的方法论。

## 技术栈选型

四大原则：主流、本地、简单、大众。具体技术选型理由详见 [[notes/ai-tech-thinking-20260609|技术思维笔记]]。

### 当前技术栈

| 层 | 选择 | 理由 |
|----|------|------|
| 框架 | MkDocs (Material) | 文档型网站，零数据库 |
| 存储 | 纯文件 + Markdown | 不锁定，不需要数据库 |
| 关联 | roamlinks 插件 + manual | 文件级关联，不需要向量库 |
| AI 模型 | 不锁定 | 有什么用什么 |

## 与写作的融合

zhishi 不是纯技术产品，而是写作工具箱的核心组件。参见：
- [[wiki/ergou-xilie|二狗系列]] — 写作方法论的落地案例
- [[wiki/shijianlun|实践论]] — 写作的哲学根基
- [[ZHISHI-PRODUCT-DESIGN]] — 产品设计文档全文

## 关联

- [[notes/weihe-yao-da-zhishiku|为什么 AI 越强，我越要搭自己的知识库（笔记）]] — 系列总纲
- [[notes/ai-product-thinking-20260604|AI 学习之路·实战篇07：产品思维（笔记）]]
- [[notes/ai-architecture-thinking-20260610|AI 学习之路·实战篇08：架构思维（笔记）]]
- [[notes/ai-tech-thinking-20260609|AI 学习之路·实战篇09：技术思维（笔记）]]
