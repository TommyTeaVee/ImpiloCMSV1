import R2MediaLibrary from "../components/R2MediaLibrary";

export default function CloudFrontMediaTest() {
  function handleSelect(media) {
    console.log(
      "SELECTED MEDIA:",
      media
    );

    alert(
      `Selected: ${media.filename}`
    );
  }

  return (
    <main>
      <R2MediaLibrary
        onSelect={handleSelect}
      />
    </main>
  );
}