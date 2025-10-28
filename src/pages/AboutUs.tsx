import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useSliders } from "@/hooks/useSliders";
import { useCards } from "@/hooks/useCards";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import { DynamicCards } from "@/components/DynamicCards";
import { Link } from "react-router-dom";
import {
  Plane,
  Hotel,
  Briefcase,
  Ship,
  ShieldCheck,
  Users,
  Globe,
  Clock,
  Quote,
  Handshake,
} from "lucide-react";
import Slider from "react-slick";
import { useState } from "react";
import InternalPageLayout from "./InternalPageLayout";

const AboutUs = () => {
  // Fetch slider data for about page 
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'about_us', limit: 5 }); 

  // Debug logging
  console.log('About Us Sliders Debug:', {
    isLoading: slidersLoading,
    error: slidersError,
    data: slidersResponse,
    slidesCount: slidersResponse?.slides?.length || 0
  });

  // Fetch cards data for about us page
  const { 
    data: cardsResponse, 
    isLoading: cardsLoading, 
    error: cardsError 
  } = useCards({ page: 'about_us', limit: 8 });

  // State for internal page
  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const testimonials = [
    {
      name: "Fatima A.",
      text: "Wonderful experience! The team made my Dubai trip seamless and special.",
    },
    {
      name: "James K.",
      text: "Very professional service.  The visa processing was fast and smooth.",
    },
    {
      name: "Priya R.",
      text: "Booked my family holiday with Arabian Vibes. Highly recommended!",
    },
    {
      name: "Ravi S.",
      text: "Amazing cruise experience. Great value and support throughout.",
    },
    {
      name: "Liam T.",
      text: "Superb customer support and well planned trip. 5 stars!",
    },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <>
      {showInternalPage ? (
        <InternalPageLayout
          title={selectedItem?.title || "About Us Details"}
          description="Learn more about our services and experiences."
          item={selectedItem}
          onClose={() => {
            setShowInternalPage(false);
            setSelectedItem(null);
          }}
        />
      ) : (
        <>
          <Header />

          <main className="w-full">
            {/* Dynamic Slider Section */}
            {slidersLoading && (
              <div className="h-96 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600">Loading sliders...</p>
              </div>
            )}
            
            {slidersError && (
              <div className="h-96 bg-red-50 flex items-center justify-center">
                <p className="text-red-600">Error loading sliders: {slidersError}</p>
              </div>
            )}
            
            {!slidersLoading && !slidersError && (!slidersResponse || !slidersResponse.slides || slidersResponse.slides.length === 0) && (
              <div className="h-96 bg-yellow-50 flex items-center justify-center">
                <p className="text-yellow-600">No sliders found for About Us page</p>
              </div>
            )}
            
            {!slidersLoading && !slidersError && slidersResponse?.slides && slidersResponse.slides.length > 0 && (
              <DynamicSlider 
                slides={slidersResponse.slides}
                height="400px"
                autoplay={true}
                autoplayDelay={4000}
                showDots={true}
                showArrows={true}
                className="mb-0"
              />
            )}

           
            {/* About */}
            <section className="container mx-auto px-4 py-16 text-center max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">About Arabian Vibes</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Arabian Vibes LLC is your trusted travel partner in the UAE. From tailor-made holiday
                experiences to smooth visa services, we deliver seamless journeys for tourists, families,
                and business travelers.
              </p>
            </section>

           
           {/* Services */}
<section 
  className="relative container mx-auto px-4 py-16 space-y-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 rounded-2xl" 
>
  <div className="relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
      Our <span className="text-secondary">Services</span>
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {[
    { 
      icon: <ShieldCheck className="w-10 h-10 text-primary" />, 
      title: "Visa Assistance", 
      desc: "Hassle-free visa processing.",
      link: "/visas" 
    },
    { 
      icon: <Plane className="w-10 h-10 text-secondary" />, 
      title: "Custom Holidays", 
      desc: "Personalized holiday packages.",
      link: "/holidays" 
    },
    { 
      icon: <Hotel className="w-10 h-10 text-primary" />, 
      title: "Hotel Booking", 
      desc: "Best hotel deals for every budget.",
      link: "/hotels" 
    },
    { 
      icon: <Ship className="w-10 h-10 text-secondary" />, 
      title: "Cruise Experiences", 
      desc: "Luxury cruises to top destinations.",
      link: "/cruise" 
    },
    { 
      icon: <Briefcase className="w-10 h-10 text-primary" />, 
      title: "Corporate Travel", 
      desc: "Reliable MICE solutions.",
      
    },
    { 
      icon: <Users className="w-10 h-10 text-secondary" />, 
      title: "Airport Transfers", 
      desc: "Premium private transfers.",
    
    },
  ].map((service, index) => (
    <Link to={service.link} key={index} className="block group">
      <Card className="hover:shadow-2xl transition-all duration-300 rounded-xl cursor-pointer border-2 border-transparent hover:border-primary/20 bg-white h-full">
        <CardContent className="p-8 space-y-4 flex flex-col items-center text-center">
          <div className="p-4 bg-accent/50 rounded-full group-hover:bg-primary/10 transition-colors duration-300">
            {service.icon}
          </div>
          <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition-colors">{service.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
        </CardContent>
      </Card>
    </Link>
  ))}
</div>
</div>
</section>

{/* Why Us */}
<section 
  className="relative py-16 px-4 bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/20 rounded-2xl" 
>
  <div className="container mx-auto space-y-8 relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
       <span className="text-primary">Why Choose </span><span className="text-secondary">Arabian Vibes?</span>
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { icon: <Globe className="w-10 h-10 text-primary" />, title: "Expert Team", desc: "Local expertise at its best." },
        { icon: <Handshake className="w-10 h-10 text-secondary" />, title: "Best Value", desc: "Great deals & transparency." },
        { icon: <Clock className="w-10 h-10 text-primary" />, title: "24/7 Support", desc: "Always here to help you." },
      ].map((reason, index) => (
        <Card key={index} className="hover:shadow-2xl transition-all duration-300 rounded-xl bg-white border-2 border-transparent hover:border-secondary/20 h-full">
          <CardContent className="p-8 space-y-4 flex flex-col items-center text-center">
            <div className="p-4 bg-accent/50 rounded-full hover:bg-secondary/10 transition-colors duration-300">
              {reason.icon}
            </div>
            <h3 className="text-xl font-bold text-primary">{reason.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{reason.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

{/* Testimonials Slider */}
<section 
  className="relative container mx-auto px-4 py-16 bg-gradient-to-br from-accent/20 via-primary/5 to-secondary/10 rounded-2xl"
>
  <div className="relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
      What <span className="text-primary">Our Clients </span><span className="text-secondary">Say</span>
    </h2>
    <Slider {...sliderSettings}>
      {testimonials.map((review, index) => (
        <div key={index} className="px-2">
          <Card className="hover:shadow-2xl transition-all duration-300 rounded-xl h-full border-2 border-transparent hover:border-primary/20 bg-white">
            <CardContent className="p-8 space-y-4 text-center flex flex-col items-center min-h-[200px]">
              <div className="p-3 bg-secondary/10 rounded-full">
                <Quote className="w-8 h-8 text-secondary" />
              </div>
              <p className="text-base text-muted-foreground italic leading-relaxed flex-grow">"{review.text}"</p>
              <p className="text-lg font-bold text-primary">{review.name}</p>
            </CardContent>
          </Card>
        </div>
      ))}
    </Slider>
  </div>
</section>

{/* Partners */}
{/* <section 
  className="relative py-12 px-4  bg-center rounded-2xl shadow-lg" 
  style={{ backgroundImage: "" }}
>
  <div className="absolute inset-0  rounded-2xl"></div>
  <div className="container mx-auto space-y-8 relative z-10">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
      Trusted <span className="text-travel-orange">Partners</span>
    </h2>
    <div className="flex flex-wrap justify-center items-center gap-8">
      {[
        "https://upload.wikimedia.org/wikipedia/commons/0/05/Emirates_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/8/8b/Flydubai_logo.svg",
        "https://upload.wikimedia.org/wikipedia/commons/b/bf/Etihad_Airways_Logo.svg",
      ].map((logo, index) => (
        <img
          key={index}
          src={logo}
          alt={`Partner ${index + 1}`}
          className="h-12 grayscale hover:grayscale-0 transition"
        />
      ))}
    </div>
  </div>
</section> */}

          </main>

          <Footer />
        </>
      )}
    </>
  );
};

export default AboutUs;
