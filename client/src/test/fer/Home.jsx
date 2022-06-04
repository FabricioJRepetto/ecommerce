import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import Cart from "./Cart";
import Products from "./Products";
import Signout from "./Signout";
import Signupin from "./Signupin";
import Imagen from "./Imagen";
import ProductForm from "./ProductForm";
import { useDispatch } from "react-redux";
import { loadToken, loadUsername } from "../../Redux/reducer/sessionSlice";
import { BACK_URL } from "./constants";
import Axios from "axios";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserToken = window.localStorage.getItem("loggedTokenEcommerce");

    loggedUserToken &&
      Axios({
        method: "POST",
        withCredentials: true,
        url: `${BACK_URL}/user/session`, //! VOLVER A VER cambiar
        headers: {
          Authorization: `token ${loggedUserToken}`,
        },
      })
        .then(({ data }) => {
          dispatch(loadToken(loggedUserToken));
          Axios({
            method: "GET",
            withCredentials: true,
            url: `${BACK_URL}/user/profile`, //! VOLVER A VER cambiar
            headers: {
              Authorization: `token ${loggedUserToken}`,
            },
          }).then(({ data }) => {
            dispatch(loadUsername(data.user.email));
            console.log(data.user);
          });
        })
        .catch((_) => window.localStorage.removeItem("loggedTokenEcommerce"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Imagen />} />
        <Route path="/signin" element={<Signupin />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/products" element={<Products />} />
        <Route path="/productForm" element={<ProductForm />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
};

export default Home;
