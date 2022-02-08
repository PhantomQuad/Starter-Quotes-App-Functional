import React, { useState, useEffect } from "react";
import axios from "axios";
import {ApiClient} from "./ApiClient";

function App() {
  const [quotes, cQuotes] = useState({
    content: "",
    author: "",
    tags: [],
  });

  const [fetching, cFetching] = useState(false);
  const [authors, cAuthors] = useState([]);
  const [lastIndex, cLastIndex] = useState(20);
  const [pageSize, cPageSize] = useState(20);
  const [authorId, cAuthorId] = useState(undefined);
  const apiClient = new ApiClient();

  const updateAuthors = (response) => {
    const authorlist = response.results.map((author) => ({
      name: author.name,
      count: author.quoteCount,
    }));
    cAuthors(authorlist);
    console.log(authorlist);
  };

  const updateQuote = (jsonResponse) => {
    cQuotes({
      content: jsonResponse.content,
      author: jsonResponse.author,
      tags: jsonResponse.tags,
    });
  };

  const refreshQuote = () => {
    cQuotes({
      content: "Loading...",
      author: "",
      tags: [],
    });
    cFetching(true);

    apiClient.getQuote()
      .then((res) => {
        updateQuote(res.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(cFetching(false));
  };

  const listAuthors = (skip = 0) => {
    skip = skip > 0 ? skip:0
    apiClient.getAuthors(skip, pageSize)
      .then((res) => {
        updateAuthors(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const refreshAuthors = (next) => {
    if (next) {
      listAuthors(lastIndex);
      cLastIndex(lastIndex + pageSize);
    }
  };

  const refreshPagination = (event) => {
    cPageSize(parseInt(event.target.value));
    cLastIndex(parseInt(event.target.value));
  };

  useEffect(() => {
    listAuthors();
  }, [pageSize]);

  useEffect(() => {
    refreshQuote();
  }, []);

  const buildAuthorTable = () => {
    return authors.map((author, index) => {
      return (
        <tr key={index}>
          <td>{author.name}</td>
          <td>{author.count}</td>
        </tr>
      );
    });
  };

  return (
    <>
      <h1>Quote of the day</h1>
      <p>
        <b>Content:</b> {quotes.content}{" "}
      </p>
      <p>
        <b>Author:</b> {quotes.author}{" "}
      </p>
      <p>
        <b>Tags:</b> {quotes.tags.join(", ")}
      </p>
      <button disabled={fetching} onClick={() => refreshQuote()}>
        New Quote
      </button>
      <br />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number of Quotes</th>
          </tr>
        </thead>
        <tbody>{buildAuthorTable()}</tbody>
      </table>
      <button onClick={() => refreshAuthors(true)}>Next</button>
      <br />
      Page Size
      <br />
      <select onChange={(e) => refreshPagination(e)} value={pageSize}>
        <option value="10"> 10</option>
        <option value="20"> 20</option>
        <option value="30"> 30</option>
      </select>
    </>
  );
}

export default App;
