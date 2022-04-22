import type { VNode } from 'preact';
import type { TwindConfig, TwindUserConfig } from 'twind';

import { hydrate as hydrate$, prerender as prerender$ } from 'preact-iso';

export function withTwind(
    config: Promise<TwindConfig | TwindUserConfig>,
    prerenderCallback: (data: unknown) => VNode,
    hydrateWithTwind: boolean = import.meta.env.NODE_ENV !== 'production',
) {
    let twind: typeof import('twind');

    const hydrate: typeof hydrate$ = async (jsx, parent) => {
        if (hydrateWithTwind) {
            const { install: install$ } = await import('twind');
            install$((await config) as TwindUserConfig, import.meta.env.NODE_ENV === 'production');
        }
        hydrate$(jsx, parent);
    };

    const prerender = async (data: unknown) => {
        const { install, extract } = twind || (twind = await import('twind'));
        const tw = install((await config) as TwindUserConfig, true);

        const result = await prerender$(prerenderCallback(data));
        const { html, css } = extract(result.html, tw);

        return {
            ...result,
            html,
            head: {
                elements: new Set([{
                    type: 'style',
                    props: {
                        'data-twind': '',
                        children: css
                    }
                }])
            }
        }
    }

    return {
        hydrate,
        prerender,
    };
}
