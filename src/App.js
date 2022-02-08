import React, { useState, useEffect } from "react";

function App() {
  const [quotes, cQuotes] = useState({
    content: "",
    author: "",
    tags: [],
  });

  const updateQuote = (jsonResponse) => {
    cQuotes({
      content: jsonResponse.content,
      author: jsonResponse.author,
      tags: jsonResponse.tags,
    });
  };

  const status = (responseObject) => {
    if (responseObject.status >= 200 && responseObject.status < 300) {
      return Promise.resolve(responseObject);
    } else {
      return Promise.reject(new Error(responseObject.statusText));
    }
  };

  const refreshQuote = () => {
    cQuotes({
      content: "Loading...",
      author: "",
      tags: [],
    });

    fetch("https://api.quotable.io/random")
      .then(status)
      .then((res) => res.json())
      .then((res) => {
        updateQuote(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    refreshQuote();
  }, []);

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
    </>
  );
}

export default App;
