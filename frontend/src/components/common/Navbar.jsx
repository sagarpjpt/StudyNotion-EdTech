import React, { useEffect, useState } from "react";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apis";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = () => {
  const location = useLocation();

  const { user } = useSelector((state) => state.profile);
  console.log(user);
  const { totalItems } = useSelector((state) => state.cart);

  const [subLinks, setSubLinks] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);

        if (res && res.data) {
          // adapt to API shape
          setSubLinks(res.data.categories || res.data || []);
        }
      } catch (e) {
        console.error("Could not fetch the category list", e);
        setSubLinks([]); // fallback
      }
    };

    fetchCategories();
  }, []);

  // helper to close mobile on navigation
  const handleNavigate = () => {
    setMobileOpen(false);
    setMobileCatalogOpen(false);
  };

  return (
    <header className="bg-transparent">
      <div className="flex h-14 items-center border-b-2 border-b-richblack-700">
        <div className="flex w-11/12 lg:w-10/12 max-w-maxContent mx-auto items-center justify-between">
          {/* logo */}
          <Link to={"/"} onClick={handleNavigate} className="flex items-center">
            <img
              src={logo}
              alt="App Logo"
              width={160}
              height={42}
              loading="lazy"
            />
          </Link>

          {/* Desktop nav - hidden on small screens */}
          <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25 items-center">
              {NavbarLinks.map((link, index) => (
                <li key={index} className="relative">
                  {link.title === "Catalog" ? (
                    <div className="group relative">
                      <button
                        type="button"
                        className={`flex items-center gap-2 text-sm font-medium px-1 py-1 rounded-md transition-colors duration-200
                ${
                  location.pathname === link.path
                    ? "text-yellow-25"
                    : "text-richblack-25 hover:text-yellow-25"
                }`}
                        aria-haspopup="menu"
                        aria-expanded="false"
                      >
                        <span>{link.title}</span>
                        <IoIosArrowDropdownCircle className="text-xl transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
                      </button>

                      {/* Dropdown panel (visible on hover or keyboard focus) */}
                      <div
                        className="invisible opacity-0 translate-y-2 
                        group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                        group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0
                        pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto
                        absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 w-[320px]
                        bg-richblack-700 border border-richblack-700 rounded-lg shadow-[0_10px_30px_rgba(2,6,23,0.6)]
                        transition-all duration-250 ease-[cubic-bezier(.2,.9,.2,1)]"
                        role="menu"
                      >
                        {/* Triangle pointer (always visible, never clipped) */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 -top-2 
                          w-4 h-4 rotate-45 
                          bg-richblack-700 border-t border-l border-richblack-700"
                        />

                        {/* Scrollable content wrapper */}
                        <div className="max-h-[350px] overflow-auto p-3 rounded-lg">
                          {subLinks.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {subLinks.map((el, idx) => (
                                <Link
                                  key={idx}
                                  to={`/catalog/${encodeURIComponent(el.name)}`}
                                  onClick={handleNavigate}
                                  className="block rounded-md py-3 px-4 
                       text-richblack-5 hover:bg-richblack-800 hover:text-yellow-25 
                       transition-colors duration-150"
                                  role="menuitem"
                                >
                                  <span className="text-sm font-semibold">
                                    {el.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="text-richblack-400 p-4 text-center text-sm">
                              No Categories Found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link to={link.path} onClick={handleNavigate}>
                      <span
                        className={`flex justify-center items-center group relative transition-all duration-200 px-1 py-1
                ${
                  location.pathname === link.path
                    ? "text-yellow-25"
                    : "text-richblack-25 hover:text-yellow-25"
                }`}
                      >
                        {link.title}
                        <span className="absolute hidden group-hover:block h-[2px] w-full bottom-[-6px] bg-yellow-50 transition-all duration-200" />
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right-side actions - hidden on very small screens? keep them visible on md */}
          <div className="hidden md:flex gap-x-4 items-center">
            {user && user?.role !== "Instructor" && (
              <Link
                to="/dashboard/cart"
                className="relative"
                onClick={handleNavigate}
              >
                <AiOutlineShoppingCart className="text-white text-2xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 text-yellow-50 text-xs bg-richblack-700 px-2 py-0.5 rounded-full font-semibold">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {!user ? (
              <>
                <Link to="/login" onClick={handleNavigate}>
                  <button className="px-5 py-2 bg-richblack-800 border border-richblack-700 rounded-md text-sm font-semibold text-richblack-5 hover:bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer">
                    Log In
                  </button>
                </Link>
                <Link to="/signup" onClick={handleNavigate}>
                  <button className="px-5 py-2 bg-yellow-50 rounded-md text-sm font-semibold text-richblack-900 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-200 transition cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </>
            ) : (
              <ProfileDropDown />
            )}
          </div>

          {/* Mobile hamburger */}
          {/* <div className="md:hidden flex items-center">
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((p) => !p)}
              className="p-2 text-white"
            >
              {mobileOpen ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>
          </div> */}

          {/* Mobile actions: profile icon (left) + hamburger (right) */}
          <div className="md:hidden flex items-center gap-1">
            {/* show profile icon left of hamburger only on mobile and only if user exists */}
            {user ? (
              // pass align="left" so dropdown opens to left on mobile
              <div className="flex items-center">
                <ProfileDropDown dropdownAlign="left" />
              </div>
            ) : null}

            {/* Hamburger toggle */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((p) => !p)}
              className="p-2 text-white"
            >
              {mobileOpen ? (
                <HiOutlineX className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (slideover / dropdown) */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Background overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div className="relative bg-richblack-900 text-richblack-25 max-h-[100vh] overflow-auto  scrollbar-hide">
          <div className="w-11/12 mx-auto py-6">
            {/* header inside mobile menu */}
            <div className="flex items-center justify-between mb-6">
              <Link to="/" onClick={handleNavigate}>
                <img src={logo} alt="logo" width={130} height={36} />
              </Link>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="p-2"
              >
                <HiOutlineX className="text-2xl" />
              </button>
            </div>

            {/* nav links */}
            <nav>
              <ul className="flex flex-col gap-2">
                {NavbarLinks.map((link, idx) => (
                  <li key={idx} className="border-b border-richblack-700 pb-2">
                    {link.title === "Catalog" ? (
                      <div>
                        <button
                          onClick={() => setMobileCatalogOpen((p) => !p)}
                          className="w-full flex items-center justify-between py-3 px-2 text-left"
                          aria-expanded={mobileCatalogOpen}
                        >
                          <span className="text-lg font-medium">
                            {link.title}
                          </span>
                          <IoIosArrowDropdownCircle
                            className={`text-xl transition-transform duration-200 ${
                              mobileCatalogOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* mobile catalog contents (accordion) */}
                        <div
                          className={`overflow-hidden transition-max-h duration-300 ${
                            mobileCatalogOpen ? "max-h-[800px] mt-2" : "max-h-0"
                          }`}
                          aria-hidden={!mobileCatalogOpen}
                        >
                          {subLinks.length > 0 ? (
                            <div className="flex flex-col gap-2 px-2">
                              {subLinks.map((el, i) => (
                                <Link
                                  key={i}
                                  to={`/catalog/${encodeURIComponent(el.name)}`}
                                  onClick={handleNavigate}
                                  className="block rounded-md py-3 px-3 hover:bg-richblack-800 text-richblack-25"
                                >
                                  {el.name}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <div className="px-3 py-3 text-sm text-richblack-200">
                              No Categories Found
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={handleNavigate}
                        className="block w-full py-3 px-2 text-lg"
                      >
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* actions at bottom of mobile menu */}
            <div className="mt-6 flex flex-col gap-3">
              {user && user?.role !== "Instructor" && (
                <Link
                  to="/dashboard/cart"
                  className="flex items-center gap-2"
                  onClick={handleNavigate}
                >
                  <AiOutlineShoppingCart className="text-2xl" />
                  <span>Cart {totalItems > 0 ? `(${totalItems})` : ""}</span>
                </Link>
              )}

              {!user && (
                <div className="flex gap-2">
                  <Link to="/login" onClick={handleNavigate} className="flex-1">
                    <button className="w-full px-5 py-2 bg-richblack-800 border border-richblack-700 rounded-md text-sm font-semibold text-richblack-5 hover:bg-richblack-700 focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
                      Log In
                    </button>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={handleNavigate}
                    className="flex-1"
                  >
                    <button className="w-full px-5 py-2 bg-yellow-50 rounded-md text-sm font-semibold text-richblack-900 hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-blue-200 transition">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
