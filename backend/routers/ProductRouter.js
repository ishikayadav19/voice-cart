const express = require('express');
const Model = require('../models/ProductModels'); // import the model
const router= express.Router();


router.post('/add' , (req, res) => {
    console.log(req.body);
    
    new Model(req.body).save()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        if(err?.code === 11000){
        res.status(400).json({message:"Product already registered"});
        }
        else{
            res.status(500).json({message:"Some error occured"});
        }

       
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



// DELETE /product/delete/:id
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  Model.findByIdAndDelete(id)
    .then((deletedProduct) => {
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    })
    .catch((err) => {
      console.error('Error deleting product:', err);
      res.status(500).json({ message: 'Failed to delete product', error: err });
    });
});


  



module.exports = router;
