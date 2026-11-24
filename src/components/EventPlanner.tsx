import React, { useState, useRef } from 'react';
import { A3Y_CONFIG } from '../data/config';
import { Copy, Check, RotateCcw, Edit3, Sparkles, Phone, AlertCircle } from 'lucide-react';

interface PlannerInputs {
  theme: 'birthday' | 'wedding' | 'balloons' | 'flowers' | '';
  date: string;
  guestCount: string;
  venueType: string;
  notes: string;
}

interface FormErrors {
  theme?: string;
  guestCount?: string;
  venueType?: string;
}

export const EventPlanner: React.FC = () => {
  const [inputs, setInputs] = useState<PlannerInputs>({
    theme: 'birthday',
    date: '',
    guestCount: '50 - 100 guests',
    venueType: 'Indoor banquet hall',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [copyFallbackVisible, setCopyFallbackVisible] = useState<boolean>(false);
  const briefTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Validate form inputs
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!inputs.theme) {
      newErrors.theme = 'Please select a demonstration celebration theme.';
    }
    if (!inputs.guestCount) {
      newErrors.guestCount = 'Please choose an estimated guest range.';
    }
    if (!inputs.venueType) {
      newErrors.venueType = 'Please select a venue type.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const themeTitles: Record<string, string> = {
      birthday: 'Birthday Celebrations & Milestone Staging',
      wedding: 'Wedding Ceremonies & Mandap Styling',
      balloons: 'Balloon Architecture & Organic Installations',
      flowers: 'Fresh Floral Installations & Auspicious Decor',
    };

    const brief = [
      `=== A3Y CELEBRATIONS - SAMPLE EVENT SPECIFICATION ===`,
      `[CONCEPT DEMO RECORD - NOT A COMMERCIAL BOOKING]`,
      ``,
      `Selected Theme:    ${themeTitles[inputs.theme] || inputs.theme}`,
      `Estimated Date:    ${inputs.date ? inputs.date : 'To be determined (Flexible)'}`,
      `Guest Range:       ${inputs.guestCount}`,
      `Venue Archetype:   ${inputs.venueType}`,
      `Aesthetic Notes:   ${inputs.notes.trim() ? inputs.notes.trim() : 'Standard signature palette and spatial framing.'}`,
      ``,
      `Illustrative Staging Considerations (Concept demonstration only; not safety-certified engineering guidance):`,
      `- Suggested focal backdrop proportion: approx 12ft width x 8ft height.`,
      `- Suggested staging window: approx 3 hours prior to guest arrival.`,
      `- Illustrative surface protection: non-marking ties and weighted floor counterbalances.`,
      ``,
      `Generated locally on: ${new Date().toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`,
      `=== Generated for demonstration purposes via A3Y Solutions ===`,
    ].join('\n');

    setGeneratedBrief(brief);
    setIsCopied(false);
    setCopyFallbackVisible(false);
  };

  const handleCopy = async () => {
    if (!generatedBrief) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedBrief);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      } else {
        // Fallback for browsers with restricted clipboard
        setCopyFallbackVisible(true);
        briefTextareaRef.current?.select();
      }
    } catch {
      setCopyFallbackVisible(true);
      briefTextareaRef.current?.select();
    }
  };

  const handleReset = () => {
    setInputs({
      theme: 'birthday',
      date: '',
      guestCount: '50 - 100 guests',
      venueType: 'Indoor banquet hall',
      notes: '',
    });
    setGeneratedBrief(null);
    setErrors({});
    setIsCopied(false);
    setCopyFallbackVisible(false);
  };

  const handleEdit = () => {
    setGeneratedBrief(null);
  };

  return (
    <div className="planner-container">
      {/* Informative Header */}
      <div className="planner-intro mb-8">
        <span className="section-label">Interactive Demo Interaction</span>
        <h2 className="planner-title">Sample Event Specification Planner</h2>
        <p className="planner-lead">
          Test our spatial planning workflow. Select celebration parameters below to generate a formatted local event brief.
        </p>

        {/* Clear Honesty Notice */}
        <div className="planner-disclaimer-box" role="status">
          <AlertCircle size={18} className="disclaimer-icon" />
          <div className="disclaimer-text">
            <strong>Demonstration Notice:</strong> This interactive planner runs entirely in your browser. It does not submit an inquiry, reserve a calendar date, or transmit personal data to anyone.
          </div>
        </div>
      </div>

      <div className="planner-grid">
        {/* Left Column: Interactive Form */}
        <div className="planner-form-card">
          {!generatedBrief ? (
            <form onSubmit={handleGenerate} noValidate>
              {/* Field 1: Theme Selection */}
              <div className="form-group">
                <label htmlFor="planner-theme" className="form-label">
                  1. Celebration Theme <span className="req">*</span>
                </label>
                <select
                  id="planner-theme"
                  className={`form-select ${errors.theme ? 'input-error' : ''}`}
                  value={inputs.theme}
                  onChange={(e) => {
                    setInputs({ ...inputs, theme: e.target.value as any });
                    if (errors.theme) setErrors({ ...errors, theme: undefined });
                  }}
                  aria-describedby={errors.theme ? 'theme-error' : undefined}
                  aria-invalid={Boolean(errors.theme)}
                >
                  <option value="birthday">Birthday Celebrations & Milestone Staging</option>
                  <option value="wedding">Wedding Ceremonies & Traditional Mandaps</option>
                  <option value="balloons">Balloon Architecture & Organic Clusters</option>
                  <option value="flowers">Floral Installations & Fresh Blossom Torans</option>
                </select>
                {errors.theme && (
                  <p id="theme-error" className="error-message">
                    {errors.theme}
                  </p>
                )}
              </div>

              {/* Field 2: Target Date (Optional) */}
              <div className="form-group">
                <label htmlFor="planner-date" className="form-label">
                  2. Anticipated Event Date <span className="opt">(Optional)</span>
                </label>
                <input
                  type="date"
                  id="planner-date"
                  className="form-input"
                  value={inputs.date}
                  onChange={(e) => setInputs({ ...inputs, date: e.target.value })}
                />
                <span className="field-hint">Used for seasonal floral and palette recommendations.</span>
              </div>

              {/* Field 3: Guest Count Range */}
              <div className="form-group">
                <label htmlFor="planner-guests" className="form-label">
                  3. Guest Scale <span className="req">*</span>
                </label>
                <select
                  id="planner-guests"
                  className={`form-select ${errors.guestCount ? 'input-error' : ''}`}
                  value={inputs.guestCount}
                  onChange={(e) => {
                    setInputs({ ...inputs, guestCount: e.target.value });
                    if (errors.guestCount) setErrors({ ...errors, guestCount: undefined });
                  }}
                  aria-describedby={errors.guestCount ? 'guest-error' : undefined}
                >
                  <option value="Under 50 guests">Intimate (Under 50 guests)</option>
                  <option value="50 - 100 guests">Medium (50 - 100 guests)</option>
                  <option value="100 - 250 guests">Grand (100 - 250 guests)</option>
                  <option value="250+ guests">Large Scale (250+ guests)</option>
                </select>
                {errors.guestCount && (
                  <p id="guest-error" className="error-message">
                    {errors.guestCount}
                  </p>
                )}
              </div>

              {/* Field 4: Venue Archetype */}
              <div className="form-group">
                <label htmlFor="planner-venue" className="form-label">
                  4. Venue Archetype <span className="req">*</span>
                </label>
                <select
                  id="planner-venue"
                  className={`form-select ${errors.venueType ? 'input-error' : ''}`}
                  value={inputs.venueType}
                  onChange={(e) => {
                    setInputs({ ...inputs, venueType: e.target.value });
                    if (errors.venueType) setErrors({ ...errors, venueType: undefined });
                  }}
                  aria-describedby={errors.venueType ? 'venue-error' : undefined}
                >
                  <option value="Indoor banquet hall">Indoor banquet or celebration hall</option>
                  <option value="Outdoor lawn or courtyard">Outdoor lawn, garden, or courtyard</option>
                  <option value="Private residence living area">Private residence / apartment hall</option>
                  <option value="Rooftop or open terrace">Rooftop or open-air terrace</option>
                </select>
                {errors.venueType && (
                  <p id="venue-error" className="error-message">
                    {errors.venueType}
                  </p>
                )}
              </div>

              {/* Field 5: Style Notes (Optional) */}
              <div className="form-group">
                <label htmlFor="planner-notes" className="form-label">
                  5. Aesthetic Preferences &amp; Spatial Notes <span className="opt">(Optional)</span>
                </label>
                <textarea
                  id="planner-notes"
                  className="form-textarea"
                  rows={3}
                  placeholder="e.g. Prefer warm marigold and coral tones, circular ring backdrop, illuminated letter signage."
                  value={inputs.notes}
                  onChange={(e) => setInputs({ ...inputs, notes: e.target.value })}
                />
              </div>

              <div className="form-actions pt-4">
                <button type="submit" className="btn-primary w-full">
                  <Sparkles size={16} />
                  <span>Generate sample brief</span>
                </button>
              </div>
            </form>
          ) : (
            /* Output Preview State */
            <div className="brief-preview-wrap">
              <div className="brief-preview-header">
                <div className="flex items-center gap-2">
                  <span className="badge-pill">Generated Brief</span>
                  <span className="text-xs opacity-70">Local in-browser record</span>
                </div>

                <div className="brief-btn-group">
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleEdit}
                    title="Edit specification parameters"
                  >
                    <Edit3 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary btn-sm"
                    onClick={handleReset}
                    title="Reset planner"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Brief Content Display */}
              <div className="brief-code-box">
                <pre>{generatedBrief}</pre>
              </div>

              {/* Fallback Textarea if Clipboard API is blocked */}
              {copyFallbackVisible && (
                <div className="mt-3">
                  <p className="text-xs mb-1 opacity-75">
                    Clipboard direct access restricted. Select and copy below:
                  </p>
                  <textarea
                    ref={briefTextareaRef}
                    readOnly
                    rows={6}
                    className="form-textarea text-xs font-mono"
                    value={generatedBrief}
                  />
                </div>
              )}

              <div className="brief-action-bar mt-4">
                <button
                  type="button"
                  className={`btn-primary w-full ${isCopied ? 'btn-copied' : ''}`}
                  onClick={handleCopy}
                >
                  {isCopied ? (
                    <>
                      <Check size={16} />
                      <span>Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copy brief text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Real Developer Contact Card */}
        <div className="developer-contact-card">
          <span className="section-label">Real Developer Contact</span>
          <h3 className="developer-name">Built by {A3Y_CONFIG.developer.name}</h3>
          <p className="developer-role">{A3Y_CONFIG.developer.role} &bull; {A3Y_CONFIG.creator}</p>
          
          <p className="developer-desc">
            This project is an editorial celebration portfolio demonstration engineered with React, TypeScript, and semantic responsive CSS.
          </p>

          <div className="contact-action-box">
            <span className="contact-call-label">{A3Y_CONFIG.developer.label}</span>
            <a
              href={A3Y_CONFIG.developer.callHref}
              className="developer-phone-link"
              aria-label={`Call developer Yuvaraj at ${A3Y_CONFIG.developer.phone}`}
            >
              <Phone size={18} />
              <span>{A3Y_CONFIG.developer.phone}</span>
            </a>
            <p className="contact-subtext">{A3Y_CONFIG.developer.note}</p>
          </div>

          <div className="engineering-highlights">
            <h4 className="highlights-title">Engineering Standards:</h4>
            <ul className="highlights-list">
              <li>&bull; Strict TypeScript types and clean component architecture</li>
              <li>&bull; Semantic HTML with accessible keyboard navigation</li>
              <li>&bull; Native video scroll-scrubbing with 2D static fallbacks</li>
              <li>&bull; Mobile-first responsive layouts without layout shifts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
