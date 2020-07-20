import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadOutlined } from "@ant-design/icons";
const FieldUpload = (props) => {
  const getStyle:any = () => {
    // if(this.state.mouse){
      return {
        textAlign: "center",
        padding: "10px",
        fontSize: "12px",
        width: "100%",
        height: "200px",
        // borderWidth: "1px",
        // borderStyle: "dashed",
        // borderColor: "black",
        backgroundColor: "#f4f7fb",
        cursor: 'pointer',
        borderWidth: "1px",
        borderStyle: "dashed",
        borderColor: "black"
      }
    // }
    // else{
    //   return {
    //     textAlign: "center",
    //     padding: "100px",
    //     fontSize: "16px",
    //     width: "100%",
    //     height: "380px",
    //     borderWidth: "1px",
    //     borderStyle: "dashed",
    //     borderColor: "black",
    //     backgroundColor: "#f4f7fb"
    //   }
    // }
  }

  const getInfoTextStyle = () => {
    return {
      opacity: '0.5',
      color: '#002B38',
    }
  }

  const { setFieldValue, images } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ['image/*','application/pdf'],
    onDrop: (acceptedFiles) => {
      setFieldValue("images", images.concat(acceptedFiles));
    },
  });
  return (
    <div>
      <div style={getStyle()} {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p 
              style={
                {
              fontSize: "16px",
            }
            }>Choose file or drag it here</p><br/>
            <DownloadOutlined style={{
              fontSize: '64px',
            }}  />
            <p style={getInfoTextStyle()}>Supported document types:</p>
            <p style={getInfoTextStyle()}>.jpg, .png</p>  
      </div>
    </div>
  );
};

export default FieldUpload;
