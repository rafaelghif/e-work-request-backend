import { Router } from "express";
import { authVerify } from "../middlewares/auth.js";
import { getBacklogs, getChartBackLogs, getChartDueDate, getChartOutstanding, getDueDates, getOutstanding } from "../controllers/dashboard.js";
import { getBacklogsRule, getChartBackLogsRule, getChartDueDateRule, getChartOutstandingRule, getDueDatesRule, getOutstandingRule } from "../validations/dashboard.js";

const dashboardRouter = Router();

dashboardRouter.get("/backlog/year/:year/month/:month/registrationNumberId/:registrationNumberId", [authVerify, getBacklogsRule, getBacklogs]);
dashboardRouter.get("/outstanding/year/:year/month/:month/registrationNumberId/:registrationNumberId", [authVerify, getOutstandingRule, getOutstanding]);
dashboardRouter.get("/backlog/chart/year/:year/month/:month", [authVerify, getChartBackLogsRule, getChartBackLogs]);
dashboardRouter.get("/outstanding/chart/year/:year/month/:month", [authVerify, getChartOutstandingRule, getChartOutstanding]);
dashboardRouter.get("/dueDate/date/:dueDate", [authVerify, getDueDatesRule, getDueDates]);
dashboardRouter.get("/dueDate/chart/year/:year/month/:month", [authVerify, getChartDueDateRule, getChartDueDate]);

export default dashboardRouter;