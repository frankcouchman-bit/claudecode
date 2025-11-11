import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | SEOScribe",
  description: "Learn about how SEOScribe uses cookies and similar technologies to provide and improve our services.",
}

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <h1>Cookie Policy</h1>
        <p className="lead">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <p>
          This Cookie Policy explains how SEOScribe ("we", "us", or "our") uses cookies and similar technologies
          when you visit our website at seoscribe.pro (the "Site").
        </p>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your device when you visit a website. They are widely
          used to make websites work more efficiently and provide information to website owners.
        </p>

        <h2>How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>

        <h3>1. Essential Cookies</h3>
        <p>
          These cookies are necessary for the Site to function properly. They enable core functionality such as:
        </p>
        <ul>
          <li>Authentication and account access</li>
          <li>Security and fraud prevention</li>
          <li>Session management</li>
          <li>Load balancing</li>
        </ul>
        <p>
          <strong>Cookies Used:</strong>
        </p>
        <ul>
          <li><code>seoscribe_access_token</code> - Stores your authentication session (localStorage)</li>
          <li><code>seoscribe_refresh_token</code> - Stores your refresh token for session renewal (localStorage)</li>
          <li><code>seoscribe_auth_type</code> - Stores authentication method (localStorage)</li>
          <li><code>seoscribe_quota</code> - Tracks your usage quota (localStorage)</li>
        </ul>

        <h3>2. Analytical Cookies</h3>
        <p>
          These cookies help us understand how visitors interact with our Site by collecting and reporting
          information anonymously. This helps us improve our services.
        </p>
        <ul>
          <li>Page views and navigation patterns</li>
          <li>Time spent on pages</li>
          <li>Error tracking and debugging</li>
        </ul>

        <h3>3. Functional Cookies</h3>
        <p>
          These cookies enable enhanced functionality and personalization:
        </p>
        <ul>
          <li>Remembering your preferences (theme, language)</li>
          <li>Saving your article drafts</li>
          <li>Remembering your settings</li>
        </ul>

        <h2>Third-Party Cookies</h2>
        <p>
          We use the following third-party services that may set cookies:
        </p>

        <h3>Stripe (Payment Processing)</h3>
        <p>
          When you make a payment, Stripe may set cookies to:
        </p>
        <ul>
          <li>Process your payment securely</li>
          <li>Prevent fraud</li>
          <li>Remember your payment information (if you choose)</li>
        </ul>
        <p>
          Learn more: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe Privacy Policy</a>
        </p>

        <h3>Supabase (Authentication)</h3>
        <p>
          Our authentication provider may set cookies to:
        </p>
        <ul>
          <li>Manage your login session</li>
          <li>Enable OAuth authentication</li>
          <li>Maintain security</li>
        </ul>

        <h2>Your Cookie Choices</h2>
        <p>
          You have several options for managing cookies:
        </p>

        <h3>Browser Settings</h3>
        <p>
          Most web browsers allow you to control cookies through their settings. You can:
        </p>
        <ul>
          <li>View what cookies are stored and delete them individually</li>
          <li>Block third-party cookies</li>
          <li>Block cookies from specific sites</li>
          <li>Block all cookies</li>
          <li>Delete all cookies when you close your browser</li>
        </ul>

        <p>
          <strong>Note:</strong> If you block essential cookies, you may not be able to use all features of our Site,
          including signing in and generating articles.
        </p>

        <h3>Browser-Specific Instructions</h3>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
          <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>

        <h2>LocalStorage and SessionStorage</h2>
        <p>
          In addition to cookies, we use browser localStorage and sessionStorage to:
        </p>
        <ul>
          <li>Store authentication tokens securely</li>
          <li>Remember your preferences across sessions</li>
          <li>Cache data for better performance</li>
          <li>Track usage quota locally</li>
        </ul>

        <h2>Do Not Track</h2>
        <p>
          Some browsers include a "Do Not Track" feature that signals websites that you do not want to be tracked.
          We respect Do Not Track signals and do not track users across third-party websites.
        </p>

        <h2>Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. We will notify you of any changes by posting the
          new Cookie Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about our use of cookies, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@seoscribe.pro</li>
          <li>Website: seoscribe.pro</li>
        </ul>

        <h2>Your Rights</h2>
        <p>
          Depending on your location, you may have certain rights regarding cookies:
        </p>
        <ul>
          <li><strong>EU/EEA Users:</strong> Under GDPR, you have the right to consent to non-essential cookies</li>
          <li><strong>California Users:</strong> Under CCPA, you have the right to opt-out of the sale of personal information</li>
          <li><strong>UK Users:</strong> Under UK GDPR, you have similar rights to EU users</li>
        </ul>

        <p>
          We do not sell your personal information to third parties.
        </p>
      </div>
    </div>
  )
}
