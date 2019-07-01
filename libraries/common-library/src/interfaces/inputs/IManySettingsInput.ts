export interface IManySettingsInput {
	changes: {
		[key: string]: string | number | boolean | null
	}
}