
function getError(action, option, xhr) {
  let msg;
  if (xhr.response) {
    msg = `${xhr.response.error || xhr.response}`;
  } else if (xhr.responseText) {
    msg = `${xhr.responseText}`;
  } else {
    msg = `fail to post ${action} ${xhr.status}`;
  }

  const err = new Error(msg);
  err.status = xhr.status;
  err.method = 'post';
  err.url = action;
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}
//默认的上传文件的方法
export default function upload(option) {
  //XMLHttpRequest 对象用于在后台与服务器交换数据。
  if (typeof XMLHttpRequest === 'undefined') {
    return;
  }
  //创建XMLHttpRequest对象
  const xhr = new XMLHttpRequest();
  const action = option.action; //上传的地址

  //XMLHttpRequest.upload 属性返回一个 XMLHttpRequestUpload对象，用来表示上传的进度。这个对象是不透明的，但是作为一个XMLHttpRequestEventTarget，可以通过对其绑定事件来追踪它的进度。
  if (xhr.upload) {
    //上传进度调用方法,上传过程中会频繁调用该方法
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        // e.total是需要传输的总字节，e.loaded是已经传输的字节
        e.percent = e.loaded / e.total * 100;
      }
      //调文件上传时的钩子函数
      option.onProgress(e);
    };
  }
  // 创建一个FormData 对象
  const formData = new FormData();
  //用户设置了上传时附带的额外参数时
  if (option.data) {
    Object.keys(option.data).forEach(key => {
      // 添加一个新值到 formData 对象内的一个已存在的键中，如果键不存在则会添加该键。
      formData.append(key, option.data[key]);
    });
  }

  formData.append(option.filename, option.file, option.file.name);
  //请求出错
  xhr.onerror = function error(e) {
    option.onError(e);
  };
  //请求成功回调函数
  xhr.onload = function onload() {
    if (xhr.status < 200 || xhr.status >= 300) {
      return option.onError(getError(action, option, xhr));
    }
    //调用upload.vue文件中的onSuccess方法，将上传接口返回值作为参数传递
    option.onSuccess(getBody(xhr));
  };
  //初始化请求
  xhr.open('post', action, true);

  if (option.withCredentials && 'withCredentials' in xhr) {
    xhr.withCredentials = true;
  }

  const headers = option.headers || {};

  for (let item in headers) {
    if (headers.hasOwnProperty(item) && headers[item] !== null) {
      //设置请求头
      xhr.setRequestHeader(item, headers[item]);
    }
  }
  //发送请求
  xhr.send(formData);
  return xhr;
}

