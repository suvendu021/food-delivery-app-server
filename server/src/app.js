import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fetch from "cross-fetch";
import { userRouter } from "./router/user.router.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: "12kb" }));

app.use(express.json({ limit: "12kb" }));

app.use(cookieParser());

// For Restaurant API
app.get("/api/restaurants", async (req, res) => {
  const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=20.3337692&lng=85.8240867&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// For Restaurant Mobile API
app.get("/mapi/restaurants", async (req, res) => {
  const url = `https://www.swiggy.com/mapi/homepage/getCards?lat=20.3337692&lng=85.8240867`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// For Menu API
app.get("/api/menu/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  //   console.log(req.params);

  const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=20.3337692&lng=85.8240867&restaurantId=${restaurantId}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    // console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.use("/api/v1/user", userRouter);

export { app };
