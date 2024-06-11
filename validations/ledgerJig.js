import { body } from "express-validator";

export const createJigRule = [
	body("regNo").notEmpty().withMessage("Reg No cannot be null"),
	body("sequence").notEmpty().withMessage("Sequence cannot be null"),
	body("location").notEmpty().withMessage("Location cannot be null"),
	body("maker").notEmpty().withMessage("Maker cannot be null"),
	body("name").notEmpty().withMessage("Name cannot be null"),
	body("qty").notEmpty().withMessage("Qty cannot be null"),
];

export const createJigDetailRule = [
	body("regNo").notEmpty().withMessage("Reg No cannot be null"),
	body("approveBy").notEmpty().withMessage("Approve cannot be null"),
	body("checkedBy").notEmpty().withMessage("Checked cannot be null"),
	body("makeBy").notEmpty().withMessage("Make cannot be null"),
	body("registrationDate")
		.notEmpty()
		.withMessage("Registration Date cannot be null"),
	body("machineUse").notEmpty().withMessage("Machine Use cannot be null"),
	body("partNo").notEmpty().withMessage("Part No cannot be null"),
	body("partName").notEmpty().withMessage("Part Name cannot be null"),
	body("acquiredDate").notEmpty().withMessage("Acquired Date cannot be null"),
	body("location").notEmpty().withMessage("Location cannot be null"),
	body("LedgerJigId")
		.notEmpty()
		.withMessage("Ledger Id cannot be null")
		.isUUID("4")
		.withMessage("Invalid id"),
];

export const updateJigRule = [
	body("id")
		.notEmpty()
		.withMessage("Id cannot be null")
		.isUUID("4")
		.withMessage("Invalid id"),
	body("regNo").notEmpty().withMessage("Reg No cannot be null"),
	body("sequence").notEmpty().withMessage("Sequence cannot be null"),
	body("location").notEmpty().withMessage("Location cannot be null"),
	body("maker").notEmpty().withMessage("Maker cannot be null"),
	body("name").notEmpty().withMessage("Name cannot be null"),
	body("qty").notEmpty().withMessage("Qty cannot be null"),
	body("status").notEmpty().withMessage("Status cannot be null"),
];

export const updateJigDetailRule = [
	body("id")
		.notEmpty()
		.withMessage("Id cannot be null")
		.isUUID("4")
		.withMessage("Invalid id"),
	body("regNo").notEmpty().withMessage("Reg No cannot be null"),
	body("approveBy").notEmpty().withMessage("Approve cannot be null"),
	body("checkedBy").notEmpty().withMessage("Checked cannot be null"),
	body("makeBy").notEmpty().withMessage("Make cannot be null"),
	body("registrationDate")
		.notEmpty()
		.withMessage("Registration Date cannot be null"),
	body("machineUse").notEmpty().withMessage("Machine Use cannot be null"),
	body("partNo").notEmpty().withMessage("Part No cannot be null"),
	body("partName").notEmpty().withMessage("Part Name cannot be null"),
	body("acquiredDate").notEmpty().withMessage("Acquired Date cannot be null"),
	body("location").notEmpty().withMessage("Location cannot be null"),
	body("LedgerJigId")
		.notEmpty()
		.withMessage("Ledger Id cannot be null")
		.isUUID("4")
		.withMessage("Invalid id"),
];
