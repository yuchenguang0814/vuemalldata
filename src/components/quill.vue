<template>
  <quill-editor
      ref="richAnalysis"
      v-model="content"
      :content="value"
      :options="options"
      @change="onEditorChange($event)"
    ></quill-editor>
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
  props: {
    value: {
      type: String
    }
  },
  methods: {
    onEditorChange () {
      this.$emit('input', this.content)
      console.log(this.content)
    }
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
      content: this.value
    }
  }
}
</script>

<style>

</style>
