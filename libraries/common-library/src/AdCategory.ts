export enum AdCategory {
	NONE = "category.none",

	COMPUTER_SCIENCE = "category.computerScience",
	PROGRAMMING = "category.computerScience.programming",
	HACKING = "category.computerScience.hacking",

	MUSIC = "category.music",
	MUSIC_PRODUCTION = "category.music.musicProduction",
	INSTRUMENTS = "category.music.instruments",

	SCIENCE = "category.science",
	PHYSICS = "category.science.physics",
	MATH = "category.science.math",

	LANGUAGE = "category.language",
}

export interface IAdCategoryMapping {
	parent: AdCategory
	children?: AdCategory[]
}

export const CATEGORY_MAP : IAdCategoryMapping[] = [
	{
		parent: AdCategory.NONE
	},
	{
		parent: AdCategory.COMPUTER_SCIENCE,
		children: [
			AdCategory.PROGRAMMING,
			AdCategory.HACKING
		]
	},
	{
		parent: AdCategory.MUSIC,
		children: [
			AdCategory.MUSIC_PRODUCTION,
			AdCategory.INSTRUMENTS
		]
	},
	{
		parent: AdCategory.SCIENCE,
		children: [
			AdCategory.PHYSICS,
			AdCategory.MATH
		]
	},
	{
		parent: AdCategory.LANGUAGE,
	}
]