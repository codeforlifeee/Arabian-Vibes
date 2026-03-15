import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedDestinations from "@/components/sections/FeaturedDestinations";
import QuickLinksSection from "@/components/sections/QuickLinksSection";
import Footer from "@/components/layout/Footer";
import { useState, Suspense } from "react";
import InternalPageLayout from "./InternalPageLayout";
import { measureComponentRender } from "@/lib/performance";

const Index = () => {
  const endTimer = measureComponentRender('Index');

  const [showInternalPage, setShowInternalPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  endTimer();

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
            <Suspense fallback={<div className="py-8 bg-gray-50 animate-pulse"><div className="h-32 bg-gray-200 rounded mx-4"></div></div>}>
              <QuickLinksSection />
            </Suspense>
          </main>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;
