import { css, html } from "lit";
import { BeeperBase } from "../../component/beeper-base.js";
import "../../component/beeper-header.js";
import "../../component/beep-list.js";
import { getActiveUserProfile } from "../../util/active-user-profile.js";

class BeeperHome extends BeeperBase {
  static properties = {
    userName: {
      state: true,
    },
    beepList: {
      state: true,
    },
    NbLoaded: true,
    NbBeeps: true
  };

  constructor() {
    super();
    this.beepList = [];
    this.NbBeeps = 0;
    this.userName = "";
    this.NbLoaded = 10;
  }

  async connectedCallback() {
    super.connectedCallback();
    const response = await fetch(`/api/home/${this.NbLoaded}`);
    this.beepList = await response.json();

    const response2 = await fetch(`/api/NbBeepsHome/`);
    const tmp = await response2.json();
    this.NbBeeps = tmp[0].count;

    this.userName = (await getActiveUserProfile()).name;
  }

  async postBeep(event) {
    if (event.code === "Enter" && !event.getModifierState("Shift")) {
      const textarea = event.target;

      let content = textarea.value;
      content = content.slice(0, content.length - 1);

      this.NbLoaded = 0;
      await this.connectedCallback();
      
      const response = await fetch("/api/beep", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const postedBeep = await response.json();

      textarea.value = "";

      this.beepList = [postedBeep, ...this.beepList];
      this.NbLoaded = 10;
      await this.connectedCallback();
    }
  }

  async infiniteScroll() {
    if (this.NbBeeps - this.NbLoaded > 0) {
      this.NbLoaded += 10;
      await this.connectedCallback();
    }
  }

  render() {
    return html` <beeper-header></beeper-header>
      <h1>Welcome ${this.userName}!</h1>
      <textarea @keyup=${this.postBeep} placeholder="Type your message here..."></textarea>
      <beep-list beepList=${JSON.stringify(this.beepList)}></beep-list>`;
  }

  static styles = [
    BeeperBase.styles,
    css`
      textarea {
        width: 100%;
        height: 64px;
        margin: 10px 0 20px 0;
        padding: 10px 10px;
        border-radius: 10px;
        background-color: #f8f8f8;
        resize: none;
      }
    `,
  ];
}

customElements.define("beeper-home", BeeperHome);

document.addEventListener('scroll', event => {
  if (Math.abs(document.body.scrollHeight - (window.scrollY + window.innerHeight)) < 50) {
      document.querySelector("beeper-home").infiniteScroll();
  }
});