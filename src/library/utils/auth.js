import Cookies from 'js-cookie'
import config from '@/config/user.env'

const TOKEN_KEY = config.modAuthCas

export const getToken = () => Cookies.get(TOKEN_KEY)

export const setToken = (token) => Cookies.set(TOKEN_KEY, token)

export const removeToken = () => Cookies.remove(TOKEN_KEY)
