---
title: "Hooks 的闭包陷阱与心智模型"
date: "2026.02.12"
category: "TECH"
excerpt: "深入分析 useEffect、useCallback 等 Hooks 背后的闭包机制，避免常见的 stale closure 问题。"
order: 2
tags: [React, Hooks]
---

## Hooks 与闭包

每次组件渲染，函数体都会重新执行。这意味着每次渲染都会创建新的闭包，捕获当次渲染的 props 和 state。这是 Hooks 最核心的心智模型。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // 始终是创建 effect 时的 count 值
    }, 1000);
    return () => clearInterval(id);
  }, []);  // 空依赖 → 只在挂载时创建

  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

上面的 `console.log(count)` 永远输出 `0`，因为 effect 的闭包捕获了首次渲染时的 `count`。

## 解决方案

### 1. 正确声明依赖

```jsx
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, [count]); // count 变化时重建定时器
```

### 2. 使用 ref 逃逸闭包

```jsx
const countRef = useRef(count);
countRef.current = count;

useEffect(() => {
  const id = setInterval(() => console.log(countRef.current), 1000);
  return () => clearInterval(id);
}, []);
```

### 3. 使用函数式更新

当你只需要基于前值计算新值时，`setState(prev => ...)` 可以避免对 state 的直接依赖。

## useCallback 与 useMemo 的取舍

并非所有函数都需要 `useCallback` 包裹。只有当函数作为 prop 传递给 `React.memo` 组件、或作为 `useEffect` 依赖时，稳定引用才有意义。过度使用反而增加了代码复杂度和内存开销。

## 小结

理解"每次渲染都是一个快照"这个模型，大部分 Hooks 的困惑都会迎刃而解。
