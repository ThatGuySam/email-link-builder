<template>
  <button
    style="all: unset;"
    @click="isOpen = !isOpen"
  >
    <div
      v-if="!isOpen"
      class="icon has-background-light"
      style="border-radius: 9999px;"
    >?</div>
    <slot v-else />
  </button>
</template>

<script>

export default {
  data () {
    return {
      isOpen: false
    }
  }
}

</script>