// click position relative to natural pixel dimensions of the image, not the displayed dimensions. This allows for accurate coordinate selection regardless of how the image is scaled in the browser.
export default function handleImageClick(event, setState) {
  const imageElement = event.currentTarget;
  const bounds = imageElement.getBoundingClientRect();

  if (!bounds.width || !bounds.height) return;

  const clickX = event.clientX - bounds.left;
  const clickY = event.clientY - bounds.top;

  const clampedX = Math.min(Math.max(clickX, 0), bounds.width);
  const clampedY = Math.min(Math.max(clickY, 0), bounds.height);

  const xScale = imageElement.naturalWidth / bounds.width;
  const yScale = imageElement.naturalHeight / bounds.height;

  const naturalX = Math.round(clampedX * xScale);
  const naturalY = Math.round(clampedY * yScale);

  setState(`${naturalX},${naturalY}`);
}
