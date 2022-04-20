import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearchedData, IData, IGetDataResult } from "../api";
import Slider from "../Components/Slider";

const Wrapper = styled.div`
  background-color: black;
  margin-top: 80px;
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

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading } = useQuery<IGetDataResult>(
    ["search", keyword],
    () => getSearchedData(keyword)
  );

  let movieResults: IData[] = [];
  let tvResults: IData[] = [];

  data?.results.map((item) => {
    if (item.media_type === "movie") {
      movieResults.push(item);
    } else if (item.media_type === "tv") {
      tvResults.push(item);
    }
  });

  return (
    <Wrapper>
      <SliderWrapper>
        <SliderTitle>Movie Results</SliderTitle>
        <Slider data={movieResults} kind={"movie"} category={""} />
      </SliderWrapper>
      <SliderWrapper>
        <SliderTitle>Tv Show Results</SliderTitle>
        <Slider data={tvResults} kind={"tv"} category={""} />
      </SliderWrapper>
    </Wrapper>
  );
}

export default Search;
