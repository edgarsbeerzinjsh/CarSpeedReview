import { NavLink } from "react-router-dom";
import { NAV_PAGES } from "../components/constants/NavLinks";




export const NavPages = () => {
    return (
    <nav>
      <ul className="nav nav-tabs">
        {NAV_PAGES.map((page) => {
            return (
            <li key={page.path} className="nav-item">
                <NavLink className="nav-link" to={page.path}>{page.title}</NavLink>
            </li>
            )
        })}
      </ul>
    </nav>
  );
}