import { NextApiRequest, NextApiResponse } from 'next';
import { TeamStats, Team } from '../../types';

const teams: Team[] = [
  { id: 1, name: 'Punjab Kings', shortName: 'PBKS', logo: 'https://scores.iplt20.com/ipl/teamlogos/PBKS.png' },
  { id: 2, name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: 'https://scores.iplt20.com/ipl/teamlogos/RCB.png' },
  { id: 3, name: 'Gujarat Titans', shortName: 'GT', logo: 'https://scores.iplt20.com/ipl/teamlogos/GT.png' },
  { id: 4, name: 'Mumbai Indians', shortName: 'MI', logo: 'https://scores.iplt20.com/ipl/teamlogos/MI.png' },
  { id: 5, name: 'Delhi Capitals', shortName: 'DC', logo: 'https://scores.iplt20.com/ipl/teamlogos/DC.png' },
  { id: 6, name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: 'https://scores.iplt20.com/ipl/teamlogos/SRH.png' },
  { id: 7, name: 'Lucknow Super Giants', shortName: 'LSG', logo: 'https://scores.iplt20.com/ipl/teamlogos/LSG.png' },
  { id: 8, name: 'Kolkata Knight Riders', shortName: 'KKR', logo: 'https://scores.iplt20.com/ipl/teamlogos/KKR.png' },
  { id: 9, name: 'Rajasthan Royals', shortName: 'RR', logo: 'https://scores.iplt20.com/ipl/teamlogos/RR.png' },
  { id: 10, name: 'Chennai Super Kings', shortName: 'CSK', logo: 'https://scores.iplt20.com/ipl/teamlogos/CSK.png' }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { season, type } = req.query;

  try {
    const teamStats: TeamStats[] = teams.map((team, index) => ({
      team: team,
      matches: 14,
      wins: 7 + Math.floor(Math.random() * 7),
      losses: 7 - Math.floor(Math.random() * 7),
      highestScore: 180 + Math.floor(Math.random() * 40),
      lowestScore: 120 + Math.floor(Math.random() * 30),
      averageScore: 150 + Math.floor(Math.random() * 20),
      runRate: 8 + Math.random() * 2
    }));

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(teamStats);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch team statistics' });
  }
}