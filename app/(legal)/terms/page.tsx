import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | SEOScribe",
  description: "SEOScribe's Terms of Service - Read our terms and conditions for using our AI content generation platform.",
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1>Terms of Service</h1>
        <p className="lead">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <p>
          Welcome to SEOScribe. These Terms of Service ("Terms") govern your access to and use of seoscribe.pro
          (the "Site") and our services. By accessing or using SEOScribe, you agree to be bound by these Terms.
        </p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By creating an account, accessing, or using our services, you agree to:
        </p>
        <ul>
          <li>Comply with these Terms of Service</li>
          <li>Comply with our <Link href="/privacy">Privacy Policy</Link></li>
          <li>Comply with our <Link href="/cookies">Cookie Policy</Link></li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>
        <p>
          If you do not agree to these Terms, you may not use our services.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          SEOScribe is an AI-powered content generation platform that provides:
        </p>
        <ul>
          <li>AI-generated SEO-optimized articles</li>
          <li>Hero image generation</li>
          <li>SERP research and citations</li>
          <li>FAQ generation</li>
          <li>Social media post creation</li>
          <li>Content optimization tools</li>
          <li>25+ language support</li>
        </ul>

        <h2>3. Account Registration</h2>

        <h3>3.1 Eligibility</h3>
        <p>
          To use our services, you must:
        </p>
        <ul>
          <li>Be at least 13 years old (or 16 in the EU/EEA)</li>
          <li>Have the legal capacity to enter into a binding contract</li>
          <li>Provide accurate and complete registration information</li>
          <li>Not be prohibited from using our services under applicable laws</li>
        </ul>

        <h3>3.2 Account Security</h3>
        <p>
          You are responsible for:
        </p>
        <ul>
          <li>Maintaining the confidentiality of your account credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized access</li>
          <li>Not sharing your account with others</li>
        </ul>

        <h3>3.3 Authentication</h3>
        <p>
          You may create an account using:
        </p>
        <ul>
          <li>Email and magic link</li>
          <li>Google OAuth</li>
        </ul>
        <p>
          By using third-party authentication, you also agree to their terms of service.
        </p>

        <h2>4. Subscription Plans and Pricing</h2>

        <h3>4.1 Plan Types</h3>
        <p>We offer the following subscription plans:</p>

        <h4>Free Plan</h4>
        <ul>
          <li>1 article generation per day (31 per month)</li>
          <li>1 tool use per day</li>
          <li>All features included (AI images, citations, FAQs, social posts)</li>
          <li>25+ languages</li>
          <li>Export to HTML/Markdown</li>
        </ul>

        <h4>Pro Plan ($24/month)</h4>
        <ul>
          <li>15 article generations per day</li>
          <li>10 tool uses per day</li>
          <li>All features included</li>
          <li>Priority support</li>
          <li>Advanced analytics</li>
        </ul>

        <h3>4.2 Billing</h3>
        <ul>
          <li>Pro subscriptions are billed monthly via Stripe</li>
          <li>Payments are processed securely through Stripe</li>
          <li>All fees are in USD unless otherwise stated</li>
          <li>Prices are subject to change with 30 days notice</li>
        </ul>

        <h3>4.3 Refunds</h3>
        <ul>
          <li>We offer a 14-day money-back guarantee for Pro subscriptions</li>
          <li>Refunds are processed through Stripe within 5-10 business days</li>
          <li>To request a refund, contact support@seoscribe.pro</li>
          <li>No refunds for accounts terminated for Terms violations</li>
        </ul>

        <h3>4.4 Cancellation</h3>
        <ul>
          <li>You may cancel your subscription at any time</li>
          <li>Cancellations take effect at the end of your current billing period</li>
          <li>You retain access until the end of the paid period</li>
          <li>No partial refunds for cancellations mid-cycle</li>
        </ul>

        <h2>5. Usage Quotas and Limits</h2>

        <h3>5.1 Generation Limits</h3>
        <p>Your plan includes specific generation quotas:</p>
        <ul>
          <li><strong>Free Plan:</strong> 1 article per day, resets at midnight UTC</li>
          <li><strong>Pro Plan:</strong> 15 articles per day, resets at midnight UTC</li>
          <li><strong>Demo Users:</strong> Unlimited generations without account</li>
        </ul>

        <h3>5.2 Fair Use Policy</h3>
        <p>
          We reserve the right to limit or throttle usage that:
        </p>
        <ul>
          <li>Exceeds reasonable use patterns</li>
          <li>Impacts service performance for other users</li>
          <li>Involves automated scraping or bulk operations</li>
          <li>Violates these Terms or applicable laws</li>
        </ul>

        <h3>5.3 Word Count Limits</h3>
        <ul>
          <li>Articles are capped at 3,000 words for all users</li>
          <li>Backend enforces a maximum of 6,000 words</li>
          <li>Longer articles may require multiple generations</li>
        </ul>

        <h2>6. Acceptable Use Policy</h2>

        <h3>6.1 Prohibited Uses</h3>
        <p>You may NOT use our services to:</p>
        <ul>
          <li>Generate illegal, harmful, or hateful content</li>
          <li>Create spam, phishing, or fraudulent content</li>
          <li>Infringe on intellectual property rights</li>
          <li>Impersonate others or misrepresent affiliations</li>
          <li>Distribute malware or malicious code</li>
          <li>Harass, threaten, or abuse others</li>
          <li>Manipulate search engines through black-hat SEO</li>
          <li>Generate content for illegal activities</li>
          <li>Violate any applicable laws or regulations</li>
        </ul>

        <h3>6.2 Content Responsibility</h3>
        <p>You are solely responsible for:</p>
        <ul>
          <li>All content you generate using our service</li>
          <li>Ensuring generated content complies with laws</li>
          <li>Fact-checking and verifying AI-generated information</li>
          <li>Obtaining necessary permissions for published content</li>
          <li>Your use of citations and sources</li>
        </ul>

        <h2>7. Intellectual Property</h2>

        <h3>7.1 Our IP Rights</h3>
        <p>We retain all rights to:</p>
        <ul>
          <li>The SEOScribe platform and software</li>
          <li>Our brand, logos, and trademarks</li>
          <li>Our proprietary technology and algorithms</li>
          <li>Documentation and marketing materials</li>
        </ul>

        <h3>7.2 Your Content Rights</h3>
        <p>You retain ownership of content you generate, subject to:</p>
        <ul>
          <li>Our right to display it in your account</li>
          <li>Our right to use aggregated/anonymized data for improvements</li>
          <li>Our right to remove content that violates these Terms</li>
          <li>Third-party AI model provider terms (OpenRouter, Anthropic)</li>
        </ul>

        <h3>7.3 License to Use Service</h3>
        <p>
          We grant you a limited, non-exclusive, non-transferable license to use our services
          for their intended purpose while your account is active and in good standing.
        </p>

        <h2>8. AI-Generated Content Disclaimer</h2>

        <h3>8.1 Nature of AI Content</h3>
        <p>
          Our service uses AI models (Claude, GPT, etc.) to generate content. You acknowledge that:
        </p>
        <ul>
          <li>AI-generated content may contain errors or inaccuracies</li>
          <li>Citations and sources should be independently verified</li>
          <li>Content may occasionally be factually incorrect</li>
          <li>SEO scores are estimates, not guarantees</li>
          <li>Generated images may not perfectly match descriptions</li>
        </ul>

        <h3>8.2 No Warranty of Accuracy</h3>
        <p>
          We do not warrant that AI-generated content will be:
        </p>
        <ul>
          <li>Factually accurate or complete</li>
          <li>Original or non-infringing</li>
          <li>Suitable for your specific purpose</li>
          <li>Free from errors or omissions</li>
          <li>Up-to-date or current</li>
        </ul>

        <h2>9. Third-Party Services</h2>
        <p>
          Our service integrates with third-party providers:
        </p>
        <ul>
          <li><strong>Stripe:</strong> Payment processing</li>
          <li><strong>Supabase:</strong> Authentication and database</li>
          <li><strong>OpenRouter/Anthropic:</strong> AI models</li>
          <li><strong>Serper/Brave:</strong> Search APIs</li>
          <li><strong>Google:</strong> OAuth authentication</li>
        </ul>
        <p>
          Your use of these services is subject to their respective terms of service.
          We are not responsible for third-party service disruptions or changes.
        </p>

        <h2>10. Service Availability</h2>

        <h3>10.1 Uptime</h3>
        <p>
          We strive to maintain high availability but do not guarantee:
        </p>
        <ul>
          <li>Uninterrupted or error-free service</li>
          <li>100% uptime</li>
          <li>Specific response times</li>
        </ul>

        <h3>10.2 Maintenance</h3>
        <p>
          We may perform scheduled or emergency maintenance. We will:
        </p>
        <ul>
          <li>Provide advance notice when possible</li>
          <li>Minimize downtime</li>
          <li>Update status on the dashboard</li>
        </ul>

        <h3>10.3 Service Modifications</h3>
        <p>
          We reserve the right to:
        </p>
        <ul>
          <li>Modify or discontinue features</li>
          <li>Change pricing with 30 days notice</li>
          <li>Update quotas or limits</li>
          <li>Improve AI models and algorithms</li>
        </ul>

        <h2>11. Termination</h2>

        <h3>11.1 Termination by You</h3>
        <p>
          You may terminate your account at any time by:
        </p>
        <ul>
          <li>Canceling your subscription in account settings</li>
          <li>Contacting support@seoscribe.pro</li>
          <li>Deleting your account</li>
        </ul>

        <h3>11.2 Termination by Us</h3>
        <p>
          We may suspend or terminate your account if:
        </p>
        <ul>
          <li>You violate these Terms</li>
          <li>You engage in fraudulent activity</li>
          <li>Your payment method fails</li>
          <li>Required by law</li>
          <li>You abuse the service or other users</li>
        </ul>

        <h3>11.3 Effects of Termination</h3>
        <p>
          Upon termination:
        </p>
        <ul>
          <li>Your access to the service is immediately revoked</li>
          <li>You lose access to generated articles</li>
          <li>No refunds for time remaining on subscription</li>
          <li>We may delete your data after 90 days</li>
        </ul>

        <h2>12. Disclaimers and Warranties</h2>

        <h3>12.1 "AS IS" Service</h3>
        <p>
          OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
          EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul>
          <li>MERCHANTABILITY</li>
          <li>FITNESS FOR A PARTICULAR PURPOSE</li>
          <li>NON-INFRINGEMENT</li>
          <li>ACCURACY OR RELIABILITY</li>
          <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
        </ul>

        <h3>12.2 No Professional Advice</h3>
        <p>
          SEOScribe does not provide professional advice. Generated content should not be
          considered as legal, financial, medical, or other professional advice.
        </p>

        <h2>13. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SEOSCRIBE SHALL NOT BE LIABLE FOR:
        </p>
        <ul>
          <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
          <li>LOSS OF PROFITS, REVENUE, DATA, OR USE</li>
          <li>BUSINESS INTERRUPTION</li>
          <li>COST OF SUBSTITUTE SERVICES</li>
          <li>DAMAGES EXCEEDING THE AMOUNT PAID IN THE LAST 12 MONTHS (MAXIMUM $288)</li>
        </ul>
        <p>
          This limitation applies regardless of the legal theory (contract, tort, negligence, etc.)
          and even if we were advised of the possibility of such damages.
        </p>

        <h2>14. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless SEOScribe, its officers, directors, employees,
          and agents from any claims, damages, losses, liabilities, and expenses (including legal fees)
          arising from:
        </p>
        <ul>
          <li>Your use of our services</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of third parties</li>
          <li>Content you generate or publish</li>
        </ul>

        <h2>15. Dispute Resolution</h2>

        <h3>15.1 Governing Law</h3>
        <p>
          These Terms are governed by the laws of [Your Jurisdiction], without regard to
          conflict of law principles.
        </p>

        <h3>15.2 Arbitration</h3>
        <p>
          Any disputes shall be resolved through binding arbitration, except:
        </p>
        <ul>
          <li>Small claims court proceedings</li>
          <li>Intellectual property disputes</li>
          <li>Injunctive relief requests</li>
        </ul>

        <h3>15.3 Class Action Waiver</h3>
        <p>
          You agree to resolve disputes individually, not as part of a class action or
          representative proceeding.
        </p>

        <h2>16. General Provisions</h2>

        <h3>16.1 Entire Agreement</h3>
        <p>
          These Terms, together with our Privacy Policy and Cookie Policy, constitute the
          entire agreement between you and SEOScribe.
        </p>

        <h3>16.2 Severability</h3>
        <p>
          If any provision is found unenforceable, the remaining provisions remain in full effect.
        </p>

        <h3>16.3 No Waiver</h3>
        <p>
          Our failure to enforce any right or provision does not constitute a waiver of that right.
        </p>

        <h3>16.4 Assignment</h3>
        <p>
          You may not assign these Terms without our written consent. We may assign these Terms
          to any successor or affiliate.
        </p>

        <h3>16.5 Force Majeure</h3>
        <p>
          We are not liable for delays or failures due to circumstances beyond our reasonable control,
          including natural disasters, wars, pandemics, or third-party service outages.
        </p>

        <h2>17. Contact Information</h2>
        <p>
          For questions about these Terms, please contact:
        </p>
        <ul>
          <li><strong>Email:</strong> support@seoscribe.pro</li>
          <li><strong>Legal:</strong> legal@seoscribe.pro</li>
          <li><strong>Website:</strong> seoscribe.pro</li>
        </ul>

        <h2>18. Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. We will:
        </p>
        <ul>
          <li>Post the updated Terms on this page</li>
          <li>Update the "Last Updated" date</li>
          <li>Notify you via email for material changes</li>
          <li>Provide 30 days notice for significant changes</li>
        </ul>
        <p>
          Your continued use of the service after changes constitutes acceptance of the new Terms.
        </p>

        <h2>19. Survival</h2>
        <p>
          The following sections survive termination of these Terms:
        </p>
        <ul>
          <li>Intellectual Property (Section 7)</li>
          <li>Disclaimers and Warranties (Section 12)</li>
          <li>Limitation of Liability (Section 13)</li>
          <li>Indemnification (Section 14)</li>
          <li>Dispute Resolution (Section 15)</li>
        </ul>

        <p className="mt-8 p-4 bg-muted rounded-lg text-sm">
          <strong>By using SEOScribe, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
        </p>
      </div>
    </div>
  )
}
