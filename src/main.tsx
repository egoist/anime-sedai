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
  script.async = true
  script.src = "https://u.egoist.dev/script.js"
  script.dataset.websiteId = "50ec8a62-f258-455c-892f-0f1fedf28cce"
  document.body.appendChild(script)
}
