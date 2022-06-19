const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });
        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    }
                }
            });
            const result = user.setRoles(roles);
            if (result) {
                res.json({ message: "User registered successfully!" });
            }
        } else {
            const result = user.setRoles([1]);
            if (result) {
                res.json({ message: "User registered successfully!" });
            }
        }
    } catch (error) {
        res.status(500).send({ message: "Error 500: " + error.message });
    }
}

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "Error 404: Not found" });
        }
        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }
        const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400, //24 hours
        });

        let authorities = [];
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++){
            authorities.push("ROLE_" + roles[i].name.toUppperCase());
        }

        req.session.token = token;

        return res.status(200).json({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities
        });
    } catch (error) {
        return res.status(500).json({ message: "Error 500: " + error.message });
    }
}

exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.status(200).json({
            message: "You've been signed out!"
        });
    } catch (error) {
        this.next(error);
    }
}
