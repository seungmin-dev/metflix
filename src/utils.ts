export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export enum category {
  "movie_nowPlaying" = "movie_nowPlaying",
  "movie_latest" = "movie_latest",
  "movie_topRated" = "movie_topRated",
  "movie_upcoming" = "movie_upcoming",
  "tv_airingToday" = "tv_airingToday",
  "tv_popular" = "tv_popular",
  "tv_topRated" = "tv_topRated",
}
