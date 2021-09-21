const path = require("path");
const express = require("express");
const routes = require("./controllers");
const sequelize = require("./config/connection");

// Handlebars Template
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));

// Handlebars Template Engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// turn on routes
app.use(routes);

// sequelize.sync({force: true}).then(() => {
//     app.listen(PORT, () => console.log("Now listening"));
// });

sequelize.sync({force: false}).then(() => {
    app.listen(PORT, () => console.log("Now listening"));
});
