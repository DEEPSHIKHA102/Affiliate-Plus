import App from "../App";
import Footer from "./Footer";
import Header from "./Header";

function AppLayout({ children }) {
    return (
        <>
            <Header />
            { children }
            <Footer />
        </>
    );
}

export default AppLayout;