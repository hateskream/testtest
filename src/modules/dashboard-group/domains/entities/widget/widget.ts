
import { v4 as uuidv4 } from 'uuid';

import type { IPosition } from './position';
import type { ISize } from './size';
import { PresetWidget } from './widget-preset';
import type { WidgetType } from './widget-type';

export class Widget {
	private constructor(
		private _id: string,
		private _widgetType: WidgetType,
		private _name: string,
		private _description: string,
		private _position: IPosition,
		private _maxSize: ISize,
		private _minSize: ISize,
		private _size: ISize,
	) {}

	get id(): string {
		return this._id;
	}

	get widgetType(): WidgetType {
		return this._widgetType;
	}

	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get position(): IPosition {
		return this._position;
	}

	set position(value: IPosition) {
		this._position = value;
	}

	get maxSize(): ISize {
		return this._maxSize;
	}

	get minSize(): ISize {
		return this._minSize;
	}

	get size(): ISize {
		return this._size;
	}

	static create(type: string, position: IPosition): Widget {
		const preset = PresetWidget.create(type, position);

		return Widget.createFromPreset(preset);
	}

	static createFromPreset(preset: PresetWidget): Widget {
		return new Widget(
			uuidv4(),
			preset.widgetType,
			preset.name,
			preset.description,
			preset.position,
			preset.maxSize,
			preset.minSize,
			preset.defaultSize,
		);
	}

	static createFromPresets(presets: PresetWidget[]): Widget[] {
		return presets.map((preset) => Widget.createFromPreset(preset));
	}

	static rehydrate(
		id: string,
		type: string,
		position: IPosition,
		size: ISize,
	): Widget {
		const preset = PresetWidget.create(type, position);

		return new Widget(
			id,
			preset.widgetType,
			preset.name,
			preset.description,
			preset.position,
			preset.maxSize,
			preset.minSize,
			size,
		);
	}
}
