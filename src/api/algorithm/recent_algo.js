import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse the JSON file
const getData = () => {
   try {
      const filePath = path.join(__dirname, '..', 'data', 'Valorant.json');
      const rawData = fs.readFileSync(filePath);
      return JSON.parse(rawData);
   } catch (error) {
      console.error('Error reading file:', error);
      return null;
   }
};

export default getData;

// Get frequencies of items in an array
const getFrequencies = (arr) => {
   return arr.reduce((acc, val) => {
      if (val) {
         acc[val] = (acc[val] || 0) + 1;
      }
      return acc;
   }, {});
};

// Get ranked items by frequency
const getRankedItems = (frequencies) => {
   return Object.entries(frequencies)
      .sort(([, a], [, b]) => b - a)
      .map(([item]) => item);
};

// Assign points based on ranking
const getPointsForRank = (rank) => {
   const pointsMap = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 };
   return pointsMap[rank] || 0;
};

// Calculate scores for all posts
const calculatePostScores = (allData, trainingData) => {
   // Get frequencies from training data
   const maps = trainingData.map((entry) => entry.mapName?.toLowerCase());
   const agents = trainingData.map((entry) => entry.valorantAgent);

   const mapFrequencies = getFrequencies(maps);
   const agentFrequencies = getFrequencies(agents);

   // Get ranked lists
   const rankedMaps = getRankedItems(mapFrequencies);
   const rankedAgents = getRankedItems(agentFrequencies);

   // Calculate scores for all posts
   return allData.map((post) => {
      let score = 0;

      // Add points based on map ranking
      const mapRank = rankedMaps.indexOf(post.mapName?.toLowerCase());
      if (mapRank >= 0 && mapRank < 5) {
         score += getPointsForRank(mapRank);
      }

      // Add points based on agent ranking
      const agentRank = rankedAgents.indexOf(post.valorantAgent);
      if (agentRank >= 0 && agentRank < 5) {
         score += getPointsForRank(agentRank);
      }

      return {
         id: post._id.$oid,
         mapName: post.mapName,
         valorantAgent: post.valorantAgent,
         score: score,
         mapPoints: mapRank >= 0 && mapRank < 5 ? getPointsForRank(mapRank) : 0,
         agentPoints:
            agentRank >= 0 && agentRank < 5 ? getPointsForRank(agentRank) : 0,
      };
   });
};

// Main analysis function
const analyzeValorantData = () => {
   const data = getData();
   if (!data) return;

   // Take first 100 entries
   const limitedData = data.slice(0, 100);

   // Take first 20 entries for training
   const trainingData = limitedData.slice(0, 70);

   // Calculate scores for all posts
   const scoredPosts = calculatePostScores(limitedData, trainingData);

   // Get top 3 posts by total score
   const topPosts = scoredPosts.sort((a, b) => b.score - a.score).slice(0, 3);

   // Get rankings for reference
   const maps = trainingData.map((entry) => entry.mapName?.toLowerCase());
   const agents = trainingData.map((entry) => entry.valorantAgent);

   return {
      rankings: {
         maps: getRankedItems(getFrequencies(maps)).slice(0, 5),
         agents: getRankedItems(getFrequencies(agents)).slice(0, 5),
      },
      topPosts: topPosts,
   };
};

// Run the analysis and display results
const results = analyzeValorantData();
if (results) {
   console.log('Map Rankings (5 to 1 points):');
   results.rankings.maps.forEach((map, index) => {
      console.log(`${index + 1}. ${map} (${getPointsForRank(index)} points)`);
   });

   console.log('\nAgent Rankings (5 to 1 points):');
   results.rankings.agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent} (${getPointsForRank(index)} points)`);
   });

   console.log('\nTop 3 Posts by Combined Score:');
   results.topPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. Post ID: ${post.id}`);
      console.log(`   Map: ${post.mapName} (${post.mapPoints} points)`);
      console.log(
         `   Agent: ${post.valorantAgent} (${post.agentPoints} points)`,
      );
      console.log(`   Total Score: ${post.score} points`);
   });
}

// Include like/dislike ratio + timestamps into scoring, make ratioed so old post with more likes can go above new posts
// Tie breakers: agents > maps

// agent, map, like/dislike ration, time stamp, views, comments
// 60% = agent + map
// 11% = like/dislike
// 11% = views
// 11% = comments
// 7% = timestamp (3 month interval = 1%)
