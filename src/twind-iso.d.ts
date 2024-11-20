import type { ComponentChild, ContainerNode } from 'preact';
import type { PrerenderResult } from 'preact-iso/prerender';
import type { TwindConfig, TwindUserConfig } from '@twind/core';

type RenderType = (jsx: ComponentChild, parent: ContainerNode) => void;

export function withTwind(
    config: () => Promise<{
        twindConfig: TwindConfig | TwindUserConfig;
    }>,
    prerenderCallback: (data: unknown) => ComponentChild,
    hydrateWithTwind?: boolean,
): {
    render: RenderType;
    hydrate: RenderType;
    prerender: (data: unknown) => Promise<PrerenderResult>;
};
