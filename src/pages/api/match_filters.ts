import { NextApiRequest, NextApiResponse } from 'next';
import { MatchFilterOptions, Team } from '../../types';

const teams: Team[] = [
  { id: 1, name: 'Punjab Kings', shortName: 'PBKS', logo: '/images/teams/pbks.png' },
  { id: 2, name: 'Royal Challengers Bangalore', shortName: 'RCB', logo: '/images/teams/rcb.png' },
  { id: 3, name: 'Gujarat Titans', shortName: 'GT', logo: '/images/teams/gt.png' },
  { id: 4, name: 'Mumbai Indians', shortName: 'MI', logo: '/images/teams/mi.png' },
  { id: 5, name: 'Delhi Capitals', shortName: 'DC', logo: '/images/teams/dc.png' },
  { id: 6, name: 'Sunrisers Hyderabad', shortName: 'SRH', logo: '/images/teams/srh.png' },
  { id: 7, name: 'Lucknow Super Giants', shortName: 'LSG', logo: '/images/teams/lsg.png' },
  { id: 8, name: 'Kolkata Knight Riders', shortName: 'KKR', logo: '/images/teams/kkr.png' },
  { id: 9, name: 'Rajasthan Royals', shortName: 'RR', logo: '/images/teams/rr.png' },
  { id: 10, name: 'Chennai Super Kings', shortName: 'CSK', logo: '/images/teams/csk.png' }
];

const venues = [
  'Wankhede Stadium, Mumbai',
  'M. Chinnaswamy Stadium, Bangalore',
  'Eden Gardens, Kolkata',
  'Arun Jaitley Stadium, Delhi',
  'Narendra Modi Stadium, Ahmedabad',
  'MA Chidambaram Stadium, Chennai',
  'Rajiv Gandhi International Stadium, Hyderabad',
  'PCA Stadium, Mohali',
  'Sawai Mansingh Stadium, Jaipur',
  'BRSABV Ekana Cricket Stadium, Lucknow'
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const currentYear = new Date().getFullYear();
    const seasons = Array.from({ length: 5 }, (_, i) => currentYear - i);
    
    const filterOptions: MatchFilterOptions = {
      seasons,
      teams,
      venues,
      types: ['men', 'women']
    };
    
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).json(filterOptions);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
}