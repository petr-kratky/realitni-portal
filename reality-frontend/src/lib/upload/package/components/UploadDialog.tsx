import { ReactNode, FunctionComponent, useMemo, Fragment } from 'react';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import styled from 'styled-components';

export interface UploadDialogProps {
  StyledUploadLabel?: FunctionComponent,
  name: string,
  value?: FileList | null,
  styledUploadLabelText?: string,
  deleteLabel?: string,
  id?: string | number | any,
  multiple?: boolean,
  mutationFilesKey?: string,
  onChange?: (value: string | FileList | null) => void;
  setFieldValue: (name: string, value: any) => void,
  uploadOnChangeMutation?: (config: { [key: string]: any }) => void,
}

const Wrapper = styled.div`
label>* {
  pointer-events: none;
}
`

const UploadInput = styled.input`
  width: 0.1;
  opacity: 0;
  height: 0.1;
  overflow: hidden;
  position: absolute;
  z-index: -100000000;
`

const UploadDialog = ({
  name,
  id,
  deleteLabel = "Delete",
  multiple,
  StyledUploadLabel,
  onChange,
  uploadOnChangeMutation,
  value,
  setFieldValue,
  mutationFilesKey = 'fileInput',
  styledUploadLabelText,
}: UploadDialogProps) => {

  const RenderLabelAnInput = useMemo(() => {
    const inputProps = {
      id: id || name,
      name,
      multiple,
      type: 'file',
      onChange: ({
        target: {
          files,
        },
      }: { target: { files: FileList } }) => {
        if (uploadOnChangeMutation) {
          uploadOnChangeMutation({ variables: { [mutationFilesKey]: files } })
        }
        // TODO https://softwareengineering.stackexchange.com/questions/341587/html-file-input-field-add-files-instead-of-replace
        // https://stackoverflow.com/questions/16742956/file-field-append-file-list
        if (onChange) {
          onChange(files);
        }
      }
    }
    let labelAndInput = (props: any) => <input {...props} {...inputProps} />;
    if (StyledUploadLabel) {
      labelAndInput = (props: any) => <StyledUploadLabel {...props}><UploadInput {...props} {...inputProps} />{styledUploadLabelText}</StyledUploadLabel>
    }
    return labelAndInput;
  }, [StyledUploadLabel]);

  return (
    <Fragment>
      {!isNil(value) && !isEmpty(value) && (
        <span>
          {
            Object.keys(value)
              .map((key: any) => {
                const fileName = get(value[key], 'name', 'undefined');
                return (
                  <p key={fileName}>{fileName}
                    <button
                      type="button"
                      onClick={() => {
                        const newValues = Array.from(value);
                        newValues.splice(key, 1);
                        setFieldValue(name, newValues.length ? newValues : null);
                      }}
                    >
                      {deleteLabel}
                    </button>
                  </p>
                );
              })
          }
        </span>
      )}
      <Wrapper>
        <RenderLabelAnInput />
      </Wrapper>
    </Fragment>
  );
};

export {
  UploadDialog,
}
