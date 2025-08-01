import { useState, useMemo } from 'react';
import { GrantCard, Grant } from '../components/GrantCard';
import { GrantFilters, FilterState } from '../components/GrantFilters';
import { mockGrants } from '../data/mockGrants';
import { Search, TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'All Categories',
    status: 'All Status',
    location: 'All Locations',
    entity: 'All Entities'
  });

  const filteredGrants = useMemo(() => {
    return mockGrants.filter(grant => {
      const matchesSearch = searchTerm === '' || 
        grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.agency.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category === 'All Categories' || grant.category === filters.category;
      const matchesStatus = filters.status === 'All Status' || 
        (filters.status === 'Open' && grant.status === 'open') ||
        (filters.status === 'Closing Soon' && grant.status === 'soon') ||
        (filters.status === 'Closed' && grant.status === 'closed');
      const matchesLocation = filters.location === 'All Locations' || grant.location === filters.location;
      const matchesEntity = filters.entity === 'All Entities' || 
        grant.eligibleEntities.some(entity => entity === filters.entity.slice(0, -1)); // Remove 's' from plural

      return matchesSearch && matchesCategory && matchesStatus && matchesLocation && matchesEntity;
    });
  }, [searchTerm, filters]);

  const stats = useMemo(() => {
    const openGrants = mockGrants.filter(g => g.status === 'open').length;
    const totalFunding = mockGrants.reduce((sum, grant) => {
      const amount = grant.amount.match(/\d+/);
      return sum + (amount ? parseInt(amount[0]) : 0);
    }, 0);
    const closingSoon = mockGrants.filter(g => g.status === 'soon').length;

    return { openGrants, totalFunding, closingSoon };
  }, []);

  return (
    <div className="min-h-screen relative pt-16">
      {/* Background particles */}
      <div className="floating-particles"></div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover Your
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 bg-clip-text text-transparent">
              {" "}Perfect Grant
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Find, apply for, and track infrastructure grants tailored to your community's needs. 
            Join thousands of cities, counties, and agencies securing funding for critical projects.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.openGrants}</div>
            <div className="text-sm text-gray-400">Open Grants</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">${stats.totalFunding}M+</div>
            <div className="text-sm text-gray-400">Available Funding</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.closingSoon}</div>
            <div className="text-sm text-gray-400">Closing Soon</div>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white">2,500+</div>
            <div className="text-sm text-gray-400">Partner Cities</div>
          </div>
        </div>

        {/* Search and Filters */}
        <GrantFilters
          onSearchChange={setSearchTerm}
          onFilterChange={setFilters}
          searchValue={searchTerm}
          filters={filters}
        />

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Available Grants
            <span className="text-gray-400 text-base font-normal ml-2">
              ({filteredGrants.length} results)
            </span>
          </h2>
        </div>

        {/* Grants Grid */}
        {filteredGrants.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No grants found</h3>
            <p className="text-gray-400">Try adjusting your search criteria or filters to find more grants.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="glass-card p-8 mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Create your profile and let our AI assistant help you find grants that perfectly match your community's needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
              Start Grant Application
            </button>
            <button className="px-8 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/15 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
