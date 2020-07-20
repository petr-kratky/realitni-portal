export type UploadRequestInit = RequestInit & {
  onUploadProgress: (event: ProgressEvent<EventTarget>) => void,
  onUploadAbort: (abort: () => void) => void,
}

const uploadLinkXhr = (uri: string, options: UploadRequestInit) => {
  return new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method || 'get', uri)
    // https://github.com/microsoft/TypeScript/pull/28899
    Object.entries(options.headers as object).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    xhr.onload = () => {
      const responseBody = typeof xhr.responseText === 'object' ? JSON.stringify(xhr.responseText) : xhr.responseText;
      const xhrHeaders = xhr.getAllResponseHeaders();
      const xhrHeadersArr = xhrHeaders.trim().split(/[\r\n]+/);
      const fetchHeaders = new Headers();
      xhrHeadersArr.forEach((headerKeyAndValue) => {
        const values = headerKeyAndValue.split(':');
        const key = values.shift() || '';
        fetchHeaders.append(key, values.join(''));
      });
      const fetchResponse = new Response(responseBody, {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: fetchHeaders
      });
      resolve(fetchResponse)
    }
    xhr.onerror = reject
  
    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (options.onUploadProgress) {
          options.onUploadProgress(event)
        }
      }
    }

    if (options.onUploadAbort) {
      options.onUploadAbort(() => {
        xhr.abort();
        // linkFetch(uri, options)
        // ...
        //   .catch(function (error) {
        //     if (error.name === 'AbortError') return
        //     if (error.result && error.result.errors && error.result.data)
        //       observer.next(error.result)
        //     observer.error(error)
        //   })
        reject({ name: 'AbortError' });
      });
    }
    xhr.send(options.body)
  })
}

export {
  uploadLinkXhr,
}