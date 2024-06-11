import { Router } from "express";

import {
	getTickets,
	importTicket,
	updateTicket,
} from "../controllers/ticket.js";
import { authVerify } from "../middlewares/auth.js";
import { updateTicketRule } from "../validations/ticket.js";

const ticketRouter = Router();

ticketRouter.get("/all/type/:type/year/:year/month/:month", [
	authVerify,
	getTickets,
]);
ticketRouter.get("/import", [importTicket]);
ticketRouter.patch("/", [authVerify, updateTicketRule, updateTicket]);

export default ticketRouter;
