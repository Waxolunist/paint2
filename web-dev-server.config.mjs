import historyApiFallback from 'koa-history-api-fallback';

export default {
    open: false,
    watch: false,
    port: 8000,
    nodeResolve: true,
    appIndex: 'index.html',
    rootDir: './',
    middlewares: [
        historyApiFallback({
            index: '/bundle/index.html',
        }),
        function rewriteIndex(context, next) {
            // middleware for debugging worker
            if (context.url.startsWith('/bundle/src')) {
                context.url = context.url.replace('/bundle', '');
            }

            return next();
        },
    ],
    plugins: [
        {
            transform(context) {
                if (context.path === '/bundle/index.html') {
                    const transformedBody = context.body.replace(
                        /<base href=".*"/,
                        '<base href="/bundle/"'
                    );
                    return {body: transformedBody};
                }
            },
        },
    ],
};