import './shim.js';
import type { SSRManifest } from 'astro';
export declare function createExports(manifest: SSRManifest): {
    default: (request: Request) => Promise<Response>;
};
