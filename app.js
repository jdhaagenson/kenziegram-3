const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const uploaded_files = [];

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads')
    },
    filename:function(req, file, cb){
        const uniqueSuffix = Date.now() + '.png';
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

var upload = multer({storage:storage})

app.get('/', (req, res) => {
    const path='./public/uploads';
    fs.readdir(path, function(err, items) {
        console.log(items);
        const images = items.map((image) => {
            return (`<img style='height:200px' src='./uploads/${image}'/>`)
    })
    res.send(`
        <h1>Photo Sharing Service</h1>
        <form method="post" action="/upload" enctype="multipart/form-data">
            <div>
                <label for="image">Upload a picture</label>
                <input type="file" id="image" name="image">
            </div>
            <div>
                <button>Submit</button>
            </div>
        </form>
        <h2>Uploaded Images</h2>
        ${images}
        `);
    });
})

app.post('/upload', upload.single('image'), function(req, res, next){
    // request.file is the \`myFile\` file
    // request.body will hold the text fields, if there were any
    uploaded_files.push(req.file.filename);
    console.log("Uploaded: " + req.file.filename);
    fs.readdir('.public/uploads', function(err, files){
        console.log(files)
        res.send( `
            <div>
                <h1>Success!</h1>
                <form method="get" action="/" enctype="multipart/form-data">
                    <button style="display:block">Back to Home</button>
                    <img src='http://localhost:3000/uploads/${req.file.filename}'/>
                </form>
            </div>
        `)}
    )
});


app.route('/')

app.use(express.static('./public'))
const port = 3000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))