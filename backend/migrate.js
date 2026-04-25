require('dotenv').config();
const mongoose = require('./connection');
const { createClient } = require('@supabase/supabase-js');

// Mongoose Models
const User = require('./models/UserModels');
const Seller = require('./models/SellerModels');
const Product = require('./models/ProductModels');
const Order = require('./models/OrderModel');
const Review = require('./models/ReviewModels');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bpbmoupfjsmztolftaeh.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYm1vdXBmanNtenRvbGZ0YWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwODgzMDAsImV4cCI6MjA5MjY2NDMwMH0.Oz36ONSAVl124bmqwjwJVCe86W1h-KwACqo_9G_JOc8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
    try {
        console.log("Starting Migration...");

        // 1. Migrate Users
        console.log("Fetching Users...");
        const users = await User.find();
        if (users.length > 0) {
            const usersData = users.map(u => ({
                id: u._id.toString(),
                name: u.name || '',
                email: u.email || '',
                password: u.password,
                city: u.city || 'unknown',
                phone: u.phone || '',
                created_at: u.createdAt || new Date(),
                wishlist: u.wishlist ? u.wishlist.map(w => w.toString()) : []
            }));
            const { error } = await supabase.from('usersdata').upsert(usersData);
            if (error) console.error("Error migrating users:", error);
            else console.log(`Migrated ${users.length} users.`);
        }

        // 2. Migrate Sellers
        console.log("Fetching Sellers...");
        const sellers = await Seller.find();
        if (sellers.length > 0) {
            const sellersData = sellers.map(s => ({
                id: s._id.toString(),
                name: s.name || '',
                email: s.email || '',
                password: s.password,
                confirm_password: s.confirmPassword || s.password,
                phone: s.phone || '',
                store_name: s.storeName || '',
                address: s.address || 'Not provided',
                is_approved: s.isApproved || false,
                approved_at: s.approvedAt || null,
                created_at: s.createdAt || new Date()
            }));
            const { error } = await supabase.from('sellersdata').upsert(sellersData);
            if (error) console.error("Error migrating sellers:", error);
            else console.log(`Migrated ${sellers.length} sellers.`);
        }

        // 3. Migrate Products
        console.log("Fetching Products...");
        const products = await Product.find();
        if (products.length > 0) {
            const productsData = products.map(p => ({
                id: p._id.toString(),
                name: p.name || '',
                description: p.description || '',
                price: p.price || 0,
                discount_price: p.discountPrice || 0,
                category: p.category || '',
                images: p.images || [],
                main_image: p.mainImage || '',
                stock: p.stock || 0,
                brand: p.brand || '',
                rating: p.rating || 0,
                in_stock: p.inStock || false,
                featured: p.featured || false,
                wishlist: p.wishlist ? p.wishlist.map(w => w.toString()) : [],
                seller: p.seller ? p.seller.toString() : null,
                created_at: p.createdAt || new Date()
            }));
            const { error } = await supabase.from('productsdata').upsert(productsData);
            if (error) console.error("Error migrating products:", error);
            else console.log(`Migrated ${products.length} products.`);
        }

        // 4. Migrate Reviews
        console.log("Fetching Reviews...");
        const reviews = await Review.find();
        if (reviews.length > 0) {
            const reviewsData = reviews.map(r => ({
                id: r._id.toString(),
                product_id: r.productId.toString(),
                user_id: r.userId.toString(),
                rating: r.rating || 1,
                comment: r.comment || '',
                created_at: r.createdAt || new Date()
            }));
            const { error } = await supabase.from('reviews').upsert(reviewsData);
            if (error) console.error("Error migrating reviews:", error);
            else console.log(`Migrated ${reviews.length} reviews.`);
        }

        // 5. Migrate Orders & Order Items
        console.log("Fetching Orders...");
        const orders = await Order.find();
        if (orders.length > 0) {
            const ordersData = [];
            const orderItemsData = [];
            
            for (const o of orders) {
                ordersData.push({
                    id: o._id.toString(),
                    customer_name: o.customerName || '',
                    email: o.email || '',
                    total_amount: o.totalAmount || 0,
                    shipping_address: o.shippingAddress || {},
                    payment_method: o.paymentMethod || '',
                    order_number: o.orderNumber || '',
                    razorpay_order_id: o.razorpayOrderId || null,
                    razorpay_payment_id: o.razorpayPaymentId || null,
                    razorpay_signature: o.razorpaySignature || null,
                    status: o.status || 'pending',
                    delivery_date: o.deliveryDate || null,
                    created_at: o.createdAt || new Date()
                });

                if (o.items && o.items.length > 0) {
                    for (const item of o.items) {
                        orderItemsData.push({
                            id: item._id ? item._id.toString() : new mongoose.Types.ObjectId().toString(),
                            order_id: o._id.toString(),
                            product_id: item.productId ? item.productId.toString() : null,
                            seller_id: item.sellerId ? item.sellerId.toString() : null,
                            name: item.name || '',
                            quantity: item.quantity || 1,
                            price: item.price || 0,
                            status: item.status || 'pending'
                        });
                    }
                }
            }
            
            const { error: orderError } = await supabase.from('orders').upsert(ordersData);
            if (orderError) console.error("Error migrating orders:", orderError);
            else console.log(`Migrated ${orders.length} orders.`);

            if (orderItemsData.length > 0) {
                const { error: itemError } = await supabase.from('order_items').upsert(orderItemsData);
                if (itemError) console.error("Error migrating order items:", itemError);
                else console.log(`Migrated ${orderItemsData.length} order items.`);
            }
        }

        console.log("✅ Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Migration Failed:", err);
        process.exit(1);
    }
}

migrate();
