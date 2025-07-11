// importing express
const express = require('express'); //package ka naam variable bna kr import kr dega
require('dotenv').config(); //cannot be import direclty, import krne ke liye configure krna pdhta h en packages ko

// Check if environment variables are loaded
console.log('Checking .env variables in index.js:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD is set:', !!process.env.EMAIL_PASSWORD);

const UserRouter = require('./routers/UserRouter')
const ProductRouter = require('./routers/ProductRouter')
const SellerRouter = require('./routers/SellerRouter') //importing the router for the seller routes
const reviewRouter = require('./routers/review');
const AdminPublicRouter = require('./routers/AdminPublicRouter'); // Import the new public admin router
const orderRouter = require('./routers/OrderRouter');
const emailRouter = require('./routers/emailRouter'); // Add this line

// initialize express
const app = express();
const cors = require('cors'); //importing cors package

const port = process.env.PORT || 5000 ;//env variable ko import krne ke liye process.env krte h
// middlewares
app.use(cors({
    origin: '*', //allow all domains to access the server
    
}))
app.use(express.json()); // to parse the json data from the body of the request

app.use('/user',UserRouter);
app.use('/product',ProductRouter);
app.use('/seller',SellerRouter); //use the router for the seller routes
app.use('/api/reviews', reviewRouter);
app.use('/api/admin', AdminPublicRouter); // Use the public admin router
app.use('/api/orders', orderRouter);
app.use('/order', orderRouter);
app.use('/api/email', emailRouter); // Add this line

// endpoint or routes
app.get('/', (req, res) => {
res.send("response from express")
})

app.get('/add', (req, res) => {
    res.send("response from add")
    })

app.get('/getall', (req, res) => {
        res.send("response from getall")
        })


app.get('/delete', (req, res) => {
            res.send("response from delete")
            })

app.get('/update', (req, res) => {
                res.send("response from update")
                })


// starting a server
app.listen(port,()=> {
    console.log('server started');
} /*callback*/);

