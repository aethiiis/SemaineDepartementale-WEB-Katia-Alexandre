import { css, html } from "lit";
import { BeeperBase } from "../../component/beeper-base.js";
import "../../component/beeper-header.js";
import "../../component/beep-list.js";
import { getActiveUserProfile } from "../../util/active-user-profile.js";

class UserPage extends BeeperBase {
  static properties = {
    userInfo: {
      state: true,
    },
    isSelf: {
      state: true,
    },
    NbLoaded: true,
  };

  constructor() {
    super();
    this.userInfo = null;
    this.isSelf = true;
    this.NbLoaded = 10;
  }

  async connectedCallback() {
    super.connectedCallback();
    const splitPath = window.location.pathname.split("/");
    const viewedUserName = splitPath[splitPath.length - 1];
    const response = await fetch(`/api/user/${viewedUserName}/${this.NbLoaded}`);
    this.userInfo = await response.json();

    this.isSelf =
      this.userInfo.viewedUser.id === (await getActiveUserProfile()).id;
  }

  async follow() {
    if (this.userInfo.followed) {
      await fetch(`/api/unfollow/${this.userInfo.viewedUser.id}`, {
        method: "PUT",
      });
      this.userInfo = { ...this.userInfo, followed: false };
    } else {
      await fetch(`/api/follow/${this.userInfo.viewedUser.id}`, {
        method: "PUT",
      });
      this.userInfo = { ...this.userInfo, followed: true };
    }
  }

  async infiniteScroll() {
    this.NbLoaded += 10;
    await this.connectedCallback();
  }

  render() {
    return html` <beeper-header></beeper-header>
      <div class="user">
        <img
          class="viewed-user-profile-picture"
          src="${this.userInfo?.viewedUser.picture}"
          alt="Profile pic"
        />
        <span class="viewed-user-username"
          >${this.userInfo?.viewedUser.name}'s latest beeps</span
        >
        ${this.isSelf
          ? ""
          : html`<button @click=${this.follow} class="follow-button">
              ${this.userInfo?.followed ? "Unfollow" : "Follow"}
            </button>`}
      </div>

      <beep-list
        beepList=${JSON.stringify(
          this.userInfo === null ? [] : this.userInfo.beeps
        )}
      ></beep-list>`;
  }

  static styles = [
    BeeperBase.styles,
    css`
      .user {
        display: flex;
        align-items: center;
        margin-top: 24px;
        margin-bottom: 48px;
      }

      .viewed-user-profile-picture {
        height: 80px;
        width: 80px;
        border-radius: 50%;
        margin-right: 12px;
      }

      .viewed-user-username {
        font-size: 24px;
        font-weight: bold;
      }

      .follow-button {
        margin-left: auto;
        font-size: 16px;
        cursor: pointer;
        position: relative;
        bottom: -2px;
      }
    `,
  ];
}

customElements.define("user-page", UserPage);
