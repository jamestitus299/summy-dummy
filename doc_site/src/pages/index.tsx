import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

const features = [
  {
    title: 'Controlled rendering',
    description:
      'Turn React component code strings into browser previews with a scoped runtime.',
  },
  {
    title: 'Validation workflow',
    description:
      'Render code invisibly and receive compile-time or runtime errors before saving.',
  },
  {
    title: 'Text editing path',
    description:
      'Use the editable canvas to patch text content while preserving the generated JSX.',
  },
];

export default function Home(): JSX.Element {
  return (
    <Layout
      title="React component rendering and text editing"
      description="Documentation for react-code-canvas"
    >
      <main>
        <section className={clsx('hero', styles.hero)}>
          <div className="container">
            <div className={styles.heroInner}>
              <div>
                <p className={styles.eyebrow}>React rendering toolkit</p>
                <Heading as="h1" className={styles.title}>
                  Render React components. Edit text content live.
                </Heading>
                <p className={styles.subtitle}>
                  `react-code-canvas` gives applications a controlled way to preview,
                  validate, and text-edit React UI generated from code strings.
                </p>
                <div className={styles.actions}>
                  <Link className="button button--primary button--lg" to="/docs/intro">
                    Read the docs
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
                <img src="img/rrc.png" alt="react-code-canvas preview" />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.grid}>
              {features.map((feature) => (
                <article className={styles.feature} key={feature.title}>
                  <Heading as="h2">{feature.title}</Heading>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
