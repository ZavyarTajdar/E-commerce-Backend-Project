import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "10mb"}))
app.use(express.urlencoded({ extended : true, limit : "10mb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes 

import userRoutes from "./routes/user.routes.js";
import productsRoutes from "./routes/products.routes.js";


// Routes Declaration

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/products", productsRoutes)

export default app;