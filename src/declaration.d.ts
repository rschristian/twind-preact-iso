declare global {
    interface ImportMeta {
        env: {
            NODE_ENV: 'production' | 'developement';
        };
    }
}

export {};
