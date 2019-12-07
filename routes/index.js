const { Router } = require("express");
const router = new Router();
const Event = require("./../models/event");
const express = require("express");
const hbs = require("hbs");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/formpage", (req, res, next) => {
  res.render("formpage");
});

hbs.registerPartials(__dirname + "./../views/partials"); // not sure this is needed here

/* router.post("/formpage", (req, res, next) => {
  res.render("formpage");
}); */

router.post("/formpage", (req, res, next) => {
  let { name, participants, days, plastic } = req.body;
  Event.create({ name, participants, days })
    .then(event => {
      console.log(event._id);
      res.redirect(`/result/${event._id}`);
    })
    .catch(err => {
      next(err);
    });
});

router.get("/result/:id", (req, res, next) => {
  let eventId = req.params.id;
  Event.findById(eventId).then(event => {
    console.log(event);
    res.render("result", { event });
  });
});

router.get("/pricing", (req, res, next) => {
  res.render("pricing");
});
router.get("/calltoaction", (req, res, next) => {
  res.render("calltoaction");
});
module.exports = router;
