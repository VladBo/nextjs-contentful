import ContentfulImage from "../@shared/ContentfulImage";

const Avatar = ({ name, picture }) => {
  return (
    <div className="flex items-center">
      <div className="relative w-12 h-12 mr-4">
        {picture.url && (
          <ContentfulImage
            src={picture.url}
            layout="fill"
            className="rounded-full"
            alt={name}
          />
        )}
      </div>
      <div className="text-xl font-bold">{name}</div>
    </div>
  );
};

export default Avatar;
