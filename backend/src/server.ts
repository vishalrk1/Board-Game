import dotenv from "dotenv";
dotenv.config();

import server from "./index";
import { connectDatabase } from "./config/database";

const PORT = process.env.PORT || 8080;

// connectDatabase().then(() => {
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// });
