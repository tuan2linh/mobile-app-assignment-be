const express = require("express");
const router = express.Router();
const floorController = require("../controllers/floor.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Floors
 *   description: API quản lý tầng
 */

/**
 * @swagger
 * /api/floors:
 *   get:
 *     summary: Lấy danh sách tất cả các tầng
 *     tags: [Floors]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/", floorController.getAllFloors);

/**
 * @swagger
 * /api/floors/{id}:
 *   get:
 *     summary: Lấy thông tin một tầng và các bàn trong tầng đó
 *     tags: [Floors]
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
 *         description: Không tìm thấy tầng
 */
router.get("/:id", floorController.getFloor);

/**
 * @swagger
 * /api/floors:
 *   post:
 *     summary: Tạo tầng mới (Admin)
 *     tags: [Floors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tầng 1"
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post("/", verifyToken, isAdmin, floorController.createFloor);

/**
 * @swagger
 * /api/floors/{id}:
 *   put:
 *     summary: Cập nhật thông tin tầng (Admin)
 *     tags: [Floors]
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
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", verifyToken, isAdmin, floorController.updateFloor);

/**
 * @swagger
 * /api/floors/{id}:
 *   delete:
 *     summary: Xóa tầng (Admin)
 *     tags: [Floors]
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
router.delete("/:id", verifyToken, isAdmin, floorController.deleteFloor);

module.exports = router;
