import { currency, randomNumber } from "@/utils/helper.util";
import { useEffect, useState } from "react";

const NumberLoading = () => {
  const [seconds, setSeconds] = useState<number[] | null>(null);

  useEffect(() => {
    setSeconds(randomNumber(6));

    const interval = setInterval(() => {
      setSeconds(randomNumber(6));
    }, 20);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return <span>{seconds !== null ? currency(Number(seconds.join(""))) : "...."}</span>;
}

export default NumberLoading;