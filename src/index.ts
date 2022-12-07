import type { VNode } from 'preact';
import type { TwindConfig, TwindUserConfig } from '@twind/core';

import { hydrate as hydrate$, prerender as prerender$ } from 'preact-iso';

export function withTwind(
    config: () => Promise<{ twindConfig: TwindConfig | TwindUserConfig}>,
    prerenderCallback: (data: unknown) => VNode,
    hydrateWithTwind: boolean = import.meta.env.NODE_ENV !== 'production',
) {
    let twind: typeof import('@twind/core');
    let userConfig: TwindConfig | TwindUserConfig;

    const hydrate: typeof hydrate$ = async (jsx, parent) => {
        if (hydrateWithTwind) {
            const { install } = await import('@twind/core');
            install((await config()).twindConfig as TwindUserConfig, import.meta.env.NODE_ENV === 'production');
        }
        hydrate$(jsx, parent);
    };

    const prerender = async (data: unknown) => {
        const { install, extract } = twind || (twind = await import('@twind/core'));
        const tw = install((userConfig || (userConfig = (await config()).twindConfig)) as TwindUserConfig, true);

        const result = await prerender$(prerenderCallback(data));
        let { html, css } = extract(result.html, tw);

        if (!hydrateWithTwind) {
            css = css.replace(/\/\*[^\*]*\*\//g, '');
        }

        return Object.assign(
            result,
            { html },
            {
                head: {
                    elements: new Set([
                        {
                            type: 'style',
                            props: {
                                'data-twind': '',
                                children: css,
                            },
                        },
                    ]),
                },
            },
        );
    };

    return {
        hydrate,
        prerender,
    };
}
