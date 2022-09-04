import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNotification } from "../../hooks/useNotification";
import { formatDate } from "../../helpers/formatDate";
import { resizer } from "../../helpers/resizer";
import DeliveryProgress from "../common/DeliveryProgress";
import Carousel from "../Home/Carousel/Carousel";
import "./OrderCard.css";
import { orderProducts } from "../../Redux/reducer/productsSlice";

const OrderCard = ({ order }) => {
  const [productsImages, setProductsImages] = useState(false);
  const [notification] = useNotification();

  useEffect(() => {
    let imagesArray = [];
    order?.products?.forEach((e) => {
      imagesArray.push({ img: e.img, url: "" });
    });
    setProductsImages(imagesArray);
    // eslint-disable-next-line
  }, []);

  const cancelOrder = async (id) => {
    const { statusText } = await axios.put(`/order/${id}`, {
      status: "cancelled",
    });
    notification(
      `${statusText === "OK" ? "Compra cancelada" : "Algo salió mal"}`,
      "",
      "warning"
    );
  };

  return (
    <div className="profile-order-card-container">
      <span className="profile-details-price-mobile">
        <div className="profile-order-products-details">
          {/* {order.products?.map((pic) => (
        <img key={pic.img} src={resizer(pic.img)} alt={"product"} />
      ))} */}
          {/* {productsImages.length && (
          <div className="profile-order-carousel-container">
            <Carousel
              images={productsImages}
              interval={2500}
              pausable={false}
              width="8rem"
              height="8rem"
              id={order._id}
            />
            <div className="card-image-back-style"></div>
          </div>
        )} */}
          {productsImages.length && productsImages.length > 1 ? (
            <div className="profile-order-carousel-container">
              <Carousel
                images={productsImages}
                interval={2500}
                pausable={false}
                width="8rem"
                height="8rem"
                id={order.id}
              />
              <div className="card-image-back-style"></div>
            </div>
          ) : (
            productsImages.length &&
            productsImages.length === 1 && (
              <div className="profile-order-carousel-container profile-order-img-container">
                <img
                  key={productsImages[0].img}
                  src={productsImages[0].img}
                  alt={"product"}
                />
                <div className="card-image-back-style"></div>
              </div>
            )
          )}

          {/* <p>{order.description}</p> */}
          <div className="profile-order-products-names-container">
            {React.Children.toArray(
              order.products.map((prod, i) =>
                i < 5 ? (
                  <p>
                    {prod.quantity > 1 && `${prod.quantity}x `}
                    {prod.product_name}
                  </p>
                ) : i === order.products.length - 1 ? (
                  <p className="g-text-button">{`+${i - 4} productos...`}</p>
                ) : (
                  <></>
                )
              )
            )}
          </div>
        </div>

        <h3 className="profile-price-mobile">
          ${order.total + order.shipping_cost}
        </h3>
      </span>

      {/* {order.status !== "pending" && (
        <p>{formatDate(order.expiration_date_from).slice(0, -6)}</p>
      )} */}

      {order.status === "pending" && (
        <div>
          <p>Expira el {formatDate(order.expiration_date_to).slice(0, -6)}</p>
          {order.payment_link && (
            <div>
              <a href={order.payment_link}>
                <button className="g-white-button">Finalizar compra</button>
              </a>
            </div>
          )}
        </div>
      )}

      {order.status === "cancelled" && (
        <p className="profile-order-cancelled-text">Compra cancelada</p>
      )}

      {/* {order.status === "approved" && (
        <p>Pago: {formatDate(order.payment_date).slice(0, -6)}</p>
      )} */}

      {/* //! volver a ver: Quitar este botón ? */}
      {/* {order.status === "pending" && (
        <button
          onClick={() => cancelOrder(order._id)}
          className="g-white-button"
        >
          Cancelar orden
        </button>
      )} */}

      {/* <p>{order.payment_source}</p>
      <p>
        Número de orden: <i>{order.id}</i>
      </p> */}

      {order.delivery_date && <DeliveryProgress order={order} />}

      {/* {order.status === "pending" && (
        <p>
          Dirección de envío:{" "}
          {`
                            ${order.shipping_address?.street_name}
                            ${order.shipping_address?.street_number},
                            ${order.shipping_address?.city}
                        `}
        </p>
      )} */}

      {/* <p>
        {order.free_shipping
          ? "Envío gratis"
          : `Envío: $${order.shipping_cost}`}
      </p> */}

      <h3 className="profile-price-desktop">
        ${order.total + order.shipping_cost}
      </h3>
    </div>
  );
};

export default OrderCard;
