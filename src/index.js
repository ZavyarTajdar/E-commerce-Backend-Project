import app from "./app.js";
import dotenv from "dotenv"
import connectDB from "./database/server.js"

dotenv.config({
    path : "./.env"
})

// connect Database

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);  
    })
})
.catch((error) =>{ 
    console.log("MongoDB Connection Failed", error);
})

app.on("error", (error) => {
    console.error("Express error:", error);
})

