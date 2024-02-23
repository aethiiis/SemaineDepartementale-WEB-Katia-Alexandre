import { css, html } from "lit";
import { getActiveUserProfile } from "../util/active-user-profile.js";
import { BeeperBase } from "./beeper-base.js";
import "../../component/user-list.js";

export class BeeperHeader extends BeeperBase {
  static properties = {
    profile: {
      state: true,
    },
    userList: {
      state: true,
    },
  };

  static styles = [
    BeeperBase.styles,
    css`
      .header {
        display: flex;
        align-items: center;
      }

      .profile-picture {
        border-radius: 50%;
        height: 48px;
        width: 48px;
      }

      .logout {
        margin-left: auto;
        border: none;
        cursor: pointer;
        font-style: italic;
      }

      .search-user-area {
        display: flex;
        align-items: center;
      }

      textarea {
        height: 25px;
        width: 50%;
        margin-left: 10px;
        border-radius: 5px;
        background-color: #f8f8f8;
        resize: none;
      }
    `,
  ];

  constructor() {
    super();
    this.profile = null;
    this.userList = [];
  }

  async connectedCallback() {
    super.connectedCallback();
    this.profile = await getActiveUserProfile();
  }

  async searchUser(event) {
    const textarea = event.target;
    let content = textarea.value;

    console.log(content);

    if (content == "") {
      console.log("vide");
      this.userList = [];
    }
    else {
      const response = await fetch(`/api/usersList/${content}`);
      this.userList = await response.json();
    }
    console.log(this.userList);
  }

  render() {
    return html`
      <div class="header">
        <a href="/home">🏠 Home</a>
        <a href="/logout" class="logout">logout - </a>
        <img class="profile-picture" src="${this.profile?.picture}" />
      </div>
      <div class="search-user-area">
        <span>Find a user:</span>
        <textarea @keyup=${this.searchUser}></textarea>
      </div>
      <user-list userList=${JSON.stringify(this.userList)}></user-list>
    `;
  }
}

customElements.define("beeper-header", BeeperHeader);
