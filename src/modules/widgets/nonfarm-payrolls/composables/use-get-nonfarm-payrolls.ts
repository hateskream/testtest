import {
	getNonfarmPayrolls,
	type IGetNonfarmPayrollsRequest,
} from '../api/get-nonfarm-payrolls';


export function useGetNonfarmPayrolls(req: IGetNonfarmPayrollsRequest) {
	return getNonfarmPayrolls(req);
}
