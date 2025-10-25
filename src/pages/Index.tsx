import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedDestinations from "@/components/sections/FeaturedDestinations";
import PopularExperiences from "@/pages/PopularExp";
import QuickLinksSection from "@/components/sections/QuickLinksSection";
import Footer from "@/components/layout/Footer";
import { useCards } from "@/hooks/useCards";
import { useSliders } from "@/hooks/useSliders";
import { DynamicCards } from "@/components/DynamicCards";
import { DynamicSlider } from "@/components/ui/DynamicSlider";
import { useState } from "react";
import InternalPageLayout from "./InternalPageLayout";


const Index = () => {
  // Fetch cards data for home page
  const { 
    data: cardsResponse, 
    isLoading: cardsLoading, 
    error: cardsError 
  } = useCards({ page: 'home', limit: 8 });

  // Fetch slider data for home page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'home', limit: 5 });

  // State for internal page
  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background">
      {showInternalPage ? (
        <InternalPageLayout
          title={selectedItem?.title || "Experience Details"}
          description="Discover amazing experiences and activities."
          item={selectedItem}
          onClose={() => {
            setShowInternalPage(false);
            setSelectedItem(null);
          }}
        />
      ) : (
        <>
          <Header />
          <main>
            <HeroSection />
            <FeaturedDestinations />
            
            

            <PopularExperiences 
              city="Dubai"
              title="Most Popular Experiences in UAE"
              description="Culture, nature, thrills, and record-breaking experiences—Dubai is the place to seek out everything you imagine and beyond. Find it all here!"
            />
           
            <QuickLinksSection />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
