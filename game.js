
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
        
            addButtonsToPosts();
        })
        .catch(error => console.error('Error loading level1:', error));

    // Load level1.html into the feed container
    fetch('orderbook/orderbook1.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('orders-container').innerHTML = html;
        })
        .catch(error => console.error('Error loading level1:', error));


}

function addButtonsToPosts() {
    console.log("Adding buttons to posts...");
    // Select all posts
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        // Create Accept button
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.className = 'accept-button';
        acceptButton.onclick = () => alert('Post Accepted!');

        // Create Deny button
        const denyButton = document.createElement('button');
        denyButton.textContent = 'Deny';
        denyButton.className = 'deny-button';
        denyButton.onclick = () => alert('Post Denied!');

        // Append buttons to the post
        post.appendChild(acceptButton);
        post.appendChild(denyButton);
    });
}


showMenu();