import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";

export const CartContext = createContext();

// Lấy key lưu cart theo userId — mỗi user có giỏ hàng riêng
const getCartKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.id ? `cart_${user.id}` : null; // null = chưa đăng nhập
  } catch {
    return null;
  }
};

export const CartProvider = ({ children }) => {
  const [cartKey, setCartKey] = useState(getCartKey);

  const [cartItems, setCartItems] = useState(() => {
    try {
      const key = getCartKey();
      if (!key) return [];
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState(null);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Khi user đăng nhập/đăng xuất → reload cart đúng user
  useEffect(() => {
    const handleStorage = () => {
      const newKey = getCartKey();
      if (newKey !== cartKey) {
        setCartKey(newKey);
        if (newKey) {
          try {
            const saved = localStorage.getItem(newKey);
            setCartItems(saved ? JSON.parse(saved) : []);
          } catch {
            setCartItems([]);
          }
        } else {
          setCartItems([]);
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    // Cũng lắng nghe custom event khi login/logout trong cùng tab
    window.addEventListener("userChanged", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userChanged", handleStorage);
    };
  }, [cartKey]);

  // Đồng bộ localStorage theo key của user
  useEffect(() => {
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }
  }, [cartItems, cartKey]);

  const { totalCount, totalPrice } = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => ({
        totalCount: acc.totalCount + item.quantity,
        totalPrice: acc.totalPrice + item.price * item.quantity,
      }),
      { totalCount: 0, totalPrice: 0 }
    );
  }, [cartItems]);

  // Thêm vào giỏ — yêu cầu đăng nhập, KHÔNG tự mở drawer
  const addToCart = useCallback((product, openDrawer = false) => {
    const key = getCartKey();
    if (!key) {
      window.location.href = "/login";
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === product.id &&
          i.size === product.size &&
          i.color === product.color
      );
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === product.size && i.color === product.color
            ? { ...i, quantity: i.quantity + (product.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...product, quantity: product.quantity || 1 }];
    });

    setLastAddedProduct(product);
    // Không mở CartMini, không notification
  }, []);

  const updateQuantity = useCallback((productId, delta, size = "", color = "") => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          const match =
            item.id === productId &&
            (item.size || "") === size &&
            (item.color || "") === color;
          return match ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item;
        })
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((productId, size = "", color = "") => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === productId &&
            (item.size || "") === size &&
            (item.color || "") === color
          )
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (cartKey) localStorage.removeItem(cartKey);
  }, [cartKey]);

  const value = {
    cartItems,
    totalCount,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    lastAddedProduct,
    showCartNotification,
    setShowCartNotification,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
