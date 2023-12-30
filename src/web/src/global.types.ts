export type UserType = {
   role: string;
   _id: string;
   username: string;
   email: string;
   password: string;
   Verified: boolean;
};

export type PostType = {
   Username: string;
   _id: string;
   UserID: string;
   postTitle: string;
   mapName: string;
   lineupLocation?: string;
   lineupDescription?: string;
   teamSide?: string;
   likes: string[];
   dislikes: string[];
   views: number;
   standingPosition: {
      public_id: string;
      asset_id: string;
   };
   aimingPosition: {
      public_id: string;
      asset_id: string;
   };
   landingPosition: {
      public_id: string;
      asset_id: string;
   };
   grenadeType: string;
   jumpThrow: string;
   game: string;
   valorantAgent: string;
   ability: string;
};

export type ValorantAgent = {
   status: number;
   data: {
      uuid: string;
      displayName: string;
      description: string;
      developerName: string;
      characterTags: string[];
      displayIcon: string;
      displayIconSmall: string;
      bustPortrait: string;
      fullPortrait: string;
      fullPortraitV2: string;
      killfeedPortrait: string;
      background: string;
      backgroundGradientColors: string[];
      assetPath: string;
      isFullPortraitRightFacing: boolean;
      isPlayableCharacter: boolean;
      isAvailableForTest: boolean;
      isBaseContent: boolean;
      role: {
         uuid: string;
         displayName: string;
         description: string;
         displayIcon: string;
         assetPath: string;
      };
      recruitmentData: {
         counterId: string;
         milestoneId: string;
         milestoneThreshold: number;
         useLevelVpCostOverride: boolean;
         levelVpCostOverride: number;
         startDate: Date;
         endDate: Date;
      };
      abilities: {
         slot: string;
         displayName: string;
         description: string;
         displayIcon: string;
         voiceLine: {
            minDuration: number;
            maxDuration: number;
            mediaList: {
               id: number;
               wwise: string;
               wave: string;
            }[];
         }[];
      }[];
   }[];
};

export type ValorantMaps = {
   status: number;
   data: {
      uuid: string;
      displayName: string;
      narrativeDescription: string;
      tacticalDescription: string;
      coordinates: string;
      displayIcon: string;
      listViewIcon: string;
      splash: string;
      assetPath: string;
      mapUrl: string;
      xMultiplier: number;
      yMultiplier: number;
      xScalarToAdd: number;
      yScalarToAdd: number;
      callouts: {
         regionName: string;
         superRegionName: string;
         location: {
            x: number;
            y: number;
         }[];
      }[];
   }[];
};
