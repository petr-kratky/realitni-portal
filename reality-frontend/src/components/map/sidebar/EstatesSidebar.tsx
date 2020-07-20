import React, {
  CSSProperties,
  FunctionComponent,
  useState,
  useEffect,
} from "react";

import ESTATE_MUTATION_CREATE from "../../../graphql/queries/user-management/estate/create";
import { useMutation } from "@apollo/react-hooks";
import SideBar, { DEFAULT_WIDTH } from "./SideBar";
import EstatesList from "./EstatesList";
import EstateCard from "./EstateCard";
import { createUseStyles } from "react-jss";
import SearchForm from "./SearchForm";
import { SwitchTransition, Transition } from "react-transition-group";
import Detail from "src/components/estate/Detail";

type TEstatesSidebarProps = {
  open: boolean;
  estates: number[];
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

const EstatesSidebar: FunctionComponent<TEstatesSidebarProps> = ({
  open,
  estates,
  toggleOpen,
}) => {
  const PlaceholderRender = () => (
    <span style={{ color: "#e3e3e3" }}>waiting for fill</span>
  );
  const classes = useStyles();
  const [estateCreate, { data, loading }] = useMutation(ESTATE_MUTATION_CREATE);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [visibilityDetail, setVisibilityDetail] = useState<boolean>(false);
  const [focusedEstate, setFocusedEstate] = useState<number | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedId, setUpdatedId] = useState<any>();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    if (!loading && data?.create) {
      const values = {
        images: []
      }
      setInitialValues(values)
      setFocusedEstate(data.create);
      setVisibilityDetail(true);
      setEditMode(true);
    }
  }, [data]);

  const menuTabsHandler = (tab, index) => (): void => {
    switch (tab.action) {
      case "TAB-CHANGE":
        handleTabChange(index);
        break;
      case "CREATE-ESTATE":
        estateCreate({
          variables: { localityLatitude: 0, localityLongitude: 0, sourceId: 3 },
        }); // sourceId = 3 means source for statikum
        break;
      default:
        break;
    }
  };
  const handleTabChange = (tabIndex: number) => {
    console.log("tabIndex", tabIndex);
    if (!open) toggleOpen();
    if (open && activeTab == tabIndex) toggleOpen();
    setActiveTab(tabIndex);
  };
  const showDetail = () => setVisibilityDetail(!visibilityDetail);

  const menuTabs: TMenuTab[] = [
    {
      iconSrc: "/images/map/search_icon.svg",
      style: { transform: "scale(-1, 1)" },
      action: "TAB-CHANGE",
    },
    {
      iconSrc: "/images/sidebar/list-bulleted-24px.svg",
      action: "TAB-CHANGE",
    },
    {
      iconSrc: "/images/sidebar/time-24px.svg",
      action: "TAB-CHANGE",
    },
    {
      iconSrc: "/images/sidebar/plus-64.svg",
      action: "CREATE-ESTATE",
    },
  ];

  const estateCardRender = (id, onChildDidLoad, transitionStyles) => (
    <EstateCard
      key={id}
      id={id}
      onLoad={onChildDidLoad}
      setVisibilityDetail={setVisibilityDetail}
      setFocusedEstate={setFocusedEstate}
      focusedEstate={focusedEstate}
      updatedId={updatedId}
      setUpdatedId={setUpdatedId}
      setEditMode={setEditMode}
      style={{
        transitionDuration: "400ms",
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(.32,1.08,.49,1.03)",
        ...transitionStyles,
      }}
      PlaceholderRender={PlaceholderRender}
    />
  );

  return (
    <>
      <div className={classes.menuBar}>
        {menuTabs.map((tab, index) => (
          <div
            key={index}
            onClick={menuTabsHandler(tab, index)}
            className={`${classes.menuItem} ${
              activeTab === index ? classes.activeMenuItem : ""
            }`}
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
                    <EstatesList
                      estates={estates}
                      estatesPerPage={12}
                      setVisibilityDetail={setVisibilityDetail}
                      setFocusedEstate={setFocusedEstate}
                      estateCardRender={estateCardRender}
                    />
                  )}
                  {activeTab === 2 && <div>recents section</div>}
                </div>
              );
            }}
          </Transition>
        </SwitchTransition>
      </SideBar>

      <SideBar
        open={visibilityDetail}
        toggleOpen={showDetail}
        offset={65 + DEFAULT_WIDTH}
        width={2 * DEFAULT_WIDTH}
        classes={{
          container: classes.detailSliderContainer,
          content: classes.sidebarContent,
        }}
      >
        {focusedEstate && (
          <Detail
            initialValues={initialValues}
            setInitialValues={setInitialValues}
            setUpdatedId={setUpdatedId}
            estateId={focusedEstate}
            setVisibilityDetail={setVisibilityDetail}
            PlaceholderRender={PlaceholderRender}
            setEditMode={setEditMode}
            editMode={editMode}
          />
        )}
      </SideBar>
    </>
  );
};

export default EstatesSidebar;
