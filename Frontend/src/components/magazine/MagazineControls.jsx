import React from "react";

export default function MagazineControls({
  currentPage = 0,
  totalPages = 0,
  onPrevious,
  onNext,
}) {
  const pageNumber = currentPage + 1;

  const isFirstPage =
    currentPage <= 0;

  const isLastPage =
    currentPage >= totalPages - 1;

  return (
    <section className="impilo-magazine-controls">

      {/* ==========================================
          PAGE INDICATOR
      ========================================== */}

      <div className="impilo-magazine-page-indicator">

        <span>
          Page
        </span>

        <strong>
          {pageNumber}
        </strong>

        <span>
          of
        </span>

        <strong>
          {totalPages}
        </strong>

      </div>


      {/* ==========================================
          FUTURE CONTROL SPACE
          
          We intentionally leave this area
          available for:
          
          Previous Magazine
          Presentation Mode
          
          These are NOT implemented yet.
      ========================================== */}

      <div className="impilo-magazine-future-controls">
      </div>


      {/* ==========================================
          PAGE NAVIGATION
      ========================================== */}

      <div className="impilo-magazine-navigation">

        <button
          type="button"
          className="impilo-glass-btn impilo-magazine-nav-button"
          onClick={onPrevious}
          disabled={isFirstPage}
          aria-label="Previous page"
        >
          ← Previous
        </button>


        <button
          type="button"
          className="impilo-glass-btn impilo-magazine-nav-button"
          onClick={onNext}
          disabled={isLastPage}
          aria-label="Next page"
        >
          Next →
        </button>

      </div>

    </section>
  );
}