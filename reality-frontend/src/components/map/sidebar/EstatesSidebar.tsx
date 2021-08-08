import React, {
  CSSProperties,
  FunctionComponent,
  useState,
} from "react";

import SideBar, { DEFAULT_WIDTH } from "./SideBar";
import EstatesList from "./EstatesList";
import { createUseStyles } from "react-jss";
import SearchForm from "./SearchForm";
import { SwitchTransition, Transition } from "react-transition-group";

type TEstatesSidebarProps = {
  open: boolean;
  estates: string[];
  toggleOpen: () => void;
};

type TMenuTab = {
  iconSrc: string;
  style?: React.CSSProperties;
  action?: string;
};

const useStyles = createUseStyles({
  detailSliderContainer: {
    left: 65 + DEFAULT_WIDTH,
    backgroundColor: "#F9F9F9",
  },
  sidebarContainer: {
    left: 65,
  },
  sidebarContent: {
    display: "flex",
    flexFlow: "column",
    alignItems: "center",
    width: "100%",
  },
  menuBar: {
    zIndex: 10,
    height: "100vh",
    width: 65,
    minWidth: 65,
    position: "relative",
    backgroundColor: "#fbfbfb",
    borderRight: [1, "solid", "#e6e6e6"],
    display: "flex",
    flexDirection: "column",
  },
  menuItem: {
    cursor: "pointer",
    // borderBottom: [1, "solid", "#e6e6e6"],
    padding: [12, 0],
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "background-color 200ms",
    "&:hover > img": { opacity: 0.8 },
  },
  activeMenuItem: {
    backgroundColor: "#fff",
    "& > img": { opacity: 0.8 },
  },
  menuItemIcon: {
    width: 30,
    transition: "opacity 200ms",
    opacity: 0.3,
    margin: 0,
  },
  test: {
    height: "100vh",
    width: "800px",
    backgroundColor: "red",
  },
});

const EstatesSidebar: FunctionComponent<TEstatesSidebarProps> = ({ open, estates, toggleOpen, }) => {
  const classes = useStyles();

  const [activeTab, setActiveTab] = useState<number>(0);

  const handleTabChange = (tabIndex: number) => {
    if (!open) toggleOpen();
    if (open && activeTab == tabIndex) toggleOpen();
    setActiveTab(tabIndex);
  };

  const menuTabs: TMenuTab[] = [
    {
      iconSrc: "/images/map/search_icon.svg",
      style: { transform: "scale(-1, 1)" },
    },
    {
      iconSrc: "/images/sidebar/list-bulleted-24px.svg",
    },
    {
      iconSrc: "/images/sidebar/time-24px.svg",
    },
    {
      iconSrc: "/images/sidebar/plus-64.svg",
    },
  ];

  return (
    <>
      <div className={classes.menuBar}>
        {menuTabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => handleTabChange(index)}
            className={`${classes.menuItem} ${activeTab === index ? classes.activeMenuItem : "" }`}
          >
            <img
              className={classes.menuItemIcon}
              src={tab.iconSrc}
              style={tab.style}
            />
          </div>
        ))}
      </div>
      <SideBar
        open={open}
        toggleOpen={toggleOpen}
        classes={{
          container: classes.sidebarContainer,
          content: classes.sidebarContent,
        }}
      >
        <SwitchTransition>
          <Transition key={activeTab} timeout={175}>
            {(state) => {
              const transitionStyles: { [key: string]: CSSProperties } = {
                entering: { opacity: 0, transform: "translateY(-300px)" },
                entered: { opacity: 1, transform: "translateY(0)" },
                exiting: {
                  opacity: 0,
                  transform: "translateY(800px)",
                  transitionDuration: "500ms",
                },
                exited: {
                  opacity: 0,
                  transform: "translateY(800px)",
                  transitionDuration: "500ms",
                },
              };

              return (
                <div
                  style={{
                    width: "100%",
                    transitionDuration: "600ms",
                    transitionProperty: "opacity, transform",
                    transitionTimingFunction: "cubic-bezier(.32,1.08,.49,1.01)",
                    ...transitionStyles[state],
                  }}
                >
                  {activeTab === 0 && <SearchForm />}
                  {activeTab === 1 && (
                    <EstatesList estates={estates} />
                  )}
                  {activeTab === 2 && <div>recents section</div>}
                </div>
              );
            }}
          </Transition>
        </SwitchTransition>
      </SideBar>
    </>
  );
};

export default EstatesSidebar;
