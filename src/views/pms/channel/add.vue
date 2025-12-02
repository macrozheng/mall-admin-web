<template>
  <channel-detail :is-edit="false"></channel-detail>
</template>

<script>
  import ChannelDetail from './components/ChannelDetail'
  export default {
    name: 'addChannel',
    components: {ChannelDetail}
  }
</script>