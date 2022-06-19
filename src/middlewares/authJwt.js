const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.session.token;
    if(!token) {
        return res.status(403).json({
            message: "Error 403: No token provided"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: "Error 401: Unauthorized"
            });
        }
        req.userId = decoded.id;
        next();
    });
}

isAdmin = async(req, res, next) => {
    try{
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for(let i=0; i < roles.length; i++){
            if(roles[i].name === "admin"){
                return next();
            }
        }
        return res.status(403).json({
            message: "Error 403: Require admin role"
        });
    }
    catch(error){
        return res.status(500).json({
            message: "Error 500: Unable to validate User role",
        });
    }
}

isModerator = async(req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator");
            return next();
        }
        return res.status(403).json({
            message: "Error 403: Require moderator role",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error 500: Unable to validate Moderator role!"
        });
    }
}

isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++){
            if (roles[i].name === "moderator") {
                return next();
            }
            if (roles[i].name === "admin") {
                return next();
            }
        }
        return res.status(403).json({
            message: "Error 403: Require moderator or admin role",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Error 500: Unable to validate moderator or admin role"
        });
    }
}

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin
}

module.exports = authJwt;
