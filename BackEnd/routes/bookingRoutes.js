const express = require("express");

const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAdminPendingBookings,
  adminApproveBooking,
  adminRejectBooking,
  getManagerPendingBookings,
  managerApproveBooking,
  managerRejectBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Student / Lecturer
router.post(
  "/",
  protect,
  authorizeRoles("student", "lecturer"),
  createBooking
);

router.get(
  "/my-bookings",
  protect,
  authorizeRoles("student", "lecturer"),
  getMyBookings
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("student", "lecturer"),
  cancelBooking
);

// Admin
router.get(
  "/admin/pending",
  protect,
  authorizeRoles("admin"),
  getAdminPendingBookings
);

router.patch(
  "/:id/admin-approve",
  protect,
  authorizeRoles("admin"),
  adminApproveBooking
);

router.patch(
  "/:id/admin-reject",
  protect,
  authorizeRoles("admin"),
  adminRejectBooking
);

// Resource Manager
router.get(
  "/manager/pending",
  protect,
  authorizeRoles("resource_manager"),
  getManagerPendingBookings
);

router.patch(
  "/:id/manager-approve",
  protect,
  authorizeRoles("resource_manager"),
  managerApproveBooking
);

router.patch(
  "/:id/manager-reject",
  protect,
  authorizeRoles("resource_manager"),
  managerRejectBooking
);

module.exports = router;