const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.get("/api/all", userController.allAccess);

    app.get("/api/user", [authJwt.verifyToken], userController.userBoard);

    app.get(
        "/api/mod",
        [authJwt.verifyToken, authJwt.isModerator],
        userController.moderatorBoard
    );

    app.get(
        "/api/admin",
        [authJwt.verifyToken, authJwt.isAdmin],
        userController.adminBoard
    );
};
