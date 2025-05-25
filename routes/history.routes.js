const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: History
 *   description: API quản lý lịch sử đặt bàn
 */

/**
 * @swagger
 * /api/history/me:
 *   get:
 *     summary: Lấy lịch sử đặt bàn của bản thân
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
 */
router.get("/me", verifyToken, historyController.getMyHistory);

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Lấy tất cả lịch sử đặt bàn (Admin)
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
 */
router.get("/", verifyToken, isAdmin, historyController.getAllHistory);

/**
 * @swagger
 * /api/history/{id}:
 *   get:
 *     summary: Xem chi tiết một đơn trong lịch sử
 *     tags: [History]
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
 *         description: Lấy chi tiết thành công
 *       404:
 *         description: Không tìm thấy
 */
router.get("/:id", verifyToken, historyController.getHistoryDetail);

module.exports = router;
