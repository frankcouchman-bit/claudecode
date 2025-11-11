import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | SEOScribe",
  description: "SEOScribe's Privacy Policy - Learn how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1>Privacy Policy</h1>
        <p className="lead">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <p>
          SEOScribe ("we", "us", or "our") operates seoscribe.pro (the "Site"). This Privacy Policy informs you
          of our policies regarding the collection, use, and disclosure of personal information when you use our Site
          and the choices you have associated with that data.
        </p>

        <h2>1. Information We Collect</h2>

        <h3>1.1 Information You Provide</h3>
        <p>When you use our services, we may collect the following information:</p>
        <ul>
          <li><strong>Account Information:</strong> Email address, name (if provided via Google OAuth), password (hashed)</li>
          <li><strong>Payment Information:</strong> Processed securely through Stripe (we do not store credit card details)</li>
          <li><strong>Content Data:</strong> Articles you generate, topics you search for, and preferences you set</li>
          <li><strong>Profile Information:</strong> Subscription plan, usage statistics, account settings</li>
        </ul>

        <h3>1.2 Automatically Collected Information</h3>
        <p>When you access our Site, we automatically collect:</p>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, features used, time spent on Site</li>
          <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
          <li><strong>Log Data:</strong> IP address, access times, error logs</li>
          <li><strong>Cookies:</strong> See our <Link href="/cookies">Cookie Policy</Link> for details</li>
        </ul>

        <h3>1.3 Third-Party Authentication</h3>
        <p>When you sign in with Google OAuth, we receive:</p>
        <ul>
          <li>Your email address</li>
          <li>Your name and profile picture (if permitted)</li>
          <li>A unique identifier from Google</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for:</p>

        <h3>2.1 Service Delivery</h3>
        <ul>
          <li>Creating and managing your account</li>
          <li>Generating AI content based on your requests</li>
          <li>Processing payments and subscriptions</li>
          <li>Providing customer support</li>
          <li>Enforcing quota limits (Free: 1/day, Pro: 15/day)</li>
        </ul>

        <h3>2.2 Service Improvement</h3>
        <ul>
          <li>Analyzing usage patterns to improve our AI models</li>
          <li>Debugging technical issues</li>
          <li>Developing new features</li>
          <li>Monitoring service performance</li>
        </ul>

        <h3>2.3 Communication</h3>
        <ul>
          <li>Sending transactional emails (password resets, payment confirmations)</li>
          <li>Providing customer support</li>
          <li>Sending service updates and announcements</li>
          <li>Marketing communications (only with your consent)</li>
        </ul>

        <h3>2.4 Legal Compliance</h3>
        <ul>
          <li>Complying with legal obligations</li>
          <li>Enforcing our Terms of Service</li>
          <li>Protecting against fraud and abuse</li>
          <li>Responding to legal requests</li>
        </ul>

        <h2>3. How We Share Your Information</h2>
        <p>We do not sell your personal information. We may share your information with:</p>

        <h3>3.1 Service Providers</h3>
        <ul>
          <li><strong>Cloudflare Workers:</strong> Hosting and serverless compute</li>
          <li><strong>Supabase:</strong> Authentication and database services</li>
          <li><strong>Stripe:</strong> Payment processing</li>
          <li><strong>OpenRouter/Anthropic:</strong> AI model inference</li>
          <li><strong>Serper/Brave:</strong> Search and research APIs</li>
        </ul>

        <h3>3.2 Legal Requirements</h3>
        <p>We may disclose your information if required by law or in response to:</p>
        <ul>
          <li>Court orders or subpoenas</li>
          <li>Government requests</li>
          <li>Legal proceedings</li>
          <li>Protection of our rights and safety</li>
        </ul>

        <h3>3.3 Business Transfers</h3>
        <p>
          In the event of a merger, acquisition, or sale of assets, your information may be transferred.
          We will notify you before your information becomes subject to a different privacy policy.
        </p>

        <h2>4. Data Storage and Security</h2>

        <h3>4.1 Data Storage</h3>
        <p>Your data is stored:</p>
        <ul>
          <li><strong>Authentication tokens:</strong> Browser localStorage (client-side)</li>
          <li><strong>Account data:</strong> Supabase PostgreSQL database (encrypted at rest)</li>
          <li><strong>Articles:</strong> Supabase database with encryption</li>
          <li><strong>Usage logs:</strong> Cloudflare Workers (retained for 30 days)</li>
        </ul>

        <h3>4.2 Security Measures</h3>
        <p>We implement industry-standard security measures:</p>
        <ul>
          <li>HTTPS/TLS encryption for all data in transit</li>
          <li>Encryption at rest for database storage</li>
          <li>Secure password hashing (bcrypt)</li>
          <li>Regular security audits</li>
          <li>Access controls and authentication</li>
          <li>Rate limiting and DDoS protection</li>
        </ul>

        <h3>4.3 Data Retention</h3>
        <ul>
          <li><strong>Account data:</strong> Retained while your account is active</li>
          <li><strong>Articles:</strong> Retained until you delete them</li>
          <li><strong>Usage logs:</strong> Retained for 90 days</li>
          <li><strong>Payment records:</strong> Retained for 7 years (legal requirement)</li>
        </ul>

        <h2>5. Your Rights and Choices</h2>

        <h3>5.1 Access and Control</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Update or correct your information</li>
          <li>Delete your account and associated data</li>
          <li>Export your data (articles, settings)</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h3>5.2 EU/EEA Users (GDPR)</h3>
        <p>If you are in the EU/EEA, you have additional rights:</p>
        <ul>
          <li><strong>Right to be forgotten:</strong> Request deletion of your data</li>
          <li><strong>Data portability:</strong> Receive your data in a structured format</li>
          <li><strong>Restriction of processing:</strong> Limit how we use your data</li>
          <li><strong>Object to processing:</strong> Opt-out of certain data uses</li>
          <li><strong>Withdraw consent:</strong> Revoke previously given consent</li>
          <li><strong>Lodge a complaint:</strong> Contact your local data protection authority</li>
        </ul>

        <h3>5.3 California Users (CCPA)</h3>
        <p>California residents have the right to:</p>
        <ul>
          <li>Know what personal information is collected</li>
          <li>Know if personal information is sold or disclosed</li>
          <li>Opt-out of the sale of personal information (we do not sell data)</li>
          <li>Request deletion of personal information</li>
          <li>Non-discrimination for exercising CCPA rights</li>
        </ul>

        <h3>5.4 Exercising Your Rights</h3>
        <p>To exercise any of these rights, please:</p>
        <ul>
          <li>Email us at privacy@seoscribe.pro</li>
          <li>Use the account settings page (for updates/deletions)</li>
          <li>Contact support through the dashboard</li>
        </ul>
        <p>We will respond within 30 days of receiving your request.</p>

        <h2>6. Children's Privacy</h2>
        <p>
          Our services are not intended for children under 13 years of age (or 16 in the EU/EEA). We do not
          knowingly collect personal information from children. If you are a parent or guardian and believe
          your child has provided us with personal information, please contact us immediately.
        </p>

        <h2>7. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. We ensure
          appropriate safeguards are in place:
        </p>
        <ul>
          <li>Standard Contractual Clauses (EU Commission approved)</li>
          <li>Privacy Shield Framework (where applicable)</li>
          <li>Data Processing Agreements with service providers</li>
        </ul>

        <h2>8. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies. For detailed information, please read our{' '}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>

        <h2>9. Third-Party Links</h2>
        <p>
          Our Site may contain links to third-party websites. We are not responsible for the privacy practices
          of these sites. We encourage you to read their privacy policies.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes by:
        </p>
        <ul>
          <li>Posting the new policy on this page</li>
          <li>Updating the "Last Updated" date</li>
          <li>Sending an email notification (for significant changes)</li>
          <li>Displaying a notice on the Site</li>
        </ul>

        <h2>11. Contact Us</h2>
        <p>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices,
          please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> privacy@seoscribe.pro</li>
          <li><strong>Website:</strong> seoscribe.pro</li>
          <li><strong>Data Protection Officer:</strong> dpo@seoscribe.pro</li>
        </ul>

        <h2>12. Legal Basis for Processing (GDPR)</h2>
        <p>We process your personal information under the following legal bases:</p>
        <ul>
          <li><strong>Contract:</strong> To provide services you've requested</li>
          <li><strong>Consent:</strong> For marketing communications and optional features</li>
          <li><strong>Legitimate interests:</strong> For service improvement and security</li>
          <li><strong>Legal obligation:</strong> To comply with applicable laws</li>
        </ul>

        <h2>13. Automated Decision Making</h2>
        <p>
          We use AI models to generate content based on your inputs. This is not used for automated
          decision-making that would significantly affect you legally or similarly. You always have
          control over the content generation process.
        </p>

        <h2>14. Your Consent</h2>
        <p>
          By using our Site, you consent to this Privacy Policy. If you do not agree with this policy,
          please do not use our services.
        </p>
      </div>
    </div>
  )
}
