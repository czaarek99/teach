import * as Router from "koa-joi-router";
import { Joi } from "koa-joi-router";
import { OFFSET_VALIDATOR } from "../validators";
import { CustomContext } from "../Server";
import { Message } from "../database/models/Message";
import { IDMListInput, IConversation, IMessage, ITeacher, IEdge } from "common-library";
import { User } from "../database/models/User";
import { Conversation } from "../database/models/Conversation";
import { Address } from "../database/models/Address";
import { UserSetting } from "../database/models/UserSetting";
import { ProfilePicture } from "../database/models/ProfilePicture";
import { resolveTeacher } from "../database/resolvers/resolveTeacher";
import { Op } from "sequelize";

const router = Router();

function resolveConversation(convo: Conversation) : IConversation {

	const messages : IMessage[] = convo.messages.map((message: Message) => {
		return {
			content: message.content,
			sendDate: message.createdAt
		}
	});

	const members : ITeacher[] = convo.members.map(resolveTeacher);

	return {
		members,
		messages,
		title: convo.title
	};

}

router.get("/list", {
	validate: {
		query: {
			limit: Joi.number().min(0).max(50).required(),
			offset: OFFSET_VALIDATOR,
		},
	}
}, async(context: CustomContext) => {

	const query = context.query as IDMListInput;

	const where = {
		userId: context.state.session.userId
	};

	const [conversations, count] : [Conversation[], number] = await Promise.all([
		Conversation.findAll({
			where,
			limit: query.limit,
			offset: query.offset,
			order: [
				["updatedAt", "DESC"]
			],
			include: [
				{
					model: Message,
					limit: 100,
					order: [
						["createdAt", "DESC"]
					]
				},
				{
					model: User,
					where: {
						id: {
							[Op.not]: context.state.session.userId
						}
					},
					include: [
						Address,
						UserSetting,
						ProfilePicture
					]
				}
			]
		}),
		Conversation.count({
			where
		})
	]);

	const resolved : IConversation[] = conversations.map(
		resolveConversation
	);

	const edge : IEdge<IConversation> = {
		totalCount: count,
		data: resolved
	};

	context.body = edge;
	context.status = 200;
});

export default router;