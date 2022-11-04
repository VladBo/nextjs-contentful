import Link from "next/link";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import styles from "./Banner.module.css";
import ResponsiveImage from "../@shared/ResponsiveImage";

const Banner = (props) => {
  const { content, image, cta, modification } = props;
  return (
    <section>
      <div className="md:flex mb-20 md:mb-28">
        <div className="w-1/2 flex flex-col ">
          <ResponsiveImage image={image} />
        </div>
        <div className="w-1/2 flex flex-col max-w-2xl mx-auto px-4 bg-teal-900">
          <div className="flex h-full justify-center items-center">
            <div className="text-center">
              <div className={styles["markdown"]}>
                {documentToReactComponents(content.json)}
              </div>
              <div className="mx-auto my-8 px-4 text-center">
                <Link href={cta.url}>
                  <a className="mx-3 bg-teal-300 hover:bg-teal-600 text-white py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0 rounded">
                    {cta.label}
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
