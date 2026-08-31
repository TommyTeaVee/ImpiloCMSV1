import React from "react";
import PageRenderer from "./PageRenderer";

const MagazinePage = React.forwardRef(
  ({ page }, ref) => {
    if (!page) {
      return (
        <div
          ref={ref}
          className="impilo-magazine-page"
        />
      );
    }

    return (
      <div
        ref={ref}
        className="impilo-magazine-page"
        data-page-id={page.id}
        data-page-type={page.type}
      >
        <div className="impilo-magazine-page-content">
          <PageRenderer page={page} />
        </div>
      </div>
    );
  }
);

MagazinePage.displayName = "MagazinePage";

export default MagazinePage;