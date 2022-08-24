import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { resizer } from '../../helpers/resizer'
import Footer from '../common/Footer'
import Carousel from '../Home/Carousel/Carousel'
import MiniCard from '../Products/MiniCard'
import './ProviderStore.css'

const ProviderStore = () => {
    const images = [
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/9750_16688_wz1frg.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8322_15233_xanjft.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661290053/9679_16615_q7wl6f.jpg',
            url: ''
        },
        {
            img: 'https://res.cloudinary.com/dsyjj0sch/image/upload/v1661287509/8552_15488_r0hefx.jpg',
            url: ''
        },
    ];    

    const [countdown, setCountdown] = useState('');
    const [products, setProducts] = useState(false);
    const [loading, setLoading] = useState(true);

    const {wishlist} = useSelector((state) => state.cartReducer);

    useEffect(() => {
        let countdownInterv = null;
        countdownInterv = setInterval(() => {
        let now = new Date();
        let h = 23 - now.getHours();
        let m = 59 - now.getMinutes();
        let s = 59 - now.getSeconds();
        setCountdown(
            `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
            s < 10 ? "0" + s : s
            }`
        );
        }, 100);

        (async () => {
            const { data } = await axios('/sales');
            setProducts(data)
            setLoading(false);
        })();

        return () => clearInterval(countdownInterv);
        // eslint-disable-next-line
    }, []);

    return (
        <div className='providerstore-container'>
            
            <div className='providerstore-echo-inner'>
                <p>PROVIDER</p>
                <p>PROVIDER</p>
                <p>PROVIDER</p>
            </div>
            <p className='providerstore-title'>STORE</p>
            <p className='providerstore-title-text'>/ORIGINALES<br/>/UNICOS<br/>/TUYOS</p>

            <div className='providerstore-header'>
                <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1661210139/defe786a-5490-425a-b98d-3b8c2d1b7463_desktop_header-copy_algg64.jpg" alt="header"/>
            </div>

            <div className='providerstore-background'></div>

            <div className='storecards-container'>
                <div className='store-premium'>                
                    <Carousel images={images}
                        pausable
                        pointer
                        indicators
                        width='40vw'
                        height='100%' />
                    <div className='store-premium-text'>
                        <div>
                            <h1>Provider Premium</h1>
                            <p>Una selección exclusiva de los mejores productos original Provider store.</p>
                        </div>
                        <button className='g-white-button'>Ver más</button>
                    </div>
                </div>

                <div className='storecards-inner'>
                    <div className="storecard">
                        Consolas
                        <img src={resizer('https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328214/Playdate-photo_hxdnpj.png', 200)} alt="img" />
                    </div>
                    <div className="storecard">
                        Perifericos
                        <img src={resizer('https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328896/RW-ZENITH-01.2020_1400x_j4iupn.webp', 200)} alt="img" />
                    </div>
                    <div className="storecard">
                        Audio
                        <img src='https://www.tradeinn.com/f/13756/137567598/skullcandy-auriculares-inalambricos-crusher.jpg' alt="img" />
                    </div>
                    <div className="storecard">
                        Monitores
                        <img src='https://katech.com.ar/wp-content/uploads/MON351-1.jpg' alt="img" />
                    </div>
                </div>

                <div className='providerstore-flashsales'>
                    <h2>Flash sales! ⏱ {countdown}</h2>
                    <div className="random-container">
                        {Array.from(Array(5).keys()).map((_, index) => (
                            <MiniCard
                                key={`specials ${index}`}
                                img={products[index]?.thumbnail}
                                name={products[index]?.name}
                                price={products[index]?.price}
                                sale_price={products[index]?.sale_price}
                                discount={products[index]?.discount}
                                prodId={products[index]?._id}
                                free_shipping={products[index]?.free_shipping}
                                on_sale={products[index]?.on_sale}
                                fav={wishlist.includes(products[index]?._id)}
                                loading={loading}/>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
  )
}

export default ProviderStore