const socketIO = require("socket.io");

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*", // In production, replace with your frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { designId } = socket.handshake.query;

    if (designId) {
      socket.join(designId);
      console.log(`User ${socket.id} joined design room: ${designId}`);
    }

    // Handle real-time canvas updates (shapes, text, movements)
    socket.on("canvas-update", (data) => {
      // Broadcast the update to everyone else in the room EXCEPT the sender
      socket.to(designId).emit("canvas-update", data);
    });

    // Optional: Handle cursor movements for "Google Docs" feel
    socket.on("cursor-move", (data) => {
      socket.to(designId).emit("cursor-move", {
        userId: socket.id,
        ...data
      });
    });

    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected from room: ${designId}`);
    });
  });

  return io;
};

module.exports = setupSocket;
