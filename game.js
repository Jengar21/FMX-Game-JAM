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

// Function to load and display the order book
function loadOrderBook() {
  const ordersContainer = document.querySelector('orders');
  if (!ordersContainer) {
      console.error("Error: <orders> element not found in HTML.");
      return;
  }

  // Assuming orderBook is a global variable populated by orderbook.js
  if (typeof orderBook !== 'undefined' && orderBook.getOrders) {
      const orders = orderBook.getOrders();
      let ordersHTML = '<h2>Orders</h2><ul>';
      orders.forEach(order => {
          ordersHTML += `<li>${order.description} ${order.completed ? '(Completed)' : '(Pending)'}</li>`;
      });
      ordersHTML += '</ul>';
      ordersContainer.innerHTML = ordersHTML;
      console.log('Order book loaded.');

      // Optionally, you can set up a listener to update the order book
      // when an order is completed (if your orderBook has such a mechanism).
      if (orderBook.onOrderCompleted) {
          const originalOnOrderCompleted = orderBook.onOrderCompleted;
          orderBook.onOrderCompleted = (completedOrder) => {
              originalOnOrderCompleted(completedOrder);
              loadOrderBook(); // Reload the order book UI to reflect changes
          };
      }
  } else {
      console.error("Error: orderBook object not found or not initialized.");
      ordersContainer.innerHTML = '<p>Error loading orders.</p>';
  }
}

// Call both functions when the game starts
window.addEventListener('load', () => {
  loadLevel1();
  loadOrderBook();
});

// You might also want to call loadOrderBook() whenever the order book data changes
// (e.g., when a new task is added or an existing one is completed,
// if those actions happen after the initial load).
if (orderBook && orderBook.onOrderAdded) {
  const originalOnOrderAdded = orderBook.onOrderAdded;
  orderBook.onOrderAdded = (newOrder) => {
      originalOnOrderAdded(newOrder);
      loadOrderBook(); // Reload the order book UI when a new order is added
  };
}