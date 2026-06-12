const splitCoordinates = (coordinates) => {
  const [x, y] = coordinates.split(",").map(Number);
  return { x, y };
};

export default function checkClick(clickCoordinates, characterData) {
  // characterData = "{x,y},{x2,y2}" - top left and bottom right coordinates of the character's bounding box
  if (!clickCoordinates || !characterData) return false;
  const { x: clickX, y: clickY } = splitCoordinates(clickCoordinates);
  const [charX, charY, charX2, charY2] = characterData
    .match(/\d+/g)
    .map(Number);
  return (
    clickX >= charX && clickX <= charX2 && clickY >= charY && clickY <= charY2
  );
}
