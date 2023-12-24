export type UserType = {
   _id: string;
   username: string;
   email: string;
   password: string;
   Verified: boolean;
};

export type PostType = {
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
};
