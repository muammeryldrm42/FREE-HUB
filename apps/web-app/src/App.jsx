import { Link, Route, Routes, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function useData(file) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/${file}`).then((r) => r.json()).then(setData);
  }, [file]);
  return data;
}

function Layout({ children }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.body.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  return (
    <div className="app">
      <header>
        <h1>Talons Skills Hub</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/skills">Skills</Link>
          <Link to="/bundles">Bundles</Link>
          <Link to="/workflows">Workflows</Link>
          <Link to="/catalog">Catalog</Link>
          <Link to="/about">About</Link>
        </nav>
        <button onClick={() => setDark(!dark)}>{dark ? 'Light' : 'Dark'} mode</button>
      </header>
      <main>{children}</main>
    </div>
  );
}

function Home() {
  const skills = useData('skills.json');
  const bundles = useData('bundles.json');
  const workflows = useData('workflows.json');

  return (
    <section>
      <h2>Installable AI skills at scale</h2>
      <p>Discover, filter, and install reusable playbooks for coding assistants.</p>
      <ul>
        <li>
          <strong>{skills.length}</strong> skills
        </li>
        <li>
          <strong>{bundles.length}</strong> bundles
        </li>
        <li>
          <strong>{workflows.length}</strong> workflows
        </li>
      </ul>
    </section>
  );
}

function Skills() {
  const skills = useData('skills.json');
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');
  const [tool, setTool] = useState('all');

  const categories = ['all', ...new Set(skills.map((s) => s.category))];
  const tools = ['all', ...new Set(skills.flatMap((s) => s.supported_tools))];

  const filtered = useMemo(
    () =>
      skills.filter(
        (s) =>
          (category === 'all' || s.category === category) &&
          (tool === 'all' || s.supported_tools.includes(tool)) &&
          `${s.name} ${s.description} ${s.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()),
      ),
    [skills, q, category, tool],
  );

  return (
    <section>
      <h2>Skills</h2>
      <div className="filters">
        <input placeholder="Search skills..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={tool} onChange={(e) => setTool(e.target.value)}>
          {tools.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <ul>
        {filtered.map((s) => (
          <li key={s.slug}>
            <Link to={`/skills/${s.slug}`}>{s.name}</Link> — {s.description}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SkillDetail() {
  const { slug } = useParams();
  const skills = useData('skills.json');
  const skill = skills.find((s) => s.slug === slug);

  if (!skill) return <p>Skill not found.</p>;

  return (
    <section>
      <h2>{skill.name}</h2>
      <p>{skill.description}</p>
      <button onClick={() => navigator.clipboard.writeText(skill.content)}>Copy SKILL.md</button>
      <ReactMarkdown>{skill.content}</ReactMarkdown>
    </section>
  );
}

function Catalog() {
  const skills = useData('skills.json');
  const bundles = useData('bundles.json');
  const flows = useData('workflows.json');
  return (
    <section>
      <h2>Catalog</h2>
      <p className="muted">Bu sayfa sohbet yerine proje içeriğini listeler.</p>
      <h3>Öne çıkan skills</h3>
      <ul>
        {skills.slice(0, 12).map((s) => (
          <li key={s.slug}>
            <Link to={`/skills/${s.slug}`}>{s.name}</Link> — {s.category}
          </li>
        ))}
      </ul>
      <h3>Bundles</h3>
      <ul>
        {bundles.map((b) => (
          <li key={b.slug}>
            <strong>{b.name}</strong> — {b.description}
          </li>
        ))}
      </ul>
      <h3>Workflows</h3>
      <ul>
        {flows.map((w) => (
          <li key={w.slug}>
            <strong>{w.name}</strong> — {w.description}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Bundles() {
  const bundles = useData('bundles.json');
  return (
    <section>
      <h2>Bundles</h2>
      <ul>
        {bundles.map((b) => (
          <li key={b.slug}>
            <strong>{b.name}</strong> — {b.description}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Workflows() {
  const flows = useData('workflows.json');
  return (
    <section>
      <h2>Workflows</h2>
      <ul>
        {flows.map((w) => (
          <li key={w.slug}>
            <strong>{w.name}</strong> — {w.description}
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  return (
    <section>
      <h2>About</h2>
      <p>Talons Skills Hub is an original, open skill platform for AI assistants.</p>
    </section>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skills/:slug" element={<SkillDetail />} />
        <Route path="/bundles" element={<Bundles />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
