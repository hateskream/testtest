<script setup lang="ts">

interface IBreadcrumb {
	id: string;
	name: string;
	isOriginal: boolean;
}

interface IUiBreadcrumb {
	breadcrumbs: IBreadcrumb[];
}

const props = defineProps<IUiBreadcrumb>();

const emit = defineEmits<{
	(e: 'click-all'): void;
	(e: 'click-original-breadcrumb', id: string): void;
	(e: 'click-not-original-breadcrumb', id: string): void;
}>();

function onClickBreadcrumb(breadcrumb: IBreadcrumb): void {
	if (breadcrumb.isOriginal) {
		emit('click-original-breadcrumb', breadcrumb.id);
	} else {
		emit('click-not-original-breadcrumb', breadcrumb.id);
	}
}

</script>

<template>
	<div v-if="props.breadcrumbs.length" class="breadcrumbs">
		<div class="all" @click="emit('click-all')"> All <span class="separator">/</span></div>
		<div
			v-for="(breadcrumb, index) in props.breadcrumbs"
			:key="breadcrumb.id"
		>
			<div
				v-if="index !== props.breadcrumbs.length - 1"
				@click="onClickBreadcrumb(breadcrumb)"
			>
				{{ breadcrumb.name }} /
			</div>
			<div v-else class="current">
				{{ breadcrumb.name }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.breadcrumbs {
	display: flex;
	align-items: center;
	height: 40px;
	gap: 4px;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-02, 10px);
	color: var(--color-text-base-300, #9a9a9d);
}

.all {
	font-weight: 440;
}

.current {
	padding: 2px 6px;
	color: var(--color-text-hover-base-300-hover, rgb(245 245 245 / 90%));
	background: var(--color-bg-base-500, rgb(77 77 77 / 50%));
	border-radius: 6px;
}

.separator {
	padding: 0 4px;
}
</style>
