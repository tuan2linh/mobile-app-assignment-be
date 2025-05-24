const express = require("express");
const router = express.Router();
const foodController = require("../controllers/food.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Foods
 *   description: API quản lý món ăn
 */

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Lấy danh sách tất cả món ăn
 *     tags: [Foods]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", foodController.getAllFoods);

/**
 * @swagger
 * /api/foods/{id}:
 *   get:
 *     summary: Lấy thông tin một món ăn
 *     tags: [Foods]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy món ăn
 */
router.get("/:id", foodController.getFood);

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: Tạo món ăn mới (Admin)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, categoryId, price]
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               time:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: string
 *                 example: "120.000đ"
 *               isBestSale:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post("/", verifyToken, isAdmin, foodController.createFood);

/**
 * @swagger
 * /api/foods/{id}:
 *   put:
 *     summary: Cập nhật món ăn (Admin)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               time:
 *                 type: string
 *               rating:
 *                 type: number
 *               price:
 *                 type: number
 *               isBestSale:
 *                 type: boolean
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", verifyToken, isAdmin, foodController.updateFood);

/**
 * @swagger
 * /api/foods/{id}:
 *   delete:
 *     summary: Xóa món ăn (Admin)
 *     tags: [Foods]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete("/:id", verifyToken, isAdmin, foodController.deleteFood);

module.exports = router;
