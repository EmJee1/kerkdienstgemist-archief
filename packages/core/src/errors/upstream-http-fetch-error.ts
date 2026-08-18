export type UpstreamHttpFetchError =
	| { kind: 'network'; cause: unknown }
	| { kind: 'httpStatus'; status: number; responseBody?: string }
	| { kind: 'decode'; cause: unknown }
	| { kind: 'parse'; cause: unknown }
