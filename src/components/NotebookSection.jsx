// NotebookSection.jsx
import React from "react";

export default function NotebookSection({ title, children, customClass="", hasTape="" }) {
  return (
    <section className="notebook-wrapper">
      <div className={`notebook-shadow ${customClass}`}>
        <div className= {`notebook-tape--top-left ${hasTape}`} />
        <div className=" notebook-tape--top-right" />
        <div className="notebook-page">
          {title && <h2 className="notebook-title">{title}</h2>}
          <div className="notebook-content">{children}</div>
        </div>
      </div>
    </section>
  );
}
