import { body, param } from "express-validator";

export const createWorkRequestRule = [
	body("description").notEmpty().withMessage("Description Cannot Be Null!"),
	body("jigToolNo").notEmpty().withMessage("Jig Toll No Cannot Be Null!"),
	body("qty").notEmpty().withMessage("Qty Cannot Be Null!").toInt(),
	body("expectDueDate")
		.notEmpty()
		.withMessage("Expect Due Date Cannot Be Null!"),
	body("RequesterDepartmentId")
		.notEmpty()
		.withMessage("RequesterDepartmentId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid RequesterDepartmentId"),
	body("AssigneeDepartmentIds")
		.notEmpty()
		.withMessage("AssigneeDepartmentId Cannot Be Null!")
		.isArray()
		.withMessage("Invalid AssigneeDepartmentIds"),
	body("RegistrationNumberId")
		.notEmpty()
		.withMessage("RegistrationNumberId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid RegistrationNumberId"),
];

export const headActionTicketRule = [
	body("id")
		.notEmpty()
		.withMessage("WorkRequestId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
	body("type").notEmpty().withMessage("Type cannot Be Null"),
];

export const assignTicketRule = [
	body("id")
		.notEmpty()
		.withMessage("WorkRequestId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
	body("ticketAssigneeId")
		.notEmpty()
		.withMessage("TicketAssigneeId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
	body("ticketStatus").notEmpty().withMessage("ticketStatus Cannot Be Null!"),
];

export const picActionTicketRule = [
	body("id")
		.notEmpty()
		.withMessage("WorkRequestId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
	body("ticketAssigneeId")
		.notEmpty()
		.withMessage("TicketAssigneeId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
	body("ticketStatus").notEmpty().withMessage("ticketStatus Cannot Be Null!"),
];

export const receiveTicketRule = [
	body("id")
		.notEmpty()
		.withMessage("WorkRequestId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
];

export const getWorkRequestCommentRule = [
	param("TicketId")
		.notEmpty()
		.withMessage("WorkRequestId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
];

export const updateWorkRequestRule = [
	body("id")
		.notEmpty()
		.withMessage("WorkRequestId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid WorkRequestId"),
	body("description").notEmpty().withMessage("Description Cannot Be Null!"),
	body("jigToolNo").notEmpty().withMessage("Jig Toll No Cannot Be Null!"),
	body("qty").notEmpty().withMessage("Qty Cannot Be Null!").toInt(),
	body("expectDueDate")
		.notEmpty()
		.withMessage("Expect Due Date Cannot Be Null!"),
];

export const sendBackToAssigneeRule = [
	body("ticketId")
		.notEmpty()
		.withMessage("TicketId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid TicketId"),
	body("remark").notEmpty().withMessage("Remark Cannot Be Null!"),
	body("ticketAssigneeIds")
		.notEmpty()
		.withMessage("TicketAssigneeIds Cannot Be Null!")
		.isArray()
		.withMessage("Invalid TicketAssigneeIds"),
];

export const cancelWorkRequestRule = [
	body("ticketId")
		.notEmpty()
		.withMessage("TicketId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid TicketId"),
];

export const progressWorkRequestRule = [
	body("ticketId")
		.notEmpty()
		.withMessage("TicketId Cannot Be Null!")
		.isUUID("4")
		.withMessage("Invalid TicketId"),
];
