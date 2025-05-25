const Reservation = require("../models/reservation.model");
const ApiResponse = require("../utils/response");

exports.getMyHistory = async (req, res) => {
  try {
    const query = { 
      status: "leave",
      $or: [
        { userId: req.user.id },
        { friendlist: req.user.id }
      ]
    };

    const reservations = await Reservation.find(query)
      .populate([
        { path: "userId", select: "name email" },
        { path: "tableId", populate: "floorId" },
        { path: "friendlist", select: "name email" }
      ])
      .sort({ createdAt: -1 });

    const transformedReservations = reservations.map(reservation => ({
      _id: reservation._id,
      user: reservation.userId,
      table: {
        ...reservation.tableId.toObject(),
        floor: reservation.tableId.floorId
      },
      date: reservation.date,
      time: reservation.time,
      note: reservation.note,
      status: reservation.status,
      friendlist: reservation.friendlist,
      foodItem: reservation.foodItem.map(item => ({
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        _id: item._id
      })),
      subtotal: reservation.subtotal,
      tax: reservation.tax,
      total: reservation.total,
      moneydeposit: reservation.moneydeposit || 0,
      paystatus: reservation.paystatus,
      notefood: reservation.notefood,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    }));

    return ApiResponse.success(res, { reservations: transformedReservations }, "History retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving history", 500, err.message);
  }
};

exports.getAllHistory = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: "leave" })
      .populate([
        { path: "userId", select: "name email" },
        { path: "tableId", populate: "floorId" },
        { path: "friendlist", select: "name email" }
      ])
      .sort({ createdAt: -1 });

    const transformedReservations = reservations.map(reservation => ({
      _id: reservation._id,
      user: reservation.userId,
      table: {
        ...reservation.tableId.toObject(),
        floor: reservation.tableId.floorId
      },
      date: reservation.date,
      time: reservation.time,
      note: reservation.note,
      status: reservation.status,
      friendlist: reservation.friendlist,
      foodItem: reservation.foodItem.map(item => ({
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        _id: item._id
      })),
      subtotal: reservation.subtotal,
      tax: reservation.tax,
      total: reservation.total,
      moneydeposit: reservation.moneydeposit || 0,
      paystatus: reservation.paystatus,
      notefood: reservation.notefood,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    }));

    return ApiResponse.success(res, { reservations: transformedReservations }, "All history retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving history", 500, err.message);
  }
};

exports.getHistoryDetail = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      status: "leave",
      $or: [
        { userId: req.user.id },
        { friendlist: req.user.id }
      ]
    }).populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" }
    ]);

    if (!reservation) {
      return ApiResponse.error(res, "History not found", 404);
    }

    const transformedReservation = {
      _id: reservation._id,
      user: reservation.userId,
      table: {
        ...reservation.tableId.toObject(),
        floor: reservation.tableId.floorId
      },
      date: reservation.date,
      time: reservation.time,
      note: reservation.note,
      status: reservation.status,
      friendlist: reservation.friendlist,
      foodItem: reservation.foodItem.map(item => ({
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        _id: item._id
      })),
      subtotal: reservation.subtotal,
      tax: reservation.tax,
      total: reservation.total,
      moneydeposit: reservation.moneydeposit || 0,
      paystatus: reservation.paystatus,
      notefood: reservation.notefood,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    };

    return ApiResponse.success(res, { reservation: transformedReservation }, "History detail retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving history detail", 400, err.message);
  }
};
