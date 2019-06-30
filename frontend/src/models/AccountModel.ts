import { IAccountModel } from "../interfaces/models/IAccountModel";
import { observable, action } from "mobx";
import { IUser } from "common-library";

export class AccountModel implements IAccountModel {

	@observable public firstName = "";
	@observable public lastName = "";
	@observable public birthDate = new Date();
	@observable public phoneNumber?: string;

	@action public fromJson(user: IUser) : void {
		this.firstName = user.firstName;
		this.lastName = user.lastName;
		this.birthDate = user.birthDate;
		this.phoneNumber = user.phoneNumber;
	}

}