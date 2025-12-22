import type { MoveOptions, MoveTarget } from 'v-calendar/dist/types/src/use/calendar.d.ts';

export type VDatePickerComponent = {
	canMove(target: MoveTarget, opts?: Partial<MoveOptions>): boolean;
	canMoveBy(pages: number, opts?: Partial<MoveOptions>): boolean;
	move(target: MoveTarget, opts?: Partial<MoveOptions>): Promise<boolean>;
	moveBy(pages: number, opts?: Partial<MoveOptions>): Promise<boolean>;
	movePrev(): Promise<boolean>;
	moveNext(): Promise<boolean>;
	focusDate(date: Date, opts?: Partial<MoveOptions>): Promise<boolean>;
};

