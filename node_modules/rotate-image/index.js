var Canvas = require('canvas')
  , Image = Canvas.Image
module.exports =
function rotateImage(image, rotation) {
  rotation = (+rotation + 4) % 4
  var mod = rotation & 1
    , width = mod
      ? image.height
      : image.width
    , height = mod
      ? image.width
      : image.height
  var canvas = new Canvas(width, height)
    , ctx = canvas.getContext('2d')
  ctx.rotate(rotation * Math.PI / 2)
  ctx.drawImage(image, image.width * -(rotation === 2 || rotation === 3), image.height * -(rotation === 1 || rotation === 2))
  var newImage = new Image()
  newImage.src = typeof canvas.toBuffer == 'function' ? canvas.toBuffer() : canvas.toDataURL()
  return newImage
}
