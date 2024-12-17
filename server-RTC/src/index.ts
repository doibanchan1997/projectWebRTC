// Import the 'express' module
import app from "./app";
import SignalingServer from "./services/SignalingServer";

const PORT = 4000;
const server = new SignalingServer(PORT);

server.start();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
