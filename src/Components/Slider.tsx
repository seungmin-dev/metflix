import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getNowPlayingMovies, IData } from "../api";
import { makeImagePath } from "../utils";
import Detail from "./Detail";

import {
  faPlay,
  faThumbsDown,
  faThumbsUp,
  faPlus,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: 50px 1fr 1fr 1fr 1fr 1fr 1fr 50px;
  position: absolute;
  width: 100%;
  height: 180px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  border-radius: 5px;
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Btn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled(motion.div)`
  border-radius: 0 0 5px 5px;
  padding: 20px 10px;
  background: linear-gradient(rgba(0, 0, 0, 0), 40%, rgba(0, 0, 0, 0.7));
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 14px;
  }
`;

const rowVariants = {
  hidden: (increasing: boolean) => ({
    x: increasing ? window.outerWidth + 10 : -window.outerWidth - 10,
  }),
  visible: {
    x: 0,
  },
  exit: (increasing: boolean) => ({
    x: increasing ? -window.outerWidth - 10 : window.outerWidth + 10,
  }),
};

const BoxVariants = {
  normal: {
    scale: 1,
    transition: {
      type: "tween",
    },
  },
  hover: {
    xIndex: 99,
    scale: 1.1,
    border: "1px solid #fff",
    boxShadow: "2px 2px 2px rgba(0,0,0,0.4)",
    transition: {
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {},
  },
};

const offset = 6;

interface ISlider {
  data?: IData[];
  kind: string;
  category: string;
  search?: boolean;
}

function Slider({ data, kind, category, search }: ISlider) {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [increasing, setIncreasing] = useState(true);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setIncreasing(true);
      const totalMovies = data.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setIncreasing(false);
      const totalMovies = data.length;
      const maxIndex = Math.floor(totalMovies / offset) + 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (id: number, kind: string, category: string) => {
    if (search) history.push(`search/${kind}/${id}`);
    else history.push(`/${kind}/${category}/${id}`);
  };

  const itemMatch = useRouteMatch<{
    kind: string;
    category: string;
    movieId: string;
    tvId: string;
  }>([
    "/search/:kind/:movieId",
    "/search/:kind/:tvId",
    "/:kind/:category/:movieId",
    "/:kind/:category/:tvId",
  ]);

  return (
    <>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={increasing}
      >
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          custom={increasing}
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
          <Btn onClick={decreaseIndex}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </Btn>
          {data
            ?.slice(1)
            .slice(offset * index, offset * index + offset)
            .map((item) => (
              <Box
                layoutId={item.id + "_" + kind + "_" + category}
                key={item.id}
                variants={BoxVariants}
                whileHover="hover"
                initial="normal"
                onClick={() => onBoxClicked(item.id, kind, category)}
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(item.backdrop_path || "", "w400")}
              >
                <Info variants={infoVariants}>
                  <h4>{item.title || item.original_name}</h4>
                </Info>
              </Box>
            ))}
          <Btn onClick={increaseIndex}>
            <FontAwesomeIcon icon={faChevronRight} />
          </Btn>
        </Row>
      </AnimatePresence>
      {itemMatch && (
        <Detail
          id={+itemMatch.params.movieId | +itemMatch.params.tvId}
          kind={itemMatch.params.kind}
          category={itemMatch.params.category}
        />
      )}
    </>
  );
}

export default Slider;
