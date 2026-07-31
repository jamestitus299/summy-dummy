import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const features = [
  {
    icon: '🎨',
    title: 'Controlled rendering',
    description:
      'Turn React component code strings into live browser previews inside a scoped, sandbox-friendly runtime.',
  },
  {
    icon: '✅',
    title: 'Validation workflow',
    description:
      'Check code with analyzeReactCode() in Node — no browser, no render — and catch bad scope references before you ever save.',
  },
  {
    icon: '✍️',
    title: 'Live text editing',
    description:
      'Let users edit rendered text in place while the original JSX is preserved and patched back automatically.',
  },
  {
    icon: '🧩',
    title: 'Explicit scope',
    description:
      'No imports in user code. You decide exactly which components, hooks, and libraries are available via scope.',
  },
  {
    icon: '💾',
    title: 'Built-in persistence',
    description:
      'Opt into localStorage with a single persistKey prop, or wire onCodeChange to your own backend.',
  },
  {
    icon: '📦',
    title: 'Ships ESM + CJS + types',
    description:
      'Dual bundles with first-class TypeScript declarations, so it just works in any modern toolchain.',
  },
];

const heroSnippet = `import { ReactCanvas } from 'react-code-canvas';

const code = \`
export default function Hello() {
  return (
    <h1 className="title">
      Hello, world 👋
    </h1>
  );
}\`;

export default function App() {
  return (
    <ReactCanvas
      code={code}
      showEditor
      showPreview
      persistKey="playground"
    />
  );
}`;

export default function Home(): JSX.Element {
  return (
    <Layout
      title="Render React components and edit text content live"
      description="react-code-canvas — render, validate, and text-edit React UI from code strings in the browser."
    >
      <main>
        <section className={clsx('hero', styles.hero)}>
          <div className="container">
            <div className={styles.heroInner}>
              <div className={styles.heroCopy}>
                <p className={styles.eyebrow}>React rendering toolkit</p>
                <Heading as="h1" className={styles.title}>
                  Render React components.
                  <br />
                  <span className={styles.titleAccent}>Edit text content live.</span>
                </Heading>
                <p className={styles.subtitle}>
                  <code>react-code-canvas</code> gives your app a controlled way to
                  preview, validate, and text-edit React UI generated from code
                  strings — with an explicit scope and zero imports in user code.
                </p>

                <div className={styles.install}>
                  <CodeBlock language="bash">bun add react-code-canvas@latest</CodeBlock>
                </div>

                <div className={styles.actions}>
                  <Link className="button button--primary button--lg" to="/docs/intro">
                    Get started
                  </Link>
                  <Link
                    className="button button--secondary button--lg"
                    to="/docs/quick-start"
                  >
                    Quick start
                  </Link>
                </div>
              </div>

              <div className={styles.preview}>
                <div className={styles.codeWindow}>
                  <div className={styles.codeWindowBar}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.codeWindowTitle}>App.tsx</span>
                  </div>
                  <CodeBlock language="tsx" className={styles.codeWindowBody}>
                    {heroSnippet}
                  </CodeBlock>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <p className={styles.eyebrow}>Why react-code-canvas</p>
              <Heading as="h2" className={styles.sectionTitle}>
                Everything you need to render untrusted JSX with control
              </Heading>
            </div>
            <div className={styles.grid}>
              {features.map((feature) => (
                <article className={styles.feature} key={feature.title}>
                  <div className={styles.featureIcon} aria-hidden>
                    {feature.icon}
                  </div>
                  <Heading as="h3" className={styles.featureTitle}>
                    {feature.title}
                  </Heading>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaInner}>
              <Heading as="h2" className={styles.ctaTitle}>
                Ready to build your live canvas?
              </Heading>
              <p className={styles.ctaSubtitle}>
                Install the package and render your first component in a couple of
                minutes.
              </p>
              <div className={styles.actions}>
                <Link className="button button--primary button--lg" to="/docs/quick-start">
                  Read the quick start
                </Link>
                <Link
                  className="button button--secondary button--lg"
                  href="https://github.com/jamestitus299/react-code-canvas"
                >
                  Star on GitHub
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
