import type { Time } from 'lightweight-charts';
import { differenceInSeconds, fromUnixTime } from 'date-fns';


export function groupSeriesByRange<T extends { time: Time }>(data: T[], diffInSec: number): T[] {
	if (diffInSec === -1) {
		return data;
	}

	return data.reduce((acc, item) => {
		if (
			differenceInSeconds(fromUnixTime(+item.time), fromUnixTime(+acc[acc.length - 1].time)) >= diffInSec
		) {
			return acc.concat([item]);
		}

		return acc;

	}, [data[0]]);
}
