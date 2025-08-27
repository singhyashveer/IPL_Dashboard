import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { ScrapedData, PlayerStats, TeamStats } from '../types';

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'teams'>('batting');
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scrape');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result: ScrapedData = await response.json();
      setPlayerStats(result.playerStats || []);
      setTeamStats(result.teamStats || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter batting and bowling stats
  const battingStats = playerStats.filter(player => player.runs > 0);
  const bowlingStats = playerStats.filter(player => player.wickets && player.wickets > 0);

  return (
    <Layout>
      <Head>
        <title>IPL Statistics - IPL T20 Live Dashboard</title>
        <meta name="description" content="IPL T20 player and team statistics" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">IPL Statistics</h1>
          <p className="text-gray-600 mt-2">Player and team performance metrics</p>
        </div>

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
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={fetchData}
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
                  <h2 className="text-xl font-semibold text-gray-800">Top Run Scorers</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Matches</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Runs</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Average</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SR</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">50s/100s</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {battingStats.slice(0, 10).map((stat, index) => (
                        <tr key={stat.player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={stat.player.image} alt={stat.player.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{stat.player.name}</div>
                                <div className="text-sm text-gray-500">{stat.player.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <img src={stat.player.team.logo} alt={stat.player.team.name} className="w-8 h-8 mx-auto" />
                            <div className="text-xs text-gray-500 mt-1">{stat.player.team.shortName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.matches}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">{stat.runs}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.average.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.strikeRate.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.fifties}/{stat.hundreds}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bowling Stats */}
            {activeTab === 'bowling' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Top Wicket Takers</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Matches</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Wickets</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Economy</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Best</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bowlingStats.slice(0, 10).map((stat, index) => (
                        <tr key={stat.player.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={stat.player.image} alt={stat.player.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{stat.player.name}</div>
                                <div className="text-sm text-gray-500">{stat.player.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <img src={stat.player.team.logo} alt={stat.player.team.name} className="w-8 h-8 mx-auto" />
                            <div className="text-xs text-gray-500 mt-1">{stat.player.team.shortName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.matches}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">{stat.wickets}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.economy?.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.bestBowling}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Team Stats */}
            {activeTab === 'teams' && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">Team Statistics</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Matches</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Wins</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Losses</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Score</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lowest Score</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Score</th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Run Rate</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teamStats.map((stat, index) => (
                        <tr key={stat.team.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10" src={stat.team.logo} alt={stat.team.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{stat.team.name}</div>
                                <div className="text-sm text-gray-500">{stat.team.shortName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.matches}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.wins}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.losses}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">{stat.highestScore}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.lowestScore}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.averageScore.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{stat.runRate.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}