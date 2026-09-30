import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type JourneyCategory = "Music" | "Films" | "Awards" | "Performances" | "Personal Milestones";
type FilterCategory = "All" | JourneyCategory;

type JourneyPhoto = {
  url: string;
  caption: string;
  year: string;
  source: string;
  photographer: string;
  license: string;
  alt: string;
};

type JourneySource = {
  label: string;
  url: string;
};

type JourneyEvent = {
  id: string;
  year: number;
  date?: string;
  title: string;
  category: JourneyCategory;
  location?: string;
  story: string;
  details: string;
  photo?: JourneyPhoto;
  sources: JourneySource[];
};

const commonsLicense = "CC BY-SA 4.0";
const licenseUrl = "https://creativecommons.org/licenses/by-sa/4.0/";

const photos = {
  edufest: {
    url: "/images/zubeen-edufest-2016.jpg",
    caption: "Zubeen Garg performing at Edufest, Guwahati.",
    year: "2016",
    source: "Wikimedia Commons",
    photographer: "Gitartha.bordoloi",
    license: commonsLicense,
    alt: "Zubeen Garg performing on stage at Edufest 2016",
  },
  concert: {
    url: "/images/zubeen-concert-2016.jpg",
    caption: "Zubeen Garg performing at a concert in Guwahati.",
    year: "2016",
    source: "Wikimedia Commons",
    photographer: "Gitartha.bordoloi",
    license: commonsLicense,
    alt: "Zubeen Garg singing at a concert in Guwahati in 2016",
  },
  award: {
    url: "/images/zubeen-national-film-award-2009.jpg",
    caption: "The President of India presenting Zubeen Garg with the 55th National Film Award.",
    year: "2009",
    source: "Wikimedia Commons / Press Information Bureau, Ministry of Information & Broadcasting",
    photographer: "Government of India",
    license: commonsLicense,
    alt: "Zubeen Garg receiving the National Film Award from President Pratibha Patil",
  },
} satisfies Record<string, JourneyPhoto>;

const sources = {
  news18: {
    label: "News18 — biographical profile",
    url: "https://news.google.com/rss/articles/CBMizAFBVV95cUxNUVpkYTRfQlg1WGRRUE93cnZJTFR1UE5nMnRQVVN2Zk1sSU5teFFPekl6OGNTbmVTZFZkLWZ5enRnalNmVy0ycnozOThSNzdlWGdXUV9XZk1ncWF0dDJXTkhrNjFaUHJwUEUyMi1aYU9WX1kyYkhQaGFJRlAtY0tpUFpBRHFSOGxmTlpDWXNQSUNtb0hTN3VveEExOG1jelRKem1Zc1IzSnFienIxLTF2ay12a2cyVmRISDM3aVhNdnJsaXN6YzZQSHk4MXXSAdIBQVVfeXFMTnYxQ3pzQzdVOWtsMmlRcWc3Mm5LcHBNajRiMzVzb1FWeFR0c3Q1UTEweTlrTGlWZk9WTVJ6T0FsS1FVOXNrZ25VejBSRmFNUGVDdXZpbkdxMTR5bElPS0dzUnprMWVFRzhsNkwzb1dOY0lmZ3prX1hQNlp3OVhJUTA2NlA4R1luejNoSUdfUS1UT0JkQ3J4dTFwUW4tdjdTSXRydmt3UG0tMDY5Rm11TGtWVW1RLUFHXzJ3YjJnOWFnOWpzWDJiTzZUMTVnZ0sxTC13?oc=5",
  },
  anamika: {
    label: "The Assam Tribune — Anamika retrospective",
    url: "https://news.google.com/rss/articles/CBMirgFBVV95cUxPMHJiVmpHYVBhQjNJWW52TW5ISEwzd1RReFRfQ1Nlc1pRY1NwQ2lCUGRtcFF5ZVQzUlQyNzRTZkdWTHFxdmYwTEl5Q3FiWE13NTNrY0VxZnY2OGtMZl8xQWdoS0ZJUEdLVGQxU2NkUzgyeFhPeVNjYy1ZQ2Q2bFJrVVVjX0NueldMOUs2anZFVGlPeWNScGJIRkpDUGtiMzVZTTVNcW9kNTViZnZnWXfSAbMBQVVfeXFMUEpfbDIzU3ZOWWtQZVV5U3JvTjBhTG8wUWtQQ2VYTXZyREk4QjlHbkgwOVBVQ1I2bHRjTVNqYTRBVmFNdllmZjB6aHNpNlhMSkZXTG41M0JhNWxvMzIwVkxLS0hGRXYtdUVRcWZlRlRJUV9IN3BOV2UxQmRwdnNmSk9FUWduek50TGZxMF9xanhJVFF5cW5ZcldUbGpIYWxqMDVKdmg4Si1QLWxMdEo5UFZ3WkU?oc=5",
  },
  hindu: {
    label: "The Hindu — report on his passing",
    url: "https://news.google.com/rss/articles/CBMi0AFBVV95cUxPY3RmaUpMbW9lOVkwNmw2a0VteWxmRlJtQnlQMm5USlFOZFdnMmxXay1qZmMwbGZ5YlB6YnhqeDVLT1hNV1ExM294dDNMdGpPOS1nNTlOTUhlNzBFSFdRb0h6ME9VNHA2SlpobmZaUTBzb0QxVlBxY2NjOVhjcEZhYm9ucHUyYXdrZ3EyeGlrRUMtaGdYLW5iVHg0SFNiNG5OZ1V4VllUeTBJa3FmQnFCdDl6akxtU3FwRk15XzFVbmpScHIyb0k4SERXeHhhcHNr0gHXAUFVX3lxTE5FYUJXRWpIUXpHVHRia3dsbmNxSmx5Zk5VOG13R09YUU9nYWVLQVhVdTZmd0FsRzlJdHdKQ2gtb1lwV1ZoY2wwdUZlbENraWo4eGhYdDhqQll2eHc4R3AwaGpoRzBsQ1hVczhlZ0FaV01wSkd3QmpUbmh6VV9IVzU1Ym1vZF9Od1JZQ2RZc3lMUTFqdDZjUGpIZFp3eGcwOU5LRWdNdjltZzg3TzRCMm56WENNdm1oSWVDZjRxMjdzTkRKdDlxZVlnVjQ2OFNmRlRYUFB2alN3?oc=5",
  },
  coroner: {
    label: "CNA — Singapore coroner’s finding",
    url: "https://news.google.com/rss/articles/CBMikAFBVV95cUxPRklXVEpmRGFLWVdSQUJlaVVZWXFxbGdtaDRwWGU2STY4WjVMOW15ODE5RE91cTlBdExfdFlSNmhWbGRYT1dOUnYtUV84RjRmTkdkZGZxZGptN0FHLW9TS2F5VHdWWndVeGFrX0pKaVN5ck9MYjFWQnZMZ3hiMGJNWWpubnlOakVvNUVCX3dSX0k?oc=5",
  },
  commonsEdufest: {
    label: "Wikimedia Commons — image details and license",
    url: "https://commons.wikimedia.org/wiki/File:Zubeen_Garg_in_Edufest_2016.jpg",
  },
  commonsConcert: {
    label: "Wikimedia Commons — image details and license",
    url: "https://commons.wikimedia.org/wiki/File:Zubeen_Garg_in_a_concert_in_2016_(2).jpg",
  },
  commonsAward: {
    label: "Wikimedia Commons — image details and license",
    url: "https://commons.wikimedia.org/wiki/File:Zubeen_Garg_receiving_National_Award.jpg",
  },
};

const events: JourneyEvent[] = [
  {
    id: "birth",
    year: 1972,
    date: "18 November 1972",
    title: "Born in Tura",
    category: "Personal Milestones",
    location: "Tura, Meghalaya, India",
    story:
      "Zubeen Garg was born in Tura, in present-day Meghalaya. His life would become closely associated with Assam and its music, while his birthplace reflects the region’s interconnected cultural landscape.",
    details:
      "Public biographies identify his birth date as 18 November 1972. Family and childhood accounts are less consistently documented in strong primary sources, so this page avoids repeating colourful or unverified anecdotes about his early years.",
    sources: [sources.news18],
  },
  {
    id: "anamika",
    year: 1992,
    title: "Anamika begins a recording career",
    category: "Music",
    location: "Assam",
    story:
      "Anamika is widely identified as Zubeen Garg’s debut Assamese album. Its release marks the beginning of the professional recording story told in this timeline.",
    details:
      "The Assam Tribune’s retrospective connects Anamika with the beginning of his recorded journey. Later recollections often add detail about his childhood training, instruments, and early contests; where a dependable source was not established, those details have been left out rather than presented as fact.",
    sources: [sources.anamika, sources.news18],
  },
  {
    id: "ya-ali",
    year: 2006,
    title: "A Hindi film song reaches a national audience",
    category: "Films",
    location: "Hindi cinema",
    story:
      "Garg sang “Ya Ali” for the Hindi film Gangster: A Love Story. The song brought his voice to a much wider audience beyond Assamese-language music.",
    details:
      "This milestone is included as a documented screen credit, not as a claim that one song alone defines his career. His work remained rooted in Assamese music while also reaching listeners through Hindi and other-language recordings.",
    photo: photos.edufest,
    sources: [sources.news18, sources.commonsEdufest],
  },
  {
    id: "national-award",
    year: 2009,
    date: "21 October 2009",
    title: "National Film Award for Echoes of Silence",
    category: "Awards",
    location: "New Delhi, India",
    story:
      "At the 55th National Film Awards, Zubeen Garg received the Best Music Direction award for the non-feature film Echoes of Silence.",
    details:
      "The award photograph’s Commons description identifies the film, category, presenter, ceremony, and date. It credits the image to India’s Ministry of Information & Broadcasting and Press Information Bureau.",
    photo: photos.award,
    sources: [sources.commonsAward],
  },
  {
    id: "gains-in-assamese-music",
    year: 2016,
    date: "29 January 2016",
    title: "A live voice, close to home",
    category: "Performances",
    location: "Guwahati, Assam",
    story:
      "A documented concert photograph from Guwahati captures Garg at work on stage: the live performance was an enduring part of his connection with audiences.",
    details:
      "The date and location here refer specifically to the Wikimedia Commons photograph’s description, not a claim that this was a career-defining concert. The image is credited to Gitartha.bordoloi under CC BY-SA 4.0.",
    photo: photos.concert,
    sources: [sources.commonsConcert],
  },
  {
    id: "death",
    year: 2025,
    date: "19 September 2025",
    title: "A final chapter in Singapore",
    category: "Personal Milestones",
    location: "Singapore",
    story:
      "Zubeen Garg died in Singapore at the age of 52. Singapore’s coroner later ruled that he died by accidental drowning and found no evidence of foul play.",
    details:
      "The Singapore coroner’s conclusion is reported by CNA on 25 March 2026. This account distinguishes that official finding from the speculation and allegations that circulated in the immediate aftermath. No graphic imagery is used.",
    sources: [sources.hindu, sources.coroner],
  },
];

const filters: FilterCategory[] = [
  "All",
  "Music",
  "Films",
  "Awards",
  "Performances",
  "Personal Milestones",
];

const periods = [
  { label: "Early life", target: "early-life" },
  { label: "First recordings", target: "first-recordings" },
  { label: "Across India", target: "national-recognition" },
  { label: "Legacy", target: "legacy" },
];

function PhotoCredit({ photo, sourceUrl }: { photo: JourneyPhoto; sourceUrl: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`journey-photo${failed ? " journey-photo--fallback" : ""}`}>
      {failed ? (
        <div className="photo-fallback" role="img" aria-label={photo.alt}>
          <span>Archival photograph unavailable</span>
          <small>{photo.year}</small>
        </div>
      ) : (
        <img
          src={photo.url}
          alt={photo.alt}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <figcaption>
        <span>{photo.caption} {photo.year}</span>
        <span>
          Photo: {photo.photographer} · {photo.source} ·{" "}
          <a href={licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a> ·{" "}
          <a href={sourceUrl} target="_blank" rel="noreferrer">
            Photo source
          </a>
        </span>
      </figcaption>
    </figure>
  );
}

function SourceLinks({ items }: { items: JourneySource[] }) {
  return (
    <div className="journey-sources">
      <span>Sources</span>
      {items.map((source) => (
        <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
          {source.label}
        </a>
      ))}
    </div>
  );
}

function StorySection({
  id,
  eyebrow,
  heading,
  year,
  children,
  photo,
  sourceUrl,
  reverse = false,
  dark = false,
}: {
  id: string;
  eyebrow: string;
  heading: string;
  year: string;
  children: React.ReactNode;
  photo: JourneyPhoto;
  sourceUrl: string;
  reverse?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`journey-story${reverse ? " journey-story--reverse" : ""}${dark ? " journey-story--dark" : ""}`}
    >
      <div className="journey-story-media">
        <PhotoCredit photo={photo} sourceUrl={sourceUrl} />
      </div>
      <div className="journey-story-copy">
        <span className="journey-year">{year}</span>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{heading}</h2>
        {children}
      </div>
    </section>
  );
}

function JourneyPage() {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("All");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const visibleEvents =
    selectedFilter === "All" ? events : events.filter((event) => event.category === selectedFilter);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "The Journey of Zubeen Garg | ZGHY";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="journey-page">
      <section className="journey-hero">
        <div className="journey-hero-image" aria-hidden="true">
          <img src={photos.edufest.url} alt="" fetchPriority="high" />
        </div>
        <div className="journey-hero-scrim" />
        <div className="journey-hero-content">
          <Link className="journey-back-link" to="/">
            ← Back to Home
          </Link>
          <span className="journey-kicker">A musical life · Assam to the world</span>
          <h1>The Journey of<br />Zubeen Garg</h1>
          <p>
            From a young musician in Assam to one of the most recognizable voices of Assamese music and cinema.
          </p>
          <a className="journey-begin" href="#timeline">
            Begin the Journey <span aria-hidden="true">↓</span>
          </a>
          <div className="journey-hero-credit">
            Photo: Gitartha.bordoloi / Wikimedia Commons · CC BY-SA 4.0 ·{" "}
            <a href={sources.commonsEdufest.url} target="_blank" rel="noreferrer">Details</a>
          </div>
        </div>
        <div className="journey-hero-note">A DOCUMENTED BIOGRAPHY · FACTS WITH SOURCES</div>
      </section>

      <div className="journey-layout" id="timeline">
        <aside className="journey-side-nav" aria-label="Journey chapters">
          <span>Chapters</span>
          {periods.map((period, index) => (
            <a key={period.target} href={`#${period.target}`}>
              <small>0{index + 1}</small> {period.label}
            </a>
          ))}
        </aside>

        <main className="journey-main">
          <div className="journey-intro">
            <span className="eyebrow">The archive</span>
            <h2>One life. Many soundtracks.</h2>
            <p>
              A visual biography shaped by dated records, published reporting and credited photographs.
              Where a detail could not be reliably confirmed, it has been left out.
            </p>
          </div>

          <StorySection
            id="early-life"
            eyebrow="Chapter 01 · Beginnings"
            heading="A beginning in the hills"
            year="1972"
            photo={photos.edufest}
            sourceUrl={sources.commonsEdufest.url}
          >
            <p>
              Zubeen Garg was born on 18 November 1972 in Tura, Meghalaya. Though born outside Assam,
              his artistic life became inseparable from Assamese music and culture.
            </p>
            <p>
              Accounts of his family background and childhood musical training vary in their detail.
              This biography keeps the early chapter to the facts documented in the cited profile and
              does not turn unverified anecdotes into history.
            </p>
            <SourceLinks items={[sources.news18]} />
          </StorySection>

          <StorySection
            id="first-recordings"
            eyebrow="Chapter 02 · First recordings"
            heading="Anamika, and the first recorded chapter"
            year="1992"
            photo={photos.concert}
            sourceUrl={sources.commonsConcert.url}
            reverse
          >
            <p>
              Anamika is identified in Assamese press retrospectives as Garg’s debut album. It marked
              the first recorded milestone in a career that would travel across languages and forms.
            </p>
            <p>
              A complete, reliably sourced account of his earliest lessons, instruments and first
              performances is not consistently available in the material consulted. Rather than
              repeating lore, the timeline begins where published documentation is firmer.
            </p>
            <SourceLinks items={[sources.anamika]} />
          </StorySection>

          <section id="national-recognition" className="journey-cinematic">
            <span className="eyebrow">Chapter 03 · Beyond borders</span>
            <h2>A voice that crossed languages</h2>
            <p>
              Garg’s reach expanded beyond Assamese recordings. “Ya Ali,” sung for the Hindi film
              <em> Gangster: A Love Story</em> (2006), brought his voice to a national film audience.
              Alongside playback singing, his career included composing and screen work.
            </p>
            <div className="journey-cinematic-credit">
              <PhotoCredit photo={photos.edufest} sourceUrl={sources.commonsEdufest.url} />
              <SourceLinks items={[sources.news18]} />
            </div>
          </section>

          <section id="film-work" className="journey-film-section">
            <div className="journey-section-heading">
              <span className="eyebrow">Chapter 04 · Film and music</span>
              <h2>Stories for the screen</h2>
              <p>
                Film work connected his voice and musical direction to stories on screen. This page
                includes only film milestones that could be tied to the cited record.
              </p>
            </div>
            <div className="journey-film-card">
              <PhotoCredit photo={photos.award} sourceUrl={sources.commonsAward.url} />
              <div>
                <span className="journey-year">2009 · Non-feature film</span>
                <h3><em>Echoes of Silence</em></h3>
                <p>
                  Garg received the National Film Award for Best Music Direction for this film at
                  the 55th National Film Awards.
                </p>
                <SourceLinks items={[sources.commonsAward]} />
              </div>
            </div>
          </section>

          <section className="journey-milestones">
            <div className="journey-section-heading">
              <span className="eyebrow">Interactive timeline</span>
              <h2>Milestones, with the record beside them</h2>
              <p>Choose a category, then open a moment to read more and follow its sources.</p>
            </div>
            <div className="journey-milestone-rail" aria-label="Jump to a career milestone">
              {events.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => {
                    setSelectedFilter("All");
                    setExpandedEvent(event.id);
                    window.requestAnimationFrame(() =>
                      window.requestAnimationFrame(() =>
                        document.getElementById(`journey-event-${event.id}`)?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        }),
                      ),
                    );
                  }}
                >
                  <small>{event.year}</small>
                  <span>{event.title}</span>
                </button>
              ))}
            </div>
            <div className="journey-filters" role="group" aria-label="Filter milestones by category">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={selectedFilter === filter}
                  className={selectedFilter === filter ? "is-selected" : ""}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="journey-timeline-list">
              {visibleEvents.map((event) => {
                const expanded = expandedEvent === event.id;
                return (
                  <article
                    id={`journey-event-${event.id}`}
                    key={event.id}
                    className={`journey-event${expanded ? " is-expanded" : ""}`}
                  >
                    <div className="journey-event-marker" aria-hidden="true" />
                    <button
                      type="button"
                      className="journey-event-trigger"
                      aria-expanded={expanded}
                      onClick={() => setExpandedEvent(expanded ? null : event.id)}
                    >
                      <span className="journey-event-date">{event.date ?? event.year}</span>
                      <span className="journey-event-label">{event.category}</span>
                      <span className="journey-event-title">{event.title}</span>
                      <span className="journey-event-location">{event.location ?? "Career milestone"}</span>
                      <span className="journey-event-toggle" aria-hidden="true">{expanded ? "−" : "+"}</span>
                    </button>
                    {expanded ? (
                      <div className="journey-event-detail">
                        {event.photo ? (
                          <PhotoCredit
                            photo={event.photo}
                            sourceUrl={event.photo === photos.award ? sources.commonsAward.url : event.photo === photos.concert ? sources.commonsConcert.url : sources.commonsEdufest.url}
                          />
                        ) : null}
                        <p>{event.story}</p>
                        <p>{event.details}</p>
                        <SourceLinks items={event.sources} />
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <StorySection
            id="community"
            eyebrow="Chapter 05 · The artist and his audience"
            heading="A cultural voice, remembered together"
            year="Across his career"
            photo={photos.concert}
            sourceUrl={sources.commonsConcert.url}
            dark
          >
            <p>
              His music connected popular song with Assamese language and cultural life. The public
              response to his work—and the scale of tributes after his death—shows how deeply his
              songs were woven into shared memory.
            </p>
            <p>
              This section describes the public record, not private character or beliefs. Personal
              stories from fans belong to community memory and should be identified as such when added.
            </p>
            <SourceLinks items={[sources.hindu]} />
          </StorySection>

          <section className="journey-final-chapter">
            <span className="eyebrow">Chapter 06 · Final chapter</span>
            <span className="journey-final-date">19 September 2025</span>
            <h2>A respectful account</h2>
            <p>
              Zubeen Garg died in Singapore at 52. In March 2026, Singapore’s coroner ruled his death
              an accidental drowning and found no evidence of foul play. This page follows that
              reported official conclusion and avoids sensational detail.
            </p>
            <SourceLinks items={[sources.hindu, sources.coroner]} />
          </section>

          <section id="legacy" className="journey-legacy">
            <div className="journey-legacy-photo">
              <PhotoCredit photo={photos.edufest} sourceUrl={sources.commonsEdufest.url} />
            </div>
            <div className="journey-legacy-copy">
              <span className="eyebrow">The final chapter is not the end</span>
              <h2>The Voice Lives On</h2>
              <p>
                Zubeen Garg’s recordings continue to be heard across Assam and beyond. His body of
                work—as singer, composer and film artist—remains part of the living story of
                Assamese music. The legacy is carried forward in the songs themselves, in public
                tributes and in the generations who discover them anew.
              </p>
              <p className="journey-community-note">
                Fan memories are welcome in the wider community archive, clearly labelled as personal
                recollections rather than verified biography.
              </p>
              <SourceLinks items={[sources.anamika, sources.hindu]} />
            </div>
          </section>

          <section id="photo-archive" className="journey-photo-archive">
            <span className="eyebrow">Image archive</span>
            <h2>Photographs & credits</h2>
            <div className="journey-photo-grid">
              <PhotoCredit photo={photos.edufest} sourceUrl={sources.commonsEdufest.url} />
              <PhotoCredit photo={photos.concert} sourceUrl={sources.commonsConcert.url} />
              <PhotoCredit photo={photos.award} sourceUrl={sources.commonsAward.url} />
            </div>
            <p>
              All three photographs are from Wikimedia Commons and are marked CC BY-SA 4.0. They are
              credited to their listed photographers and used with source links; license details are
              available on each file page. <a href={licenseUrl} target="_blank" rel="noreferrer">Read the license.</a>
            </p>
          </section>

          <footer className="journey-explore">
            <span className="eyebrow">Explore more</span>
            <h2>Keep discovering</h2>
            <div className="journey-explore-links">
              <Link to="/">Music Archive</Link>
              <a href="#film-work">Filmography</a>
              <a href="#photo-archive">Photo Gallery</a>
              <a href="#national-recognition">Awards</a>
              <a href="#community">Fan Stories</a>
            </div>
            <Link className="journey-back-home" to="/">← Back to Home</Link>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default JourneyPage;
