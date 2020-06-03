// Export Search class with constructor
export default class Search {
    // 1. Constructor - prop for selecting DOM elements
    constructor() {
        // Properties
        this.headerSearchIcon = document.querySelector(".header-search-icon");

        // Inject Search HTML and add props
        this.injectHTML();
        this.overlay = document.querySelector(".search-overlay");
        this.closeIcon = document.querySelector(".close-live-search");  // . class
        this.inputField = document.querySelector("#live-search-field"); // # id

        // Call the events method
        this.events();
    }

    // 2. Events method
    events() {
        // Search icon click event
        this.headerSearchIcon.addEventListener("click", (e) => {
            // Prevent A default click event
            e.preventDefault();
            this.openOverlay();
        });

        // Close icon click event
        this.closeIcon.addEventListener("click", () => this.closeOverlay());
    }

    // 3. Methods
    openOverlay() {
        this.overlay.classList.add("search-overlay--visible");
        // Wait 50ms before attempting to focus
        setTimeout(() => this.inputField.focus(), 50);
    }

    closeOverlay() {
        this.overlay.classList.remove("search-overlay--visible");
    }

    // Overlay HTML for Search feature
    injectHTML() {
        document.body.insertAdjacentHTML("beforeend", 
        `<!-- search feature begins -->
        <div class="search-overlay">
          <div class="search-overlay-top shadow-sm">
            <div class="container container--narrow">
              <label for="live-search-field" class="search-overlay-icon"><i class="fas fa-search"></i></label>
              <input type="text" id="live-search-field" class="live-search-field" placeholder="What are you interested in?">
              <span class="close-live-search"><i class="fas fa-times-circle"></i></span>
            </div>
          </div>
      
          <div class="search-overlay-bottom">
            <div class="container container--narrow py-3">
              <div class="circle-loader"></div>
              <div class="live-search-results live-search-results--visible">
                <div class="list-group shadow-sm">
                  <div class="list-group-item active"><strong>Search Results</strong> (4 items found)</div>
      
                  <a href="#" class="list-group-item list-group-item-action">
                    <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #1</strong>
                    <span class="text-muted small">by barksalot on 0/14/2019</span>
                  </a>
                  <a href="#" class="list-group-item list-group-item-action">
                    <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #2</strong>
                    <span class="text-muted small">by brad on 0/12/2019</span>
                  </a>
                  <a href="#" class="list-group-item list-group-item-action">
                    <img class="avatar-tiny" src="https://gravatar.com/avatar/b9216295c1e3931655bae6574ac0e4c2?s=128"> <strong>Example Post #3</strong>
                    <span class="text-muted small">by barksalot on 0/14/2019</span>
                  </a>
                  <a href="#" class="list-group-item list-group-item-action">
                    <img class="avatar-tiny" src="https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128"> <strong>Example Post #4</strong>
                    <span class="text-muted small">by brad on 0/12/2019</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- search feature end -->`);
    }
}