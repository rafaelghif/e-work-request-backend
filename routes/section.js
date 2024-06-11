import { Router } from "express";

import {
	createSection,
	getActiveSectionByDepartment,
	getSectionByDepartment,
	getSections,
	inActiveSection,
	updateSection,
} from "../controllers/sections.js";
import { authVerify } from "../middlewares/auth.js";
import {
	createSectionRule,
	getActiveSectionByDepartmentRule,
	getSectionByDepartmentRule,
	inActiveSectionRule,
	updateSectionRule,
} from "../validations/section.js";

const sectionRouter = Router();

sectionRouter.get("/", [authVerify, getSections]);
sectionRouter.get("/departmentId/:departmentId", [
	authVerify,
	getSectionByDepartmentRule,
	getSectionByDepartment,
]);
sectionRouter.get("/active", [authVerify, getActiveSectionByDepartment]);
sectionRouter.get("/active/departmentId/:departmentId", [
	authVerify,
	getActiveSectionByDepartmentRule,
	getActiveSectionByDepartment,
]);
sectionRouter.post("/", [authVerify, createSectionRule, createSection]);
sectionRouter.patch("/", [authVerify, updateSectionRule, updateSection]);
sectionRouter.delete("/sectionId/:sectionId", [
	authVerify,
	inActiveSectionRule,
	inActiveSection,
]);

export default sectionRouter;
