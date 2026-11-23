/**
 * Launch Checklist & Blocker Status
 * 
 * Tracks unapproved items and operational prerequisites required before this
 * concept preview may be promoted to a live, indexed public site.
 */

export interface LaunchItem {
  id: string;
  category: 'legal' | 'backend' | 'assets' | 'contact' | 'seo';
  title: string;
  status: 'pending' | 'blocked' | 'ready';
  description: string;
  actionRequired: string;
}

export const LAUNCH_CHECKLIST: LaunchItem[] = [
  {
    id: "launch-01",
    category: "legal",
    title: "Client Concept & Brand Authorization",
    status: "pending",
    description: "Formal review and approval by Colors Events & Entertainment management of presentation, typography, and copy.",
    actionRequired: "Client sign-off on design system, scope statements, and remove 'Concept preview' badge.",
  },
  {
    id: "launch-02",
    category: "assets",
    title: "Physical Portfolio Asset Verification",
    status: "pending",
    description: "Replacement of intentional graphic vector placeholders with owner-approved high-resolution photos of claimed local work.",
    actionRequired: "Collect and verify image permissions for 6-12 high-resolution photos taken at local Kukatpally venues.",
  },
  {
    id: "launch-03",
    category: "backend",
    title: "Inquiry Transmission Backend & Storage",
    status: "pending",
    description: "Setup of secured serverless email handler (e.g. Resend / SendGrid) or direct CRM web-hook to deliver inquiries.",
    actionRequired: "Configure API secrets in production hosting and connect validated dispatch handler.",
  },
  {
    id: "launch-04",
    category: "legal",
    title: "Privacy Policy & Data Retention Terms",
    status: "pending",
    description: "Publish compliant privacy notice outlining customer phone number and inquiry detail handling.",
    actionRequired: "Draft privacy statement once real inquiry backend is connected.",
  },
  {
    id: "launch-05",
    category: "contact",
    title: "WhatsApp Business Channel Sign-off",
    status: "pending",
    description: "Verification whether the business operates an active WhatsApp Business number on +91 81868 37404.",
    actionRequired: "Switch 'whatsAppEnabled' flag to true once owner confirms support for chat inquiries.",
  },
  {
    id: "launch-06",
    category: "seo",
    title: "Search Engine Indexing Enablement",
    status: "blocked",
    description: "Removal of <meta name='robots' content='noindex, nofollow' /> and publication of sitemap.xml.",
    actionRequired: "Unblock only after items 01-05 are completed and client provides formal go-live date.",
  },
];
