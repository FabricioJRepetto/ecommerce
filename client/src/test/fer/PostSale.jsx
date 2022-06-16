import axios from 'axios'
import { useState } from 'react';
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAxios } from '../../hooks/useAxios';

const { REACT_APP_MP_SKEY } = process.env;

const PostSale = () => {
    const [orderStatus, setOrderStatus] = useState();
    const { id } = useParams();

    const { data, loading, error } = useAxios('GET', `/order/${id}`);
    
    useEffect(() => {
        //! CAMBIAR PARA EL DEPLOY
        //! solo pedir la order al back

        //: peticion a mp para saber status del pago
        (async () => {
            const { data } = await axios.get(`https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=${id}`, {
                headers: {
                    Authorization: `Bearer ${REACT_APP_MP_SKEY}`,
                }
            });
            console.log(data.results[0].status);
            setOrderStatus(data.results[0].status);
        })();
      // eslint-disable-next-line
    }, [])
    
    return (
        <div>
            <h1>Post Venta</h1>
            {error && <h1>{error}</h1>}
            { (loading && !orderStatus )
                ? <p>LOADING · · ·</p>
                : <>
                    <div >
                        {data?.products.map(e =>(
                            <img src={e.img[0]} 
                            alt="product" 
                            height={50} 
                            key={e.product_id}/>
                        ))}
                    </div>
                    <p>{`Estado de la orden: ${orderStatus}`}</p>
                    <p>{data?.id}</p>
                    <p>{data?.description}</p>
                    <p><i>shipping info</i></p>
            </>}
        </div>
    )
}

export default PostSale