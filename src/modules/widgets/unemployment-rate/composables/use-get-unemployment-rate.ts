import {
	getUnemploymentRate,
	type IGetUnemploymentRateRequest,
} from '../api/get-unemployment-rate.ts';


export function useGetUnemploymentRate(req: IGetUnemploymentRateRequest) {
	return getUnemploymentRate(req);
}
