import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Scoring weights (total = 100%)
const WEIGHTS = {
   agent: 0.48,    // 35% for agent
   map: 0.30,      // 25% for map
   ratio: 0.05,    // 11% for like/dislike ratio
   views: 0.05,    // 11% for views
   comments: 0.05, // 11% for comments
   time: 0.03      // 7% for timestamp
};

// Base points for ranking
const POINTS_MAP = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 };

const getData = () => {
   try {
      const filePath = path.join(__dirname, '..', 'data', 'Valorant.json');
      return JSON.parse(fs.readFileSync(filePath));
   } catch (error) {
      console.error('Error reading file:', error);
      return null;
   }
};

// Safe number check - returns 0 if NaN or undefined
const safeNumber = (value) => {
   return isNaN(value) || value === undefined || value === null ? 0 : value;
};

// Calculate rankings for a given key
const calculateRankings = (data, key) => {
   const frequencies = new Map();
   data.forEach(entry => {
      const value = key === 'mapName' ? entry[key]?.toLowerCase() : entry[key];
      if (value) {
         frequencies.set(value, (frequencies.get(value) || 0) + 1);
      }
   });

   return Array.from(frequencies)
       .sort(([, a], [, b]) => b - a)
       .slice(0, 5)
       .map(([item]) => item);
};

// Calculate normalized score (0-1 range) with NaN protection
const normalizeValue = (value, max) => {
   const normalized = max === 0 ? 0 : value / max;
   return safeNumber(normalized);
};

// Calculate time-based score with NaN protection
const calculateTimeScore = (timestamp, newestTimestamp) => {
   if (!timestamp || !newestTimestamp) return 0;

   const MS_PER_MONTH = 2592000000;
   const monthsDiff = (newestTimestamp - timestamp) / MS_PER_MONTH;
   const quartersPassed = Math.floor(monthsDiff / 3);
   const score = Math.max(0, 1 - (quartersPassed * 0.14));
   return safeNumber(score);
};

const analyzeValorantData = () => {
   const data = getData();
   if (!data) return;

   const limitedData = data.slice(0, 100);
   const trainingData = limitedData.slice(0, 23);

   // Calculate rankings once
   const rankedMaps = calculateRankings(trainingData, 'mapName');
   const rankedAgents = calculateRankings(trainingData, 'valorantAgent');

   // Create lookup maps for faster access
   const mapScores = new Map(rankedMaps.map((map, i) => [map, POINTS_MAP[i]]));
   const agentScores = new Map(rankedAgents.map((agent, i) => [agent, POINTS_MAP[i]]));

   // Find maximum values for normalization with NaN protection
   const maxValues = limitedData.reduce((acc, post) => ({
      views: Math.max(acc.views, safeNumber(post.views) || 0),
      comments: Math.max(acc.comments, safeNumber(post.comments) || 0),
      ratio: Math.max(acc.ratio, safeNumber((post.likes || 0) / (post.dislikes || 1))),
      timestamp: Math.max(acc.timestamp, safeNumber(new Date(post.timestamp).getTime()))
   }), { views: 0, comments: 0, ratio: 0, timestamp: 0 });

   // Score posts with NaN protection
   const scoredPosts = limitedData.map(post => {
      const mapName = post.mapName?.toLowerCase();
      const mapPoints = safeNumber((mapScores.get(mapName) || 0) / 5);
      const agentPoints = safeNumber((agentScores.get(post.valorantAgent) || 0) / 5);

      // Calculate normalized engagement scores
      const likeRatio = safeNumber((post.likes || 0) / Math.max(1, post.dislikes || 1));
      const ratioScore = normalizeValue(likeRatio, maxValues.ratio);
      const viewScore = normalizeValue(safeNumber(post.views), maxValues.views);
      const commentScore = normalizeValue(safeNumber(post.comments), maxValues.comments);

      // Calculate time score
      const postTimestamp = safeNumber(new Date(post.timestamp).getTime());
      const timeScore = calculateTimeScore(postTimestamp, maxValues.timestamp);

      // Calculate weighted total score with NaN protection for each component
      const scores = {
         agent: safeNumber(agentPoints * WEIGHTS.agent),
         map: safeNumber(mapPoints * WEIGHTS.map),
         ratio: safeNumber(ratioScore * WEIGHTS.ratio),
         views: safeNumber(viewScore * WEIGHTS.views),
         comments: safeNumber(commentScore * WEIGHTS.comments),
         time: safeNumber(timeScore * WEIGHTS.time)
      };

      const totalScore = safeNumber(Object.values(scores).reduce((sum, score) => sum + score, 0));

      return {
         id: post._id.$oid,
         mapName: post.mapName || 'Unknown',
         valorantAgent: post.valorantAgent || 'Unknown',
         timestamp: post.timestamp,
         likes: safeNumber(post.likes),
         dislikes: safeNumber(post.dislikes),
         views: safeNumber(post.views),
         comments: safeNumber(post.comments),
         scores,
         totalScore
      };
   });

   // Sort posts with tiebreaker and NaN protection
   const topPosts = scoredPosts
       .sort((a, b) => {
          if (Math.abs(safeNumber(b.totalScore) - safeNumber(a.totalScore)) < 0.001) {
             return safeNumber(b.scores.agent) - safeNumber(a.scores.agent);
          }
          return safeNumber(b.totalScore) - safeNumber(a.totalScore);
       })
       .slice(0, 3);

   return {
      rankings: { maps: rankedMaps, agents: rankedAgents },
      topPosts
   };
};

// Display results with NaN protection
const results = analyzeValorantData();
if (results) {
   console.log('Map Rankings:');
   results.rankings.maps.forEach((map, index) => {
      console.log(`${index + 1}. ${map || 'Unknown'}`);
   });

   console.log('\nAgent Rankings:');
   results.rankings.agents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent || 'Unknown'}`);
   });

   console.log('\nTop 3 Posts:');
   results.topPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. Post ID: ${post.id}`);
      console.log(`   Agent: ${post.valorantAgent} (Score: ${post.scores.agent.toFixed(3)})`);
      console.log(`   Map: ${post.mapName} (Score: ${post.scores.map.toFixed(3)})`);
      console.log(`   Engagement Metrics:`);
      console.log(`     - Like Ratio: ${(post.likes/Math.max(1, post.dislikes)).toFixed(2)} (Score: ${post.scores.ratio.toFixed(3)})`);
      console.log(`     - Views: ${post.views} (Score: ${post.scores.views.toFixed(3)})`);
      console.log(`     - Comments: ${post.comments} (Score: ${post.scores.comments.toFixed(3)})`);
      console.log(`     - Time Score: ${post.scores.time.toFixed(3)}`);
      console.log(`   Total Score: ${post.totalScore.toFixed(3)}`);
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

// ********* Problem with code: time stamp not working *********
