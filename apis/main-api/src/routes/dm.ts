import * as Router from "koa-joi-router";
import { Joi } from "koa-joi-router";
import { OFFSET_VALIDATOR } from "../validators";
import { CustomContext } from "../Server";
import { Message } from "../database/models/Message";
import { User } from "../database/models/User";
import { Conversation } from "../database/models/Conversation";
import { Address } from "../database/models/Address";
import { UserSetting } from "../database/models/UserSetting";
import { ProfilePicture } from "../database/models/ProfilePicture";
import { resolveTeacher } from "../database/resolvers/resolveTeacher";
import { Op } from "sequelize";
import { throwApiError } from "server-lib";

import {
	IDMListInput,
	IConversation,
	IMessage,
	ITeacher,
	IEdge,
	INewConversationInput,
	HttpError,
	ErrorMessage,
	INewDMInput,
	DM_MAX_LENGTH
} from "common-library";

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
		id: convo.id,
		members,
		messages,
		title: convo.title
	};

}

function throwConversationNotFound(context: CustomContext) : void {
	throwApiError(
		context,
		new HttpError(
			400,
			ErrorMessage.CONVERSATION_NOT_FOUND,
			context.state.requestId
		)
	);
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

router.put("/convo", {
	validate: {
		body: {
			members: Joi.array().only(Joi.number().min(0)).required().max(10)
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const input = context.request.body as INewConversationInput;
	const conversation : Conversation = await Conversation.create({
		title: input.title
	});

	const userId = context.state.session.userId;
	const members: number[] = [...input.members, userId];

	const users : User[] = await User.findAll<User>({
		where: {
			id: {
				[Op.in]: members
			}
		},
		include: [
			{
				model: User,
				include: [
					Address,
					UserSetting,
					ProfilePicture
				]
			}
		]
	});

	if(users.length === 0) {
		throwApiError(
			context,
			new HttpError(
				404,
				ErrorMessage.USER_NOT_FOUND,
				context.state.requestId
			)
		);
	}

	await conversation.$add("userId", users);

	const teachers = users.map(resolveTeacher);

	const output : IConversation = {
		id: conversation.id,
		members: teachers,
		messages: [],
		title: input.title
	}

	context.body = output;
	context.status = 200;
});

router.patch("", {
	validate: {
		body: {
			message: Joi.string().min(1).max(DM_MAX_LENGTH).required(),
			conversationId: Joi.number().min(0).required()
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const input : INewDMInput = context.request.body;

	const convo : Conversation = await Conversation.findOne<Conversation>({
		where: {
			id: input.conversationId
		},
		include: [
			User
		]
	});

	if(!convo) {
		throwConversationNotFound(context);
		return;
	}

	let isMember = false;
	for(const member of convo.members) {
		if(member.id === context.state.session.userId) {
			isMember = true;
			break;
		}
	}

	if(!isMember) {
		throwConversationNotFound(context);
		return;
	}

	await Message.create({
		converationId: convo.id,
		content: input.message
	});

	context.status = 200;
});

export default router;