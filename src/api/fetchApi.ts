import { Dog, Match, SearchFilters, SearchResponse, Location, LocationSearchParams, LocationSearchResponse } from "../types";

const BASE_URL = "https://frontend-take-home-service.fetch.com";

async function login(name: string, email: string): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  return response.ok;
}

async function logout(): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return response.ok;
}

async function fetchBreeds(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/dogs/breeds`, {
    credentials: "include",
  });
  return response.json();
}

async function fetchDogs(
  filters: SearchFilters = {},
  page: number = 0,
  size: number = 25,
  sort: string = "breed:asc"
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  
  if (filters.breeds && filters.breeds.length > 0) {
    filters.breeds.forEach(breed => params.append("breeds", breed));
  }
  
  if (filters.zipCodes && filters.zipCodes.length > 0) {
    filters.zipCodes.forEach(zipCode => params.append("zipCodes", zipCode));
  }
  
  if (filters.ageMin !== undefined) {
    params.append("ageMin", filters.ageMin.toString());
  }
  
  if (filters.ageMax !== undefined) {
    params.append("ageMax", filters.ageMax.toString());
  }
  
  params.append("size", size.toString());
  params.append("from", (page * size).toString());
  params.append("sort", sort);

  const response = await fetch(`${BASE_URL}/dogs/search?${params.toString()}`, { 
    credentials: "include" 
  });
  return response.json();
}

async function fetchDogDetails(dogIds: string[]): Promise<Dog[]> {
  if (dogIds.length === 0) return [];
  
  const response = await fetch(`${BASE_URL}/dogs`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dogIds),
  });
  return response.json();
}

async function fetchMatch(dogIds: string[]): Promise<Match> {
  const response = await fetch(`${BASE_URL}/dogs/match`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dogIds),
  });
  return response.json();
}

async function fetchLocations(zipCodes: string[]): Promise<Location[]> {
  if (zipCodes.length === 0) return [];
  
  const response = await fetch(`${BASE_URL}/locations`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zipCodes),
  });
  return response.json();
}

async function searchLocations(params: LocationSearchParams): Promise<LocationSearchResponse> {
  const response = await fetch(`${BASE_URL}/locations/search`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return response.json();
}

export { 
  login, 
  logout, 
  fetchBreeds, 
  fetchDogs, 
  fetchDogDetails, 
  fetchMatch, 
  fetchLocations, 
  searchLocations 
};
