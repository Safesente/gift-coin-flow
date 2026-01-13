import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const TermsOfService = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - GXchange</title>
        <meta name="description" content="GXchange Terms of Service - Read our terms and conditions for using our gift card exchange platform." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 py-12">
          <div className="container max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 13, 2026</p>
            
            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using GXchange ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services. These Terms constitute a legally binding agreement between you and GXchange.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  GXchange provides a platform for buying and selling gift cards. We facilitate transactions between users and provide a secure environment for gift card exchanges. Our services include gift card valuation, transaction processing, and customer support.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">To use our services, you must:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Be at least 18 years of age</li>
                  <li>Have the legal capacity to enter into binding contracts</li>
                  <li>Not be prohibited from using our services under applicable laws</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Account Registration</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You must create an account to access our services. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Gift Card Transactions</h2>
                <h3 className="text-xl font-medium mt-4 mb-2">5.1 Selling Gift Cards</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">When selling gift cards:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>You must be the rightful owner of the gift card</li>
                  <li>Gift cards must be valid, unused, and have the stated balance</li>
                  <li>You must provide accurate gift card information and proof of ownership</li>
                  <li>Payment will be processed after verification of the gift card</li>
                </ul>

                <h3 className="text-xl font-medium mt-6 mb-2">5.2 Buying Gift Cards</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">When buying gift cards:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Full payment is required before gift card delivery</li>
                  <li>Gift cards are delivered electronically</li>
                  <li>You are responsible for verifying the gift card upon receipt</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Payment Terms</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We accept payments via Binance (cryptocurrency) and PayPal. Payment processing times may vary depending on the payment method. All transactions are final once completed, except as provided in our refund policy.
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Binance payments are processed in USDT or other supported cryptocurrencies</li>
                  <li>PayPal payments are subject to PayPal's terms and conditions</li>
                  <li>Exchange rates are determined at the time of transaction</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">You agree not to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Use stolen, fraudulent, or unauthorized gift cards</li>
                  <li>Engage in money laundering or other illegal activities</li>
                  <li>Provide false or misleading information</li>
                  <li>Attempt to manipulate or abuse our platform</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Interfere with the proper functioning of the platform</li>
                  <li>Create multiple accounts for fraudulent purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Verification and Compliance</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may require identity verification to comply with anti-money laundering (AML) and know-your-customer (KYC) regulations. We reserve the right to refuse service, suspend accounts, or cancel transactions if we suspect fraudulent activity or non-compliance with these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Fees and Rates</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Exchange rates for gift cards are determined by GXchange and may vary based on card type, amount, and market conditions. All applicable fees will be disclosed before you complete a transaction. We reserve the right to modify our rates and fees at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Refunds and Disputes</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Due to the nature of gift card transactions, refunds are generally not available once a transaction is completed. However, we will investigate disputes and may issue refunds in cases of:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                  <li>Technical errors on our platform</li>
                  <li>Verified fraud or unauthorized transactions</li>
                  <li>Gift cards that were incorrectly processed</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on the Platform, including logos, text, graphics, and software, is the property of GXchange or its licensors and is protected by intellectual property laws. You may not use, reproduce, or distribute our content without prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To the maximum extent permitted by law, GXchange shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services. Our total liability shall not exceed the amount paid by you for the specific transaction in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">13. Indemnification</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to indemnify and hold harmless GXchange, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Platform, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">14. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to suspend or terminate your account at any time for any reason, including violation of these Terms. Upon termination, your right to use the Platform will immediately cease. Pending transactions may be cancelled, and any funds owed to you will be processed according to our policies.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">15. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of Lagos, Nigeria.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">16. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on the Platform. Your continued use of the Platform after changes are posted constitutes your acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">17. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us at:
                </p>
                <ul className="list-none text-muted-foreground space-y-2 mt-4">
                  <li><strong>Email:</strong> legal@gxchange.com</li>
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

export default TermsOfService;
