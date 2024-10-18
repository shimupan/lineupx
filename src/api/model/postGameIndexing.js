import mongoose from 'mongoose';
import PostDataSchema from './postData.js';

const allowedGames = ['Valorant', 'CS2'];
const gameModels = {};

allowedGames.forEach((game) => {
  const modelName = `PostData_${game}`;
  if (!mongoose.models[modelName]) {
    const schema = new mongoose.Schema(PostDataSchema.obj);

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

    gameModels[game] = mongoose.model(modelName, schema, game);
  } else {
    gameModels[game] = mongoose.model(modelName);
  }
});

export default gameModels;

