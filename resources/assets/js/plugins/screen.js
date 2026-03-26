import Vue from 'vue'

const screen = Vue.observable({
    width: window.innerWidth
})
window.addEventListener('resize', () => {
    screen.width = window.innerWidth
})
export default screen