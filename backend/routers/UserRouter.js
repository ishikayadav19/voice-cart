const express = require('express');
const Model = require('../models/UserModels'); // import the model
const jwt = require('jsonwebtoken'); // import the jwt library
require('dotenv').config(); // import the dotenv library to use environment variables

const router= express.Router();

// Move authMiddleware to the top before any routes use it
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
};

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
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
        res.status(200).json(result);
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
       });
});

// Update current user's profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'city'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await Model.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
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

// Get current user's profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await Model.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;