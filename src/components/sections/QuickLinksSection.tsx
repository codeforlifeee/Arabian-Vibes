import { Link } from "react-router-dom";
import { 
  Palmtree, 
  Ship, 
  Building2, 
  Landmark, 
  Ticket, 
  MapPin,
  UtensilsCrossed,
  Camera,
  Compass
} from "lucide-react";

const quickLinks = [
  {
    title: "Best Selling UAE Tours",
    links: [
      { name: "Dubai City Tour", href: "/activities/dubai", icon: <Building2 className="w-4 h-4" /> },
      { name: "Abu Dhabi City Tour", href: "/activities/abu-dhabi", icon: <Landmark className="w-4 h-4" /> },
      { name: "Desert Safari Dubai", href: "/activities/dubai", icon: <Compass className="w-4 h-4" /> },
      { name: "Burj Khalifa Tickets", href: "/activities/dubai", icon: <Building2 className="w-4 h-4" /> },
      { name: "Dubai Marina Dhow Cruise", href: "/activities/dubai", icon: <Ship className="w-4 h-4" /> },
    ]
  },
  {
    title: "Trending Destinations",
    links: [
      { name: "Dubai Tours", href: "/activities/dubai", icon: <MapPin className="w-4 h-4" /> },
      { name: "Abu Dhabi Tours", href: "/activities/abu-dhabi", icon: <MapPin className="w-4 h-4" /> },
      { name: "Ras Al Khaimah Tours", href: "/activities/ras-al-khaimah", icon: <MapPin className="w-4 h-4" /> },
      { name: "Oman Tours", href: "/activities/oman", icon: <MapPin className="w-4 h-4" /> },
    ]
  },
  {
    title: "Things to do in UAE",
    links: [
      { name: "Dubai Theme Parks", href: "/activities/dubai", icon: <Ticket className="w-4 h-4" /> },
      { name: "Water Activities", href: "/activities/dubai", icon: <Ship className="w-4 h-4" /> },
      { name: "Cultural Experiences", href: "/activities/abu-dhabi", icon: <Camera className="w-4 h-4" /> },
      { name: "Adventure Tours", href: "/activities/dubai", icon: <Compass className="w-4 h-4" /> },
      { name: "Food Tours", href: "/activities/dubai", icon: <UtensilsCrossed className="w-4 h-4" /> },
    ]
  },
  {
    title: "Popular Services",
    links: [
      { name: "Hotel Booking", href: "/hotels", icon: <Building2 className="w-4 h-4" /> },
      { name: "Holiday Packages", href: "/holidays", icon: <Palmtree className="w-4 h-4" /> },
      { name: "Visa Services", href: "/visas", icon: <Ticket className="w-4 h-4" /> },
      { name: "Cruise Packages", href: "/cruise", icon: <Ship className="w-4 h-4" /> },
    ]
  }
];

const QuickLinksSection = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-blue-50/30 to-white"> 
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Explore More On <span className="text-primary">Arabian Vibes</span>
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Discover our wide range of services and popular destinations
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {quickLinks.map((section, index) => (
            <div 
              key={index} 
              className="bg-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-primary/30 transform hover:-translate-y-2"
            >
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-5 pb-4 border-b-3 border-primary/30">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="flex items-center gap-3 text-sm sm:text-base text-gray-700 hover:text-primary hover:translate-x-2 transition-all duration-200 group font-medium"
                    >
                      <span className="text-primary/70 group-hover:text-primary transition-colors group-hover:scale-125 transform">
                        {link.icon}
                      </span>
                      <span className="group-hover:underline group-hover:font-semibold">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickLinksSection;