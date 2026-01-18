import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import * as issueController from "../controllers/issue.controller";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("user"), issueController.createIssue);
router.post("/assign", authMiddleware, allowRoles("admin"), issueController.assignIssue);
router.patch("/status/:id", authMiddleware, allowRoles("admin", "staff"), issueController.updateIssueStatus);
router.get("/:id", authMiddleware, allowRoles("user", "staff", "admin"), issueController.getIssueById);

export default router;
