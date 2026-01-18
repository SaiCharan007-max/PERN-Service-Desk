import pool from "../config/db.js";

export const insertIssue = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO issues (title, description, priority, assigned_to, created_by, status)
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id, title, description, priority, assigned_to, created_by, status 
        `,
        [data.title, data.description, data.priority, data.assigned_to, data.created_by, data.status]
    );

    return result.rows[0] || null;
}

export const updateIssueStatus = async ({ issueId, status, priority }) => {

    const result = await pool.query(
        `
    UPDATE issues
    SET status = $1,
        priority = $2,
        updated_at = NOW()
    WHERE id = $3
    RETURNING id, status, priority, updated_at
    `,
        [status, priority, issueId]
    );

    return result.rows[0] || null;
};
