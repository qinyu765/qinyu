---
title: "Virtual DOM 与 Reconciliation"
date: "2026.02.10"
category: "TECH"
excerpt: "理解 React 的虚拟 DOM 差异比较算法，以及它如何高效地更新真实 DOM。"
order: 1
tags: [React, Virtual DOM]
---

## 为什么需要 Virtual DOM

直接操作 DOM 的代价很高。浏览器的 DOM API 是同步的，每次修改都可能触发重排（reflow）和重绘（repaint）。当 UI 变得复杂时，逐个操作 DOM 节点的方式既容易出错，性能也难以接受。

React 的解法是引入一层抽象：用普通 JavaScript 对象描述 UI 结构（即 Virtual DOM），在内存中完成新旧树的对比，最后将最小化的差异批量应用到真实 DOM 上。

## Reconciliation 算法

React 的 diff 算法基于两个启发式假设：

1. **不同类型的元素会产生不同的树**。如果根节点类型变了（比如 `<div>` → `<span>`），React 会直接销毁旧树并重建。
2. **开发者可以通过 `key` 暗示哪些子元素是稳定的**。这让列表的增删改操作能以最小代价完成。

这两个假设将原本 O(n³) 的树 diff 问题降为 O(n)。

## Fiber 架构

React 16 引入了 Fiber 架构，将递归的 diff 过程改为可中断的链表遍历。每个 Fiber 节点代表一个组件或 DOM 元素，包含 `child`、`sibling`、`return` 三个指针。

这种设计使得 React 能够：
- 将渲染工作拆分为多个小任务
- 在浏览器空闲时执行这些任务
- 支持优先级调度（Concurrent Mode 的基础）

## 小结

Virtual DOM 不是"更快"，而是"足够快的同时提供了更好的编程模型"。理解这一点，才能正确评估何时需要手动优化。
