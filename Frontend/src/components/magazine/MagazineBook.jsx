import React from "react";
import HTMLFlipBook from "react-pageflip";
import MagazinePage from "./MagazinePage";

class MagazineBook extends React.Component {

  constructor(props) {
    super(props);

    this.flipBook = React.createRef();

    this.state = {
      page: props.initialPage || 0
    };
  }


  /* ==================================================
     FLIPBOOK INSTANCE
     ================================================== */

  getFlip = () => {
    return this.flipBook.current?.pageFlip?.();
  };


  /* ==================================================
     PUBLIC API
     MagazineReader uses these.
     ================================================== */

 next = () => {
  console.log("NEXT CLICKED");

  const instance = this.flipBook.current;

  console.log("FLIPBOOK REF:", instance);

  const flip = instance?.pageFlip?.();

  console.log("PAGE FLIP INSTANCE:", flip);

  if (!flip) {
    console.error("PAGEFLIP INSTANCE NOT FOUND");
    return;
  }

  console.log(
    "CURRENT PAGE:",
    flip.getCurrentPageIndex?.()
  );

  console.log(
    "TOTAL PAGES:",
    flip.getPageCount?.()
  );

  flip.flipNext();
};


  flipTo = (page) => {
    const flip = this.getFlip();

    if (flip) {
      flip.flip(page);
    }
  };


  pageFlip = () => {
    return this.getFlip();
  };


  /* ==================================================
     PAGE CHANGE
     ================================================== */

  onPage = (event) => {

    const page = event.data;

    this.setState({
      page
    });

    if (
      typeof this.props.onPageChange ===
      "function"
    ) {
      this.props.onPageChange(page);
    }
  };


  /* ==================================================
     INITIAL PAGE
     ================================================== */

  componentDidMount() {

    const initialPage =
      this.props.initialPage || 0;

    if (initialPage > 0) {

      const flip = this.getFlip();

      if (flip) {
        flip.flip(initialPage);
      }

    }
  }


  /* ==================================================
     RENDER
     ================================================== */

  render() {

    const {
      pages = []
    } = this.props;


    if (
      !Array.isArray(pages) ||
      pages.length === 0
    ) {
      return null;
    }


    const initialPage = Math.max(
      0,
      Math.min(
        this.props.initialPage || 0,
        pages.length - 1
      )
    );


    return (

      <div className="impilo-magazine-book-wrapper">

        <HTMLFlipBook

          ref={this.flipBook}

          width={450}
          height={800}

          minWidth={315}
          minHeight={400}

          maxWidth={900}
          maxHeight={1000}

          size="stretch"

          showCover={true}

          usePortrait={true}

          startPage={initialPage}

          onFlip={this.onPage}

          className="impilo-magazine-book"

          drawShadow={false}

          flippingTime={1000}

          /*
           * IMPORTANT:
           * These are the same interaction
           * settings from your original
           * working DemoBook.
           */

          useMouseEvents={false}

          clickEventForward={false}

          swipeDistance={999999}

          presentationMode={false}

          mobileScrollSupport={false}

        >

          {pages.map((page) => (

            <MagazinePage
              key={page.id}
              page={page}
            />

          ))}

        </HTMLFlipBook>

      </div>
    );
  }
}

export default MagazineBook;