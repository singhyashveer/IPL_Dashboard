import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { MatchLink, MatchFilters, MatchFilterOptions, Team } from '../types';

export default function MatchesPage() {
  const router = useRouter();
  const [matchLinks, setMatchLinks] = useState<MatchLink[]>([]);
  const [filterOptions, setFilterOptions] = useState<MatchFilterOptions | null>(null);
  const [filters, setFilters] = useState<MatchFilters>({
    season: 2025,
    team: null,
    venue: null,
    type: 'men'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set initial filters from query parameters
    if (router.isReady) {
      const { season, team, venue, type } = router.query;
      setFilters({
        season: season ? parseInt(season as string) : 2025,
        team: team as string || null,
        venue: venue as string || null,
        type: (type as string) || 'men'
      });
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (router.isReady) {
      fetchFilterOptions();
      fetchMatchLinks();
    }
  }, [router.isReady, filters.season, filters.type]);

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/match-filters');
      if (response.ok) {
        const data = await response.json();
        setFilterOptions(data);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchMatchLinks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('season', filters.season.toString());
      params.append('type', filters.type);
      
      const response = await fetch(`/api/match-links?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch match links');
      
      const data = await response.json();
      setMatchLinks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching match links:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: keyof MatchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL query parameters
    const query: any = {};
    if (newFilters.season) query.season = newFilters.season;
    if (newFilters.team) query.team = newFilters.team;
    if (newFilters.venue) query.venue = newFilters.venue;
    if (newFilters.type) query.type = newFilters.type;
    
    router.push({
      pathname: '/matches',
      query
    }, undefined, { shallow: true });
  };

  const filteredMatches = matchLinks.filter(match => {
    if (filters.team && match.teamA.shortName !== filters.team && match.teamB.shortName !== filters.team) {
      return false;
    }
    if (filters.venue && match.venue !== filters.venue) {
      return false;
    }
    return true;
  });

  // Group matches by status for better organization
  const completedMatches = filteredMatches.filter(match => match.status === 'completed');
  const liveMatches = filteredMatches.filter(match => match.status === 'live');
  const upcomingMatches = filteredMatches.filter(match => match.status === 'upcoming');

  return (
    <Layout>
      <Head>
        <title>IPL Matches - IPL T20 Live Dashboard</title>
        <meta name="description" content="IPL T20 match schedule, results and filters" />
      </Head>

      <div className="w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IPL Matches</h1>
          {/* <p className="text-gray-600 mt-2">Schedule, results and advanced filtering</p> */}
        </div>

        {/* Filters Section */}
        {filterOptions && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Season Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                <select
                  value={filters.season}
                  onChange={(e) => updateFilter('season', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {filterOptions.seasons.map(season => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  {filterOptions.types.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Team Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                <select
                  value={filters.team || ''}
                  onChange={(e) => updateFilter('team', e.target.value || null)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Teams</option>
                  {filterOptions.teams.map(team => (
                    <option key={team.id} value={team.shortName}>{team.name}</option>
                  ))}
                </select>
              </div>

              {/* Venue Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                <select
                  value={filters.venue || ''}
                  onChange={(e) => updateFilter('venue', e.target.value || null)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Venues</option>
                  {filterOptions.venues.map(venue => (
                    <option key={venue} value={venue}>{venue}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.season && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Season: {filters.season}
                </span>
              )}
              {filters.type && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  Type: {filters.type}
                </span>
              )}
              {filters.team && (
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  Team: {filters.team}
                </span>
              )}
              {filters.venue && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                  Venue: {filters.venue}
                </span>
              )}
              {(filters.team || filters.venue) && (
                <button
                  onClick={() => {
                    updateFilter('team', null);
                    updateFilter('venue', null);
                  }}
                  className="text-red-600 text-xs hover:text-red-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredMatches.length} of {matchLinks.length} matches
            {filters.season && ` for ${filters.season} season`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading matches...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={fetchMatchLinks}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Live Matches */}
            {liveMatches.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  Live Matches
                  <span className="flex h-2 w-2 ml-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                </h2>
                <div className="grid gap-4">
                  {liveMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Matches */}
            {upcomingMatches.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Matches</h2>
                <div className="grid gap-4">
                  {upcomingMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Matches */}
            {completedMatches.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Matches</h2>
                <div className="grid gap-4">
                  {completedMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            )}

            {filteredMatches.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500">No matches found with the selected filters</p>
                <button
                  onClick={() => {
                    updateFilter('team', null);
                    updateFilter('venue', null);
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

// Match Card Component
function MatchCard({ match }: { match: MatchLink }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img src={match.teamA.logo} alt={match.teamA.name} className="w-10 h-10 mr-3" />
              <span className="font-semibold">{match.teamA.shortName}</span>
            </div>
            
            <div className="text-center mx-2">
              <div className="text-xs text-gray-500">{match.matchNumber}</div>
              <div className="font-bold text-lg">VS</div>
              <div className="text-xs text-gray-500">
                {new Date(match.date).toLocaleDateString('en-US', { 
                  day: 'numeric', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="flex items-center">
              <img src={match.teamB.logo} alt={match.teamB.name} className="w-10 h-10 mr-3" />
              <span className="font-semibold">{match.teamB.shortName}</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 mb-2">
            {match.venue}
          </div>
          
          {/* Show scores if available */}
          {(match.status === 'completed' || match.status === 'live') && (
            <div className="text-center mb-3">
              <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                <div>
                  {match.scoreA}/{match.wicketsA} 
                  {match.oversA && <span className="text-xs text-gray-500"> ({match.oversA} ov)</span>}
                </div>
                <div>
                  {match.scoreB}/{match.wicketsB}
                  {match.oversB && <span className="text-xs text-gray-500"> ({match.oversB} ov)</span>}
                </div>
              </div>
            </div>
          )}
          
          {match.result && (
            <div className="text-center">
              <p className="text-sm font-medium text-gray-800">{match.result}</p>
              {match.mom && (
                <p className="text-xs text-gray-600 mt-1">MOM: {match.mom}</p>
              )}
            </div>
          )}
          
          {match.toss && (
            <p className="text-xs text-gray-500 text-center mt-2">{match.toss}</p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-2 ${
            match.status === 'live' 
              ? 'bg-red-100 text-red-800' 
              : match.status === 'completed'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {match.status === 'live' ? 'LIVE' : match.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            {match.type.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}