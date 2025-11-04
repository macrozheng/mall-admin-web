<template>
  <channel-detail :is-edit="true"></channel-detail>
</template>

<script>
  import ChannelDetail from './components/ChannelDetail'
  export default {
    name: 'updateChannel',
    components: {ChannelDetail}
  }
</script>