"use client";
import { useEffect, useRef, useState } from "react";
export default function FilmPlayer() {
    const video = useRef<HTMLVideoElement>(null);
    const [started, setStarted] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [bufferedPercent, setBufferedPercent] = useState(0);
    const [format, setFormat] = useState<"mp4" | "webm" | "original">("mp4");
    const mediaFailure = () => {
        const nextFormat = format === "mp4" ? "webm" : format === "webm" ? "original" : null;
        if (nextFormat) {
            setFormat(nextFormat);
            setError(false);
        }
        else setError(true);
        setStarted(false);
        setLoading(false);
    };
    useEffect(() => {
        const element = video.current;
        if (!element)
            return;
        const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting)
            element.pause(); }, { threshold: 0.1 });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    const play = async () => {
        setError(false);
        setStarted(true);
        setLoading(true);
        setBufferedPercent(0);
        try {
            await video.current?.play();
        }
        catch (failure) {
            if (failure instanceof DOMException && failure.name === "AbortError") {
                setLoading(false);
                return;
            }
            mediaFailure();
        }
    };
    const retry = () => {
        setFormat("mp4");
        setError(false);
        setStarted(false);
        setLoading(false);
    };
    const source = format === "original" ? "/media/teen-fiesta-film.mp4" : `/media/campaign-film-wide.${format}`;
    const updateBuffer = () => {
        const media = video.current;
        if (!media || !Number.isFinite(media.duration) || media.duration <= 0 || media.buffered.length === 0) return;
        const end = media.buffered.end(media.buffered.length - 1);
        setBufferedPercent(Math.min(100, Math.round((end / media.duration) * 100)));
    };
    return <div className="film-player" data-started={started}>
    <video ref={video} src={source} controls={started} playsInline preload="none" poster="/media/film-poster.jpg" aria-label="Teen Fiesta campaign film from the August 2026 chapter" onWaiting={() => setLoading(true)} onProgress={updateBuffer} onLoadedMetadata={updateBuffer} onCanPlay={() => { updateBuffer(); setLoading(false); }} onError={mediaFailure}>Your browser does not support this video.</video>
    {!started && !error ? <button type="button" className="film-play" aria-label="Play Teen Fiesta campaign film" onClick={play}><svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true"><path d="M2 2 18 12 2 22Z" fill="currentColor"/></svg><span>PLAY FILM</span></button> : null}
    {loading ? <div className="film-status" role="status" aria-live="polite"><div className="film-status__head"><span>LOADING FILM</span>{bufferedPercent > 0 ? <span>{bufferedPercent}%</span> : <span>BUFFERING</span>}</div><div className="film-status__track" role="progressbar" aria-label="Film download progress" aria-valuemin={0} aria-valuemax={100} {...(bufferedPercent > 0 ? { "aria-valuenow": bufferedPercent } : {})}><span style={bufferedPercent > 0 ? { width: `${bufferedPercent}%` } : undefined} /><i aria-hidden="true" /></div></div> : null}
    {error ? <div className="film-error" role="alert"><p>The film couldn’t load.</p><button type="button" className="text-link film-retry" onClick={retry}>RETRY PLAYBACK</button><a href="/media/teen-fiesta-film.mp4" className="text-link">OPEN THE ORIGINAL FILM ↗</a></div> : null}
  </div>;
}
