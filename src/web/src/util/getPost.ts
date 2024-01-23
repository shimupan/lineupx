import { Coordinate, PostType } from "../global.types";
import axios from "axios";

export async function getPostByCoordinate(
   selectedDot: string,
   game: string,
): Promise<Coordinate[]> {
   try {
      let coords: Coordinate[] = [];
      const res = await axios.get(`/location/${game}/${selectedDot}`);
      res.data.forEach((post: PostType) => {
         let coord: Coordinate = {
            x: post.lineupPositionCoords.x,
            y: post.lineupPositionCoords.y,
            name: post.grenadeType,
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

export async function getPostByGrenade(
   grenadeType: string,
   game: string,
): Promise<Coordinate[]> {
   try {
      let coords: Coordinate[] = [];
      const res = await axios.get(`/grenade/${game}/${grenadeType}`);
      res.data.forEach((post: PostType) => {
         let coord: Coordinate = {
            x: post.lineupPositionCoords.x,
            y: post.lineupPositionCoords.y,
            name: post.grenadeType,
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