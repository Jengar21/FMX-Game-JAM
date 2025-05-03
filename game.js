function loadLevel1() {
  fetch('levels/level1.html')
      .then(response => response.text())
      .then(html => {
          document.getElementById('post-board-container').innerHTML = html;
          console.log('Level 1 loaded.');
      })
      .catch(error => console.error('Error loading level 1:', error));
}
