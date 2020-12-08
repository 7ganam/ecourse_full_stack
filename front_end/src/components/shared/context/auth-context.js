import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  token: "",
  login: () => { },
  logout: () => { },

  show_login_modal: false,
  set_show_login_modal: () => { },
  unset_show_login_modal: () => { },
  show_signup_modal: false,
  set_show_signup_modal: () => { },
  unset_show_signup_modal: () => { },
  users: {},
  set_user: () => { },
});
