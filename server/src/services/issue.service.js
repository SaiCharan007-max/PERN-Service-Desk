import * as issueRepository from "../repositories/issue.repository.js";
import AppError from "../utils/AppError.js";

export const createIssue = async ({ title, description, priority, userId }) => {

    const issueData = {
        title,
        description,
        priority,
        created_by: userId,
        assigned_to: null,
        status: "pending"
    };

    const result = await issueRepository.insertIssue(issueData);

    return result;
};


export const updateIssueStatus = async ({ issueId, status, priority, userId, role }) => {

    const issue = await issueRepository.findIssueById(issueId);

    if (!issue) {
        throw new AppError("Issue not found", 404);
    }

    const allowedStatuses = ["pending", "open", "in_progress", "resolved", "closed"];

    if (!allowedStatuses.includes(status)) {
        throw new AppError("Invalid status value", 400);
    }

    // STAFF ownership check
    if (role === "staff" && issue.assigned_to !== userId) {
        throw new AppError("Not authorized to update this issue", 403);
    }

    const current = issue.status;
    const next = status;

    // STAFF transitions
    if (role === "staff") {

        const staffTransitions = {
            open: ["in_progress"],
            in_progress: ["resolved"]
        };

        if (!staffTransitions[current]?.includes(next)) {
            throw new AppError("Invalid status transition", 400);
        }
    }

    // ADMIN transitions
    if (role === "admin") {

        const adminTransitions = {
            resolved: ["closed"]
        };

        if (!adminTransitions[current]?.includes(next)) {
            throw new AppError("Invalid status transition", 400);
        } else {
            throw new AppError("Invalid status transition", 400);
        }
    }

    const result = await issueRepository.updateIssueStatus({
        issueId,
        status,
        priority
    });

    return result;
};


export const getIssueById = async ({ issueId, userId, role }) => {

    const result = await issueRepository.findIssueById(issueId);

    if (!result) {
        throw new AppError("Issue not found", 404);
    }

    if (role === "user") {
        if (userId !== result.created_by)
            throw new AppError("Unauthorized access", 403);

        return {
            id: result.id,
            title: result.title,
            description: result.description,
            status: result.status,
            priority: result.priority,
            created_at: result.created_at,
            updated_at: result.updated_at
        };
    }
    else if (role === "staff") {
        if (userId !== result.assigned_to)
            throw new AppError("Unauthorized access", 403);
        return result;
    }
    else if (role === "admin") {
        return result;
    }
    else {
        throw new AppError("Unauthorized access", 403);
    }

};


export const assignIssue = async ({ issueId, staffId }) => {
    const issue = await issueRepository.findIssueById(issueId);

    if (!issue) {
        throw new AppError("Issue Not Found", 404);
    }

    if (issue.assigned_to !== null) {
        throw new AppError("Issue already assigned", 400);
    }

    if (issue.status !== "pending") {
        throw new AppError("Only pending issues can be assigned", 400);
    }

    const staff = await issueRepository.findStaffById(staffId);

    if (!staff) {
        throw new AppError("Assigned staff not found", 404);
    }

    const result = await issueRepository.assignIssue({ issueId, staffId });

    return result;
}