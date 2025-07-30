<script setup lang="ts">
import type { IColorDepthSetting, IMarketSettings, ISingleSetting } from '../model';

const market = defineModel<IMarketSettings>('market', { required: true });
const sizeBy = defineModel<ISingleSetting>('sizeBy', { required: true });
const colorBy = defineModel<ISingleSetting>('colorBy', { required: true });
const colorDepth = defineModel<IColorDepthSetting>('colorDepth', { required: true });
const displayValue = defineModel<ISingleSetting>('displayValue', { required: true });
</script>

<template>
	<div class="settings-component">
		<div>
			<label>Market</label>
			<select v-model="market.active">
				<option
					v-for="m in market.markets"
					:key="m.id"
					:value="m.id"
				>
					{{ m.displayName }}
				</option>
			</select>
		</div>

		<div>
			<label>Size By</label>
			<select v-model="sizeBy.active">
				<option
					v-for="s in sizeBy.values"
					:key="s.key"
					:value="s.key"
				>
					{{ s.displayName }}
				</option>
			</select>
		</div>

		<div>
			<label>Color By</label>
			<select v-model="colorBy.active">
				<option
					v-for="c in colorBy.values"
					:key="c.key"
					:value="c.key"
				>
					{{ c.displayName }}
				</option>
			</select>
		</div>

		<div>
			<label>Color Depth</label>
			<select v-model="colorDepth.active">
				<option
					v-for="cd in colorDepth.values"
					:key="cd.id"
					:value="cd.id"
				>
					{{ cd.end }} - {{ cd.start }}
				</option>
			</select>
		</div>

		<div>
			<label>Display Value</label>
			<select v-model="displayValue.active">
				<option
					v-for="d in displayValue.values"
					:key="d.key"
					:value="d.key"
				>
					{{ d.key }}
				</option>
			</select>
		</div>
	</div>
</template>

<style scoped>
.settings-component {
	display: flex;
	gap: 20px;
}

.settings-component > div {
	margin-bottom: 12px;
}
</style>
