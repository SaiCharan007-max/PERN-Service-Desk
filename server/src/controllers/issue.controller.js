import { issueCreated } from "../services/issue.service.js";


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


export const assignIssue = (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json({ message: "Issue Not Assigned" });
    }
}

export const updateIssueStatus = (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json({ message: "Issue Not Assigned" });
    }
}

export const getIssueById = (req, res) => {
    try {

    } catch (err) {
        return res.status(500).json({ message: "Server Error" });
    }
}