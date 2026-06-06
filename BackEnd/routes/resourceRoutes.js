const express = require("express");

const {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  updateResourceStatus,
} = require("../controllers/resourceController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Student / Lecturer
router.get("/", protect, getResources);
router.get("/:id", protect, getResourceById);

// Resource Manager
router.post(
  "/",
  protect,
  authorizeRoles("resource_manager"),
  createResource
);

router.put(
  "/:id",
  protect,
  authorizeRoles("resource_manager"),
  updateResource
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("resource_manager"),
  deleteResource
);

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("resource_manager"),
  updateResourceStatus
);

module.exports = router;