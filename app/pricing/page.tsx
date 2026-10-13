import type { Metadata } from "next";
import Image from "next/image";
import Navigation from "../components/Navigation";
import MotionObserver from "../components/MotionObserver";
import { dashPass, redRoomEvent } from "../data/red-room";

export const metadata: Metadata = {
  title: "DASH Passes — Teen Fiesta RED ROOM",
  description: "Pass information for Teen Fiesta RED ROOM at Mansion, Agra on 31 October 2026.",
  openGraph: {
    title: "DASH Passes — Teen Fiesta RED ROOM",
    description: "Pass information for RED ROOM, 31 October 2026 at Mansion, Agra.",
  },
};

export default function PricingPage() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation />
      <MotionObserver />
      <main className="pricing-main" id="main">
        <section className="pricing-hero page-shell" aria-labelledby="pricing-title">
          <div className="pricing-hero__copy" data-reveal>
            <p className="eyebrow"><span>TEEN FIESTA</span> — PASS DESK</p>
            <h1 className="display" id="pricing-title">FIND YOUR<br /><em>WAY IN.</em></h1>
            <p className="body-copy">One pass option has been announced: DASH. Price and entry details will be added when they’re confirmed.</p>
            <div className="pricing-event-line">
              <span>{redRoomEvent.date}</span><i aria-hidden="true">/</i><span>{redRoomEvent.time}</span><i aria-hidden="true">/</i><span>{redRoomEvent.venue}, {redRoomEvent.city}</span>
            </div>
          </div>
          <figure className="pricing-hero__art" data-reveal>
            <Image src="/media/red-room-poster.jpg" alt="Official RED ROOM event poster, dated 31 October 2026 at Mansion Agra." width={1120} height={1408} preload sizes="(max-width: 760px) 76vw, 32vw" />
            <figcaption><span>THE ORIGINAL ARTWORK</span><span>31.10.2026</span></figcaption>
          </figure>
        </section>

        <section className="pass-section page-shell" aria-labelledby="pass-title">
          <div className="pass-section__intro" data-reveal>
            <p className="eyebrow"><span>01</span> — THE PASS</p>
            <h2 className="display" id="pass-title">DASH<br /><em>PASS.</em></h2>
            <p className="body-copy">The pass name is confirmed. Price, inclusions, availability and booking information have not been announced.</p>
          </div>

          <article className="pass-card" data-reveal>
            <div className="pass-card__topline"><span>TEEN FIESTA × ETC.</span><span>PASS 01 / 01</span></div>
            <div className="pass-card__name"><span>ACCESS</span><h3>{dashPass.name}</h3></div>
            <div className="pass-card__price">
              <span>PRICE</span>
              <strong>TO BE<br />ANNOUNCED</strong>
              <small>Pass price not announced.</small>
            </div>
            <div className="pass-card__specs" aria-label="DASH pass information">
              <div><span>INCLUDES</span><strong>To be announced</strong></div>
              <div><span>AVAILABILITY</span><strong>Not announced</strong></div>
              <div><span>BOOKING</span><strong>Link not connected</strong></div>
            </div>
            <div className="pass-card__foot">
              <span>DASH / {redRoomEvent.dateShort}</span>
              <span>MANSION, AGRA</span>
            </div>
          </article>
        </section>

        <section className="pricing-note" aria-labelledby="pricing-note-title">
          <div className="pricing-note__inner page-shell" data-reveal>
            <p className="eyebrow"><span>02</span> — BEFORE YOU BOOK</p>
            <div>
              <h2 className="display" id="pricing-note-title">THE DETAILS<br /><em>WILL FOLLOW.</em></h2>
              <p className="body-copy">RED ROOM is set for 31 October 2026 at Mansion, Agra, from 5–9 PM, with music by Fentatine. Pass price, inclusions and availability have not been announced. No booking link is connected on this page yet.</p>
              <a className="text-link" href="/#event-details">Back to event details <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner page-shell">
          <a href="/#top" className="footer-wordmark"><span>TF</span> TEEN FIESTA</a>
          <p>RED ROOM <i>×</i> ETC. <b>/</b> AGRA, INDIA</p>
          <a href="/#event-details" className="footer-pass">EVENT DETAILS ↗</a>
        </div>
      </footer>
    </>
  );
}
