---
name: api-layer
description: How to write API functions in this project. Use when creating API calls, fetching data from backend, or working with HttpService.
---

# API Layer Pattern

API files live in `module/api/` and follow a strict pattern.

## File structure

```
api/
├── get-<resource>.ts    # One file per endpoint
└── index.ts             # Re-exports all API functions
```

## Standard API function pattern

```typescript
import { useHttpService } from "@/shared/service/http-service";
import { useLogger } from "@/shared/service/monitoring";
import { type IMyModel } from "../model";

const IS_USE_MOCK = false; // Toggle for mock data during development

// Raw DTO from backend (snake_case from API)
interface IMyResponse {
	data: {
		some_field: string;
		nested: {
			value: number;
		};
	};
}

// Request params interface (if needed)
interface IMyRequest {
	id: string;
	limit?: number;
}

export async function getMyData(req: IMyRequest): Promise<IMyModel> {
	const logger = useLogger();
	try {
		if (IS_USE_MOCK) return getMockData();

		const httpService = useHttpService();
		const response = await httpService.get<IMyResponse>("/api/v1/my-endpoint", {
			query: {
				id: req.id,
				limit: req.limit,
			},
		});

		return prepareResponse(response);
	} catch (error) {
		logger.error("Failed to get my data", { error: error as Error });
		throw error;
	}
}

function prepareResponse(response: IMyResponse): IMyModel {
	return {
		// map snake_case DTO → camelCase domain model
		someField: response.data.some_field,
		value: response.data.nested.value,
	};
}

// Mock for development
import { useFetchMock } from "@/shared/mock";
const { getMock } = useFetchMock<IMyModel>("/mock/widgets/my-widget.json");
async function getMockData(): Promise<IMyModel> {
	return getMock();
}
```

## Key rules

- `useHttpService()` must be called **inside** the try block or function body, not at module level
- `useLogger()` can be called at function level
- Always define raw DTO interfaces locally in the api file (not in model/)
- Domain interfaces (`IMyModel`) live in `model/` and are imported
- `prepareResponse()` maps DTO → domain model (snake_case → camelCase)
- `IS_USE_MOCK` flag at top of file for easy mock toggle
- Mock data via `useFetchMock` pointing to `/mock/widgets/<name>.json`
- index.ts re-exports: `export { getMyData } from './get-my-data';`
- Log errors with `logger.error()` before re-throwing
