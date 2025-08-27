import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import PlayerStatsComponent from '../components/PlayerStats';
import TeamStatsComponent from '../components/TeamStats';
import { PlayerStats, TeamStats, MatchFilterOptions } from '../types';

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'teams'>('batting');
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [filterOptions, setFilterOptions] = useState<MatchFilterOptions | null>(null);
  const [filters, setFilters] = useState({
    season: 2025,
    type: 'men'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFilterOptions();
    fetchStatsData();
  }, [filters.season, filters.type]);

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

  const fetchStatsData = async () => {
    try {
      setLoading(true);
      
      // Fetch player stats
      const playerResponse = await fetch(`/api/player-stats?season=${filters.season}&type=${filters.type}`);
      if (!playerResponse.ok) throw new Error('Failed to fetch player statistics');
      const playerData = await playerResponse.json();
      setPlayerStats(playerData);
      
      // Fetch team stats
      const teamResponse = await fetch(`/api/team-stats?season=${filters.season}&type=${filters.type}`);
      if (teamResponse.ok) {
        const teamData = await teamResponse.json();
        setTeamStats(teamData);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <Head>
        <title>IPL Statistics - IPL T20 Live Dashboard</title>
        <meta name="description" content="IPL T20 player and team statistics" />
      </Head>

      <div className="w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IPL Statistics</h1>
          <p className="text-gray-600 mt-2">Player and team performance metrics</p>
        </div>

        {/* Filters */}
        {filterOptions && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'batting' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('batting')}
          >
            Batting
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'bowling' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('bowling')}
          >
            Bowling
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'teams' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('teams')}
          >
            Team Stats
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading statistics...</span>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={fetchStatsData}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Batting Stats */}
            {activeTab === 'batting' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Top Run Scorers - {filters.season}</h2>
                </div>
                <PlayerStatsComponent stats={playerStats} type="batting" />
              </div>
            )}

            {/* Bowling Stats */}
            {activeTab === 'bowling' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Top Wicket Takers - {filters.season}</h2>
                </div>
                <PlayerStatsComponent stats={playerStats} type="bowling" />
              </div>
            )}

            {/* Team Stats */}
            {activeTab === 'teams' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Team Statistics - {filters.season}</h2>
                </div>
                <TeamStatsComponent stats={teamStats} />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}