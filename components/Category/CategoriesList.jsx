import Link from "next/link";

const CategoriesList = ({ title, categories }) => {
  return (
    <section>
      <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32">
        {categories &&
          categories.map((category) => (
            <div key={category.slug}>
              <h3 className="text-3xl mb-3 leading-snug">
                <Link href={`/category/${category.slug}`}>
                  <a className="hover:underline">{category.title}</a>
                </Link>
              </h3>
            </div>
          ))}
      </div>
    </section>
  );
};

export default CategoriesList;
