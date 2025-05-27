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
  edited?: boolean;
}

export interface LocationReference {
  name: string;
  url: string;
}

export interface PaginationInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

export interface CharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: string | null;
  };
  results: Character[];
}

export interface CharacterFilters {
  page?: number;
  name?: string;
  species?: string;
  gender?: string;
  status?: string;
}


