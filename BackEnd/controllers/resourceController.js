const Resource = require("../models/Resource");

// GET /api/resources
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/resources/:id
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// POST /api/resources
const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/resources/:id
const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/resources/:id
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    await resource.deleteOne();

    res.status(200).json({
      message: "Resource deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// PATCH /api/resources/:id/status
const updateResourceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
      });
    }

    resource.status = status;

    await resource.save();

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  updateResourceStatus,
};