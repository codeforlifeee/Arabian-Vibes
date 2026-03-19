import { useParams, useNavigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PopularExperiences = lazy(() => import("@/pages/PopularExp"));

const Destination = () => {
  const { destinationName } = useParams<{ destinationName: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Update document title based on destination
    if (destinationName) {
      const formattedName = destinationName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      document.title = `${formattedName} - Arabian Vibes`;
    }
  }, [destinationName]);

  const getDestinationContent = () => {
    if (!destinationName) return null;

    const formattedName = destinationName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        {/* Hero Section */}
        <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="absolute inset-0 bg-black/30" />
          
          {/* Mobile Back Button */}
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-white/20 h-8 w-8 p-0 sm:h-10 sm:w-auto sm:px-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Back</span>
            </Button>
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">
                Explore {formattedName}
              </h1>
              <p className="text-sm sm:text-lg opacity-90">
                Discover amazing experiences in {formattedName}
              </p>
            </div>
          </div>
        </div>

        {/* Popular Experiences Section */}
        <Suspense fallback={
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        }>
          <PopularExperiences
            city={formattedName}
            title={`Most Popular Experiences in ${formattedName}`}
            description={`Culture, nature, thrills, and record-breaking experiences — ${formattedName} is the place to seek out everything you imagine and beyond.`}
          />
        </Suspense>
        
        <Footer />
      </div>
    );
  };

  return getDestinationContent();
};

export default Destination;