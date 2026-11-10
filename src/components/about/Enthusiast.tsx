import './Enthusiast.css';

// The old landing page, set in the night-sky type. Not a biography.
export default function Enthusiast() {
  return (
    <article className="enthusiast">
      <p className="enthusiast-kicker">About</p>
      <h1>Isaac Jennings</h1>
      <p className="enthusiast-summary">
        I appreciate the time you have taken to visit! I'm Isaac, an enthusiast of too many interests with not
        enough time. I am working on solo development of SaaS, and exploring the philosophy of propaganda. I studied
        Computer Science, and I am currently enrolled in a Juris Doctor program.
      </p>
      <section className="enthusiast-def" aria-labelledby="enthusiast">
        <div className="enthusiast-heading">
          <h2 id="enthusiast">
            <dfn>enthusiast</dfn>
          </h2>
          <span className="enthusiast-pron">/ɪnˈθjuːziæst/</span>
        </div>
        <p className="enthusiast-pos">
          <i>noun</i>
        </p>
        <ol>
          <li>A person irresistibly drawn to the unusual, the obscure, and the thing everyone else has sensibly walked past.</li>
          <li>One who mistakes the discovery of another interest for the acquisition of more free time.</li>
        </ol>
        <p className="enthusiast-usage">
          <q>He only meant to look it up; by midnight, it had become a field of study.</q>
        </p>
      </section>
    </article>
  );
}
