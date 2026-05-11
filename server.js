const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Replace with your Tuma credentials from https://merchant.tuma.co.ke
const TUMA_API_URL = 'https://api.tuma.co.ke';
const BUSINESS_EMAIL = 'your-business-email@example.com';
const API_KEY = 'your-tuma-api-key';

// Get JWT Token
async function getToken() {
    const response = await axios.post(`${TUMA_API_URL}/auth/login`, {
        email: BUSINESS_EMAIL,
        apiKey: API_KEY
    });
    return response.data.token;
}

// STK Push Endpoint
app.post('/api/stk-push', async (req, res) => {
    try {
        const { phone, amount, description } = req.body;
        
        const token = await getToken();
        
        const response = await axios.post(`${TUMA_API_URL}/payment/stk-push`, {
            amount: amount,
            phone: phone,
            description: description,
            callback_url: 'https://your-domain.com/api/callback' // Replace with your callback URL
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        res.json({
            success: true,
            checkoutRequestID: response.data.data.checkout_request_id,
            message: 'STK Push initiated'
        });
    } catch (error) {
        console.error('STK Push Error:', error.response?.data || error.message);
        res.status(500).json({ success: false, message: error.response?.data?.message || 'Payment failed' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
