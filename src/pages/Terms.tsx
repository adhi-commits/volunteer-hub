import React from 'react';
import Layout from '../components/Layout';

const Terms: React.FC = () => {
  return (
    <Layout>
      <section className="pt-28 pb-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8 md:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
            
            <div className="prose prose-teal max-w-none text-gray-700 space-y-6">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By registering as an organizer or volunteer on Volunteer Hub, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our platform.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">2. Organizer Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Accuracy of Information:</strong> You must provide truthful, accurate, and up-to-date information regarding your organization and campaigns.</li>
                <li><strong>Campaign Management:</strong> You are responsible for managing your campaigns, coordinating with volunteers, and reporting accurate volunteer hours and impact.</li>
                <li><strong>Safety and Compliance:</strong> You must ensure that all volunteering events comply with local laws and prioritize the safety and well-being of volunteers.</li>
                <li><strong>Data Privacy:</strong> You agree to protect the personal information of volunteers and only use their details for campaign coordination.</li>
                <li><strong>Non-Discrimination:</strong> Your campaigns must be inclusive and free from discrimination based on race, gender, religion, sexual orientation, or disability.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">3. Volunteer Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Commitment:</strong> You agree to honor the commitments you make when signing up for campaigns.</li>
                <li><strong>Code of Conduct:</strong> You must maintain a respectful, safe, and professional environment while participating in any campaign.</li>
              </ul>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">4. Platform Rules</h2>
              <p>
                Volunteer Hub reserves the right to suspend or terminate any accounts (both volunteer and organizer) that violate these terms, 
                post misleading campaigns, or engage in malicious or abusive behavior.
              </p>

              <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">5. Limitation of Liability</h2>
              <p>
                Volunteer Hub acts as a connecting platform. We are not liable for any injuries, damages, or disputes that may arise during or as a result of any campaign listed on the platform.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
