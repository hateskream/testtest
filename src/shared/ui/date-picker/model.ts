import type { CalendarDay as VCalendarDay, Page as VPage } from 'v-calendar/dist/types/src/utils/page.d.ts';

export type DateSource = Date | string | number;

export interface ISimpleDateParts {
	year: number;
	month: number;
	day: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}

export type DatePickerDate = DateSource | Partial<ISimpleDateParts> | null;

export type DatePickerRangeObject = {
	start: Exclude<DatePickerDate, null>;
	end: Exclude<DatePickerDate, null>;
};

export type DatePickerModel = DatePickerDate | DatePickerRangeObject;

export enum DatePickerMaskKey {
	Title = 'title',
	Weekdays = 'weekdays',
	NavMonths = 'navMonths',
	Hours = 'hours',
	Input = 'input',
	InputDateTime = 'inputDateTime',
	InputDateTime24Hr = 'inputDateTime24hr',
	InputTime = 'inputTime',
	InputTime24Hr = 'inputTime24hr',
	DayPopover = 'dayPopover',
	Data = 'data',
	Model = 'model',
	ISO = 'iso',
}

export type DateView = 'daily' | 'weekly' | 'monthly';

export type Page = VPage;

export type CalendarDay = VCalendarDay;
