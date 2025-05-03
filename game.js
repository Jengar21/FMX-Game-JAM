
function showMenu() {
    const gameContainer = document.querySelector('.game-container');
    const menu = document.querySelector('.menu');

    // Show the menu and hide the game container
    menu.style.display = 'block';
    gameContainer.style.display = 'none';
}

function startGame() {
    const gameContainer = document.querySelector('.game-container');
    const menu = document.querySelector('.menu');

    // Hide the menu and show the game container
    menu.style.display = 'none';
    gameContainer.style.display = 'grid';

    // Load level1.html into the feed container
    fetch('levels/level1.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('post-board-container').innerHTML = html;
        })
        .catch(error => console.error('Error loading level1:', error));
}


showMenu();