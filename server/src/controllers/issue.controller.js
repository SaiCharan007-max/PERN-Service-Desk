import * as issueService from "../services/issue.service.js";

export const createIssue = async (req, res, next) => {
    try {
        const { title, description, priority } = req.body;
        const userId = req.userId;

        if (!title || title.trim() === "") {
            return res.status(400).json({ message: "Title is required" });
        }

        if (!description || description.trim() === "") {
            return res.status(400).json({ message: "Description is required" });
        }

        if (priority !== undefined && isNaN(Number(priority))) {
            return res.status(400).json({ message: "Priority must be number" });
        }

        const issue = await issueService.createIssue({
            title,
            description,
            priority,
            userId
        });

        return res.status(201).json({
            success: true,
            data: issue
        });

    } catch (err) {
        next(err);
    }
};


export const assignIssue = async (req, res, next) => {
    try {
        const issueId = req.params.id;
        const staffId = req.body.staffId;

        if (!issueId) {
            return res.status(400).json({ message: "Issue ID required" });
        }
        if (!staffId) {
            return res.status(400).json({ message: "Staff required to be assigned" });
        }

        const result = await issueService.assignIssue({ issueId, staffId });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
}

export const updateIssueStatus = async (req, res, next) => {
    try {
        const { status, priority } = req.body;
        const issueId = req.params.id;   // better than body
        const userId = req.userId;
        const role = req.userRole;

        if (!issueId) {
            return res.status(400).json({ message: "Issue ID required" });
        }

        if (!status) {
            return res.status(400).json({ message: "Status required" });
        }

        const result = await issueService.updateIssueStatus({
            issueId,
            status,
            priority,
            userId,
            role
        });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
};


export const getIssueById = async (req, res, next) => {
    try {
        const issueId = req.params.id;
        const userId = req.userId;
        const role = req.userRole;

        if (!issueId) {
            return res.status(400).json({ message: "Issue ID required" });
        }

        const result = await issueService.getIssueById({ issueId, userId, role });

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {
        next(err);
    }
}