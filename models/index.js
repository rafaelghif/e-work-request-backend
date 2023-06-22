import { QueryTypes } from "sequelize";
import connectionDatabase from "../configs/database.js";
import Comment from "./comment.js";
import Department from "./department.js";
import Line from "./line.js";
import RegistrationNumber from "./registrationNumber.js";
import Section from "./section.js";
import Ticket from "./ticket.js";
import TicketAssignee from "./ticketAssignee.js";
import TicketOld from "./ticketOld.js";
import User from "./user.js";

const models = {}

models.Department = Department;
models.Section = Section;
models.User = User;
models.Line = Line;
models.RegistrationNumber = RegistrationNumber;
models.Ticket = Ticket;
models.TicketAssignee = TicketAssignee;
models.Comment = Comment;
models.TicketOld = TicketOld;

// connectionDatabase.sync({ force: true }).then(async () => {
//     const responseDepartment = await models.Department.create({
//         name: "Process Engineer Department",
//         abbreviation: "PED",
//         createdBy: "40703191",
//         updatedBy: "40703191"
//     });

//     const responseSection = await models.Section.bulkCreate([{
//         name: "Division Head",
//         level: 0,
//         createdBy: "40703191",
//         updatedBy: "40703191",
//         DepartmentId: responseDepartment.id
//     }, {
//         name: "IT Programmer",
//         level: 0,
//         createdBy: "40703191",
//         updatedBy: "40703191",
//         DepartmentId: responseDepartment.id
//     }]);

//     await models.User.create({
//         badgeId: "40703191",
//         password: "abcd1234;",
//         name: "Muhammad Rafael Ghifari",
//         email: "Muhammad.Rafael@yokogawa.com",
//         role: "SUPER USER",
//         DepartmentId: responseDepartment.id,
//         SectionId: responseSection[1].id,
//         createdBy: "40703191",
//         updatedBy: "40703191",
//     });

//     await connectionDatabase.query(`
//         CREATE OR REPLACE VIEW v_backlog_by_department AS 
//         SELECT 
//             d.id AS DepartmentId, 
//             d.abbreviation, 
//             ta.status, 
//             t.expectDueDate 
//         FROM 
//             tickets AS t 
//         JOIN ticketassignees AS ta 
//         ON 
//             t.id = ta.TicketId 
//         JOIN departments AS d 
//         ON 
//             ta.AssigneeDepartmentId = d.id 
//         WHERE 
//             ta.status IN('Open', 'Pending', 'Progress') 
//             AND t.expectDueDate <= CURDATE() 
//         ORDER BY 
//             t.expectDueDate
//         ASC;`, {
//         type: QueryTypes.RAW
//     });

//     await connectionDatabase.query(`
//         CREATE OR REPLACE VIEW v_ticket AS
//         SELECT
//             t.id AS ticketId,
//             t.RegistrationNumberId AS registrationNumberId,
//             r.format AS registrationNumberFormat,
//             ta.AssigneeDepartmentId AS assigneeDepartmentId,
//             t.ticketNumber AS ticketNumber,
//             t.workNumber AS workNumber,
//             t.description AS description,
//             t.jigToolNo AS jigToolNo,
//             t.qty AS qty,
//             t.expectDueDate AS expectDueDate,
//             d.name AS requesterDepartment,
//             t.ticketStatus AS ticketStatus,
//             ta.status AS assigneeStatus
//         FROM
//             tickets as t
//         JOIN ticketassignees AS ta
//         ON 
//             t.id = ta.TicketId
//         JOIN departments AS d
//         ON 
//             t.RequesterDepartmentId = d.id
//         JOIN registrationnumbers AS r
//         ON
//             t.RegistrationNumberId = r.id
//         ORDER BY
//             expectDueDate ASC;`, {
//         type: QueryTypes.RAW
//     });

//     await connectionDatabase.query(`
//         CREATE OR REPLACE VIEW v_backlog_by_registration_number AS
//         SELECT
//             r.id AS registrationNumberId,
//             r.format AS registrationNumberFormat,
//             ta.status,
//             t.expectDueDate
//         FROM
//             tickets AS t
//         JOIN ticketassignees AS ta
//         ON
//             t.id = ta.TicketId
//         JOIN registrationnumbers AS r
//         ON
//             t.RegistrationNumberId = r.id
//         WHERE
//             ta.status IN('Open', 'Pending', 'Progress') AND t.expectDueDate <= CURDATE()
//         ORDER BY
//             t.expectDueDate
//         ASC;`, {
//         type: QueryTypes.RAW
//     });

// });

connectionDatabase.sync();

/**
 * Database Relation
 */
models.Department.hasMany(models.Section);
models.Section.belongsTo(models.Department);

models.Department.hasMany(models.User);
models.User.belongsTo(models.Department);

models.Section.hasMany(models.User);
models.User.belongsTo(models.Section);

models.Line.hasMany(models.User);
models.User.belongsTo(models.Line);

models.Department.hasMany(models.Line);
models.Line.belongsTo(models.Department);

models.RegistrationNumber.hasMany(models.Ticket);
models.Ticket.belongsTo(models.RegistrationNumber);

models.User.hasMany(models.Ticket, { as: "Requester", foreignKey: "RequesterId" });
models.User.hasMany(models.Ticket, { as: "Receiver", foreignKey: "ReceiverId" });
models.Ticket.belongsTo(models.User, { as: "Requester", foreignKey: "RequesterId" });
models.Ticket.belongsTo(models.User, { as: "Receiver", foreignKey: "ReceiverId" });

models.Ticket.hasMany(models.Comment);
models.Comment.belongsTo(models.Ticket);

models.User.hasMany(models.Comment);
models.Comment.belongsTo(models.User);

models.Department.hasMany(models.Ticket, { as: "RequesterDepartment", foreignKey: "RequesterDepartmentId" });
models.Department.hasMany(models.Ticket, { as: "ReceiverDepartment", foreignKey: "ReceiverDepartmentId" });
models.Ticket.belongsTo(models.Department, { as: "RequesterDepartment", foreignKey: "RequesterDepartmentId" });
models.Ticket.belongsTo(models.Department, { as: "ReceiverDepartment", foreignKey: "ReceiverDepartmentId" });

models.Ticket.hasMany(models.TicketAssignee);
models.TicketAssignee.belongsTo(models.Ticket);

models.User.hasMany(models.TicketAssignee, { as: "Approver", foreignKey: "ApproverId" });
models.User.hasMany(models.TicketAssignee, { as: "Assignee", foreignKey: "AssigneeId" });
models.User.hasMany(models.TicketAssignee, { as: "PersonInCharge", foreignKey: "PersonInChargeId" });
models.TicketAssignee.belongsTo(models.User, { as: "Approver", foreignKey: "ApproverId" });
models.TicketAssignee.belongsTo(models.User, { as: "Assignee", foreignKey: "AssigneeId" });
models.TicketAssignee.belongsTo(models.User, { as: "PersonInCharge", foreignKey: "PersonInChargeId" });

models.Department.hasMany(models.TicketAssignee, { as: "ApproverDepartment", foreignKey: "ApproverDepartmentId" });
models.Department.hasMany(models.TicketAssignee, { as: "AssigneeDepartment", foreignKey: "AssigneeDepartmentId" });
models.TicketAssignee.belongsTo(models.Department, { as: "ApproverDepartment", foreignKey: "ApproverDepartmentId" });
models.TicketAssignee.belongsTo(models.Department, { as: "AssigneeDepartment", foreignKey: "AssigneeDepartmentId" });

models.Line.hasMany(models.Ticket, { as: "RequesterLine", foreignKey: "RequesterLineId" });
models.Ticket.belongsTo(models.Line, { as: "RequesterLine", foreignKey: "RequesterLineId" });

export default models;