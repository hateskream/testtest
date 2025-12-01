import {
	getUnemploymentRate,
	type IGetUnemploymentRateRequest,
} from '@/modules/widgets/unemployment-rate/api/get-unemployment-rate.ts';


export function useGetUnemploymentRate(req: IGetUnemploymentRateRequest) {
	return getUnemploymentRate(req);
}
