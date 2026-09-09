import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import MagazineBook from "./MagazineBook";

import paginateArticle from "./paginateArticle";

import api from "../../services/api";

export default function MagazineReader({
  slug = "impilo-101"
}) {

  const params = useParams();
  const navigate = useNavigate();

  const activeSlug =
    params.slug ||
    slug;

  const urlPageNumber =
    params.pageNumber
      ? parseInt(params.pageNumber, 10)
      : null;

  const bookRef = useRef(null);

  const [magazine, setMagazine] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const [isInitialized, setIsInitialized] =
    useState(false);



  // ==================================================
  // LOAD MAGAZINE
  // ==================================================

  useEffect(() => {

    let mounted = true;



    async function loadMagazine() {

      try {

        setLoading(true);

        setError(null);



        const response =
          await api.get(
            `/magazines/public/${activeSlug}`
          );



        if (!mounted) {

          return;

        }



        setMagazine(
          response.data.magazine
        );

      } catch (err) {

        console.error(
          "Failed to load magazine:",
          err
        );



        if (!mounted) {

          return;

        }



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

  }, [activeSlug]);



  // ==================================================
  // DATABASE PAGES
  // KEEP THE PAGE COLLECTION STABLE
  // ==================================================

  const databasePages =
    useMemo(() => {

      if (
        !magazine ||
        !Array.isArray(
          magazine.pages
        )
      ) {

        return [];

      }



      return [
        ...magazine.pages
      ].sort(
        (a, b) =>
          a.position -
          b.position
      );

    }, [magazine]);



  // ==================================================
  // BUILD DISPLAY PAGES
  //
  // Articles are intentionally split into shorter
  // reading sections.
  //
  // IMPORTANT:
  // This is memoized so changing currentPage does
  // NOT rebuild the PageFlip page collection.
  // ==================================================

  const displayPages =
    useMemo(() => {

      const result = [];



      databasePages.forEach(
        (page) => {

          // ==========================================
          // ARTICLE
          // ==========================================

          if (
            page.type === "ARTICLE" &&
            page.article &&
            Array.isArray(
              page.article.blocks
            )
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
              (
                blocks,
                index
              ) => {

                result.push({

                  ...page,



                  // Each article part gets
                  // its own stable PageFlip ID.

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
                    result.length + 1

                });

              }

            );

          } else {

            // ========================================
            // NORMAL PAGE
            // ========================================

            result.push({

              ...page,

              position:
                result.length + 1

            });

          }

        }

      );



      return result;

    }, [databasePages]);



  const totalPages =
    displayPages.length;



  // ==================================================
  // INITIALIZE PAGE FROM URL UPON LOAD
  // ==================================================

  useEffect(() => {

    if (
      displayPages.length > 0 &&
      !isInitialized
    ) {

      if (
        urlPageNumber &&
        !isNaN(urlPageNumber)
      ) {

        const targetIndex =
          Math.max(
            0,
            Math.min(
              urlPageNumber - 1,
              totalPages - 1
            )
          );

        setCurrentPage(
          targetIndex
        );

        setTimeout(() => {

          bookRef.current?.flipTo(
            targetIndex
          );

        }, 150);

      }

      setIsInitialized(true);

    }

  }, [
    displayPages,
    urlPageNumber,
    isInitialized,
    totalPages
  ]);



  // ==================================================
  // PAGE CHANGE
  // ==================================================

  const handlePageChange = (
    page
  ) => {

    setCurrentPage(
      page
    );



    if (
      isInitialized &&
      totalPages > 0
    ) {

      navigate(
        `/read/${activeSlug}/page/${page + 1}`,
        {
          replace: true
        }
      );

    }

  };



  // ==================================================
  // NAVIGATION
  // ==================================================

  const previousPage = () => {

    console.log(
      "READER: PREVIOUS PAGE"
    );



    bookRef.current?.prev();

  };



  const nextPage = () => {

    console.log(
      "READER: NEXT PAGE"
    );



    bookRef.current?.next();

  };



  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div
        className="impilo-reader-loading"
      >

        <p>
          Loading IMPILO...
        </p>

      </div>

    );

  }



  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (

      <div
        className="impilo-reader-error"
      >

        <h2>
          Unable to load magazine
        </h2>

        <p>
          {error}
        </p>

      </div>

    );

  }



  // ==================================================
  // MAGAZINE NOT FOUND
  // ==================================================

  if (!magazine) {

    return (

      <div
        className="impilo-reader-error"
      >

        <p>
          Magazine not found.
        </p>

      </div>

    );

  }



  // ==================================================
  // MAGAZINE PAGES NOT FOUND
  // ==================================================

  if (
    !displayPages.length
  ) {

    return (

      <div
        className="impilo-reader-error"
      >

        <p>
          This magazine does not have
          any pages yet.
        </p>

      </div>

    );

  }



  // ==================================================
  // PROGRESS
  // ==================================================

  const progress =
    totalPages > 0
      ? (
          (currentPage + 1) /
          totalPages
        ) * 100
      : 0;



  // ==================================================
  // RENDER
  // ==================================================

  return (

    <main
      className="impilo-reader"
    >



      {/* ==========================================
          READER CHROME
      ========================================== */}

      <div
        className="impilo-reader-progress"
      >

        <div
          className="impilo-reader-progress-fill"
          style={{
            width:
              `${progress}%`
          }}
        />

      </div>



      <div
        className="impilo-reader-counter"
      >

        📖 Page{" "}

        {currentPage + 1}

        {" "}

        of{" "}

        {totalPages}

      </div>



      {/* ==========================================
          MAGAZINE
      ========================================== */}

   
<div
  className="impilo-reader-book"
>

  <MagazineBook
    ref={bookRef}
    pages={displayPages}
    allPages={displayPages}
    initialPage={currentPage}
    onPageChange={
      handlePageChange
    }
    onJumpToPage={(targetIndex) => {
      bookRef.current?.flipTo(targetIndex);
    }}
  />

</div>



      {/* ==========================================
          NAVIGATION
      ========================================== */}

      <div
        className="impilo-reader-controls"
      >

        <button
          type="button"
          className="impilo-glass-btn"
          onClick={
            previousPage
          }
          disabled={
            currentPage === 0
          }
        >

          ← Prev

        </button>



        <button
          type="button"
          className="impilo-glass-btn"
          onClick={
            nextPage
          }
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