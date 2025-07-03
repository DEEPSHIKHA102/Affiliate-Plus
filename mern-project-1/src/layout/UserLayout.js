import UserFooter from "./UserFooter";
import UserHeader from "./UserHeader";

function UserLayout({ children }) {
    return (
        <>
            <UserHeader />
            {children}
            <UserFooter />
        </>
    );
}

export default UserLayout;