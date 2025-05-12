import styles from "./Footer.module.css"; // Import CSS modules for styling.

function Footer() { // Component function for the footer.
  return (
    <footer className={styles.footer}> {/* Footer element with styling. */}
      <div className={styles.footer__content}> {/* Container for footer content. */}
        <p>© {new Date().getFullYear()} MyBlog. All rights reserved.</p> {/* Copyright notice with current year. */}
        <ul className={styles.footer__links}> {/* Unordered list for footer links. */}
          <li> {/* List item for Privacy Policy link. */}
            <a href="/privacy-policy" className={styles.footer__link}>  {/* Anchor tag for Privacy Policy link. */}
              Privacy Policy  {/* Link text. */}
            </a>
          </li>
          <li> {/* List item for Terms of Service link. */}
            <a href="/terms" className={styles.footer__link}> {/* Anchor tag for Terms of Service link. */}
              Terms of Service   {/* Link text. */}
            </a>
          </li>
          <li> {/* List item for Contact Us link. */}
            <a href="/contact" className={styles.footer__link}>  {/* Anchor tag for Contact Us link. */}
              Contact Us  {/* Link text. */}
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer; // Export the Footer component as the default export.
