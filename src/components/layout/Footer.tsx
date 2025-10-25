"use client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { data: siteSettings, isLoading: settingsLoading, error: settingsError } = useSiteSettings();

  // Loading state for site settings
  if (settingsLoading) {
    return (
      <footer className="bg-primary text-primary-foreground text-sm">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <span>Loading site settings...</span>
          </div>
        </div>
      </footer>
    );
  }

  // Error state for site settings
  if (settingsError) {
    return (
      <footer className="bg-primary text-primary-foreground text-sm">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-destructive font-bold mb-2">Unable to load site settings from backend.</span>
            <span className="text-primary-foreground/80">{settingsError}</span>
            <span className="text-primary-foreground/60 mt-4">Please check your backend configuration.</span>
          </div>
        </div>
      </footer>
    );
  }

  // Only show footer if we have site settings data
  if (!siteSettings || Object.keys(siteSettings).length === 0) {
    return (
      <footer className="bg-primary text-primary-foreground text-sm">
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <span className="text-primary-foreground/80">No site settings available from backend.</span>
          </div>
        </div>
      </footer>
    );
  }

  // Success: show backend site settings
  return (
    <footer className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground text-sm">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-6">
              <img
                src="src/assets/whitelogo.png"
                alt="Arabian Vibes Logo"
                className="h-16 w-auto mr-3"
              />
            </div>
            <h3 className="text-xl font-bold mb-4">
              {siteSettings.siteName || 'Arabian Vibes'}
            </h3>
            <div className="space-y-3 leading-relaxed">
              {siteSettings.dubaiContactNumber && (
                <p className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-lg">📞</span> 
                  <a href={`tel:${siteSettings.dubaiContactNumber}`}>Dubai: {siteSettings.dubaiContactNumber}</a>
                </p>
              )}
              {siteSettings.indiaContactNumber && (
                <p className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-lg">📞</span> 
                  <a href={`tel:${siteSettings.indiaContactNumber}`}>India: {siteSettings.indiaContactNumber}</a>
                </p>
              )}
              {siteSettings.whatsappNumber && (
                <p className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-lg">📱</span> 
                  <a href={`https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp: {siteSettings.whatsappNumber}
                  </a>
                </p>
              )}
              {siteSettings.email && (
                <p className="flex items-center gap-2 hover:text-white transition-colors">
                  <span className="text-lg">✉️</span> 
                  <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a>
                </p>
              )}
              {siteSettings.address && (
                <p className="flex items-start gap-2 text-primary-foreground/80">
                  <span className="text-lg">🏢</span> 
                  <span className="flex-1">{siteSettings.address}</span>
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about-us"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/activities"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Activities
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/holidays"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Holidays
                </Link>
              </li>
            </ul>
          </div>

          {/* Trending Destinations */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">Trending Destinations</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/activities/dubai"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Dubai Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/activities/abu-dhabi"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Abu Dhabi Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/activities/ras-al-khaimah"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Ras Al Khaimah Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/activities/oman"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Oman Tours
                </Link>
              </li>
              <li>
                <Link
                  to="/visas"
                  className="hover:text-white hover:underline transition-all inline-block hover:translate-x-1"
                >
                  Visa Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-lg mb-5 text-white">Follow Us</h4>
            <div className="flex flex-wrap gap-3 mb-5">
              {siteSettings.facebookUrl && (
                <a
                  href={siteSettings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="transform hover:scale-110 transition-transform"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/30 hover:bg-white hover:text-primary transition-all"
                  >
                    <Facebook className="h-5 w-5" />
                  </Button>
                </a>
              )}
              {siteSettings.instagramUrl && (
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="transform hover:scale-110 transition-transform"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/30 hover:bg-white hover:text-primary transition-all"
                  >
                    <Instagram className="h-5 w-5" />
                  </Button>
                </a>
              )}
              {siteSettings.youtubeUrl && (
                <a
                  href={siteSettings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="transform hover:scale-110 transition-transform"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/30 hover:bg-white hover:text-primary transition-all"
                  >
                    <Youtube className="h-5 w-5" />
                  </Button>
                </a>
              )}
              {siteSettings.linkedinUrl && (
                <a
                  href={siteSettings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="transform hover:scale-110 transition-transform"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-white/10 border-white/30 hover:bg-white hover:text-primary transition-all"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </a>
              )}
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Stay connected for the latest travel updates and exclusive offers.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/20 bg-primary/80">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs sm:text-sm">
            <p className="text-primary-foreground/90">
              © 2025 {siteSettings.siteName || 'Arabian Vibes LLC'}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/privacy-policy" className="hover:text-white hover:underline">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-white hover:underline">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
