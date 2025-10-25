"use client";
import { ReactNode, useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface InternalPageLayoutProps {
  heroImage?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  sectionHeading?: string;
  sectionParagraph?: string;
  item?: any; // The selected item (activity, hotel, etc.)
  onClose?: () => void;
}

const InternalPageLayout: React.FC<InternalPageLayoutProps> = ({
  heroImage,
  title,
  description,
  sectionHeading = "Plan Your Trip With Us",
  sectionParagraph = "Please fill out the form below with your details. Our team will get back to you with the best travel options tailored for your needs.",
  item,
  onClose,
  children,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    adults: "1",
    children: "0",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Prepare email data
    const emailData = {
      to_name: "Arabian Vibes Team",
      from_name: formData.name,
      contact: formData.contact,
      adults: formData.adults,
      children: formData.children,
      item_name: item?.name || title,
      item_price: item?.price || "N/A",
      message: `New booking inquiry for: ${item?.name || title}`,
    };

    // Replace with your EmailJS credentials
    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || "your_service_id",
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "your_template_id",
        emailData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "your_public_key"
      )
      .then(
        () => {
          setStatus("✅ Booking inquiry sent successfully! We'll contact you soon.");
          setFormData({ name: "", contact: "", adults: "1", children: "0" });
        },
        (error) => {
          console.error("EmailJS error:", error);
          setStatus("❌ Failed to send inquiry. Please try again or contact us directly.");
        }
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      {/* Close button */}
      {onClose && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-white shadow-lg"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <section
        className="relative h-72 md:h-96 bg-center bg-cover"
        style={{ 
          backgroundImage: `url(${heroImage || item?.image || item?.images?.[0] || "/placeholder.svg"})` 
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{title}</h1>
           
          </div>
        </div>
      </section>

      {/* Item Details Section */}
      {item && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 w-full">
                {/* Item Image */}
                <div>
                  <img
                    src={item.image || item.images?.[0] || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold">{item.name}</h3>
                  
                  {item.location && (
                    <p className="text-gray-600 text-xs sm:text-sm">📍 {item.location}</p>
                  )}
                  
                  {item.duration && (
                    <p className="text-gray-600 text-xs sm:text-sm">⏱️ Duration: {item.duration}</p>
                  )}
                  
                  {item.category && (
                    <p className="text-gray-600 text-xs sm:text-sm">🏷️ Category: {item.category}</p>
                  )}
                  
                  {item.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-lg ${i < Math.floor(item.rating) ? "text-yellow-500" : "text-gray-300"}`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-600">({item.rating}/5)</span>
                    </div>
                  )}

                  {item.price && (
                    <div className="text-2xl font-bold text-primary">
                      {typeof item.price === 'string' ? item.price : `AED ${item.price}`}
                      <span className="text-sm text-gray-500 text-xs sm:text-sm"> per person</span>
                    </div>
                  )}

{item.description && (
  <div className="pt-[30px] w-full px-6 text-left">
    <div
      className="text-xs sm:text-sm text-gray-600 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: item.description }}
    />
  </div>
)}



                  {item.isFlashSale && item.flashSaleText && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-600 font-medium">🔥 {item.flashSaleText}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Form Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{sectionHeading}</h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto">{sectionParagraph}</p>
          </div>

          <div className="max-w-md mx-auto">
            <form
              onSubmit={sendEmail}
              className="bg-white shadow-lg rounded-2xl p-6 space-y-4"
            >
              <h3 className="text-xl font-semibold mb-4 text-center">Booking Inquiry</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contact"
                  placeholder="Enter your phone number"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults *
                  </label>
                  <input
                    type="number"
                    name="adults"
                    placeholder="1"
                    min="1"
                    max="20"
                    value={formData.adults}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <input
                    type="number"
                    name="children"
                    placeholder="0"
                    min="0"
                    max="20"
                    value={formData.children}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-glow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </button>

              {status && (
                <p className="text-center mt-4 text-sm font-medium">
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Additional content */}
      {children && (
        <section className="py-8">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </section>
      )}
    </div>
  );
};

export default InternalPageLayout;
