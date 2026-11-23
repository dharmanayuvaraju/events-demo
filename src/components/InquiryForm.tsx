import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../data/business';
import { Phone, Copy, Check, AlertCircle, Info } from 'lucide-react';

interface InquiryFormProps {
  initialCategory?: string;
}

interface FormData {
  name: string;
  phone: string;
  category: string;
  date: string;
  locality: string;
  brief: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  category?: string;
}

export const InquiryForm: React.FC<InquiryFormProps> = ({ initialCategory = 'birthday' }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    category: initialCategory,
    date: '',
    locality: 'Kukatpally',
    brief: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [inquirySummary, setInquirySummary] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.name.trim()) {
      errs.name = 'Please provide your name';
    }

    const cleanPhone = formData.phone.replace(/[\s\-()]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Please provide your contact phone number';
    } else if (!/^(?:\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.category) {
      errs.category = 'Please choose an event decoration theme';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate formatted inquiry summary without silent or mock backend transmission
    const formatted = [
      `*CELEBRATION DECOR INQUIRY*`,
      `Client: ${formData.name}`,
      `Phone: ${formData.phone}`,
      `Theme: ${formData.category.toUpperCase()}`,
      formData.date ? `Target Date: ${formData.date}` : `Target Date: Flexible / To be scheduled`,
      `Locality: ${formData.locality || 'Kukatpally, Hyderabad'}`,
      formData.brief ? `Brief / Requirements: ${formData.brief}` : null,
      `--- Generated via Colors Events & Entertainment Preview (${BUSINESS_CONFIG.phone}) ---`,
    ]
      .filter(Boolean)
      .join('\n');

    setInquirySummary(formatted);
  };

  const handleCopy = async () => {
    if (!inquirySummary) return;
    try {
      await navigator.clipboard.writeText(inquirySummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="inquiry-wrapper">
      <div className="mb-6">
        <span className="section-label">Proposed Inquiry Flow</span>
        <h2 className="font-serif text-2xl md:text-3xl font-bold">
          Plan Your Event Decoration
        </h2>
        <p className="text-sm opacity-75 mt-2">
          Share your celebration date and ideas. As this site is an unapproved preview draft, your submission is reviewed on-screen and never stored on remote servers.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="inquiry-name" className="form-label">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="inquiry-name"
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ramesh Reddy"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && (
            <p id="name-error" className="form-error" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Contact Phone */}
        <div className="form-group">
          <label htmlFor="inquiry-phone" className="form-label">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="inquiry-phone"
            type="tel"
            className="form-input"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="e.g. 9876543210"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : 'phone-hint'}
          />
          {errors.phone ? (
            <p id="phone-error" className="form-error" role="alert">
              {errors.phone}
            </p>
          ) : (
            <p id="phone-hint" className="form-helper">
              Direct contact number for event coordination and venue visit scheduling.
            </p>
          )}
        </div>

        {/* Decoration Category */}
        <div className="form-group">
          <label htmlFor="inquiry-category" className="form-label">
            Supported Decoration Theme <span className="text-red-500">*</span>
          </label>
          <select
            id="inquiry-category"
            className="form-select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            aria-required="true"
          >
            <option value="birthday">Birthday Decorations (Pastel rings, name arches, plinths)</option>
            <option value="wedding">Wedding Decorations (Mandap stages, drapery, floral frames)</option>
            <option value="balloons">Balloon Decorations (Organic garlands, entrance spirals)</option>
            <option value="flowers">Flower Decorations (Fresh marigold torans, jasmine ropes)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Date */}
          <div className="form-group">
            <label htmlFor="inquiry-date" className="form-label">
              Target Event Date (Optional)
            </label>
            <input
              id="inquiry-date"
              type="date"
              className="form-input"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* Locality */}
          <div className="form-group">
            <label htmlFor="inquiry-locality" className="form-label">
              Hyderabad Locality
            </label>
            <input
              id="inquiry-locality"
              type="text"
              className="form-input"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              placeholder="e.g. Kukatpally, KPHB Colony, Shamshiguda"
            />
          </div>
        </div>

        {/* Brief */}
        <div className="form-group">
          <label htmlFor="inquiry-brief" className="form-label">
            Decor Brief or Venue Notes (Optional)
          </label>
          <textarea
            id="inquiry-brief"
            rows={3}
            className="form-textarea"
            value={formData.brief}
            onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
            placeholder="Tell us about the venue type (apartment clubhouse, home terrace, banquet hall) or color preferences..."
          />
        </div>

        <button type="submit" className="btn-primary w-full md:w-auto">
          Generate Reviewable Inquiry
        </button>
      </form>

      {/* Reviewable Summary Box (Strict Honest Architecture) */}
      {inquirySummary && (
        <div className="inquiry-summary-box" role="region" aria-label="Reviewable Inquiry Summary">
          <div className="summary-notice">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-amber-700" />
            <div>
              <strong className="block text-amber-900 font-semibold mb-1">
                Preview Mode Notice: Nothing has been transmitted over the internet.
              </strong>
              <span>
                To honor our transparent preview policy, no personal details are sent to a backend or saved in persistent cookies. Please review your inquiry below and call Colors Events directly to schedule.
              </span>
            </div>
          </div>

          <pre className="summary-pre">{inquirySummary}</pre>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={BUSINESS_CONFIG.callHref}
              className="btn-primary flex items-center gap-2"
            >
              <Phone size={16} />
              <span>Call Colors Events Now ({BUSINESS_CONFIG.phone})</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary flex items-center gap-2"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              <span>{copied ? 'Summary Copied!' : 'Copy Summary Text'}</span>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs opacity-65">
            <Info size={14} />
            <span>{BUSINESS_CONFIG.channels.whatsAppNotice}</span>
          </div>
        </div>
      )}
    </div>
  );
};
