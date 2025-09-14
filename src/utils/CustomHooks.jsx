import { useEffect, useState } from "react";

const useDebounce = (value, wait = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => setDebouncedValue(value), [wait]);
  }, [value, wait]);

  return debouncedValue;
};
export { useDebounce };
