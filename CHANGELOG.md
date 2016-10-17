<h1 align="center">vc-popover - @changelog</h1>

## 0.1.1

`2016-09-27`

- rename effect default transition name to `vc-fade`

## 0.1.0

`2016-09-25`

- 将 `show` 提到 props 中，这样可以实现初始就显示
  - 配合 `closeable` 属性可以实现点击空白不可隐藏，只有show重置为false隐藏
- add `functionalShow` 属性，使得组件的显隐只响应 `show` prop，而不受事件的影响

## 0.0.1

`2016-09-19`

- init
  - 参考vueStrap.popover
  - 增加 `closeable` 属性，点击空白区域自动关闭
