const helpers = {
  ctx(width, height) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(devicePixelRatio, devicePixelRatio)
    document.body.appendChild(canvas)
    return ctx
  },

  ctxResponsive() {
    const ctx = this.ctx(window.innerWidth, window.innerHeight)
    const canvas = ctx.canvas
    const resize = debounce(
      () => {
        const width = window.innerWidth
        const height = window.innerHeight
        canvas.width = width * devicePixelRatio
        canvas.height = height * devicePixelRatio
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
      },
      100,
      true
    )

    window.addEventListener('resize', resize)
    return ctx
  },

  vec3FromAngle(angle, length = 1) {
    return [length * Math.cos(angle), length * Math.sin(angle), 0]
  },

  radians(angle) {
    return angle * (Math.PI / 180)
  }
}

function debounce(func, wait, immediate) {
  let timeout
  return function(...args) {
    /* eslint-disable-next-line no-invalid-this */
    const context = this
    const later = () => {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

module.exports = helpers
