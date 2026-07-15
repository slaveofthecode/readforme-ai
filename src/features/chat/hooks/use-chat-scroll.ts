import { useRef, useEffect } from "react";

export function useChatScroll(messageCount: number, isStreaming: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      isUserScrolledUp.current = scrollHeight - scrollTop - clientHeight > 100;
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isUserScrolledUp.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messageCount, isStreaming]);

  return containerRef;
}
