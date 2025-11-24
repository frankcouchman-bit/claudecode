export default function Page() {
  return (
    <div className="container py-16 prose prose-slate max-w-4xl">
      <h1>Terms of Service</h1>
      <p className="lead">
        These Terms govern your use of SEOScribe’s website, dashboard, AI writer, and SEO tools. By creating an
        account or using the service, you agree to these terms.
      </p>

      <h2>Accounts & eligibility</h2>
      <ul>
        <li>You must be at least 16 years old to use SEOScribe.</li>
        <li>You are responsible for keeping login credentials secure.</li>
        <li>Plans and quotas (free, demo, Pro) are enforced per our published limits.</li>
      </ul>

      <h2>Acceptable use</h2>
      <ul>
        <li>No unlawful, infringing, or deceptive content.</li>
        <li>No misuse of APIs, scraping, or circumventing quotas.</li>
        <li>No attempts to inject unsafe code—responses are sanitized, but you remain responsible for what you publish.</li>
      </ul>

      <h2>Content and licenses</h2>
      <p>
        You retain rights to the prompts and drafts you create. You grant us a limited license to process and store content as
        needed to provide the service, improve quality, and comply with law. We may use anonymized data to enhance models and
        reliability.
      </p>

      <h2>Payments & billing</h2>
      <ul>
        <li>Subscriptions are billed via Stripe under the plan you select.</li>
        <li>Upgrades apply immediately; downgrades take effect at the next billing period.</li>
        <li>Fees are non-refundable except where required by law.</li>
      </ul>

      <h2>Service changes</h2>
      <p>
        We may update features, limits, or interfaces to improve stability and security. Material changes will be communicated
        in-app or via email. We may suspend or terminate accounts for violations.
      </p>

      <h2>Disclaimers</h2>
      <p>
        SEOScribe provides AI-generated content “as is”. We do not guarantee specific rankings or outcomes. You are responsible
        for reviewing drafts, verifying facts, and complying with applicable laws and platform policies.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, SEOScribe and its affiliates are not liable for indirect, incidental, special,
        consequential, or punitive damages, or for loss of profits, revenues, or data arising from your use of the service.
      </p>

      <h2>Termination</h2>
      <p>Either party may terminate at any time. Upon termination, access to the dashboard and tools will cease.</p>

      <h2>Governing law</h2>
      <p>These Terms are governed by applicable local law where SEOScribe is operated. Disputes will be handled in that venue.</p>

      <h2>Contact</h2>
      <p>For any questions, email <a href="mailto:legal@seoscribe.pro">legal@seoscribe.pro</a>.</p>

      <h2>Last updated</h2>
      <p>Updated for the current SEOScribe release to reflect AI generation, SEO tooling, and plan limits.</p>
    </div>
  )
}
