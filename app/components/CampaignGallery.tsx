"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { campaign } from "../data/campaign";
import { useOverlayLock } from "./SmoothScroll";
export default function CampaignGallery() {
    const [current, setCurrent] = useState(0);
    const [open, setOpen] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);
    const opener = useRef<HTMLButtonElement>(null);
    useOverlayLock(open);
    const next = (direction: number) => setCurrent(index => (index + direction + campaign.length) % campaign.length);
    const item = campaign[current];
    const previous = campaign[(current + campaign.length - 1) % campaign.length];
    const following = campaign[(current + 1) % campaign.length];
    useEffect(() => {
        if (open && !dialog.current?.open)
            dialog.current?.showModal();
        if (!open && dialog.current?.open)
            dialog.current?.close();
    }, [open]);
    const image = (index: number) => <Image src={campaign[index].src} alt={campaign[index].alt} width={campaign[index].width} height={campaign[index].height} sizes="(max-width: 600px) 78vw, 35vw"/>;
    return <>
    <div className="gallery-toolbar"><span className="gallery-count" aria-live="polite">{String(current + 1).padStart(2, "0")} / {String(campaign.length).padStart(2, "0")}</span><div><button type="button" className="arrow-control" aria-label="Previous campaign image" onClick={() => next(-1)}>←</button><button type="button" className="arrow-control" aria-label="Next campaign image" onClick={() => next(1)}>→</button></div></div>
    <div className="gallery-stage" key={current}>
      <button className="gallery-side gallery-side--previous" type="button" aria-label={`View ${previous.title}`} onClick={() => next(-1)}>{image((current + campaign.length - 1) % campaign.length)}</button>
      <figure className="gallery-feature"><button ref={opener} type="button" className="gallery-open" aria-label={`Enlarge ${item.title}`} onClick={() => setOpen(true)}>{image(current)}<span aria-hidden="true">VIEW ↗</span></button><figcaption><span>{item.title}</span><span>{item.note}</span></figcaption></figure>
      <button className="gallery-side gallery-side--next" type="button" aria-label={`View ${following.title}`} onClick={() => next(1)}>{image((current + 1) % campaign.length)}</button>
    </div>
    <div className="gallery-thumbnails" aria-label="Select campaign image" data-lenis-prevent>{campaign.map((entry, index) => <button key={entry.src} type="button" className={current === index ? "is-current" : ""} aria-label={`View image ${index + 1}: ${entry.title}`} aria-pressed={current === index} onClick={() => setCurrent(index)}><Image src={entry.src} width={entry.width} height={entry.height} alt="" sizes="70px" loading="lazy"/><span>{String(index + 1).padStart(2, "0")}</span></button>)}</div>
    <dialog ref={dialog} className="gallery-dialog" aria-label="Campaign image viewer" onClose={() => { setOpen(false); opener.current?.focus({ preventScroll: true }); }} onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget)
        setOpen(false); }} onKeyDown={event => { if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        next(event.key === "ArrowLeft" ? -1 : 1);
    } }} data-lenis-prevent>
      <button className="close-control" autoFocus type="button" aria-label="Close image viewer" onClick={() => setOpen(false)}>CLOSE <span aria-hidden="true">×</span></button>
      <button type="button" className="arrow-control gallery-dialog__previous" aria-label="Previous image in viewer" onClick={() => next(-1)}>←</button>
      <figure><Image src={item.src} width={item.width} height={item.height} alt={item.alt} sizes="(max-width: 600px) 85vw, 65vw"/><figcaption aria-live="polite">{item.title} <span>{item.note} / {current + 1} OF {campaign.length}</span></figcaption></figure>
      <button type="button" className="arrow-control gallery-dialog__next" aria-label="Next image in viewer" onClick={() => next(1)}>→</button>
    </dialog>
  </>;
}
