import { Router } from "express";
import { createUser, getPics, getUsers, inActiveUser, updateUser } from "../controllers/user.js";
import { authVerify } from "../middlewares/auth.js";
import { createUserRule, inActiveUserRule, updateUserRule } from "../validations/user.js";

const userRouter = Router();

userRouter.get("/", [authVerify, getUsers]);
userRouter.get("/pic", [authVerify, getPics]);
userRouter.post("/", [authVerify, createUserRule, createUser]);
userRouter.patch("/", [authVerify, updateUserRule, updateUser]);
userRouter.delete("/userId/:userId", [authVerify, inActiveUserRule, inActiveUser]);

export default userRouter;