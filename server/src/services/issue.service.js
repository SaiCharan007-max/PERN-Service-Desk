import { findUserByEmail } from "../repositories/auth.repository.js";
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

    // STAFF ownership check
    if (role === "staff" && issue.assigned_to !== userId) {
        throw new AppError("Not authorized to update this issue", 403);
    }

    const allowedStatus = ["open", "in_progress", "resolved", "closed"];

    if (!allowedStatus.includes(status)) {
        throw new AppError("Invalid status value", 400);
    }

    const result = await issueRepository.updateIssueStatus({
        issueId,
        status,
        priority
    });

    return result;
};

export const getIssueById = async ({ issueId, userId, role }) => {

    const result = await issueRepository.getIssueById(issueId);

    if(!result) {
        throw new AppError("Issue not found", 404);
    }

    if(role === "user") {
        if(userId !== result.created_by)
            throw new AppError("UnAuthorized Access", 403);
    
        return {
            id: result.id,
            title: result.title,
            description: result.description,
            status: result.status,
            priority: result.priority,
            created_at: result.created_at,
            updated_at: result.updated_at
        };
    }else if(role === "staff") {
        if(userId !== result.assigned_to)
            throw new AppError("UnAuthorized Access", 403);
        return result;
    }else if(role === "admin") {
        return result;
    }else {
        throw new AppError("UnAuthorized Access", 403);
    }

};
