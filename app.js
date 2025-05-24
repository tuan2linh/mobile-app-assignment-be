const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const setupSwagger = require("./swagger");
const errorHandler = require("./middlewares/error.middleware");
require("dotenv").config();

const app = express();

app.use(cors()); // CORS cho mọi domain
app.use(express.json());
app.use(morgan("dev"));

// Add Swagger setup here
setupSwagger(app);

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;
