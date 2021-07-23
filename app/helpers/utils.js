const getLastPathAddress = (url) => {
  const paths = url.split('/')
  return paths[paths.length - 1]
}

module.exports = {
  getLastPathAddress
}
