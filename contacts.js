const fs = require("fs").promises;
const { nanoid } = require("nanoid");
const path = require("path");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  const contacts = JSON.parse(data);
  if (contacts && Array.isArray(contacts)) return contacts;
  throw Error("No contacts loaded");
}

async function getContactById(contactId) {
  const contactList = await listContacts();
  const contact = contactList.find(({ id }) => id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contactList = await listContacts();
  const index = contactList.findIndex((e) => e.id !== contactId);
  const [contact] = contactList.splice(index, 1);
  if (contact)
    await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
  return contact || null;
}

async function addContact(name, email, phone) {
  const contactList = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contactList.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactList, null, 2));
  return newContact || null;
}

module.exports = {
  listContacts,
  addContact,
  getContactById,
  removeContact,
};
