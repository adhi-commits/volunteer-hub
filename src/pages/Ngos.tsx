import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { ngos } from '../data/ngos';
import type { Ngo } from '../types';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const categoryBadgeClass = (category: Ngo['category']) => {
  switch (category) {
    case 'Environment':
      return 'bg-teal-100 text-teal-700';
    case 'Education':
      return 'bg-blue-100 text-blue-700';
    case 'Healthcare':
      return 'bg-red-100 text-red-700';
    case 'Poverty':
      return 'bg-orange-100 text-orange-700';
    case 'Human Rights':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const Ngos: React.FC = () => {
  useAnimateOnScroll('.ngo-card');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const filtered = useMemo(
    () =>
      ngos.filter((ngo) => {
        const matchesSearch = ngo.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category ? ngo.category.toLowerCase() === category.toLowerCase() : true;
        return matchesSearch && matchesCategory;
      }),
    [search, category],
  );

  return (
    <Layout>
      <section className="pt-28 pb-12 bg-gradient-to-br from-teal-50 to-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Partner NGOs</h1>
          <p className="text-xl text-gray-600 mb-8">
            Explore verified organizations making a difference around the world
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <span className="material-icons absolute left-3 top-3 text-gray-400">search</span>
              <input
                type="text"
                id="searchNGO"
                placeholder="Search organizations..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="relative">
              <span className="material-icons absolute left-3 top-3 text-gray-400">filter_list</span>
              <select
                className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Poverty">Poverty</option>
                <option value="Human Rights">Human Rights</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {filtered.map((ngo) => (
              <div key={ngo.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition ngo-card">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${ngo.colorClass} w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold`}>
                      {ngo.name.charAt(0)}
                    </div>
                    {ngo.verified && (
                      <span className="flex items-center text-green-600 text-sm font-semibold">
                        <span className="material-icons text-sm mr-1">verified</span>Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{ngo.name}</h3>
                  <span
                    className={`inline-block ${categoryBadgeClass(ngo.category)} text-xs font-semibold px-3 py-1 rounded-full mb-4`}
                  >
                    {ngo.category}
                  </span>
                  <p className="text-gray-600 mb-4">{ngo.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <span className="material-icons text-sm mr-1">location_on</span>
                    {ngo.location}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center">
                      <span className="material-icons text-teal-600 mr-1">campaign</span>
                      <span className="text-sm font-semibold">{ngo.campaigns} Campaigns</span>
                    </div>
                    <div className="flex items-center">
                      <span className="material-icons text-teal-600 mr-1">group</span>
                      <span className="text-sm font-semibold">{ngo.volunteers} Volunteers</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ngos;
