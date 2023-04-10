import { body, param } from "express-validator";

export const createWorkRequestRule = [
    body("title").not().isEmpty().withMessage("Title Cannot Be Null!"),
    body("description").not().isEmpty().withMessage("Description Cannot Be Null!"),
    body("jigToolNo").not().isEmpty().withMessage("Jig Toll No Cannot Be Null!"),
    body("qty").not().isEmpty().withMessage("Qty Cannot Be Null!").toInt(),
    body("expectDueDate").not().isEmpty().withMessage("Expect Due Date Cannot Be Null!"),
    body("RequesterDepartmentId").not().isEmpty().withMessage("RequesterDepartmentId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid RequesterDepartmentId"),
    body("AssigneeDepartmentIds").not().isEmpty().withMessage("RequesterDepartmentId Cannot Be Null!")
        .isArray().withMessage("Invalid AssigneeDepartmentIds"),
    body("RegistrationNumberId").not().isEmpty().withMessage("RegistrationNumberId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid RegistrationNumberId"),
];

export const assignTicketRule = [
    body("id").not().isEmpty().withMessage("WorkRequestId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid WorkRequestId"),
    body("ticketAssigneeId").not().isEmpty().withMessage("TicketAssigneeId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid WorkRequestId"),
    body("ticketStatus").not().isEmpty().withMessage("ticketStatus Cannot Be Null!"),
];

export const picActionTicketRule = [
    body("id").not().isEmpty().withMessage("WorkRequestId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid WorkRequestId"),
    body("ticketAssigneeId").not().isEmpty().withMessage("TicketAssigneeId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid WorkRequestId"),
    body("ticketStatus").not().isEmpty().withMessage("ticketStatus Cannot Be Null!"),
];

export const receiveTicketRule = [
    body("id").not().isEmpty().withMessage("WorkRequestId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid WorkRequestId"),
];

export const getWorkRequestCommentRule = [
    param("TicketId").not().isEmpty().withMessage("WorkRequestId Cannot Be Null!")
        .isUUID("4").withMessage("Invalid WorkRequestId"),
]