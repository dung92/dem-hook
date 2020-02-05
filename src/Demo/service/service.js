import {getList} from '../../Api/Api';
export const baseUrl = 'https://jsonplaceholder.typicode.com/users';
export const getListUser = () => {
  return getList(baseUrl);
};