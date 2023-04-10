import { Router } from "express";
import { createDepartment, getActiveDepartments, getDepartments, inActiveDepartment, updateDepartment } from "../controllers/department.js";
import { authVerify } from "../middlewares/auth.js";
import { createDepartmentRule, inActiveDepartmentRule, updateDepartmentRule } from "../validations/department.js";

const departmentRouter = Router();

departmentRouter.get("/", [authVerify, getDepartments]);
departmentRouter.get("/active", [authVerify, getActiveDepartments]);
departmentRouter.post("/", [authVerify, createDepartmentRule, createDepartment]);
departmentRouter.patch("/", [authVerify, updateDepartmentRule, updateDepartment]);
departmentRouter.delete("/departmentId/:departmentId", [authVerify, inActiveDepartmentRule, inActiveDepartment]);

export default departmentRouter;