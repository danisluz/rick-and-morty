import {PaginationInfo} from './character.model';

export interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface EpisodesResponse {
  info: PaginationInfo;
  results: Episode[];
}
