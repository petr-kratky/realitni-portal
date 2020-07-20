import { DocumentNode } from 'graphql';
import { useMutation, MutationHookOptions } from '@apollo/react-hooks';
import { useState } from 'react';

const useUploadApollo = (mutation: DocumentNode, mutationOptions?: MutationHookOptions) => {
  const [mutationCaller, mutationStatus] = useMutation(mutation, mutationOptions);
  const [uploadAbort, setUploadAbort] = useState();
  const [uploadProgress, setUploadProgess] = useState({ loaded: 0, total: 1 });

  const mutateWithContext = ({ context, ...props }: any) => mutationCaller({
    context: {
      hasUpload: true,
      fetchOptions: {
        onUploadAbort: (abortHandler: any) => {
          setUploadAbort(() => abortHandler);
        },
        onUploadProgress: ((progressEvent: any) => {
          setUploadProgess(progressEvent);
        }),
      },
      ...context,
    },
    ...props,
  })

  return [
    mutateWithContext as any,
    mutationStatus as any,
    uploadProgress as any,
    uploadAbort as any
  ]
}

export {
  useUploadApollo
}