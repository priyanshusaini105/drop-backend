import express from 'express'

const searchRouter = express.Router()

searchRouter.get("/search", async (req, res) => {
    res.send("Hello World!");
})

export default searchRouter;
