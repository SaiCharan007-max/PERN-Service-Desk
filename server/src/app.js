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

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET not defined");
}

app.get("/", (req, res) => {
    res.send("Server Running");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});


