<template>
  <div
    class="section"
  >
    <div
      class="container"
      style="max-width: 900px;"
    >
      <MailLinkLayout
        v-if="isMailLink"
      />
      <div
        v-else
        class="columns desktop-row-reverse"
      >

        <div class="column">
          <div
            class="animated fadeIn">
            <h2 class="subtitle">The Link</h2>
            <pre style="word-break: break-all;">
                {{ link }}
            </pre>
            <br >
            <h2 class="subtitle">The Html</h2>
            <pre style="word-break: break-all;">
                {{ html }}
            </pre>
            <br >
            <div class="level">
              <p class="level-item has-text-centered">
                <a
                  :href="link"
                  aria-label="Test Email Link"
                  class="button is-medium is-dark"
                  target="_blank"
                >Test</a>
              </p>
            </div>
          </div>
        </div>

        <div class="column animated fadeIn">
          <h2 class="subtitle">The Email</h2>
          <div class="card">
            <header class="card-header is-block">
              <div class="field">
                <div class="control">
                  <input
                    v-model="to"
                    class="input is-quiet is-medium"
                    aria-label="Email Recipient"
                    type="text"
                    placeholder="To"
                    value=""
                    autofocus
                  >
                  <!-- autofocus -->
                </div>
                <div class="control">
                  <input
                    v-model="cc"
                    class="input is-quiet is-medium"
                    aria-label="Carbon Copy"
                    type="text"
                    placeholder="Cc"
                  >
                </div>
                <div class="control">
                  <input
                    v-model="bcc"
                    class="input is-quiet is-medium"
                    aria-label="Blind Carbon Copy"
                    type="text"
                    placeholder="Bcc"
                  >
                </div>
              </div>
            </header>
            <div class="card-content">

              <div class="field">
                <div class="control">
                  <input
                    v-model="subject"
                    class="input is-quiet is-medium"
                    aria-label="Subject"
                    type="text"
                    placeholder="Subject"
                  >
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <textarea
                    v-model="body"
                    class="textarea is-quiet is-medium"
                    aria-label="Body Text"
                    placeholder="Body"
                  />
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input
                      v-model="usingMailtoTools"
                      type="checkbox"
                    >
                    Enable Variables
                  </label>
                  <Hint>
                    <pre class="is-block">
                      <div v-html="'{{date}} : Today\'s date'" />
                    </pre>
                  </Hint>
                </div>
              </div>

            </div>
            <footer class="card-footer">
              <p class="card-footer-item">
                <span>
                  <a
                    :href="link"
                    aria-label="Open Email"
                    class="button is-medium is-dark"
                    target="_blank"
                  >Send</a>
                </span>
              </p>
              <p class="card-footer-item is-left">
                <span>
                  <button
                    aria-label="Clear Fields"
                    class="button is-medium is-secondary"
                    @click="clear"
                  >Clear</button>
                </span>
              </p>
            </footer>
          </div>
        </div>

      </div><!--  .columns  -->
    </div><!--  .container  -->
  </div><!--  .section  -->
</template>

<script>
  import is from 'is_js'
  import {local} from 'brownies'

  import {getOption, setOption} from '../helpers/options'

  import Hint from './Hint.vue'
  import MailLinkLayout from './MailLinkLayout.vue'

  const fields = [
    'to',
    'cc',
    'bcc',
    'subject',
    'body',
  ]

  const urlParams = new URLSearchParams(window.location.search)
  // const urlParamsObject = Object.fromEntries(urlParams)
  const pathParts = window.location.pathname.split('/')

  const isMailLink = () => {
    const hasEmailInUrl = is.email(pathParts[1]) || is.email(urlParams.get('to'))

    return hasEmailInUrl
  }

  const replacePlusesWithEncodedSpaces = (string) => string.replace(/\+/g, '%20')

  export default {
    components: {
      Hint,
      MailLinkLayout
    },
    data () {
      return {
        to: '',
        cc: '',
        bcc: '',
        subject: '',
        body: '',

        usingMailtoTools: getOption('usingMailtoTools') || false
      }
    },
    computed: {
      isMailLink,
      params () {
        const params = {}

        if (is.not.empty(this.cc)) params.cc = this.cc
        if (is.not.empty(this.bcc)) params.bcc = this.bcc
        if (is.not.empty(this.subject)) params.subject = this.subject
        if (is.not.empty(this.body)) params.body = this.body

        return params
      },
      queryString () {
        const outputParams = new URLSearchParams()

        Object.entries(this.params).forEach((paramEntry) => {
          outputParams.set(paramEntry[0], paramEntry[1])
        })

        return replacePlusesWithEncodedSpaces(outputParams.toString())
      },
      link () {
        // const toEncoded = encodeURIComponent(this.to)
        const prefix = this.usingMailtoTools ? 'https://mailto.tools/' : 'mailto:'

        let link = `${prefix}${this.to}`

        if (is.not.empty(this.queryString)) {
          link += `?${this.queryString}`
        }

        return link
      },
      html () {
        const linkText = is.not.empty(this.subject) ? this.subject : 'Say Hello'
        return `<a href="${this.link}">${linkText}</a>`
      }
    },
    watch: {
      link () {
        this.setFields()
      },
      // Sync mail tools option to local storage
      usingMailtoTools (newValue) {
        setOption('usingMailtoTools', newValue)
      }
    },
    mounted () {
      // If fields is not set up yet initialize it
      if (is.not.object(local.fields)) {
        local.fields = {}
      } else {
        // Get fields
        this.getFields()
      }
    },
    methods: {
      clear () {
        fields.forEach((key) => {
          this[key] = ''
        })
      },
      setFields () {
        fields.forEach((key) => {
          local.fields = {
            ...local.fields,
            [key]: this[key]
          }
        })
      },
      getFields () {
        const localFields = local.fields
        
        fields.forEach((key) => {
          // If this field is empty then stop
          if (is.not.propertyDefined(localFields, key)) return
          this[key] = local.fields[key]
        })
      },
    }
  }
</script>
