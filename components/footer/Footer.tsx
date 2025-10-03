import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

export default function FooterComponent() {
  return (
    <footer className="bg-gradient-to-r from-emerald-500 from-10% to-emerald-900 to-90% text-white py-10">
      <div className="px-10 w-full grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-4 lg:gap-10">
        <div className="text-center flex justify-center">
          <Link to="/">
            <div className="text-2xl font-bold font-montserrat pl-7">
              <img
                src={logo}
                width={70}
                height={70}
                className="invert brightness-0 mb-4"
              />
            </div>
            <div className="text-xs md:text-md text-white font-lato mt-1 font-bold">
              "It Starts at Home."
            </div>
          </Link>
        </div>
        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold">Family Nation</h2>
          <p className="mt-3 text-sm leading-relaxed">
            FamilyNation maintains that with improved and sustained balance and
            stability in our homes comes the likelihood for a greater quality of
            life in our schools, communities, workplaces and all aspects
            spanning the human condition and experience. This is why we’re doing
            what we’re about to announce. For families. For counselors and
            therapists. For health care professionals. For small & medium
            businesses and for large enterprises alike. Stay tuned for more
            details but feel free to reach out if you have any questions or
            require preliminary information by emailing us at
            info@familynation.com.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="#"
                className="text-white hover:text-black hover:font-bold hover:underline"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-white hover:text-black hover:font-bold hover:underline"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-white hover:text-black hover:font-bold hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-white hover:text-black hover:font-bold hover:underline"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={18} />
              <span>San Francisco, CA</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} />
              <span>Phone: (925) 984-3173</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} />
              <span>www.info@familynation.com</span>
            </li>
          </ul>
          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <Link to="#" aria-label="Facebook" className="hover:text-gray-900">
              <Facebook size={20} />
            </Link>
            <Link to="#" aria-label="Twitter" className="hover:text-gray-900">
              <Twitter size={20} />
            </Link>
            <Link to="#" aria-label="Instagram" className="hover:text-gray-900">
              <Instagram size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/20 mt-10 pt-4 text-center text-sm">
        © {new Date().getFullYear()} Family Nation. All rights reserved.
      </div>
    </footer>
  );
}
