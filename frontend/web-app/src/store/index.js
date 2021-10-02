import { createStore } from 'vuex'
import axios from 'axios'


export default createStore({
  state: {
    account: {
      username: null,
      password: null,
    },
    status: '',
    user: {
      id: null,
      username: null,
      email: null,
      phone: null,
      token: null,
      is_active: false,
    },
  },
  getters: {
    GET_ACCOUNT: state => {
      return state.account
    },
    GET_STATUS: state => {
      return state.status
    },
    GET_USER: state => {
      return state.user
    },
 
  },

  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account.username = account.username
      state.account.password = account.password
    },
    SET_STATUS: (state, status) => {
      state.status = 'пользователь ' + status + ' создан успешно!';
    },
    SET_USER: (state, data) => {
      state.user.id = data.id
      state.user.username = data.username
      state.user.email = data.email
      state.user.phone = data.phone
      state.user.token = data.token
      state.user.is_active = data.is_active
    },
    SET_USER_DEFAULT: (state) => {
      state.user.id = null
      state.user.username = null
      state.user.email = null
      state.user.phone = null
      state.user.token = null
      state.user.is_active = false
    },

  },
  actions: {
    SET_ACCOUNT: async (context, account) => {
      await axios.post("http://localhost:8000/auth/users/", account).then(function (response) {
        if (response.status == 201) {
          context.commit('SET_ACCOUNT', account)
          context.commit('SET_STATUS', account.username)
        }
      }).catch(function (error) {
        console.log(error)
      })  
    },
    LOGIN: async (context, account) => {
      await axios.post("http://localhost:8000/auth/token/login", account).then(function (response) {
        if (response.status == 200) {
          let token = response.data.auth_token
          axios.get("http://localhost:8000/auth/users/me", {
                headers: {"Authorization": "token " + token},
                data: {
                    username: account.username,
                    password: account.password
                }
          }).then(function (response) {
            let id = response.data.id;
            let username = response.data.username;
            let email = response.data.email;
            let phone = response.data.phone;
            context.commit('SET_USER', {
              'id': id,
              'username': username,
              'email': email,
              'phone': phone,
              'token': token,
              'is_active': true
            });
          }).catch(function (error) {
            console.log(error)
          })
        }
      })
    },
    LOGOUT: async (context, token) => {
      // c axios.post почему-то не работает
      await axios({
        method: 'POST',
        url: "http://localhost:8000/auth/token/logout",
        headers: {"Authorization": "token " + token}
      }).then(function (response) {
        if (response.status == 204) {
          context.commit('SET_USER_DEFAULT')
          }}).catch(function (error) {
        console.log(error)
      })
    }
  },
})
