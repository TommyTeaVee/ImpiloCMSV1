import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

const MediaLightboxContext =
  createContext(null);

export function MediaLightboxProvider({
  children
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(0);

  const openLightbox = useCallback(
    (mediaItems, index = 0) => {
      if (!Array.isArray(mediaItems)) {
        return;
      }

      const validItems = mediaItems.filter(
        (item) =>
          item &&
          typeof item.url === "string" &&
          item.url.trim() !== ""
      );

      if (!validItems.length) {
        return;
      }

      const safeIndex = Math.min(
        Math.max(Number(index) || 0, 0),
        validItems.length - 1
      );

      setItems(validItems);
      setCurrent(safeIndex);
      setIsOpen(true);

      document.body.style.overflow = "hidden";
    },
    []
  );

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  const next = useCallback(() => {
    setCurrent((currentIndex) => {
      if (items.length <= 1) {
        return currentIndex;
      }

      return (
        (currentIndex + 1) %
        items.length
      );
    });
  }, [items.length]);

  const previous = useCallback(() => {
    setCurrent((currentIndex) => {
      if (items.length <= 1) {
        return currentIndex;
      }

      return currentIndex === 0
        ? items.length - 1
        : currentIndex - 1;
    });
  }, [items.length]);

  const value = useMemo(
    () => ({
      isOpen,
      items,
      current,
      activeItem:
        items[current] || null,

      openLightbox,
      closeLightbox,
      next,
      previous
    }),
    [
      isOpen,
      items,
      current,
      openLightbox,
      closeLightbox,
      next,
      previous
    ]
  );

  return (
    <MediaLightboxContext.Provider
      value={value}
    >
      {children}
    </MediaLightboxContext.Provider>
  );
}

export function useMediaLightbox() {
  const context = useContext(
    MediaLightboxContext
  );

  if (!context) {
    throw new Error(
      "useMediaLightbox must be used inside MediaLightboxProvider"
    );
  }

  return context;
}