import React, {
  useEffect,
  useRef,
  useState
} from "react";

import MagazineBook from "./MagazineBook";
import paginateArticle from "./paginateArticle";
import api from "../../services/api";

export default function MagazineReader({
  slug = "impilo-101"
}) {
  const bookRef = useRef(null);

  const [magazine, setMagazine] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadMagazine() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(
          `/magazines/public/${slug}`
        );

        if (!mounted) return;

        setMagazine(response.data.magazine);
      } catch (err) {
        console.error(
          "Failed to load magazine:",
          err
        );

        if (!mounted) return;

        setError(
          err.response?.data?.message ||
          "Unable to load magazine"
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMagazine();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const previousPage = () => {
    bookRef.current?.previous();
  };

  const nextPage = () => {
    bookRef.current?.next();
  };

  if (loading) {
    return (
      <div className="impilo-reader-loading">
        <p>Loading IMPILO...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="impilo-reader-error">
        <h2>Unable to load magazine</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="impilo-reader-error">
        <p>Magazine not found.</p>
      </div>
    );
  }

  const databasePages = Array.isArray(magazine.pages)
    ? [...magazine.pages].sort(
        (a, b) => a.position - b.position
      )
    : [];

  if (!databasePages.length) {
    return (
      <div className="impilo-reader-error">
        <p>
          This magazine does not have any pages yet.
        </p>
      </div>
    );
  }

  /*
   * ==========================================
   * BUILD DISPLAY PAGES
   * ==========================================
   *
   * Database pages are preserved.
   *
   * ARTICLE pages are expanded into
   * multiple presentation pages.
   */

  const displayPages = [];

  databasePages.forEach((page) => {
    if (
      page.type === "ARTICLE" &&
      page.article &&
      Array.isArray(page.article.blocks)
    ) {
      console.table(
    page.article.blocks.map((block) => ({
      position: block.position,
      type: block.type,
      text:
        block.content?.text
          ?.slice(0, 80) || "",
      media:
        block.media?.type || ""
    }))
  );

      const parts = paginateArticle(
        page.article.blocks,
        {
          targetWords: 350,
          maxWords: 450
        }
      );

      parts.forEach((blocks, index) => {
        displayPages.push({
          ...page,

          /*
           * Give every generated page
           * its own React identity.
           */
          id: `${page.id}-part-${index + 1}`,

          /*
           * Keep the original article.
           */
          article: {
            ...page.article,

            /*
             * Only this presentation page's
             * blocks are rendered.
             */
            blocks
          },

          /*
           * Useful to the renderer.
           */
          articlePart: index + 1,
          articlePartsTotal: parts.length,

          /*
           * Position is now presentation
           * position rather than database
           * position.
           */
          position:
            displayPages.length + 1
        });
      });
    } else {
      displayPages.push({
        ...page,
        position:
          displayPages.length + 1
      });
    }
  });

  const totalPages = displayPages.length;

  const progress =
    totalPages > 0
      ? ((currentPage + 1) /
          totalPages) *
        100
      : 0;

  return (
    <main className="impilo-reader">

      {/* MAGAZINE HEADER */}

      <header className="impilo-reader-header">
        <h1>{magazine.title}</h1>

        {magazine.volume && (
          <p>{magazine.volume}</p>
        )}
      </header>


      {/* PROGRESS */}

      <div
        className="impilo-reader-progress"
        aria-label="Magazine progress"
      >
        <div
          className="impilo-reader-progress-fill"
          style={{
            width: `${progress}%`
          }}
        />
      </div>


      {/* PAGE COUNTER */}

      <div className="impilo-reader-counter">
        📖 Page {currentPage + 1} of {totalPages}
      </div>


      {/* FLIPBOOK */}

      <div className="impilo-reader-book">
        <MagazineBook
          ref={bookRef}
          pages={displayPages}
          initialPage={0}
          onPageChange={handlePageChange}
        />
      </div>


      {/* CONTROLS */}

      <div className="impilo-reader-controls">

        <button
          type="button"
          className="impilo-glass-btn"
          onClick={previousPage}
          disabled={currentPage === 0}
        >
          ← Prev
        </button>

        <button
          type="button"
          className="impilo-glass-btn"
          onClick={nextPage}
          disabled={
            currentPage >= totalPages - 1
          }
        >
          Next →
        </button>

      </div>

    </main>
  );
}