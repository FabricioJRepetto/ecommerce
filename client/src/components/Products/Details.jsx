import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios';
import { useNotification } from '../../hooks/useNotification';
import { addCart } from '../../Redux/reducer/cartSlice';
import Galery from './Galery';
import { WhishlistButton as Fav } from './WhishlistButton';

const Details = () => {
    const { id } = useParams();
    const { data, loading, error } = useAxios('GET', `/product/${id}`);
    const cart = useSelector((state) => state.cartReducer.main);
    const dispatch = useDispatch();
    const [notification] = useNotification();

    // useEffect(() => {
    //     (async () => {
    //         const { data } = await axios(`/product/${id}`)
    //         console.log(data)
    //     })();
    // }, []);

    const addToCart = async (id) => {
        const {data} = await axios.post(`/cart/${id}`);
        console.log(data);
        if (data && !cart.includes(id)) {
            dispatch(addCart(id));
        };
        notification(data.message, '/cart', 'success')
  };

  return (
    <div>
        <h1>Details</h1>
        {loading && <p>LOADING</p>}
        {error && <p>{error}</p>}
        {data && 
            <div>
                <Galery imgs={data.images} />
                <div>
                    <p>{data.brand.toUpperCase()}</p>
                    <h2>{data.name}</h2>
                    <h3>${data.price}</h3>
                    <p>{data.free_shipping && 'free shipping'}</p>
                    <button onClick={() => addToCart(data._id)}>Add to cart</button>
                    <button disabled>Buy</button>
                    <Fav prodId={data._id} fav={true}/>
                </div>
                <div>
                    <br />
                    <p><b>Main features</b></p>
                    <div>
                        {data.main_features?.map(e=>
                            <p key={e}>{e}</p>
                        )}
                    </div>
                    <br />
                    <p><b>attributes</b></p>
                    <div>
                        {data.attributes?.map(e=>
                            <p key={e.value_name}>{`${e.name}: ${e.value_name}`}</p>
                        )}
                    </div>
                    <br />
                    <p>{data.description}</p>
                </div>
                <div></div>
            </div>
        }
    </div>
  )
}

export default Details