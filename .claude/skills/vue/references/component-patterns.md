# Vue Component Patterns Reference

## Table of Contents
- [Props Definition](#props-definition)
- [Emits Definition](#emits-definition)
- [V-Model Bindings](#v-model-bindings)
- [Template Patterns](#template-patterns)
- [Component Naming](#component-naming)
- [V-Model Modifiers](#v-model-modifiers)

## Props Definition

```vue

<script setup lang="ts">
	// ✅ CORRECT: TypeScript generics
	import {withDefaults} from "@vue/runtime-core";

	defineProps<{
		userId: number
		userName: string
		isActive?: boolean
	}>()

	// ✅ CORRECT: With const
	const props = defineProps<{
		count: number
	}>()
	console.log(props.count) // Used in script

	// ✅ CORRECT: withDefault
	const props = withDefaults(defineProps<{
		theme?: string
		size?: string
	}>(), { theme: 'light', size: 'medium' })

	// ❌ WRONG: With defaults destructuring
	const { theme = 'light', size = 'medium' } = defineProps<{
		theme?: string
		size?: string
	}>()

	// ❌ WRONG: Runtime validation when TypeScript available
	const props = defineProps({
		user: {
			type: Object as PropType<User>,
			required: true
		}
	})

	// ❌ WRONG: const when props not used
	const props = defineProps<{ count: number }>()
	// props never referenced in script
</script>
```

**Rules:**
- ALWAYS use TypeScript generics: `defineProps<{ }>()`
- NEVER use runtime validation (`type`, `required`, `PropType`) when TypeScript available
- NEVER use Destructure for default values

## Emits Definition

```vue
<script setup lang="ts">
// ✅ CORRECT: TypeScript with event payloads
const emit = defineEmits<{
  submit: [formData: FormData]
  cancel: []
  update: [userId: number, changes: Partial<User>]
}>()

emit('submit', formData)
emit('cancel')
emit('update', 123, { name: 'Updated' })

// ❌ WRONG: Array syntax without types
const emit = defineEmits(['submit', 'cancel'])

// ❌ WRONG: Runtime validation
const emit = defineEmits({
  submit: (payload: FormData) => true
})
</script>
```

**Rules:**
- ALWAYS use `const emit = defineEmits<{ }>()`
- ALWAYS define event payload types: `eventName: [arg1: type, arg2: type]` or `eventName: []`
- ALWAYS use camelCase in script, kebab-case in templates
- Use semantic event names: `submit`, `delete`, `userUpdated` (not generic `update`)

## V-Model Bindings

```vue
<script setup lang="ts">
// ✅ CORRECT: Simple v-model
const title = defineModel<string>({ required: true })

// ✅ CORRECT: With options
const [count, modifiers] = defineModel<number>({
  default: 0,
  get: (value) => Math.max(0, value), // transform on read
  set: (value) => {
    if (modifiers.even) {
      return Math.round(value / 2) * 2
    }
    return value
  }
})

// ✅ CORRECT: Multiple v-models
const firstName = defineModel<string>('firstName')
const age = defineModel<number>('age')
// Usage: <UserForm v-model:first-name="user.firstName" v-model:age="user.age" />

// ❌ WRONG: Manual modelValue implementation
const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
// Should use: const modelValue = defineModel<string>()
</script>
```

**Rules:**
- ALWAYS use `defineModel<type>()` for v-model bindings
- NEVER manually define `modelValue` prop + `update:modelValue` emit
- Use named models for multiple bindings: `defineModel<type>('name')`
- defineModel handles all prop/emit wiring automatically

## Template Patterns

```vue
<template>
  <!-- ✅ CORRECT: Prop shorthand -->
  <user-card :user-id />

  <!-- ✅ CORRECT: Explicit template tags with shorthand slots -->
  <card>
    <template #header>
      <h2>Title</h2>
    </template>
    <template #default>
      <p>Content</p>
    </template>
  </card>

  <!-- ❌ WRONG: v-slot longhand -->
  <card>
    <template v-slot:header>...</template>
  </card>
</template>
```

**Rules:**
- Use `:propName` when value variable matches prop name (instead of `:propName="propName"`)
- ALWAYS use shorthand: `#slotName` instead of `v-slot:slotName`
- Use kebab-case for props/events in templates, camelCase in script

## Component Naming

```
✅ CORRECT:
src/components/
  user-profile.vue         (kebab-case)
  search-button-clear.vue  (Specific → General)

❌ WRONG:
ClearSearchButton.vue      (Specific → General)
userProfile.vue            (camelCase)
```

**Rules:**
- File names: kebab-case (be consistent in project)
- Component names in script: ALWAYS kebab-case
- Compose names from general to specific: `search-button-clear` not `clear-search-button`

## V-Model Modifiers

For custom modifiers, fetch the official docs:
<https://vuejs.org/guide/components/v-model.md#handling-v-model-modifiers>

Basic pattern:
```vue
<script setup lang="ts">
const [modelValue, modifiers] = defineModel<string>({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>
```
