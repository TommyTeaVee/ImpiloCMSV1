const CLOUDFRONT_BASE =
  "https://d1zrm2iszdbieq.cloudfront.net/assets";

export const MEDIA_ALBUMS = {
  modelsPortraits: {
    id: "models-portraits",
    title: "Model Portraits",
    type: "IMAGE_ALBUM",
    provider: "CLOUDFRONT",
    baseUrl: `${CLOUDFRONT_BASE}/models_pot/`,
    extension: "jpg"
  },

  modelsLandscape: {
    id: "models-landscape",
    title: "Model Landscapes",
    type: "IMAGE_ALBUM",
    provider: "CLOUDFRONT",
    baseUrl: `${CLOUDFRONT_BASE}/models_land/`,
    extension: "jpg"
  }
};

export function buildCloudFrontAlbum(
  album,
  numbers
) {
  if (!album || !Array.isArray(numbers)) {
    return [];
  }

  return numbers.map((number) => ({
    id: `${album.id}-${number}`,
    type: "IMAGE",
    provider: album.provider,
    url: `${album.baseUrl}${number}.${album.extension}`,
    altText: `${album.title} ${number}`,
    caption: null,
    credit: "IMPILO Magazine"
  }));
}