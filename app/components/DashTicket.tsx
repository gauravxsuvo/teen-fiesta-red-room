import Image from "next/image";
import { redRoomEvent } from "../data/red-room";
export default function DashTicket() {
    return <div className="ticket-art" aria-label="DASH pass design preview, not an issued ticket">
    <div className="ticket-art__top"><span>TEEN FIESTA × ETC.</span><Image src="/media/teen-fiesta-monogram.png" alt="" width={36} height={36}/></div>
    <div className="ticket-art__title">TEEN FIESTA<em>RED ROOM</em></div>
    <div className="ticket-art__details"><span>{redRoomEvent.dateShort}</span><span>{redRoomEvent.time}</span><span>{redRoomEvent.venue.toUpperCase()}, AGRA</span></div>
    <div className="ticket-art__foot"><strong>DASH</strong><span>DESIGN PREVIEW<br />NOT AN ISSUED PASS</span></div>
  </div>;
}
