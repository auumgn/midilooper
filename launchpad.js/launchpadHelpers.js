/**
 * Return a promise waiting for the given Launchpad to become ready
 */
export function waitForReady(lp) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise(ok => lp.once('ready', () => ok(lp)));
}
