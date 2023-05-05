import { Router } from "express";
import authenticationRouter from "./authentication.js";
import departmentRouter from "./department.js";
import lineRouter from "./line.js";
import registrationNumberRouter from "./registrationNumber.js";
import sectionRouter from "./section.js";
import userRouter from "./user.js";
import workRequestRouter from "./workRequest.js";
import ticketRouter from "./ticket.js";

const router = Router();

router.use("/authentication", [authenticationRouter]);
router.use("/user", [userRouter]);
router.use("/department", [departmentRouter]);
router.use("/section", [sectionRouter]);
router.use("/line", [lineRouter]);
router.use("/registration-number", [registrationNumberRouter]);
router.use("/work-request", [workRequestRouter]);
router.use("/ticket", [ticketRouter]);

export default router;