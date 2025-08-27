import { NextApiRequest, NextApiResponse } from 'next';
import { MatchLink, Team } from '../../types';

const teamMap: { [key: string]: Team } = {
  "Royal Challengers Bengaluru": { id: 2, name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: 'https://scores.iplt20.com/ipl/teamlogos/RCB.png' },
  "Punjab Kings": { id: 1, name: 'Punjab Kings', shortName: 'PBKS', logo: 'https://scores.iplt20.com/ipl/teamlogos/PBKS.png' },
  "Mumbai Indians": { id: 4, name: 'Mumbai Indians', shortName: 'MI', logo: 'https://scores.iplt20.com/ipl/teamlogos/MI.png' },
  "Chennai Super Kings": { id: 10, name: 'Chennai Super Kings', shortName: 'CSK', logo: 'https://scores.iplt20.com/ipl/teamlogos/CSK.png' },
  "Gujarat Titans": { id: 3, name: 'Gujarat Titans', shortName: 'GT', logo: 'https://scores.iplt20.com/ipl/teamlogos/GT.png' },
  "Delhi Capitals": { id: 5, name: 'Delhi Capitals', shortName: 'DC', logo: 'https://scores.iplt20.com/ipl/teamlogos/DC.png' },
  "Sunrisers Hyderabad": { id: 6, name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: 'https://scores.iplt20.com/ipl/teamlogos/SRH.png' },
  "Lucknow Super Giants": { id: 7, name: 'Lucknow Super Giants', shortName: 'LSG', logo: 'https://scores.iplt20.com/ipl/teamlogos/LSG.png' },
  "Kolkata Knight Riders": { id: 8, name: 'Kolkata Knight Riders', shortName: 'KKR', logo: 'https://scores.iplt20.com/ipl/teamlogos/KKR.png' },
  "Rajasthan Royals": { id: 9, name: 'Rajasthan Royals', shortName: 'RR', logo: 'https://scores.iplt20.com/ipl/teamlogos/RR.png' }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { season = '203', type = 'men' } = req.query;

  try {
    const matchLinks = await fetchMatchLinks(season as string, type as string);
    
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(matchLinks);
  } catch (error) {
    console.error('API Error:', error);
    const dummyData = getDummyMatchLinks(season as string, type as string);
    res.status(200).json(dummyData);
  }
}

async function fetchMatchLinks(season: string, type: string): Promise<MatchLink[]> {
  try {
    const response = await fetch(
      `https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/${season}-matchschedule.js?MatchSchedule=_jqjsp&_=${Date.now()}`,
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
    
    const jsonpPrefix = 'MatchSchedule(';
    const jsonpSuffix = ');';
    
    if (text.startsWith(jsonpPrefix) && text.endsWith(jsonpSuffix)) {
      const jsonStr = text.slice(jsonpPrefix.length, -jsonpSuffix.length);
      const data = JSON.parse(jsonStr);
      
      return transformMatchScheduleData(data.Matchsummary, season, type);
    } else {
      throw new Error('Invalid JSONP format');
    }
  } catch (error) {
    console.error('Error fetching match schedule:', error);
    throw error;
  }
}

function transformMatchScheduleData(matches: any[], season: string, type: string): MatchLink[] {
  return matches.map((match, index) => {
    const teamA = teamMap[match.FirstBattingTeamName] || {
      id: match.FirstBattingTeamID,
      name: match.FirstBattingTeamName,
      shortName: match.FirstBattingTeamCode,
      logo: match.MatchHomeTeamLogo || ''
    };

    const teamB = teamMap[match.SecondBattingTeamName] || {
      id: match.SecondBattingTeamID,
      name: match.SecondBattingTeamName,
      shortName: match.SecondBattingTeamCode,
      logo: match.MatchAwayTeamLogo || ''
    };


    let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
    if (match.MatchStatus === 'Post') {
      status = 'completed';
    } else if (match.MatchStatus === 'Live') {
      status = 'live';
    }

    let scoreA, scoreB, wicketsA, wicketsB, oversA, oversB;
    if (match.FirstBattingSummary) {
      const scoreParts = match.FirstBattingSummary.split('/');
      const overParts = scoreParts[1]?.match(/\((\d+\.\d+) Ov\)/);
      scoreA = parseInt(scoreParts[0]);
      wicketsA = parseInt(scoreParts[1]?.split(' ')[0]);
      oversA = overParts ? parseFloat(overParts[1]) : 20;
    }

    if (match.SecondBattingSummary) {
      const scoreParts = match.SecondBattingSummary.split('/');
      const overParts = scoreParts[1]?.match(/\((\d+\.\d+) Ov\)/);
      scoreB = parseInt(scoreParts[0]);
      wicketsB = parseInt(scoreParts[1]?.split(' ')[0]);
      oversB = overParts ? parseFloat(overParts[1]) : 20;
    }

    return {
      id: match.MatchID || index + 1,
      title: match.MatchName,
      date: match.MatchDate,
      time: match.MatchTime,
      teamA,
      teamB,
      venue: match.GroundName,
      season: parseInt(season),
      type,
      matchNumber: match.MatchOrder || `Match ${index + 1}`,
      result: match.Comments,
      status,
      scoreA,
      wicketsA,
      oversA,
      scoreB,
      wicketsB,
      oversB,
      mom: match.MOM,
      toss: match.TossDetails
    };
  }).sort((a, b) => {
    const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.time.localeCompare(b.time);
  });
}

function getDummyMatchLinks(season: string, type: string): MatchLink[] {
  const teams = Object.values(teamMap);
  const venues = [
    'Narendra Modi Stadium, Ahmedabad',
    'Wankhede Stadium, Mumbai',
    'M. Chinnaswamy Stadium, Bangalore',
    'Eden Gardens, Kolkata',
    'Arun Jaitley Stadium, Delhi'
  ];

  return Array.from({ length: 20 }, (_, index) => {
    const teamAIndex = index % teams.length;
    const teamBIndex = (index + 2) % teams.length;
    const matchDate = new Date(Date.now() + index * 86400000);
    
    return {
      id: index + 1,
      title: `${teams[teamAIndex].name} vs ${teams[teamBIndex].name}`,
      date: matchDate.toISOString().split('T')[0],
      time: '19:30',
      teamA: teams[teamAIndex],
      teamB: teams[teamBIndex],
      venue: venues[index % venues.length],
      season: parseInt(season),
      type,
      matchNumber: `Match ${index + 1}`,
      result: index % 3 === 0 ? `${teams[teamAIndex].shortName} won by ${index + 1} runs` : undefined,
      status: index % 4 === 0 ? 'completed' : index % 4 === 1 ? 'live' : 'upcoming'
    };
  });
}