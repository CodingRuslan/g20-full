import axios from 'axios';

const _apiBase = !!process.env.REACT_APP_API_URL ?
  process.env.REACT_APP_API_URL : 'http://localhost:4000';

export default class DashboardService {

  async addResources() {
    return axios.get(`${_apiBase}/reference-book/add-resources`);
  }

  async getAllCountries() {
    return axios.get(`${_apiBase}/reference-book/countries`);
  }

  async getAllResources() {
    return axios.get(`${_apiBase}/reference-book/resources`);
  }

  async createTrade(data) {
    return axios.post(`${_apiBase}/reference-book/create-trade`, data);
  }

  async getAllTrades() {
    return axios.get(`${_apiBase}/reference-book/trades`);
  }

  async getAllAds() {
    return axios.get(`${_apiBase}/reference-book/ads`);
  }

  async downloadTradeDatabase() {
    return axios.get(`${_apiBase}/reference-book/download-trade-data`, { responseType: 'blob'});
  }

  async getAllClosedTrades() {
    return axios.get(`${_apiBase}/reference-book/closed-trades`);
  }

  async getInfoAboutContries() {
    return axios.get(`${_apiBase}/reference-book/countries-stats`);
  }

  async getAllBuilds() {
    return axios.get(`${_apiBase}/reference-book/builds`);
  }

  async createBuild(body) {
    return axios.post(`${_apiBase}/reference-book/create-build`, body);
  }

  async addMoney(body) {
    return axios.post(`${_apiBase}/reference-book/add-money`, body);
  }

  async setTimerResourceUpdating(body) {
    return axios.post(`${_apiBase}/reference-book/add-resources-timer`, body);
  }

  async getTimerResourceUpdating() {
    return axios.get(`${_apiBase}/reference-book/add-resources-timer`);
  }

  async deleteTimerResourceUpdating() {
    return axios.delete(`${_apiBase}/reference-book/add-resources-timer`);
  }

  async deleteTrade(body) {
    return axios.post(`${_apiBase}/reference-book/trade`, body);
  }

  async importDatabase(body) {
      return axios.post(`${_apiBase}/reference-book/import-data`, body);
  }

  async addResourceToCountry(body) {
    return axios.post(`${_apiBase}/reference-book/add-resource-country`, body);
  }

  async getGameStatus() {
    return axios.get(`${_apiBase}/reference-book/is-game-going`);
  }

  async getHeaderLinks() {
    return axios.get(`${_apiBase}/reference-book/header-links`);
  }

  async setGameStatus() {
    return axios.post(`${_apiBase}/reference-book/set-game-status`);
  }

  async addResourceToAll(body) {
    return axios.post(`${_apiBase}/reference-book/add-resource-all`, body);
  }
}
