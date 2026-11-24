import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowUpRight, Code, ShieldCheck } from 'lucide-react';
import { A3Y_CONFIG } from '../data/config';

export const ClosingEnquiry: React.FC = () => {
  return (
    <section className="section-closing-enquiry" aria-labelledby="closing-enquiry-heading">
      <div className="container">
        <div className="closing-enquiry-card">
          <div className="closing-content-left">
            <span className="closing-badge">A3Y Solutions Concept Demonstration</span>
            <h2 id="closing-enquiry-heading" className="closing-title">
              Conceive your next celebration space with A3Y.
            </h2>
            <p className="closing-lead">
              This editorial website is an original design and engineering showcase built to demonstrate high-performance web craft, responsive typography, and tactile UI interactions.
            </p>

            <div className="closing-transparency-note">
              <ShieldCheck size={16} className="closing-note-icon" />
              <span>
                Fictional studio concept. Imagery is curated for demonstration inspiration. No commercial bookings are accepted.
              </span>
            </div>
          </div>

          <div className="closing-content-right">
            <div className="developer-contact-box">
              <div className="dev-box-header">
                <Code size={15} className="dev-box-icon" />
                <span className="dev-box-label">Website Engineering Inquiries</span>
              </div>

              <div className="dev-name-row">
                <span className="dev-name">{A3Y_CONFIG.developer.name}</span>
                <span className="dev-agency">&bull; {A3Y_CONFIG.creator}</span>
              </div>

              <p className="dev-desc">
                {A3Y_CONFIG.developer.note}
              </p>

              <div className="dev-actions">
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
                  aria-label="Try the interactive celebration planner"
                >
                  <span>Test Event Planner</span>
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <span className="dev-label-sub">
                {A3Y_CONFIG.developer.label} &bull; Real direct contact
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
