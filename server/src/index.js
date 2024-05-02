import "dotenv/config";
import { app } from "./app.js";

import { dbConnect } from "./db/index.js";

dbConnect()
  .then(() => {
    app.on("error", (error) => {
      console.error("express can not interact with DB", error);
      throw error;
    });
    app.get("/", (req, res) => {
      res.send("server start");
    });
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`server is listen at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("error occur during connection to DB" + error);
  });
