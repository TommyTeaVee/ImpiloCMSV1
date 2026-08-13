import MediaGallery from "./MediaGallery";
import MediaLightbox from "./MediaLightbox";
import { MediaLightboxProvider } from "./MediaLightboxProvider";

const testMedia = [
  {
    id: "landscape-62",
    type: "IMAGE",
    provider: "CLOUDFRONT",
    url: "https://d1zrm2iszdbieq.cloudfront.net/assets/models_land/62.jpg",
    altText: "IMPILO model landscape 62",
    caption: "IMPILO Model Editorial"
  },
  {
    id: "landscape-63",
    type: "IMAGE",
    provider: "CLOUDFRONT",
    url: "https://d1zrm2iszdbieq.cloudfront.net/assets/models_land/63.jpg",
    altText: "IMPILO model landscape 63",
    caption: "IMPILO Model Editorial 2"
  },
  {
    id: "landscape-64",
    type: "IMAGE",
    provider: "CLOUDFRONT",
    url: "https://d1zrm2iszdbieq.cloudfront.net/assets/models_land/64.jpg",
    altText: "IMPILO model landscape 64",
    caption: "IMPILO Model Editorial 3"
  }
];

export default function MediaGalleryTest() {
  return (
    <main className="media-gallery-test">
      <article className="uk-article">
        <h1 className="uk-article-title">
          IMPILO Media Test
        </h1>

        <p className="uk-text-lead">
          CloudFront editorial gallery
        </p>

        <MediaLightboxProvider>
          <MediaGallery
            items={testMedia}
            columns={3}
          />

          <MediaLightbox />
        </MediaLightboxProvider>
      </article>
    </main>
  );
}