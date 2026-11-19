import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { InitialDataContext } from "./initialData";

export function render(url, data) {
  return renderToString(
    <InitialDataContext.Provider value={data}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </InitialDataContext.Provider>
  );
}