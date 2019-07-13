import { IDMPageController } from "../../interfaces/controllers/pages/IDMPageController";
import { RootStore } from "../../stores/RootStore";
import { observable, action } from "mobx";

export class DMPageController implements IDMPageController {

	@observable private readonly rootStore: RootStore;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
	}

	@action
	public onNewDM() : void {

	}

}