const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const morgan = require("morgan");

const db = require("./models");

db.sequelize.sync();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

//Logger
app.use(morgan("tiny"));

app.use(
    cookieSession({
        name: "session",
        secret: "COOKIE_SECRET",
        httpOnly: true,
        sameSite: "strict",
    })
);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello",
    });
});

app.use((req, res, next) => {
   res
   .status(404)
   .json({
       "message": "Error 404: Not found"
       
    });
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    });
});
