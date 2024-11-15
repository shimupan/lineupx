export const allowedValorantAgents = [
   'gekko',
   'fade',
   'breach',
   'deadlock',
   'raze',
   'chamber',
   'kayo',
   'skye',
   'cypher',
   'sova',
   'killjoy',
   'harbor',
   'vyse',
   'viper',
   'phoenix',
   'astra',
   'brimstone',
   'iso',
   'clove',
   'neon',
   'yoru',
   'sage',
   'reyna',
   'omen',
   'jett',
].map((agent) => agent.toLowerCase());

export const allowedValorantMaps = [
   'Ascent',
   'Split',
   'Fracture',
   'Breeze',
   'Bind',
   'Haven',
   'Icebox',
   'Lotus',
   'Sunset',
   'Pearl',
   'Abyss'
];

export const allowedCS2Maps = [
   'Ancient',
   'Vertigo',
   'Mirage',
   'Anubis',
   'Dust 2',
   'Inferno',
   'Nuke',
   'Overpass',
];

export const isValidValorantAgent = (
   agentName: string | undefined,
): boolean => {
   if (!agentName) return false;
   return allowedValorantAgents.includes(agentName.toLowerCase());
};

export const isValidValorantMap = (mapName: string | undefined): boolean => {
   if (!mapName) return false;
   return allowedValorantMaps.includes(mapName);
};

export const isValidCS2Map = (mapName: string | undefined): boolean => {
   if (!mapName) return false;
   return allowedCS2Maps.includes(mapName);
};
