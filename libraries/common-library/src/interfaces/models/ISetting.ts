export type SettingValue = boolean | string | number | null
export type SettingKey = "showEmail" | "showPhone"

interface IShowEmailSetting {
	key: "showEmail",
	value: boolean
}

interface IShowPhoneSetting {
	key: "showPhone",
	value: boolean
}

export type ISetting = IShowPhoneSetting | IShowEmailSetting;