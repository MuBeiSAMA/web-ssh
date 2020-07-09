<template>
  <div>
    <div id="terminal"></div>
  </div>
</template>

<script>
  import Terminal from '@/config/xterm/terminal'
  import openSocket from 'socket.io-client';
  export default {
    name:'xtermConsole',
    mounted() {
      const term = new Terminal({cursorBlink:true})
      
      term.open(document.getElementById('terminal'))

      term.fit()
      
      const socket = openSocket('http://127.0.0.1:7001')
      
      socket.emit('/',{msgId: 'net1', ip: "192.168.10.65", username: "smart", password: "smart"})

      term.on('data',res=>{
        socket.emit('net1',res)
      })

      socket.on('net1',res=>{
        term.write(res)
      })
    },
  }
</script>

<style scoped>
#terminal{
  width: 900px;
  height: 300px;
}
</style>