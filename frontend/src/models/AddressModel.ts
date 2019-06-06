import { observable } from "mobx";
import { IAddressModel } from "../interfaces/models/IAddressModel";

export class AddressModel implements IAddressModel {

	@observable public street = "";
	@observable public zipCode = "";
	@observable public city = "";
	@observable public countryCode = "se";
	@observable public state = "";

	public toJson() : IAddressModel {
		return {
			street: this.street,
			zipCode: this.zipCode,
			city: this.city,
			countryCode: this.countryCode,
			state: this.state
		}
	}

}