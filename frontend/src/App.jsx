import { useState } from "react";
import "./App.css";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  function submitBlog(e) {
    e.preventDefault();

    const newBlog = {
      id: Date.now(),
      title,
      author,
      content,
      status: "Pending"
    };

    setBlogs([...blogs, newBlog]);
    setTitle("");
    setAuthor("");
    setContent("");
    setMessage("Your blog has been submitted for moderation!");
  }

  function moderateBlog(id, status) {
    setBlogs(
      blogs.map(blog =>
        blog.id === id ? { ...blog, status } : blog
      )
    );
  }

  return (
    <div className="app">
      <header>
        <h1>DevBlog</h1>
        <p>Share knowledge. Grow together.</p>
      </header>

      <main>
        <section className="form-box">
          <h2>Create a Developer Blog</h2>

          <form onSubmit={submitBlog}>
            <input
              placeholder="Blog title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />

            <input
              placeholder="Author name"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
            />

            <textarea
              placeholder="Write your blog here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />

            <button type="submit">Submit Blog</button>
          </form>

          <p>{message}</p>
        </section>

        <section>
          <h2>Blog Moderation Dashboard</h2>

          {blogs.length === 0 && (
            <p>No blogs submitted yet.</p>
          )}

          {blogs.map(blog => (
            <article className="blog-card" key={blog.id}>
              <h3>{blog.title}</h3>
              <p>By {blog.author}</p>
              <p>{blog.content}</p>
              <strong>Status: {blog.status}</strong>

              {blog.status === "Pending" && (
                <div className="actions">
                  <button
                    onClick={() =>
                      moderateBlog(blog.id, "Approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      moderateBlog(blog.id, "Rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      </main>

      <footer>
        <p>Developer Blogging Platform © 2026</p>
      </footer>
    </div>
  );
}

export default App;
