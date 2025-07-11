import { useContext } from "react";
import {CartContext}   from './CartContext.jsx'
const useCart = () => useContext(CartContext);

export default useCart;
