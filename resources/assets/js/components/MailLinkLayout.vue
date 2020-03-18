<template>
  <div
    class="has-text-centered level"
    style="min-height: 80vh;"
  >
    <div class="level-item">
      <div>
        <div class="is-block">Opening email</div>
        <div class="is-size-7	">
          <a
            :href="mailRedirectUrl"
            class="is-block"
          >Click here is the email doesn't open automatically</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const pathParts = window.location.pathname.split('/')

// Convert matching variables into respective values
const variabler = (match, p1) => {
  const dateOptions = {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  const variablerVariables = {
    'date': (new Date()).toLocaleDateString('en-US', dateOptions)
  }

  // If we can't find a matching variable key the return an empty string
  if (!(p1 in variablerVariables)) return ''

  return variablerVariables[p1]
}

// Find all double bracketed strings and run the variabler function on string
const encodeVariables = (string) => string.replace(/\{\{(.+?)\}\}/g, variabler)

const replacePlusesWithEncodedSpaces = (string) => string.replace(/\+/g, '%20')

const makeMailtoRedirectURL = () => {
  const mailtoParams = new URLSearchParams(window.location.search)
  const email = pathParts[1] || mailtoParams.get('to')

  // If the 'to' param is set then remove it
  mailtoParams.delete('to')

  const paramsWithVariables = [
    'subject',
    'body'
  ]
  
  paramsWithVariables.forEach((paramName) => {
    const paramValue = mailtoParams.get(paramName)

    if (paramValue !== null) {
      // Replace variable strings with values
      const paramValueWithVariables = encodeVariables(paramValue)
      
      // Update the param
      mailtoParams.set(paramName, paramValueWithVariables)
    }
  })

  const queryString = replacePlusesWithEncodedSpaces(mailtoParams.toString())

  return `mailto:${email}?${queryString}`
}

export default {
  computed: {
    mailRedirectUrl () {
      return makeMailtoRedirectURL()
    },
  },
  mounted () {
    // console.log('this.mailRedirectUrl', this.mailRedirectUrl)
    // Open the mailto url
    const emailWindow = window.open(this.mailRedirectUrl, '_blank')
    // Focus the new window
    emailWindow.focus()
  }
}

</script>