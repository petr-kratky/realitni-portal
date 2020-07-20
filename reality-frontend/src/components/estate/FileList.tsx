import React, { useState } from "react";
import ItemsCarousel from "react-items-carousel";
import { DownOutlined, DownloadOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Button, message, Tooltip } from "antd";

const FileList = ({ files }) => {
  const menu = (
    <Menu>
      {files?.map((item, i) => {
        const keyArr = item.key.split("/");
        return (
          <Menu.Item key="1" icon={<DownloadOutlined />}>
            <a style={{ textAlign: 'right' }}href={item.url}>{keyArr[keyArr.length - 1]}</a>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div style={{ width: '100%', color: 'white' }}>
    <Dropdown overlay={menu}>
      <Button>
        Pdf files <DownOutlined />
      </Button>
    </Dropdown>
    </div>
  );
};

export default FileList;
