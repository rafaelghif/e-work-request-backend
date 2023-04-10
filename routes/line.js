import { Router } from "express";
import { createLine, getActiveLine, getActiveLineByDepartment, getLines, inActiveLine, updateLine } from "../controllers/line.js";
import { authVerify } from "../middlewares/auth.js";
import { createLineRule, getActiveLineByDepartmentRule, inActiveLineRule, updateLineRule } from "../validations/line.js";

const lineRouter = Router();

lineRouter.get("/", [authVerify, getLines]);
lineRouter.get("/active", [authVerify, getActiveLine]);
lineRouter.get("/active/departmentId/:departmentId", [authVerify, getActiveLineByDepartmentRule, getActiveLineByDepartment]);
lineRouter.post("/", [authVerify, createLineRule, createLine]);
lineRouter.patch("/", [authVerify, updateLineRule, updateLine]);
lineRouter.delete("/lineId/:lineId", [authVerify, inActiveLineRule, inActiveLine]);

export default lineRouter;