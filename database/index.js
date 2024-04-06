// Purpose: This file is used to populate the database with mock data.
//         The mock data is read from the mock_data.json file and inserted into the database.
//         The database is hosted on MongoDB Atlas and the connection string is stored in the url variable.

const mongoose = require('mongoose')
const { readFileSync } = require('fs');
const mockData = JSON.parse(readFileSync('./mock_data.json', 'utf-8'));

const url = `mongodb+srv://pangpang:rfogAsjJW8SDPvI2@pang-database.jzjne1t.mongodb.net/?retryWrites=true&w=majority&appName=pang-database`;

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

mongoose.connect(url, connectionParams)
    .then(conn => {
        console.log('Connected to the database');
        const model = conn.model('ShoppingItem', itemSchema);

        for (const data of mockData) {
            const item = new model(data);
            item.save();
        }
    })
    .catch((err) => {
        console.error(`Error connecting to the database. n${err}`);
    })
