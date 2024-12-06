import {useEffect, useContext, useState} from 'react';
import { AuthContext} from '../../App';
import { Layout } from '../../Components'

const RiotProfile = () => {
  const Auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [matchIds, setMatchIds] = useState<string[]>([]);

  const fetchData = async () => {
    const region = "na";
    const res = await fetch(`https://${region}.api.riotgames.com/val/match/v1/matchlists/by-puuid/${Auth?.puuid}`, {
      method: 'GET',
      headers: {
        // Use an API key that actually allows fetching to this endpoint
        'X-Riot-Token': process.env.RIOT_DEVELOPER_API_KEY || ""
      }
    });
    const resJson = await res.json();
    const newArray = resJson.data.map((matchObj:any) => matchObj.matchId);
    setMatchIds([...matchIds, ...newArray ])
    // use /val/match/v1/matches/{matchId} to get more in depth details of each match
  }

  useEffect(() => {
    // Check if signed in via RSO
    if (!Auth?.RSOAccessToken) {
      console.log("no rso access token");
      return;
    }

    setLoading(false);
    fetchData();
  }, [Auth])

  if (loading)
     return (
       <div>{'Loading...'}</div>
     );

  return (
    <Layout>
      <div className={'flex flex-col p-40 min-h-screen '}>
        <div className={'flex flex-row m-2 space-x-4'}>
          <img className={'rounded-full w-16 h-16'}
               src={`https://ui-avatars.com/api/?background=random&color=fff&name=${Auth?.gameName}`}/>
          <div>{'Overview'}</div>
          <div>{'Recent matches'}</div>
          <div>{`info: ${Auth?.gameName}#${Auth?.tagLine} ${Auth?.puuid}`}</div>
        </div>
        <div className={'animate-pulse'}>
          <div className={'h-3 m-2 bg-gray-400 rounded-full '} />
          <div className={'h-3 m-2 bg-gray-400 rounded-full  '} />
        </div>
      </div>
    </Layout>
  );
}

export default RiotProfile;
