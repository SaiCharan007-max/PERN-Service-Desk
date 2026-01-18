import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT id, email, password_hash, role FROM users WHERE email = $1", [email]
    );
    return result.rows[0] || null;
}

export const createUser = async (props) => {
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role`,
        [props.name, props.email, props.password_hash, props.role]
    );

    return result.rows[0];
}
