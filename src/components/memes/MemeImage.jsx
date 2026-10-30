import { useState } from "react";
import PropTypes from "prop-types";
import { memes } from "../../data/memeCatalog";

export default function MemeImage({ id, className = "", caption = true }) {
  const [broken, setBroken] = useState(false);
  const asset = memes[id];
  if (!asset) return null;
  return (
    <figure className={`context-meme ${className}`}>
      <div
        className="meme-image-frame"
        style={{ aspectRatio: asset.aspectRatio }}
      >
        {broken ? (
          <span className="meme-missing">
            TRANSMISSION LOST
            <br />
            <small>{asset.caption}</small>
          </span>
        ) : (
          <img
            src={asset.file}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
          />
        )}
      </div>
      {caption && <figcaption>{asset.caption}</figcaption>}
    </figure>
  );
}
MemeImage.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  caption: PropTypes.bool,
};
