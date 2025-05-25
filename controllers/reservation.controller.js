const Reservation = require("../models/reservation.model");
const Food = require("../models/food.model");
const Table = require("../models/table.model");
const ApiResponse = require("../utils/response");
const User = require("../models/user.model");

// Common transformation function
const transformReservation = (reservation) => ({
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
    _id: item._id,
    quantity: item.quantity,
    image: item.image,
    price: item.price
  })),
  subtotal: reservation.subtotal,
  tax: reservation.tax,
  total: reservation.total,
  moneydeposit: reservation.moneydeposit || 0,
  paystatus: reservation.paystatus,
  notefood: reservation.notefood,
  createdAt: reservation.createdAt,
  updatedAt: reservation.updatedAt,
  __v: reservation.__v
});

exports.createReservation = async (req, res) => {
  try {
    // Check table availability first
    const table = await Table.findById(req.body.tableId);
    if (!table) {
      return ApiResponse.error(res, "Table not found", 404);
    }
    if (!table.available) {
      return ApiResponse.error(res, "Table is not available", 400);
    }

    const { foodItem: rawFoodItems, ...otherData } = req.body;

    // Process each food item to include price and image
    const foodItems = await Promise.all(
      rawFoodItems.map(async (item) => {
        const food = await Food.findById(item.productId);
        if (!food) {
          throw new Error(`Food with id ${item.productId} not found`);
        }
        // Remove currency symbol and convert to number
        const priceNumber = parseFloat(food.price.replace(/[^0-9.-]+/g, ""));
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: priceNumber * item.quantity,
          image: food.image
        };
      })
    );

    // Calculate financial values
    const subtotal = foodItems.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    // Create reservation using transaction to ensure atomicity
    const session = await Reservation.startSession();
    let reservation;

    try {
      await session.withTransaction(async () => {
        // Create the reservation
        reservation = await Reservation.create([{
          ...otherData,
          userId: req.user.id,
          foodItem: foodItems,
          status: "pending",
          paystatus: "unpaid",
          subtotal,
          tax,
          total
        }], { session });

        // Update table availability
        await Table.findByIdAndUpdate(
          req.body.tableId,
          { available: false },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    const populated = await reservation[0].populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" },
      { path: "foodItem.productId" }
    ]);
    return ApiResponse.success(
      res,
      { reservation: transformReservation(populated) },
      "Reservation created successfully",
      201
    );
  } catch (err) {
    return ApiResponse.error(res, "Error creating reservation", 400, err.message);
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const query = req.query.status ? { status: req.query.status } : {};
    
    // Get reservations where user is owner OR is in friendlist
    query.$or = [
      { userId: req.user.id },
      { friendlist: req.user.id }
    ];

    const reservations = await Reservation.find(query)
      .populate([
        { 
          path: "userId", 
          select: "name email",
          model: "User"
        },
        { 
          path: "tableId", 
          select: "name position available member",
          populate: {
            path: "floorId",
            select: "name",
            model: "Floor"
          }
        },
        { 
          path: "friendlist", 
          select: "name email",
          model: "User"
        },
        {
          path: "foodItem.productId",
          select: "name image time rating price isBestSale categoryId",
          model: "Food"
        }
      ])
      .sort({ createdAt: -1 });

    const transformedReservations = reservations.map(transformReservation);

    return ApiResponse.success(res, { reservations: transformedReservations }, "Reservations retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving reservations", 500, err.message);
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const reservations = await Reservation.find(query)
      .populate([
        { 
          path: "userId", 
          select: "name email",
          model: "User"
        },
        { 
          path: "tableId", 
          select: "name position available member",
          populate: {
            path: "floorId",
            select: "name",
            model: "Floor"
          }
        },
        { 
          path: "friendlist", 
          select: "name email",
          model: "User"
        },
        {
          path: "foodItem.productId",
          select: "name image time rating price isBestSale categoryId",
          model: "Food"
        }
      ])
      .sort({ createdAt: -1 });

    const transformedReservations = reservations.map(transformReservation);

    return ApiResponse.success(res, { reservations: transformedReservations }, "All reservations retrieved successfully");
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving reservations", 500, err.message);
  }
};

exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate([
        { 
          path: "userId", 
          select: "name email",
          model: "User"
        },
        { 
          path: "tableId", 
          select: "name position available member",
          populate: {
            path: "floorId",
            select: "name",
            model: "Floor"
          }
        },
        { 
          path: "friendlist", 
          select: "name email",
          model: "User"
        },
        {
          path: "foodItem.productId",
          select: "name image time rating price isBestSale categoryId",
          model: "Food"
        }
      ]);

    if (!reservation) {
      return ApiResponse.error(res, "Reservation not found", 404);
    }

    return ApiResponse.success(
      res, 
      { reservation: transformReservation(reservation) }, 
      "Reservation retrieved successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error retrieving reservation", 400, err.message);
  }
};



exports.changeTable = async (req, res) => {
  try {
    const { newTableId } = req.body;
    const reservationId = req.params.id;

    // Find reservation
    const reservation = await Reservation.findOne({
      _id: reservationId,
      userId: req.user.id
    });

    if (!reservation) {
      return ApiResponse.error(res, "Reservation not found or user not has reservation", 404);
    }

    // Check if reservation status is pending
    if (reservation.status !== "pending") {
      return ApiResponse.error(res, "Can only change table when reservation is pending", 400);
    }

    // Check if new table exists and is available
    const newTable = await Table.findById(newTableId);
    if (!newTable) {
      return ApiResponse.error(res, "New table not found", 404);
    }
    if (!newTable.available) {
      return ApiResponse.error(res, "New table is not available", 400);
    }

    const oldTableId = reservation.tableId;

    // Use transaction to ensure consistency
    const session = await Reservation.startSession();
    try {
      await session.withTransaction(async () => {
        // Update reservation with new table
        await Reservation.findByIdAndUpdate(
          reservationId,
          { tableId: newTableId },
          { session }
        );

        // Make old table available
        await Table.findByIdAndUpdate(
          oldTableId,
          { available: true },
          { session }
        );

        // Make new table unavailable
        await Table.findByIdAndUpdate(
          newTableId,
          { available: false },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    // Get updated reservation with populated fields
    const updatedReservation = await Reservation.findById(reservationId).populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" },
      { path: "foodItem.productId" }
    ]);

    return ApiResponse.success(
      res,
      { reservation: transformReservation(updatedReservation) },
      "Table changed successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error changing table", 400, err.message);
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const validStatuses = ["pending", "canceled", "confirm", "process", "leave"];
    
    if (!validStatuses.includes(status)) {
      return ApiResponse.error(res, "Invalid status value", 400);
    }

    // First, get the current reservation
    const currentReservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!currentReservation) {
      return ApiResponse.error(res, "Reservation not found", 404);
    }

    // Check if current status is canceled
    if (currentReservation.status === "canceled") {
      return ApiResponse.error(res, "Cannot update status of a canceled reservation", 400);
    }

    // Prepare update data
    const updateData = { status };
    if (status === "canceled") {
      updateData.paystatus = "canceled";
    }

    // Update reservation with new status
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    ).populate([
      { 
        path: "userId", 
        select: "name email",
        model: "User"
      },
      { 
        path: "tableId", 
        select: "name position available member",
        populate: {
          path: "floorId",
          select: "name",
          model: "Floor"
        }
      },
      { 
        path: "friendlist", 
        select: "name email",
        model: "User"
      },
      {
        path: "foodItem.productId",
        select: "name image time rating price isBestSale categoryId",
        model: "Food"
      }
    ]);

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
      updatedAt: reservation.updatedAt,
      __v: reservation.__v
    };

    return ApiResponse.success(
      res, 
      { reservation: transformedReservation }, 
      "Reservation status updated successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error updating reservation status", 400, err.message);
  }
};

exports.updateFoodItems = async (req, res) => {
  try {
    const { foodItem: rawFoodItems } = req.body;

    // Process each food item to include price and image
    const foodItems = await Promise.all(rawFoodItems.map(async (item) => {
      const food = await Food.findById(item.productId);
      if (!food) {
        throw new Error(`Food with id ${item.productId} not found`);
      }
      const priceNumber = parseFloat(food.price.replace(/[^0-9.-]+/g, ""));
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: priceNumber * item.quantity,
        image: food.image
      };
    }));

    // Calculate new financial values
    const subtotal = foodItems.reduce((sum, item) => sum + item.price, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Update reservation with new values
    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { 
        foodItem: foodItems,
        subtotal,
        tax,
        total
      },
      { new: true }
    ).populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" },
      { path: "foodItem.productId" }
    ]);

    if (!reservation) {
      return ApiResponse.error(res, "Reservation not found", 404);
    }

    return ApiResponse.success(
      res,
      { reservation: transformReservation(reservation) },
      "Food items updated successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error updating food items", 400, err.message);
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { status } = req.params;
    const { moneydeposit } = req.body;
    const validPayStatuses = ["unpaid", "deposit", "paid", "canceled"];
    
    if (!validPayStatuses.includes(status)) {
      return ApiResponse.error(res, "Invalid payment status", 400);
    }

    const currentReservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!currentReservation) {
      return ApiResponse.error(res, "Reservation not found", 404);
    }

    if (currentReservation.status === "canceled") {
      return ApiResponse.error(res, "Cannot update payment for canceled reservation", 400);
    }

    const updateData = { paystatus: status };

    if (status === "deposit") {
      if (!moneydeposit || moneydeposit <= 0) {
        return ApiResponse.error(res, "Deposit amount is required and must be greater than 0", 400);
      }
      if (moneydeposit >= currentReservation.total) {
        return ApiResponse.error(res, "Deposit amount must be less than total amount", 400);
      }
      updateData.moneydeposit = moneydeposit;
    }

    const reservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updateData,
      { new: true }
    ).populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" },
      { path: "foodItem.productId" }
    ]);

    return ApiResponse.success(
      res, 
      { reservation: transformReservation(reservation) }, 
      "Payment status updated successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error updating payment status", 400, err.message);
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { date, time, note, notefood } = req.body;
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!reservation) {
      return ApiResponse.error(res, "Reservation not found", 404);
    }

    if (reservation.status === "canceled") {
      return ApiResponse.error(res, "Cannot update canceled reservation", 400);
    }

    const updatedReservation = await Reservation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { date, time, note, notefood },
      { new: true }
    ).populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" },
      { path: "foodItem.productId" }
    ]);

    return ApiResponse.success(
      res,
      { reservation: transformReservation(updatedReservation) },
      "Reservation details updated successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error updating reservation details", 400, err.message);
  }
};

exports.addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!reservation) {
      return ApiResponse.error(res, "Reservation not found", 404);
    }

    if (reservation.status === "canceled") {
      return ApiResponse.error(res, "Cannot modify canceled reservation", 400);
    }

    // Check if friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return ApiResponse.error(res, "Friend not found", 404);
    }

    // Check if friend is already in the list
    if (reservation.friendlist.includes(friendId)) {
      return ApiResponse.error(res, "Friend already added to reservation", 400);
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservation._id,
      { $push: { friendlist: friendId } },
      { new: true }
    ).populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" },
      { path: "foodItem.productId" }
    ]);

    return ApiResponse.success(
      res,
      { reservation: transformReservation(updatedReservation) },
      "Friend added successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error adding friend", 400, err.message);
  }
};

exports.removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    const reservation = await Reservation.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!reservation) {
      return ApiResponse.error(res, "Reservation not found", 404);
    }

    if (reservation.status === "canceled") {
      return ApiResponse.error(res, "Cannot modify canceled reservation", 400);
    }

    // Check if friend is in the list
    if (!reservation.friendlist.includes(friendId)) {
      return ApiResponse.error(res, "Friend not found in reservation", 404);
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      reservation._id,
      { $pull: { friendlist: friendId } },
      { new: true }
    ).populate([
      { path: "userId", select: "name email" },
      { path: "tableId", populate: "floorId" },
      { path: "friendlist", select: "name email" },
      { path: "foodItem.productId" }
    ]);

    return ApiResponse.success(
      res,
      { reservation: transformReservation(updatedReservation) },
      "Friend removed successfully"
    );
  } catch (err) {
    return ApiResponse.error(res, "Error removing friend", 400, err.message);
  }
};
