// src/components/Layout
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import styles from "./Layout.module.css";

function Layout() {
  const location = useLocation();

  // Array of paths where Navigation and Sidebar should not be shown
  const excludedPaths = ["/register", "/login"];

  // Check if the current path is in the excluded paths array
  const shouldHideExtras = excludedPaths.includes(location.pathname);

  return (
    <div className={styles.layout}>
      {/* Conditionally render Navigation if not on an excluded path */}
      {!shouldHideExtras && <Navigation />}

      <div className={styles.layout__content}>
        {/* Main content area */}
        <main className={styles.layout__main}>
          <Outlet />
        </main>

        {/* Conditionally render Sidebar if not on an excluded path */}
        {!shouldHideExtras && <Sidebar className={styles.layout__sidebar} />}
      </div>

      {/* Footer is always rendered */}
      <Footer />
    </div>
  );
}

export default Layout;
