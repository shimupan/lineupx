
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import useValorant from '../hooks/useValorant'; // Ensure this is the correct path
import { 
  isValidGame, 
  isValidValorantAgent, 
  isValidMap,
  isValidValorantMap,
} from './routeValidator';

type RouteParams = {
  game: string;
  agentName?: string;
  mapName?: string;
};

interface GameRouteValidatorProps {
  children: React.ReactNode | ((params: RouteParams) => React.ReactNode);
  type: 'game' | 'agent' | 'map' | 'agent-map';
}

const GameRouteValidator: React.FC<GameRouteValidatorProps> = ({ children, type }) => {
  const params = useParams();
  const { game = '', agentName, mapName } = params;
  const { allMaps, allAgents } = useValorant(); 

  console.log('Route Params:', { game, agentName, mapName });
  console.log('All Agents:', allAgents);
  console.log('All Maps:', allMaps);

  const isValid = React.useMemo(() => {
    switch (type) {
      case 'game':
        const gameValid = game && isValidGame(game);
        console.log('Game Valid:', gameValid);
        return gameValid;
      
      case 'agent':
        const agentValid = game === 'Valorant' && agentName && isValidValorantAgent(agentName, allAgents);
        console.log('Agent Valid:', agentValid);
        return agentValid;
      
      case 'map':
        const mapValid = game && mapName && isValidMap(game, mapName, allMaps);
        console.log('Map Valid:', mapValid);
        return mapValid;
      
      case 'agent-map':
        const agentMapValid = (
          game === 'Valorant' && 
          agentName && 
          mapName && 
          isValidValorantAgent(agentName, allAgents) && 
          isValidValorantMap(mapName, allMaps)
        );
        console.log('Agent-Map Valid:', agentMapValid);
        return agentMapValid;
      
      default:
        return false;
    }
  }, [type, game, agentName, mapName, allAgents, allMaps]);

  if (!isValid) {
    console.log('Validation failed, redirecting to 404');
    return <Navigate to="/*" replace />;
  }

  const validParams: RouteParams = {
    game,
    ...(agentName && { agentName }),
    ...(mapName && { mapName })
  };

  if (typeof children === 'function') {
    return <>{children(validParams)}</>;
  }

  return <>{children}</>;
};

export default GameRouteValidator;
