import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getNowPlayingMovies, IData } from "../api";
import { makeImagePath } from "../utils";
import Detail from "./Detail";

const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
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

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const BoxVariants = {
  normal: {
    scale: 1,
    y: -50,
    transition: {
      type: "tween",
    },
  },
  hover: {
    xIndex: 99,
    scale: 1.3,
    transition: {
      delay: 0.5,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.6,
    },
  },
};

const offset = 6;

interface ISlider {
  data?: IData[];
  kind: string;
  category: string;
}

function Slider({ data, kind, category }: ISlider) {
  const history = useHistory();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (id: number, kind: string) => {
    history.push(`/${kind}/${id}`);
  };

  const itemMatch = useRouteMatch<{ movieId: string; tvId: string }>([
    "/movie/:movieId",
    "/tv/:tvId",
  ]);

  return (
    <>
      <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
        <Row
          variants={rowVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 1 }}
          key={index}
        >
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
                onClick={() => onBoxClicked(item.id, kind)}
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(item.backdrop_path || "", "w300")}
              >
                {item.id}
                {kind}
                {category}
                <Info variants={infoVariants}>
                  <h4>{item.title || item.original_name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
      </AnimatePresence>
      {itemMatch && (
        <Detail
          id={+itemMatch.params.movieId | +itemMatch.params.tvId}
          kind={kind}
          category={category}
        />
      )}
    </>
  );
}

export default Slider;
