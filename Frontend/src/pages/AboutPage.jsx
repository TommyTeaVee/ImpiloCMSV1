import { Link } from "react-router-dom";
import StaticPage from "./StaticPage";

export default function About() {
  return (
    <StaticPage title="About Impilo Magazine">
      <p className="uk-text-lead">
        Impilo Magazine is a South African digital magazine covering fashion, lifestyle and
        culture. We publish bold stories that shape our generation.
      </p>

      <p>
        Our stories range from designer and creative profiles to features on business, media and
        the ideas moving African culture forward.
      </p>

      <p>
        Impilo is published by Impilo Digital Media Group, which also runs a fashion runway and
        event coverage service, a live-streaming studio, a talent and portfolio programme, and the
        Impilo Catalogue: a curated collection of brands, designers and creatives featured in the
        magazine and at our events. Learn more about the group at{" "}
        <a href="https://co.impilomag.co.za" rel="noopener noreferrer">
          co.impilomag.co.za
        </a>
        .
      </p>

      <p>
        Our stories are written and edited by our editorial team and published through our own
        content system. We aim to elevate voices and stories that deserve to be seen.
      </p>

      <h2 className="uk-heading-small">Read Impilo</h2>
      <p>
        Start with our <Link to="/">latest stories</Link> or open the interactive issue, then get in
        touch at <a href="mailto:info@impilomag.co.za">info@impilomag.co.za</a> or on our{" "}
        <Link to="/contact">contact page</Link>.
      </p>
    </StaticPage>
  );
}