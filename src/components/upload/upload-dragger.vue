
<template>
  <!--拖拽上传时显示此组件-->
  <div
    class="el-upload-dragger"
    :class="{
      'is-dragover': dragover
    }"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ElUploadDrag',
  props: {
    disabled: Boolean
  },
  inject: {
    uploader: {
      default: ''
    }
  },

  data() {
    return {
      dragover: false
    };
  },
  methods: {
    onDragover() {
      if (!this.disabled) { 
        this.dragover = true;
      }
    },
    onDrop(e) {
      if (this.disabled || !this.uploader) return;
      // 接受上传的文件类型（thumbnail-mode 模式下此参数无效），此处判断该文件是都符合能上传的类型
      const accept = this.uploader.accept;
      this.dragover = false;
      if (!accept) {
        this.$emit('file', e.dataTransfer.files);
        return;
      }
      this.$emit('file', [].slice.call(e.dataTransfer.files).filter(file => {
        const { type, name } = file;
        // 获取文件名后缀，与设置的文件类型进行对比
        const extension = name.indexOf('.') > -1
          ? `.${ name.split('.').pop() }`
          : '';
        const baseType = type.replace(/\/.*$/, '');
        return accept.split(',')
          .map(type => type.trim())
          .filter(type => type)
          .some(acceptedType => {
            if (/\..+$/.test(acceptedType)) {
              // 文件名后缀与设置的文件类型进行对比
              return extension === acceptedType;
            }
            if (/\/\*$/.test(acceptedType)) {
              return baseType === acceptedType.replace(/\/\*$/, '');
            }
            if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
              return type === acceptedType;
            }
            return false;
          });
      }));
    }
  }
};
</script>
