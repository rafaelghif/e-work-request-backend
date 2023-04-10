import { Router } from "express";
import { authentication } from "../controllers/authentication.js";
import { authenticationRule } from "../validations/authentication.js";

const authenticationRouter = Router();

authenticationRouter.post("/", [authenticationRule, authentication]);

export default authenticationRouter;