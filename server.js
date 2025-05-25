const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8080;
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
