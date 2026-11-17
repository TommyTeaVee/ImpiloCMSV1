
import React from "react";
import HTMLFlipBook from "react-pageflip";
import MagazinePage from "../magazine/MagazinePage";
import { trackMagazineEvent } from "../../services/Matomo";

class MagazineBook extends React.Component {
  constructor(props) {
    super(props);

    this.flipBook = React.createRef();

    this.state = {
      page: props.initialPage || 0,
      isMobile: false
    };

    this.completionTracked = false;
  }

  getFlip = () => {
    return this.flipBook.current?.pageFlip?.();
  };

  getMagazineTitle = () => {
    return (
      this.props.magazine?.title ||
      this.props.magazineTitle ||
      this.props.title ||
      "IMPILO Magazine"
    );
  };

  next = () => {
    const flip = this.getFlip();

    if (!flip) {
      console.error("PAGEFLIP INSTANCE NOT FOUND");
      return;
    }

    flip.flipNext();
  };

  prev = () => {
    const flip = this.getFlip();

    if (!flip) {
      console.error("PAGEFLIP INSTANCE NOT FOUND");
      return;
    }

    flip.flipPrev();
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

  // Track magazine page changes
  onPage = (event) => {
    const page = Number(event.data);
    const pages = this.props.pages || [];
    const magazineTitle = this.getMagazineTitle();

    this.setState({ page });

    // Track page turn
    trackMagazineEvent(
      "Page Turned",
      magazineTitle,
      page + 1
    );

    // Track completion once per reader session
    if (
      page === pages.length - 1 &&
      !this.completionTracked
    ) {
      this.completionTracked = true;

      trackMagazineEvent(
        "Completed",
        magazineTitle
      );
    }

    if (typeof this.props.onPageChange === "function") {
      this.props.onPageChange(page);
    }
  };

  componentDidMount() {
    this.mediaQuery = window.matchMedia("(max-width: 767px)");

    this.handleScreenSize = (event) => {
      this.setState({ isMobile: event.matches });
    };

    this.setState({
      isMobile: this.mediaQuery.matches
    });

    if (this.mediaQuery.addEventListener) {
      this.mediaQuery.addEventListener(
        "change",
        this.handleScreenSize
      );
    } else {
      // Older Safari support
      this.mediaQuery.addListener(this.handleScreenSize);
    }

    // Track magazine opening
    trackMagazineEvent(
      "Opened",
      this.getMagazineTitle()
    );

    const initialPage = this.props.initialPage || 0;

    if (initialPage > 0) {
      const flip = this.getFlip();

      if (flip) {
        flip.flip(initialPage);
      }
    }
  }

  componentWillUnmount() {
    if (this.mediaQuery?.removeEventListener) {
      this.mediaQuery.removeEventListener(
        "change",
        this.handleScreenSize
      );
    } else {
      this.mediaQuery?.removeListener(this.handleScreenSize);
    }
  }

  render() {
    const { pages = [] } = this.props;

    if (!Array.isArray(pages) || pages.length === 0) {
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
          width={600}
          height={1024}
          minWidth={315}
          minHeight={500}
          maxWidth={800}
          maxHeight={1024}
          size="stretch"
          showCover={true}
          usePortrait={true}
          startPage={initialPage}
          onFlip={this.onPage}
          drawShadow={false}
          flippingTime={1000}
          useMouseEvents={false}
          clickEventForward={false}
          swipeDistance={999999}
          presentationMode={false}
          mobileScrollSupport={false}
        >
          {pages.map((page, index) => (
            <MagazinePage
              key={page.id}
              page={page}
              allPages={pages}
              onJumpToPage={(targetIndex) => {
                const flip = this.getFlip();

                if (flip) {
                  flip.flip(targetIndex);
                }
              }}
            />
          ))}
        </HTMLFlipBook>
      </div>
    );
  }
}

export default MagazineBook;
