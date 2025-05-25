import {PaginationInfo} from './character.model';

export interface Location {
  id: string;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created: string;
}

export interface LocationsResponse {
  info: PaginationInfo;
  results: Location[];
}
