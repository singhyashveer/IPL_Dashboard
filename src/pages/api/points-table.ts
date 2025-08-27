import { NextApiRequest, NextApiResponse } from 'next';
import { PointsTableEntry, Team } from '../../types';

// Map team names to our Team objects
const teamMap: { [key: string]: Team } = {
  "Punjab Kings": { id: 1, name: 'Punjab Kings', shortName: 'PBKS', logo: '/images/teams/pbks.png' },
  "Royal Challengers Bengaluru": { id: 2, name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: '/images/teams/rcb.png' },
  "Gujarat Titans": { id: 3, name: 'Gujarat Titans', shortName: 'GT', logo: '/images/teams/gt.png' },
  "Mumbai Indians": { id: 4, name: 'Mumbai Indians', shortName: 'MI', logo: '/images/teams/mi.png' },
  "Delhi Capitals": { id: 5, name: 'Delhi Capitals', shortName: 'DC', logo: '/images/teams/dc.png' },
  "Sunrisers Hyderabad": { id: 6, name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: '/images/teams/srh.png' },
  "Lucknow Super Giants": { id: 7, name: 'Lucknow Super Giants', shortName: 'LSG', logo: '/images/teams/lsg.png' },
  "Kolkata Knight Riders": { id: 8, name: 'Kolkata Knight Riders', shortName: 'KKR', logo: '/images/teams/kkr.png' },
  "Rajasthan Royals": { id: 9, name: 'Rajasthan Royals', shortName: 'RR', logo: '/images/teams/rr.png' },
  "Chennai Super Kings": { id: 10, name: 'Chennai Super Kings', shortName: 'CSK', logo: '/images/teams/csk.png' }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const pointsTable = await fetchPointsTable();
    
    // Set caching headers (5 minutes cache)
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json(pointsTable);
  } catch (error) {
    console.error('API Error:', error);
    // Fallback to dummy data
    const dummyData = getDummyPointsTable();
    res.status(200).json(dummyData);
  }
}

async function fetchPointsTable(): Promise<PointsTableEntry[]> {
  try {
    const response = await fetch(
      "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/203-groupstandings.js?ongroupstandings=_jqjsp&_1756261824494=",
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    
    // The API returns JSONP format, so we need to extract the JSON part
    const jsonpPrefix = 'ongroupstandings(';
    const jsonpSuffix = ');';
    
    if (text.startsWith(jsonpPrefix) && text.endsWith(jsonpSuffix)) {
      const jsonStr = text.slice(jsonpPrefix.length, -jsonpSuffix.length);
      const data = JSON.parse(jsonStr);
      
      return transformPointsData(data.points);
    } else {
      throw new Error('Invalid JSONP format');
    }
  } catch (error) {
    console.error('Error fetching points table:', error);
    throw error; // Re-throw to be handled by the caller
  }
}

function transformPointsData(apiPoints: any[]): PointsTableEntry[] {
  return apiPoints.map((item) => {
    const team = teamMap[item.TeamName] || {
      id: parseInt(item.TeamID),
      name: item.TeamName,
      shortName: item.TeamCode,
      logo: item.TeamLogo
    };

    return {
      position: parseInt(item.OrderNo),
      team,
      matches: parseInt(item.Matches),
      wins: parseInt(item.Wins),
      losses: parseInt(item.Loss),
      points: parseInt(item.Points),
      nrr: parseFloat(item.NetRunRate)
    };
  }).sort((a, b) => a.position - b.position);
}

// Fallback dummy data
function getDummyPointsTable(): PointsTableEntry[] {
  return Object.values(teamMap).map((team, index) => ({
    position: index + 1,
    team,
    matches: 14,
    wins: 9 - index,
    losses: 4 + index,
    points: (9 - index) * 2,
    nrr: (0.5 - index * 0.1)
  })).sort((a, b) => b.points - b.points || b.nrr - a.nrr)
    .map((entry, index) => ({ ...entry, position: index + 1 }));
}