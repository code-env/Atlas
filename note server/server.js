import mongoose from "mongoose";
import Document from "./Document.js";
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://zenith:Hh0feUGzbxKod4qY@atlas.70hcd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: "true",
        useUnifiedTopology: "true",
      }
    );
    console.log("connected to DB");
  } catch (error) {
    console.log(error.message);
  }
};

connectDB();

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

async function findOrCreateDocument(id) {
  if (id == null) return;
  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
