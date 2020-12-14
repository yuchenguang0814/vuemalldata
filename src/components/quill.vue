<template>
  <quill-editor
    v-model="connent" :options="options"></quill-editor>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { addQuillTitle } from '../plugins/quill-title'
export default {
  name: '',
  components: {
    quillEditor
  },
  mounted () {
    addQuillTitle()
  },
  data () {
    return {
      options: {
        theme: 'snow',
        placeholder: '请输入内容'
      },
      connent: ''
    }
  }
}
</script>

<style>

</style>
