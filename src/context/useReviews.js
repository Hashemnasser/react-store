import { useContext } from "react";
import { ReviewsContext } from "./ReviewsContext";
function useReviews() {
  return useContext(ReviewsContext);
}
export default useReviews;
