import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Không dùng throw Error ở đây để tránh trắng màn hình khi đang debug
    console.error("AuthContext chưa được bọc đúng cách!");
    return {};
  }
  return context;
};
