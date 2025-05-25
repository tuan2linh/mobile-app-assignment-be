const express = require("express");
const router = express.Router();
const tableController = require("../controllers/table.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: API quản lý bàn
 */

/**
 * @swagger
 * /api/tables:
 *   get:
 *     summary: Lấy danh sách tất cả bàn
 *     tags: [Tables]
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 */
router.get("/", tableController.getAllTables);

/**
 * @swagger
 * /api/tables/{id}:
 *   get:
 *     summary: Lấy thông tin một bàn
 *     tags: [Tables]
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
 *         description: Không tìm thấy bàn
 */
router.get("/:id", tableController.getTable);

/**
 * @swagger
 * /api/tables:
 *   post:
 *     summary: Tạo bàn mới (Admin)
 *     tags: [Tables]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, floorId, position]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Bàn 1"
 *               floorId:
 *                 type: string
 *               position:
 *                 type: object
 *                 properties:
 *                   top:
 *                     type: number
 *                   left:
 *                     type: number
 *               available:
 *                 type: boolean
 *               member:
 *                 type: number
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.post("/", verifyToken, isAdmin, tableController.createTable);

/**
 * @swagger
 * /api/tables/{id}:
 *   put:
 *     summary: Cập nhật thông tin bàn (Admin)
 *     tags: [Tables]
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
 *               position:
 *                 type: object
 *                 properties:
 *                   top:
 *                     type: number
 *                   left:
 *                     type: number
 *               available:
 *                 type: boolean
 *               member:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put("/:id", verifyToken, isAdmin, tableController.updateTable);

/**
 * @swagger
 * /api/tables/{id}:
 *   delete:
 *     summary: Xóa bàn (Admin)
 *     tags: [Tables]
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
router.delete("/:id", verifyToken, isAdmin, tableController.deleteTable);

module.exports = router;
