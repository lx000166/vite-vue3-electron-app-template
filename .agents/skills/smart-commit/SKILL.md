---
name: smart-commit
description: Smart Commit — 按模块分批提交。当用户说「提交」「commit」「生成提交信息」或暂存区有变更需要提交时使用。
license: MIT
---

# Smart Commit — 按模块分批提交

当用户说「提交」「commit」「生成提交信息」或暂存区有变更需要提交时，按以下规则拆分并分批提交。

## 工作流程

### 1. 分析暂存区

先执行 `git diff --cached --stat` 和 `git diff --cached --name-only` 了解涉及的文件和变更范围。

### 2. 按模块分组

将文件按功能模块归类，每组作为一次独立提交。分组原则：

- **同一功能/模块**的文件归为一组（如主进程改动、渲染进程页面、配置文件等）
- **改动性质不同**的文件分开（如功能开发与样式优化分开）
- **配置/环境变更**单独提交（如 electron.vite.config、package.json、tsconfig）
- **类型/生成文件**单独提交或忽略（`types/` 下的自动生成文件不提交）
- 每组改动应保持原子性：该组提交后项目应能正常构建

### 3. 生成 Commit Message

- 使用 Conventional Commits 格式，中文描述
- 格式：`<type>: <简短标题>`
- 常见 type：
  - `feat` — 新功能
  - `fix` — 修复
  - `refactor` — 重构（不改变功能）
  - `style` — 样式/布局调整
  - `chore` — 杂项（配置、构建、依赖升级等）
  - `docs` — 文档
  - `test` — 测试
- 正文（`-m` 第二个参数）简要列出具体改动点

### 4. 执行分批提交

1. 先将全部变更重置：`git reset HEAD -- .`
2. 逐组 `git add <files...>` 后 `git commit -m "..." -m "..."`
3. 最后 `git log --oneline -N` 确认所有提交

### 5. 确认

执行后展示提交历史，确认工作区干净。

## 注意事项

- 不要修改暂存区以外的文件
- 不要提交 `node_modules`、`out`、`dist`、`.env.local` 等已忽略文件
- 生成的类型文件（`types/auto-imports.d.ts`、`types/components.d.ts`、`types/typed-router.d.ts`）已在 `.gitignore` 中排除
- 拆分方案先展示给用户，如有歧义可让用户确认
