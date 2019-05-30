import * as Koa from "koa";
import * as Router from "koa-joi-router";
import * as bcrypt from "bcrypt";
import { Joi } from "koa-joi-router";
import { User } from "../database/models/User";
import { CustomContext } from "../Server";
import { HttpError } from "../util/HttpError";

const router = Router();

const SALT_ROUNDS = 10;

router.post("/register", {
    validate: {
        body: {
            email: Joi.string().email(),
            password: Joi.string().min(10),
            firstName: Joi.string().min(1).max(200),
            lastName: Joi.string().min(1).max(200)
        },
        type: "json"
    }
}, async (context: CustomContext) => {

    const body = context.request.body;

    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

    const user = await User.create({
        email: body.email,
        password: hashedPassword,
        firstName: body.firstName,
        lastName: body.lastName
    });

    context.session.userId = user.id;
    context.status = 200;

    context.state.logger.userInfo(user.id, "Just registered");
});

function throwNoSuchUserError() {
    throw new HttpError(404, "error.usernotfound")
}

router.post("/login", {
    validate: {
        body: {
            email: Joi.string(),
            password: Joi.string()
        },
        type: "json"
    }
}, async (context: CustomContext) => {

    const body = context.request.body;

    const user = await User.findOne({
        where: {
            email: body.email
        }
    });

    if(!user) {
        throwNoSuchUserError();
    }

    const isPasswordValid = await bcrypt.compare(body.password, user.password);

    if(!isPasswordValid) {
        throwNoSuchUserError();
    }

    context.session.userId = user.id;
    context.status = 200;

    context.state.logger.userInfo(user.id, "Logged in");
});

export default router;