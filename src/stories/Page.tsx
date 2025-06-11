import React from "react"

// @ts-ignore
import { HelmetProvider, Helmet } from "react-helmet-async"

import { Header } from "./Header"
import { scope } from "../scopes/Scope"
import ReactCanvas from "../canvasComponents/ReactCanvas"

import { ReactCanvas as ReactCanvasDist } from "react-code-canvas"

import "./page.css"

type User = {
  name: string
}

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>()

  return (
    <HelmetProvider>
      <article>
        <Header
          user={user}
          onLogin={() => setUser({ name: "James Titus" })}
          onLogout={() => setUser(undefined)}
          onCreateAccount={() => setUser({ name: "James Titus" })}
        />
        <section>
          <div>
            <Helmet>
              <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
              {/* <link
              rel="stylesheet"
              href="https://jamestitus299.github.io/css_server/jstyles.css"
            /> */}
            </Helmet>
            <section className="p-4">
              <h2 className="text-3xl font-bold text-center">
                Try the ReactCanvas here
              </h2>
            </section>
            <div className="p-2">
              <ReactCanvas
                scope={scope}
                code={""}
                showEditor={true}
                showError={true}
              />
            </div>
          </div>
        </section>
      </article>
    </HelmetProvider>
  )
}

export const PageDist: React.FC = () => {
  const [user, setUser] = React.useState<User>()

  return (
    <HelmetProvider>
      <article>
        <Header
          user={user}
          onLogin={() => setUser({ name: "James Titus" })}
          onLogout={() => setUser(undefined)}
          onCreateAccount={() => setUser({ name: "James Titus" })}
        />
        <section>
          <div>
            <Helmet>
              <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
              {/* <link
              rel="stylesheet"
              href="https://jamestitus299.github.io/css_server/jstyles.css"
            /> */}
            </Helmet>
            <section className="p-4">
              <h2 className="text-3xl font-bold text-center">
                Try the ReactCanvas here
              </h2>
              <h3 className="text-3xl font-bold text-center">
                This Component is from the react-code-canvas package
              </h3>
            </section>
            <div className="p-2">
              <ReactCanvasDist
                scope={scope}
                code={""}
                showEditor={true}
                showError={true}
              />
            </div>
          </div>
        </section>
      </article>
    </HelmetProvider>
  )
}
