const express = require('express');
const Model = require('../models/UserModels'); // import the model
const jwt = require('jsonwebtoken'); // import the jwt library
require('dotenv').config(); // import the dotenv library to use environment variables

const router= express.Router();

router.post('/add' , (req, res) => {
    console.log(req.body);
    
    new Model(req.body).save()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        if(err?.code === 11000){
        res.status(400).json({message:"Email already registered"});
        }
        else{
            res.status(500).json({message:"Some error occured"});
        }

       
    });
});

router.post('/login', async (req, res) => {
    try{
        const {email , password} = req.body;
        const user = await Model.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid Email or password"});
    }
    if(user.password !== password){
        return res.status(401).json({message: "Invalid Email or password"});
    }

    const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '24h'});
    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    });
}
catch(error){
    console.log('Login error:',error);
    res.status(500).json({message: "Some error occured"});
}
});



// getall
router.get('/getall', (req, res) =>{
   Model.find()
   .then((result) => {
    res.status(200).json(result);
    })
    .catch((err) => {
    console.log(err);
    res.status(500).json(err);
   });
});


//: denotes url parameter
router.get('/getbycity/:city', (req, res)=>{
   Model.find({city : req.params.city})
 .then((result) => {
    res.status(200).json(result);
 })
 .catch((err) => {
    console.log(err);
    res.status(500).json(err);
    
 });
})

//get by email
router.get('/getbyemail2:email', (req, res) =>{
    Model.findOne({email : req.params.email})
    .then((result) => {
     res.status(200).json(result);
     })
     .catch((err) => {
     console.log(err);
     res.status(500).json(err);
    });
 });
 

//getbyid
router.get('/getbyid/:id', (req, res) =>{
    Model.findById(req.params.id)
    .then((result) => {
     res.status(200).json(result);
     })
     .catch((err) => {
     console.log(err);
     res.status(500).json(err);
    });
 });

 
 
//update
router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, res.body)
    .then((result) => {
        res.status(200).json(result);
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
       });
    
});



//delete
router.delete('/delete/:id', (req, res) =>{
  Model.findByIdAndDelete(req.params.id)
  .then((result) => {
    res.status(200).json(result);
    })
    .catch((err) => {
    console.log(err);
    res.status(500).json(err);
   });
});


router.post('/authenticate', (req, res)=>{

    Model.findOne(req.body)
    .then((result)=>{
        if(result){
            const {_id, name, email} = result; // destructuring the result array to get the first object
            const payload = { _id, name, email }; // creating a payload object with the id and name of the user
            jwt.sign(
                payload, // payload object
                process.env.JWT_SECRET, // secret key from .env file
                { expiresIn: '1h' }, // options object
                (err, token)=>{
                    if(err){
                        consol.log(err);
                        res.status(500).json({message:"Some error occured while generating token"});
                    }else{
                        res.status(200).json({token});
                    }
                }
            )
        }
        else{
            res.status(400).json({message:"Invalid credentials"});
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });

}
)


module.exports = router;