const router = require("express").Router();
const sequelize = require("../config/connection");
const {Post, User, Comments} = require("../models");


router.get("/", (req, res) => {
    res.render("dashboard", {loggedIn: true});
});

















module.exports = router;