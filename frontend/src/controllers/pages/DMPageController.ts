import { IDMPageController } from "../../interfaces/controllers/pages/IDMPageController";
import { RootStore } from "../../stores/RootStore";
import { observable, action } from "mobx";
import { requireLogin } from "../../util/requireLogin";
import { IConversation } from "common-library";
import { DMEditorController } from "../DMEditorController";

export class DMPageController implements IDMPageController {

	@observable private readonly rootStore: RootStore;
	@observable public readonly dmsPerPage = 20;
	@observable public pageNumber = 0;
	@observable public dmCount = 0;
	@observable public convos: IConversation[] = []
	@observable public selectedConvo?: IConversation;
	@observable public editorController : DMEditorController;

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		this.editorController = new DMEditorController(rootStore);

		this.load();
	}

	@action
	private async load() : Promise<void> {
		const isLoggedIn = await requireLogin(this.rootStore);

		if(!isLoggedIn) {
			return;
		}

		const dms = await this.rootStore.services.dmService.getDMS({
			offset: 0,
			limit: 0
		});

		this.dmCount = dms.totalCount;

		const offset = this.pageNumber * this.dmsPerPage;
		const amountToLoad = Math.min(this.dmCount - offset, this.dmsPerPage)

		const convos = await this.rootStore.services.dmService.getDMS({
			offset,
			limit: amountToLoad
		});

		this.convos = convos.data;
	}

	@action
	public onNewDM() : void {
		this.editorController = new DMEditorController(this.rootStore);
	}

	@action
	public selectConvo(convo: IConversation) : void {
		this.selectedConvo = convo;

		this.editorController = new DMEditorController(this.rootStore, convo);
	}

}