import StaticPage from "./StaticPage";

const EXT = { rel: "noopener noreferrer", target: "_blank" };

export default function Privacy() {
  return (
    <StaticPage title="Privacy Policy" updated="22 November 2026">
      <p>
        Impilo Magazine (impilomag.co.za) is published by Impilo Digital Media Group (“Impilo”,
        “we”, “us”). This policy explains what information we collect when you visit
        impilomag.co.za, why we collect it, who we share it with, and the choices you have. It is
        written to comply with South Africa’s Protection of Personal Information Act (POPIA).
      </p>

      <h2 className="uk-heading-small">1. Who we are and how to reach us</h2>
      <p>Responsible party: Impilo Digital Media Group, publisher of Impilo Magazine.</p>
      <p>
        Email: <a href="mailto:info@impilomag.co.za">info@impilomag.co.za</a>
      </p>
      <p>If you have a question about this policy or your information, write to us at that address.</p>

      <h2 className="uk-heading-small">2. Information we collect</h2>
      <p>
        <strong>Information collected automatically.</strong> When you visit the site, our servers
        and analytics tools record technical and usage information such as your IP address, browser
        type, device type, pages viewed, the page you came from, the date and time of your visit,
        and approximate location (country or city level). We do not use this to identify you
        personally.
      </p>
      <p>
        <strong>Information you give us.</strong> If you email us, we receive your email address and
        whatever you include in your message. If you create a reader account, comment on a story, or
        take part in quizzes or games on the site, we store the details you provide, such as your
        username, display name, email address and your activity on the account.
      </p>
      <p>
        We do not knowingly collect sensitive personal information, and we do not collect your
        precise (GPS) location.
      </p>

      <h2 className="uk-heading-small">3. How we use information</h2>
      <ul>
        <li>To publish the magazine and keep the site working, secure and fast.</li>
        <li>To understand which stories and features readers use, so we can improve them.</li>
        <li>To show advertising that helps fund the magazine (see section 5).</li>
        <li>To reply to your messages and run reader accounts, comments, quizzes and games.</li>
        <li>To meet our legal obligations and protect against misuse.</li>
      </ul>

      <h2 className="uk-heading-small">4. Cookies and analytics</h2>
      <p>Cookies are small text files stored on your device. We use three kinds:</p>
      <ul>
        <li>
          <strong>Essential cookies and storage</strong> that keep the site and your sign-in
          working.
        </li>
        <li>
          <strong>Analytics cookies.</strong> We measure site use with Matomo, running on our own
          server at analytics.impilomag.co.za. Matomo sets first-party cookies such as{" "}
          <code>_pk_id</code> (up to 13 months) and <code>_pk_ses</code> (30 minutes) to recognise
          repeat visits and count page views. Analytics data stays on our own server and is not
          shared with Matomo’s developers or sold.
        </li>
        <li>
          <strong>Advertising cookies</strong> set by Google and its partners (see section 5).
        </li>
      </ul>
      <p>
        You can block or delete cookies in your browser settings. Blocking essential cookies may
        stop parts of the site from working.
      </p>

      <h2 className="uk-heading-small">5. Advertising (Google AdSense)</h2>
      <p>
        We use Google AdSense to display ads on this site. Google, as a third-party vendor, uses
        cookies to serve ads based on your visits to this and other websites. Google’s use of
        advertising cookies, including the DoubleClick cookie, enables it and its partners to show
        ads to you based on your visit to our site and other sites on the internet.
      </p>
      <p>You can choose how this works:</p>
      <ul>
        <li>
          Opt out of personalised advertising by visiting{" "}
          <a href="https://adssettings.google.com" {...EXT}>
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          Opt out of some third-party vendors’ use of cookies for personalised advertising at{" "}
          <a href="https://www.aboutads.info" {...EXT}>
            www.aboutads.info
          </a>
          .
        </li>
        <li>
          Learn how Google uses information from sites that use its services at{" "}
          <a href="https://policies.google.com/technologies/partner-sites" {...EXT}>
            policies.google.com/technologies/partner-sites
          </a>
          .
        </li>
      </ul>
      <p>
        Where the law requires your consent for advertising cookies, we ask for it through a consent
        notice and will not set those cookies until you agree. Non-personalised ads can still be
        shown if you decline personalisation.
      </p>

      <h2 className="uk-heading-small">6. Who we share information with</h2>
      <p>We do not sell your personal information. We share it only with:</p>
      <ul>
        <li>
          <strong>Service providers</strong> that host and run the site on our behalf, under
          confidentiality obligations.
        </li>
        <li>
          <strong>Google</strong> and its advertising partners, as described in section 5.
        </li>
        <li>
          <strong>Authorities</strong>, when the law requires us to.
        </li>
      </ul>
      <p>
        The magazine may link to other sites, including our parent site co.impilomag.co.za, social
        media pages and other publishers. They have their own privacy policies and we are not
        responsible for them.
      </p>

      <h2 className="uk-heading-small">7. How long we keep information</h2>
      <ul>
        <li>Analytics data: up to 14 months.</li>
        <li>Server logs: 6 to 12 months.</li>
        <li>Cookie consent choices: 12 months.</li>
        <li>
          Reader account details and comments: for as long as your account exists, or until you ask
          us to remove them.
        </li>
        <li>Emails you send us: as long as needed to deal with your request.</li>
      </ul>

      <h2 className="uk-heading-small">8. Your rights</h2>
      <p>
        Under POPIA you may ask us to confirm what personal information we hold about you, to
        correct or delete it, to stop processing it, or to object to its use. To do so, email{" "}
        <a href="mailto:info@impilomag.co.za">info@impilomag.co.za</a>. We will respond within a
        reasonable time. If you are unhappy with how we handle your information, you can complain to
        South Africa’s Information Regulator at{" "}
        <a href="https://inforegulator.org.za" {...EXT}>
          inforegulator.org.za
        </a>
        .
      </p>

      <h2 className="uk-heading-small">9. Security</h2>
      <p>
        We protect information with reasonable technical and organisational measures, including
        encrypted connections (HTTPS) and restricted access to our systems. No method of
        transmission or storage is completely secure, so we cannot guarantee absolute security.
      </p>

      <h2 className="uk-heading-small">10. Children</h2>
      <p>
        Impilo Magazine is not directed at children under 18, and we do not knowingly collect their
        personal information. If you believe a child has given us personal information, email us and
        we will delete it.
      </p>

      <h2 className="uk-heading-small">11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The “Last updated” date at the top shows when
        it last changed. Continued use of the site after a change means you accept the updated
        policy.
      </p>

      <h2 className="uk-heading-small">12. Contact</h2>
      <p>
        Impilo Digital Media Group · Impilo Magazine
        <br />
        Email: <a href="mailto:info@impilomag.co.za">info@impilomag.co.za</a>
      </p>
    </StaticPage>
  );
}
