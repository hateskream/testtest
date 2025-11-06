# Presence

How is this component different from [Vue Transition](https://vuejs.org/guide/built-ins/transition.html#transition)?

A: The biggest difference is it accepts css animation, and control the visibility of element.

Presence component provides enhanced control over element mounting/unmounting. It ensures animations and transitions complete before removing elements from the DOM, making it perfect for animated UI components.

## Example

```vue
<template>
  <UiPresence :state="isVisible">
    <div :data-state="isVisible ? 'open' : 'closed'">
      <slot />
    </div>
  </UiPresence>
</template>
```

### Force Mount

When you need to ensure content is always rendered regardless of the present state:

```vue
<template>
  <UiPresence v-slot="{ present }" :state="isVisible" :force-mount="true">
    <div>
      This content will always be rendered

      <div v-if="present">
        This content is hidden
      </div>
    </div>
  </UiPresence>
</template>
```

### Using with `<Transition>`

You can combine `UiPresence` with Vue’s `<Transition>` component to handle both **mount/unmount** logic and **CSS-based enter/leave animations**.
This allows exit animations to fully complete before the DOM node is removed.

```vue
<template>
  <UiPresence :state="isVisible" v-slot="{ present }">
    <Transition name="fade">
      <div v-if="present">...</div>
    </Transition>
  </UiPresence>
</template>
```
