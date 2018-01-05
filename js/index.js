var app = new Vue({
  el: '#app',
  data: {
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  },
  computed: {
    params: function params() {
      var params = {};

      if (is.not.empty(this.cc)) params.cc = this.cc;
      if (is.not.empty(this.bcc)) params.bcc = this.bcc;
      if (is.not.empty(this.subject)) params.subject = this.subject;
      if (is.not.empty(this.body)) params.body = this.body;

      return params;
    },
    queryString: function queryString() {
      var keys = Object.keys(this.params);
      var query = keys.map(this.mapParam);
      var queryString = query.join('&');

      return queryString;
    },
    link: function link() {
      var link = 'mailto:' + this.to;

      if (is.not.empty(this.queryString)) {
        link += '?' + this.queryString;
      }

      return link;
    },
    html: function html() {
      var linkText = is.not.empty(this.subject) ? this.subject : 'Say Hello';
      return '<a href="' + this.link + '">' + linkText + '</a>';
    }
  },
  methods: {
    mapParam: function mapParam(key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(this.params[key]);
    }
  }
});