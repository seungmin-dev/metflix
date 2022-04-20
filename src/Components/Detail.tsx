import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useParams, useRouteMatch } from "react-router";
import styled from "styled-components";
import { getDetailData, IData } from "../api";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faHeart,
  faPlay,
  faPlayCircle,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

const DetailCard = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  right: 0;
  left: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const DetailCover = styled.div`
  width: 100%;
  height: 50%;
  background-size: auto 100%;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
`;

const DetailTagline = styled.h2`
  font-style: italic;
  text-align: center;
  font-weight: 600;
  font-size: 18px;
  background-color: ${(props) => props.theme.black.veryDark};
  line-height: 30px;
  padding: 10px 0;
`;

const DetailTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 40px;
  position: relative;
`;

const DetailOverview = styled.p`
  padding: 0 20px;
  position: relative;
  color: ${(props) => props.theme.white.darker};
  line-height: 1.5;
  font-size: 16px;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
`;

const BtnWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0%;
  padding: 10px;
  margin-bottom: 10px;
`;

const Btn = styled.span`
  background-color: ${(props) => props.theme.white.lighter};
  padding: 10px 15px;
  margin-right: 7px;
  border-radius: 5px;
  color: ${(props) => props.theme.black.lighter};
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.red};
    color: ${(props) => props.theme.white.lighter};
  }
`;

const VoteWrapper = styled.div`
  position: absolute;
  bottom: 0%;
  right: 0%;
  margin: 0 10px 10px 0;
  border-radius: 5px;
  box-sizing: border-box;
  border: 2px solid #fff;
  display: flex;
  flex-direction: column;
`;

const Vote = styled.span`
  background-color: ${(props) => props.theme.white.lighter};
  padding: 10px 15px;
  color: ${(props) => props.theme.black.lighter};
  text-align: center;
`;

interface IDetail {
  id: number;
  kind: string;
  category: string;
}

function Detail({ id, kind, category }: IDetail) {
  const history = useHistory();
  const onOverlayClick = () => {
    history.goBack();
  };
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IData>(["detail", id, kind], () =>
    getDetailData(id, kind)
  );

  return (
    <AnimatePresence>
      <>
        <Overlay
          onClick={onOverlayClick}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <DetailCard
          style={{
            top: scrollY.get() + 80,
            zIndex: 1000,
          }}
          layoutId={id + "_" + kind + "_" + category}
        >
          {data && (
            <>
              <DetailCover
                style={{
                  backgroundImage: `linear-gradient(to bottom,transparent, black), url(${makeImagePath(
                    data.backdrop_path
                  )})`,
                }}
              >
                <BtnWrapper>
                  <Btn>
                    <FontAwesomeIcon icon={faPlay} />
                    &nbsp;Play now
                  </Btn>
                  <Btn>
                    <FontAwesomeIcon icon={faHeart} />
                    &nbsp;Luv it
                  </Btn>
                  <Btn>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </Btn>
                  <Btn>
                    <FontAwesomeIcon icon={faThumbsDown} />
                  </Btn>
                </BtnWrapper>
                <VoteWrapper>
                  <Vote>
                    Vote
                    <br />
                    Avg
                  </Vote>
                  <Vote
                    style={{ backgroundColor: "transparent", color: "#fff" }}
                  >
                    {data.vote_average}
                  </Vote>
                </VoteWrapper>
              </DetailCover>
              {data.tagline && <DetailTagline>{data.tagline}</DetailTagline>}
              <DetailTitle>{data.title || data.original_name}</DetailTitle>
              <DetailOverview>{data.overview}</DetailOverview>
            </>
          )}
        </DetailCard>
      </>
      )
    </AnimatePresence>
  );
}

export default Detail;
