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

export const findIssueById = async (issueId) => {
    const result = await pool.query(
        `
        SELECT id, title, description, status, priority, created_at, updated_at, assigned_to, created_by FROM issues
        WHERE id=$1
        `,
        [issueId]
    );

    return result.rows[0] || null;
}

export const findStaffById = async (staffId) => {
    const result = await pool.query(
        `
        SELECT id FROM users
        WHERE id=$1 AND role='staff'
        `,
        [staffId]
    );

    return result.rows[0] || null;
}

export const assignIssue = async ({issueId, staffId}) => {
    const result = await pool.query(
        `
        UPDATE issues
        SET assigned_to=$1, updated_at=NOW(), status='open'
        WHERE id=$2 AND assigned_to IS NULL
        RETURNING id, title, description, status, priority, created_at, updated_at, assigned_to, created_by
        `,
        [staffId, issueId]
    );

    return result.rows[0] || null;
}