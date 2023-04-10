import * as fs from "fs";
import path from "path";

/**
 * Logs an error message to a file with the current timestamp as the filename.
 *
 * @param {string} errorText - The error message to log.
 * @returns {void}
 */
export const errorLogging = (errorText) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const date = currentDate.getDate().toString().padStart(2, "0");

    const dirPath = path.join("logs", "errors", year, month);
    const filename = `${date}.txt`;
    const filePath = path.join(dirPath, filename);

    const logMessage = `${currentDate.toLocaleString()}: ${errorText}\n`;

    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating directory ${dirPath}: ${err}`);
        } else {
            fs.appendFile(filePath, logMessage, (err) => {
                if (err) {
                    console.error(`Error logging to ${filePath}: ${err}`);
                } else {
                    console.log(`Error logged to ${filePath}`);
                }
            });
        }
    });
}