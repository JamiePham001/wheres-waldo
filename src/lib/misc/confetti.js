import confetti from "canvas-confetti";

let lastX = 0;

const doItNow = (evt, hard) => {
  const direction = Math.sign(lastX - evt.clientX);
  lastX = evt.clientX;
  const particleCount = hard ? r(122, 245) : r(2, 15);
  confetti({
    particleCount,
    angle: r(90, 90 + direction * 30),
    spread: r(46, 80),
    origin: {
      x: evt.clientX / window.innerWidth,
      y: evt.clientY / window.innerHeight,
    },
  });
};

export default function makeConfetti(evt) {
  doItNow(evt, false);
}

function r(mi, ma) {
  return Math.floor(Math.random() * (ma - mi) + mi);
}
