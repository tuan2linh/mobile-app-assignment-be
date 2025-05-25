const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const categoryRoutes = require("./category.routes");
const foodRoutes = require("./food.routes");
const floorRoutes = require("./floor.routes");
const tableRoutes = require("./table.routes");

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/foods", foodRoutes);

router.use("/floors", floorRoutes);
router.use("/tables", tableRoutes);

module.exports = router;
