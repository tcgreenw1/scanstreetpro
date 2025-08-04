import "dotenv/config";
import { createServer } from "./createServer.js";

const port = process.env.PORT || 8080;
const app = createServer();

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
