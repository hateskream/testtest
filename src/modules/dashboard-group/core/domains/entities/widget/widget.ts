
import { v4 as uuidv4 } from 'uuid';

import type { IPosition } from './position';
import type { ISize } from './size';
import { PresetWidget } from './widget-preset';
import type { WidgetType } from './widget-type';

export class Widget {
	private constructor(
		private readonly _id: string,
		private readonly _preset: PresetWidget,
		private _position: IPosition,
		private readonly _instanceId?: string,
		private readonly _config?: Record<string, unknown>,
	) {}

	get id(): string {
		return this._id;
	}

	get instanceId(): string | undefined {
		return this._instanceId;
	}

	get config(): Record<string, unknown> | undefined {
		return this._config;
	}

	get widgetType(): WidgetType {
		return this._preset.widgetType;
	}

	get name(): string {
		return this._preset.name;
	}

	get description(): string {
		return this._preset.description;
	}

	get position(): IPosition {
		return this._position;
	}

	set position(value: IPosition) {
		this._position = value;
	}

	get maxSize(): ISize {
		return this._preset.maxSize;
	}

	get minSize(): ISize {
		return this._preset.minSize;
	}

	static create(type: string, position: IPosition): Widget {
		const preset = PresetWidget.create(type);

		return new Widget(
			uuidv4(),
			preset,
			position,
		);
	}

	static createWithInstanceId(
		instanceId: string,
		type: string,
		position: IPosition,
		config?: Record<string, unknown>,
	): Widget {
		const preset = PresetWidget.create(type);

		return new Widget(
			uuidv4(),
			preset,
			position,
			instanceId,
			config,
		);
	}

	static rehydrate(
		id: string,
		type: string,
		position: IPosition,
		instanceId?: string,
		config?: Record<string, unknown>,
	): Widget {
		const preset = PresetWidget.create(type);

		return new Widget(
			id,
			preset,
			position,
			instanceId,
			config,
		);
	}
}
