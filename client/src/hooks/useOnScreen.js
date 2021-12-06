import { useEffect, useState } from "react";
const useOnScreen = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) =>
      setIsIntersecting(entry.isIntersecting)
    );

    const node = ref.current;
    observer.observe(node);

    return () => {
      observer.unobserve(node);
      observer.disconnect();
    };
  }, [ref]);
  return isIntersecting;
};

export default useOnScreen;
