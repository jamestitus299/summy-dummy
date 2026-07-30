import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './playground.module.css';

// `useState` and every Lucide icon are injected through the default scope, so
// the code below needs no import statements -- that is the core idea of the
// library. A leading `export default function` is the documented entry shape.
const initialCode = `export default function Demo() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem',
        border: '1px solid #e3e3e3',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <Sparkles size={20} color="#2563eb" />
        <strong>Hello from react-code-canvas</strong>
      </div>

      <p style={{ margin: 0, color: '#555' }}>
        Edit this code and the preview updates as you type.
      </p>

      <button
        onClick={() => setCount(count + 1)}
        style={{
          padding: '.5rem 1rem',
          borderRadius: '8px',
          border: 'none',
          background: '#2563eb',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        Clicked {count} times
      </button>
    </div>
  );
}`;

function Canvas() {
  // Imported lazily inside BrowserOnly: the canvas evaluates code against the
  // real document, so it must never run during Docusaurus' static prerender.
  const { ReactCanvas } = require('react-code-canvas');

  return (
    <ReactCanvas
      code={initialCode}
      showPreview
      showEditor
      showError
    />
  );
}

export default function Playground(): JSX.Element {
  return (
    <Layout
      title="Playground"
      description="Edit React component code and see react-code-canvas render it live in the browser."
    >
      <main className="container margin-vert--lg">
        <Heading as="h1">Playground</Heading>
        <p className={styles.intro}>
          This is <code>ReactCanvas</code> with <code>showEditor</code> and{' '}
          <code>showError</code> enabled. Edit the code on the page and the preview
          re-renders as you type. No import statements are needed —{' '}
          <code>useState</code> and the Lucide icon set come from the{' '}
          <Link to="/docs/scope">default scope</Link>.
        </p>

        <div className={styles.notes}>
          <p>
            <strong>Tailwind is not loaded here.</strong> The docs site ships its own
            styles, and the Tailwind CDN applies a global reset that would restyle
            this page. Use inline styles in the example, and load Tailwind in your own
            app if your generated code depends on utility classes.
          </p>
          <p>
            Code you enter is evaluated in this page&apos;s own context. See the{' '}
            <Link to="/docs/security">security model</Link> before doing the same with
            untrusted input.
          </p>
        </div>

        <div className={styles.canvas}>
          <BrowserOnly fallback={<div className={styles.loading}>Loading canvas…</div>}>
            {() => <Canvas />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
