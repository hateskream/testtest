<script setup lang="ts">
import { ref } from 'vue';

const favOpen = ref(true);
const toastVisible = ref(false);
const activeTab = ref('menu');

function toggleFav() {
	favOpen.value = !favOpen.value;
}
function closeToast() {
	toastVisible.value = false;
}
function setTab(tab: string) {
	activeTab.value = tab;
}
</script>

<template>
	<div :class="classes.root">
		<!-- top hero -->
		<div :class="classes.hero">
			<div :class="classes.heroInner">
				<div :class="classes.logoBadge">
					<!-- small rounded badge -->
					<span :class="classes.badgeIcon">i88</span>
				</div>
			</div>
		</div>

		<!-- chips row -->
		<div :class="classes.chipsRow">
			<span
				v-for="(c, i) in ['DEX','CEX','Analytics','Buy & Sell','Borrow','Earn']"
				:key="i"
				:class="classes.chip"
			>{{ c }}</span>
		</div>

		<!-- content scroll area -->
		<div :class="classes.content">
			<!-- Favourite menu header -->
			<div :class="classes.sectionHeader">
				<span>Favourite menu</span>
				<div :class="classes.headerActions">
					<button :class="classes.plus">+</button>
					<button :class="classes.dots">⋯</button>
				</div>
			</div>

			<!-- Cashflow card -->
			<div :class="classes.card">
				<div :class="classes.cardLeft">
					<div :class="classes.iconStub">💼</div>
					<div>
						<div :class="classes.cardTitle">Cashflow</div>
					</div>
				</div>
				<div :class="classes.chev">›</div>
			</div>

			<!-- Accordion Arbitrage -->
			<div :class="classes.accordion">
				<div :class="classes.accordionHeader" @click="toggleFav">
					<div :class="classes.cardLeft">
						<div :class="classes.iconStub">📁</div>
						<div>
							<div :class="classes.cardTitle">Arbitrage</div>
						</div>
					</div>
					<div :class="classes.chev" :style="favOpen ? { transform: 'rotate(90deg)' } : {}">›</div>
				</div>

				<div v-if="favOpen" :class="classes.accordionBody">
					<div :class="classes.subItem">
						<div :class="classes.subIcon">💼</div>
						<div>Cashflow</div>
						<div :class="classes.subChev">›</div>
					</div>

					<div :class="classes.subItem">
						<div :class="classes.subIcon">📁</div>
						<div>Arbitrage</div>
						<div :class="classes.subChev">›</div>
					</div>
				</div>
			</div>

			<!-- Ecosystem brands -->
			<div :class="classes.smallHeader">Ecosystem brands</div>

			<div :class="classes.card">
				<div :class="classes.cardLeft">
					<div :class="classes.iconStub">💳</div>
					<div>
						<div :class="classes.cardTitle">Paymarket</div>
					</div>
				</div>
				<div :class="classes.chev">›</div>
			</div>

			<div :class="classes.card">
				<div :class="classes.cardLeft">
					<div :class="classes.iconStub">🧭</div>
					<div>
						<div :class="classes.cardTitle">8DX</div>
					</div>
				</div>
				<div :class="classes.chev">›</div>
			</div>
		</div>

		<!-- floating toast -->
		<div v-if="toastVisible" :class="classes.toast">
			<div :class="classes.toastInner">
				<div :class="classes.toastIcon">✨</div>
				<div class="toastText">
					<div class="title">Freshly baked release!</div>
					<button :class="classes.toastBtn">See what's new</button>
				</div>
				<button :class="classes.toastClose" @click="closeToast">✕</button>
			</div>
		</div>

		<!-- bottom nav -->
		<nav :class="classes.bottomNav">
			<button :class="[classes.navBtn, activeTab === 'menu' ? classes.active : '']" @click="setTab('menu')">
				<div class="icon">🏠</div>
				<div class="label">Menu</div>
			</button>

			<button :class="[classes.navBtn, activeTab === 'fav' ? classes.active : '']" @click="setTab('fav')">
				<div class="icon">★</div>
				<div class="label">Favorite</div>
			</button>

			<button :class="[classes.navBtn, activeTab === 'tools' ? classes.active : '']" @click="setTab('tools')">
				<div class="icon">🔧</div>
				<div class="label">Tools</div>
			</button>

			<button :class="[classes.navBtn, activeTab === 'tray' ? classes.active : '']" @click="setTab('tray')">
				<div class="icon">📥</div>
				<div class="label">Tray</div>
			</button>

			<button :class="[classes.navBtn, activeTab === 'setup' ? classes.active : '']" @click="setTab('setup')">
				<div class="icon">⚙️</div>
				<div class="label">Set Up</div>
			</button>
		</nav>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	padding: 22px 12px 92px; /* room for bottom nav */
	font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial';
	color: #e6e6e6;
	background: #0b0b0c;
}

/* HERO */
.hero {
	position: relative;
	width: 100%;
	max-width: 420px;
	height: 150px;
	margin-bottom: 12px;
	overflow: hidden;
	background: linear-gradient(180deg, #0f0f10 0%, #0b0b0c 100%);
	background-image:
		radial-gradient(circle at 20% 20%, rgb(200 40 40 / 12%), transparent 60%),
		radial-gradient(circle at 80% 40%, rgb(40 200 100 / 8%), transparent 40%);
	border: 1px solid rgb(255 255 255 / 2%);
	border-radius: 18px;
	box-shadow: 0 6px 20px rgb(0 0 0 / 60%);
}

.heroInner {
	display: flex;
	align-items: flex-end;
	height: 100%;
	padding: 12px;
}

.logoBadge {
	display: inline-flex;
	align-items: center;
	padding: 8px 12px;
	font-weight: 600;
	color: #ffffff;
	background: rgb(255 255 255 / 2%);
	border-radius: 999px;
	box-shadow: 0 2px 10px rgb(0 0 0 / 60%);
	gap: 8px;
}

.badgeIcon {
	padding: 2px 8px;
	font-weight: 700;
	color: #000000;
	background: linear-gradient(90deg, #ffffff 0%, #dddddd 100%);
	border-radius: 10px;
}

/* chips */
.chipsRow {
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	max-width: 420px;
	margin-top: 10px;
	gap: 8px;
}

.chip {
	padding: 6px 10px;
	font-size: 12px;
	background: rgb(255 255 255 / 2%);
	border: 1px solid rgb(255 255 255 / 2%);
	border-radius: 999px;
}

/* content scroll area */
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 420px;
	margin-top: 14px;
	gap: 12px;
}

/* section header */
.sectionHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 13px;
	color: #bdbdbd;
}

.headerActions {
	display: flex;
	gap: 6px;
}

.plus,
.dots {
	font-size: 18px;
	color: #aaaaaa;
	background: transparent;
	border: none;
	cursor: pointer;
}

/* card */
.card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px;
	background: linear-gradient(180deg, rgb(255 255 255 / 1%), rgb(255 255 255 / 0.5%));
	border: 1px solid rgb(255 255 255 / 3%);
	border-radius: 14px;
	box-shadow: 0 6px 18px rgb(0 0 0 / 60%);
}

.cardLeft {
	display: flex;
	align-items: center;
	gap: 12px;
}

.iconStub {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 36px;
	height: 36px;
	font-size: 18px;
	background: rgb(255 255 255 / 3%);
	border-radius: 10px;
}

.cardTitle {
	font-weight: 600;
}

/* chevron */
.chev {
	font-weight: 700;
	color: #9b9b9b;
}

/* accordion */
.accordion {
	overflow: hidden;
	border-radius: 14px;
}

.accordionHeader {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 14px;
}

.accordionBody {
	display: flex;
	flex-direction: column;
	margin-top: 8px;
	padding: 12px;
	background: linear-gradient(180deg, rgb(255 255 255 / 1%), rgb(255 255 255 / 0.5%));
	border: 1px solid rgb(255 255 255 / 2%);
	border-radius: 12px;
	gap: 8px;
}

.subItem {
	display: flex;
	align-items: center;
	padding: 8px;
	background: transparent;
	border-radius: 10px;
	gap: 12px;
}

.subIcon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 36px;
	height: 36px;
	background: rgb(255 255 255 / 1%);
	border-radius: 8px;
}

.subChev {
	margin-left: auto;
	color: #8f8f8f;
}

/* small header */
.smallHeader {
	font-size: 13px;
	color: #bdbdbd;
}

/* toast */
.toast {
	position: fixed;
	bottom: 86px;
	left: 50%;
	z-index: 40;
	width: calc(100% - 44px);
	max-width: 420px;
	transform: translateX(-50%);
}

.toastInner {
	display: flex;
	align-items: center;
	padding: 14px;
	background: linear-gradient(180deg, rgb(255 255 255 / 2%), rgb(255 255 255 / 1%));
	border: 1px solid rgb(80 200 150 / 12%);
	border-radius: 24px;
	box-shadow: 0 8px 30px rgb(0 0 0 / 60%);
	gap: 12px;
}

.toastIcon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 36px;
	height: 36px;
	background: rgb(80 200 150 / 12%);
	border-radius: 999px;
}

.toastBtn {
	margin-top: 6px;
	font-weight: 600;
	color: #e6f7ef;
	background: transparent;
	border: none;
	cursor: pointer;
}

.toastClose {
	margin-left: auto;
	font-size: 16px;
	color: #cfcfcf;
	background: transparent;
	border: none;
	cursor: pointer;
}

/* bottom nav */
.bottomNav {
	position: fixed;
	bottom: 0;
	left: 50%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 420px;
	padding: 8px 12px;
	box-shadow: 0 10px 30px rgb(0 0 0 / 80%);
	backdrop-filter: blur(20px);
	transform: translateX(-50%);
}


.navBtn {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 6px 8px;
	font-size: 12px;
	color: #9b9b9b;
	background: transparent;
	border: none;
	cursor: pointer;
	gap: 4px;
}

.navBtn .icon { font-size: 18px; }

.active {
	font-weight: 700;
	color: #eafef4;
}
</style>
