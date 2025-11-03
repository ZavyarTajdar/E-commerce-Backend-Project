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
import adminProductsRoutes from "./routes/admin.products.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import DashboardRoutes from "./routes/dashboard.routes.js";

// Routes Declaration

app.use("/api/v1/users", userRoutes)
app.use("/api/v1/products", productsRoutes)
app.use("/api/v1/admin", adminProductsRoutes)
app.use("/api/v1/admin/category", categoryRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/payments", paymentRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/dashboard", DashboardRoutes)

export default app;