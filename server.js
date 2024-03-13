const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors"); // Import the cors middleware

const app = express();
const port = 3050;

app.use(express.json());
app.use(cors()); // Use the cors middleware

app.post("/metadata", async (req, res) => {
  const { url } = req.body;

  try {
    // Fetch HTML content of the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);

    // Extract title and favicon
    const title = $("title").text();
    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");

    // Send JSON response with the desired format
    res.json({ title, image: favicon });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching metadata." });
  }
});

// GET route for metadata retrieval
app.get("/metadata", async (req, res) => {
  const { url } = req.query;

  try {
    // Fetch HTML content of the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Use Cheerio to parse the HTML
    const $ = cheerio.load(html);

    // Extract title and favicon
    const title = $("title").text();
    const favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href");

    const modifiedURL =
      url[url.length - 1] === "/" ? url.substring(0, url.length - 1) : url;

    // Send JSON response with the desired format
    res.json({
      title,
      image: `${modifiedURL}/${favicon.replace("/", "")}`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching metadata." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
