const { join } = require("path");
const express = require("express");
const logger = require("morgan");
const sassMiddleware = require("node-sass-middleware");
const hbs = require("hbs");
const path = require("path");
const mongoose = require("mongoose");
const connectMongo = require("connect-mongo");

const expressSession = require("express-session");
const MongoStore = connectMongo(expressSession);

// here the required routes
const router = require("./routes/index");

const app = express();

app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerPartials(path.join(__dirname, "views/partials"));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  sassMiddleware({
    src: join(__dirname, "public"),
    dest: join(__dirname, "public"),
    outputStyle:
      process.env.NODE_ENV === "development" ? "nested" : "compressed",
    sourceMap: false,
    force: true
  })
);
app.use(express.static(join(__dirname, "public")));

// '/' will be for regular/ unlogged user - /auth will redirect to sign in /up and all routes of logged users - /scrape for scraping purposes at this moment

app.use("/", router);

app.get("*", (req, res, next) => {
  const error = new Error("Page not found.");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 400);
  res.render("error", { error });
});

hbs.registerHelper("ifCond", function(v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

hbs.registerHelper("times", function(n, block) {
  var accum = "";
  for (var i = 0; i < n; ++i) accum += block.fn(i);
  return accum;
});

module.exports = app;
