<script setup lang="ts">
import { computed } from 'vue';

import type { Sectors } from '../../../../model';
import type { ITickerWidgetMeta } from '@/modules/ticker';
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { TickerBaseListDivider } from '@/modules/ticker/ui/base';
import { UiText } from '@/shared/ui/text';
import { UiTag } from '@/shared/ui/tag';
import { getDateFormatter } from '@/shared/lib';

interface IProps {
	data: Sectors;
	meta: ITickerWidgetMeta;
}

const props = defineProps<IProps>();

const sectorRows = computed(() => {
	const rows = [];
	for (let i = 0; i < props.data.sectors.length; i += 2) {
		rows.push(props.data.sectors.slice(i, i + 2));
	}
	return rows;
});

const hasAnySubsectors = computed(() => {
	return props.data.sectors.some((sector) => sector.subsectors && sector.subsectors.length > 0);
});

function formatDate(date: string) {
	const shortFormatter = getDateFormatter({
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});

	const short = shortFormatter.format(new Date(date));;
	return `${short}`;
}

const lastUpdateLabel = computed(() => {
	if (props.data.lastUpdate) {
		return formatDate(props.data.lastUpdate);
	}

	return undefined;
});
</script>

<template>
	<base-ticker-widget-wrapper :class="[classes.container, { [classes.noSubsectors]: !hasAnySubsectors }]">
		<base-ticker-widget-header>
			<template #default>
				{{ props.meta.name }}
			</template>
			<template #right>
				<ui-tag
					v-if="props.data.lastUpdate"
					token="text-200-r"
					color="neutral"
				>
					last update: {{ lastUpdateLabel }}
				</ui-tag>
			</template>
		</base-ticker-widget-header>
		<base-ticker-widget-content>
			<div :class="classes.sectorsGrid">
				<template v-for="(row, rowIndex) in sectorRows" :key="rowIndex">
					<div
						v-for="sector in row"
						:key="sector.sectorName"
						:class="classes.sectorItem"
					>
						<div :class="classes.sectorHeader">
							<div :class="classes.sectorMain">
								<span :class="classes.dot" :style="{ backgroundColor: sector.color }" />
								<ui-text token="title-100" :class="classes.sectorTitle">
									{{ sector.sectorDisplayName }}
								</ui-text>
							</div>
							<ui-text token="title-100" :class="classes.sectorValue">
								{{ sector.value }}%
							</ui-text>
						</div>

						<div v-if="sector.subsectors?.length" :class="classes.subsectors">
							<ui-tag
								v-for="sub in sector.subsectors"
								:key="sub.subSectorName"
								:class="classes.tagContent"
								icon-position="start"
								color="neutral"
							>
								<template #icon>

									<span :class="classes.subDot" :style="{ backgroundColor: sub.color }" />
								</template>
								<template #default>
									{{ sub.subSectorDisplayName }} - {{ sub.value }}%
								</template>

							</ui-tag>
						</div>
						<div :class="classes.mobileDivider">
							<ticker-base-list-divider
								v-if="!(rowIndex === sectorRows.length - 1 && sector === row[row.length - 1])
									&& hasAnySubsectors"
							/>
						</div>
					</div>
					<div
						v-if="rowIndex < sectorRows.length - 1 && hasAnySubsectors"
						:class="classes.desktopDivider"
					>
						<ticker-base-list-divider />
					</div>
				</template>
			</div>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style module="classes">
.container {
	container-name: sector-widget;
	container-type: inline-size;
}

.sectorsGrid {
	display: grid;
	width: 100%;
	padding: 0 14px 16px;
	column-gap: 32px;
	grid-template-columns: repeat(2, 1fr);
	row-gap: 24px;
}

.sectorItem {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.desktopDivider {
	grid-column: 1 / -1;
	margin: -4px 0;
}

.mobileDivider {
	display: none;
}

@container sector-widget (max-width: 600px) {
	.sectorsGrid {
		grid-template-columns: 1fr;
		row-gap: 16px;
	}

	.desktopDivider {
		display: none;
	}

	.mobileDivider {
		display: block;
		margin-top: 4px;
	}

	.noSubsectors {
		.sectorItem {
			gap: 0;

			&:last-child {
				border-bottom: none;
			}
		}
	}
}

.sectorHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 7px 0;
	gap: 8px;
}

.sectorMain {
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
}

.dot {
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	border-radius: 50%;
}

.sectorTitle {
	overflow: hidden;
	color: var(--text-500, rgb(255 255 255 / 96%));
	white-space: nowrap;
	text-overflow: ellipsis;
}

.sectorValue {
	flex-shrink: 0;
}

.subsectors {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.tagContent {
	display: flex;
	align-items: center;
	gap: 6px;
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.subDot {
	flex-shrink: 0;
	width: 6px;
	height: 6px;
	border-radius: 50%;
}

.noSubsectors {
	.sectorsGrid {
		padding: 16px 20px;
		row-gap: 0;
		column-gap: max(5%, 20px);

		.sectorItem {
			border-bottom: 1px solid var(--border-100, rgb(73 73 80 / 44%));

			&:last-child,
			&:nth-last-child(2):nth-child(odd) {
				border-bottom: none;
			}
		}
	}
}
</style>
