import React from "react";

export default function ContentsPageRenderer({ page, issuePages = [], onJumpToPage }) {
  // Extract custom JSON content if provided, or fallback to auto-generated list from issue pages
  const customContent = page?.content || {};
  const heading = customContent.heading || "Table of Contents";
  const intro = customContent.intro || "Inside this issue...";

  // Filter out system/cover/contents pages if you want a clean editorial index, 
  // or map all pages that have a title or linked article.
  const indexablePages = issuePages.filter(
    (p) => p.type !== "COVER" && p.type !== "CONTENTS" && (p.title || p.article?.title)
  );

  return (
    <div className="impilo-contents-page">
      <header className="impilo-contents-header">
        <h2>{heading}</h2>
        {intro && <p className="impilo-contents-intro">{intro}</p>}
      </header>

      <ul className="impilo-contents-list">
        {indexablePages.map((item) => {
          const title = item.article?.title || item.title || "Untitled Page";
          const subtitle = item.article?.subtitle || "";
          
          return (
            <li key={item.id} className="impilo-contents-item">
              <button 
                type="button" 
                className="impilo-contents-link"
                onClick={() => {
                  // item.position is 1-indexed, flipTo expects 0-indexed page array index
                  if (onJumpToPage && typeof item.position === "number") {
                    onJumpToPage(item.position - 1);
                  }
                }}
              >
                <span className="impilo-contents-item-title">{title}</span>
                <span className="impilo-contents-dots" />
                <span className="impilo-contents-page-num">{item.position}</span>
              </button>
              {subtitle && <small className="impilo-contents-subtitle">{subtitle}</small>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}