import React, {
  useState
} from "react";

import MediaPicker from "../components/editorial/MediaPicker";

const testMedia = [
  {
    id: "landscape-62",
    type: "IMAGE",
    provider: "CLOUDFRONT",
    url: "https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/assets/models_land/62.jpg",
    altText:
      "IMPILO model landscape 62",
    caption:
      "IMPILO Model Editorial"
  },

  {
    id: "landscape-63",
    type: "IMAGE",
    provider: "CLOUDFRONT",
    url: "https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/assets/models_land/63.jpg",
    altText:
      "IMPILO model landscape 63",
    caption:
      "IMPILO Model Editorial 2"
  },

  {
    id: "landscape-64",
    type: "IMAGE",
    provider: "CLOUDFRONT",
    url: "https://pub-3b74daf955444cf484ba5da4777ce1ec.r2.dev/assets/models_land/64.jpg",
    altText:
      "IMPILO model landscape 64",
    caption:
      "IMPILO Model Editorial 3"
  }
];

export default function MediaPickerTest() {
  const [selectedMedia, setSelectedMedia] =
    useState(null);

  return (
    <main className="media-picker-test">

      <h1>
        IMPILO Media Picker Test
      </h1>

      <p>
        This is the CMS media-selection
        component. It does not open the
        reader lightbox.
      </p>

      <MediaPicker
        type="IMAGE"
        media={testMedia}
        selectedMediaId={
          selectedMedia?.id || null
        }
        onSelect={(media) => {
          console.log(
            "Selected media:",
            media
          );

          setSelectedMedia(
            media
          );
        }}
      />

      {selectedMedia && (
        <section>

          <h2>
            Selected Media
          </h2>

          <p>
            ID:{" "}
            {selectedMedia.id}
          </p>

          <p>
            Type:{" "}
            {selectedMedia.type}
          </p>

          <p>
            Provider:{" "}
            {selectedMedia.provider}
          </p>

        </section>
      )}

    </main>
  );
}