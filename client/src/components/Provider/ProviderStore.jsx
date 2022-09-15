import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import { loadQuerys } from "../../Redux/reducer/productsSlice";
import Footer from "../common/Footer";
import { SmallAddIcon } from "@chakra-ui/icons";

import "./ProviderStore.css";
import FlashSales from "../common/FlashSales";
import PremiumPreview from "./PremiumPreview";

const ProviderStore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [scrollP, setScrollP] = useState(0)

  const handleWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  };
  
    const scrollPercent = () => { 
        let scrollTop = window.scrollY;
        let docHeight = document.body.offsetHeight;
        let winHeight = window.innerHeight;
        let scrollPercent = scrollTop / (docHeight - winHeight);
        let scrollPercentRounded = Math.round(scrollPercent * 100);
        setScrollP(scrollPercentRounded);
    }

  useEffect(() => {
    window.addEventListener("resize", handleWindowWidth);
    window.addEventListener("scroll", scrollPercent);

    return () => {
        window.removeEventListener("resize", handleWindowWidth);
        window.removeEventListener("scroll", scrollPercent);
    }
    // eslint-disable-next-line
  }, []);

  const goProducts = (code) => {
    dispatch(loadQuerys({ category: code }));
    navigate(`/results/?category=${code}`);
  };

  return (
    <div className="providerstore-container">
      {windowWidth >= 1024 && (
        <>
          <div className="providerstore-echo-inner">
            <span>PROVIDER</span>
            <br />
            PROVIDER <br />
            PROVIDER
          </div>
          <span className={`providerstore-title ${scrollP > 20 && 'invisible'}`}>STORE</span>
          <span className={`providerstore-title-text ${scrollP > 20 && 'invisible'}`}>
            /DELUXE
            <br />
            /UNICOS
            <br />
            /TUYOS
          </span>
        </>
      )}
      {windowWidth < 1023 && (
        <>
          <span className={`providerstore-title-mobile ${scrollP > 20 && 'invisible'}`}>PROVIDER</span>
          <span className={`providerstore-title-text-mobile ${scrollP > 20 && 'invisible'}`}>
            /DELUXE
            <br />
            /UNICOS
            <br />
            /TUYOS
          </span>
          <div className="providerstore-echo-inner-mobile">
            <span>STORE</span>
            <br />
            STORE <br />
            STORE
          </div>
        </>
      )}

      <button
        className={`providerstore-title-button g-white-button ${scrollP > 20 && 'invisible'}`}
        onClick={() => navigate("/products")}
      >
        <SmallAddIcon className="button-addicon" />
        VER TODOS
      </button>

      <div className="providerstore-header"></div>

      <div className="providerstore-background"></div>

      <div className="storecards-container">
        <div className="storecards-inner">

          <div className='storecard'
            onClick={() => goProducts(`MLA1144`)}>
            <p>Consolas</p>            
            <img src={resizer("https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328214/Playdate-photo_hxdnpj.png",200)} alt="img" />
          </div>

          <div className="storecard"
            onClick={() => goProducts(`MLA1648`)}>
            <p>Computación</p>            
            <img src={resizer("https://res.cloudinary.com/dsyjj0sch/image/upload/v1661328896/RW-ZENITH-01.2020_1400x_j4iupn.webp", 200)} alt="img" />
          </div>

          <div className="storecard"
            onClick={() => goProducts(`MLA409810`)}>
            <p>Audio</p>
            <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1662349264/5165_12022_0002_5169_12026132_dmpole.png" alt="img" />
          </div>

          <div className="storecard" 
            onClick={() => navigate("/products")}>
            <p>Todos</p>            
            <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1659650791/PROVIDER_LOGO_glitch_aberration_kt2hyv.png" alt="img" style={{height: '50%', width: 'auto'}}/>
          </div>

        </div>

        <FlashSales/>

        <div className="providerstore-premiumbrand">
            <div>
                <h2>provider</h2>
                <img src="https://res.cloudinary.com/dsyjj0sch/image/upload/v1663041222/premium-02_ymsk9h.png" alt="" />
                <p>Pasamos cientos de horas diseñando, probando y perfeccionando cada producto Premium en nuestra sede de Atalaya City. Pero nuestros ingenieros no son los típicos técnicos corporativos que usan batas de laboratorio. Son personas con las mejores ideas para mejorar sus propios hobbies. Viven para la aventura. Y saben lo que es trabajar sobre la marcha. Probablemente muy parecido a ti.</p>
            </div>
        </div>

        <PremiumPreview />

      </div>

      <Footer />
    </div>
  );
};

export default ProviderStore;
