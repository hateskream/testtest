<script setup lang="ts">
import { notes } from '../model';

import WeekGroup from './week-group.vue';

const emit = defineEmits<{
	close: [];
}>();

</script>

<template>
	<div class="release-notes-root">
		<header class="rn-header">
			<div class="header-left">
				<h2>Release notes — по неделям</h2>
				<p class="rn-sub">
					Заполняется вручную внутри компонента или передаётся через пропс <code>weeks</code>
				</p>

			</div>
			<div class="week-right" @click="emit('close')">×</div>

		</header>

		<section class="rn-list">
			<week-group
				v-for="wg in notes"
				:key="wg.week"
				:week-group="wg"
			/>

			<div v-if="notes.length === 0" class="empty">Пока нет записей</div>
		</section>
	</div>
</template>

<style scoped>
.release-notes-root {
	width: 100%;
	padding: 18px;
	color: #ffffff;
	background: #0c0c0d;
	border: 1px solid rgb(37 37 39 / 50%);
	border-radius: 14px;
}

.rn-header {
	display: flex;
	justify-content: space-between;
}

.header-left {
	display: flex;
	flex-direction: column;
}

.week-right {
	font-size: 20px;
	cursor: pointer;
}

.rn-header h2 {
	margin: 0 0 6px;
	color: #ffffff;
}

.rn-sub {
	margin: 0 0 14px;
	font-size: 0.95rem;
	color: rgb(255 255 255 / 80%);
}

.empty {
	padding: 24px;
	color: rgb(255 255 255 / 60%);
}

.rn-list {
	display: flex;
	flex-direction: column;
}
</style>
