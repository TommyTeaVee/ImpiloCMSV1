import React from "react";

import MagazineReader from "../components/magazine/MagazineReader";

/**
 * ==================================================
 * HOME PAGE VIEW
 * ==================================================
 * 
 * Serves as the primary landing surface for readers
 * visiting Impilo Magazine. Directly embeds the 
 * interactive magazine reader component for issue "impilo-101".
 */
export default function Home() {

  return (

    <main
      className="impilo-home-container"
    >

      {/* ==========================================
          MAGAZINE READER EMBED
      ========================================== */}

      <div
        className="impilo-magazine-book-wrapper"
      >

        <MagazineReader
          slug="impilo-101"
        />

      </div>

    </main>

  );

}