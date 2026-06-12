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


router.post(
  "/",
  protect,
  authorizeRoles("admin","student","resource_manager"),
  createEvent
);


router.put(
  "/:id",
  protect,
  authorizeRoles("admin","student","resource_manager"),
  updateEvent
);

//// Admin only
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteEvent
);

module.exports = router;