import express from 'express'

const searchRouter = express.Router()


searchRouter.get("/autocomplete/:id", async (req, res) => {
    const query = req.params.id
     const response = await fetch(`https://suggestqueries.google.com/complete/search?client=chrome&q=${query}`)
     const data = await response.json() as string[][]
     console.log(data)
    res.status(200).json({data:data[1]}); 
})

searchRouter.get("/search/:q", async (req, res) => {
    const q = req.params.q
    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.append('key', 'AIzaSyCArdW91vTSFTn_VY9kGWB33MAclJ2D1wk');
    url.searchParams.append('cx', '07ef0d9b7e3454b6b');
    url.searchParams.append('q', q??'');

    const response = await fetch(url.toString());
    const result = await response.json().items[0].link;

    res.status(200).json({data:`<iframe id="price_frame" src="https://pricehistoryapp.com/embed/${
        result.split("/")[4]
      }" width="100%" height="500" frameborder="0" allowtransparency="true" scrolling="no"></iframe>`
    });
})




export default searchRouter;
