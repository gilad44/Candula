const config = require("config");
const DB = config.get("DB");

const createContact = async (contact) => {
  if (DB === "MONGODB" || DB === "mongoDB") {
    const { createContact } = require("./mongoDB/contactDataAccessService");
    return await createContact(contact);
  } else {
    throw new Error(`Unsupported DB type: ${DB}`);
  }
};

const getContacts = async (filter = {}) => {
  if (DB === "MONGODB" || DB === "mongoDB") {
    const { getContacts } = require("./mongoDB/contactDataAccessService");
    return await getContacts(filter);
  }
};

const getContact = async (id) => {
  if (DB === "MONGODB" || DB === "mongoDB") {
    const { getContact } = require("./mongoDB/contactDataAccessService");
    return await getContact(id);
  }
};

const updateContact = async (id, contact) => {
  if (DB === "MONGODB" || DB === "mongoDB") {
    const { updateContact } = require("./mongoDB/contactDataAccessService");
    return await updateContact(id, contact);
  }
};

const deleteContact = async (id) => {
  if (DB === "MONGODB" || DB === "mongoDB") {
    const { deleteContact } = require("./mongoDB/contactDataAccessService");
    return await deleteContact(id);
  }
};

const updateContactStatus = async (
  id,
  status,
  adminNotes = "",
  responseBy = null
) => {
  if (DB === "MONGODB" || DB === "mongoDB") {
    const {
      updateContactStatus,
    } = require("./mongoDB/contactDataAccessService");
    return await updateContactStatus(id, status, adminNotes, responseBy);
  }
};

module.exports = {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  updateContactStatus,
};
