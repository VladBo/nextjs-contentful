import Avatar from "../Avatar";
import CoverImage from "../CoverImage";
import DateComponent from "../@shared/Date";
import PageTitle from "../@shared/PageTitle";
import LanguageSwitcher from "../LanguageSwitcher";

const PostHeader = ({ title, coverImage, date, author }) => {
  return (
    <>
      <div className="text-right">
        <LanguageSwitcher />
      </div>
      <PageTitle>{title}</PageTitle>
      <div className="hidden md:block md:mb-12">
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} url={coverImage.url} />
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
          {author && <Avatar name={author.name} picture={author.picture} />}
        </div>
        <div className="mb-6 text-lg">
          <DateComponent dateString={date} />
        </div>
      </div>
    </>
  );
};

export default PostHeader;
