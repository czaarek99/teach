import { ErrorState, ErrorModel } from "../../../validation";
import { ILoginModel } from "../../models";
import { LoadingButtonState } from "../../../components";
import { Route } from "../../Route";

export interface ILoginPageErrorState extends ErrorState {
	email: string[]
	password: string[]
}

export interface ILoginPageController {
	readonly model: ILoginModel
	readonly errorModel: ErrorModel<ILoginPageErrorState>
	readonly loading: boolean
	readonly errorMessage: string | null
	readonly loginButtonState: LoadingButtonState
	readonly isLoggedIn: boolean

	onKeyDown: (event: KeyboardEvent) => void
	goToRoute: (route: Route) => void
	onLogin: () => Promise<void>
	onChange: (key: keyof ILoginModel, value: string) => void
}