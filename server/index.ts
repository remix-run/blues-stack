import prom from "@isaacs/express-prometheus-middleware";
import { createRequestHandler } from "@remix-run/express";
import type { ServerBuild } from "@remix-run/node";
import { installGlobals } from "@remix-run/node";
import compression from "compression";
import express from "express";
import morgan from "morgan";
import sourceMapSupport from "source-map-support";

sourceMapSupport.install();
installGlobals();
run();

async function run() {
  const MODE = process.env.NODE_ENV;

  const viteDevServer =
    MODE === "development"
      ? await import("vite").then((vite) =>
          vite.createServer({
            server: { middlewareMode: true },
          }),
        )
      : undefined;

  const app = express();
  const metricsApp = express();
  app.use(
    prom({
      metricsPath: "/metrics",
      collectDefaultMetrics: true,
      metricsApp,
    }),
  );

  app.use((req, res, next) => {
    // helpful headers:
    res.set("x-fly-region", process.env.FLY_REGION ?? "unknown");
    res.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

    // /clean-urls/ -> /clean-urls
    if (req.path.endsWith("/") && req.path.length > 1) {
      const query = req.url.slice(req.path.length);
      const safepath = req.path.slice(0, -1).replace(/\/+/g, "/");
      res.redirect(301, safepath + query);
      return;
    }
    next();
  });

  // if we're not in the primary region, then we need to make sure all
  // non-GET/HEAD/OPTIONS requests hit the primary region rather than read-only
  // Postgres DBs.
  // learn more: https://fly.io/docs/getting-started/multi-region-databases/#replay-the-request
  app.all("*", function getReplayResponse(req, res, next) {
    const { method, path: pathname } = req;
    const { PRIMARY_REGION, FLY_REGION } = process.env;

    const isMethodReplayable = !["GET", "OPTIONS", "HEAD"].includes(method);
    const isReadOnlyRegion =
      FLY_REGION && PRIMARY_REGION && FLY_REGION !== PRIMARY_REGION;

    const shouldReplay = isMethodReplayable && isReadOnlyRegion;

    if (!shouldReplay) return next();

    const logInfo = {
      pathname,
      method,
      PRIMARY_REGION,
      FLY_REGION,
    };
    console.info(`Replaying:`, logInfo);
    res.set("fly-replay", `region=${PRIMARY_REGION}`);
    return res.sendStatus(409);
  });

  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable("x-powered-by");

  if (viteDevServer) {
    app.use(viteDevServer.middlewares);
  } else {
    // Remix fingerprints its assets so we can cache forever.
    app.use(
      "/assets",
      express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
    );
    // Everything else (like favicon.ico) is cached for an hour. You may want to be
    // more aggressive with this caching.
    app.use(express.static("build/client", { maxAge: "1h" }));
  }

  app.use(morgan("tiny"));

  app.all(
    "*",
    createRequestHandler({
      getLoadContext: (_, res) => ({
        cspNonce: res.locals.cspNonce,
        serverBuild: getBuild(),
      }),
      mode: MODE,
      build: async () => {
        const { error, build } = await getBuild();
        // gracefully "catch" the error
        if (error) {
          throw error;
        }
        return build;
      },
    }),
  );

  const port = process.env.PORT || 3024;
  app.listen(port, () => {
    console.log(`✅ app ready: http://localhost:${port}`);
  });

  const metricsPort = process.env.METRICS_PORT || 3014;

  metricsApp.listen(metricsPort, () => {
    console.log(`✅ metrics ready: http://localhost:${metricsPort}/metrics`);
  });

  async function getBuild() {
    try {
      const build = viteDevServer
        ? await viteDevServer.ssrLoadModule("virtual:remix/server-build")
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - the file might not exist yet but it will
          await import("../build/server/index.js");

      return { build: build as unknown as ServerBuild, error: null };
    } catch (error) {
      // Catch error and return null to make express happy and avoid an unrecoverable crash
      console.error("Error creating build:", error);
      return { error: error, build: null as unknown as ServerBuild };
    }
  }
}
