import { useState } from "react";
// Using Unsplash image
const contactHero = "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1200&q=80";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon."
    });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };

  return (
    <div className="min-h-screen bg-background text-gray-800">
      

      <Header />

      <main>
        {/* Hero Section with Background Image */}
      <section
  className="relative h-64 md:h-80 bg-cover bg-center flex items-center justify-center text-white"
  style={{
    backgroundImage: `url(${contactHero})`
  }}
>
  <div className="absolute inset-0 bg-black/10" />
  <div className="relative z-10 text-center px-4">
    <h1 className="text-2xl md:text-5xl font-bold mb-2 md:mb-4">
      Contact Us
    </h1>
    <p className="text-sm md:text-xl text-white/90">
      Get in touch with our travel experts
    </p>
  </div>
</section>

        {/* Contact Info & Form */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-5 md:space-y-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <Phone className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Phone</h3>
                      <p className="text-gray-600 text-xs md:text-base">
                        +91-9871163568, +971-552763147
                      </p>
                      <p className="text-gray-600 text-xs md:text-base">
                        +91-9599395089, +971-552164786
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Email</h3>
                      <p className="text-gray-600 text-xs md:text-base">
                        trilok@arabianvibesllc.com
                      </p>
                      <p className="text-gray-600 text-xs md:text-base">
                        vineet@arabianvibesllc.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <MapPin className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">
                        UAE Address
                      </h3>
                      <p className="text-gray-600 text-xs md:text-base">
                        75 Arabian Square Business Center, Al Fahidi, Dubai 12202
                      </p>
                      <h3 className="font-semibold text-sm md:text-base mt-2">
                        India Address
                      </h3>
                      <p className="text-gray-600 text-xs md:text-base">
                        129, First Floor, Antriksh Bhawan, KG Marg, Connaught Place,
                        Delhi 110001
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">
                        Business Hours
                      </h3>
                      <p className="text-gray-600 text-xs md:text-base">
                        Mon - Fri: 9:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-xl md:text-3xl font-bold mb-4 md:mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Your first name"
                        required
                        className="w-full px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Your last name"
                        required
                        className="w-full px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+971 5XXXXXXXX"
                      className="w-full px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select a subject</option>
                      <option value="booking">Booking Inquiry</option>
                      <option value="support">Customer Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-medium mb-1">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your travel needs..."
                      required
                      className="w-full px-2 py-1.5 md:px-4 md:py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
