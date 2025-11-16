const express = require("express");
const router = express.Router();
const {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactMessage,
  updateContactMessageStatus,
  deleteContactMessage,
} = require("../services/contactService");
const { handleError } = require("../../utils/errorHandler");
const auth = require("../../auth/authService");

// Public route - Submit contact form
router.post("/", async (req, res) => {
  try {
    const contact = await submitContactForm(req.body);
    return res.status(201).json({
      message: "Contact form submitted successfully",
      contact,
    });
  } catch (err) {
    return handleError(res, err.status || 500, err.message);
  }
});

// Admin routes - require authentication and admin role
router.get("/", auth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return handleError(res, 403, "Authorization Error: Must be admin");
    }

    // Optional filtering by status, priority, etc.
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const contacts = await getAllContacts(filter);

    // Ensure we always return an array
    const result = Array.isArray(contacts) ? contacts : [];
    return res.json(result);
  } catch (err) {
    console.error("Error in contact controller:", err);
    return handleError(res, err.status || 500, err.message);
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return handleError(res, 403, "Authorization Error: Must be admin");
    }

    const contact = await getContactById(req.params.id);
    return res.json(contact);
  } catch (err) {
    return handleError(res, err.status || 500, err.message);
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return handleError(res, 403, "Authorization Error: Must be admin");
    }

    const contact = await updateContactMessage(req.params.id, req.body);
    return res.json({
      message: "Contact message updated successfully",
      contact,
    });
  } catch (err) {
    return handleError(res, err.status || 500, err.message);
  }
});

router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { role, _id } = req.user;
    if (role !== "admin") {
      return handleError(res, 403, "Authorization Error: Must be admin");
    }

    const { status, adminNotes } = req.body;
    const contact = await updateContactMessageStatus(
      req.params.id,
      status,
      adminNotes,
      _id
    );

    return res.json({
      message: "Contact status updated successfully",
      contact,
    });
  } catch (err) {
    return handleError(res, err.status || 500, err.message);
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin") {
      return handleError(res, 403, "Authorization Error: Must be admin");
    }

    await deleteContactMessage(req.params.id);
    return res.json({
      message: "Contact message deleted successfully",
    });
  } catch (err) {
    return handleError(res, err.status || 500, err.message);
  }
});

module.exports = router;
