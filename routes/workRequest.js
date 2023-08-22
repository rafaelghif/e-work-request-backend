import { Router } from "express";
import multer from "multer";
import { assignTicket, createWorkRequest, getTicketNumber, getTicketRequest, getTicketRequestCount, getWorkRequest, getWorkRequestComment, getWorkRequestCount, getWorkRequestDepartment, getWorkRequestMonth, getWorkRequestReceive, getWorkRequestReceiveCount, getWorkRequests, getWorkRequestType, getWorkRequestYear, headActionTicket, picActionTicket, receiveTicket, sendBackToAssignee, updateWorkRequest } from "../controllers/workRequest.js";
import { authVerify } from "../middlewares/auth.js";
import { assignTicketRule, createWorkRequestRule, updateWorkRequestRule, getWorkRequestCommentRule, headActionTicketRule, picActionTicketRule, receiveTicketRule, sendBackToAssigneeRule } from "../validations/workRequest.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/files");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const fileNameArr = file.originalname.split(".");
        const ext = fileNameArr[fileNameArr.length - 1].toLowerCase();
        let allowExt = ["png", "jpg", "jpeg", "pdf", "zip", "xlsx", "xls", "txt", "csv", "docx"];

        if (!allowExt.includes(ext)) {
            return cb(new Error("Extension Not Allowed!"));
        }

        cb(null, `file-${uniqueSuffix}.${ext}`);
    }
});

const upload = multer({ storage: storage });

const workRequestRouter = Router();

workRequestRouter.get("/year", [authVerify, getWorkRequestYear]);
workRequestRouter.get("/month", [authVerify, getWorkRequestMonth]);
workRequestRouter.get("/type", [authVerify, getWorkRequestType]);
workRequestRouter.get("/department", [authVerify, getWorkRequestDepartment]);
workRequestRouter.get("/all/ticketStatus/:ticketStatus/type/:type/department/:department/year/:year/month/:month", [authVerify, getWorkRequests]);
workRequestRouter.get("/comment/ticketId/:TicketId", [authVerify, getWorkRequestCommentRule, getWorkRequestComment]);
workRequestRouter.get("/ticket-number", [authVerify, getTicketNumber]);
workRequestRouter.get("/", [authVerify, getWorkRequest]);
workRequestRouter.get("/count", [authVerify, getWorkRequestCount]);
workRequestRouter.get("/ticket-request", [authVerify, getTicketRequest]);
workRequestRouter.get("/ticket-request/count", [authVerify, getTicketRequestCount]);
workRequestRouter.get("/receive", [authVerify, getWorkRequestReceive]);
workRequestRouter.get("/count-receive", [authVerify, getWorkRequestReceiveCount]);
workRequestRouter.post("/create", [authVerify, upload.single("attachmentFile"), createWorkRequestRule, createWorkRequest]);
workRequestRouter.patch("/update", [authVerify, upload.single("attachmentFile"), updateWorkRequestRule, updateWorkRequest]);
workRequestRouter.patch("/head-action", [authVerify, headActionTicketRule, headActionTicket]);
workRequestRouter.patch("/assign", [authVerify, assignTicketRule, assignTicket]);
workRequestRouter.patch("/pic-action", [authVerify, picActionTicketRule, picActionTicket]);
workRequestRouter.patch("/receive", [authVerify, receiveTicketRule, receiveTicket]);
workRequestRouter.patch("/sendBack", [authVerify, sendBackToAssigneeRule, sendBackToAssignee]);

export default workRequestRouter;