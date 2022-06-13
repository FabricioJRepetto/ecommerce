//: checkear 'cart' al crear orden

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/common/Modal";
import {useModal} from "../../hooks/useModal";
import { cartTotal } from "../../Redux/reducer/cartSlice";
import QuantityInput from "./QuantityInput";
import axios from "axios";
import { redirectToMercadoPago } from "../../helpers/mpCho";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const total = useSelector((state) => state.cartReducer.total);
    const [isOpen, openModal, closeModal, prop] = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getCart();
    // eslint-disable-next-line    
    }, [])

    const getCart = async () => {
        const { data } = await axios('/cart/');

        console.log(data);
        typeof data !== 'string' &&
        setCart(data.products);
        dispatch(cartTotal(data.total));
    };

    const deleteProduct = async (id) => {
        await axios.delete(`/cart/${id}`)

        getCart();
        closeModal();
    };

    const goCheckout = async () => {
        // crea la order       
        const { data: id } = await axios.post(`/order/`);
        // con la id inicia el checkout
        navigate(`/checkout/${id}`);
    };

    const openMP = async () => { 
        const { data }  = await axios.get('/mercadopago/')
        console.log(data.id);
        redirectToMercadoPago(data.id);
     }

    const checkpayment = async () => {
     }

    return (
        <div id="checkout-container">
            <Modal isOpen={isOpen} closeModal={closeModal}>
                <h1>You want to delete this product?</h1>
                <div>
                    <button onClick={closeModal}>Cancel</button>
                    <button onClick={()=> deleteProduct(prop)}>Delete</button>
                </div>
            </Modal>
            <hr />
            <h2>Cart</h2>
            <br />
            {(cart && cart.length > 0)
            ? <div> 
                {cart.map((prod) => (
                    <div key={prod.product_id}>
                        <img src={prod.img[0]} alt='product img' height={60}/>
                            {prod.product_name} - ${prod.price} - 
                                <QuantityInput prodId={prod.product_id} prodQuantity={prod.quantity}
                                stock={prod.stock} 
                                price={prod.price}
                            />
                            <p onClick={()=> openModal(prod.product_id)}><b> Delete </b></p>
                    </div>
                ))}
                <h2>{`Total: ${total}`}</h2>
            </div>
            : <h1>your cart is empty</h1>
            }
            <br />
            <br />
            <button disabled={(!cart || cart.length < 1) && true } onClick={goCheckout}>Proceed to checkout</button>
            <br />
            <button onClick={openMP}> MercadoPago </button>
            <br />
            <button onClick={checkpayment}> Checkear el estado del pago </button>
        </div>
    );
};

export default Cart;
