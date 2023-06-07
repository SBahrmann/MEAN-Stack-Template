"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const user_model_1 = require("../models/user.model");
const express_1 = require("express");
class UserRoute {
    router;
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.get("/all", this.getAllUsers);
        this.router.get("/", this.getUsers);
        this.router.get("/:id", this.getUserById);
        this.router.post("/", this.createUser);
        this.router.put("/:id", this.updateUser);
        this.router.delete("/:id", this.deleteUser);
    }
    getAllUsers = async (req, res) => {
        try {
            const users = await user_model_1.UserModel.find();
            const resUser = users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                theme: user.theme,
            }));
            res.status(200).json(resUser);
        }
        catch (error) {
            res.status(500).send('Error: ' + error);
        }
    };
    getUsers = async (req, res) => {
        try {
            const users = await user_model_1.UserModel.find({ deleted: { $ne: true } });
            const resUser = users.map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                theme: user.theme,
            }));
            res.status(200).json(resUser);
        }
        catch (error) {
            res.status(500).send('Error: ' + error);
        }
    };
    getUserById = async (req, res) => {
        try {
            const user = await user_model_1.UserModel.findById(req.params.id);
            if (!user) {
                res.status(404).send();
                return;
            }
            const resUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                theme: user.theme,
            };
            res.status(200).json(resUser);
        }
        catch (error) {
            res.status(500).send('Error: ' + error);
        }
    };
    createUser = async (req, res) => {
        try {
            const password = req.body.password;
            const user = await user_model_1.UserModel.create({ ...req.body, password });
            const resUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                theme: user.theme,
            };
            res.status(200).json(resUser);
        }
        catch (error) {
            res.status(500).send('Error: ' + error);
        }
    };
    updateUser = async (req, res) => {
        try {
            const userId = req.params.id;
            const updatedUser = req.body;
            if (updatedUser.password) {
                updatedUser.password = updatedUser.password;
            }
            else {
                delete updatedUser.password;
            }
            const user = await user_model_1.UserModel.findByIdAndUpdate(userId, updatedUser, { new: true });
            if (!user) {
                res.status(404).send();
                return;
            }
            const resUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                theme: user.theme,
            };
            res.status(200).json(resUser);
        }
        catch (error) {
            if (error.codeName === 'DuplicateKey') {
                res.status(500).send('Error: E-Mail Address exists');
            }
            else {
                console.log(error);
                res.status(500).send('Error: ' + error);
            }
        }
    };
    deleteUser = async (req, res) => {
        try {
            const user = await user_model_1.UserModel.findOneAndUpdate({ _id: req.params['id'] }, { deleted: true }, { new: true });
            if (!user) {
                res.status(404).send();
            }
            else {
                const resUser = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    theme: user.theme,
                };
                res.status(200).json(resUser);
            }
        }
        catch (error) {
            res.status(500).send('Error: ' + error);
        }
    };
}
exports.UserRoute = UserRoute;
exports.default = new UserRoute();
//# sourceMappingURL=user.route.js.map