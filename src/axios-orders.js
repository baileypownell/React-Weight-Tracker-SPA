import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://weight-tracker-91762.firebaseio.com/'
});

export default instance;
