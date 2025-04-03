import { useState, useEffect, ChangeEvent } from "react";

const useDelaySearch = (initialValue: string = "", delay: number = 500) => {
  const [value, setValue] = useState<string>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<string>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return { value, debouncedValue, handleChange };
};

export default useDelaySearch;