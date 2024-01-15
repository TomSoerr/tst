function appendDevLines() {
  const devLines = document.createElement('div');
  devLines.setAttribute('class', 'dev-lines');
  document.body.append(devLines);
}

export default appendDevLines;
