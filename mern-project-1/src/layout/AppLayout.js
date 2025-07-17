import Footer from "./Footer";
import Header from "./Header";

function AppLayout({ children }) {
  return (
    <div style={{ paddingBottom: '60px' }}> {/* Add padding equal to footer height */}
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default AppLayout;