const Contact = require("./Contact");
const { handleBadRequest } = require("../../../utils/errorHandler");

const createContact = async (contact) => {
  try {
    const newContact = new Contact(contact);
    const savedContact = await newContact.save();
    return savedContact;
  } catch (error) {
    console.error("Error in createContact:", error);
    throw error; // Throw the error instead of using handleBadRequest
  }
};

const getContacts = async (filter = {}) => {
  try {
    const result = await Contact.find(filter).sort({ createdAt: -1 });
    return result;
  } catch (error) {
    console.error("MongoDB getContacts error:", error);
    throw error; // Let the error bubble up instead of using handleBadRequest
  }
};

const getContact = async (id) => {
  try {
    return await Contact.findById(id);
  } catch (error) {
    return handleBadRequest("MongoDB", error);
  }
};

const updateContact = async (id, contactData) => {
  try {
    return await Contact.findByIdAndUpdate(id, contactData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    return handleBadRequest("MongoDB", error);
  }
};

const deleteContact = async (id) => {
  try {
    return await Contact.findByIdAndDelete(id);
  } catch (error) {
    return handleBadRequest("MongoDB", error);
  }
};

const updateContactStatus = async (
  id,
  status,
  adminNotes = "",
  responseBy = null
) => {
  try {
    const updateData = {
      status,
      adminNotes,
      updatedAt: Date.now(),
    };

    if (responseBy) {
      updateData.responseBy = responseBy;
      updateData.responseDate = Date.now();
    }

    return await Contact.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    return handleBadRequest("MongoDB", error);
  }
};

// Analytics functions
const getContactStats = async () => {
  try {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Contact.countDocuments();
    const thisMonth = await Contact.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    return {
      total,
      thisMonth,
      byStatus: stats,
    };
  } catch (error) {
    return handleBadRequest("MongoDB", error);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  updateContactStatus,
  getContactStats,
};
