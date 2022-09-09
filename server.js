const express = require("express");
const mongoose = require("mongoose");

const ShortUrl = require("./models/shortUrl");

const app = express();

mongoose
  .connect(
    "mongodb+srv://mpaukov:VZgNurGakuK52kSR@cluster0.kfqsf.mongodb.net/URLS?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Database connection successful.");
    app.listen(process.env.PORT || 4000);
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls });
});

app.post("/shortURL", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullURL });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks += 1;
  shortUrl.save();
  res.redirect(shortUrl.full);
});
