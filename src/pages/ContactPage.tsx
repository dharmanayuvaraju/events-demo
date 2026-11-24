import React from 'react';
import { EventPlanner } from '../components/EventPlanner';
import { A3Y_CONFIG } from '../data/config';
import { HelpCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <main id="main-content" className="section-paper">
      <div className="container">
        {/* Page Header */}
        <div className="section-header max-w-3xl mb-12">
          <span className="section-label">Interactive Planner &amp; Developer Inquiries</span>
          <h1 className="section-title">Planner &amp; Contact</h1>
          <p className="section-lead">
            Explore our spatial event planner demonstration below, or connect directly with the developer to discuss custom web engineering projects.
          </p>
        </div>

        {/* Clear Role Separation Notice */}
        <div className="contact-separation-card mb-12">
          <div className="flex items-start gap-3">
            <HelpCircle size={20} className="text-coral flex-shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-neutral-800 leading-relaxed">
              <strong>Two Distinct Functions:</strong> The form below is an in-browser interactive planner tool that generates a sample specification for demonstration purposes. To discuss building a website or digital product, contact developer <strong>{A3Y_CONFIG.developer.name}</strong> directly via the phone link provided.
            </div>
          </div>
        </div>

        {/* Real Interactive Planner Component */}
        <EventPlanner />
      </div>
    </main>
  );
};
