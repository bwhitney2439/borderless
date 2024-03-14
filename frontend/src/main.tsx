import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

const rootElement = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

enableMocking().then(() => {
  rootElement.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
