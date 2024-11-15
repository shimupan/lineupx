import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Adjusted scoring weights (total = 100%)
const WEIGHTS = {
   grenade: 0.35, // 35% for grenade type
   map: 0.25, // 25% for map
   teamSide: 0.18, // 18% for team side (CT/T)
   ratio: 0.05, // 5% for like/dislike ratio
   views: 0.05, // 5% for views
   comments: 0.05, // 5% for comments
   time: 0.07, // 7% for timestamp
};

// Base points for ranking
const POINTS_MAP = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1 };

const getData = () => {
   try {
      const filePath = path.join(__dirname, '..', 'data', 'CS2.json');
      return JSON.parse(fs.readFileSync(filePath));
   } catch (error) {
      console.error('Error reading file:', error);
      return null;
   }
};

// Safe number check
const safeNumber = (value) => {
   return isNaN(value) || value === undefined || value === null ? 0 : value;
};

// Calculate rankings for a given key
const calculateRankings = (data, key) => {
   const frequencies = new Map();
   data.forEach((entry) => {
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

// Calculate normalized score (0-1 range)
const normalizeValue = (value, max) => {
   const normalized = max === 0 ? 0 : value / max;
   return safeNumber(normalized);
};

// Calculate time-based score
const calculateTimeScore = (date, newestDate) => {
   if (!date || !newestDate) return 0;

   const MS_PER_MONTH = 2592000000; // 30 days in milliseconds
   const monthsDiff = (newestDate - date) / MS_PER_MONTH;
   const quartersPassed = Math.floor(monthsDiff / 3);
   const score = Math.max(0, 1 - quartersPassed * 0.14);
   return safeNumber(score);
};

// Calculate grenade type importance score
const getGrenadeTypeScore = (type) => {
   const scores = {
      smoke: 1.0, // Most Important for site takes/defense
      flash: 0.95, // Important for entry
      molotov: 0.9, // Highest value due to timing importance
      grenade: 0.85, // Damage utility
   };
   return scores[type?.toLowerCase()] || 0;
};

// Calculate team side score
const getTeamSideScore = (side) => {
   const scores = {
      CT: 1.0, // CT-side utility tends to be more valuable
      T: 0.9, // T-side utility still important but slightly less
   };
   return scores[side?.toUpperCase()] || 0;
};

const analyzeCS2Data = () => {
   const data = getData();
   if (!data) return;

   const limitedData = data.slice(0, 100);
   const trainingData = limitedData.slice(0, 23);

   // Calculate rankings
   const rankedMaps = calculateRankings(trainingData, 'mapName');
   const rankedGrenades = calculateRankings(trainingData, 'grenadeType');

   // Create lookup maps
   const mapScores = new Map(rankedMaps.map((map, i) => [map, POINTS_MAP[i]]));
   const grenadeScores = new Map(
      rankedGrenades.map((grenade, i) => [grenade, POINTS_MAP[i]]),
   );

   // Find maximum values for normalization
   const maxValues = limitedData.reduce(
      (acc, post) => ({
         views: Math.max(acc.views, safeNumber(post.views) || 0),
         comments: Math.max(
            acc.comments,
            safeNumber(post.comments?.length) || 0,
         ),
         ratio: Math.max(
            acc.ratio,
            safeNumber(
               (post.likes?.length || 0) / (post.dislikes?.length || 1),
            ),
         ),
         timestamp: Math.max(
            acc.timestamp,
            safeNumber(new Date(post.date?.$date).getTime()),
         ),
      }),
      { views: 0, comments: 0, ratio: 0, timestamp: 0 },
   );

   // Score posts
   const scoredPosts = limitedData.map((post) => {
      const mapName = post.mapName?.toLowerCase();
      const mapPoints = safeNumber((mapScores.get(mapName) || 0) / 5);
      const grenadePoints = safeNumber(
         (grenadeScores.get(post.grenadeType) || 0) / 5,
      );

      // Additional scoring factors
      const grenadeTypeScore = getGrenadeTypeScore(post.grenadeType);
      const teamSideScore = getTeamSideScore(post.teamSide);

      // Calculate engagement scores
      const likeRatio = safeNumber(
         (post.likes?.length || 0) / Math.max(1, post.dislikes?.length || 1),
      );
      const ratioScore = normalizeValue(likeRatio, maxValues.ratio);
      const viewScore = normalizeValue(safeNumber(post.views), maxValues.views);
      const commentScore = normalizeValue(
         safeNumber(post.comments?.length),
         maxValues.comments,
      );

      // Calculate time score
      const postDate = new Date(post.date?.$date).getTime();
      const timeScore = calculateTimeScore(postDate, maxValues.timestamp);

      // Calculate weighted scores
      const scores = {
         grenade: safeNumber(
            grenadePoints * grenadeTypeScore * WEIGHTS.grenade,
         ),
         map: safeNumber(mapPoints * WEIGHTS.map),
         teamSide: safeNumber(teamSideScore * WEIGHTS.teamSide),
         ratio: safeNumber(ratioScore * WEIGHTS.ratio),
         views: safeNumber(viewScore * WEIGHTS.views),
         comments: safeNumber(commentScore * WEIGHTS.comments),
         time: safeNumber(timeScore * WEIGHTS.time),
      };

      const totalScore = safeNumber(
         Object.values(scores).reduce((sum, score) => sum + score, 0),
      );

      return {
         id: post._id.$oid,
         mapName: post.mapName || 'Unknown',
         grenadeType: post.grenadeType || 'Unknown',
         teamSide: post.teamSide || 'Unknown',
         date: post.date?.$date,
         likes: post.likes?.length || 0,
         dislikes: post.dislikes?.length || 0,
         views: safeNumber(post.views),
         comments: safeNumber(post.comments?.length),
         scores,
         totalScore,
      };
   });

   // Sort posts with tiebreaker
   const topPosts = scoredPosts
      .sort((a, b) => {
         if (
            Math.abs(safeNumber(b.totalScore) - safeNumber(a.totalScore)) <
            0.001
         ) {
            // Tiebreaker: grenade type > map
            return safeNumber(b.scores.grenade) - safeNumber(a.scores.grenade);
         }
         return safeNumber(b.totalScore) - safeNumber(a.totalScore);
      })
      .slice(0, 3);

   return {
      rankings: { maps: rankedMaps, grenades: rankedGrenades },
      topPosts,
   };
};

// Display results
const results = analyzeCS2Data();
if (results) {
   console.log('Map Rankings:');
   results.rankings.maps.forEach((map, index) => {
      console.log(`${index + 1}. ${map || 'Unknown'}`);
   });

   console.log('\nGrenade Type Rankings:');
   results.rankings.grenades.forEach((grenade, index) => {
      console.log(`${index + 1}. ${grenade || 'Unknown'}`);
   });

   console.log('\nTop 3 Posts:');
   results.topPosts.forEach((post, index) => {
      console.log(`\n${index + 1}. Post ID: ${post.id}`);
      console.log(
         `   Grenade: ${post.grenadeType} (Score: ${post.scores.grenade.toFixed(3)})`,
      );
      console.log(
         `   Map: ${post.mapName} (Score: ${post.scores.map.toFixed(3)})`,
      );
      console.log(
         `   Team Side: ${post.teamSide} (Score: ${post.scores.teamSide.toFixed(3)})`,
      );
      console.log(`   Engagement Metrics:`);
      console.log(
         `     - Like Ratio: ${(post.likes / Math.max(1, post.dislikes)).toFixed(2)} (Score: ${post.scores.ratio.toFixed(3)})`,
      );
      console.log(
         `     - Views: ${post.views} (Score: ${post.scores.views.toFixed(3)})`,
      );
      console.log(
         `     - Comments: ${post.comments} (Score: ${post.scores.comments.toFixed(3)})`,
      );
      console.log(`     - Time Score: ${post.scores.time.toFixed(3)}`);
      console.log(`   Total Score: ${post.totalScore.toFixed(3)}`);
   });
}
