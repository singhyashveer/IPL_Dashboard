import { PointsTableEntry, Team } from '../types';

// Map team names to our Team objects
const teamMap: { [key: string]: Team } = {
  "Punjab Kings": { id: 1, name: 'Punjab Kings', shortName: 'PBKS', logo: 'https://scores.iplt20.com/ipl/teamlogos/PBKS.png' },
  "Royal Challengers Bengaluru": { id: 2, name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: 'https://scores.iplt20.com/ipl/teamlogos/RCB.png' },
  "Gujarat Titans": { id: 3, name: 'Gujarat Titans', shortName: 'GT', logo: 'https://scores.iplt20.com/ipl/teamlogos/GT.png' },
  "Mumbai Indians": { id: 4, name: 'Mumbai Indians', shortName: 'MI', logo: 'https://scores.iplt20.com/ipl/teamlogos/MI.png' },
  "Delhi Capitals": { id: 5, name: 'Delhi Capitals', shortName: 'DC', logo: 'https://scores.iplt20.com/ipl/teamlogos/DC.png' },
  "Sunrisers Hyderabad": { id: 6, name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: 'https://scores.iplt20.com/ipl/teamlogos/SRH.png' },
  "Lucknow Super Giants": { id: 7, name: 'Lucknow Super Giants', shortName: 'LSG', logo: 'https://scores.iplt20.com/ipl/teamlogos/LSG.png' },
  "Kolkata Knight Riders": { id: 8, name: 'Kolkata Knight Riders', shortName: 'KKR', logo: 'https://scores.iplt20.com/ipl/teamlogos/KKR.png' },
  "Rajasthan Royals": { id: 9, name: 'Rajasthan Royals', shortName: 'RR', logo: 'https://scores.iplt20.com/ipl/teamlogos/RR.png' },
  "Chennai Super Kings": { id: 10, name: 'Chennai Super Kings', shortName: 'CSK', logo: 'https://scores.iplt20.com/ipl/teamlogos/CSK.png' }
};

export async function fetchPointsTable(): Promise<PointsTableEntry[]> {
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
    return getDummyPointsTable();
  }
}

function transformPointsData(apiPoints: any[]): PointsTableEntry[] {
  return apiPoints.map((item, index) => {
    const team = teamMap[item.TeamName] || {
      id: index + 1,
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