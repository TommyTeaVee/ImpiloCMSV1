import {
  useState
} from "react";


function getYouTubeId(value) {
  if (!value) {
    return null;
  }

  const input =
    value.trim();


  // Direct YouTube ID
  if (
    /^[a-zA-Z0-9_-]{11}$/.test(
      input
    )
  ) {
    return input;
  }


  try {
    const url =
      new URL(input);


    // youtube.com/watch?v=ID
    if (
      url.hostname.includes(
        "youtube.com"
      ) &&
      url.searchParams.get("v")
    ) {
      return url.searchParams.get(
        "v"
      );
    }


    // youtu.be/ID
    if (
      url.hostname ===
      "youtu.be"
    ) {
      return url.pathname
        .replace("/", "")
        .split("/")[0];
    }


    // youtube.com/embed/ID
    if (
      url.hostname.includes(
        "youtube.com"
      ) &&
      url.pathname.startsWith(
        "/embed/"
      )
    ) {
      return url.pathname
        .split("/embed/")[1]
        .split("/")[0];
    }

  } catch {
    return null;
  }


  return null;
}


export default function YouTubeMediaForm({
  onSelect,
  onClose
}) {

  const [
    url,
    setUrl
  ] = useState("");


  const [
    error,
    setError
  ] = useState("");


  const [
    previewId,
    setPreviewId
  ] = useState(null);


  function handlePreview() {

    setError("");

    const id =
      getYouTubeId(url);


    if (!id) {
      setPreviewId(null);

      setError(
        "Enter a valid YouTube URL."
      );

      return;
    }


    setPreviewId(id);
  }


  function handleUseVideo() {

    const id =
      getYouTubeId(url);


    if (!id) {
      setError(
        "Enter a valid YouTube URL."
      );

      return;
    }


    onSelect?.({
      type: "VIDEO",

      provider: "YOUTUBE",

      url: url.trim(),

      externalId: id,

      altText: "",

      caption: ""
    });
  }


  return (
    <div className="impilo-youtube-form">

      <label htmlFor="youtube-url">
        YouTube URL
      </label>


      <input
        id="youtube-url"
        type="url"
        value={url}
        onChange={(event) => {
          setUrl(
            event.target.value
          );

          setPreviewId(null);
          setError("");
        }}
        placeholder="https://www.youtube.com/watch?v=HdkV7DA4aUs"
      />


      <button
        type="button"
        onClick={
          handlePreview
        }
      >
        Preview Video
      </button>


      {error && (
        <p role="alert">
          {error}
        </p>
      )}


      {previewId && (
        <div className="impilo-youtube-preview">

          <iframe
            src={`https://www.youtube.com/embed/${previewId}`}
            title="YouTube video preview"
            width="100%"
            height="550"
            allowFullScreen
          />


          <button
            type="button"
            onClick={
              handleUseVideo
            }
          >
            Use This Video
          </button>

        </div>
      )}

    </div>
  );
}