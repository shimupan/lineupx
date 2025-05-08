import { useMemo } from 'react';
import { ValorantMaps } from '../global.types';

const EXCLUDED_MAPS = [
   'The Range',
   'Kasbah',
   'District',
   'Piazza',
   'Drift',
   'Basic Training',
   'Glitch',
] as const;

export default function useValorantMapFilter(
   maps: ValorantMaps['data'] | undefined,
) {
   const filteredMaps = useMemo(() => {
      if (!maps) return [];

      return maps.filter(
         (map) =>
            !EXCLUDED_MAPS.includes(
               map.displayName as (typeof EXCLUDED_MAPS)[number],
            ),
      );
   }, [maps]);

   const isExcludedMap = (mapName: string) => {
      return EXCLUDED_MAPS.includes(mapName as (typeof EXCLUDED_MAPS)[number]);
   };

   const getMapByName = (mapName: string) => {
      return filteredMaps.find((map) => map.displayName === mapName);
   };

   return {
      filteredMaps,
      isExcludedMap,
      getMapByName,
      EXCLUDED_MAPS,
   };
}
