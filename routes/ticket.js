import { Router } from "express";
import { getTickets, importTicket } from "../controllers/ticket.js";
import { authVerify } from "../middlewares/auth.js";

const ticketRouter = Router();

ticketRouter.get("/all/type/:type/year/:year/month/:month", [authVerify, getTickets]);
ticketRouter.get("/import", [importTicket]);

export default ticketRouter;