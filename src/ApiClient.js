import axios from "axios";

export class ApiClient {
  status = (responseObject) => {
    if (responseObject.status >= 200 && responseObject.status < 300) {
      return Promise.resolve(responseObject);
    } else {
      return Promise.reject(new Error(responseObject.statusText));
    }
  };

  getQuote() {
    return this.getRequest("https://api.quotable.io/random")
  }

  getAuthors(skip = 0, limit) {
    return this.getRequest(`https://api.quotable.io/authors?skip=${skip}&limit=${limit}`)
  }

  getRequest(url) {
    return axios
      .get(url)
      .then(this.status)
      .catch((error) => {
        console.error(error);
      });
  }
}
