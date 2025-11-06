# Position API Reference

## Features
The `Position` system provides primitives for building floating UI such as dropdowns, menus, and nested sub-menus. It controls positioning, open/close behavior, triggers, and layering.


## Anatomy

Import all parts and piece them together.

```vue
<script setup lang="ts">
import {
	PositionRoot,
	PositionTrigger,
	PositionTeleport,
	PositionContent,
	SubpositionRoot,
	SubpositionTrigger,
	SubpositionContent
} from '@/shared/ui/position'
</script>

<PositionRoot>
  <PositionTrigger>
    Click me!
  </PositionTrigger>

  <PositionTeleport>
    <PositionContent>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>
      <div>Item</div>

      <SubpositionRoot>
        <SubpositionTrigger>
          <div>Item</div>
        </SubpositionTrigger>

        <SubpositionContent>
          <div>Item</div>
          <div>Item</div>
          <div>Item</div>
        </SubpositionContent>
      </SubpositionRoot>
    </PositionContent>
  </PositionTeleport>
</PositionRoot>
```

## Component API description

### `PositionRoot`

The root component that wraps the entire position instance.

Responsible for:

- Managing open/close state
- Handling interaction triggers (`click`, `hover`, etc.)
- Providing context for nested sub-positions
- Controlling pinned behavior

#### Props

| Prop         | Type                                     | Default | Description                                                  |
|--------------|------------------------------------------|---------|--------------------------------------------------------------|
| `trigger`    | `FloatingTriggers \| FloatingTriggers[]` | `click` | Defines how the position is opened (`click`, `hover`, etc.). |
| `openDelay`  | `number`                                 | `0`     | Delay (ms) before opening when using hover.                  |
| `closeDelay` | `number`                                 | `0`     | Delay (ms) before closing when using hover.                  |

#### Events

| Event        | Payload | Description                                     |
|--------------|---------|-------------------------------------------------|
| `onOpened`   | `[]`    | Fired when the content is fully opened.         |
| `onClosed`   | `[]`    | Fired when the content is fully closed.         |
| `onPinned`   | `[]`    | Fired when the content becomes pinned.          |
| `onUnpinned` | `[]`    | Fired when the pinned content becomes unpinned. |

---

### `PositionTrigger`

The interactive element that opens the position.
Wrap it around the UI element that should activate the floating content.

#### Events

| Event                 | Payload | Fires When                                                                                    |
|-----------------------|---------|-----------------------------------------------------------------------------------------------|
| `onTriggerMouseEnter` | `[]`    | Fired only if the trigger is hovered **and** the position is **not open** and **not pinned**. |
| `onTriggerMouseLeave` | `[]`    | Fired only if the trigger loses hover **and** the position is **not pinned**.                 |

---

### `PositionTeleport`

Teleports the floating content to another DOM container (e.g., `body`) to avoid stacking context and overflow issues.

#### Props

| Prop       | Type      | Default | Description                                                     |
|------------|-----------|---------|-----------------------------------------------------------------|
| `to`       | `string`  | `body`  | CSS selector for the teleport target.                           |
| `disabled` | `boolean` | `false` | If `true`, teleport is disabled and content is rendered inline. |
| `defer`    | `boolean` | `false` | Defers mounting until first open to improve performance.        |

---

### `PositionContent`

The floating panel that appears when the position is open.

Contains items, UI, and potentially nested `SubpositionRoot`.

#### Props

| Prop        | Type        | Default          | Description                                        |
|-------------|-------------|------------------|----------------------------------------------------|
| `placement` | `Placement` | `'bottom-start'` | Defines the floating placement (from Floating-UI). |
| `offset`    | `number`    | `6`              | Offset distance between trigger and content.       |
| `strategy`  | `Strategy`  | `'absolute'`     | Positioning strategy (`fixed` or `absolute`).      |

---

### `SubpositionRoot`

Creates a nested position (sub-menu) inside a parent `PositionContent`.

#### Props

| Prop         | Type                                     | Default | Description                        |
|--------------|------------------------------------------|---------|------------------------------------|
| `trigger`    | `FloatingTriggers \| FloatingTriggers[]` | `hover` | Trigger behavior for the sub-menu. |
| `openDelay`  | `number`                                 | `20`    | Hover open delay (ms).             |
| `closeDelay` | `number`                                 | `140`   | Hover close delay (ms).            |

#### Events

| Event        | Payload | Description        |
|--------------|---------|--------------------|
| `onOpened`   | `[]`    | Sub-menu opened.   |
| `onClosed`   | `[]`    | Sub-menu closed.   |
| `onPinned`   | `[]`    | Sub-menu pinned.   |
| `onUnpinned` | `[]`    | Sub-menu unpinned. |

---

### `SubpositionTrigger`

Trigger that opens a nested sub-menu.
Must be rendered inside `SubpositionRoot`.

#### Events

| Event                 | Payload | Fires When                                                                                            |
|-----------------------|---------|-------------------------------------------------------------------------------------------------------|
| `onTriggerMouseEnter` | `[]`    | Fired only if the sub-trigger is hovered **and** the sub-position is **not open** and **not pinned**. |
| `onTriggerMouseLeave` | `[]`    | Fired only if the sub-trigger loses hover **and** the sub-position is **not pinned**.                 |

---

### `SubpositionContent`

The floating panel that appears when a sub-position is open.

#### Props

| Prop           | Type        | Default          | Description                                                                              |
|----------------|-------------|------------------|------------------------------------------------------------------------------------------|
| `placement`    | `Placement` | `'bottom-start'` | Defines where the sub-menu opens relative to the parent item.                            |
| `offset`       | `number`    | `6`              | Offset distance from the trigger.                                                        |
| `strategy`     | `Strategy`  | `'fixed'`        | Positioning strategy.                                                                    |
| `hoverPadding` | `number`    | `4`              | Extra hover “buffer” area between trigger and sub-content to prevent accidental closing. |

---

## Data Attributes & Animation

`PositionRoot` exposes state through `data-*` attributes, allowing you to create CSS-based animations without JavaScript logic.

### Data Attributes

| Attribute     | Value        | Description                               |
|---------------|--------------|-------------------------------------------|
| `data-open`   | `true/false` | Indicates whether the position is open.   |
| `data-pinned` | `true/false` | Indicates whether the position is pinned. |

Attach them to your content container to style and animate based on state.

```vue

<template>
	<position-content
		class="position-content"
		:data-open="isOpen"
		:data-pinned="isPinned"
	>
		<slot />
	</position-content>
</template>

<style>
.position-content[data-open="true"] {
  animation: fadeIn 120ms ease-out;
}

.position-content[data-open="false"] {
  animation: fadeOut 120ms ease-in forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-2px); }
}
</style>
```

## Using With `UiPresence`

`UiPresence` ensures the content stays in the DOM until exit animations finish.
Use it when you need smooth closing animations instead of instant unmount.

Recommended when:

- You need exit animations to complete before unmount
- You use `<transition>` for enter/leave animations
- You have nested sub-menus and want seamless closing
- You want full control over mounting and unmounting behavior

```vue
<PositionRoot v-slot="{ isOpen }">
  <PositionTrigger>
    ...
  </PositionTrigger>

  <PositionTeleport>
    <UiPresence :present="isOpen" v-slot="{ present }">
      <transition name="fade">
        <PositionContent v-if="present">
          <div>...</div>
        </PositionContent>
      </transition>
    </UiPresence>
  </PositionTeleport>
</PositionRoot>
```
