import React, {
  useEffect,
  useState
} from "react";

import api from "../../services/api";

import MediaGallery
  from "../media/MediaGallery";

import MediaLightbox
  from "../media/MediaLightbox";

import {
  MediaLightboxProvider
} from "../media/MediaLightboxProvider";


export default function AdminMedia() {

  const [media, setMedia] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [filter, setFilter] =
    useState("ALL");


  // ==================================================
  // LOAD MEDIA
  // ==================================================

  useEffect(() => {

    async function loadMedia() {

      try {

        setLoading(true);
        setError("");

        const response =
          await api.get("/media");

        const data =
          response.data;

        setMedia(
          Array.isArray(data?.media)
            ? data.media
            : []
        );

      } catch (err) {

        console.error(
          "Load media error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Unable to load media."
        );

      } finally {

        setLoading(false);

      }

    }

    loadMedia();

  }, []);


  // ==================================================
  // FILTER
  // ==================================================

  const filteredMedia =
    filter === "ALL"
      ? media
      : media.filter(
          (item) =>
            String(item.type || "")
              .toUpperCase() === filter
        );


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <section
        className="impilo-admin-media"
      >

        <div
          className="impilo-admin-media-loading"
        >
          Loading media...
        </div>

      </section>
    );

  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (
      <section
        className="impilo-admin-media"
      >

        <div
          className="impilo-editorial-error"
        >
          {error}
        </div>

      </section>
    );

  }


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <section
      className="impilo-admin-media"
    >


      {/* ==========================================
          HEADER
      ========================================== */}

      <header
        className="impilo-admin-media-header"
      >

        <div>

          <span>
            IMPILO MEDIA LIBRARY
          </span>

          <h2>
            Media
          </h2>

          <p>
            Browse and manage editorial
            media assets.
          </p>

        </div>


        <strong>
          {media.length} assets
        </strong>

      </header>


      {/* ==========================================
          FILTERS
      ========================================== */}

      <div
        className="impilo-admin-media-filters"
      >

        <button
          type="button"
          className={
            filter === "ALL"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("ALL")
          }
        >
          All
        </button>


        <button
          type="button"
          className={
            filter === "IMAGE"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("IMAGE")
          }
        >
          Images
        </button>


        <button
          type="button"
          className={
            filter === "VIDEO"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("VIDEO")
          }
        >
          Videos
        </button>


        <button
          type="button"
          className={
            filter === "AUDIO"
              ? "active"
              : ""
          }
          onClick={() =>
            setFilter("AUDIO")
          }
        >
          Audio
        </button>

      </div>


      {/* ==========================================
          EMPTY
      ========================================== */}

      {filteredMedia.length === 0 ? (

        <div
          className="impilo-admin-placeholder"
        >

          <h3>
            No media found
          </h3>

          <p>
            No assets match the current
            selection.
          </p>

        </div>

      ) : (

        <MediaLightboxProvider>

          <MediaGallery
            items={filteredMedia}
            columns={4}
          />

          <MediaLightbox />

        </MediaLightboxProvider>

      )}

    </section>

  );

}