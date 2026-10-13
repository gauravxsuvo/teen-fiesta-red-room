import Image from "next/image";
import Navigation from "./components/Navigation";
import MotionObserver from "./components/MotionObserver";
import SculptureStage from "./components/SculptureStage";
import CampaignGallery from "./components/CampaignGallery";
import FilmPlayer from "./components/FilmPlayer";
import DashTicket from "./components/DashTicket";
import SiteFooter from "./components/SiteFooter";
import { redRoomEvent } from "./data/red-room";
export default function Home() {
    return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation />
    <MotionObserver />
    <main id="main">
      <section className="hero" id="top" aria-labelledby="hero-title">
        <Image src="/media/red-room-interior.jpg" alt="" fill preload sizes="100vw" className="hero__backdrop"/>
        <div className="hero__shade" aria-hidden="true"/>
        <div className="hero__frame page-shell">
          <div className="hero__topline"><span>TEEN FIESTA <i>×</i> ETC.</span><span>AGRA, INDIA <b>/</b> 2026</span></div>
          <div className="hero__stage">
            <div className="hero__copy">
              <div className="hero__heading"><p className="eyebrow"><span className="eyebrow__dot"/> A NIGHT FOR THE YOUTH</p><h1 className="hero__title" id="hero-title"><span>TEEN</span><span>FIESTA</span><em>RED ROOM</em></h1></div>
              <div className="hero__message"><p className="hero__intro">The room turns red. The night belongs to the people who fill it.</p><div className="hero__actions"><a className="button button--red" href="/pricing">EXPLORE DASH <span aria-hidden="true">↗</span></a><a className="text-link" href="#aftermovie">WATCH THE FILM <span aria-hidden="true">↓</span></a></div><p className="hero__artist"><span>MUSIC BY</span><strong>{redRoomEvent.artist}</strong></p></div>
            </div>
            <div className="hero__object" aria-hidden="true"><SculptureStage /></div>
            <figure className="hero__poster" data-media-reveal><Image src="/media/red-room-poster.jpg" alt="Official RED ROOM poster: 31 October 2026, 5–9 PM, Mansion Agra, music by Fentatine." width={1120} height={1408} preload loading="eager" sizes="(max-width: 600px) 72vw, (max-width: 900px) 32vw, 26vw"/><figcaption><span>THE ORIGINAL ARTWORK</span><span>31 / 10</span></figcaption></figure>
          </div>
          <div className="hero__bottomline"><span>ONE CITY <i>·</i> ONE NIGHT</span><span>{redRoomEvent.dateShort}</span><span>{redRoomEvent.time}</span><a href="#event-details">EVENT DETAILS <span aria-hidden="true">↗</span></a></div>
        </div>
        <span className="hero__margin-note" aria-hidden="true">MUSIC<br />PEOPLE<br />CREATIVITY<br />NO LIMITS</span>
      </section>

      <section className="experience section-space" id="experience" aria-labelledby="experience-title">
        <div className="page-shell">
          <div className="section-topline"><span>01 / THE EXPERIENCE</span><span>MUSIC · PEOPLE · CREATIVITY</span></div>
          <h2 className="editorial-title" id="experience-title" data-reveal>Experience<span className="title-mark" aria-hidden="true">↗</span></h2>
          <div className="experience__layout">
            <div className="experience__copy" data-reveal><p className="large-copy">Come for the music.<br /><em>Stay in the moment.</em></p><p className="body-copy">A night shaped by sound, shared energy and the red glow of the room. Made for being there.</p><a className="text-link" href="#lineup">DISCOVER THE SOUND <span aria-hidden="true">→</span></a><span className="utility">TEEN FIESTA × ETC. / AGRA</span></div>
            <div className="experience__collage"><figure className="experience__portrait" data-media-reveal><Image src="/media/hero-campaign.jpg" width={1280} height={1600} alt="Crimson-lit dancer from the Teen Fiesta campaign archive." sizes="(max-width: 600px) 66vw, 32vw"/><figcaption>THE ENERGY / CAMPAIGN ARCHIVE</figcaption></figure><figure className="experience__room" data-media-reveal><Image src="/media/red-room-dj.jpg" width={640} height={1136} alt="The RED ROOM announcement projected in a dark red-lit room." sizes="(max-width: 600px) 44vw, 23vw"/><figcaption>RED ROOM / 31.10</figcaption></figure><span className="collage-caption">THE ROOM TURNS RED.</span></div>
          </div>
        </div>
      </section>

      <section className="lineup section-space" id="lineup" aria-labelledby="lineup-title">
        <div className="page-shell"><div className="section-topline"><span>02 / THE SOUND & THE PEOPLE</span><span>31.10.2026</span></div><div className="lineup__layout"><div className="lineup__title" data-reveal><span className="outline-title" aria-hidden="true">LINEUP</span><h2 className="display" id="lineup-title">LINEUP.</h2><Image src="/media/record-campaign.jpg" alt="A red-lit record from the Teen Fiesta campaign archive." width={1013} height={1800} sizes="(max-width: 600px) 74vw, 33vw" className="lineup__image"/><span className="utility">ARTISTS / PEOPLE / SHARED ENERGY</span></div><div className="lineup__info" data-reveal><div className="lineup__performer"><span className="utility">MUSIC BY</span><h3>{redRoomEvent.artist}</h3><span aria-hidden="true">↗</span></div><p className="body-copy">The sound of RED ROOM. Music by Fentatine at Mansion, Agra.</p><div className="lineup__themes"><p><span>01</span> MUSIC</p><p><span>02</span> PEOPLE</p><p><span>03</span> CREATIVITY</p></div><p className="lineup__note">Further performers and activity details have not been announced.</p><a href="#event-details" className="text-link">THE NIGHT’S DETAILS <span aria-hidden="true">→</span></a></div></div></div>
      </section>

      <section className="gallery-section section-space" id="gallery" aria-labelledby="gallery-title"><div className="page-shell"><div className="section-topline"><span>03 / THE CAMPAIGN ARCHIVE</span><span>TEEN FIESTA × ETC.</span></div><div className="section-heading" data-reveal><h2 className="editorial-title" id="gallery-title">In every <em>frame.</em></h2><p className="body-copy">The RED ROOM announcement, alongside imagery from earlier Teen Fiesta chapters. A collection of the sound, the colour, the feeling.</p></div><CampaignGallery /></div></section>

      <section className="aftermovie section-space" id="aftermovie" aria-labelledby="aftermovie-title"><div className="page-shell"><div className="section-topline"><span>04 / IN MOTION</span><span>ARCHIVE FILM / AUGUST 2026</span></div><h2 className="editorial-title" id="aftermovie-title" data-reveal>Aftermovie<span className="title-mark" aria-hidden="true">↗</span></h2><div className="aftermovie__layout"><div className="aftermovie__copy" data-reveal><p className="large-copy">Feel it.<br /><em>Play it back.</em></p><p className="body-copy">Revisit an earlier Teen Fiesta chapter in the original campaign film. Sound on, lights low.</p><span className="utility">PREVIOUS CHAPTER / 07.08.2026</span></div><figure className="film-frame" data-media-reveal><FilmPlayer /><figcaption><span>TEEN FIESTA × ETC. / CAMPAIGN FILM</span><span>SOUND ON ↗</span></figcaption></figure></div></div></section>

      <section className="event-panel section-space" id="event-details" aria-labelledby="event-title"><div className="page-shell"><div className="section-topline"><span>05 / MARK THE NIGHT</span><span>{redRoomEvent.dateShort} / {redRoomEvent.time}</span></div><div className="event-panel__layout"><div className="event-panel__copy" data-reveal><h2 className="editorial-title" id="event-title">Mansion<br /><em>Agra.</em></h2><p className="body-copy">One city. One night. Teen Fiesta and etc. return with RED ROOM.</p><a className="text-link" href="/pricing">DASH PASS INFORMATION <span aria-hidden="true">↗</span></a></div><div className="event-panel__details" data-reveal><div><span>WHEN</span><strong>{redRoomEvent.date}</strong></div><div><span>TIME</span><strong>{redRoomEvent.time}</strong></div><div><span>WHERE</span><strong>{redRoomEvent.venue}, {redRoomEvent.city}</strong></div><div><span>SOUND</span><strong>{redRoomEvent.artist}</strong></div><p>Venue address and directions have not been supplied. Confirm the location with the event team before travelling.</p></div><figure className="event-panel__art" data-media-reveal><Image src="/media/red-room-poster.jpg" width={1120} height={1408} alt="Original RED ROOM campaign artwork with the verified event details." sizes="(max-width: 600px) 60vw, 22vw"/><figcaption>THE ORIGINAL ANNOUNCEMENT</figcaption></figure></div></div></section>

      <section className="dash-section section-space" id="dash-pass" aria-labelledby="dash-title"><div className="page-shell"><div className="section-topline"><span>06 / YOUR WAY IN</span><span>DASH / RED ROOM</span></div><div className="dash-section__layout"><div className="dash-section__art" data-reveal><DashTicket /></div><div className="dash-section__copy" data-reveal><p className="eyebrow"><span className="eyebrow__dot"/> TEEN FIESTA / 31.10</p><h2 className="display" id="dash-title">GET YOUR<br /><em>DASH PASS.</em></h2><p className="body-copy">DASH is the announced pass for RED ROOM. Price, inclusions and booking details have not been confirmed.</p><a className="button button--red" href="/pricing">EXPLORE DASH <span aria-hidden="true">↗</span></a><span className="dash-section__note">PASS INFORMATION / NO BOOKING LINK YET</span></div></div></div></section>
    </main>
    <SiteFooter />
  </>;
}
