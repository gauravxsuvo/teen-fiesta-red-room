import Image from "next/image";
import Navigation from "./components/Navigation";
import MotionObserver from "./components/MotionObserver";
import SculptureStage from "./components/SculptureStage";

const moments = [
  {
    src: "/media/sunset-poster.jpg",
    alt: "Teen Fiesta campaign poster with a glowing red sun and sunset lettering.",
    caption: "A sunset, held in red.",
    className: "moment-card moment-card--sunset",
    width: 1089,
    height: 1372,
  },
  {
    src: "/media/red-room-dj.jpg",
    alt: "A red lit room and DJ setup from the Teen Fiesta campaign imagery.",
    caption: "Inside the red room.",
    className: "moment-card moment-card--dj",
    width: 640,
    height: 1136,
  },
  {
    src: "/media/interior-poster.jpg",
    alt: "Warm interior campaign image with a plant filled room and Teen Fiesta artwork.",
    caption: "The room before the lights change.",
    className: "moment-card moment-card--interior",
    width: 640,
    height: 1136,
  },
  {
    src: "/media/red-room-poster.jpg",
    alt: "Teen Fiesta × etc Red Room campaign poster in deep red.",
    caption: "A campaign made for the room.",
    className: "moment-card moment-card--poster",
    width: 1120,
    height: 1408,
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <MotionObserver />
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero__grid page-shell">
            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">
                <span className="eyebrow__dot" aria-hidden="true" />
                Teen Fiesta <span aria-hidden="true">×</span> etc
              </p>
              <h1 className="display hero__title" id="hero-title">
                TURN THE
                <br />
                ROOM
                <br />
                <em>RED.</em>
              </h1>
              <p className="hero__intro">
                Red light, close rooms, and moments made for the music. Step
                into the Teen Fiesta campaign.
              </p>
              <div className="hero__actions">
                <a className="button button--light" href="#campaign">
                  Explore the campaign
                  <span className="button__arrow" aria-hidden="true">
                    ↘
                  </span>
                </a>
                <a className="text-link" href="#film">
                  Watch the film <span aria-hidden="true">↓</span>
                </a>
              </div>
              <div className="hero__footnote">
                <span>CAMPAIGN NOTES</span>
                <span>LIGHT · SOUND · AFTERGLOW</span>
              </div>
            </div>

            <figure className="hero__artwork" aria-label="Teen Fiesta campaign artwork">
              <Image
                src="/media/hero-campaign.jpg"
                alt="Original Teen Fiesta × etc campaign photograph, bathed in red light, with its event lettering intact."
                width={1280}
                height={1600}
                preload
                sizes="(max-width: 760px) 90vw, 48vw"
                className="hero__image"
              />
              <span className="hero__artwork-index" aria-hidden="true">
                TF / ETC
                <br />
                CAMPAIGN
              </span>
              <SculptureStage />
              <figcaption className="hero__caption">
                <span>01 — THE MOMENT</span>
                <span>TEEN FIESTA × ETC</span>
              </figcaption>
            </figure>
          </div>
          <div className="hero__scroll" aria-hidden="true">
            <span>SCROLL TO FEEL IT</span>
            <span className="hero__scroll-line" />
          </div>
        </section>

        <section className="signal-strip" aria-label="Campaign themes">
          <div className="signal-strip__track">
            <span>THE ROOM</span>
            <span className="signal-strip__star" aria-hidden="true">✳</span>
            <span>THE PEOPLE</span>
            <span className="signal-strip__star" aria-hidden="true">✳</span>
            <span>THE AFTERGLOW</span>
            <span className="signal-strip__star" aria-hidden="true">✳</span>
            <span>THE ROOM</span>
            <span className="signal-strip__star" aria-hidden="true">✳</span>
            <span>THE PEOPLE</span>
            <span className="signal-strip__star" aria-hidden="true">✳</span>
            <span>THE AFTERGLOW</span>
          </div>
        </section>

        <section className="campaign-section page-shell" id="campaign" aria-labelledby="campaign-title">
          <div className="section-heading" data-reveal>
            <p className="eyebrow"><span>01</span> — THE CAMPAIGN</p>
            <h2 className="display section-heading__title" id="campaign-title">
              A LITTLE
              <br />
              <em>AFTERGLOW.</em>
            </h2>
          </div>

          <div className="campaign-feature">
            <figure className="campaign-feature__image" data-reveal>
              <Image
                src="/media/record-campaign.jpg"
                alt="Teen Fiesta campaign artwork built around a record and a wash of amber red light."
                width={1013}
                height={1800}
                sizes="(max-width: 760px) 88vw, 46vw"
                className="image-cover"
              />
              <figcaption>CAMPAIGN ARTWORK / 01</figcaption>
            </figure>
            <div className="campaign-feature__copy" data-reveal>
              <span className="margin-note">A NIGHT, IN ITS OWN COLOUR</span>
              <p className="campaign-feature__statement">
                It starts with a beat.
                <br />
                Then the whole room
                <br />
                <em>moves together.</em>
              </p>
              <p className="body-copy">
                Teen Fiesta × etc brings the campaign off the screen and into
                the room: close up, full colour, and best felt in the moment.
              </p>
              <a className="round-link" href="#moments" aria-label="Explore campaign moments">
                <span aria-hidden="true">↘</span>
              </a>
            </div>
          </div>
        </section>

        <section className="moments-section" id="moments" aria-labelledby="moments-title">
          <div className="page-shell">
            <div className="moments-section__header" data-reveal>
              <div>
                <p className="eyebrow"><span>02</span> — THE DETAILS</p>
                <h2 className="display" id="moments-title">
                  LITTLE THINGS.
                  <br />
                  <em>BIG FEELING.</em>
                </h2>
              </div>
              <p className="body-copy moments-section__intro">
                The posters, the spaces, the red that finds its way into every
                frame. A closer look at the Teen Fiesta campaign.
              </p>
            </div>

            <div className="moments-grid">
              {moments.map((moment, index) => (
                <figure className={moment.className} data-reveal key={moment.src}>
                  <div className="moment-card__image-wrap">
                    <Image
                      src={moment.src}
                      alt={moment.alt}
                      width={moment.width}
                      height={moment.height}
                      sizes="(max-width: 760px) 90vw, 40vw"
                      className="image-cover"
                      loading="lazy"
                    />
                    <span className="moment-card__index" aria-hidden="true">
                      0{index + 1}
                    </span>
                  </div>
                  <figcaption>
                    <span>{moment.caption}</span>
                    <span aria-hidden="true">↗</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="film-section page-shell" id="film" aria-labelledby="film-title">
          <div className="film-section__intro" data-reveal>
            <p className="eyebrow"><span>03</span> — IN MOTION</p>
            <h2 className="display" id="film-title">
              FEEL IT
              <br />
              <em>MOVE.</em>
            </h2>
            <p className="body-copy">
              Press play. The supplied campaign footage, in its original cut.
            </p>
          </div>
          <figure className="film-frame" data-reveal>
            <video
              controls
              playsInline
              preload="none"
              poster="/media/red-room-interior.jpg"
              aria-label="Teen Fiesta campaign video"
            >
              <source src="/media/teen-fiesta-film.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
            <figcaption>
              <span>TEEN FIESTA × ETC</span>
              <span>CAMPAIGN FILM</span>
            </figcaption>
          </figure>
        </section>

        <section className="rules-section" aria-labelledby="rules-title">
          <div className="rules-section__inner page-shell">
            <figure className="rules-artwork" data-reveal>
              <Image
                src="/media/house-rules.jpg"
                alt="Original Teen Fiesta House Rules poster, with icons and campaign marks."
                width={1100}
                height={1381}
                sizes="(max-width: 760px) 80vw, 32vw"
                className="image-cover"
              />
              <figcaption>THE HOUSE RULES / ORIGINAL ARTWORK</figcaption>
            </figure>
            <div className="rules-section__copy" data-reveal>
              <p className="eyebrow"><span>04</span> — THE ROOM IS OURS</p>
              <h2 className="display" id="rules-title">
                GOOD NIGHTS
                <br />
                <em>MAKE ROOM.</em>
              </h2>
              <p className="body-copy">
                The original House Rules artwork is part of the campaign too:
                a reminder that the best nights leave space for everyone.
              </p>
              <a
                className="text-link text-link--bright"
                href="/media/house-rules.jpg"
                target="_blank"
                rel="noreferrer"
              >
                Open the House Rules poster <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        <section className="closing-section" aria-labelledby="closing-title">
          <div className="closing-section__inner page-shell" data-reveal>
            <p className="eyebrow">TEEN FIESTA <span aria-hidden="true">×</span> ETC</p>
            <h2 className="display" id="closing-title">
              KEEP THE
              <br />
              <em>GLOW.</em>
            </h2>
            <a className="button button--light" href="#top">
              Back to the beginning
              <span className="button__arrow" aria-hidden="true">↑</span>
            </a>
            <div className="closing-section__mark" aria-hidden="true">TF</div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner page-shell">
          <a href="#top" className="footer-wordmark">TEEN FIESTA</a>
          <p>CAMPAIGN ARCHIVE <span aria-hidden="true">/</span> TEEN FIESTA × ETC</p>
          <a href="#main" className="footer-top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </>
  );
}
