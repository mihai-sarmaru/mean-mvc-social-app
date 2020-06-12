// Export Chat class
export default class Chat {
    // Constructor
    constructor() {
        this.chatWrapper = document.querySelector("#chat-wrapper");
        this.injectHTML();
        this.events();
    }

    // Events
    events() {

    }

    // Methods
    injectHTML() {
        this.chatWrapper.innerHTML = `
        <div class="chat-title-bar">Chat <span class="chat-title-bar-close"><i class="fas fa-times-circle"></i></span></div>
        <div id="chat" class="chat-log"></div>

        <form id="chatForm" class="chat-form border-top">
            <input type="text" class="chat-field" id="chatField" placeholder="Type a message…" autocomplete="off">
        </form>
        `;
    }
}