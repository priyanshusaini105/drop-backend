import express from "express";
import UID from "uid-safe";
import jwt from "jsonwebtoken";
import { User } from "../model";
import { ExtensionModel } from "../model/extension";

export const extensionRouter = express.Router();

extensionRouter.get("/get-extension", async (req, res) => {
    //check user is logged in
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET ?? ""
    ) as jwt.JwtPayload;
    if (!decodedToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = decodedToken.userId;
    console.log(userId);

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    const uid = UID.sync(10);
    console.log(uid);
    const extension = await ExtensionModel.create({ code: uid, user: userId });

    extension.save();

    res.status(200).json({ data: uid });
});

extensionRouter.post("/extension/verify", async (req, res) => {
    const code = req.body.code;

    const extension = await ExtensionModel.findOne({ code });
    if (!extension) {
        return res.status(404).json({ message: "Extension not found." ,verify:false});
    }

    res.status(200).json({ message: "Extension verified successfully.",verify:true,user:extension.user });
});
