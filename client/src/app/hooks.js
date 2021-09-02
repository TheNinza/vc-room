import { useEffect, useState } from "react";
const useOnScreen = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const observer = new IntersectionObserver(([entry]) =>
    setIsIntersecting(entry.isIntersecting)
  );

  useEffect(() => {
    observer.observe(ref.current);
  }, []);
  return isIntersecting;
};

export default useOnScreen;
