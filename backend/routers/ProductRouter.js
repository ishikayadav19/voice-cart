const express = require('express');
const Model = require('../models/ProductModels'); // import the model
const router= express.Router();


router.post('/add' , (req, res) => {
    console.log('Adding product:', req.body);
    
    // Set default values for required fields if not provided
    const productData = {
        ...req.body,
        rating: req.body.rating || 0,
        inStock: req.body.inStock ?? true,
        featured: req.body.featured ?? false,
        stock: req.body.stock || 0
    };
    
    new Model(productData).save()
    .then((result) => {
        console.log('Product added successfully:', result);
        res.status(200).json(result);
    }).catch((err) => {
        console.error('Error adding product:', err);
        if(err?.code === 11000) {
            res.status(400).json({message: "Product already registered"});
        } else {
            res.status(500).json({
                message: "Error adding product",
                error: err.message
            });
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
    const { id } = req.params;
    const updateData = {
        ...req.body,
        rating: req.body.rating || 0,
        inStock: req.body.inStock ?? true,
        featured: req.body.featured ?? false,
        stock: req.body.stock || 0
    };

    Model.findByIdAndUpdate(id, updateData, { new: true })
    .then((result) => {
        if (!result) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(result);
    })
    .catch((err) => {
        console.error('Error updating product:', err);
        res.status(500).json({
            message: 'Failed to update product',
            error: err.message
        });
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

// Get products by category
router.get('/category/:category', (req, res) => {
  const { category } = req.params;
  
  Model.find({ category: category })
    .then((products) => {
      if (products.length === 0) {
        return res.status(404).json({ message: 'No products found in this category' });
      }
      res.status(200).json(products);
    })
    .catch((err) => {
      console.error('Error fetching products by category:', err);
      res.status(500).json({ message: 'Failed to fetch products', error: err });
    });
});

module.exports = router;
