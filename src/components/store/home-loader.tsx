/**
 * First-visit loader: CHNW's own photos flicker through a window in the wordmark while a counter
 * follows real loading of the hero films. The engine plays the exit (a thread-red wipe).
 * Rendered by the home page only; hidden on repeat visits in the same session.
 */
export default function HomeLoader({ photos }: { photos: string[] }) {
  const frames = photos.slice(0, 8);
  return (
    <div id="loader" role="status" aria-label="Loading CHNW">
      <div className="loader__stage">
        <span className="loader__mask">
          <span className="loader__word" data-loader-out>CH</span>
        </span>
        <span className="loader__window" aria-hidden="true">
          {frames.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" style={{ animationDelay: `${-((frames.length - i) % frames.length) * 0.2}s` }} />
          ))}
        </span>
        <span className="loader__mask">
          <span className="loader__word loader__word--late" data-loader-out>NW</span>
        </span>
        <span className="loader__count" data-loader-count aria-hidden="true">000</span>
      </div>
      <span className="loader__meta" style={{ left: 20 }}>CHNW, made to order</span>
      <span className="loader__meta" style={{ right: 20 }}>Opening the workroom</span>
    </div>
  );
}
