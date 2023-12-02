const { errorMonitor } = require("pg/lib/query");
const Document = require("./models/docSchema");
require("dotenv").config();

// Create Open Connection on localhost:3001
const socketIO = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Function to Handle Document with Database
async function handleDocument(id) {
  const initialDoc = {
    id,
    title: "Untitled Document",
    data: "",
    users: [],
  };
  if (id == null) return;
  const document = await Document.findOne({ id });
  if (document) return document;
  return await Document.create(initialDoc);
}

// Socket Connection
socketIO.on("connection", (socket) => {
  // Get Document from Database if Available otherwise create new Document on the Database
  socket.on("get-document", async (documentId) => {
    const cursors = [];
    const document = await handleDocument(documentId);
    socket.join(documentId);

    // Load Document on the Client Side as per saved data on the Database
    socket.emit("load-document", document);

    // Make same changes on the same document to the client side
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    // Make cursor changes on the same document to the client side
    socket.on("cursor-changes", ({ range, username }) => {
      if (cursors.findIndex((cursor) => cursor.username === username) === -1) {
        cursors.push({ range, username });
      } else {
        cursors[cursors.findIndex((cursor) => cursor.username === username)] = {
          range,
          username,
        };
      }
      socket.broadcast.to(documentId).emit("receive-cursor-changes", cursors);
    });

    // Save Document on the Database
    socket.on("save-document", async (data) => {
      const existingUserIndex = document.users.findIndex(
        (user) => user.userId === data.user.email
      );
      if (existingUserIndex !== -1) {
        // Update user if ID exists
        document.users[existingUserIndex] = {
          userId: data.user.email,
          username: data.user.name,
          cursorPosition: data.cursorPosition,
          userChanges: data.data,
        };
      } else {
        // Append new user object if ID doesn't exist
        document.users.push({
          userId: data.user.email,
          username: data.user.name,
          cursorPosition: data.cursorPosition,
          userChanges: data.data,
        });
      }
      document.data = data.data;
      document.title = data.title;
      await document.save();
      // await Document.updateOne(
      //   { id },
      //   {
      //     $set: {
      //       title: data.title,
      //       data: data.data,
      //     },
      //   }
      // );
    });
  });
});
