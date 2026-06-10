const express = require("express");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Everyone can view events
router.get("/", getEvents);

// Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createEvent
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateEvent
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteEvent
);

module.exports = router;