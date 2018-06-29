const width = document.body.offsetWidth
const height = document.body.offsetHeight
const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')
canvas.width = width
canvas.height = height
canvas.style.width = `${width * devicePixelRatio}px`
canvas.style.height = `${height * devicePixelRatio}px`
context.scale(devicePixelRatio, devicePixelRatio)
document.body.appendChild(canvas)
