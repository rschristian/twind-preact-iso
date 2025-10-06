import type { ComponentChild, ContainerNode, VNode } from 'preact';
import type { PrerenderResult } from 'preact-iso/prerender';
import type { defineConfig } from '@twind/core';

type RenderType = (jsx: ComponentChild, parent?: ContainerNode) => void;

export type TwindConfig = ReturnType<typeof defineConfig>;
export type UserTwindConfig = TwindConfig | (() => Promise<{ twindConfig: TwindConfig }>);

export function withTwind(
    config: (() => Promise<{ twindConfig: TwindConfig }>),
    prerenderCallback: (data: unknown) => VNode<{}>,
    hydrateWithTwind?: false | never,
): {
    render: RenderType;
    hydrate: RenderType;
    prerender: (data: unknown) => Promise<PrerenderResult>;
};

export function withTwind(
    config: TwindConfig,
    prerenderCallback: (data: unknown) => VNode<{}>,
    hydrateWithTwind: true,
): {
    render: RenderType;
    hydrate: RenderType;
    prerender: (data: unknown) => Promise<PrerenderResult>;
};
