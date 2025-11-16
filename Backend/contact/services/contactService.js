const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  updateContactStatus,
} = require("../models/contactDataAccessService");
const { validateContact } = require("../validations/contactValidationService");
const { handleBadRequest } = require("../../utils/errorHandler");

// Create a new contact message
const submitContactForm = async (contactData) => {
  try {
    // Validate the contact data
    const { error } = validateContact(contactData);
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      throw new Error(errorMessage);
    }

    // Create the contact entry
    const contact = await createContact(contactData);

    // In a real application, you might want to:
    // 1. Send an email notification to admins
    // 2. Send a confirmation email to the user
    // 3. Log the contact form submission

    return contact;
  } catch (error) {
    console.error("Contact Service Error:", error.message);
    throw error;
  }
};

// Get all contact messages (admin only)
const getAllContacts = async (filter = {}) => {
  try {
    const result = await getContacts(filter);
    // Ensure we always return an array
    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("ContactService.getAllContacts error:", error);
    throw error; // Re-throw the error instead of using handleBadRequest which might return undefined
  }
};

// Get a specific contact message
const getContactById = async (id) => {
  try {
    const contact = await getContact(id);
    if (!contact) {
      return handleBadRequest("Contact Service", "Contact message not found");
    }
    return contact;
  } catch (error) {
    return handleBadRequest("Contact Service", error.message);
  }
};

// Update contact message (admin only)
const updateContactMessage = async (id, updateData) => {
  try {
    const contact = await updateContact(id, updateData);
    if (!contact) {
      return handleBadRequest("Contact Service", "Contact message not found");
    }
    return contact;
  } catch (error) {
    return handleBadRequest("Contact Service", error.message);
  }
};

// Update contact status (admin only)
const updateContactMessageStatus = async (
  id,
  status,
  adminNotes,
  responseBy
) => {
  try {
    const validStatuses = ["חדש", "נקרא", "נענה", "טופל"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const contact = await updateContactStatus(
      id,
      status,
      adminNotes,
      responseBy
    );
    if (!contact) {
      return handleBadRequest("Contact Service", "Contact message not found");
    }
    return contact;
  } catch (error) {
    return handleBadRequest("Contact Service", error.message);
  }
};

// Delete contact message (admin only)
const deleteContactMessage = async (id) => {
  try {
    const contact = await deleteContact(id);
    if (!contact) {
      return handleBadRequest("Contact Service", "Contact message not found");
    }
    return contact;
  } catch (error) {
    return handleBadRequest("Contact Service", error.message);
  }
};

module.exports = {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactMessage,
  updateContactMessageStatus,
  deleteContactMessage,
};
