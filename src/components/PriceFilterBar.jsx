import { startTransition } from "react";

const priceSteps = [10, 20, 30, 40, 50];

export default function PriceFilterBar({
  setMaxPrice,
  maxPrice,
  setIsLoading,
}) {
  return (
    <select
      className="py-2 mb-6 px-4 border-slate-300 bg-pink-100 rounded-md border text-black hover:bg-pink-300 focus:ring-1 focus:ring-blue-300  transition duration-500 focus:border-transparent"
      value={maxPrice ?? ""}
      onChange={(e) => {
        const value = e.target.value;
        startTransition(() => {
          setIsLoading(true);
          setMaxPrice(value ? Number(value) : null);
        });
      }}
    >
      {/* Placeholder لا يظهر في القائمة عند الفتح */}
      <option value="" disabled hidden>
        Filter By Price
      </option>

      {priceSteps.map((price) => (
        <option key={price} value={price}>
          Under ${price}
        </option>
      ))}

      {maxPrice !== null && <option value="">Clear Filter</option>}
    </select>
  );
}
