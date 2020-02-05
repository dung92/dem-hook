import axios from 'axios';
export const getList = (url) => {
  return axios.get(url);
};