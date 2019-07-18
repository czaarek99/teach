import { action, observable } from "mobx";
import { IAddress } from "common-library";
import { IAddressModel } from "../interfaces";

export class AddressModel implements IAddressModel {

	@observable public street = "";
	@observable public city = "";
	@observable public zipCode = "";
	@observable public state = "";
	@observable public countryCode = "SE";

	@action public fromJson(address: IAddress) : void {
		this.street = address.street;
		this.city = address.city;
		this.zipCode = address.zipCode;
		this.countryCode = address.countryCode;

		if(address.state) {
			this.state = address.state;
		} else {
			this.state = "";
		}
	}

	public toInput() : IAddress {
		return {
			street: this.street,
			city: this.city,
			zipCode: this.zipCode,
			state: this.state,
			countryCode: this.countryCode
		}
	}

}