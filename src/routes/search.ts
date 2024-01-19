import express from 'express'

const searchRouter = express.Router()


searchRouter.get("/autocomplete/:id", async (req, res) => {
    const query = req.params.id
     const response = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${query}`)
     const data = await response.json() as string[][]
     console.log(data)
    res.status(200).json({data:data[1]}); 
})

export default searchRouter;
