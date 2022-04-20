import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getLatestMovies,
  getNowPlayingMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  IGetDataResult,
} from "../api";
import { category, makeImagePath } from "../utils";
import Slider from "../Components/Slider";
import Detail from "../Components/Detail";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 62px;
  margin-bottom: 20px;
  margin-top: 200px;
`;

const Overview = styled.p`
  font-size: 22px;
  width: 50%;
`;

const SliderWrapper = styled.div`
  width: 100%;
  height: 300px;
`;

const SliderTitle = styled.h2`
  font-size: 24px;
  color: ${(props) => props.theme.white.lighter};
  position: relative;
  padding: 20px;
`;

function Home() {
  const { data: nowPlayingMovie, isLoading: nowPlayingLoading } =
    useQuery<IGetDataResult>(["movies", "nowPlaying"], getNowPlayingMovies);

  const nowPlayingMovies = nowPlayingLoading
    ? []
    : nowPlayingMovie
    ? nowPlayingMovie.results
    : [];

  const { data: latestMovie, isLoading: latestLoading } =
    useQuery<IGetDataResult>(["movies", "latest"], getLatestMovies);

  const latestMovies = latestLoading
    ? []
    : latestMovie
    ? latestMovie.results
    : [];

  const { data: topRatedMovie, isLoading: topRatedLoading } =
    useQuery<IGetDataResult>(["movies", "topRated"], getTopRatedMovies);

  const topRatedMovies = topRatedLoading
    ? []
    : topRatedMovie
    ? topRatedMovie.results
    : [];

  const { data: upcomingMovie, isLoading: upcomingLoading } =
    useQuery<IGetDataResult>(["movies", "upcoming"], getUpcomingMovies);

  const upcomingMovies = upcomingLoading
    ? []
    : upcomingMovie
    ? upcomingMovie.results
    : [];

  return (
    <Wrapper>
      {nowPlayingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(nowPlayingMovies[0].backdrop_path || "")}
          >
            <Title>{nowPlayingMovies[0].title}</Title>
            <Overview>{nowPlayingMovies[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <SliderTitle>Now Playing</SliderTitle>
            <Slider
              data={nowPlayingMovies}
              kind={"movie"}
              category={category.movie_nowPlaying}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>Latest</SliderTitle>
            <Slider
              data={latestMovies}
              kind={"movie"}
              category={category.movie_latest}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>Top Rated</SliderTitle>
            <Slider
              data={topRatedMovies}
              kind={"movie"}
              category={category.movie_topRated}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>Upcoming</SliderTitle>
            <Slider
              data={upcomingMovies}
              kind={"movie"}
              category={category.movie_upcoming}
            />
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
