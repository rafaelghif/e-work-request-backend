import { Router } from "express";
import multer from "multer";
import { authVerify } from "../middlewares/auth.js";
import { createJig, createJigDetail, getDetailJig, getJigDetailHistory, getJigs, getLastSequence, importOldJig, updateJig, updateJigDetail } from "../controllers/ledgerJig.js";
import { createJigDetailRule, createJigRule, updateJigDetailRule, updateJigRule } from "../validations/ledgerJig.js";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "public/ledgers/jigs");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
		const fileNameArr = file.originalname.split(".");
		const ext = fileNameArr[fileNameArr.length - 1].toLowerCase();
		let allowExt = ["png", "jpg", "jpeg"];

		if (!allowExt.includes(ext)) {
			return cb(new Error("Extension Not Allowed!"));
		}

		cb(null, `lj-${uniqueSuffix}.${ext}`);
	}
});

const upload = multer({ storage: storage });

const ledgerJigRouter = Router();

ledgerJigRouter.get("/", [authVerify, getJigs]);
ledgerJigRouter.get("/detail/jigId/:jigId", [authVerify, getDetailJig]);
ledgerJigRouter.get("/detail/jigDetailId/:jigDetailId", [authVerify, getJigDetailHistory]);
ledgerJigRouter.get("/lastSequence", [authVerify, getLastSequence]);
ledgerJigRouter.get("/import", [importOldJig]);
ledgerJigRouter.post("/", [authVerify, createJigRule, createJig]);
ledgerJigRouter.post("/detail", [authVerify, upload.single("picture"), createJigDetailRule, createJigDetail]);
ledgerJigRouter.patch("/", [authVerify, updateJigRule, updateJig]);
ledgerJigRouter.patch("/detail", [authVerify, upload.single("picture"), updateJigDetailRule, updateJigDetail]);

export default ledgerJigRouter;