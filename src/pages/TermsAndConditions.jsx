import React from 'react';

const TermsAndConditions = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
        <div className="py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Terms and Conditions</h1>
          
          <div className="space-y-6 text-gray-700">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
              <p className="mb-4">
                Welcome to SolarTech Solutions. These Terms and Conditions govern your use of our services
                and website. By accessing or using our services, you agree to be bound by these terms.
              </p>
            </section>

            {/* Data Collection and Usage */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Data Collection and Usage</h2>
              <p className="mb-3">
                By using our services, you agree that SolarTech Solutions may collect and process your
                personal information, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Name and contact information</li>
                <li>Property address and details</li>
                <li>Energy consumption data</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            {/* Marketing Communications */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Marketing Communications</h2>
              <p className="mb-4">
                By accepting these terms, you explicitly consent to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Receive promotional materials about our solar products and services</li>
                <li>Be contacted by our representatives for follow-up consultations</li>
                <li>Receive updates about solar technology and energy solutions</li>
                <li>Participate in customer satisfaction surveys</li>
              </ul>
              <p className="mb-4 text-sm">
                You may opt out of marketing communications at any time by contacting our customer service
                or using the unsubscribe link in our emails.
              </p>
            </section>

            {/* Privacy and Data Protection */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Privacy and Data Protection</h2>
              <p className="mb-4">
                We are committed to protecting your privacy and handling your data in accordance with
                applicable data protection laws. Your information will:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Be stored securely and protected from unauthorized access</li>
                <li>Only be shared with authorized service partners</li>
                <li>Be retained only for as long as necessary</li>
                <li>Be handled in compliance with relevant privacy regulations</li>
              </ul>
            </section>

            {/* Service Communication */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Service Communication</h2>
              <p className="mb-4">
                We may contact you regarding:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Installation scheduling and updates</li>
                <li>Maintenance notifications</li>
                <li>System performance reports</li>
                <li>Safety and compliance information</li>
                <li>Account and billing matters</li>
              </ul>
            </section>

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Last updated: {currentYear} © SolarPaddy Solutions. All rights reserved.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;