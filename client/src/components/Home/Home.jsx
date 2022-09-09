import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadApplied, loadFilters, loadProductsFound, loadProductsOwn, loadQuerys } from "../../Redux/reducer/productsSlice";
import axios from "axios";
import MiniCard from "../Products/MiniCard";
import Carousel from "./Carousel/Carousel";
import { IMAGES } from "../../constants";
import Footer from "../common/Footer";
import "./Home.css";

import { ReactComponent as Two } from "../../assets/svg/build-svgrepo-com.svg";
import { ReactComponent as Three } from "../../assets/svg/code-svgrepo-com.svg";
import { ReactComponent as Four } from "../../assets/svg/crop-svgrepo-com.svg";
import { ReactComponent as Five } from "../../assets/svg/explode-svgrepo-com.svg";
import { ReactComponent as Six } from "../../assets/svg/perform-svgrepo-com.svg";

const Home = () => {
    const [products, setProducts] = useState(false);
    const [countdown, setCountdown] = useState("");
    const [loading, setLoading] = useState(true);
    const [suggestion, setSuggestion] = useState(false);
    const {wishlist} = useSelector((state) => state.cartReducer);
    const {session} = useSelector((state) => state.sessionReducer);

    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        const salesData = axios('/sales');
        const suggestionData = axios(`/history/suggestion`)

        salesData.then(r => {
            setProducts(r.data)
        });
        session && suggestionData?.then(r => {
            if (r.data.length > 4 ) {
                setSuggestion(r.data);
            } else {
                setSuggestion(false);                
            }            
        });

      setLoading(false);
    })();

    return () => clearInterval(countdownInterv);
    // eslint-disable-next-line
  }, []);

  const categorySearch = (category) => { 
        dispatch(loadProductsOwn("loading"));
        dispatch(loadProductsFound("loading"));
        dispatch(loadFilters("loading"));
        dispatch(loadApplied('loading'));

        navigate("/results");
        dispatch(loadQuerys({category}))
   }

  return (
    <div className="home-container">
      <div>
        <Carousel images={IMAGES} controls indicators pointer width="100vw" />
      </div>
      <div className="categories">        
        <div onClick={() => categorySearch("MLA1648")}>
          <Two className={"svg"} />
          <p>Computación</p>
        </div>
        <div onClick={() => categorySearch("MLA1039")}>
          <Three className={"svg"} />
          <p>Cámaras</p>
        </div>
        <div onClick={() => categorySearch("MLA1000")}>
          <Four className={"svg"} />
          <p>Audio & Video</p>
        </div>
        <div onClick={() => categorySearch("MLA1144")}>
          <Five className={"svg"} />
          <p>Videojuegos</p>
        </div>
        <div onClick={()=> navigate('/sales')}>
          <Six className={"svg"} />
          <p>Ofertas</p>
        </div>
      </div>
      <div>
        <h2>Flash sales! ⏱ {countdown}</h2>
        <div className="random-container">
          {Array.from(Array(5).keys()).map((_, index) => (
            <MiniCard
              key={`specials ${index}`}
              img={products[index]?.thumbnail}
              name={products[index]?.name}
              premium={products[index]?.premium}
              price={products[index]?.price}
              sale_price={products[index]?.sale_price}
              discount={products[index]?.discount}
              prodId={products[index]?._id}
              free_shipping={products[index]?.free_shipping}
              on_sale={products[index]?.on_sale}
              fav={wishlist.includes(products[index]?._id)}
              loading={loading}
            />
          ))}
        </div>
      </div>
      
      {suggestion.length > 4 && (
        <div>
          <h2>Quizás te interese...</h2>
          <div className="random-container">
            {Array.from(Array(5).keys()).map((_, index) => (
              <MiniCard
                key={`recom ${index}`}
                prodId={suggestion[index]?._id}
                premium={suggestion[index]?.premium}
                name={suggestion[index]?.name}
                img={suggestion[index]?.thumbnail}
                price={suggestion[index]?.price}
                sale_price={suggestion[index]?.sale_price}
                discount={suggestion[index]?.discount}
                free_shipping={suggestion[index]?.free_shipping}
                on_sale={suggestion[index]?.on_sale}
                fav={wishlist.includes(suggestion[index]?._id)}
                loading={loading}
              />
            ))}
          </div>
        </div>
      )}
      <br />
      <Footer />
    </div>
  );
};

export default Home;
