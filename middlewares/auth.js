import jwt from "jsonwebtoken";
import { errorLogging } from "../helpers/error.js";

export const authVerify = async (req, res, next) => {
    try {
        const headers = req.headers;
        const authorization = headers.authorization.split("Bearer ");
        if (authorization.length > 0) {
            const token = authorization[1];
            jwt.verify(token, process.env.JWT_KEY, async (err, result) => {
                if (err) {
                    return res.status(403).json({
                        isExpressValidation: false,
                        data: {
                            title: "Token Not Valid!",
                            message: "Token Not Valid!"
                        }
                    });
                } else {
                    req.decoded = result;
                    next();
                }
            });
        } else {
            return res.status(401).json({
                isExpressValidation: false,
                data: {
                    title: "No Token Provided!",
                    message: "No Token Provided!"
                }
            });
        }
    } catch (err) {
        errorLogging(err.toString());
        return res.status(401).json({
            isExpressValidation: false,
            data: {
                title: "No Token Provided!",
                message: err.toString()
            }
        });
    }

}