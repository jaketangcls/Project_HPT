const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose')

const app = express()
app.use(cors());
const port = 3000

const url = process.env.MONGODB_URI;

const connectionParams = {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
}

const itemSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: String,
    rating: Number,
    price: Number,
});

console.log('Connecting to the database ' + process.env.MONGODB_URI);
mongoose.connect(url, connectionParams)
    .then(conn => {
        console.log('Connected to the database');
        const model = conn.model('ShoppingItem', itemSchema);

        app.get('/shopping/search/:keyword', (req, res) => {
            const keyword = req.params.keyword;
            const rval = model.find({ name: { $regex: keyword, $options: 'i' } }).exec();
            rval.then((result, err) => {
                if (err) {
                    res.json({ error: err });
                    return;
                }
                res.json(result);
            });
        });
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
        app.get('/', (req, res) => {
            res.send('Error connecting to the database');
        });
    })

app.get('/', (req, res) => {
    mongoose.connect(url, connectionParams)
        .then(conn => {
            console.log('Connected to the database');
            res.send('Hello World!');
        })
});

app.get('/shopping/items/all', (req, res) => {
    mongoose.connect(url, connectionParams)
        .then(conn => {
            console.log('Connected to the database');
            const model = conn.model('ShoppingItem', itemSchema);
            const rval = model.find({}).exec();
            rval.then((result, err) => {
                if (err) {
                    res.json({ error: err });
                    return;
                }
                res.json(result);
            });
        })
});

// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// });

module.exports = app;
