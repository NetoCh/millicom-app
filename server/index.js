const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/data', async (req, res) => {
try {
    const id = req.query.id;
    if(!id) throw "No id provided";

    const url = id > 0 ? `https://xkcd.com/${id}/info.0.json` : "https://xkcd.com/info.0.json";

    const response = await axios.get(url);
    
    res.json({
        success: true,
        data: response.data
    })
} catch (error) {
    res.json({
        success: false,
        message: "error",
        error
    })
}   
});

const PORT = process.env.PORT || '3001';
app.listen(PORT, () => { })
console.log("Server started at port: ", PORT);