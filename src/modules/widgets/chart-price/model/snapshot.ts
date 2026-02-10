import logoRaw from '@/assets/icons/logo.svg?raw';
import { useLogger } from '@/shared/service/monitoring';

function drawTextWrapped(
	ctx: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	lineHeight: number,
) {
	const words = text.split(' ');
	let line = '';
	let startY = y;

	for (let n = 0; n < words.length; n++) {
		const testLine = line + (line ? ' ' : '') + words[n];
		const metrics = ctx.measureText(testLine);
		const testWidth = metrics.width;

		if (testWidth > maxWidth && line) {
			ctx.fillText(line, x, startY);
			line = words[n];
			startY += lineHeight;
		} else {
			line = testLine;
		}
	}

	if (line) {
		ctx.fillText(line, x, startY);
		startY += lineHeight;
	}

	return startY - y;
}

function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
) {
	const r = Math.min(radius, width / 2, height / 2);

	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + width - r, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + r);
	ctx.lineTo(x + width, y + height - r);
	ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
	ctx.lineTo(x + r, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
}

const HEADER_HEIGHT = 60;

function drawHeader(context: CanvasRenderingContext2D, ticker: string) {
	const formattedDate = (new Date).toUTCString();
	let textHeight = 0;

	context.fillStyle = '#000';
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	context.font = '14px Roboto Flex Variable';
	context.fillStyle = '#fff';
	textHeight += drawTextWrapped(context, ticker, 10, 20, context.canvas.width, 16);

	textHeight += 10;

	context.font = '12px Roboto Flex Variable';
	context.fillStyle = '#ddd';
	textHeight += drawTextWrapped(
		context,
		`Created with i88.planet9.uk, ${formattedDate}`,
		10,
		textHeight + 14,
		context.canvas.width,
		14,
	);

	return textHeight;
}

const FOOTER_HEIGHT = 80;

async function drawFooter(context: CanvasRenderingContext2D, y: number) {
	return new Promise(resolve => {
		try {
			const coloredSvg = (logoRaw as string).replace('<svg', '<svg fill="#fff"');

			const svgImage = new Image();

			svgImage.onload = () => {
				context.drawImage(svgImage, 10, y, 160, 48);
				resolve(true);
			};

			svgImage.onerror = () => {
				resolve(true);
			};

			svgImage.src = `data:image/svg+xml;base64,${btoa(coloredSvg)}`;
		} catch (error) {
			const logger = useLogger();
			logger.error('Snapshot footer draw Error', { error: error as Error });

			resolve(true);
		}
	});
}

const CHART_PADDING = 10;
const CHART_BORDER_RADIUS = 12;
const GAP = 10;

export async function createTickerSnapshot(chartCanvas: HTMLCanvasElement, ticker: string) {
	const finalCanvas = document.createElement('canvas');
	finalCanvas.width = chartCanvas.width + CHART_PADDING * 2 + GAP;
	finalCanvas.height = chartCanvas.height + HEADER_HEIGHT + FOOTER_HEIGHT;

	const context = finalCanvas.getContext('2d')!;

	context.fillStyle = '#000';
	context.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

	const headerHeight = drawHeader(context, ticker);

	context.drawImage(
		chartCanvas,
		CHART_PADDING + 5,
		headerHeight + CHART_PADDING + GAP,
		chartCanvas.width,
		chartCanvas.height,
	);

	const borderWidth = 1;

	context.lineWidth = borderWidth;
	context.strokeStyle = '#1d1d1e';

	drawRoundedRect(
		context,
		5 + borderWidth / 2,
		headerHeight + GAP + borderWidth / 2,
		CHART_PADDING * 2 + chartCanvas.width - borderWidth,
		chartCanvas.height + CHART_PADDING * 2 - borderWidth,
		CHART_BORDER_RADIUS,
	);

	context.stroke();

	await drawFooter(context, headerHeight + chartCanvas.height + CHART_PADDING * 2 + GAP * 2);

	return finalCanvas;
}
