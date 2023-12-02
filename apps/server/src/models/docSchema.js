const { Schema, model } = require("./connection");

const docSchema = new Schema({
  id: {
    // document ID
    type: String,
    required: true,
  },
  title: {
    // Document Title
    type: String,
    required: true,
  },
  data: {
    // Document Data
    type: Object,
    required: true,
  },
  // Users contributing on the Document
  users: [
    {
      userId: {
        // User ID or Email ID
        type: String,
      },
      username: {
        // Username or Name
        type: String,
      },
      cursorPosition: {
        // Last Cursor Position
        type: Object,
      },
      userChanges: {
        // User Changes
        type: Object,
      },
    },
  ],
});

module.exports = model("Document", docSchema);
