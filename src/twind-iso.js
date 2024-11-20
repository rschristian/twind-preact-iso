import { render as preactRender } from 'preact';
import { hydrate as isoHydrate, prerender as isoPrerender } from 'preact-iso';

/**
 * @typedef {import('@twind/core').TwindConfig} TwindConfig
 * @typedef {import('@twind/core').TwindUserConfig} TwindUserConfig
 */

/**
 * @type {import('./twind-iso').withTwind}
 */
export function withTwind(
    config,
    prerenderCallback,
    hydrateWithTwind = import.meta.env.NODE_ENV !== 'production',
) {
    /** @type {import('@twind/core')} */
    let twind;
    /** @type {TwindConfig | TwindUserConfig} */
    let userConfig;

    /**
     * @param {import('preact').ComponentChild} jsx
     * @param {import('preact').ContainerNode} [parent]
     */
    const render = async (jsx, parent) => {
        if (typeof window === 'undefined') return;

        const { install } = await import('@twind/core');
        install(
            /** @type {TwindConfig} */ ((await config()).twindConfig),
            import.meta.env.NODE_ENV === 'production',
        );

        const isodata = document.querySelector('script[type=isodata]');
        parent = parent || (isodata && isodata.parentNode) || document.body;
        preactRender(jsx, parent);
    }

    /**
     * @param {import('preact').ComponentChild} jsx
     * @param {import('preact').ContainerNode} [parent]
     */
    const hydrate = async (jsx, parent) => {
        if (typeof window === 'undefined') return;

        if (hydrateWithTwind) {
            const { install } = await import('@twind/core');
            install(
                /** @type {TwindConfig} */ ((await config()).twindConfig),
                import.meta.env.NODE_ENV === 'production',
            );
        }

        isoHydrate(jsx, parent);
    };

    /**
     * @param {unknown} data
     */
    const prerender = async (data) => {
        const { install, extract } = twind || (twind = await import('@twind/core'));
        const tw = install(
            /** @type {TwindConfig} */ (userConfig || (userConfig = (await config()).twindConfig)),
            true,
        );

        const result = await isoPrerender(prerenderCallback(data));
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
        render,
        hydrate,
        prerender,
    };
}
