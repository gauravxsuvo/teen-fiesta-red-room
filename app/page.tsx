import Image from "next/image";
import Navigation from "./components/Navigation";
import MotionObserver from "./components/MotionObserver";
import SculptureStage from "./components/SculptureStage";
import { redRoomEvent } from "./data/red-room";

const gallery = [
  {
    src: "/media/red-room-poster.jpg",
    alt: "Official Teen Fiesta × etc RED ROOM campaign poster for 31 October 2026 at Mansion Agra.",
    label: "THE ANNOUNCEMENT",
    note: "31.10.2026 / MANSION AGRA",
    className: "gallery-tile gallery-tile--poster",
    width: 1120,
    height: 1408,
  },
  {
    src: "/media/red-room-dj.jpg",
    alt: "A dark red-lit room with a RED ROOM 31.10 campaign projection.",
    label: "INSIDE THE ROOM",
    note: "RED ROOM / 31.10",
    className: "gallery-tile gallery-tile--room",
    width: 640,
    height: 1136,
  },
  {
    src: "/media/record-campaign.jpg",
    alt: "Teen Fiesta × etc campaign art featuring a record in warm red and amber light.",
    label: "A PREVIOUS CHAPTER",
    note: "GINZA / 07 AUG",
    className: "gallery-tile gallery-tile--record",
    width: 1013,
    height: 1800,
  },
  {
    src: "/media/hero-campaign.jpg",
    alt: "A close-up campaign photograph from a past Teen Fiesta × etc event, lit in red.",
    label: "CAMPAIGN ARCHIVE",
    note: "TEEN FIESTA × ETC",
    className: "gallery-tile gallery-tile--portrait",
    width: 1280,
    height: 1600,
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation />
      <MotionObserver />

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <Image
            src="/media/red-room-interior.jpg"
            alt=""
            fill
            preload
            sizes="100vw"
            className="hero__backdrop"
          />
          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__frame page-shell">
            <div className="hero__topline">
              <span>TEEN FIESTA <i aria-hidden="true">×</i> ETC.</span>
              <span>AGRA, INDIA <b aria-hidden="true">/</b> 2026</span>
            </div>

            <div className="hero__stage">
              <div className="hero__copy">
                <p className="eyebrow hero__eyebrow"><span className="eyebrow__dot" /> A NIGHT FOR THE YOUTH</p>
                <h1 className="display hero__title" id="hero-title">
                  <span>TEEN</span>
                  <span>FIESTA</span>
                  <em>RED ROOM</em>
                </h1>
                <p className="hero__intro">The room turns red. The night belongs to the people who fill it.</p>
                <div className="hero__actions">
                  <a className="button button--red" href="/pricing">
                    Explore DASH <span aria-hidden="true">↗</span>
                  </a>
                  <a className="text-link" href="#aftermovie">Watch the aftermovie <span aria-hidden="true">↓</span></a>
                </div>
                <div className="hero__artist"><span>MUSIC BY</span><strong>{redRoomEvent.artist}</strong></div>
              </div>

              <div className="hero__object" aria-hidden="true"><SculptureStage /></div>

              <figure className="hero__poster" data-reveal>
                <Image
                  src="/media/red-room-poster.jpg"
                  alt=""
                  width={1120}
                  height={1408}
                  preload
                  sizes="(max-width: 760px) 72vw, 30vw"
                />
                <figcaption><span>THE ORIGINAL ARTWORK</span><span>01 / 04</span></figcaption>
              </figure>
            </div>

            <div className="hero__bottomline" aria-label="Event details">
              <span>ONE CITY <b>·</b> ONE NIGHT</span>
              <span>31.10.2026</span>
              <span>5–9 PM</span>
              <a href="#event-details">EVENT DETAILS <i aria-hidden="true">↓</i></a>
            </div>
          </div>
          <span className="hero__margin-note" aria-hidden="true">MUSIC<br />PEOPLE<br />CREATIVITY<br />NO LIMITS</span>
        </section>

        <div className="marquee" aria-label="Teen Fiesta Red Room">
          <div className="marquee__track" aria-hidden="true">
            {Array.from({ length: 2 }, (_, index) => (
              <span className="marquee__set" key={index}>
                <b>RED ROOM</b><i>✳</i><b>31.10.2026</b><i>✳</i><b>AGRA AFTER DARK</b><i>✳</i>
              </span>
            ))}
          </div>
        </div>

        <section className="experience section-shell" id="experience" aria-labelledby="experience-title">
          <div className="experience__heading" data-reveal>
            <p className="eyebrow"><span>01</span> — THE EXPERIENCE</p>
            <h2 className="display" id="experience-title">MUSIC.<br /><em>PEOPLE.</em><br />NO LIMITS.</h2>
            <p className="body-copy">A night shaped by sound, shared energy and the red glow of the room. Made for being there.</p>
            <a className="round-link" href="#event-details" aria-label="See event details"><span aria-hidden="true">↘</span></a>
          </div>
          <figure className="experience__image" data-reveal>
            <Image
              src="/media/red-room-dj.jpg"
              alt="The RED ROOM campaign projection above the venue bar, lit in red."
              width={640}
              height={1136}
              sizes="(max-width: 760px) 90vw, 34vw"
              className="image-cover"
            />
            <figcaption><span>RED ROOM / 31.10</span><span>THE SPACE, AFTER DARK</span></figcaption>
          </figure>
          <div className="experience__note" data-reveal>
            <span className="experience__index">01—03</span>
            <p>Come for the music.<br /><em>Stay in the moment.</em></p>
            <span className="experience__caption">TEEN FIESTA × ETC. / AGRA</span>
          </div>
        </section>

        <section className="event-panel" id="event-details" aria-labelledby="event-title">
          <div className="event-panel__inner page-shell">
            <div className="event-panel__heading" data-reveal>
              <p className="eyebrow"><span>02</span> — MARK THE NIGHT</p>
              <h2 className="display" id="event-title">SEE YOU<br /><em>IN RED.</em></h2>
            </div>
            <div className="event-panel__details" data-reveal>
              <div className="event-detail"><span>DATE</span><strong>{redRoomEvent.date}</strong><small>{redRoomEvent.dateShort}</small></div>
              <div className="event-detail"><span>TIME</span><strong>{redRoomEvent.time}</strong><small>5:00 PM — 9:00 PM</small></div>
              <div className="event-detail"><span>PLACE</span><strong>{redRoomEvent.venue}</strong><small>{redRoomEvent.city}, India</small></div>
              <div className="event-detail"><span>SOUND</span><strong>{redRoomEvent.artist}</strong><small>Music by</small></div>
              <a className="button button--paper" href="/pricing">Pass info <span aria-hidden="true">↗</span></a>
            </div>
            <span className="event-panel__stamp" aria-hidden="true">31<br /><i>10</i></span>
          </div>
        </section>

        <section className="gallery-section section-shell" id="gallery" aria-labelledby="gallery-title">
          <div className="gallery-section__heading" data-reveal>
            <div>
              <p className="eyebrow"><span>03</span> — THE CAMPAIGN ARCHIVE</p>
              <h2 className="display" id="gallery-title">RED IN<br /><em>EVERY FRAME.</em></h2>
            </div>
            <p className="body-copy">A collection of Teen Fiesta images: the new RED ROOM announcement alongside frames from earlier campaign chapters.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <figure className={item.className} data-reveal key={item.src}>
                <a className="gallery-tile__link" href={item.src} target="_blank" rel="noreferrer" aria-label={`Open image: ${item.alt}`}>
                  <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 760px) 90vw, 45vw" className="image-cover" loading="lazy" />
                  <span className="gallery-tile__number">0{index + 1}</span>
                  <span className="gallery-tile__open" aria-hidden="true">↗</span>
                </a>
                <figcaption><span>{item.label}</span><span>{item.note}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="aftermovie section-shell" id="aftermovie" aria-labelledby="aftermovie-title">
          <div className="aftermovie__copy" data-reveal>
            <p className="eyebrow"><span>04</span> — IN MOTION</p>
            <h2 className="display" id="aftermovie-title">FEEL IT<br /><em>MOVE.</em></h2>
            <p className="body-copy">Press play on the supplied Teen Fiesta film. Sound on, lights low.</p>
            <span className="aftermovie__meta">TEEN FIESTA × ETC. / CAMPAIGN FILM</span>
          </div>
          <figure className="film-frame" data-reveal>
            <video controls playsInline preload="none" poster="/media/red-room-interior.jpg" aria-label="Teen Fiesta campaign aftermovie">
              <source src="/media/teen-fiesta-film.mp4" type="video/mp4" />
              Your browser does not support embedded video.
            </video>
            <figcaption><span>PLAY CAMPAIGN FILM</span><span>↗</span></figcaption>
          </figure>
        </section>

        <section className="closing" aria-labelledby="closing-title">
          <div className="closing__inner page-shell" data-reveal>
            <span className="closing__kicker">31.10.2026 <i>·</i> MANSION, AGRA</span>
            <h2 className="display" id="closing-title">THE ROOM<br /><em>IS WAITING.</em></h2>
            <p>Music by Fentatine. One night, in full colour.</p>
            <a className="button button--red" href="/pricing">Discover DASH <span aria-hidden="true">↗</span></a>
            <span className="closing__watermark" aria-hidden="true">TF</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner page-shell">
          <a href="#top" className="footer-wordmark"><span>TF</span> TEEN FIESTA</a>
          <p>RED ROOM <i>×</i> ETC. <b>/</b> AGRA, INDIA</p>
          <a href="/pricing" className="footer-pass">DASH PASS INFO ↗</a>
        </div>
      </footer>
    </>
  );
}
