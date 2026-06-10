const express = require("express");

const {
  getUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Admin only routes
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getUsers
);

router.patch(
  "/:id/role",
  protect,
  authorizeRoles("admin"),
  updateUserRole
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);

module.exports = router;