import { css, html } from "lit";
import { BeeperBase } from "./beeper-base.js";
import "./rebeep-list.js";

export class BeepView extends BeeperBase {
  static properties = {
    beep: {
      type: Object,
    },
    rebeepList: {
      state: true,
    },
    nbLoaded: true
  };

  constructor() {
    super();
    this.rebeepList = [];
    this.show_reply_textarea = "visible";
    this.nbLoaded = 10;
  }

  async connectedCallback() {
    super.connectedCallback();
    const response = await fetch(`/api/beepResponses/${this.beep.id}/${this.nbLoaded}`);
    this.rebeepList = await response.json();
  }

  async handleLike() {
    if (this.beep.liked) {
      await fetch(`/api/unlike/${this.beep.id}`, {
        method: "PUT",
      });
      this.beep = {
        ...this.beep,
        liked: false,
        likeCount: this.beep.likeCount - 1,
      };
    } else {
      await fetch(`/api/like/${this.beep.id}`, {
        method: "PUT",
      });
      this.beep = {
        ...this.beep,
        liked: true,
        likeCount: this.beep.likeCount + 1,
      };
    }
  }

  show_textarea()  {  
    if (this.show_reply_textarea === "hidden") {
      this.show_reply_textarea = "visible";
    } else {
      this.show_reply_textarea = "hidden";
    }
 }

  async postRebeep(event) {
    if (event.code === "Enter" && !event.getModifierState("Shift")) {
      const textarea = event.target;

      let content = textarea.value;
      content = content.slice(0, content.length - 1);

      const response = await fetch(`/api/response/${this.beep.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });

      const postedRebeep = await response.json();

      textarea.value = "";

      this.rebeepList = [postedRebeep, ...this.rebeepList];
    }
  }

  async infiniteScroll() {
    this.nbLoaded += 10;
    await  this.connectedCallback();
  }

  render() {
    return html` <div class="beep">
      <div class="beep-header">
        <img
          src="${this.beep.authorPicture}"
          alt="Profile picture of ${this.beep.authorName}"
          class="author-profile-picture"
        />
        <div>
          <a class="author" href="/user/${this.beep.authorName}">
            ${this.beep.authorName}
          </a>
          <span class="created-at">
            &nbsp;- ${new Date(this.beep.createdAt).toLocaleString()} -&nbsp;
          </span>
          <span
            class="likes ${this.beep.liked ? "liked" : ""}"
            ${this.beep.liked ? "data-liked" : ""}
          >
            <span
              class="like-count ${this.beep.liked ? "liked" : ""}"
              @click=${this.handleLike}
            >
              ${this.beep.likeCount}
            </span>
            +
          </span>
        </div>
      </div>
      <div>${this.beep.content}</div>
      <div class="reply-box">
        <span class="label-reply" @click=${this.show_textarea}> Reply: </span>
        <textarea id="reply-textarea-${this.beep.id}" @keyup=${this.postRebeep}></textarea>
        </div>
    </div>
    <rebeep-list rebeepList=${JSON.stringify(this.rebeepList)}></rebeep-list>`;
  }

  static styles = [
    BeeperBase.styles,
    css`
      .beep {
        margin-bottom: 16px;
        background-color: #CFD9E5;
        padding: 5px;
        border-radius: 10px;
      }

      .beep-header {
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

      .reply-box {
        visibility: hidden;
        padding: 5px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .beep:hover .reply-box{
        visibility: visible;
      }

      textarea {
        padding: 10px 10px;
        border-radius: 10px;
        width: 50%;
        background-color: #f8f8f8;
        resize: none;
      }

      .label-reply {
        margin-right: 10px;
      }
    `,
  ];
}

customElements.define("beep-view", BeepView);
