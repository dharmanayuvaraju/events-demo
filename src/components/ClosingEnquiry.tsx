import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { A3Y_CONFIG } from '../data/config';

export const ClosingEnquiry: React.FC = () => {
  return (
    <section id="enquiry-section" className="section-closing-enquiry" aria-labelledby="closing-enquiry-heading">
      <div className="container">
        <div className="closing-enquiry-card">
          <div className="closing-single-body">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="closing-badge">{A3Y_CONFIG.creator} Concept Demonstration</span>
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">
                Developer Contact
              </span>
            </div>

            <h2 id="closing-enquiry-heading" className="closing-title">
              Conceive your next celebration website with A3Y.
            </h2>

            <p className="closing-lead">
              An engineering showcase demonstrating responsive editorial typography and tactile mobile interactions. Direct inquiries regarding bespoke website design and engineering are welcomed.
            </p>

            <div className="closing-actions-row">
              <a
                href={A3Y_CONFIG.developer.callHref}
                className="dev-call-btn"
                aria-label={`${A3Y_CONFIG.developer.label}: call ${A3Y_CONFIG.developer.phone}`}
              >
                <Phone size={15} />
                <span>Call {A3Y_CONFIG.developer.phone}</span>
              </a>

              <Link
                to="/contact"
                className="dev-planner-btn"
                aria-label="Test sample celebration planner and contact form"
              >
                <span>Sample Planner</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="closing-transparency-note">
              <ShieldCheck size={14} className="closing-note-icon flex-shrink-0" />
              <span>
                {A3Y_CONFIG.developer.label} &bull; Fictional studio concept demonstration by {A3Y_CONFIG.developer.name}. No commercial event bookings accepted.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingEnquiry;
