fetch('levels/level1.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('post-board-container').innerHTML = html;
    })
    .catch(error => console.error('Error loading post board:', error));

