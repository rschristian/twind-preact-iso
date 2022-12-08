import { hydrate as isoHydrate, prerender as isoPrerender } from 'preact-iso';

/**
 * @typedef {import('preact').VNode} VNode
 * @typedef {import('@twind/core').TwindConfig} TwindConfig
 * @typedef {import('@twind/core').TwindUserConfig} TwindUserConfig
 */

/**
 * @param {() => Promise<{ twindConfig: TwindConfig | TwindUserConfig}>} config
 * @param {(data: unknown) => VNode} prerenderCallback
 * @param {boolean} hydrateWithTwind
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

    /** @type {isoHydrate} */
    const hydrate = async (jsx, parent) => {
        if (hydrateWithTwind) {
            const { install } = await import('@twind/core');
            install(
                /** @type {TwindConfig} */ ((await config()).twindConfig),
                import.meta.env.NODE_ENV === 'production',
            );
        }
        isoHydrate(jsx, parent);
    };

    /** @param {unknown} data */
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
        hydrate,
        prerender,
    };
}
