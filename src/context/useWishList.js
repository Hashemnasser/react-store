import { useContext } from "react";
import { WishListContext } from "./WishListContext";

const useWishList = () => useContext(WishListContext);

export default useWishList;
