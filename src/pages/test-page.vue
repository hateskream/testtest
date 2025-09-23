<script setup lang="ts">
import { ModalTickerSelector } from '@/modules/ticker-selector';
import { LayoutComponent } from '@/modules/layout';

</script>

<template>
	<layout-component :is-curtain-fixed="false">
		<template #content>
			<div class="fear-and-greed">
				<modal-ticker-selector
					:is-background-transparent="true"
					:enable-selected-info="false"
					:enable-select-all="false"
					text-above-search="Add symbols"
				/>
			</div>
		</template>
		<template #curtain>
			<div
				:style="{
					width: '429px',
					background: 'red',
					height: '100%',
				}"
			>
			</div>
		</template>
	</layout-component>
</template>

<style scoped>
.fear-and-greed {
	max-width: 800px;
	height: 400px;
	margin: 0 auto;
	padding: 20px;
}

.loading {
	font-style: italic;
	color: #666666;
}

.error {
	padding: 10px;
	color: #ff4444;
	background-color: #ffebee;
	border: 1px solid #ffcccc;
	border-radius: 4px;
}

.data-content {
	margin: 15px 0;
	padding: 15px;
	background-color: #f5f5f5;
	border-radius: 4px;
}

button {
	padding: 10px 20px;
	font-size: 14px;
	color: #ffffff;
	background-color: #007bff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:hover:not(:disabled) {
	background-color: #0056b3;
}

button:disabled {
	background-color: #6c757d;
	cursor: not-allowed;
}
</style>
