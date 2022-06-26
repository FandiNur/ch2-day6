const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req , res, callback) => {
    callback(null,"uploads") //image storage
  },
  filename: (req, file, callback)=>{
    callback(null, Date.now() +"-"+ file.originalname) //rename file image
  }
})


const upload = multer({storage}) 

module.exports = upload //call to index.js