const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test review endpoints
async function testReviewSystem() {
  console.log('Testing Review System...\n');

  try {
    // Test 1: Get reviews for a product (should work without auth)
    console.log('1. Testing GET /api/reviews/product/:productId');
    const productId = '507f1f77bcf86cd799439011'; // Example product ID
    const reviewsResponse = await axios.get(`${BASE_URL}/api/reviews/product/${productId}`);
    console.log('✅ Reviews fetched successfully:', reviewsResponse.data.length, 'reviews found\n');

    // Test 2: Try to submit review without auth (should fail)
    console.log('2. Testing POST /api/reviews/submit without auth (should fail)');
    try {
      await axios.post(`${BASE_URL}/api/reviews/submit`, {
        productId: productId,
        rating: 5,
        comment: 'Test review'
      });
      console.log('❌ Should have failed without auth');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected without authentication\n');
      } else {
        console.log('❌ Unexpected error:', error.response?.data);
      }
    }

    console.log('Review system tests completed!');
    console.log('\nTo test with authentication:');
    console.log('1. Login as a user to get a token');
    console.log('2. Use the token in Authorization header: Bearer <token>');
    console.log('3. Submit reviews, update, and delete them');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testReviewSystem(); 