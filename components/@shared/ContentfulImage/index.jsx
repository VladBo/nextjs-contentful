import Image from "next/image";

const contentfulLoader = ({ src, width, quality, radius }) => {
  return `${src}?w=${width}&q=${quality || 75}&r=${radius || 0}`;
};

const ContentfulImage = (props) => {
  return <Image loader={contentfulLoader} {...props} />;
};

export default ContentfulImage;
