import {useEffect, useContext, useState} from 'react';
import { AuthContext} from '../../App';
import { Layout } from '../../Components'

const RiotProfile = () => {
  const Auth = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if signed in via RSO
    if (!Auth?.RSOAccessToken) {
      console.log("no rso access token");
      return;
    }

    setLoading(false);
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
          <div>{'overview'}</div>
          <div>{'matches'}</div>
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
