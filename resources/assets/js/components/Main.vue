<template>
  <div id="app" class="section">
    <div class="container" style="max-width: 900px;">
      <div class="columns">
        <div class="column animated fadeIn">
          <h2 class="subtitle">The Email</h2>
          <div class="card">
            <header class="card-header is-block">
              <div class="field">
                <div class="control">
                  <input 
                    class="input is-quiet is-medium"
                    type="text" 
                    placeholder="To"
                    value=""
                    v-model="to"
                    autofocus
                  >
                    <!-- autofocus -->
                </div>
                <div class="control">
                  <input 
                    class="input is-quiet is-medium" 
                    type="text" 
                    placeholder="Cc"
                    v-model="cc"
                  >
                </div>
                <div class="control">
                  <input
                    class="input is-quiet is-medium"
                    type="email"
                    placeholder="Bcc"
                    v-model="bcc"
                  >
                </div>
              </div>
            </header>
            <div class="card-content">
              <div class="field">
                <div class="control">
                  <input
                    class="input is-quiet is-medium"
                    type="text"
                    placeholder="Subject"
                    v-model="subject"
                  >
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <textarea
                    class="textarea is-quiet is-medium"
                    placeholder="Body"
                    v-model="body"
                  ></textarea>
                </div>
              </div>
            </div>
            <footer class="card-footer">
              <p class="card-footer-item">
                <span>
                  <a :href="link" class="button is-medium is-primary" target="_blank">Send</a>
                </span>
              </p>
            </footer>
          </div>
          </div>
          <div class="column">
            <div v-if="to !== ''" class="animated fadeIn">
              <h2 class="subtitle">The Link</h2>
              <pre style="word-break: break-all;">
                {{ link }}
              </pre>
              <br />
              <h2 class="subtitle">The Html</h2>
              <pre style="word-break: break-all;">
                {{ html }}
              </pre>
              <br />
              <div class="level">
                <p class="level-item has-text-centered">
                  <a :href="link" class="button is-medium is-primary" target="_blank">Test</a>
                </p>
              </div>
            </div>
          </div>
      </div><!--  .columns  -->
    </div><!--  .container  -->
  </div><!--  .section  -->
</template>

<script>
  import is from 'is_js'

  export default {
    data: function () {
      return {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: ''
      }
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
  }
</script>
