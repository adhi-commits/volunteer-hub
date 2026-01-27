import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const Landing: React.FC = () => {
  useAnimateOnScroll('.feature-card');
  useAnimateOnScroll('.campaign-card');
  useAnimateOnScroll('.ngo-card');

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-teal-500 to-teal-700 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center">
            <div className="inline-flex items-center bg-teal-400 bg-opacity-30 rounded-full px-4 py-2 mb-6">
              <span className="material-icons mr-2">auto_awesome</span>
              <span className="text-sm font-medium">Empowering Communities Together</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Connect, Collaborate,
              <br />
              <span className="text-teal-200">Create Change</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-teal-50 max-w-3xl mx-auto">
              Unite NGOs, volunteers, and donors on one powerful platform. Discover campaigns, register as a volunteer,
              track donations, and make a real difference in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition flex items-center shadow-lg"
              >
                Start Your Journey
                <span className="material-icons ml-2">arrow_forward</span>
              </Link>
              <Link
                to="/campaigns"
                className="bg-white bg-opacity-20 backdrop-blur text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-opacity-30 transition border border-white"
              >
                Explore Campaigns
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
            <div className="text-center bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
              <div className="flex justify-center mb-3">
                <span className="material-icons text-5xl">business</span>
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-teal-100">NGOs</div>
            </div>
            <div className="text-center bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
              <div className="flex justify-center mb-3">
                <span className="material-icons text-5xl">groups</span>
              </div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-teal-100">Volunteers</div>
            </div>
            <div className="text-center bg-white bg-opacity-10 backdrop-blur rounded-xl p-6">
              <div className="flex justify-center mb-3">
                <span className="material-icons text-5xl">favorite</span>
              </div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-teal-100">Lives Impacted</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Join our platform and start making a difference today</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition feature-card">
              <div className="bg-teal-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <span className="material-icons text-teal-600 text-3xl">campaign</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Browse Campaigns</h3>
              <p className="text-gray-600 mb-6">
                Discover meaningful campaigns from verified NGOs and find causes that resonate with your values.
              </p>
              <Link to="/campaigns" className="text-teal-600 font-semibold flex items-center hover:text-teal-700">
                Learn More
                <span className="material-icons ml-1">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition feature-card">
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <span className="material-icons text-orange-600 text-3xl">apartment</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Register as NGO</h3>
              <p className="text-gray-600 mb-6">
                Create your organization profile, launch campaigns, and connect with volunteers and donors worldwide.
              </p>
              <Link to="/register" className="text-teal-600 font-semibold flex items-center hover:text-teal-700">
                Learn More
                <span className="material-icons ml-1">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition feature-card">
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <span className="material-icons text-green-600 text-3xl">volunteer_activism</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Become a Volunteer</h3>
              <p className="text-gray-600 mb-6">
                Join a community of changemakers, participate in events, and earn certificates for your contributions.
              </p>
              <Link to="/register" className="text-teal-600 font-semibold flex items-center hover:text-teal-700">
                Learn More
                <span className="material-icons ml-1">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-1">
              <div className="bg-teal-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <span className="material-icons text-teal-600 text-3xl">verified</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Verified Organizations</h3>
              <p className="text-gray-600 text-lg mb-6">
                All NGOs on our platform are thoroughly verified to ensure transparency and trust.
              </p>
            </div>
            <div className="md:col-span-1">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <span className="material-icons text-blue-600 text-3xl">public</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Global Reach</h3>
              <p className="text-gray-600 text-lg mb-6">
                Connect with organizations and volunteers from around the world to maximize impact.
              </p>
            </div>
            <div className="md:col-span-1">
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <span className="material-icons text-purple-600 text-3xl">analytics</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Impact Tracking</h3>
              <p className="text-gray-600 text-lg mb-6">
                Track your volunteer hours, earn certificates, and see the real-world impact you create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center mb-6">
            <span className="material-icons text-6xl">favorite</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-10 text-teal-50 max-w-2xl mx-auto">
            Join thousands of changemakers who are transforming communities around the world. Whether you are an NGO,
            volunteer, or donor, there is a place for you here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center shadow-lg"
            >
              Start Your Journey
              <span className="material-icons ml-2">arrow_forward</span>
            </Link>
            <Link
              to="/campaigns"
              className="bg-white text-teal-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Explore Campaigns
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Landing;
