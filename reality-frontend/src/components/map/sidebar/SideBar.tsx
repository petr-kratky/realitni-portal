import React, { FunctionComponent, useEffect, useState } from "react";
import { createUseStyles } from "react-jss";
import { animated, useSpring } from "react-spring";

export const DEFAULT_WIDTH = 400;

type TSideBarProps = {
  toggleOpen: () => void;
  open: boolean;
  width?: number;
  offset?: number;
  classes?: {
    container?: string;
    content?: string;
  };
};

const useStyles = createUseStyles({
  fillerContainer: {
    height: "100vh",
  },
  sideBarContainer: {
    zIndex: 3,
    height: "100vh",
    boxSizing: "border-box",
    position: "absolute"
  },
  sideBarContent: {
    height: "100%",
    overflowY: "scroll",
    padding: 0,
    margin: 0
  },
  background: {
    backgroundColor: "#ffffff",
  },
  handle: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    right: -30,
    height: 70,
    borderLeft: [30, "solid", "#fbfbfb"],
    borderBottom: [15, "solid", "transparent"],
    "&:hover > img": {
      opacity: 0.8,
    },
  },
  handleIcon: {
    transition: "opacity 200ms",
    position: "absolute",
    top: 10,
    right: -3,
    opacity: 0.3,
    width: 36,
    height: 36,
  },
});

const SideBar: FunctionComponent<TSideBarProps> = (props) => {
  const classes = useStyles();

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);

  const sidebarWidth: number = props.width ?? DEFAULT_WIDTH;
  const offset: number = props.offset ?? 0;

  const initialPosition: string = isFirstRender
    ? `translateX(0px)`
    : `translateX(${-sidebarWidth}px)`;

  const [slideLeft, setSlideLeft] = useSpring(() => ({
    transform: initialPosition,
  }));
  const [flip, setFlip] = useSpring(() => ({ transform: "scale(1)" }));
  const [fillLeft, setFillLeft] = useSpring(() => ({
    minWidth: 0,
    config: { clamp: true },
  }));

  useEffect(() => {
    if (props.open) {
      setFlip({ transform: "scale(-1)" });
      setFillLeft({ minWidth: sidebarWidth - 3, delay: 30 });
      setSlideLeft({ transform: `translateX(0px)` });
    } else {
      setFlip({ transform: "scale(1)" });
      setFillLeft({ minWidth: 0, delay: 0 });
      setSlideLeft({ transform: `translateX(${-(sidebarWidth+offset)}px)` });
    }
  }, [props.open]);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return (
    <>
      <animated.div
        className={`${classes.sideBarContainer} ${classes.background} ${props.classes?.container}`}
        style={{
          width: sidebarWidth,
          ...slideLeft,
        }}
      >
        <div className={classes.handle} onClick={props.toggleOpen}>
          <animated.img
            src="/images/sidebar/arrow-right-24px.svg"
            className={classes.handleIcon}
            style={flip}
          />
        </div>
        <div className={`${classes.sideBarContent} ${props.classes?.content}`}>
          {props.children}
        </div>
      </animated.div>
    </>
  );
};

export default SideBar;
