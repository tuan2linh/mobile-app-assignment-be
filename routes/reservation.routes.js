const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { isAdmin, isUser } = require("../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API quản lý đặt bàn
 */

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Tạo đơn đặt bàn mới
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tableId, date, time, foodItem]
 *             properties:
 *               tableId:
 *                 type: string
 *                 description: ID của bàn
 *               date:
 *                 type: string
 *                 example: "2024-03-20"
 *               time:
 *                 type: string
 *                 example: "18:00"
 *               note:
 *                 type: string
 *               friendlist:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID của người dùng
 *               foodItem:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID của món ăn
 *                     quantity:
 *                       type: number
 *                       description: Số lượng món ăn
  *               notefood:
 *                 type: string
 *                 description: Ghi chú cho món ăn
 *     responses:
 *       201:
 *         description: Tạo đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     reservation:
 *                       type: object
 *                       properties:
 *                         foodItem:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               productId:
 *                                 type: string
 *                               quantity:
 *                                 type: number
 *                               price:
 *                                 type: number
 *                               image:
 *                                 type: string
 *                         subtotal:
 *                           type: number
 *                         tax:
 *                           type: number
 *                         total:
 *                           type: number
 *                         status:
 *                           type: string
 *                           enum: [pending, canceled, confirm, process, leave]
 *                         paystatus:
 *                           type: string
 *                           enum: [unpaid, deposit, paid, canceled]
 */
router.post("/", verifyToken, isUser, reservationController.createReservation);

/**
 * @swagger
 * /api/reservations/me:
 *   get:
 *     summary: Lấy danh sách đơn đặt bàn của bản thân
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, canceled, confirm, process, leave]
 *         description: Lọc theo trạng thái đơn đặt bàn
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/me", verifyToken, reservationController.getMyReservations);

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Lấy tất cả đơn đặt bàn (Admin)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, canceled, confirm, process, leave]
 *         description: Lọc theo trạng thái đơn đặt bàn
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", verifyToken, isAdmin, reservationController.getAllReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn đặt bàn
 *     tags: [Reservations]
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
 *         description: Success
 */
router.get("/:id", verifyToken, reservationController.getReservation);

/**
 * @swagger
 * /api/reservations/{id}/change-table:
 *   put:
 *     summary: Đổi bàn cho đơn đặt
 *     tags: [Reservations]
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
 *             required: [newTableId]
 *             properties:
 *               newTableId:
 *                 type: string
 *                 description: ID của bàn mới muốn đổi
 *     responses:
 *       200:
 *         description: Đổi bàn thành công
 *       400:
 *         description: Lỗi - Bàn không khả dụng hoặc đơn không ở trạng thái pending
 *       404:
 *         description: Không tìm thấy đơn đặt bàn hoặc bàn mới
 */
router.put("/:id/change-table", verifyToken, reservationController.changeTable);

/**
 * @swagger
 * /api/reservations/{id}/status/{status}:
 *   patch:
 *     summary: Cập nhật trạng thái đơn đặt bàn
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, canceled, confirm, process, leave]
 *         description: Trạng thái mới của đơn đặt bàn
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn đặt bàn
 */
router.patch("/:id/status/:status", verifyToken, reservationController.updateStatus);

/**
 * @swagger
 * /api/reservations/{id}/food-items:
 *   put:
 *     summary: Cập nhật danh sách món ăn trong đơn đặt bàn
 *     tags: [Reservations]
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
 *             required: [foodItem]
 *             properties:
 *               foodItem:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi dữ liệu
 *       404:
 *         description: Không tìm thấy đơn đặt bàn
 */
router.put("/:id/food-items", verifyToken, reservationController.updateFoodItems);

/**
 * @swagger
 * /api/reservations/{id}/payment/{status}:
 *   patch:
 *     summary: Cập nhật trạng thái thanh toán
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [unpaid, deposit, paid, canceled]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               moneydeposit:
 *                 type: number
 *                 description: Required only when status is deposit
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Lỗi dữ liệu hoặc trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy đơn đặt bàn
 */
router.patch("/:id/payment/:status", verifyToken, reservationController.updatePayment);

/**
 * @swagger
 * /api/reservations/{id}/details:
 *   patch:
 *     summary: Cập nhật thông tin chi tiết đặt bàn
 *     tags: [Reservations]
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
 *               date:
 *                 type: string
 *                 example: "2024-03-20"
 *               time:
 *                 type: string
 *                 example: "18:00"
 *               note:
 *                 type: string
 *                 example: "Celebration dinner"
 *               notefood:
 *                 type: string
 *                 example: "No spicy food"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Không thể cập nhật đơn đã hủy
 *       404:
 *         description: Không tìm thấy đơn đặt bàn
 */
router.patch("/:id/details", verifyToken, reservationController.updateDetails);

/**
 * @swagger
 * /api/reservations/{id}/friends:
 *   post:
 *     summary: Thêm bạn vào đơn đặt bàn
 *     tags: [Reservations]
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
 *             required: [friendId]
 *             properties:
 *               friendId:
 *                 type: string
 *                 description: ID của người dùng muốn thêm
 *     responses:
 *       200:
 *         description: Thêm bạn thành công
 *       400:
 *         description: Bạn đã được thêm hoặc đơn đã hủy
 *       404:
 *         description: Không tìm thấy đơn đặt bàn hoặc người dùng
 */
router.post("/:id/friends", verifyToken, reservationController.addFriend);

/**
 * @swagger
 * /api/reservations/{id}/friends/{friendId}:
 *   delete:
 *     summary: Xóa bạn khỏi đơn đặt bàn
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa bạn thành công
 *       400:
 *         description: Đơn đã hủy
 *       404:
 *         description: Không tìm thấy đơn đặt bàn hoặc bạn trong đơn
 */
router.delete("/:id/friends/:friendId", verifyToken, reservationController.removeFriend);

module.exports = router;
