
<script>
import UploadList from './upload-list'
import Upload from './upload'
import ElProgress from './src/progress'
import Migrating from './src/migrating'

function noop() {}

export default {
  name: 'MyUpload',

  mixins: [Migrating],

  components: {
    ElProgress,
    UploadList,
    Upload
  },

  provide () {
    return {
      uploader: this
    }
  },

  inject: {
    elForm: {
      default: ''
    }
  },

  props: {
    action: { // 必选参数，上传的地址
      type: String,
      required: true
    },
    headers: { // 设置上传的请求头部
      type: Object,
      default () {
        return {}
      }
    },
    data: Object, // 上传时附带的额外参数
    multiple: Boolean, // 是否支持多选文件
    name: { // 上传的文件字段名
      type: String,
      default: 'file'
    },
    drag: Boolean, // 是否启用拖拽上传
    dragger: Boolean,
    withCredentials: Boolean, // 支持发送 cookie 凭证信息
    showFileList: { // 是否显示已上传文件列表
      type: Boolean,
      default: true
    },
    accept: String, // 接受上传的文件类型（thumbnail-mode 模式下此参数无效）
    type: {
      type: String,
      default: 'select'
    },
    beforeUpload: Function, // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeRemove: Function, // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    onRemove: { // 文件列表移除文件时的钩子
      type: Function,
      default: noop
    },
    onChange: { // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      type: Function,
      default: noop
    },
    onPreview: { // 点击文件列表中已上传的文件时的钩子
      type: Function
    },
    onSuccess: { // 文件上传成功时的钩子
      type: Function,
      default: noop
    },
    onProgress: { // 文件上传时的钩子
      type: Function,
      default: noop
    },
    onError: { // 文件上传失败时的钩子
      type: Function,
      default: noop
    },
    fileList: { // 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      type: Array,
      default () {
        return []
      }
    },
    autoUpload: { // 是否在选取文件后立即进行上传
      type: Boolean,
      default: true
    },
    listType: { // 文件列表的类型
      type: String,
      default: 'text' // text,picture,picture-card
    },
    httpRequest: Function, // 覆盖默认的上传行为，可以自定义上传的实现
    disabled: Boolean, // 是否禁用
    limit: Number, // 最大允许上传个数
    onExceed: { // 文件超出个数限制时的钩子
      type: Function,
      default: noop
    }
  },

  data () {
    return {
      uploadFiles: [],
      dragOver: false,
      draging: false,
      tempIndex: 1
    }
  },

  computed: {
    uploadDisabled () {
      return this.disabled || (this.elForm || {}).disabled
    }
  },

  watch: {
    fileList: {
      immediate: true,
      handler (fileList) {
        console.log('12121');
        this.uploadFiles = fileList.map(item => {
          item.uid = item.uid || (Date.now() + this.tempIndex++)
          item.status = item.status || 'success'
          return item
        })
      }
    }
  },

  methods: {
    // 文件上传之前调用的方法
    handleStart (rawFile) {
      rawFile.uid = Date.now() + this.tempIndex++
      let file = {
        status: 'ready',
        name: rawFile.name,
        size: rawFile.size,
        percentage: 0,
        uid: rawFile.uid,
        raw: rawFile
      }
      // 判断文件列表类型
      if (this.listType === 'picture-card' || this.listType === 'picture') {
        try {
          file.url = URL.createObjectURL(rawFile)
        } catch (err) {
          console.error('[Element Error][Upload]', err)
          return;
        }
      }
      
      this.uploadFiles.push(file)
      this.onChange(file, this.uploadFiles)
    },
    handleProgress(ev, rawFile) {
      const file = this.getFile(rawFile)
      this.onProgress(ev, file, this.uploadFiles)
      file.status = 'uploading'
      file.percentage = ev.percent || 0
    },
    // 文件上传成功后改用该方法，在该方法中调用用户设置的on-success和on-change方法，并将对应的参数传递出去
    handleSuccess(res, rawFile) {
       console.log('ok')
      const file = this.getFile(rawFile)

      if (file) {
        file.status = 'success'
        file.response = res

        this.onSuccess(res, file, this.uploadFiles)
        this.onChange(file, this.uploadFiles)
      }
    },
    // 文件上传失败后改用该方法，在该方法中调用用户设置的on-error和on-change方法，并将对应的参数传递出去
    handleError(err, rawFile) {
      const file = this.getFile(rawFile)
      const fileList = this.uploadFiles

      file.status = 'fail'

      fileList.splice(fileList.indexOf(file), 1)

      this.onError(err, file, this.uploadFiles)
      this.onChange(file, this.uploadFiles)
    },
    // 文件列表移除文件时调用该方法
    handleRemove(file, raw) {
      if (raw) {
        file = this.getFile(raw)
      }
      let doRemove = () => {
        this.abort(file)
        let fileList = this.uploadFiles
        fileList.splice(fileList.indexOf(file), 1)
        this.onRemove(file, fileList)
      };

      if (!this.beforeRemove) {
        doRemove()
      } else if (typeof this.beforeRemove === 'function') {
        const before = this.beforeRemove(file, this.uploadFiles)
        if (before && before.then) {
          before.then(() => {
            doRemove()
          }, noop)
        } else if (before !== false) {
          doRemove()
        }
      }
    },
    getFile(rawFile) {
      let fileList = this.uploadFiles
      let target
      fileList.every(item => {
        target = rawFile.uid === item.uid ? item : null
        return !target
      })
      return target
    },
    abort(file) {
      this.$refs['upload-inner'].abort(file)
    },
    clearFiles() {
      this.uploadFiles = []
    },
    submit() {
      this.uploadFiles
        .filter(file => file.status === 'ready')
        .forEach(file => {
         
          this.$refs['upload-inner'].upload(file.raw)
        })
    },
    getMigratingConfig() {
      return {
        props: {
          'default-file-list': 'default-file-list is renamed to file-list.',
          'show-upload-list': 'show-upload-list is renamed to show-file-list.',
          'thumbnail-mode': 'thumbnail-mode has been deprecated, you can implement the same effect according to this case: http://element.eleme.io/#/zh-CN/component/upload#yong-hu-tou-xiang-shang-chuan'
        }
      }
    }
  },

  beforeDestroy() {
    this.uploadFiles.forEach(file => {
      if (file.url && file.url.indexOf('blob:') === 0) {
        URL.revokeObjectURL(file.url)
      }
    })
  },

  render(h) {
    let uploadList
    // 如果用户设置showFileList为true，则显示上传文件列表
    if (this.showFileList) {
      uploadList = (
        <UploadList
          disabled={this.uploadDisabled}
          listType={this.listType}
          files={this.uploadFiles}
          on-remove={this.handleRemove}
          handlePreview={this.onPreview}>
        </UploadList>
      )
    }

    const uploadData = {
      props: {
        type: this.type,
        drag: this.drag,
        action: this.action,
        multiple: this.multiple,
        'before-upload': this.beforeUpload,
        'with-credentials': this.withCredentials,
        headers: this.headers,
        name: this.name,
        data: this.data,
        accept: this.accept,
        fileList: this.uploadFiles,
        autoUpload: this.autoUpload,
        listType: this.listType,
        disabled: this.uploadDisabled,
        limit: this.limit,
        'on-exceed': this.onExceed,
        'on-start': this.handleStart,
        'on-progress': this.handleProgress,
        'on-success': this.handleSuccess,
        'on-error': this.handleError,
        'on-preview': this.onPreview,
        'on-remove': this.handleRemove,
        'http-request': this.httpRequest
      },
      ref: 'upload-inner'
    }

    const trigger = this.$slots.trigger || this.$slots.default
    const uploadComponent = <upload {...uploadData}>{trigger}</upload>
 
    return (
      <div>
        { this.listType === 'picture-card' ? uploadList : ''}
        {
          this.$slots.trigger
            ? [uploadComponent, this.$slots.default]
            : uploadComponent
        }
        {this.$slots.tip}
        { this.listType !== 'picture-card' ? uploadList : ''}
      </div>
    )
  }
}
</script>

