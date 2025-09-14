// src/components/Footer.jsx
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-5 border-t bg-white dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* النص */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {year} ReactStore. All rights reserved.
        </p>

        {/* روابط سريعة */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <a
            href="/about"
            className="hover:text-gray-900 dark:hover:text-gray-200">
            About
          </a>
          <a
            href="/contact"
            className="hover:text-gray-900 dark:hover:text-gray-200">
            Contact
          </a>
          <a
            href="/privacy"
            className="hover:text-gray-900 dark:hover:text-gray-200">
            Privacy
          </a>
        </div>

        {/* سوشال ميديا */}
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600">
            <FaFacebook size={18} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500">
            <FaTwitter size={18} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500">
            <FaInstagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
