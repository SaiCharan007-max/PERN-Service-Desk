import express from "express";
import "dotenv/config"
import cors from "cors";
import "./config/db.js";
import issueRoutes from "./routes/issue.routes.js";


const app = express();

app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: false
    }
));
app.use(express.json());
app.use("/issues", issueRoutes);

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
}

app.get("/", (req, res) => {
    res.send("Server Running");
})

app.use((err, req, res, next) => {

    console.error(err);

    // Postgres duplicate key
    if (err.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "Resource already exists"
        });
    }

    // Custom operational errors
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Unknown errors
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});


