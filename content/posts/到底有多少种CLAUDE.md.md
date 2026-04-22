---
title: "到底有多少种 “CLAUDE.md”？"
date: "2026.04.22"
category: "TECH"
excerpt: "从 CLAUDE.md 到 AGENTS.md，梳理各主流编码 Agent 的配置文件体系"
---

打开一个新项目，敲下第一行提示词，AI 编码 Agent 就开始干活了。但你有没有想过，它怎么知道你用的是 pnpm 而不是 yarn？怎么知道你习惯 2 空格缩进？怎么知道提交信息必须带 `feat:` 前缀？答案藏在项目根目录的一个不起眼的 Markdown 文件里。

过去一年，几乎每个主流 Agent 平台都推出了自己的配置文件方案。这些文件的本质是"持久化的系统提示词"，让 Agent 在跨会话时依然记得你的偏好。但各家的命名、结构、加载机制差异不小，混用时很容易踩坑。这篇文章就来拆解这些配置文件的设计思路，看看它们在工程实践中究竟解决了什么问题。

## 每家一个名字，每家一套规矩

先摆一张全景图，让各家的文件名和定位一目了然：

| 工具 | 配置文件名 | 格式 | 定位 |
|------|-----------|------|------|
| Claude Code | `CLAUDE.md` | Markdown | Claude 终端 Agent 的专属规则文件 |
| GitHub Copilot | `.github/copilot-instructions.md` | Markdown | 仓库级 Copilot 指令 |
| Cursor | `.cursorrules` / `.cursor/rules/*.mdc` | Markdown + 扩展语法 | IDE 内 Agent 模式的行为定义 |
| Codex CLI | `AGENTS.md` + `.codex/config.toml` | Markdown + TOML | 指令与运行时配置分离 |
| Gemini CLI | `GEMINI.md` / `AGENTS.md` | Markdown | Google Gemini 终端 Agent 上下文文件 |
| Windsurf | `.windsurfrules` | Markdown | Windsurf IDE 的 Cascade Agent 规则 |
| 通用标准 | `AGENTS.md` | Markdown | 跨工具的厂商中立标准 |

格式上几乎清一色选了 Markdown。这不是偶然——Markdown 对人类可读，对 LLM 也友好，不需要额外的解析器，而且天然适合用 Git 做版本控制。唯一的例外是 Codex CLI 把运行时配置（模型选择、权限策略、MCP 服务器）拆到了 TOML 文件里，这是因为那些参数需要程序化解析，用 Markdown 来存反而别扭。

## 层级发现：从个人到目录的三层覆盖

这些配置文件最有意思的设计是"层级发现"机制。几乎所有工具都支持三层结构：全局（用户主目录）→ 项目根目录 → 当前工作目录。以 Claude Code 为例，它会依次加载 `~/.claude/CLAUDE.md`、项目根目录的 `CLAUDE.md`、以及你当前所在子目录的 `CLAUDE.md`，三层规则合并后生效。Codex CLI 和 Gemini CLI 也采用了几乎相同的策略。

这种设计的好处很直觉：你可以在全局文件里写"我习惯 TypeScript + ESM，提交信息用英文"，在项目文件里写"这个项目用 pnpm，测试命令是 `pnpm test`"，在某个子包目录里写"这个包有特殊的导出规范"。Agent 拿到的是三层合并后的完整规则集，越靠近当前编辑文件的规则优先级越高。

Codex CLI 在这方面走得更远——它把指令文件（`AGENTS.md`）和运行时配置（`.codex/config.toml`）彻底分开了。TOML 文件控制模型选择、权限策略这些"硬参数"，Markdown 文件负责编码规范、项目上下文这些"软指令"。两者的优先级链也各自独立：

```toml
# ~/.codex/config.toml — 全局默认
model = "gpt-5.4"
approval_policy = "on-request"

[mcp]
servers = [
  { name = "context7", command = "npx -y @context7/mcp" }
]
```

这个分离很务实。你不会希望"缩进用 2 空格"这种偏好和"使用哪个模型"这种配置混在一个文件里——前者是给 LLM 读的自然语言，后者是给程序读的结构化数据。

## 内容该写什么：从踩坑中长出的共识

配置文件的格式其实很简单，真正的难点是"写什么"。经过社区一年多的摸索，一些共识逐渐成形了。

第一条是项目上下文。告诉 Agent 你的技术栈、项目结构、关键目录的用途。不要指望模型通过扫描 `package.json` 就能理解一个 monorepo 的完整架构——直接用几行话讲清楚，比让它猜更可靠。比如下面这段写法，出自一个实际项目的 `AGENTS.md`：

```markdown
## 项目结构与模块
- `packages/tui/`：终端运行时包，包含交互式应用和聊天时间线
- `packages/core/`：会话状态机、配置处理、共享类型
- `packages/tools/`：内置工具，测试文件与实现放在一起
```

第二条是操作命令。构建、测试、格式化的命令必须写明，Agent 不应该靠猜来决定该跑 `npm test` 还是 `pnpm test`。

第三条是行为约束——也就是"不要做什么"。这往往比"要做什么"更重要。好的约束长这样："修复 Bug 时做最小改动，不要顺手重构周边代码"、"永远不要用 `as any` 压制类型错误"。这类负面指令在实践中效果出奇地好，因为模型的"善意过度"（帮你顺手改了你没要求的东西）是编码 Agent 最常见的问题之一。

第四条，也是容易被忽略的一条：保持精简。配置文件不是项目文档的翻版。超过 300 行的规则文件往往效果递减，因为它会挤占模型真正用来思考问题的上下文空间。把它当作给新同事的入职备忘录来写——只写他第一天最需要知道的事。

## 收敛：AGENTS.md 正在成为事实标准

各家各叫各的名字，团队同时用多个 Agent 时就会头疼：同一套规范要维护 `CLAUDE.md`、`.cursorrules`、`copilot-instructions.md` 三份拷贝？修一个忘另一个，规则漂移几乎是必然的。

这就是 `AGENTS.md` 作为通用标准正在获得牵引力的原因。它的思路很简单——用一个文件提供所有 Agent 都能读的基础上下文，各工具自己的配置文件只补充平台专属的差异。Codex CLI 已经原生支持 `AGENTS.md`；Gemini CLI 可以通过 `.gemini/settings.json` 把上下文文件指向 `AGENTS.md`；Claude Code 在找不到 `CLAUDE.md` 时也会回退读取 `AGENTS.md`。

一种在实践中效果不错的模式是这样的：项目根目录放一份 `AGENTS.md` 作为单一信息源，`CLAUDE.md` 只写一行 `@import AGENTS.md` 或直接引用它，`.cursorrules` 里只放 Cursor 特有的 UI/Composer 行为配置。这样核心规范只维护一处，每个工具拿到的是"通用规范 + 自家补丁"。

Cursor 的 `.mdc` 格式是这个趋势中一个有趣的变体。它在 Markdown 基础上加了 frontmatter 式的元数据头，可以声明规则的触发条件（比如"只在编辑 `.tsx` 文件时激活"）和引用的上下文文件。这比一股脑全塞进系统提示词要精细得多，但代价是失去了与其他工具的兼容性——`.mdc` 目前只有 Cursor 认。

## 安全可别忘了

配置文件会被注入系统提示词，这意味着它也是一个潜在的注入面。Codex CLI 在这方面做了一个值得参考的设计：项目级配置文件只有在用户显式信任该项目目录后才会加载。如果你 clone 了一个陌生仓库，里面的 `AGENTS.md` 不会自动生效，必须手动确认。

另一个要注意的是：永远不要在配置文件里写密钥。API Key 放环境变量，数据库密码放 `.env`——这些文件会被提交到 Git，一旦密钥泄漏就回不来了。这话听起来像废话，但社区里确实有人把 API Key 写进 `.cursorrules` 然后推到了公开仓库。

回头看这些配置文件的演化，底层逻辑其实很清晰：编码 Agent 从"开箱即用"走向了"按项目定制"，而配置文件就是那个衔接通用能力和项目语境的桥梁。Markdown 被选作载体，是因为它在人类协作和 LLM 理解之间找到了最小公约数。层级覆盖机制借鉴了 `.gitconfig` 和 `.editorconfig` 的经验。`AGENTS.md` 的收敛则是多工具并用的工程现实倒逼出来的。

对于刚开始配置 Agent 的开发者，建议从一份 50 行以内的 `AGENTS.md` 开始：写清架构、命令、最让你抓狂的 Agent 坏习惯，然后提交到 Git。等团队里每个人的 Agent 都能自觉遵守你们的代码规范时，你就知道这 50 行值多少了。

