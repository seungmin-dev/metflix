import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getAiringTodayTv,
  getLatestTv,
  getPopularTv,
  getTopRatedTv,
  IData,
  IGetDataResult,
} from "../api";
import { category, makeImagePath } from "../utils";
import Slider from "../Components/Slider";

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

function Tv() {
  const { data: latestTv, isLoading: latestLoading } = useQuery<IData>(
    ["tvs", "latest"],
    getLatestTv
  );

  const { data: airingTodayTv, isLoading: airingTodayLoading } =
    useQuery<IGetDataResult>(["tvs", "airingToday"], getAiringTodayTv);

  const airingTodayTvs = airingTodayLoading
    ? []
    : airingTodayTv
    ? airingTodayTv.results
    : [];

  const { data: popularTv, isLoading: popularLoading } =
    useQuery<IGetDataResult>(["tvs", "popular"], getPopularTv);

  const popularTvs = popularLoading ? [] : popularTv ? popularTv.results : [];

  const { data: topRatedTv, isLoading: topRatedLoading } =
    useQuery<IGetDataResult>(["tvs", "topRated"], getTopRatedTv);

  const topRatedTvs = topRatedLoading
    ? []
    : topRatedTv
    ? topRatedTv.results
    : [];

  return (
    <Wrapper>
      {latestLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(latestTv?.backdrop_path || "")}>
            <Title>{latestTv?.original_name}</Title>
            <Overview>{latestTv?.overview}</Overview>
          </Banner>
          <SliderWrapper>
            <SliderTitle>Airing Today</SliderTitle>
            <Slider
              data={airingTodayTvs}
              kind={"tv"}
              category={category.tv_airingToday}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>Popular</SliderTitle>
            <Slider
              data={popularTvs}
              kind={"tv"}
              category={category.tv_popular}
            />
          </SliderWrapper>
          <SliderWrapper>
            <SliderTitle>topRated</SliderTitle>
            <Slider
              data={topRatedTvs}
              kind={"tv"}
              category={category.tv_topRated}
            />
          </SliderWrapper>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
