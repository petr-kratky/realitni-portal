import { DocumentNode } from 'graphql';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { useState, useEffect } from 'react';

const useUpload = () => {

  const [files, setFiles] = useState();
  const [response, setResponse] = useState();
  const [uploadAbort, setUploadAbort] = useState();
  const [uploadProgress, setUploadProgess] = useState({ loaded: 0, total: 1 });


  return [
    setFiles as any,
    response as any,
    uploadProgress as any,
    uploadAbort as any
  ]
}

export {
  useUpload
}