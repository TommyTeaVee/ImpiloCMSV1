import React, {
  forwardRef,
  useImperativeHandle,
  useRef
} from "react";

import HTMLFlipBook from "react-pageflip";
import MagazinePage from "./MagazinePage";

const MagazineBook = forwardRef(
  (
    {
      pages = [],
      initialPage = 0,
      onPageChange
    },
    ref
  ) => {
    const bookRef = useRef(null);

    useImperativeHandle(ref, () => ({
      pageFlip: () =>
        bookRef.current?.pageFlip(),

      next: () =>
        bookRef.current?.pageFlip()?.flipNext(),

      previous: () =>
        bookRef.current?.pageFlip()?.flipPrev(),

      flipTo: (page) =>
        bookRef.current
          ?.pageFlip()
          ?.flip(page)
    }));

    const handleFlip = (event) => {
      if (typeof onPageChange === "function") {
        onPageChange(event.data);
      }
    };

    if (!Array.isArray(pages) || pages.length === 0) {
      return null;
    }

    return (
      <HTMLFlipBook
        ref={bookRef}

        width={450}
        height={800}

        minWidth={315}
        minHeight={400}

        maxWidth={900}
        maxHeight={1000}

        size="stretch"

        showCover={true}
        usePortrait={true}

        startPage={Math.max(
          0,
          Math.min(
            initialPage,
            pages.length - 1
          )
        )}

        onFlip={handleFlip}

        className="impilo-magazine-book"

        drawShadow={false}
        flippingTime={1000}

        useMouseEvents={false}
        clickEventForward={false}
        swipeDistance={999999}

        presentationMode={true}
        mobileScrollSupport={false}
      >
        {pages.map((page) => (
          <MagazinePage
            key={page.id}
            page={page}
          />
        ))}
      </HTMLFlipBook>
    );
  }
);

MagazineBook.displayName = "MagazineBook";

export default MagazineBook;