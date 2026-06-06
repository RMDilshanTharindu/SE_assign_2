const Booking = require("../models/Booking");
const Resource = require("../models/Resource");

const createBooking = async (req, res) => {
  try {
    const {
      resource,
      bookingDate,
      startTime,
      endTime,
      purpose,
    } = req.body;

    const resourceExists = await Resource.findById(resource);

    if (!resourceExists) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    if (resourceExists.status !== "available") {
      return res.status(400).json({
        message: "Resource is not available",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      resource,
      bookingDate,
      startTime,
      endTime,
      purpose,
    });

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("resource")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (!booking.user.equals(req.user._id)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    booking.finalStatus = "cancelled";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const getAdminPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      adminStatus: "pending",
    })
      .populate("user", "name email")
      .populate("resource");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const adminApproveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.adminStatus = "approved";

    if (booking.managerStatus === "approved") {
      booking.finalStatus = "approved";
    }

    await booking.save();

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const adminRejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.adminStatus = "rejected";
    booking.finalStatus = "rejected";

    await booking.save();

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const getManagerPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      adminStatus: "approved",
      managerStatus: "pending",
    })
      .populate("user", "name email")
      .populate("resource");

    res.status(200).json(bookings);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



const managerApproveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.managerStatus = "approved";

    if (booking.adminStatus === "approved") {
      booking.finalStatus = "approved";
    }

    await booking.save();

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};




const managerRejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.managerStatus = "rejected";
    booking.finalStatus = "rejected";

    await booking.save();

    res.status(200).json(booking);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAdminPendingBookings,
  adminApproveBooking,
  adminRejectBooking,
  getManagerPendingBookings,
  managerApproveBooking,
  managerRejectBooking,
};