import { NextApiRequest, NextApiResponse } from 'next';
import { PlayerStats, Player, Team } from '../../types';

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

const players: Player[] = [
  { id: 1, name: 'Virat Kohli', team: teams[1], role: 'Batsman', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Virat%20Kohli.png' },
  { id: 2, name: 'Rohit Sharma', team: teams[3], role: 'Batsman', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Rohit%20Sharma.png' },
  { id: 3, name: 'Jasprit Bumrah', team: teams[3], role: 'Bowler', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Jasprit%20Bumrah.png' },
  { id: 4, name: 'Ravindra Jadeja', team: teams[9], role: 'All-rounder', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Ravindra%20Jadeja.png' },
  { id: 5, name: 'KL Rahul', team: teams[6], role: 'Batsman', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/KL%20Rahul.png' },
  { id: 6, name: 'Rishabh Pant', team: teams[4], role: 'Wicketkeeper', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Rishabh%20Pant.png' },
  { id: 7, name: 'Hardik Pandya', team: teams[2], role: 'All-rounder', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Hardik%20Pandya.png' },
  { id: 8, name: 'Suryakumar Yadav', team: teams[3], role: 'Batsman', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Surya%20Kumar%20Yadav.png' },
  { id: 9, name: 'Jofra Archer', team: teams[3], role: 'Bowler', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Jofra%20Archer.png' },
  { id: 10, name: 'Ruturaj Gaikwad', team: teams[9], role: 'Batsman', image: 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/playerimages/Ruturaj%20Gaikwad.png' }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { season, type } = req.query;

  try {

    const playerStats: PlayerStats[] = players.map((player, index) => {
      const isBowler = player.role === 'Bowler' || player.role === 'All-rounder';
      const isBatsman = player.role === 'Batsman' || player.role === 'All-rounder' || player.role === 'Wicketkeeper';
      
      const battingStats = isBatsman ? {
        runs: 150 + Math.floor(Math.random() * 300),
        average: 25 + Math.floor(Math.random() * 30),
        strikeRate: 120 + Math.floor(Math.random() * 50),
        fifties: Math.floor(Math.random() * 5),
        hundreds: Math.floor(Math.random() * 2)
      } : {
        runs: 0,
        average: 0,
        strikeRate: 0,
        fifties: 0,
        hundreds: 0
      };
      
      const bowlingStats = isBowler ? {
        wickets: Math.floor(Math.random() * 20),
        economy: 6 + Math.random() * 4,
        bestBowling: `${Math.floor(Math.random() * 4)}/${Math.floor(Math.random() * 30)}`,
        strikeRate: 15 + Math.floor(Math.random() * 15)
      } : {
        wickets: 0,
        economy: 0,
        bestBowling: '-',
        strikeRate: 0
      };
      
      return {
        player: player,
        matches: 10 + Math.floor(Math.random() * 5),
        ...battingStats,
        ...bowlingStats
      };
    });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(playerStats);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch player statistics' });
  }
}