<h1 align="center">@rschristian/twind-preact-iso</h1>

<div align="center">
    <a href="https://github.com/rschristian/twind-preact-iso/blob/master/LICENSE">
        <img
            alt="NPM"
            src="https://img.shields.io/npm/l/@rschristian/twind-preact-iso?color=brightgreen"
        />
    </a>
</div>

<br />

`@rschristian/twind-preact-iso` is a (slightly) opinionated integration for [`twind`](https://twind.style) v1 with [`preact-iso`](https://github.com/preactjs/preact-iso).

## Install

```
$ npm install @rschristian/twind-preact-iso
```

## Usage

The following diff is a basic example taken from the [`create-preact`](https://github.com/preactjs/create-preact) starter, with the 'router' & 'prerender' options enabled:

```diff
-import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';
+import { LocationProvider, Router, Route } from 'preact-iso';
+import { withTwind } from '@rschristian/twind-preact-iso';

 import { Header } from './components/Header.jsx';
 import { Home } from './pages/Home/index.jsx';
 import { NotFound } from './pages/_404.jsx';
 import './style.css';

 const About = lazy(() => import('./pages/about/index.js'));

 export function App() {
 	return (
 		<LocationProvider>
 			<Header />
 			<main>
 				<Router>
 					<Route path="/" component={Home} />
 					<Route default component={NotFound} />
 				</Router>
 			</main>
 		</LocationProvider>
 	);
 }

+const { hydrate, prerender } = withTwind(
+    () => import('./twind.config'),
+    (data) => <App {...data} />,
+);

 if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
 }

-export async function prerender(data) {
-    return await ssr(<App {...data} />);
-}
+export { prerender };
```

## API

### config

Type: `() => Promise<{ twindConfig: TwindConfig | TwindUserConfig }>`<br/>

Provide your Twind config via a callback function that returns a Promise containing your config upon the `twindConfig` key. While this is a tad cumbersome, it's done to ensure that no pieces of Twind are dragged into your client-side bundles when you choose not to hydrate with it.

### prerenderCallback

Type: `(data: any) => VNode`<br/>

Argument passed to `preact-iso`'s prerender. Pass a callback target for prerendering your app.

### hydrateWithTwind

Type: `boolean`<br/>
Default: `import.meta.env.NODE_ENV !== 'production'`

Whether Twind should be allowed to run client-side, effectively. By default it's disabled in prod.

If you're using grouped classes, I suggest you look at [`vite-plugin-tailwind-grouping`](https://github.com/rschristian/tailwind-grouping) to expand the groups in your JS bundles. Without Twind to translate grouped classes client-side, hydrating with them will result in broken styling.

## Acknowledgements

This is massively based upon the excellent [`@twind/wmr`](https://github.com/tw-in-js/use-twind-with/blob/main/packages/wmr) by [github.com/sastan](https://github.com/sastan).

## License

MIT © Ryan Christian
