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
