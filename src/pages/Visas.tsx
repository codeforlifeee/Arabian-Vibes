import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useSliders } from "@/hooks/useSliders";
import { DynamicSlider } from "@/components/ui/DynamicSlider";

const visaOptions = [
  { title: "30 Days Single Entry Tourist Visa", priceAED: 400 },
  { title: "30 Days Child Visa", priceAED: 299 },
  { title: "60 Days Single Entry Tourist Visa", priceAED: 650 },
  { title: "60 Days Single Entry Child Visa", priceAED: 400 },
  { title: "30 Days Multiple Entry Tourist Visa", priceAED: 800 },
  { title: "30 Days Multiple Child Visa", priceAED: 500 },
  { title: "60 Days Multiple Entry Tourist Visa", priceAED: 1100 },
  { title: "60 Days Multiple Child Visa", priceAED: 700 },
];

export default function DubaiVisaPage() {
  const { convertAmount, formatAmount, currentCurrency } = useCurrency();
  const today = new Date().toISOString().slice(0, 10);

  // Fetch slider data for visas page
  const { 
    data: slidersResponse, 
    isLoading: slidersLoading, 
    error: slidersError 
  } = useSliders({ page: 'visa', limit: 5 });

  const [visas, setVisas] = useState(
    visaOptions.map((visa) => ({
      ...visa,
      selected: false,
      processingType: "Normal",
      date: today,
      quantity: 1,
    }))
  );
  return (
    <div className="bg-[#f9f9f9] text-gray-800">
      <Header />

      {/* Dynamic Slider Section */}
      {!slidersLoading && !slidersError && slidersResponse?.slides && slidersResponse.slides.length > 0 && (
        <DynamicSlider 
          slides={slidersResponse.slides}
          height="300px"
          autoplay={true}
          autoplayDelay={4000}
          showDots={true}
          showArrows={true}
          className="mb-0"
        />
      )}
      {/* Title & Icons */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-xl md:text-2xl font-bold mb-1">Dubai Visa</h1>
        <p className="text-gray-600 text-sm mb-4">815 Reviews</p>
        <div className="flex flex-wrap gap-2 text-xs md:text-sm">
          <span>📅 Normal 4-5 Working Days</span>
          <span>📝 Easy Documentation</span>
          <span>💳 Online Payment Option</span>
          <span>⚡ Express Working Days</span>
        </div>
      </div>

      {/* Visa Options */}

      <section className="container mx-auto px-4 pb-10">
        <h2 className="text-lg md:text-xl font-bold mb-4">
          Dubai Visa Prices & Options
        </h2>
        <div className="space-y-4">
          {visas.map((visa, index) => (
            <div
              key={index}
              className="bg-white border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm"
            >
              <div className="flex items-start gap-3 w-full sm:w-2/3">
                <input
                  type="checkbox"
                  checked={visa.selected}
                  onChange={() =>
                    setVisas((prev) =>
                      prev.map((v, i) =>
                        i === index ? { ...v, selected: !v.selected } : v
                      )
                    )
                  }
                  className="mt-1 accent-blue-600"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    {visa.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* ✅ Processing Type Dropdown */}
                    <div>
                      <label className="block text-xs mb-1">Processing Type</label>
                      <select
                        value={visa.processingType}
                        onChange={(e) =>
                          setVisas((prev) =>
                            prev.map((v, i) =>
                              i === index
                                ? { ...v, processingType: e.target.value }
                                : v
                            )
                          )
                        }
                        className="border rounded p-1 text-xs w-full"
                      >
                        <option value="Normal">Normal</option>
                        <option value="Express">Express</option>
                      </select>
                    </div>

                    {/* ✅ Travel Date */}
                    <div>
                      <label className="block text-xs mb-1">Travel Date</label>
                      <input
                        type="date"
                        value={visa.date}
                        onChange={(e) =>
                          setVisas((prev) =>
                            prev.map((v, i) =>
                              i === index ? { ...v, date: e.target.value } : v
                            )
                          )
                        }
                        className="border rounded p-1 text-xs w-full"
                      />
                    </div>

                    {/* ✅ Number of Visa */}
                    <div>
                      <label className="block text-xs mb-1">No. Of Visa</label>
                      <input
                        type="number"
                        min={1}
                        value={visa.quantity}
                        onChange={(e) =>
                          setVisas((prev) =>
                            prev.map((v, i) =>
                              i === index
                                ? {
                                  ...v,
                                  quantity: Math.max(
                                    1,
                                    parseInt(e.target.value) || 1
                                  ),
                                }
                                : v
                            )
                          )
                        }
                        className="border rounded p-1 text-xs w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ Price Display */}
              <div className="mt-4 sm:mt-0">
                <p className="text-right font-bold text-primary text-sm">
                  {currentCurrency === 'AED' ? 
                    `AED ${visa.priceAED.toFixed(2)}` : 
                    formatAmount(convertAmount(visa.priceAED, 'AED', currentCurrency), currentCurrency)
                  }
                </p>
              </div>


            </div>
          ))}
        </div>

        
      </section>

      {/* Dubai Visa Online */}
      <section className="container mx-auto px-4 pb-10 space-y-6 text-sm md:text-base">
        <h2 className="text-lg md:text-xl font-bold">Dubai Visa Online</h2>
        <p>
          Are you planning a Dubai trip for leisure or business? Let us help you get the first step
          of your visit seamless with our trusted and diverse Dubai visa packages.
        </p>
        <p >
          If you find the Dubai visa application challenging, especially due to frequent revisions
          and updates in immigration rules, you can always count on our visa experts! From the
          initial inquiry and helping you choose the right visa to gathering all essential documents
          and ensuring its approval, they will guide you through the entire process while taking all
          guesswork out of the process and ensuring that all the Dubai visit visa regulations and
          requirements are accurately met.
        </p>
        <p>
          Whether you’re looking for a short-term or long-term Dubai trip, you can opt for a 30-day
          or 60-day Dubai tourist visa that matches your unique travel needs. If your Dubai visit
          requires you to travel frequently in and out of the country, there is multiple-entry visa,
          which allows you to exit and reenter Dubai or the UAE as and when required during your
          visa’s validity period, i.e., 30 or 60 days.
        </p>
        <p>
          Our Dubai visa services are not just restricted to assisting you in obtaining the right
          visa. We also provide effective and prompt solutions for visa renewal, allowing you to
          extend your Dubai stay without any hassle. So leave all the hectic procedures of applying
          for or extending a visa to our professional team; rest assured that they will provide
          high-end travel support and Dubai visit visa price as you sit back and focus on planning
          your much-awaited Dubai vacation.
        </p>
        <p>
          <strong>Special Note:</strong> Once you've completed the online UAE visa application
          booking process, send us your documents to inquiry@Arabian Vibestours.com, using your unique
          Booking Reference/AGT Number as the subject line.
        </p>

        <h2 className="text-xl font-bold">Dubai Visa Documents</h2>
        <p>
          <strong>Visitor's Document:</strong> Your Dubai visa process starts once we receive the
          clear scanned copies of your following documents:
        </p>
        <ul className="list-disc ml-6">
          <li>Passport size Photograph</li>
          <li>Passport front page</li>
          <li>Passport last page</li>
          <li>Passport page with exit stamp, if you’ve visited Dubai before</li>
          <li>Confirmed return air tickets</li>
          <li>
            Covid-19 Insurance (Arabian Vibes will Charge an Additional amount for Insurance as per
            visa type).
          </li>
        </ul>
        <p>
          <strong>Special Note</strong>
        </p>
        <ul className="list-disc ml-6">
          <li>The validity of the passport should be a minimum of 6 months.</li>
          <li>The passport should not be in a handwritten format.</li>
          <li>The documents submitted should not be blurred or weary.</li>
          <li>
            If any of the above requirements are not matching with your current situation you may
            contact us at Operations@arabianvibesllc.com.
          </li>
        </ul>
      </section>
      {/* How to Apply Dubai Visa */}
      <section className="container mx-auto px-4 pb-10 space-y-6 text-sm md:text-base">
        <h2 className="text-xl font-bold">How to Apply for Dubai Visa</h2>
        <p>
          If you're not a national of any GCC country, then you would require a Visa for Dubai and Rayna Tours makes it extremely easy and hassle-free. Having a previous travel record and no criminal history in the last five years makes you eligible for the Dubai visa. In case you haven't traveled abroad, furnishing the financial records of business, profession or employment or an Invitation from an immediate family member residing in UAE on family status, makes you eligible for the Dubai Visa.
        </p>
        <p>To obtain a quick Dubai Visa, simply follow the 3-step procedure with Rayna:</p>
        <ol className="list-decimal ml-6 space-y-2">
          <li>Fill up our simple online visa application form asking for your name, nationality, primary contact address, travel date etc.</li>
          <li>Submit clear scanned documents relevant for visa processing.</li>
          <li>Make payment through our secured gateway using a credit card.</li>
        </ol>
        <p>
          Alternatively, you can also get in touch with us via email at <a href="mailto:Operations@arabianvibesllc.com" className="text-blue-600 underline">Operations@arabianvibesllc.com</a> or call us at 📞 +91-9871163568, +971-552763147 with your requirements. For alternate payment methods, you can use bank transfer, PayPal, or cash deposit to enjoy all our services.
        </p>
        <p>
          Once your application is submitted, it is reviewed initially by our expert panel. If necessary, we'll request you to make changes to amend the application with additional information. Please keep details like airline ticket, guarantor's documents, or voucher indicating hotel booking ready. If all steps are duly followed, we promise to get your visa submitted and processed in the least time.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Special Note:</strong> Insurance price is not included in the visa price. Arabian Vibes will charge an additional amount for Covid-19 insurance as per visa type. For questions related to insurance, call us at 📞 +91-9871163568, +971-552763147
        </p>
        <p className="text-sm text-gray-700">
          <strong>Express visa</strong> refers to our expedited visa processing service, where we prioritize and swiftly handle the entire process, including efficient typing, prompt posting, and streamlined documentation, to ensure rapid issuance of the visa.
        </p>
      </section>

      {/* Dubai Visa FAQs */}
      <section className="container mx-auto px-4 pb-10 space-y-6 text-sm md:text-base">
        <h2 className="text-xl font-bold">Dubai Visa FAQs</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Is it mandatory to obtain a visa?</strong> Visa is mandatory for all non-UAE citizens to travel to UAE. Citizens of GCC nations (Saudi Arabia, Bahrain, Qatar, Kuwait, Oman) are exempt.</li>
          <li><strong>Do infants and kids require a visa?</strong> Yes, all infants and kids traveling with non-UAE citizen parents need a visa.</li>
          <li><strong>Who is eligible for visa on arrival?</strong> Nationals from certain European, North American, and Far East countries (e.g., Australia, Austria, Belgium, France, Germany, Iceland, Hong Kong, Singapore, Japan, Malaysia, Portugal, UK, USA) can get visa on arrival. Always check with your local embassy for the latest list.</li>
          <li><strong>How to apply from another country?</strong> You can apply online yourself or a relative/friend in the UAE can apply on your behalf.</li>
          <li><strong>What visa types can I apply for?</strong> Tourist visa, transit visa, or visit visa depending on your stay duration.</li>
          <li><strong>Benefits of applying with Rayna Tours?</strong> No local sponsor needed, minimal documentation, fast processing (usually 3–4 working days), no cash deposit required, paper visa provided for smooth entry, emergency visa service available.</li>
          <li><strong>Documents required for UAE e-visa?</strong> Passport-size color photo and scanned passport copy valid for at least 6 months at travel time.</li>
          <li><strong>When should I apply?</strong> Though processing usually takes 3–4 working days, it’s recommended to apply in advance for hassle-free travel.</li>
          <li><strong>Can I book my ticket before visa?</strong> Yes, tickets can be booked before applying or processing your visa.</li>
          <li><strong>Does the UAE visa allow entry and exit at any airport?</strong> Yes, a valid visa allows entry and exit at all UAE airports.</li>
          <li><strong>How many days does it take to get a visa?</strong> Usually 3–4 working days, depending on timely submission of documents and eligibility.</li>
          <li><strong>How about visa application fee?</strong> For fee queries, contact 📞 +91-9871163568, +971-552763147 or email <a href="mailto:Operations@arabianvibesllc.com" className="text-blue-600 underline">Operations@arabianvibesllc.com</a>.</li>
          <li><strong>Can I track my visa status?</strong> After submitting your form, you’ll receive an authentication email with a link to check your status. Or contact a visa agent anytime.</li>
          <li><strong>Is visa fee refundable if rejected?</strong> No. UAE immigration does not refund rejected visa fees.</li>
          <li><strong>Can I know the reason for rejection?</strong> The UAE immigration authority generally does not reveal visa refusal reasons.</li>
          <li><strong>Can I reapply?</strong> Yes — you can reapply if you meet eligibility criteria properly.</li>
          <li><strong>How will I receive my visa?</strong> Once processed, it will be emailed to you.</li>
          <li><strong>Is entry 100% guaranteed with a visa?</strong> Entry is at the discretion of UAE immigration officers based on document verification at the port of entry.</li>
          <li><strong>What if I overstay without renewal?</strong> You may face legal action, hefty fines, and possible future UAE visa bans.</li>
        </ul>
      </section>
      {/* Dubai Visa Info */}
      <section className="container mx-auto px-4 pb-10 space-y-6 text-sm md:text-base">

        <h2 className="text-lg md:text-xl font-bold">
          On Arrival Visa Countries
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 list-disc ml-6">
          <li>Luxembourg</li>
          <li>Latvia</li>
          <li>Andorra</li>
          <li>Germany</li>
          <li>Liechtenstein</li>
          <li>San Marino</li>
          <li>Australia</li>
          <li>Greece</li>
          <li>Singapore</li>
          <li>Austria</li>
          <li>Malaysia</li>
          <li>Netherlands</li>
          <li>Spain</li>
          <li>Belgium</li>
          <li>Hong Kong</li>
          <li>Monaco</li>
          <li>South Korea</li>
          <li>Brunei</li>
          <li>Iceland</li>
          <li>Sweden</li>
          <li>Denmark</li>
          <li>Ireland</li>
          <li>New Zealand</li>
          <li>Switzerland</li>
          <li>Finland</li>
          <li>Italy</li>
          <li>Norway</li>
          <li>United Kingdom</li>
          <li>France</li>
          <li>Japan</li>
          <li>Portugal</li>
          <li>United States</li>
          <li>Vatican City State (Holy See)</li>
          <li>China</li>
          <li>Israel</li>
          <li>Kuwait</li>
        </ul>

        <h2 className="text-xl font-bold">Restricted Visa Country</h2>
        <p>Restricted Country Not Available.</p>

        <h2 className="text-xl font-bold">Dubai Visa Terms &amp; Conditions</h2>
        <ul className="list-decimal ml-6 space-y-2">
          <li>Entering UAE by road requires an original visa copy issued by immigration at an additional AED 150 per person (courier charges extra).</li>
          <li>Visa processing can be done only after required documentation and payment clearance.</li>
          <li>All visa applications are for single entry only.</li>
          <li>Apply at least 5 to 7 days before arrival; processing usually takes 5 working days (Sunday–Thursday). If held by immigration, it may take two more days.</li>
          <li>Approved visas will be emailed. Print a copy to present at passport control. Original not required unless entering by road.</li>
          <li>Visa approval is at the sole discretion of Immigration Officials; Rayna Tours is not responsible for rejection. Fees are non-refundable once submitted.</li>
          <li>Some airlines may require ‘Ok to Board’ approval 24 hours before departure. RTT can assist for an extra charge.</li>
          <li>If your visa is denied, we’ll send you a copy for your records.</li>
          <li>A fine of AED 100 will be deducted if the traveler does not travel after visa issuance.</li>
          <li>Overstaying incurs a penalty of AED 150 per day from the guarantee amount.</li>
          <li>The guarantor’s security cheque will be deposited if the traveler overstays due to imprisonment or crime.</li>
          <li>After departure, send us a copy of your passport’s UAE exit stamp page for proof of exit and refund processing.</li>
          <li>Refund of security cheque is done only upon confirmed departure. The guarantor must collect it within 3 months, or it will be canceled and destroyed.</li>
          <li>A reliable travel insurance plan is strongly recommended. RTT can help arrange this (charges apply).</li>
        </ul>

        <h2 className="text-xl font-bold">Things You Must Remember During Travel</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Carry a valid, confirmed return air ticket.</li>
          <li>Have a confirmed accommodation booking in a UAE hotel.</li>
        </ul>

        <h2 className="text-xl font-bold">Reasons of Visa Rejection</h2>
        <ul className="list-decimal ml-6 space-y-2">
          <li>Female visitor under 25 traveling alone may face rejection.</li>
          <li>Handwritten passport copies (e.g., from Pakistan or Bangladesh) are rejected.</li>
          <li>Applicants with blacklisting or serious offense records are rejected.</li>
          <li>Previous residence visa holders who exited without cancellation may be denied.</li>
          <li>Previous tourist visa holders who did not enter must cancel old visas before reapplying.</li>
          <li>Blurry passport photos can delay or reject your application.</li>
          <li>Applications showing professions like laborer or cultivator are rejected.</li>
          <li>Typing errors can lead to rejection.</li>
          <li>Applicants who previously applied for a UAE job visa but did not enter must wait at least 6 months to apply again.</li>
          <li>Applications with identical personal details may face delays or rejection.</li>
        </ul>

        <h2 className="text-lg md:text-xl font-bold">
          Expected Public Holidays for 2025
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Day</th>
                <th className="border px-2 py-1">Holiday</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border px-4 py-2">01-Jan-2025</td><td className="border px-4 py-2">Wed</td><td className="border px-4 py-2">New Year's Day</td></tr>
              <tr><td className="border px-4 py-2">27-Jan-2025</td><td className="border px-4 py-2">Mon</td><td className="border px-4 py-2">Leilat al-Meiraj (The Prophet's Ascension)</td></tr>
              <tr><td className="border px-4 py-2">01-Mar-2025</td><td className="border px-4 py-2">Sat</td><td className="border px-4 py-2">Ramadan Start</td></tr>
              <tr><td className="border px-4 py-2">31-Mar-2025</td><td className="border px-4 py-2">Mon</td><td className="border px-4 py-2">Eid al-Fitr</td></tr>
              <tr><td className="border px-4 py-2">01-Apr-2025</td><td className="border px-4 py-2">Tue</td><td className="border px-4 py-2">Eid al-Fitr Holiday 1</td></tr>
              <tr><td className="border px-4 py-2">02-Apr-2025</td><td className="border px-4 py-2">Wed</td><td className="border px-4 py-2">Eid al-Fitr Holiday 2</td></tr>
              <tr><td className="border px-4 py-2">03-Apr-2025</td><td className="border px-4 py-2">Thu</td><td className="border px-4 py-2">Eid al-Fitr Holiday 3</td></tr>
              <tr><td className="border px-4 py-2">06-Jun-2025</td><td className="border px-4 py-2">Fri</td><td className="border px-4 py-2">Arafat (Haj) Day</td></tr>
              <tr><td className="border px-4 py-2">07-Jun-2025</td><td className="border px-4 py-2">Sat</td><td className="border px-4 py-2">Eid Al Adha / Feast of Sacrifice</td></tr>
              <tr><td className="border px-4 py-2">08-Jun-2025</td><td className="border px-4 py-2">Sun</td><td className="border px-4 py-2">Eid al-Adha Holiday 1</td></tr>
              <tr><td className="border px-4 py-2">09-Jun-2025</td><td className="border px-4 py-2">Mon</td><td className="border px-4 py-2">Eid al-Adha Holiday 2</td></tr>
              <tr><td className="border px-4 py-2">27-Jun-2025</td><td className="border px-4 py-2">Fri</td><td className="border px-4 py-2">Al-Hijra (Islamic New Year)</td></tr>
              <tr><td className="border px-4 py-2">04-Sep-2025</td><td className="border px-4 py-2">Thu</td><td className="border px-4 py-2">Mouloud (The Prophet's Birthday)</td></tr>
              <tr><td className="border px-4 py-2">30-Nov-2025</td><td className="border px-4 py-2">Sun</td><td className="border px-4 py-2">Commemoration Day</td></tr>
              <tr><td className="border px-4 py-2">02-Dec-2025</td><td className="border px-4 py-2">Tue</td><td className="border px-4 py-2">National Day</td></tr>
              <tr><td className="border px-4 py-2">03-Dec-2025</td><td className="border px-4 py-2">Wed</td><td className="border px-4 py-2">National Day Holiday</td></tr>
              <tr><td className="border px-4 py-2">31-Dec-2025</td><td className="border px-4 py-2">Wed</td><td className="border px-4 py-2">New Year's Eve</td></tr>
            </tbody>
          </table>
        </div>

      </section>



      <Footer />
    </div>

  );
}
