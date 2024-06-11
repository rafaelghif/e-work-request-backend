import { Router } from "express";

import authenticationRouter from "./authentication.js";
import dashboardRouter from "./dashboard.js";
import departmentRouter from "./department.js";
import ledgerJigRouter from "./ledger-jig.js";
import lineRouter from "./line.js";
import registrationNumberRouter from "./registrationNumber.js";
import sectionRouter from "./section.js";
import ticketRouter from "./ticket.js";
import userRouter from "./user.js";
import workRequestRouter from "./workRequest.js";

const router = Router();

router.use("/authentication", [authenticationRouter]);
router.use("/user", [userRouter]);
router.use("/department", [departmentRouter]);
router.use("/section", [sectionRouter]);
router.use("/line", [lineRouter]);
router.use("/registration-number", [registrationNumberRouter]);
router.use("/work-request", [workRequestRouter]);
router.use("/ticket", [ticketRouter]);
router.use("/dashboard", [dashboardRouter]);
router.use("/ledger-jig", [ledgerJigRouter]);

export default router;
