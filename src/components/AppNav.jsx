import { Link } from "react-router-dom";

import styles from "./AppNav.module.css";
function AppNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <Link>Cities</Link>
        </li>
        <li>
          <Link>Countries</Link>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
