<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { UiDelimiter } from '@/shared/ui/delimiter';
</script>

<template>
	<footer :class="classes.footer">
		<div :class="classes.left">
			<section :class="classes.logos">
				<ui-icon
					:id="IconIds.GlobusLogo"
					width="22px"
					height="22px"
				/>
				<ui-delimiter :class="classes.delimiter" />
				<ui-icon
					:id="IconIds.Logo"
					:class="classes.i88"
					width="62px"
				/>
			</section>

			<section :class="classes.textBlock">
				<div :class="classes.head">
					<ui-text token="title-400">
						Missing feature?
					</ui-text>

					<ui-text token="text-400-r" :class="classes.subheading">
						Describe your idea and we’ll make it happen
					</ui-text>
				</div>

				<button :class="classes.requestFeature">
					<ui-icon
						:id="IconIds.Feedback"
						width="16px"
						height="16px"
					/>
					<ui-text token="text-400-r" :class="classes.requestFeatureText">
						Request a feature
					</ui-text>
				</button>
			</section>
		</div>

		<section :class="classes.right">
			<a
				href="https://x.com/i88-uk"
				target="_blank"
				rel="noopener noreferrer"
				:class="classes.socialLink"
			>
				<div :class="classes.socialIcon">
					<ui-icon
						:id="IconIds.Twitter"
						width="18px"
						height="18px"
					/>
				</div>
				<span :class="classes.socialText">@i88-uk</span>
			</a>
			<a
				href="https://discord.gg/i88-support"
				target="_blank"
				rel="noopener noreferrer"
				:class="classes.socialLink"
			>
				<div :class="classes.socialIcon">
					<ui-icon
						:id="IconIds.Discord"
						width="18px"
						height="18px"
					/>
				</div>
				<span :class="classes.socialText">@i88-support</span>
			</a>
		</section>
	</footer>
</template>

<style module="classes">
.footer {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	padding:
		var(--padding-padding-s17, 44px) var(--padding-padding-s15, 36px)
		var(--padding-padding-s20, 72px) var(--padding-padding-s15, 36px);
	row-gap: var(--padding-padding-s19, 60px);
}

.left {
	display: flex;
	flex: 1 0 0;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	min-width: 180px;
	padding: 0 var(--padding-padding-s11, 20px) 0 var(--padding-padding-s2, 2px);
	gap: 72px var(--padding-padding-s20, 72px);
}

.logos {
	display: flex;
	align-items: center;
	height: 32px;
	gap: 12px;
}

.delimiter {
	height: 16px;
}

.textBlock {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	min-width: 180px;
	gap: 24px;
}

.head {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
	align-self: stretch;
}

.subheading {
	width: 187px;
	color: var(--color-text-base-300, #9a9a9d);
}

.requestFeature {
	display: flex;
	align-items: center;
	height: var(--height-height-s16, 40px);
	padding: 0 var(--padding-padding-s10, 18px) 0 var(--padding-padding-s9, 16px);
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s16-40, 15.6px);
	cursor: pointer;
	gap: var(--padding-paddings-s4, 6px);
}

.requestFeature:hover {
	background: var(--bg-200, rgb(73 73 80 / 48%));
}

.requestFeatureText {
	overflow: hidden;
	line-height: 1;
	color: var(--text-300, rgb(255 255 255 / 60%));
	text-overflow: ellipsis;
}

.right {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-content: center;
	align-items: center;
	padding: var(--padding-padding-s4, 6px) var(--padding-padding-s2, 2px);
	gap: 6px var(--tile-gap, 6px);
}

.socialLink {
	display: flex;
	align-items: center;
	width: 128px;
	color: var(--color-text-base-300, #9a9a9d);
	text-decoration: none;
	gap: 4px;
}

.socialLink:hover {
	color: var(--color-text-base-200, #bfbfc2);
}

.socialIcon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 32px;
	height: 32px;
}

.socialText {
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	line-height: normal;
	text-align: right;
	color: inherit;
}
</style>
