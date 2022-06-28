const History = require('../models/History');
const Product = require('../models/product');

const getHistory = async (req, res, next) => { 
    try {
        const history = await History.findOne({user: req.user._id});
        if (!history) return res.json({message: 'No history recorded'});
        
        return res.json(history);
    } catch (error) {
        next(error)
    }
 };
 
const getVisited = async (req, res, next) => { 
    try {
        const history = await History.findOne({user: req.user._id});
        if (!history) return res.json({message: 'No history recorded'});
        return res.json(history.products[0]);
    } catch (error) {
        next(error)
    }
 };

const getLastSearch = async (req, res, next) => { 
    try {
        const history = await History.findOne({user: req.user._id});
        if (!history) return res.json({message: 'No history recorded'});
        return res.json(history.last_search);
    } catch (error) {
        next(error)
    }
 };

const postVisited = async (req, res, next) => { 
    try {
        //: enviar copia de productos de meli cuando se vean los detalles
        const {
            product_name,
            product_id,
            img,
            price,
            sale_price,
            on_sale,
            discount,
            free_shipping,
            category,
        } = req.body;

        const h = await History.findOne({ 'user': req.user._id });

        if (h) {            
            h.products = h.products.filter(e => e.product_id !== req.body.product_id);
            
            if (h.products.length < 20) {
                h.products.unshift({
                    product_name,
                    product_id,
                    img,
                    price,
                    sale_price,
                    on_sale,
                    discount,
                    free_shipping,
                    category,
                });
            } else {
                h.products.unshift({
                    product_name,
                    product_id,
                    img,
                    price,
                    sale_price,
                    on_sale,
                    discount,
                    free_shipping,
                    category,
                });
                h.products.pop();
            }
            await h.save();
    
            return res.json({message: 'History updated'});
        } else {
            const h = await History.create({
                products: [{
                    product_name,
                    product_id,
                    img,
                    price,
                    sale_price,
                    on_sale,
                    discount,
                    free_shipping,
                    category,
                }],
                last_search: '',
                user: req.user._id
            });
            await h.save();

            return res.json({message: 'History updated'});
        }
    } catch (error) {
        next(error)
    }
 };

const postSearch = async (req, res, next) => { 
    try {
        //: req.body.last_search
        History.findOneAndUpdate({
            'user': req.user._id
        },
        {
            '$set': {
                'last_search': req.body.last_search
            }
        });
        return res.json({message: 'Last search updated'});
    } catch (error) {
        next(error)
    }
 };

module.exports = {
    getHistory,
    getVisited,
    getLastSearch,
    postVisited,
    postSearch,
}