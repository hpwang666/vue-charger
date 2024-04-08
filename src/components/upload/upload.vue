
<script>
import ajax from './ajax';
import UploadDragger from './upload-dragger.vue';

export default {
  inject: ['uploader'],
  components: {
    UploadDragger
  },
  props: {
    type: String,
    action: { // 必选参数，上传的地址
      type: String,
      required: true
    },
    name: { // 上传的文件字段名
      type: String,
      default: 'file'
    },
    data: Object, // 上传时附带的额外参数
    headers: Object, // 设置上传的请求头部
    withCredentials: Boolean, // 支持发送 cookie 凭证信息
    multiple: Boolean, // 是否支持多选文件
    accept: String, // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    onStart: Function,
    onProgress: Function, // 文件上传时的钩子
    onSuccess: Function, // 文件上传成功时的钩子
    onError: Function, // 文件上传失败时的钩子
    beforeUpload: Function, // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    drag: Boolean, // 是否启用拖拽上传
    onPreview: { // 点击文件列表中已上传的文件时的钩子
      type: Function,
      default: function() {}
    },
    onRemove: { // 文件列表移除文件时的钩子
      type: Function,
      default: function() {}
    },
    fileList: Array, // 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
    autoUpload: Boolean, // 是否在选取文件后立即进行上传
    listType: String, // 文件列表的类型
    httpRequest: { // 覆盖默认的上传行为，可以自定义上传的实现
      type: Function,
      default: ajax
    },
    disabled: Boolean, // 是否禁用
    limit: Number, // 最大允许上传个数
    onExceed: Function // 文件超出个数限制时的钩子
  },

  data() {
    return {
      mouseover: false,
      reqs: {}
    };
  },

  methods: {
    isImage(str) {
      return str.indexOf('image') !== -1;
    },
    handleChange(ev) {
    
      const files = ev.target.files;

      if (!files) return;
      this.uploadFiles(files);
    },
    uploadFiles(files) {
       

      // 文件超出个数限制时，调用onExceed钩子函数
      if (this.limit && this.fileList.length + files.length > this.limit) {
        this.onExceed && this.onExceed(files, this.fileList);
        return;
      }
      // 将files转成数组
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) { postFiles = postFiles.slice(0, 1); }

      if (postFiles.length === 0) { return; }

      postFiles.forEach(rawFile => {
        
        this.onStart(rawFile);
        // 选取文件后调用upload方法立即进行上传文件
        if (this.autoUpload) this.upload(rawFile);
      });
    },
    upload(rawFile) {
      this.$refs.input.value = null;
      // beforeUpload 上传文件之前的钩子不存在就直接调用post上传文件
      if (!this.beforeUpload) {
        return this.post(rawFile);
      }
      // beforeUpload 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传
      const before = this.beforeUpload(rawFile);
      // 在调用beforeUpload钩子后返回的是true，则继续上传
      console.log(before.then+"beforeload")
      if (before && before.then) {
        before.then(processedFile => {
          // processedFile转成对象
          const fileType = Object.prototype.toString.call(processedFile);

          if (fileType === '[object File]' || fileType === '[object Blob]') {
            if (fileType === '[object Blob]') {
              processedFile = new File([processedFile], rawFile.name, {
                type: rawFile.type
              });
            }
            for (const p in rawFile) {
              if (rawFile.hasOwnProperty(p)) {
                processedFile[p] = rawFile[p];
              }
            }
            this.post(processedFile);
          } else {
            this.post(rawFile);
          }
        }, () => {
          this.onRemove(null, rawFile);
        });
      } else if (before !== false) { // 调用beforeUpload之后没有返回值，此时before为undefined，继续上传
        this.post(rawFile);
      } else {  
        // 调用beforeUpload之后返回值为false，则不再继续上传并移除文件
        this.onRemove(null, rawFile);
      }
    },
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach((uid) => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    // 上传文件过程的方法
    post(rawFile) {
      const { uid } = rawFile;
      const options = {
        headers: this.headers,
        withCredentials: this.withCredentials,
        file: rawFile,
        data: this.data,
        filename: this.name,
        action: this.action,
        onProgress: e => { // 文件上传时的钩子函数
          this.onProgress(e, rawFile);
        },
        onSuccess: res => { // 文件上传成功的钩子函数
          // 上传成功调用onSuccess方法，即index.vue中的handleSuccess方法
          this.onSuccess(res, rawFile);
          delete this.reqs[uid];
        },
        onError: err => { // 文件上传失败的钩子函数
          
          this.onError(err, rawFile);
          delete this.reqs[uid];
        }
      };
      // httpRequest可以自定义上传文件，如果没有定义，默认通过ajax文件中的方法上传
      const req = this.httpRequest(options);
      this.reqs[uid] = req;
      if (req && req.then) {
        req.then(options.onSuccess, options.onError);
      }
    },
    handleClick() {
      // 点击组件时调用input的click方法
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    handleKeydown(e) {
      if (e.target !== e.currentTarget) return;
      // 如果当前按下的是回车键和空格键，调用handleClick事件
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick();
      }
    }
  },

  render(h) {
    let {
      handleClick,
      drag,
      name,
      handleChange,
      multiple,
      accept,
      listType,
      uploadFiles,
      disabled,
      handleKeydown
    } = this;
    const data = {
      class: {
        'el-upload': true
      },
      on: {
        click: handleClick,
        keydown: handleKeydown
      }
    };
    data.class[`el-upload--${listType}`] = true;
    return (
      // 判断是否允许拖拽，允许的话显示upload-dragger组件，不允许就显示所有插槽中的节点
      <div {...data} tabindex="0" >
        {
          drag
            ? <upload-dragger disabled={disabled} on-file={uploadFiles}>{this.$slots.default}</upload-dragger>
            : this.$slots.default
        }
        <input class="el-upload__input" type="file" ref="input" name={name} on-change={handleChange} multiple={multiple} accept={accept}></input>
      </div>
    );
  }
};
</script>

