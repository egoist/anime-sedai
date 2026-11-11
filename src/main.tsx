import React from "react"
import ReactDOM from "react-dom/client"
import { App } from "./app"
import { Toaster } from "sonner"
import { I18nProvider } from "./i18n-context"

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
      <Toaster />
    </I18nProvider>
  </React.StrictMode>
)

if (import.meta.env.PROD) {
  const script = document.createElement("script")
  script.defer = true
  script.src = "https://tt.egoist.dev/js/script.js"
  script.dataset.domain = "anime-sedai.egoist.dev"
  document.body.appendChild(script)
}
