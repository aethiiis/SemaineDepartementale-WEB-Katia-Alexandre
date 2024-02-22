import { css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";

export class RebeepView extends BeeperBase {
  static properties = {
    rebeep: {
      type: Object,
    },
  };

  constructor() {
    super();
  }

  async handleLike() {
    if (this.rebeep.liked) {
      await fetch(`/api/unlikeResponse/${this.rebeep.id}`, {
        method: "PUT",
      });
      this.rebeep = {
        ...this.rebeep,
        liked: false,
        likeCount: this.rebeep.likeCount - 1,
      };
    } else {
      await fetch(`/api/likeResponse/${this.rebeep.id}`, {
        method: "PUT",
      });
      this.rebeep = {
        ...this.rebeep,
        liked: true,
        likeCount: this.rebeep.likeCount + 1,
      };
    }
  }

  render() {
    return html` <div class="rebeep">
      <div class="rebeep-header">
        <img
          src="${this.rebeep.authorPicture}"
          alt="Profile picture of ${this.rebeep.authorName}"
          class="author-profile-picture"
        />
        <div>
          <a class="author" href="/user/${this.rebeep.authorName}">
            ${this.rebeep.authorName}
          </a>
          <span class="created-at">
            &nbsp;- ${new Date(this.rebeep.createdAt).toLocaleString()} -&nbsp;
          </span>
          <span
            class="likes ${this.rebeep.liked ? "liked" : ""}"
            ${this.rebeep.liked ? "data-liked" : ""}
          >
            <span
              class="like-count ${this.rebeep.liked ? "liked" : ""}"
              @click=${this.handleLike}
            >
              ${this.rebeep.likeCount}
            </span>
            +
          </span>
        </div>
      </div>
      <div>${this.rebeep.content}</div>
    </div>`;
  }

  static styles = [
    BeeperBase.styles,
    css`
      .rebeep {
        margin-bottom: 16px;
        margin-left: auto; 
        margin-right: 0;
        background-color: #DBD2F0;
        padding: 5px;
        border-radius: 10px;
        width: 75%;
      }

      .rebeep-header {
        display: flex;
        align-items: center;
      }

      .author-profile-picture {
        display: block;
        height: 24px;
        width: 24px;
        border-radius: 50%;
        margin-right: 6px;
      }

      .author {
        font-weight: bold;
      }

      .created-at {
        font-style: italic;
        font-size: 14px;
      }

      .likes {
        font-size: 12px;
        cursor: pointer;
      }

      .liked {
        font-weight: bold;
      }
    `,
  ];
}

customElements.define("rebeep-view", RebeepView);
