import { hydrate } from 'preact-iso';
import type { PrerenderResult } from 'preact-iso/prerender';
import type { VNode } from 'preact';
import type { TwindConfig, TwindUserConfig } from '@twind/core';

export function withTwind(
    config: () => Promise<{
        twindConfig: TwindConfig | TwindUserConfig;
    }>,
    prerenderCallback: (data: unknown) => VNode,
    hydrateWithTwind?: boolean,
): {
    hydrate: typeof hydrate;
    prerender: (data: unknown) => Promise<PrerenderResult>;
};
