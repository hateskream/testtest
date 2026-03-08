---
name: create-widget
description: Create a new widget in src/modules/widgets/. Use when asked to create, add, or build a new widget.
---

# Creating a Widget

Widgets live in `src/modules/widgets/<widget-name>/` and follow this structure:

```
widget-name/
├── api/                    # API calls
│   ├── get-<name>.ts
│   └── index.ts
├── composables/            # Business logic composable
│   ├── use-<name>.ts
│   └── index.ts
├── model/                  # Types and default state
│   ├── index.ts
│   └── settings.ts         # ISettings interface + getDefaultViewState()
├── queries/                # TanStack Query hooks
│   ├── use-query-<name>.ts
│   └── index.ts
├── ui/
│   ├── common/                              # Shared components used by multiple variants
│   │   ├── view-component.vue               # Main content (if shared across variants)
│   │   ├── preloader-component.vue
│   │   └── rcm-<name>-component.vue         # Display settings panel
│   ├── dashboard/
│   │   └── dashboard-widget-component.vue   # Main dashboard widget
│   ├── tv/
│   │   └── tv-widget-component.vue          # TV/fullscreen variant
│   └── ticker/
│       ├── ticker-widget-component.vue      # Ticker page variant
│       └── ticker-view-component.vue        # Ticker-specific view (if differs from common)
└── index.ts                # Public exports
```

## Dashboard Widget Component pattern

```vue
<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import type { IMeta } from '@/modules/dashboard-group';
import { use<Name> } from '../../composables';
import { BaseErrorComponent, BaseWidgetDashboard } from '@/modules/widgets/base';
import Rcm<Name>Component from '../common/rcm-<name>-component.vue';
import PreloaderComponent from '../common/preloader-component.vue';

const ViewComponent = defineAsyncComponent({
  loader: () => import('../common/view-component.vue'),
  loadingComponent: PreloaderComponent,
  errorComponent: BaseErrorComponent,
});

interface IWidgetExposed {
  snapHeightToNearestStep?(contentHeight: number): number;
}

interface IWidgetComponentProps {
  meta: IMeta;
}

const props = defineProps<IWidgetComponentProps>();

const emit = defineEmits<{
  delete: [];
  duplicate: [];
  moveTo: [dashboardId: string];
}>();

const { viewState, dataState, isNotData, resetAllChanges, refetch } = use<Name>({
  widgetId: props.meta.widgetId,
  isEphemeral: props.meta.isOpenFull,
});

const refComponent = ref<IWidgetExposed | null>(null);

function snapHeightToNearestStep(contentHeight: number): number {
  if (!refComponent.value?.snapHeightToNearestStep) return contentHeight;
  return refComponent.value.snapHeightToNearestStep(contentHeight);
}

defineExpose({ snapHeightToNearestStep });
</script>

<template>
  <base-widget-dashboard
    :meta="props.meta"
    :title="props.meta.name"
    :active-display-variant="props.meta.activeDisplayVariant"
    :all-display-variants="props.meta.allDisplayVariants"
    @reset="resetAllChanges"
    @delete="emit('delete')"
    @duplicate="emit('duplicate')"
    @move-to="emit('moveTo', $event)"
  >
    <template #content>
      <preloader-component v-if="isNotData || props.meta.isLoading" />
      <base-error-component v-else-if="dataState.isError" @retry="refetch" />
      <view-component
        v-else-if="dataState.data"
        ref="refComponent"
        :data="dataState.data"
        :view-state="viewState"
        :size="meta.size"
        display-variant="new"
      />
    </template>
    <template #change-display>
      <rcm-<name>-component v-model="viewState" />
    </template>
  </base-widget-dashboard>
</template>
```

## Composable pattern (use-<name>.ts)

```typescript
import { computed, ref, watch } from 'vue';
import z from 'zod';
import { useQuery<Name> } from '../queries';
import { getDefaultViewState, type ISettings } from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

const settingsSchema = z.object({ /* mirror ISettings fields */ });
type ISettingsSchema = z.infer<typeof settingsSchema>;

interface IOptions {
  widgetId: string;
  isEphemeral: boolean;
}

export function use<Name>({ widgetId, isEphemeral }: IOptions) {
  const viewState = ref<ISettings>(getDefaultViewState());
  const { data, isLoading, isError, refetch } = useQuery<Name>();

  const { useStateQuery, useStateMutation } = createStateQueries<ISettings, ISettingsSchema>({
    storageKey: '__<NAME>__',
    isSaveChange: !isEphemeral,
    getDefaultState: getDefaultViewState,
    entityId: widgetId,
    schema: settingsSchema,
    hydrateFn: (s) => s,
    rehydrateFn: (s) => s,
    urlGet: '',
    urlSet: '',
  });

  const { data: dataSettings } = useStateQuery();
  const { mutate } = useStateMutation();

  const dataState = computed(() => ({ data: data.value, isLoading: isLoading.value, isError: isError.value }));
  const isNotData = computed(() => isLoading.value && !dataSettings.value);

  watch(dataSettings, (s) => { if (s) viewState.value = { ...s }; }, { immediate: true });
  watch(viewState, (s) => {
    if (JSON.stringify(s) !== JSON.stringify(dataSettings.value)) mutate(s);
  }, { deep: true });

  function resetAllChanges() { viewState.value = getDefaultViewState(); }

  return { viewState, dataState, isNotData, resetAllChanges, refetch };
}
```

## index.ts exports

```typescript
export { default as DashboardWidgetComponent } from "./ui/dashboard/dashboard-widget-component.vue";
export { default as TvWidgetComponent } from "./ui/tv/tv-widget-component.vue";
export { default as TickerWidgetComponent } from "./ui/ticker/ticker-widget-component.vue";
```

## Key rules

- Always use `BaseWidgetDashboard` wrapper from `@/modules/widgets/base`
- Props interface named `IWidgetComponentProps`, emits named with `I*Emits` pattern
- `defineAsyncComponent` for ViewComponent with PreloaderComponent + BaseErrorComponent
- State management via `createStateQueries` from `@/shared/service/data-repo`
- Zod schema must mirror the `ISettings` interface for runtime validation
- After creating files run: `npx eslint --fix <files>`
