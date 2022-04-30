<h1 align="center">@rschristian/twind-wmr</h1>

<div align="center">
    <a href="https://github.com/rschristian/twind-wmr/blob/master/LICENSE">
        <img
            alt="NPM"
            src="https://img.shields.io/npm/l/@rschristian/twind-wmr?color=brightgreen"
        />
    </a>
</div>

<br />

`@rschristian/twind-wmr` is a (slightly) opinionated integration for [Twind](https://twind.dev) v1 with [WMR](https://wmr.dev). Twind's own WMR integration is built for v0 and requires you to do a bit more work if you don't want to hydrate with Twind in production.

> Warning: Due to some limitations with WMR at the moment, there's no way to not drag in the config file while using the `hydrate` function from this library, regardless of whether or not you're hydrating with Twind.

## Install

```
$ yarn add @rschristian/twind-wmr
```

## Usage

```diff
import {
     LocationProvider,
     Router,
     Route,
     lazy,
     ErrorBoundary,
-    hydrate,
-    prerender as ssr
 } from 'preact-iso';
+import { withTwind } from '@rschristian/twind-wmr';
 import Home from './pages/home/index.js';
 import NotFound from './pages/_404.js';
 import Header from './header.js';

 const About = lazy(() => import('./pages/about/index.js'));

 export function App() {
     return (
         <LocationProvider>
             <div class="app">
                 <Header />
                 <ErrorBoundary>
                     <Router>
                         <Route path="/" component={Home} />
                         <Route path="/about" component={About} />
                         <Route default component={NotFound} />
                     </Router>
                 </ErrorBoundary>
             </div>
         </LocationProvider>
     );
 }

+const { hydrate, prerender } = withTwind(
+    import('./twind.config.js').then(({ twindConfig }) => twindConfig),
+    (data) => <App {...data} />,
+    import.meta.env.NODE_ENV !== 'production',
+);

 hydrate(<App />);

-export async function prerender(data) {
-    return await ssr(<App {...data} />);
-}
+ export { prerender };
```

## API

### config

Type: `Promise<TwindConfig | TwindUserConfig>`<br/>

Provide your Twind config by dynamic import. While this is a tad cumbersome, it keeps your config out of the client-side bundle except for when you want client-side prod Twind hydration.

### prerenderCallback

Type: `(data: any) => VNode`<br/>

Argument passed to `preact-iso`'s prerender. Pass a callback target for prerendering your app.

### hydrateWithTwind

Type: `boolean`<br/>
Default: `import.meta.env.NODE_ENV !== 'production'`

Whether Twind should be allowed to run client-side, effectively. By default it's disabled in prod.

If you're using grouped classes, I suggest you look at [wmr-plugin-tailwind-grouping](https://github.com/rschristian/tailwind-grouping) to expand the groups in your JSX, else hydration without Twind will break your prerendered styles as it'll regroup the expanded classes.

## Acknowledgements

This is massively based upon the excellant [`@twind/wmr`](https://github.com/tw-in-js/use-twind-with/blob/main/packages/wmr) by [github.com/sastan](https://github.com/sastan). I was wanting to extract out my config (as I've written this dozens of times now) and wanted to support Twind v1, which the official Twind integration hasn't been updated for yet (as v1 is still very much in beta at the time of writing this).

## License

MIT © Ryan Christian
