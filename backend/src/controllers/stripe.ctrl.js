require('dotenv').config();
const { STRIPE_SKEY } = process.env;
const order = require('../models/order');
const Order = require('../models/order');
const { stripePrice } = require('../utils/priceForStripe');
const stripe = require('stripe')(STRIPE_SKEY);


const create = async (req, res, next) => {
    try {
        const orderId = req.params.id;

        const YOUR_DOMAIN = `http://localhost:3000/orders/post-sale?external_reference=${orderId}`

        //? order
        let items = [];
        const order = await Order.findById(orderId);

        for (const prod of order.products) {
            items.push({
                price_data: {
                    currency: 'ars',
                    unit_amount: prod.on_sale ? stripePrice(prod.sale_price) : stripePrice(prod.price),
                    product_data: {
                        name: prod.product_name,
                        images: [prod.img]
                    },
                },
                quantity: prod.quantity,
            })
        };

        //: payment_method_types: 'card';
        const session = await stripe.checkout.sessions.create({
            line_items: items,
            shipping_options: [{
                shipping_rate_data: {
                    display_name: order.free_shipping ? 'con descuento' : 'normal',
                    type: 'fixed_amount',
                    fixed_amount: {
                        currency: 'ars',
                        amount: order.shipping_cost === 0 ? 0 : order.shipping_cost * 100
                    }
                }
            }],
            mode: 'payment',
            success_url: `${YOUR_DOMAIN}&status=approved`,
            cancel_url: `${YOUR_DOMAIN}&status=canceled`,
        });

        //? setea el link de pago y la expiración de 24hrs (max de stripe)
        const expiration = new Date(Date.now() + 75600000).toISOString().slice(0, -1) + '-03:00';
        await Order.findByIdAndUpdate(orderId,
            {
                "$set": {
                    payment_link: session.url,
                    expiration_date_to: expiration,
                    payment_source: 'Stripe'
                }
            });

        return res.json(session.url);
        //return res.redirect(303, session.url);
    } catch (error) {
        //return res.json(error.raw.message);
        next(error)
    }
};

module.exports = {
    create
};