/**
 * orderbook.js
 *
 * Manages the incoming orders (tasks from the manager) for the current game level.
 */

class OrderBook {
    constructor(currentLevel) {
        this.currentLevel = currentLevel || "level1"; // Default to level1 if not provided
        this.orders = [];
        this.onOrderAdded = null; // Callback function to notify when a new order is added
        this.onOrderCompleted = null; // Callback function to notify when an order is completed
        this.initializeLevelTasks();
    }

    /**
     * Initializes the tasks specific to the current level.
     * Define the tasks for each level within this function.
     */
    initializeLevelTasks() {
        if (this.currentLevel === "level1") {
            this.orders = [
                {
                    id: "task1",
                    description: "Retrieve the manager's coffee mug from the break room.",
                    target: "break_room",
                    completed: false
                },
                {
                    id: "task2",
                    description: "Make 3 photocopies of the 'Urgent Report' document.",
                    item: "urgent_report",
                    quantity: 3,
                    completed: false
                },
                {
                    id: "task3",
                    description: "Water the office plant on the manager's desk.",
                    target: "manager_desk",
                    item: "office_plant",
                    completed: false
                },
                {
                    id: "task4",
                    description: "Fix the jammed paper shredder in the supply closet.",
                    item: "paper_shredder",
                    completed: false
                },
                {
                    id: "task5",
                    description: "Deliver the signed contract to the HR department.",
                    target: "hr_department",
                    item: "signed_contract",
                    completed: false
                }
                
            ];
            console.log(`Initialized tasks for ${this.currentLevel}.`);
            this.orders.forEach(order => {
                if (this.onOrderAdded) {
                    this.onOrderAdded(order);
                }
            });
        } else if (this.currentLevel === "level2") {
            this.orders = [
                // Define tasks for Level 2 here in the same format
                {
                    id: "task1_level2",
                    description: "Find the missing stapler in accounting.",
                    target: "accounting",
                    item: "stapler",
                    completed: false
                },
                {
                    id: "task2_level2",
                    description: "Organize the files on shelf B in the archive room.",
                    target: "archive_room",
                    completed: false
                },
                // Add more Level 2 tasks
            ];
            console.log(`Initialized tasks for ${this.currentLevel}.`);
            this.orders.forEach(order => {
                if (this.onOrderAdded) {
                    this.onOrderAdded(order);
                }
            });
        } else {
            console.warn(`No specific tasks defined for level: ${this.currentLevel}`);
        }
    }

    /**
     * Gets all the current orders (tasks) in the order book for the current level.
     * @returns {Array<object>} - An array of order objects.
     */
    getOrders() {
        return this.orders;
    }

    /**
     * Gets a specific order (task) by its ID.
     * @param {string} orderId - The ID of the order to retrieve.
     * @returns {object|undefined} - The order object if found, otherwise undefined.
     */
    getOrderById(orderId) {
        return this.orders.find(order => order.id === orderId);
    }

    /**
     * Marks an order (task) as completed.
     * @param {string} orderId - The ID of the order to mark as completed.
     */
    completeOrder(orderId) {
        const order = this.getOrderById(orderId);
        if (order && !order.completed) {
            order.completed = true;
            if (this.onOrderCompleted) {
                this.onOrderCompleted(order);
            }
            console.log(`Task completed: ${order.description}`);
            this.checkLevelCompletion();
        } else if (order && order.completed) {
            console.warn(`Task with ID ${orderId} is already completed.`);
        } else {
            console.warn(`Task with ID ${orderId} not found.`);
        }
    }

    /**
     * Checks if all tasks in the current level are completed.
     * You can implement logic here to trigger level completion events.
     */
    checkLevelCompletion() {
        const allCompleted = this.orders.every(order => order.completed);
        if (this.orders.length > 0 && allCompleted) {
            console.log(`All tasks for ${this.currentLevel} completed!`);
            // You might want to trigger a level end event here
        } else if (this.orders.length === 0) {
            console.log(`No tasks for ${this.currentLevel}.`);
        }
    }

    /**
     * Sets a callback function to be executed when a new order (task) is added (during initialization).
     * @param {function} callback - The function to call with the new order object.
     */
    setOnOrderAdded(callback) {
        this.onOrderAdded = callback;
    }

    /**
     * Sets a callback function to be executed when an order (task) is completed.
     * @param {function} callback - The function to call with the completed order object.
     */
    setOnOrderCompleted(callback) {
        this.onOrderCompleted = callback;
    }

    /**
     * You can add more functions here for dynamic task management, loading from external data, etc.
     */
}