const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const img = new Image()

img.src = "https://i.ibb.co/FzH4M6c/flappy-bird-set.png"

// general settings
let gamePlaying = false

const gravity = 0.5,
  speed = 5, // normal speed
  size = [51, 36],
  jump = -10,
  cTenth = canvas.width / 10

let index = 0,
  bestScore = 0,
  flight,
  flyHeight,
  currentScore,
  pipe,
  pipes

// pipe settings
const pipeWidth = 78,
  pipeGap = 270,
  pipeLoc = () =>
    Math.random() * (canvas.height - (pipeGap + pipeWidth) - pipeWidth) +
    pipeWidth

const setup = () => {
  currentScore = 0
  flight = jump

  // set initial flyHeight (middle of the screen - size of the bird)
  flyHeight = canvas.height / 2 - size[1] / 2

  // setup first 3 pipes
  pipes = Array(3)
    .fill()
    .map((a, i) => [canvas.width + i * (pipeGap + pipeWidth), pipeLoc()])
}

const render = () => {
  // make the pipe and bird moving
  index++

  // background first part
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -((index * (speed / 2)) % canvas.width) + canvas.width,
    0,
    canvas.width,
    canvas.height
  )

  // background second part
  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
    -(index * (speed / 2)) % canvas.width,
    0,
    canvas.width,
    canvas.height
  )

  // pipe display
  if (gamePlaying) {
    pipes.map(pipe => {
      // pipe moving
      pipe[0] -= speed

      // top pipe
      ctx.drawImage(
        img,
        432,
        588 - pipe[1],
        pipeWidth,
        pipe[1],
        pipe[0],
        0,
        pipeWidth,
        pipe[1]
      )

      // bottom pipe
      ctx.drawImage(
        img,
        432 + pipeWidth,
        108,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap,
        pipe[0],
        pipe[1] + pipeGap,
        pipeWidth,
        canvas.height - pipe[1] + pipeGap
      )

      // give 1 pont & create new pipe
      if (pipe[0] <= -pipeWidth) {
        currentScore++
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore)

        // remove & create new pipe
        console.log(pipes[pipes.length - 1][0])
        pipes = [
          ...pipes.slice(1),
          [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()],
        ]
      }

      // if hit the pipe, ed
      if (
        [
          pipe[0] <= cTenth + size[0],
          pipe[0] + pipeWidth >= cTenth,
          pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1],
        ].every(elem => elem)
      ) {
        gamePlaying = false
        setup()
      }
    })
  }

  // draw bird
  if (gamePlaying) {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      cTenth,
      flyHeight,
      ...size
    )
    flight += gravity
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1])
  } else {
    ctx.drawImage(
      img,
      432,
      Math.floor((index % 9) / 3) * size[1],
      ...size,
      canvas.width / 2 - size[0] / 2,
      flyHeight,
      ...size
    )
    flyHeight = canvas.height / 2 - size[1] / 2

    ctx.fillText(`Best score: ${bestScore}`, 85, 245)
    ctx.fillText("Click to play", 90, 535)
    ctx.font = "bold 30px courier"
  }

  document.getElementById("bestScore").innerHTML = `Best: ${bestScore}`
  document.getElementById("currentScore").innerHTML = `Current: ${currentScore}`

  // tell the browser to perform anim
  window.requestAnimationFrame(render)
}

setup()
img.onload = render

// start game
document.addEventListener("click", () => (gamePlaying = true))
window.onclick = () => (flight = jump)
