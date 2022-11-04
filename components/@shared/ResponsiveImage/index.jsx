export default function ResponsiveImage({ image }) {
  // Note, this array could be further optimized looking at the resulting quality and file size
  const imageWidths = [640, 768, 1024, 1280];
  // const imageWidths = [{width: 1280, descriptor: 1}, {width: 1024, descriptor: 0.8}, {width: 768, descriptor: 0.6}, {width: 640, descriptor: 0.5}];

  const maxContainerSize = 736;

  // Note, this could be further optimized by considering padding inside the container
  const sizes = `(max-width: ${
    maxContainerSize - 1
  }px) 100vw, ${maxContainerSize}px`;

  const makeSrcSetArray = (format) => {
    const formatString = format === undefined ? "" : `&fm=${format}`;

    return imageWidths.map(
      (width) => `${image.url}?q=80&w=${width}${formatString} ${width}w`
    );
  };

  function makeSrcSetString(format) {
    return makeSrcSetArray(format).join(", ");
  }

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={makeSrcSetString("webp")}
        sizes={sizes}
      />
      <img
        srcSet={makeSrcSetString()}
        sizes={sizes}
        src={image.url}
        alt={image.description}
        loading="lazy"
        decoding="async"
        width={image.width}
        height={image.height}
      />
    </picture>
  );
}
