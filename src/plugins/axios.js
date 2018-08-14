import axios from 'axios';
import VueAxios from 'vue-axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL || `http://${window.location.hostname}:3001`,
});

export default ({ Vue }) => {
  console.log(window.location.hostname);
  Vue.use(VueAxios, axiosInstance);
};
