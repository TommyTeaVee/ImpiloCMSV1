import CloudFrontMediaLibrary from "../components/CloudFrontMediaLibrary.jsx";

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
      <CloudFrontMediaLibrary
        onSelect={handleSelect}
      />
    </main>
  );
}