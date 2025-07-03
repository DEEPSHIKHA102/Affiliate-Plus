const Razorpay = require('razorpay');
const CREDIT_PACKS = require("../constants/paymentConstants");
const crypto = require('crypto');
const Users = require('../model/Users');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const paymentController = {
    // Step #1 from the sequence diagram of one-time payment workflow
    createOrder: async (request, response) => {
        try {
            const { credits } = request.body;

            if (!CREDIT_PACKS[credits]) {
                return response.status(400).json({
                    message: 'Invalid credit value'
                });
            }

            const amount = CREDIT_PACKS[credits] * 100; // Convert to paisa

            const order = await razorpay.orders.create({
                amount: amount,
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });

            response.json({
                order: order
            });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    // Step #7 from the sequence diagram of one-time payment workflow
    verifyOrder: async (request, response) => {
        try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                credits
            } = request.body;

            const body = razorpay_order_id + "|" + razorpay_payment_id;

            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');

            if (expectedSignature !== razorpay_signature) {
                return response.status(400).json({
                    message: 'Signature verification failed'
                });
            }

            const user = await Users.findById({ _id: request.user.id });
            user.credits += Number(credits);
            await user.save();

            response.json({ user: user });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    },
};

module.exports = paymentController;
