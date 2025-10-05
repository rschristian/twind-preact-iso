import type { ComponentChild, ContainerNode, VNode } from 'preact';
import type { PrerenderResult } from 'preact-iso/prerender';
import type { defineConfig } from '@twind/core';

type RenderType = (jsx: ComponentChild, parent?: ContainerNode) => void;

export type TwindConfig = ReturnType<typeof defineConfig>;

export function withTwind(
    config: (() => Promise<{ twindConfig: TwindConfig }>),
    prerenderCallback: (data: unknown) => VNode<{}>,
    hydrateWithTwind?: boolean,
): {
    render: RenderType;
    hydrate: RenderType;
    prerender: (data: unknown) => Promise<PrerenderResult>;
};
