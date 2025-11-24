export default function Page() {
  return (
    <div className="container py-16 prose prose-slate max-w-4xl">
      <h1>Privacy Policy</h1>
      <p className="lead">
        This Privacy Policy explains how SEOScribe (“we”, “us”, “our”) collects, uses, shares, and safeguards
        your personal data when you use our website, dashboard, and AI writing tools.
      </p>

      <h2>Who we are & contact</h2>
      <p>
        SEOScribe is a content intelligence platform for creating, optimizing, and distributing SEO-ready articles.
        For any privacy questions, contact <a href="mailto:privacy@seoscribe.pro">privacy@seoscribe.pro</a>.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> email, name (if provided), authentication tokens, plan tier.</li>
        <li><strong>Usage data:</strong> article generation requests, tool usage counts, feature interactions, device and browser metadata.</li>
        <li><strong>Content data:</strong> topics, drafts, briefs, links you submit for research and interlinking.</li>
        <li><strong>Billing data:</strong> Stripe processes payments; we do not store full card numbers.</li>
        <li><strong>Telemetry:</strong> anonymized performance and error logs to keep the service reliable.</li>
      </ul>

      <h2>How we use data</h2>
      <ul>
        <li>Provide and improve AI-assisted writing, SEO tools, and usage analytics.</li>
        <li>Prevent abuse, enforce quotas, and secure access via tokens.</li>
        <li>Deliver product updates, receipts, and critical notices.</li>
        <li>Comply with legal requirements and protect platform integrity.</li>
      </ul>

      <h2>Lawful bases</h2>
      <p>
        We process data under GDPR legitimate interest (service operation and security), contract (providing the app you sign up for),
        and consent (where required for marketing or optional cookies).
      </p>

      <h2>Sharing & subprocessors</h2>
      <p>We share data only with trusted providers needed to run the service:</p>
      <ul>
        <li>Supabase for auth, profile storage, and article metadata.</li>
        <li>Stripe for payments and subscription management.</li>
        <li>AI model providers (Anthropic, OpenRouter) to fulfill generation requests you initiate.</li>
        <li>Analytics/error monitoring to maintain reliability.</li>
      </ul>
      <p>We never sell personal data.</p>

      <h2>Retention</h2>
      <p>
        Account and article data are retained while your account is active. You can request deletion; backups age out on a rolling basis.
        Billing records may be retained as required by law.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access, correction, export, or deletion of your data. You can also object to certain processing or withdraw consent.
        Contact <a href="mailto:privacy@seoscribe.pro">privacy@seoscribe.pro</a> to exercise these rights.
      </p>

      <h2>International transfers</h2>
      <p>
        Data may be processed in the US or EU using providers with appropriate safeguards (e.g., SCCs) to keep your information protected.
      </p>

      <h2>Security</h2>
      <p>
        We enforce HTTPS, access controls, and routine audits. AI responses are sanitized client-side before rendering to reduce injection risks.
      </p>

      <h2>Children</h2>
      <p>SEOScribe is not intended for children under 16. We do not knowingly collect data from minors.</p>

      <h2>Changes</h2>
      <p>
        We will update this policy as needed and reflect the latest revision date here. Material changes will be communicated in-app or via email.
      </p>

      <h2>Last updated</h2>
      <p>Updated for the current SEOScribe release to reflect AI, SEO tools, and quota enforcement features.</p>
    </div>
  )
}
