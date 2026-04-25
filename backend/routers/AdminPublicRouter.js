const express = require('express');
const router = express.Router();
const supabase = require('../connection');
const { sendEmail } = require('../services/emailService');

// Admin Dashboard Stats
router.get('/dashboard', async (req, res) => {
  try {
    const { count: totalUsers } = await supabase.from('usersdata').select('*', { count: 'exact', head: true });
    const { count: totalSellers } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', true);
    const { count: totalProducts } = await supabase.from('productsdata').select('*', { count: 'exact', head: true });
    const { count: pendingSellers } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', false);

    const { data: recentUsers } = await supabase.from('usersdata').select('*').order('created_at', { ascending: false }).limit(5);
    const { data: recentSellers } = await supabase.from('sellersdata').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(5);
    const { data: recentProducts } = await supabase.from('productsdata').select('*, sellersdata(*)').order('created_at', { ascending: false }).limit(5);

    res.json({
      stats: { totalUsers, totalSellers, totalProducts, pendingSellers },
      recent: {
        users: (recentUsers || []).map(u => ({ ...u, _id: u.id, createdAt: u.created_at })),
        sellers: (recentSellers || []).map(s => ({ ...s, _id: s.id, createdAt: s.created_at, storeName: s.store_name })),
        products: (recentProducts || []).map(p => ({ ...p, _id: p.id, createdAt: p.created_at, mainImage: p.main_image, seller: p.sellersdata }))
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get all users with pagination
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { count: total } = await supabase.from('usersdata').select('*', { count: 'exact', head: true });
    const { data: users } = await supabase.from('usersdata').select('*').order('created_at', { ascending: false }).range(skip, skip + limit - 1);

    res.json({
      users: (users || []).map(u => ({ ...u, _id: u.id, createdAt: u.created_at })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('usersdata').delete().eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Update user status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('usersdata').update({ status }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User status updated successfully', user: { ...data, _id: data.id } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
});

// Get all products with pagination
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { count: total } = await supabase.from('productsdata').select('*', { count: 'exact', head: true });
    const { data: products } = await supabase.from('productsdata').select('*, sellersdata(*)').order('created_at', { ascending: false }).range(skip, skip + limit - 1);

    res.json({
      products: (products || []).map(p => ({ ...p, _id: p.id, seller: p.sellersdata, discountPrice: p.discount_price, mainImage: p.main_image, inStock: p.in_stock })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('productsdata').delete().eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Get all sellers with pagination (including approval status)
router.get('/sellers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { count: total } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true });
    const { count: approvedCount } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', true);
    const { count: pendingCount } = await supabase.from('sellersdata').select('*', { count: 'exact', head: true }).eq('is_approved', false);
    
    const { data: sellers } = await supabase.from('sellersdata').select('*').order('created_at', { ascending: false }).range(skip, skip + limit - 1);

    res.json({
      sellers: (sellers || []).map(s => ({ ...s, _id: s.id, isApproved: s.is_approved, storeName: s.store_name, confirmPassword: s.confirm_password, approvedAt: s.approved_at, createdAt: s.created_at })),
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSellers: total,
      approvedSellers: approvedCount,
      pendingSellers: pendingCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sellers' });
  }
});

// Delete a seller
router.delete('/sellers/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('sellersdata').delete().eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ message: 'Seller not found' });
    res.status(200).json({ message: 'Seller deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting seller' });
  }
});

// Approve/Reject seller
router.put('/sellers/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;
    
    const updateData = { is_approved: isApproved };
    if (isApproved) updateData.approved_at = new Date();

    const { data: seller, error } = await supabase.from('sellersdata').update(updateData).eq('id', id).select().single();
    if (error || !seller) return res.status(404).json({ message: 'Seller not found' });
    
    if (isApproved) {
      const subject = 'Account Approved - Voice Cart';
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Account Approved!</h2>
          <p>Dear ${seller.name},</p>
          <p>Congratulations! Your seller account has been approved by our admin team.</p>
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #444;">Account Details:</h3>
            <p><strong>Store Name:</strong> ${seller.store_name}</p>
            <p><strong>Email:</strong> ${seller.email}</p>
            <p><strong>Approved On:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You can now log in to your seller dashboard and start adding products to your store.</p>
          <p>Best regards,<br>Voice Cart Admin Team</p>
        </div>
      `;
      await sendEmail(seller.email, subject, 'Your account has been approved!', html);
    }

    res.status(200).json({ 
      message: `Seller ${isApproved ? 'approved' : 'rejected'} successfully`, 
      seller: { ...seller, _id: seller.id, isApproved: seller.is_approved, storeName: seller.store_name }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating seller approval' });
  }
});

// Update seller status
router.put('/sellers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase.from('sellersdata').update({ status }).eq('id', req.params.id).select().single();
    if (error || !data) return res.status(404).json({ message: 'Seller not found' });
    res.status(200).json({ message: 'Seller status updated successfully', seller: { ...data, _id: data.id } });
  } catch (error) {
    res.status(500).json({ message: 'Error updating seller status' });
  }
});

module.exports = router;