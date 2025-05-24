const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", verifyToken, authController.logout);

module.exports = router;



/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API cho xác thực người dùng
 */

router.post(
  "/register",
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Đăng ký người dùng
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, email, password]
   *             properties:
   *               name:
   *                 type: string
   *                 example: "Manh"
   *               email:
   *                 type: string
   *                 example: "manh@gmail.com"
   *               password:
   *                 type: string
   *                 example: "123456"
   *               avatar:
   *                 type: string
   *                 example: "https://example.com/avatar.jpg"
   *               phone:
   *                 type: string
   *                 example: "0123456789"
   *               address:
   *                 type: string
   *                 example: "Ha Noi, Viet Nam"
   *     responses:
   *       201:
   *         description: Đăng ký thành công
   *       400:
   *         description: Lỗi đăng ký
   */
  authController.register
);

router.post(
  "/login",
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Đăng nhập người dùng
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 example: "manh@gmail.com"
   *               password:
   *                 type: string
   *                 example: "123456"
   *     responses:
   *       200:
   *         description: Đăng nhập thành công
   *       401:
   *         description: Sai thông tin đăng nhập
   */
  authController.login
);

router.post(
  "/logout",
  verifyToken,
  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Đăng xuất người dùng
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Đăng xuất thành công
   *       401:
   *         description: Token không hợp lệ
   */
  authController.logout
);

