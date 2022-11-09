import Footer from "../Footer";
import Meta from "../Meta";
import PreviewBanner from "../PreviewBanner";

const Layout = ({ preview, children }) => {
  return (
    <>
      <Meta />
      <div className="min-h-screen">
        {preview && <PreviewBanner />}
        <main>{children}</main>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
