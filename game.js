// game.js

// Function to load the level content
function loadLevel1() {
  fetch('levels/level1.html')
      .then(response => response.text())
      .then(html => {
          document.getElementById('post-board-container').innerHTML = html;
          console.log('Level 1 loaded.');
      })
      .catch(error => console.error('Error loading level 1:', error));
}

// Function to load and display the order book HTML
function loadOrderBookHTML() {
  const ordersContainer = document.querySelector('orders');
  if (!ordersContainer) {
      console.error("Error: <orders> element not found in HTML.");
      return;
  }

  fetch('orderbook.html')
      .then(response => response.text())
      .then(html => {
          ordersContainer.innerHTML = html;
          console.log('Order book HTML loaded.');

          // Now that the HTML is loaded, you might want to access
          // elements within it and update them with the actual task data
          // from your orderBook.js.
          updateOrderDisplay();
      })
      .catch(error => console.error('Error loading order book HTML:', error));
}

// Function to update the order display with data from orderbook.js
function updateOrderDisplay() {
  const ordersContainer = document.querySelector('orders .post-board'); // Adjust selector if needed
  if (!ordersContainer) {
      console.error("Error: <orders> .post-board container not found.");
      return;
  }

  // Assuming orderBook is a global variable populated by orderbook.js
  if (typeof orderBook !== 'undefined' && orderBook.getOrders) {
      const tasks = orderBook.getOrders();
      let tasksHTML = '';
      tasks.forEach((task, index) => {
          // Assuming each task should correspond to one .post div
          const postDiv = ordersContainer.children[index + 1]; // Skip the header

          if (postDiv && postDiv.classList.contains('post')) {
              const postTextElement = postDiv.querySelector('.post-text');
              if (postTextElement) {
                  postTextElement.textContent = task.description + (task.completed ? ' (Completed)' : ' (Pending)');
              }
              // You can update other elements within the .post div here if needed
          } else {
              console.warn(`Warning: Could not find a corresponding .post element for task ${task.id}`);
          }
      });
  } else {
      console.error("Error: orderBook object not found or not initialized for updating display.");
  }
}

// Call both functions when the game starts
window.addEventListener('load', () => {
  loadLevel1();
  loadOrderBookHTML();
});

// You might also want to call updateOrderDisplay() whenever the order book data changes
if (orderBook && orderBook.onOrderAdded) {
  const originalOnOrderAdded = orderBook.onOrderAdded;
  orderBook.onOrderAdded = (newOrder) => {
      originalOnOrderAdded(newOrder);
      updateOrderDisplay();
  };
}

if (orderBook && orderBook.onOrderCompleted) {
  const originalOnOrderCompleted = orderBook.onOrderCompleted;
  orderBook.onOrderCompleted = (completedOrder) => {
      originalOnOrderCompleted(completedOrder);
      updateOrderDisplay();
  };
}