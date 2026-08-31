import React from "react";

export default function MediaControls({
  onChangeMedia,
  onEditDetails,
  onRemove,
  disabled = false,
}) {
  return (
    <div className="impilo-media-controls">

      <button
        type="button"
        className="impilo-media-control-button"
        onClick={onChangeMedia}
        disabled={disabled}
      >
        Change Media
      </button>

      <button
        type="button"
        className="impilo-media-control-button"
        onClick={onEditDetails}
        disabled={disabled}
      >
        Edit Details
      </button>

      <button
        type="button"
        className="impilo-media-control-button impilo-media-control-remove"
        onClick={onRemove}
        disabled={disabled}
      >
        Remove
      </button>

    </div>
  );
}