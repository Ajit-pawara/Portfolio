export function checkVersion() {
  fetch(`./version.json?t=${Date.now()}`)
    .then(r => r.json())
    .then(data => {
      if (data.hash && data.hash !== __BUILD_HASH__) {
        window.location.reload()
      }
    })
    .catch(() => {})
}
