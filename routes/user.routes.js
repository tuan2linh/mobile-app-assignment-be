const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

router.get("/profile", verifyToken, userController.getProfile);
router.get("/", verifyToken, isAdmin, userController.getAllUsers);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API quản lý người dùng
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *       403:
 *         description: Không có quyền
 */
router.get("/", verifyToken, isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Lấy thông tin người dùng hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 *       401:
 *         description: Chưa đăng nhập
 */
router.get("/profile", verifyToken, userController.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               address:
 *                 type: string
 *                 example: "Updated Address"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/new-avatar.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi cập nhật
 *       401:
 *         description: Chưa đăng nhập
 */
router.put("/profile", verifyToken, userController.updateProfile);

module.exports = router;

