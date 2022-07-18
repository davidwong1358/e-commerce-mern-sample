const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const orderRoute = require('./routes/order');
const PORT = process.env.PORT || 8000;

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => { console.log("MongoDB connected successfully") })
    .catch((err) => {
        console.log(err);
    });


app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use('/api/orders', orderRoute)

app.use(express.static(path.join(__dirname, '/client/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/client/build/index.html'))
);

app.use((err, req, res, next) => {
    res.status(500).json(err);
    console.log(err);
})


app.listen(PORT, () => {
    console.log(`This server is running on port ${PORT}`);
});