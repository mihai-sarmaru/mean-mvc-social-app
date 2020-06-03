// Export Search class with constructor
export default class Search {
    // 1. Constructor - prop for selecting DOM elements
    constructor() {
        // Properties
        this.headerSearchIcon = document.querySelector(".header-search-icon");

        // Call the events method
        this.events();
    }

    // 2. Events method
    events() {
        this.headerSearchIcon.addEventListener("click", (e) => {
            // Prevent A default click event
            e.preventDefault();
            this.openOverlay();
        });
    }

    // 3. Methods
    openOverlay() {
        alert("Open overlay executed.");
    }
}