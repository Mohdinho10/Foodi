import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-base-200 text-base-content">
      <footer className="footer flex flex-wrap justify-between gap-10 px-4 py-10 xl:px-24">
        <aside>
          <img src="/logo.png" alt="Logo" className="mb-3 w-32" />
          <p className="max-w-xs">
            Savor the artistry where every dish is a culinary masterpiece.
          </p>
        </aside>

        <nav>
          <header className="footer-title text-black">Useful Links</header>
          <a className="link link-hover">About Us</a>
          <a className="link link-hover">Events</a>
          <a className="link link-hover">Blogs</a>
          <a className="link link-hover">FAQ</a>
        </nav>

        <nav>
          <header className="footer-title text-black">Main Menu</header>
          <a className="link link-hover">Home</a>
          <a className="link link-hover">Offers</a>
          <a className="link link-hover">Menus</a>
          <a className="link link-hover">Reservation</a>
        </nav>

        <nav>
          <header className="footer-title text-black">Contact Us</header>
          <a className="link link-hover">example@email.com</a>
          <a className="link link-hover">+64 958 248 966</a>
          <a className="link link-hover">Social Media</a>
        </nav>
      </footer>

      <hr className="border-t border-gray-300" />

      <footer className="footer items-center justify-between px-4 py-4 xl:px-24">
        <aside className="text-sm">
          <p>Copyright © 2023 - All rights reserved</p>
        </aside>

        <nav className="flex gap-4">
          {/* Twitter */}
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-white transition hover:bg-sky-600"
          >
            <FaTwitter size={18} />
          </a>

          {/* YouTube */}
          <a
            href="#"
            className="hover:bg-red-700 flex h-9 w-9 items-center justify-center rounded-full bg-red text-white transition"
          >
            <FaYoutube size={18} />
          </a>

          {/* Facebook */}
          <a
            href="#"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
          >
            <FaFacebookF size={18} />
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
