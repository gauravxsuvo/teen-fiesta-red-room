import Image from "next/image";
import { MotionToggle } from "./MotionSettings";
import { redRoomEvent } from "../data/red-room";
export default function SiteFooter() {
    return (<footer className="site-footer">
      <div className="page-shell">
        <div className="footer-top"><a className="wordmark" href="/#top" aria-label="Teen Fiesta home"><Image src="/media/teen-fiesta-monogram.png" width={46} height={46} alt=""/><span className="wordmark__type">TEEN<br />FIESTA</span></a><p>{redRoomEvent.venue}, {redRoomEvent.city}<br />{redRoomEvent.dateShort} · {redRoomEvent.time}</p><a className="text-link" href="/pricing">DASH PASS INFO <span aria-hidden="true">↗</span></a></div>
        <p className="footer-title">See you <em>in red.</em></p>
        <div className="footer-bottom"><span>TEEN FIESTA × ETC. / 2026</span><nav aria-label="Footer navigation"><a href="/#experience">Experience</a><a href="/#gallery">Gallery</a><a href="/#aftermovie">Film</a><a href="/#top">Back to top ↑</a></nav><MotionToggle /></div>
      </div>
    </footer>);
}
