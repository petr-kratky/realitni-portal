import React, { useState } from "react";
import ItemsCarousel from "react-items-carousel";
import { ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Tooltip, Button } from "antd";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  thumbnail: {
    minHeight: 250,
    minWidth: 250,
    maxHeight: 250,
    maxWidth: 250,
    objectFit: "cover",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: ["center", "center"]
  },
});

const Galery = ({ images }) => {
  const classes = useStyles();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <ItemsCarousel
        infiniteLoop={false}
        gutter={15}
        activePosition={"center"}
        chevronWidth={60}
        disableSwipe={false}
        alwaysShowChevrons={false}
        numberOfCards={2}
        slidesToScroll={1}
        outsideChevron={true}
        showSlither={false}
        firstAndLastGutter={false}
        activeItemIndex={activeItemIndex}
        requestToChangeActive={setActiveItemIndex}
        rightChevron={
          <Tooltip title="Turn right">
            <Button shape="circle" icon={<ArrowRightOutlined />} />
          </Tooltip>
        }
        leftChevron={
          <Tooltip title="Turn left">
            <Button shape="circle" icon={<ArrowLeftOutlined />} />
          </Tooltip>
        }
        children={images.map((item, i) => (
          <div
            key={i}
            style={{
              width: '250px',
              // background: '#EEE',
              // display: 'flex',
              // alignItems: 'center',
              // justifyContent: 'center',
              // fontSize: '20px',
              // fontWeight: 'bold',
            }}
          >
            <img src={item} className={classes.thumbnail} />
          </div>
        ))}
      />
    </div>
  );
};

export default Galery;
