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

  // ==================================================
  // LOAD MAGAZINE
  // ==================================================

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

  // ==================================================
  // PAGE CHANGE
  // ==================================================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ==================================================
  // NAVIGATION
  // ==================================================

  const previousPage = () => {
    bookRef.current?.previous();
  };

  const nextPage = () => {
    bookRef.current?.next();
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="impilo-reader-loading">
        <p>Loading IMPILO...</p>
      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div className="impilo-reader-error">
        <h2>
          Unable to load magazine
        </h2>

        <p>
          {error}
        </p>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="impilo-reader-error">
        <p>
          Magazine not found.
        </p>
      </div>
    );
  }

  // ==================================================
  // DATABASE PAGES
  // ==================================================

  const databasePages =
    Array.isArray(magazine.pages)
      ? [...magazine.pages].sort(
          (a, b) =>
            a.position - b.position
        )
      : [];

  if (!databasePages.length) {
    return (
      <div className="impilo-reader-error">
        <p>
          This magazine does not have
          any pages yet.
        </p>
      </div>
    );
  }

  // ==================================================
  // BUILD DISPLAY PAGES
  // ==================================================

  const displayPages = [];

  databasePages.forEach((page) => {

    if (
      page.type === "ARTICLE" &&
      page.article &&
      Array.isArray(page.article.blocks)
    ) {

      const parts =
        paginateArticle(
          page.article.blocks,
          {
            targetWords: 350,
            maxWords: 450
          }
        );

      parts.forEach(
        (blocks, index) => {

          displayPages.push({
            ...page,

            id:
              `${page.id}-part-${index + 1}`,

            article: {
              ...page.article,
              blocks
            },

            articlePart:
              index + 1,

            articlePartsTotal:
              parts.length,

            position:
              displayPages.length + 1
          });

        }
      );

    } else {

      displayPages.push({
        ...page,

        position:
          displayPages.length + 1
      });

    }

  });

  // ==================================================
  // PROGRESS
  // ==================================================

  const totalPages =
    displayPages.length;

  const progress =
    totalPages > 0
      ? (
          (currentPage + 1) /
          totalPages
        ) * 100
      : 0;

  return (
    <main className="impilo-reader">

      {/* ==========================================
          READER CHROME
      ========================================== */}

      <div className="impilo-reader-progress">

        <div
          className="impilo-reader-progress-fill"
          style={{
            width:
              `${progress}%`
          }}
        />

      </div>


      <div className="impilo-reader-counter">

        📖 Page{" "}
        {currentPage + 1}
        {" "}
        of{" "}
        {totalPages}

      </div>


      {/* ==========================================
          MAGAZINE
      ========================================== */}

      <div className="impilo-reader-book">

        <MagazineBook
          ref={bookRef}
          pages={displayPages}
          initialPage={0}
          onPageChange={
            handlePageChange
          }
        />

      </div>


      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <div className="impilo-reader-controls">

        <button
          type="button"
          className="impilo-glass-btn"
          onClick={previousPage}
          disabled={
            currentPage === 0
          }
        >
          ← Prev
        </button>


        <button
          type="button"
          className="impilo-glass-btn"
          onClick={nextPage}
          disabled={
            currentPage >=
            totalPages - 1
          }
        >
          Next →
        </button>

      </div>

    </main>
  );
}