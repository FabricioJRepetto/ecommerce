//: checkear 'cart' al crear orden

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BACK_URL } from "../../constants";
import Modal from "../../components/common/Modal";
import {useModal} from "../../hooks/useModal";
import { cartTotal } from "../../Redux/reducer/cartSlice";
import QuantityInput from "./QuantityInput";

const Cart = () => {
    const [cart, setCart] = useState(null);
    const token = useSelector((state) => state.sessionReducer.token);
    const total = useSelector((state) => state.cartReducer.total);
    const [isOpen, openModal, closeModal, prop] = useModal();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        getCart();
    // eslint-disable-next-line    
    }, [])

    const getCart = async () => {
        const { data } = await axios({
        method: "GET",
        withCredentials: true,
        url: `${BACK_URL}/cart`, //! VOLVER A VER cambiar
        headers: {
            Authorization: `token ${token}`,
        },
        });
        console.log(data);
        typeof data !== 'string' &&
        setCart(data.products);
        dispatch(cartTotal(data.total));
    };

    const deleteProduct = async (id) => {
        await axios.delete(`${BACK_URL}/cart/${id}`,{
            headers: {
                Authorization: `token ${token}`,
            }
        });
        getCart();
        closeModal();
    };

    const goCheckout = async () => {
        // crea la order       
        const { data: id } = await axios.get(`${BACK_URL}/order/`, { 
            headers: {
                    Authorization: `token ${token}`,
                }
        });
        // con la id inicia el checkout
        navigate(`/checkout/${id}`);
    };    

    return (
        <>
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <h1>You want to delete this product?</h1>
            <div>
                <button onClick={closeModal}>Cancel</button>
                <button onClick={()=> deleteProduct(prop)}>Delete</button>
            </div>
        </Modal>
        <hr />
        <h2>Cart</h2>
        {cart?.map((prod) => (
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
        <br />
        <h2>Total: {total}</h2>
        <br />
        <button onClick={goCheckout}>Proceed to checkout</button>
        </>
    );
};

export default Cart;
