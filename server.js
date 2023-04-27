const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
const fs = require('fs')
const multer = require('multer')
app.use(cors())
app.use(express.json())
require('dotenv').config()

const { Configuration, OpenAIApi } = require("openai");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb)=> {
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({storage: storage}).single('file')

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});
const openai = new OpenAIApi(configuration);

let filePath
app.post('/images', async (req,res)=> {
try {
const response = await openai.createImage({
  prompt: req.body.message,
  n: 6,
  size: "512x512",
})
console.log(response.data.data)
res.send(response.data.data)
  } catch (error){
    console.error(error)
  }



})

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
        return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    console.log(req.file.path)
    filePath = req.file.path
  })
})
app.post('/variations', async (req, res)=> {
  try {
      const response = await openai.createImageVariation(
        fs.createReadStream(filePath),
        4,
        "512x512"
      )
      res.send(response.data.data)
      } catch(error) {
        console.error(error)
      }
  }
)

app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))