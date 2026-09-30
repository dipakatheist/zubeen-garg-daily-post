import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import { isSupabaseConfigured, supabase, type Article } from "./lib/supabase";
import JourneyPage from "./JourneyPage";

type SessionInfo = {
  email: string;
};

type ArticleFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string;
  published: boolean;
};

const demoArticles: Article[] = [
  {
    id: "demo-1",
    title: "The voice that reshaped Assamese music forever",
    slug: "voice-that-reshaped-assamese-music",
    excerpt:
      "From soulful ballads to electric live performances, Zubeen Garg's artistry stayed deeply rooted in emotion, identity, and fearless creativity.",
    content:
      "# The voice that reshaped Assamese music forever\n\nZubeen Garg's music did not simply entertain; it carried the emotional temperature of an entire generation. His voice could move seamlessly between folk roots, modern experimentation, and cinematic emotion without losing its human warmth.\n\nWhether singing in Assamese or reaching wider audiences through film and live concerts, he created music that felt intimate yet universal. He honoured tradition while refusing to stay confined by it.\n\nThat balance is the real reason his work remains memorable. He was not only a singer. He was a storyteller, a cultural bridge, and a reminder that popular music can still carry depth, pride, and feeling.",
    category: "Music",
    cover_image:
      "https://upload.wikimedia.org/wikipedia/commons/9/9e/Zubeen_Garg_in_Edufest_2016.jpg",
    published: true,
    created_at: "2024-11-18T09:00:00.000Z",
    updated_at: "2024-11-18T09:00:00.000Z",
  },
  {
    id: "demo-2",
    title: "Why Zubeen Garg still feels so personal to listeners",
    slug: "why-zubeen-garg-still-feels-so-personal",
    excerpt:
      "His songs carry a sincerity that makes listeners feel seen, whether they are hearing a melody in a crowded room or sitting quietly at home.",
    content:
      "# Why Zubeen Garg still feels so personal to listeners\n\nA singer's power is not measured only by chart success or stage presence. It lives in how a song sits inside a listener's memory. Zubeen Garg's songs became personal because they carried both vulnerability and courage.\n\nHis voice felt lived-in, not polished to a sterile perfection. It was expressive, raw, and emotionally direct. That honesty created trust, and trust makes a voice unforgettable.\n\nEven years later, many listeners return to his songs for comfort, nostalgia, and connection. That is the mark of a true artist: a body of work that continues to feel close long after the first listen.",
    category: "Legacy",
    cover_image:
      "https://upload.wikimedia.org/wikipedia/commons/e/e0/Zubeen_Garg_receiving_National_Award.jpg",
    published: true,
    created_at: "2025-01-28T15:30:00.000Z",
    updated_at: "2025-01-28T15:30:00.000Z",
  },
  {
    id: "demo-3",
    title: "A creative life beyond the stage",
    slug: "creative-life-beyond-the-stage",
    excerpt:
      "Zubeen Garg's legacy extends beyond performance, touching songwriting, cinema, cultural pride, and a deeply human way of connecting with people.",
    content:
      "# A creative life beyond the stage\n\nTo understand Zubeen Garg is to understand that creativity was never limited to one format. He moved between singing, composing, film work, and cultural expression with ease, but never lost the sincerity that gave his work its emotional weight.\n\nHis influence went beyond the sound. He gave people a language of feeling tied to place, memory, and identity. In that sense, he was not only a performer but a cultural voice that made artistic expression feel immediate and personal.\n\nThat is why his presence remains so significant. He did not simply make songs. He shaped feeling, memory, and the emotional atmosphere of the people who listened.",
    category: "Culture",
    cover_image:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Zubeen_Garg_in_Audio_Release_of_%22Zindagi%22_%28cropped%29.jpg",
    published: true,
    created_at: "2025-03-10T12:00:00.000Z",
    updated_at: "2025-03-10T12:00:00.000Z",
  },
];

const impactStories = [
  {
    year: 2019,
    title: "Flood relief fundraising in Guwahati",
    summary:
      "Reported public fundraising in Guwahati as Zubeen Garg took to the streets to collect funds for flood victims and support relief efforts.",
    source: "India Today NE",
    url: "https://news.google.com/search?q=Zubeen+Garg+Takes+to+Guwahati+Streets+to+Collect+Funds+for+Flood+Victims",
  },
  {
    year: 2025,
    title: "Final film proceeds redirected to flood relief",
    summary:
      "News reports said proceeds and GST share from his final film were dedicated to support flood-affected communities in Assam.",
    source: "The Times of India",
    url: "https://news.google.com/search?q=Assam%27s+tribute+to+Zubeen+Garg+GST+from+final+film+donated+support+flood",
  },
  {
    year: 2026,
    title: "Flood relief drive backed by his legacy",
    summary:
      "His wife joined the Assam film fraternity’s flood relief drive, showing how his public legacy continued to mobilise help for affected families.",
    source: "NDTV",
    url: "https://news.google.com/search?q=Zubeen+Garg%27s+Wife+Joins+Assam+Film+Fraternity%27s+Flood+Relief+Drive",
  },
  {
    year: 2026,
    title: "New homes and community support after floods",
    summary:
      "A community relief initiative renamed a settlement as 'Zubeen Nagar' after helping 18 flood-hit families get new homes, reflecting the humanitarian impact linked with his name.",
    source: "India Today NE",
    url: "https://news.google.com/search?q=Amguri+Shantiban+renamed+Zubeen+Nagar+18+flood-hit+families+new+homes",
  },
  {
    year: 2026,
    title: "Service in memory of Zubeen Garg",
    summary:
      "Across Assam, blood donation campaigns were held in his honour as a public service gesture tied to his memory and humanitarian spirit.",
    source: "India Today NE",
    url: "https://news.google.com/search?q=Zubeen+Garg+first+death+anniversary+blood+donation+campaign+Assam",
  },
];

const getDemoSession = (): SessionInfo | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem("zghy-demo-session");
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as SessionInfo;
    return session.email ? session : null;
  } catch {
    return null;
  }
};

const emptyForm = (): ArticleFormValues => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Journal",
  cover_image: "",
  published: true,
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

async function fetchPublishedArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured || !supabase) {
    return demoArticles.filter((article) => article.published);
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading published articles", error);
    return demoArticles.filter((article) => article.published);
  }

  return (data ?? []) as Article[];
}

async function fetchAllArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured || !supabase) {
    return demoArticles;
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading all articles", error);
    return demoArticles;
  }

  return (data ?? []) as Article[];
}

function App() {
  const [session, setSession] = useState<SessionInfo | null>(getDemoSession());
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setLoadingArticles(true);
      const nextArticles = await fetchPublishedArticles();
      setArticles(nextArticles);
      setLoadingArticles(false);
    };

    void loadArticles();
  }, []);

  useEffect(() => {
    if (!supabase) {
      const savedSession = getDemoSession();
      setSession(savedSession);
      return;
    }

    const client = supabase;

    const getSession = async () => {
      const { data } = await client.auth.getSession();
      setSession(data.session?.user.email ? { email: data.session.user.email } : null);
    };

    void getSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession?.user.email ? { email: nextSession.user.email } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav-wrap">
          <Link className="brand" to="/">
            <span className="brand-mark">ZGHY</span>
            <span className="brand-subtitle">Zubeen Garg</span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link to="/">Home</Link>
            <Link to="/journey">Journey</Link>
            <Link to="/impact">Impact</Link>
            <Link to="/login">Archive</Link>
            {session ? <Link to="/admin">Dashboard</Link> : <Link to="/login">Login</Link>}
            {session ? (
              <button className="nav-button" onClick={() => handleLogout(setSession)}>
                Log out
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="page-shell">
        <Routes>
          <Route path="/" element={<HomePage articles={articles} loading={loadingArticles} />} />
          <Route path="/journey" element={<JourneyPage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/login" element={<LoginPage onSessionChange={setSession} />} />
          <Route path="/admin" element={session ? <AdminPage /> : <Navigate to="/login" replace />} />
          <Route path="/:slug" element={<ArticlePage articles={articles} />} />
        </Routes>
      </main>
    </div>
  );
}

function handleLogout(setSession: (value: SessionInfo | null) => void) {
  if (supabase) {
    void supabase.auth.signOut();
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem("zghy-demo-session");
  }

  setSession(null);
}

function HomePage({ articles, loading }: { articles: Article[]; loading: boolean }) {
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <>
      <section className="hero container">
        {featuredArticle ? (
          <div className="hero-card">
            <div className="hero-copy">
              <span className="eyebrow">Essays • Music • Memory</span>
              <h1>{featuredArticle.title}</h1>
              <p>{featuredArticle.excerpt}</p>
              <div className="meta-row">
                <span>{featuredArticle.category}</span>
                <span>{formatDate(featuredArticle.created_at)}</span>
              </div>
              <div className="hero-actions">
                <Link className="primary-button" to={`/${featuredArticle.slug}`}>
                  Read feature
                </Link>
                <span className="mini-note">A journal on voice, culture, and identity.</span>
              </div>
            </div>
            <div className="hero-visual">
              <img src={featuredArticle.cover_image ?? ""} alt={featuredArticle.title} className="hero-image" />
              <div className="floating-card">
                <strong>Legacy</strong>
                <span>{featuredArticle.category}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="hero-placeholder">
            <h1>Fresh writing is on the way.</h1>
            <p>Use the login link above to publish new posts.</p>
          </div>
        )}
      </section>

      <section className="container archive-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Archive</span>
            <h2>Recent posts</h2>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading stories…</div>
        ) : (
          <div className="card-grid">
            {otherArticles.length > 0 ? (
              otherArticles.map((article) => (
                <article key={article.id} className="story-card">
                  <img src={article.cover_image ?? ""} alt={article.title} />
                  <div className="story-card-copy">
                    <span className="eyebrow">{article.category}</span>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <div className="meta-row compact-row">
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                    <Link to={`/${article.slug}`} className="text-link">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-state">No published posts yet.</div>
            )}
          </div>
        )}
      </section>
    </>
  );
}

function ArticlePage({ articles }: { articles: Article[] }) {
  const { slug } = useParams();
  const article = useMemo(
    () => articles.find((entry) => entry.slug === slug && entry.published),
    [articles, slug],
  );

  if (!article) {
    return (
      <section className="container article-empty">
        <h1>Article not found</h1>
        <p>The page you requested is not available or is still unpublished.</p>
        <Link className="primary-button" to="/">
          Back home
        </Link>
      </section>
    );
  }

  return (
    <article className="container article-page">
      <header className="article-header">
        <span className="eyebrow">{article.category}</span>
        <h1>{article.title}</h1>
        <div className="meta-row">
          <span>{formatDate(article.created_at)}</span>
        </div>
      </header>

      {article.cover_image ? <img className="article-banner" src={article.cover_image} alt={article.title} /> : null}

      <div className="article-body">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>
    </article>
  );
}

function ImpactPage() {
  const entriesByYear = impactStories.reduce<Record<number, typeof impactStories>>((accumulator, story) => {
    if (!accumulator[story.year]) {
      accumulator[story.year] = [];
    }
    accumulator[story.year].push(story);
    return accumulator;
  }, {});

  const years = Object.keys(entriesByYear)
    .map(Number)
    .sort((left, right) => right - left);

  return (
    <section className="container impact-page">
      <header className="impact-header">
        <span className="eyebrow">Humanity & service</span>
        <h1>Moments where Zubeen Garg helped people</h1>
        <p>
          A year-wise look at reported relief, fundraising, and public service efforts connected with his legacy.
        </p>
      </header>

      <div className="impact-timeline">
        {years.map((year) => (
          <div key={year} className="impact-year-block">
            <div className="impact-year-header">
              <span>{year}</span>
            </div>
            <div className="impact-list">
              {entriesByYear[year].map((story) => (
                <article key={`${story.year}-${story.title}`} className="impact-card">
                  <h2>{story.title}</h2>
                  <p>{story.summary}</p>
                  <div className="impact-meta">
                    <span>{story.source}</span>
                    <a href={story.url} target="_blank" rel="noreferrer">
                      Read coverage
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LoginPage({ onSessionChange }: { onSessionChange: (value: SessionInfo | null) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPending(true);

    try {
      if (!supabase || !isSupabaseConfigured) {
        const nextSession = { email };
        if (typeof window !== "undefined") {
          window.localStorage.setItem("zghy-demo-session", JSON.stringify(nextSession));
        }
        onSessionChange(nextSession);
        navigate((location.state as { from?: string } | null)?.from ?? "/admin");
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      onSessionChange({ email });
      navigate("/admin");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to log in.";
      setError(message);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="container auth-wrap">
      <div className="auth-card">
        <span className="eyebrow">Admin access</span>
        <h1>Log in to publish content</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <button className="primary-button" type="submit" disabled={pending}>
            {pending ? "Logging in…" : "Log in"}
          </button>
        </form>
        {!isSupabaseConfigured || !supabase ? (
          <p className="info-note">Demo mode is active because Supabase values are not set yet.</p>
        ) : null}
      </div>
    </section>
  );
}

function AdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [formValues, setFormValues] = useState<ArticleFormValues>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const loadArticles = async () => {
    setLoading(true);
    const nextArticles = await fetchAllArticles();
    setArticles(nextArticles);
    setLoading(false);
  };

  useEffect(() => {
    void loadArticles();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const sanitizedSlug = formValues.slug || slugify(formValues.title);
    const payload = {
      ...formValues,
      slug: sanitizedSlug,
      excerpt: formValues.excerpt || "A new post from the publishing desk.",
      content: formValues.content || "Start writing here...",
      cover_image: formValues.cover_image || null,
      category: formValues.category || "Journal",
      published: formValues.published,
    };

    if (!isSupabaseConfigured || !supabase) {
      const nextArticle: Article = {
        id: editingId ?? `demo-${Date.now()}`,
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content,
        category: payload.category,
        cover_image: payload.cover_image || null,
        published: payload.published,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const nextEntries = editingId
        ? articles.map((entry) => (entry.id === editingId ? { ...entry, ...nextArticle } : entry))
        : [nextArticle, ...articles];

      setArticles(nextEntries);
      setFormValues(emptyForm());
      setEditingId(null);
      setFeedback("Demo article saved.");
      return;
    }

    const record = {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      category: payload.category,
      cover_image: payload.cover_image || null,
      published: payload.published,
    };

    let result;
    if (editingId) {
      result = await supabase.from("articles").update(record).eq("id", editingId).select();
    } else {
      result = await supabase.from("articles").insert(record).select();
    }

    if (result.error) {
      setFeedback(result.error.message);
      return;
    }

    setFormValues(emptyForm());
    setEditingId(null);
    setFeedback(editingId ? "Article updated." : "Article published.");
    await loadArticles();
  };

  const startEdit = (article: Article) => {
    setEditingId(article.id);
    setFormValues({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      cover_image: article.cover_image ?? "",
      published: article.published,
    });
    setFeedback("");
  };

  const deleteEntry = async (id: string) => {
    if (!id) return;

    if (!isSupabaseConfigured || !supabase) {
      setArticles((current) => current.filter((article) => article.id !== id));
      setFeedback("Demo article removed.");
      return;
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      setFeedback(error.message);
      return;
    }

    setFeedback("Article removed.");
    await loadArticles();
  };

  return (
    <section className="container admin-layout">
      <div className="panel admin-panel">
        <div className="panel-header">
          <h2>{editingId ? "Edit article" : "Create article"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <label>
            Title
            <input
              value={formValues.title}
              onChange={(event) =>
                setFormValues((current) => ({
                  ...current,
                  title: event.target.value,
                  slug: current.slug || slugify(event.target.value),
                }))
              }
              placeholder="Post title"
              required
            />
          </label>

          <label>
            Slug
            <input
              value={formValues.slug}
              onChange={(event) => setFormValues((current) => ({ ...current, slug: event.target.value }))}
              placeholder="post-slug"
            />
          </label>

          <label>
            Category
            <input
              value={formValues.category}
              onChange={(event) => setFormValues((current) => ({ ...current, category: event.target.value }))}
              placeholder="Journal"
            />
          </label>

          <label>
            Cover image URL
            <input
              value={formValues.cover_image}
              onChange={(event) => setFormValues((current) => ({ ...current, cover_image: event.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <label>
            Excerpt
            <textarea
              rows={3}
              value={formValues.excerpt}
              onChange={(event) => setFormValues((current) => ({ ...current, excerpt: event.target.value }))}
            />
          </label>

          <label>
            Content
            <textarea
              rows={10}
              value={formValues.content}
              onChange={(event) => setFormValues((current) => ({ ...current, content: event.target.value }))}
            />
          </label>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={formValues.published}
              onChange={(event) => setFormValues((current) => ({ ...current, published: event.target.checked }))}
            />
            Publish immediately
          </label>

          {feedback ? <p className="success-text">{feedback}</p> : null}

          <div className="button-row">
            <button type="submit" className="primary-button">
              {editingId ? "Save changes" : "Publish article"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setEditingId(null);
                  setFormValues(emptyForm());
                  setFeedback("");
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Published posts</h2>
        </div>
        {loading ? (
          <div className="loading-state">Loading articles…</div>
        ) : (
          <ul className="article-list">
            {articles.length > 0 ? (
              articles.map((article) => (
                <li key={article.id} className="article-list-item">
                  <div>
                    <h3>{article.title}</h3>
                    <p>
                      {article.category} • {article.published ? "Published" : "Draft"}
                    </p>
                  </div>
                  <div className="table-actions">
                    <button type="button" className="secondary-button" onClick={() => startEdit(article)}>
                      Edit
                    </button>
                    <button type="button" className="danger-button" onClick={() => void deleteEntry(article.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="empty-state">No posts yet.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
}

export default App;
