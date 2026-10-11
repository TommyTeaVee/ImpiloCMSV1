import React from "react";

import PageRenderer from "./PageRenderer";

import ContentsPageRenderer from "./contentsPageRender";

const MagazinePage = React.forwardRef(
  ({ page, allPages, onJumpToPage }, ref) => {

    if (!page) {
      return (
        <div
          ref={ref}
         
        />
      );
    }

    return (
      <div
        ref={ref}
       
        data-page-id={page.id}
        data-page-type={page.type}
      >
        <div className="impilo-magazine-page-content">

          {page.type === "CONTENTS" ? (
            <ContentsPageRenderer
              page={page}
              issuePages={allPages}
              onJumpToPage={onJumpToPage}
            />
          ) : (
            <PageRenderer
              page={page}
            />
          )}

        </div>
      </div>
    );

  }
);

MagazinePage.displayName = "MagazinePage";

export default MagazinePage;