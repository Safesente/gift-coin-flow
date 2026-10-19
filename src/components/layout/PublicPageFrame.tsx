import { Outlet, useLocation } from "react-router-dom";

/** Presentation boundary: public/account pages never theme the homepage or admin. */
export default function PublicPageFrame() {
  const { pathname } = useLocation();
  const page = pathname.split("/")[1] || "page";
  return <div className={`public-pages page-${page}`}><Outlet /></div>;
}