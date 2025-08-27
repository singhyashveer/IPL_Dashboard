import { ScrapedData, Match, PointsTableEntry, Team, PlayerStats, TeamStats } from '../types';
import { fetchPointsTable } from './api';

// ... (keep your existing team data and other functions)

export async function scrapeIPLData(): Promise<ScrapedData> {
  try {
    // Use the API for points table
    const pointsTable = await fetchPointsTable();
    
    // For other data, keep your existing scraping logic or add more APIs
    const liveMatch = parseLiveMatch($);
    const upcomingMatches = parseUpcomingMatches($);
    const completedMatches = parseCompletedMatches($);
    const playerStats = parsePlayerStats($);
    const teamStats = parseTeamStats($);
    
    // Combine all matches for schedule
    const schedule = [...upcomingMatches, ...completedMatches, ...(liveMatch ? [liveMatch] : [])]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return {
      liveMatch,
      upcomingMatches,
      completedMatches,
      pointsTable, // Use the API data here
      schedule,
      playerStats,
      teamStats
    };
  } catch (error) {
    console.error('Scraping failed, using dummy data:', error);
    return getDummyData();
  }
}

// Update getDummyData to use the API function as fallback
async function getDummyData(): Promise<ScrapedData> {
  try {
    // Try to get real points table data even if other scraping fails
    const pointsTable = await fetchPointsTable();
    
    // ... rest of your dummy data generation
    const currentDate = new Date();
    
    // Generate upcoming matches
    const upcomingMatches: Match[] = [];
    for (let i = 1; i <= 5; i++) {
      // ... your existing code
    }
    
    // Generate completed matches
    const completedMatches: Match[] = [];
    for (let i = 1; i <= 7; i++) {
      // ... your existing code
    }
    
    // ... rest of your dummy data generation
    
    return {
      liveMatch: null,
      upcomingMatches,
      completedMatches,
      pointsTable, // Use the real API data
      schedule: [...upcomingMatches, ...completedMatches],
      playerStats: [],
      teamStats: []
    };
  } catch (error) {
    console.error('Even fallback API failed, using full dummy data:', error);
    return getFullDummyData();
  }
}

function getFullDummyData(): ScrapedData {
  // Your complete dummy data implementation as before
  // ...
}