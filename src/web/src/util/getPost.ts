import { Coordinate, PostType } from '../global.types';
import axios from 'axios';

export async function getPostByCoordinate(
   selectedDot: string,
   game: string,
   map: string,
   agent?: string,
): Promise<Coordinate[]> {
   try {
      let coords: Coordinate[] = [];
      const res =
         game === 'CS2'
            ? await axios.get(`/location/${map}/${game}/${selectedDot}`)
            : await axios.get(
                 `/location/${map}/${game}/${selectedDot}/${agent}`,
              );
      res.data.forEach((post: PostType) => {
         let coord: Coordinate = {
            x: post.lineupPositionCoords.x,
            y: post.lineupPositionCoords.y,
            name: post.grenadeType || post.ability,
            post: post,
         };
         coords.push(coord);
      });
      console.log(coords);
      return coords;
   } catch (error) {
      console.error(error);
      return [];
   }
}

export async function getPostByGrenade(
   grenadeType: string,
   game: string,
   map: string,
): Promise<Coordinate[]> {
   try {
      let coords: Coordinate[] = [];
      const encodedGrenadeType = encodeURIComponent(grenadeType);
      const res = await axios.get(
         `/grenade/${map}/${game}/${encodedGrenadeType}`,
      );
      res.data.forEach((post: PostType) => {
         let coord: Coordinate = {
            x: post.lineupPositionCoords.x,
            y: post.lineupPositionCoords.y,
            name: post.grenadeType || post.ability,
            post: post,
         };
         coords.push(coord);
      });
      return coords;
   } catch (error) {
      console.error(error);
      return [];
   }
}

export async function getPostByMap(
   game: string,
   map: string,
): Promise<Coordinate[]> {
   try {
      let coords: Coordinate[] = [];
      const res = await axios.get(`/post/${game}?map=${map}`);
      res.data.forEach((post: PostType) => {
         let coord: Coordinate = {
            x: post.lineupPositionCoords.x,
            y: post.lineupPositionCoords.y,
            name: post.grenadeType || post.ability,
            post: post,
         };
         coords.push(coord);
      });
      return coords;
   } catch (error) {
      console.error(error);
      return [];
   }
}
