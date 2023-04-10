import connectionDatabase from "../configs/database.js";
import Comment from "./comment.js";
import Department from "./department.js";
import Line from "./line.js";
import RegistrationNumber from "./registrationNumber.js";
import Section from "./section.js";
import Ticket from "./ticket.js";
import TicketAssignee from "./ticketAssignee.js";
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

models.User.hasMany(models.TicketAssignee, { as: "Assignee", foreignKey: "AssigneeId" });
models.TicketAssignee.belongsTo(models.User, { as: "Assignee", foreignKey: "AssigneeId" });

models.User.hasMany(models.TicketAssignee, { as: "PersonInCharge", foreignKey: "PersonInChargeId" });
models.TicketAssignee.belongsTo(models.User, { as: "PersonInCharge", foreignKey: "PersonInChargeId" });

models.Department.hasMany(models.TicketAssignee, { as: "AssigneeDepartment",foreignKey:"AssigneeDepartmentId" });
models.TicketAssignee.belongsTo(models.Department, { as: "AssigneeDepartment",foreignKey:"AssigneeDepartmentId" });

models.Line.hasMany(models.Ticket, { as: "RequesterLine", foreignKey: "RequesterLineId" });
models.Ticket.belongsTo(models.Line, { as: "RequesterLine", foreignKey: "RequesterLineId" });

export default models;