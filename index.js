const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		method: ["GET", "POST"],
	},
});
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
	res.send("Hello World!");
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("user-disconnected", socket.id);
	});

	socket.on("calluser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("calluser", { signal: signalData, from, name });
	});

	socket.on("answercall", (data) => {
		io.to(data.to).emit("callaccepted", data);
	});
});

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
