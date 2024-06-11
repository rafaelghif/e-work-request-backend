import { Router } from "express";

import {
	createRegistrationNumber,
	getActiveRegistrationNumbers,
	getRegistrationNumbers,
	inActiveRegistrationNumber,
	updateRegistrationNumber,
} from "../controllers/registrationNumber.js";
import { authVerify } from "../middlewares/auth.js";
import {
	createRegistrationNumberRule,
	inActiveRegistrationNumberRule,
	updateRegistrationNumberRule,
} from "../validations/registrationNumber.js";

const registrationNumberRouter = Router();

registrationNumberRouter.get("/", [authVerify, getRegistrationNumbers]);
registrationNumberRouter.get("/active", [
	authVerify,
	getActiveRegistrationNumbers,
]);
registrationNumberRouter.post("/", [
	authVerify,
	createRegistrationNumberRule,
	createRegistrationNumber,
]);
registrationNumberRouter.patch("/", [
	authVerify,
	updateRegistrationNumberRule,
	updateRegistrationNumber,
]);
registrationNumberRouter.delete("/registrationNumberId/:registrationNumberId", [
	authVerify,
	inActiveRegistrationNumberRule,
	inActiveRegistrationNumber,
]);

export default registrationNumberRouter;
