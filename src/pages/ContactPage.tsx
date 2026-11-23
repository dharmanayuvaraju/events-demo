import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../data/business';
import { InquiryForm } from '../components/InquiryForm';
import { MapPin, Phone } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'birthday';

  return (
    <div className="section-paper">
      <div className="container">
        {/* Header */}
        <div className="section-header max-w-3xl mb-8">
          <span className="section-label">Inquire &amp; Coordinate</span>
          <h1 className="section-title">Plan Your Celebration</h1>
          <p className="section-lead">
            Contact Colors Events &amp; Entertainment directly or prepare a reviewable inquiry brief. We coordinate decor styling across Kukatpally and nearby Hyderabad venues.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Phone & Venue Location */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Call Card */}
            <div className="p-6 md:p-8 rounded border border-neutral-300 bg-[#FFFDF9]">
              <span className="text-xs font-bold uppercase tracking-wider block mb-2 text-coral">
                Immediate Discussion
              </span>
              <h2 className="font-serif text-2xl font-bold mb-3">Call Direct</h2>
              <p className="text-sm opacity-80 leading-relaxed mb-6">
                Have an upcoming birthday or wedding date? Speak directly with the local decorator to discuss venue setup timing and ideas.
              </p>

              <a
                href={BUSINESS_CONFIG.callHref}
                className="btn-primary w-full text-center flex items-center justify-center gap-2 mb-3"
              >
                <Phone size={18} />
                <span>Call {BUSINESS_CONFIG.phone}</span>
              </a>

              <div className="text-xs opacity-65 text-center">
                Direct phone line &bull; Kukatpally, Hyderabad
              </div>
            </div>

            {/* Location & Map Card */}
            <div className="p-6 md:p-8 rounded border border-neutral-300 bg-[#FFFDF9]">
              <span className="text-xs font-bold uppercase tracking-wider block mb-2 opacity-60">
                Studio Locality
              </span>
              <h2 className="font-serif text-2xl font-bold mb-3">Kukatpally Base</h2>

              <div className="flex items-start gap-3 mb-4">
                <MapPin size={20} className="text-coral flex-shrink-0 mt-1" />
                <div className="text-sm opacity-85 leading-relaxed">
                  {BUSINESS_CONFIG.location.fullText}
                </div>
              </div>

              <a
                href={BUSINESS_CONFIG.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full text-center inline-block"
              >
                Open in Google Maps
              </a>
            </div>

            {/* Transparent Channel Disclosures */}
            <div className="p-5 rounded border border-neutral-200 bg-[#FAF4EB] text-xs space-y-2 opacity-80">
              <div className="font-bold uppercase tracking-wider">Launch Requirements Note</div>
              <p>
                <strong>WhatsApp Channel:</strong> WhatsApp inquiries are currently locked pending official business account registration.
              </p>
              <p>
                <strong>Privacy Guarantee:</strong> This form does not silently store personal telephone numbers or transmit inquiries to third-party tracking services.
              </p>
            </div>
          </div>

          {/* Right Column: Honest Inquiry Flow Form */}
          <div className="lg:col-span-7">
            <InquiryForm initialCategory={categoryParam} />
          </div>
        </div>
      </div>
    </div>
  );
};
