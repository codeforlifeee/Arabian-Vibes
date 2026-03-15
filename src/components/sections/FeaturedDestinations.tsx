import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const dubaiCity = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80";
const abuDhabiCity = "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80";
const jeddahCity = "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80";
const singaporeCity = "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80";

const destinations = [
  { id: 1, name: "Dubai", image: dubaiCity, description: "Experience luxury and adventure", location: "Dubai" },
  { id: 2, name: "Abu Dhabi", image: abuDhabiCity, description: "Capital of culture and heritage", location: "Abu Dhabi" },
  { id: 3, name: "Jeddah", image: jeddahCity, description: "Gateway to the holy cities", location: "Jeddah" },
  { id: 4, name: "Singapore", image: singaporeCity, description: "Garden city of Asia", location: "Singapore" },
];

interface FeaturedDestinationsProps {
  onCountrySelect?: (country: string) => void;
}

const FeaturedDestinations = ({ onCountrySelect }: FeaturedDestinationsProps) => {
  const navigate = useNavigate();
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-blue-50/30 via-white to-blue-50/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-10 gap-4">
          <div className="text-center sm:text-left px-2">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-2 sm:mb-3">
              Best Cities to <span className="text-primary">Visit</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed font-medium">
              Experience the thrill of discovering off-the-beaten-path gems and
              famous landmarks in top destinations worldwide — your wanderlust awaits!
            </p>
          </div>
          <div className="hidden sm:flex gap-2 sm:gap-3">
            <Button variant="outline" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md">
              <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-md">
              <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-0">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer animate-scale-in transform hover:scale-105 border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => {
                const urlName = destination.location.toLowerCase().replace(/\s+/g, '-');
                navigate(`/destination/${urlName}`);
              }}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white">
                  <h3 className="text-sm sm:text-lg md:text-2xl font-extrabold mb-1 sm:mb-2 drop-shadow-2xl">
                    {destination.name}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-white/95 drop-shadow-lg font-medium">
                    {destination.description}
                  </p>
                </div>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/25 backdrop-blur-md px-2 py-1 sm:px-4 sm:py-2 rounded-full text-white text-xs sm:text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-lg">
                  Explore →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;
