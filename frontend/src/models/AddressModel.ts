import { IAddressModel } from "../interfaces/models/IAddressModel";
import { action, observable } from "mobx";
import { IAddress } from "common-library";

export class AddressModel implements IAddressModel {

	@observable public street = "";
	@observable public city = "";
	@observable public zipCode = "";
	@observable public state?: string;
	@observable public countryCode = "SE";

	@action public fromJson(address: IAddress) : void {
		this.street = address.street;
		this.city = address.city;
		this.zipCode = address.zipCode;
		this.state = address.state;
		this.countryCode = address.countryCode;
	}

}