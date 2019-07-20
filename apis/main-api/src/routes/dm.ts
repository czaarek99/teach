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
import { ConversationUser } from "../database/models/ConversationUser";

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
	DM_MAX_LENGTH,
	CONVERSATION_TITLE_MIN_LENGTH,
	CONVERSATION_TITLE_MAX_LENGTH
} from "common-library";

const router = Router();

function resolveConversation(convoUser: ConversationUser) : IConversation {

	const convo = convoUser.conversation;

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

	const [convoUsers, count] : [ConversationUser[], number] = await Promise.all([
		ConversationUser.findAll({
			where,
			limit: query.limit,
			offset: query.offset,
			order: [
				["updatedAt", "DESC"]
			],
			include: [
				{
					model: Conversation,
					include: [
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
								ProfilePicture,
							]
						},
						{
							model: Message
						}
					]
				}
			]
		}),
		ConversationUser.count({
			where
		})
	]);

	const resolved : IConversation[] = convoUsers.map(
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
			members: Joi.array().items(Joi.number().min(0)).required().max(10),
			firstMessage: Joi.string().optional().allow(""),
			title: Joi.string()
				.min(CONVERSATION_TITLE_MIN_LENGTH)
				.max(CONVERSATION_TITLE_MAX_LENGTH)
				.required(),
		},
		type: "json"
	}
}, async (context: CustomContext) => {

	const input = context.request.body as INewConversationInput;
	const userId = context.state.session.userId;

	const members = new Set<number>(input.members);
	members.add(userId);

	const users : User[] = await User.findAll<User>({
		where: {
			id: {
				[Op.in]: [...members]
			}
		},
		include: [
			Address,
			UserSetting,
			ProfilePicture
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

	const conversation : Conversation = await Conversation.create({
		title: input.title
	});

	const inserts : Partial<ConversationUser>[] = [];

	for(const member of members) {
		inserts.push({
			userId: member,
			conversationId: conversation.id
		})
	}

	await ConversationUser.bulkCreate(inserts);

	const messages : IMessage[] = [];

	if(input.firstMessage) {
		await Message.create({
			conversationId: conversation.id,
			content: input.firstMessage
		});

		messages.push({
			content: input.firstMessage,
			sendDate: new Date()
		})
	}

	const teachers = users.map(resolveTeacher);

	const output : IConversation = {
		id: conversation.id,
		members: teachers,
		title: input.title,
		messages,
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