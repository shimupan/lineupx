import mongoose from 'mongoose';
import PostDataSchema from './postData.js';

const allowedGames = ['Valorant', 'CS2'];
const gameModels = {};

(async () => {
   for (const game of allowedGames) {
      const modelName = `PostData_${game}`;
      let schema;

      if (mongoose.models[modelName]) {
         schema = mongoose.models[modelName].schema;
      } else {
         schema = new mongoose.Schema(PostDataSchema.obj);

         if (game === 'CS2') {
            schema.index({
               postTitle: 'text',
               mapName: 'text',
               lineupLocation: 'text',
               grenadeType: 'text',
               lineupDescription: 'text',
               'lineupLocationCoords.name': 'text',
            });
         } else if (game === 'Valorant') {
            schema.index({
               postTitle: 'text',
               mapName: 'text',
               lineupLocation: 'text',
               valorantAgent: 'text',
               ability: 'text',
               lineupDescription: 'text',
               'lineupLocationCoords.name': 'text',
            });
         }
      }

      gameModels[game] =
         mongoose.models[modelName] || mongoose.model(modelName, schema, game);

      // Ensure indexes are synchronized
      await gameModels[game].syncIndexes();
   }
})();

export default gameModels;
