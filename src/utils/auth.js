import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}


export function getSelection() {
  return Cookies.get('user_selection');
}

export function setSelection(selection) {
  return  Cookies.set('user_selection', selection, { expires: 7 });
}

export function removeSelection(selection) {
  return  Cookies.remove('user_selection');
}
