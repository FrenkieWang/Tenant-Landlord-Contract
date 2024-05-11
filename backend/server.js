const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connected!");
})

// Configure Express Router
const tenantRouter = require('./routes/tenantRoute');
const addressRouter = require('./routes/addressRoute');
// const phoneRouter = require('./routes/phoneRoute');
// const orderRouter = require('./routes/orderRoute');

app.use('/tenants', tenantRouter);
app.use('/users/addresses', addressRouter);
// app.use('/phones', phoneRouter);
// app.use('/orders', orderRouter);

// Listen to the Port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// Test the Vercel
app.get("/", (req, res) => {
	res.send("You succeeded to deploy backend to Vercel!");
});