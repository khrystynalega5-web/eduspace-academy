
import { NavLink } from "react-router";

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <NavLink to="/" className="logo">
                    EduSpace
                </NavLink>

                <nav className="navigation">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Каталог курсів
                    </NavLink>

                    <NavLink
                        to="/create"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Додати курс
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            isActive ? "nav-link active" : "nav-link"
                        }
                    >
                        Про нас
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Header;
