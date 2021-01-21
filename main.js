// https://jp.vuejs.org/v2/examples/todomvc.html
var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
  fetch: function () {
    var todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
    todos.forEach(function (todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

const app = new Vue({
  el: '#app',
  data: {
    // 使用するデータ
    todos: [],
    options: [
      { value: -1, label: 'すべて' },
      { value: 0, label: '作業中' },
      { value: 1, label: '完了' },
    ],
    // 現在選択しているoptionsのvalueを記憶する。初期値はすべてを意味する-1
    current: -1,
  },
  components: {
    'vuejs-datepicker': vuejsDatepicker
  },

  // 算出プロパティの定義
  computed: {
    computedTodos: function () {
      return this.todos.filter(function (el) {
        return this.current < 0 ? true : this.current === el.state
      }, this)
    },

    labels() {
      // optionsの配列のvalueがaに、labelがbに適応する
      return this.options.reduce(function (a, b) {
        // Object.assignでvalueをlabelに置き換えている
        return Object.assign(a, { [b.value]: b.label })
      }, {})
    }
  },

  // 自動保存処理(この処理に加えて保存したリストの取得が必要)
  watch: {
    todos: {  // 変更を監視するプロパティ名:
      handler: function (todos) {
        todoStorage.save(todos)
      },
      // オブジェクトがネスト構造になっているので、deepオプションは必要になってくる
      deep: true
    }
  },

  // タイミングによってメソッドを使い分ける(ライフサイクル)
  created() {
    this.todos = todoStorage.fetch()
  },

  methods: {
    // 使用するメソッド
    doAdd: function (event, value) {
      var comment = this.$refs.comment
      var date = this.value
      if (!comment.value.length) {
        return
      }
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0,
        date: date
      })
      // データが追加されたら、フォームは空にする
      comment.value = ''
    },

    doChangeState: function (item) {
      item.state = !item.state ? 1 : 0 //真(1)だったら0にし、偽(0)だったら1にする。
    },

    doRemove: function (item) {
      var index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  }
})