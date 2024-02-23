import { LitElement, css, html } from "lit";

export class UserList extends LitElement{
  static properties = {
    userList: {
      type: Array,
    },
  };

  constructor() {
    super();
    this.userList = [];
  }

  static styles = css`
    p{
      margin: 0;
      position: relative;
      left: 90px;
    }

    a{
      text-decoration: none;
    }
    `;

    render() {
    return html`
      ${this.userList.map(
        (b) => html`<p><a href="/user/${b.name}">${b.name}</a></p>`
      )}
    `;
  }
}
customElements.define("user-list", UserList);
