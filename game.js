
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

function acceptPost(postId) {
    const post = document.getElementById(postId);

    if (post) {
        // Remove buttons
        const buttons = post.querySelectorAll('button');
        buttons.forEach(button => button.remove());

        // Add a green checkmark
        const checkmark = document.createElement('div');
        checkmark.textContent = '✔';
        checkmark.style.color = 'green';
        checkmark.style.fontSize = '2rem';
        checkmark.style.fontWeight = 'bold';
        checkmark.style.textAlign = 'center';
        post.appendChild(checkmark);

        // Optional: Add a success animation (e.g., fade-in for the checkmark)
        checkmark.style.opacity = '0';
        checkmark.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            checkmark.style.opacity = '1';
        }, 10);
    }
}

function denyPost(postId) {
    const post = document.getElementById(postId);

    if (post) {
        // Add a closing animation
        post.style.transition = 'opacity 0.5s ease, height 0.5s ease, margin 0.5s ease';
        post.style.opacity = '0';
        post.style.height = '0';
        post.style.margin = '0';
        post.style.overflow = 'hidden';

        // Remove the post from the DOM after the animation
        setTimeout(() => {
            post.remove();
        }, 500);
    }
}

function addButtonsToPosts() {
    console.log("Adding buttons to posts...");
    // Select all posts
    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const postId = post.id;
        // Create Spacer
        const spacer = document.createElement('div');
        spacer.className = 'spacer';
        spacer.style.width = '100%';
        // Create Accept button
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Accept';
        acceptButton.className = 'accept-button';
        acceptButton.onclick = () => acceptPost(postId);

        // Create Deny button
        const denyButton = document.createElement('button');
        denyButton.textContent = 'Deny';
        denyButton.className = 'deny-button';
        denyButton.onclick = () => denyPost(postId);

        // Append buttons to the post
        post.appendChild(spacer);
        post.appendChild(acceptButton);
        post.appendChild(denyButton);
    });
}


showMenu();