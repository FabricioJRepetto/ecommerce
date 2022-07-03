import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resizer } from "../../helpers/resizer";
import "./Card.css";

import { ReactComponent as Sale } from "../../assets/svg/sale.svg";
import { WhishlistButton as Fav } from "./WhishlistButton";
import { loadIdProductToEdit } from "../../Redux/reducer/productsSlice";

const Card = ({
  img,
  name,
  brand,
  price,
  on_sale,
  sale_price,
  discount,
  prodId,
  free_shipping,
  fav,
}) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const session = useSelector((state) => state.sessionReducer.session);
  const dispatch = useDispatch();

  const editProduct = (prodId) => {
    dispatch(loadIdProductToEdit(prodId));
    navigate("/productForm");
  };

  return (
    <div
      key={prodId}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="product-card"
    >
      {session && <Fav visible={visible} fav={fav} prodId={prodId} />}

      <div className="card-main-container">
        <div
          onClick={() => navigate(`/details/${prodId}`)}
          className="card-img-container pointer">
            <img src={resizer(img, 180)} alt="product" />
        </div>

        <div className="card-details-container">
          <div>{brand && brand.toUpperCase()}</div>

          <h2
            className="card-name pointer c-mrgn"
            onClick={() => navigate(`/details/${prodId}`)}
          >
            {name}
          </h2>

          <div className="card-price-container c-mrgn">
            <div className="card-original-price">
              {on_sale && <del>${price}</del>}
            </div>
            <div className="card-price-section">                
              {on_sale ? <h2>${sale_price}</h2> : <h2>${price}</h2>}
              {on_sale && (
                <div className="minicard-sale-section">
                  <Sale className="onsale-svg" />
                  <p>{`${discount}% off`}</p>
                </div>
              )}
            </div>
          </div>

          <div className="free-shipping c-mrgn">
            {free_shipping && "envío gratis"}
          </div>
          <button type="button" onClick={() => editProduct(prodId)}>
            EDITAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
