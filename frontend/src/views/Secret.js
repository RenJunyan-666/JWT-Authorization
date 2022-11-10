import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Secret() {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([]);

  const logout = () => {
    //登出时从系统内删除cookie
    removeCookie("jwt");
    navigate("/login");
  };

  useEffect(() => {
    const verifyUser = async () => {
      //信息错误则返回登录页面
      if (!cookies.jwt) {
        navigate("/login");
      } else {
        const { data } = await axios.post(
          "http://localhost:4000",
          {},
          { withCredentials: true }
        );
        //token不正确
        if (!data.status) {
          removeCookie("jwt");
          navigate("/login");
        } else {
          toast(`HI ${data.user}`, { theme: "dark" });
        }
      }
    };
    verifyUser();
  }, [navigate, cookies, removeCookie]);

  return (
    <>
      <div className="private">
        <h1>Super Secret Page</h1>
        <button onClick={logout}>Log Out</button>
      </div>
      <ToastContainer />
    </>
  );
}
