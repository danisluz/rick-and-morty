/**
 * Represents a single character entity.
 */
export interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  image?: string;
  origin?: { name: string };
  location?: { name: string };
  episode?: string[];
  edited?: boolean; // Used to identify if the character was edited locally
}

/**
 * Reference to a location object, with name and URL.
 */
export interface LocationReference {
  name: string;
  url: string;
}

/**
 * Pagination information used in API responses.
 */
export interface PaginationInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

/**
 * Response structure for character API calls, including pagination.
 */
export interface CharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string | null;
  };
  results: Character[];
}

/**
 * Filters used when searching for characters.
 */
export interface CharacterFilters {
  page?: number;
  name?: string;
  species?: string;
  gender?: string;
  status?: string;
}
