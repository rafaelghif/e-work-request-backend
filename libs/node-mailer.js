import * as nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: `YAS-ID-ITD@yokogawa.com`,
        pass: `ymb2000~~`,
    },
});