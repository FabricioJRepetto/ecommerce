import { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNotification } from "../../hooks/useNotification";
import {
  CloseIcon,
  ArrowBackIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { useModal } from "../../hooks/useModal";
import Modal from "../common/Modal";
import LoaderBars from "../common/LoaderBars";
import "./ResetPassword.css";
import "../../App.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken, userId } = useParams();
  const [notification] = useNotification();
  const { session } = useSelector((state) => state.sessionReducer);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const [isOpenLoader, openLoader, closeLoader] = useModal();
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState(null);
  const [viewPassword, setViewPassword] = useState({
    password: false,
    repPassword: false,
  });

  useEffect(() => {
    (async () => {
      try {
        await axios.put(
          "/user/resetPassword",
          { _id: userId },
          {
            headers: {
              Authorization: `Bearer ${resetToken}`,
            },
          }
        );
        setLoading(false);
      } catch (error) {
        //! VOLVER A VER manejo de errores
        console.log("error", error);
        notification("Link de recuperación vencido", "", "error");
        session ? navigate("/") : navigate("/signin");
      }
    })();
    // eslint-disable-next-line
  }, []);

  const changePassword = async (passwordData) => {
    openLoader();
    try {
      const { data } = await axios.put(
        "/user/changePassword",
        { ...passwordData, _id: userId },
        {
          headers: {
            Authorization: `Bearer ${resetToken}`,
          },
        }
      );

      if (data.error && data.message && Array.isArray(data.message)) {
        data.message.forEach((error) => notification(error, "", "error"));
      } else {
        data.message && setResponse(data.message);
      }
    } catch (error) {
      console.log(error);
      setResponse(error.response.data.message); //! VOLVER A VER manejo de errores
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } finally {
      closeLoader();
    }
  };

  return loading ? (
    <></>
  ) : (
    <div className="reset-container">
      <div className="reset-inner">
        <img
          src={require("../../assets/provider-logo.png")}
          alt="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        />

        {response ? (
          <>
            <div className="reset-response">{response}</div>
            <NavLink to={"/signin"}>
              <span className="g-back-button g-text-button">
                <ArrowBackIcon />
                {"   regresar"}
              </span>
              {/* //! VOLVER A VER que esto rediriga a la pagina anterior, no a home*/}
            </NavLink>
          </>
        ) : (
          <form onSubmit={handleSubmit(changePassword)}>
            <div className="reset-text">Ingresa tu nueva contraseña</div>

            <>
              {!errors.password && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errors.password?.type === "required" && (
                <p className="g-error-input">Ingresa una contraseña</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="g-error-input">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Contraseña"
                autoComplete="off"
                className={`g-input-two-icons ${
                  watch("password") === undefined || watch("password") === ""
                    ? ""
                    : viewPassword.password
                    ? ""
                    : "g-password"
                }`}
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
              />
              {watch("password") === "" ||
              watch("password") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("password", "")}
                >
                  <CloseIcon />
                </div>
              )}

              {watch("password") === "" ||
              watch("password") === undefined ? null : viewPassword.password ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, password: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, password: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>

            <>
              {!errors.repPassword && (
                <p className="g-hidden-placeholder">hidden</p>
              )}
              {errors.repPassword?.type === "required" && (
                <p className="g-error-input">Ingresa tu contraseña</p>
              )}
              {errors.repPassword?.type === "validate" && (
                <p className="g-error-input">Las contraseñas no coinciden</p>
              )}
            </>

            <span className="g-input-with-button">
              <input
                type="text"
                placeholder="Repite tu contraseña"
                autoComplete="off"
                className={`g-input-two-icons ${
                  watch("repPassword") === undefined ||
                  watch("repPassword") === ""
                    ? ""
                    : viewPassword.repPassword
                    ? ""
                    : "g-password"
                }`}
                {...register("repPassword", {
                  required: true,
                  validate: (repPassword) => {
                    if (watch("repPassword") !== repPassword) {
                      return "Las contraseñas no coinciden";
                    }
                  },
                })}
              />
              {watch("repPassword") === "" ||
              watch("repPassword") === undefined ? null : (
                <div
                  className="g-input-icon-container g-input-x-button"
                  onClick={() => setValue("repPassword", "")}
                >
                  <CloseIcon />
                </div>
              )}

              {watch("repPassword") === "" ||
              watch("repPassword") ===
                undefined ? null : viewPassword.repPassword ? (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, repPassword: false })
                  }
                >
                  <ViewOffIcon />
                </div>
              ) : (
                <div
                  className="g-input-icon-container g-input-view-button"
                  onClick={() =>
                    setViewPassword({ ...viewPassword, repPassword: true })
                  }
                >
                  <ViewIcon />
                </div>
              )}
            </span>

            <input
              type="submit"
              value="Cambiar contraseña"
              className="g-white-button"
            />
          </form>
        )}
      </div>
      <Modal isOpen={isOpenLoader}>
        <div className="reset-container">
          <div className="reset-inner loader-container">
            <LoaderBars />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResetPassword;
