import { Router } from "express";
import { importTicket } from "../controllers/ticket.js";

const ticketRouter = Router();

ticketRouter.get("/", [importTicket]);

export default ticketRouter;