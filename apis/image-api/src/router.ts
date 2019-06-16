import * as Router from "koa-router";

import { join } from "path";
import { config } from "./config";
import { CustomContext } from "./Server";
import { rename, unlink } from "fs-extra";
import { v4 } from "uuid";
import { UserImage } from "../../main-api/src/database/models/Image";
import { throwApiError, authenticationMiddleware } from "server-lib";
import { HttpError, ErrorMessage } from "common-library";

export const router = new Router();

