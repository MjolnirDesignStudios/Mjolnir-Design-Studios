// ─── Windows readlink EISDIR patch ────────────────────────────────────────
// On this Windows machine fs.readlink() and fs.promises.readlink() return
// EISDIR for regular files instead of EINVAL.
//
// Two callers need patching:
//   1. next-trace-entrypoints-plugin — uses compilation.inputFileSystem.readlink
//      (patched via webpack plugin applied in the compilation hook)
//   2. collect-build-traces.js — uses fs/promises.readlink in the main process
//      (patched here, at config-module scope, before the traces phase runs)
//
// Both callers guard against EINVAL/ENOENT/UNKNOWN but not EISDIR, so EISDIR
// is re-thrown as a fatal error.  Converting it to EINVAL makes both callers
// treat the path as "not a symlink" and continue.
import fs from "fs";
import fsPromises from "fs/promises";

// Patch callback fs.readlink
{
  const orig = fs.readlink.bind(fs) as typeof fs.readlink;
  (fs as any).readlink = function (
    p: fs.PathLike,
    opts: unknown,
    cb: unknown
  ) {
    if (typeof opts === "function") { cb = opts; opts = undefined; }
    (orig as Function)(p, opts, (err: NodeJS.ErrnoException | null, link: string) => {
      if (err?.code === "EISDIR") {
        const e = Object.assign(
          new Error(`EINVAL: invalid argument, readlink '${String(p)}'`),
          { code: "EINVAL", errno: -22, syscall: "readlink", path: String(p) }
        ) as NodeJS.ErrnoException;
        (cb as Function)(e);
      } else {
        (cb as Function)(err, link);
      }
    });
  };
}

// Patch promise fs/promises.readlink (used by collect-build-traces.js)
{
  const origAsync = fsPromises.readlink.bind(fsPromises);
  (fsPromises as any).readlink = async function (
    p: fs.PathLike,
    opts?: fs.BufferEncodingOption | { encoding: BufferEncoding | null } | null
  ) {
    try {
      return await origAsync(p as string, opts as any);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException)?.code === "EISDIR") {
        const e = Object.assign(
          new Error(`EINVAL: invalid argument, readlink '${String(p)}'`),
          { code: "EINVAL", errno: -22, syscall: "readlink", path: String(p) }
        ) as NodeJS.ErrnoException;
        throw e;
      }
      throw err;
    }
  };
}

// ─── Webpack worker patch (compilation.inputFileSystem) ───────────────────
// next-trace-entrypoints-plugin uses the webpack InputFileSystem which is
// separate from the raw fs module.  Must be patched from inside the webpack
// worker via a compiler hook.
class WindowsReadlinkPatchPlugin {
  apply(compiler: any) {
    compiler.hooks.compilation.tap(
      "WindowsReadlinkPatchPlugin",
      (compilation: any) => {
        const ifs = compilation.inputFileSystem;
        if (!ifs || ifs.__readlinkPatched) return;
        const orig = ifs.readlink.bind(ifs);
        ifs.readlink = function (
          p: string,
          cb: (err: NodeJS.ErrnoException | null, link?: string) => void
        ) {
          orig(p, (err: NodeJS.ErrnoException | null, link: string) => {
            if (err?.code === "EISDIR") {
              const e = Object.assign(
                new Error(`EINVAL: invalid argument, readlink '${p}'`),
                { code: "EINVAL", errno: -22, syscall: "readlink", path: p }
              ) as NodeJS.ErrnoException;
              cb(e);
            } else {
              cb(err, link);
            }
          });
        };
        ifs.__readlinkPatched = true;
      }
    );
  }
}
// ─────────────────────────────────────────────────────────────────────────

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: { root: __dirname },

  typescript: { ignoreBuildErrors: false },

  eslint: { ignoreDuringBuilds: true },

  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    config.plugins = [
      new WindowsReadlinkPatchPlugin(),
      ...(config.plugins ?? []),
    ];
    config.resolve.symlinks = false;
    config.resolveLoader.symlinks = false;
    config.cache = { type: "memory" };

    if (!isServer) {
      config.module.rules.push({
        test: /\.(glsl|vs|fs|vert|frag)$/,
        type: "asset/source",
      });
    }
    return config;
  },

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https" as const, hostname: "res.cloudinary.com",       port: "", pathname: "/**" },
      { protocol: "https" as const, hostname: "cdn.jsdelivr.net",          port: "", pathname: "/**" },
      { protocol: "https" as const, hostname: "raw.githubusercontent.com", port: "", pathname: "/**" },
    ],
  },
};

export default nextConfig;
