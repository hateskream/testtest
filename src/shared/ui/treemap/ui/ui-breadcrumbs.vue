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
		<div @click="emit('click-all')"> All |</div>
		<div
			v-for="(breadcrumb, index) in props.breadcrumbs"
			:key="breadcrumb.id"
		>
			<div v-if="index !== props.breadcrumbs.length - 1"  @click="onClickBreadcrumb(breadcrumb)">
				{{ breadcrumb.name }} |
			</div>
			<div v-else>
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
	gap: 10px;
}
</style>
