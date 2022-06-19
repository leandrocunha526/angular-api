const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.body.username,
            }
        });

        if (user) {
            return res.send(400).json({
                message: "Error 400: Failed username is already in use"
            });
        }

        user = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (user) {
            return res.status(400).send({
                message: "Error 400: Email is already in use"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: "Error 500: " + error.message
        });
    }
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++){
            if (!ROLES.includes(req.body.roles[i])) {
                res.status(400).json({
                    message: "Error 400: Role does not exist = " + req.body.roles[i]
                });
                return;
            }
        }
    }
    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
}

module.exports = verifySignUp;
