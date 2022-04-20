import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useParams, useRouteMatch } from "react-router";
import styled from "styled-components";
import { getDetailData, IData } from "../api";
import { makeImagePath } from "../utils";
import { useHistory } from "react-router-dom";
import { useQuery } from "react-query";

const BigCover = styled.div`
  width: 100%;
  height: 50%;
  background-size: 100% auto;
  background-position: center center;
  background-repeat: no-repeat;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 48px;
  position: relative;
  top: -50px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -70px;
  color: ${(props) => props.theme.white.lighter};
  line-height: 1.4;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
`;

const BigCard = styled(motion.div)`
  position: absolute;
  width: 60vw;
  height: 80vh;
  right: 0;
  left: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
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
  console.log("detail: ", data);

  return (
    <AnimatePresence>
      <>
        <Overlay
          onClick={onOverlayClick}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        <BigCard
          style={{
            top: scrollY.get() + 80,
          }}
          layoutId={id + "_" + kind + "_" + category}
        >
          {data && (
            <>
              <BigCover
                style={{
                  backgroundImage: `linear-gradient(to bottom,transparent, black), url(${makeImagePath(
                    data.backdrop_path
                  )})`,
                }}
              />
              <BigTitle>{data.title || data.original_name}</BigTitle>
              <BigOverview>{data.overview}</BigOverview>
            </>
          )}
        </BigCard>
      </>
      )
    </AnimatePresence>
  );
}

export default Detail;
