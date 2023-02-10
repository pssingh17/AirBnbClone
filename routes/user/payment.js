const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()
const {v4:uuidv4} = require('uuid')
require('dotenv').config();
 
// var Publishable_Key = 'pk_test_A7jK4iCYHL045qgjjfzAfPxu'
 
const stripe = require('stripe')(process.env.Stripe_Secret_Key)
 
const router = express.Router();
 
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())
 

 
router.post('/payment', (req, res)=>{
    console.log(req.body.stripeToken)
    console.log(req.body)
    const {token,email} = req.body
    const idempotencyKey  = uuidv4()
    // Moreover you can take more details from user
// like Address, Name, etc from form
stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    // name: req.body.name,
    
    })
    .then((customer) => {
     console.log(email,source)
    return stripe.charges.create({
    amount: amount*100, // Charing Rs 25
    description: 'Web Development Product',
    currency: 'USD',
    customer: customer.id,
    receipt_email:token.email
    },{idempotencyKey});
    })
    .then((charge) => {
    res.json({message:"Success Done Payment",charge:charge}) // If no error occurs
    })
    .catch((err) => {
    res.send(err) // If some error occurs
    });
    })

 
module.exports = router
