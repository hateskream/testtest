# ui-infinite-loading

The component fires an `infinite` event while the component is visible in the viewport using intersection observer.

### Props

| Prop        | Type                    | Default  | Description                                                                   |
|-------------|-------------------------|----------|-------------------------------------------------------------------------------|
| `top`       | `boolean`               | `false`  | Set load direction to top                                                     |
| `scroller`  | `HTMLElement \| string` | `window` | Specify the scrollable element                                                |
| `distance`  | `number`                | `0`      | `infinite` event will be fired if the scroll distance is less than this value |
| `firstLoad` | `boolean`               | `false`  | Is used to specify either you want the component to handle first load or not. |

### Events

| Event      | Payload                 | Description                                                                                                                                                                   |
|------------|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `infinite` | `IInfiniteStateHandler` | This event will be fired if the scroll distance is less than the distance property, the component will pass a special argument for the event handler to change loading status |

```typescript
interface IInfiniteStateHandler {
	loading: () => void;
	loaded: () => void; // Informs the component that this loading has been successful
	complete: () => void; // Inform the component that all the data has been loaded successfully
	error: () => void; // Inform the component that this loading failed, the content of error slot will be displayed.
}
```

### Slots

#### `loader`

- **Details**:
	Used to create a custom loading view
- **example**:

```vue

<template #loader>
	<span>loading...</span>
</template>
```

####

#### `complete`

- **Details**:
	Used to create a custom display message when there is no more data (`$state.complete`)

- **example**:

```vue

<template #complete>
	<span>No more data found!</span>
</template>
```

####

#### `error`

- **bind**: `retry` function
- **Details**:
	Used to create a custom display message when an error occurs (`$state.error`)

- **example**:

```vue

<template #error="{ retry }">
	<button @click="retry">Retry</button>
</template>
```

###

### Example

```vue

<script setup lang="ts">
	import {type IInfiniteStateHandler, UiInfiniteLoading} from "@/shared/ui/infinite-loading";
	import {getProducts} from "@/modulse/products";
	import {reactive, ref, useTemplateRef} from "vue";

	const products = reactive<{ id: number }[]>([{id: 1}, {id: 2}, {id: 3}]);
	const limit = 10;
	const offset = ref(0);

	const scrollable = useTemplateRef('scrollable');

	async function loadMore($state: IInfiniteStateHandler) {
		try {
			const response = await getProducts({offset: offset.value, limit});

			if (response.length < limit) {
				$state.complete();
			} else {
				$state.loaded();
			}

			products.push(...response);
			offset.value += response.length;
		} catch (error) {
			$state.error();
		}
	}
</script>
<template>
	<div class="scrollable" ref="scrollable">
		<div v-for="produce in products" :key="product.id">
			{{ product.id }}
		</div>
		<ui-infinite-loading :scrollable="scrollable" @infinite="loadMore"/>
	</div>
</template>
<style>
	.scrollable {
		display: flex;
		flex-direction: column;
		gap: 5px;
		margin-bottom: 10px;
		overflow-y: auto;
	}
</style>
```

## Customize using slots

```vue

<template>
	<div>
		<div v-for="produce in products" :key="product.id">
			{{ product.id }}
		</div>
		<ui-infinite-loading @infinite="loadMore">
			<template #loader>
				<span>Searching products..</span>
			</template>
		</ui-infinite-loading>
	</div>
</template>
```
