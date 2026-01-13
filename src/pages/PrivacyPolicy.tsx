import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - GXchange</title>
        <meta name="description" content="GXchange Privacy Policy - Learn how we collect, use, and protect your personal information." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 13, 2026</p>
            
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to GXchange ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our gift card exchange services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account.</li>
                  <li><strong>Transaction Information:</strong> Gift card details, payment information, Binance ID, PayPal email, and transaction history.</li>
                  <li><strong>Communication Data:</strong> Messages sent through our help center, contact forms, and customer support.</li>
                  <li><strong>Identity Verification:</strong> Government-issued ID and other documents for verification purposes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Process and complete your gift card transactions</li>
                  <li>Create and manage your user account</li>
                  <li>Send transaction confirmations and updates</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations and regulations</li>
                  <li>Improve our services and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">We may share your information in the following circumstances:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our platform and processing payments.</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulations.</li>
                  <li><strong>Fraud Prevention:</strong> To detect, prevent, or address fraud, security, or technical issues.</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your personal information for as long as your account is active or as needed to provide you services. We may also retain certain information to comply with legal obligations, resolve disputes, and enforce our agreements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Access, update, or delete your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand user preferences. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mt-4">
                  <li><strong>Email:</strong> privacy@gxchange.com</li>
                  <li><strong>Address:</strong> GXchange Headquarters, Lagos, Nigeria</li>
                </ul>
              </section>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
