# VideoVault

A responsive React PWA for saving and organizing video links. It includes the Android Web Share Target route, Supabase-backed private data, local cache and retry queue, and a responsive neumorphic interface.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`, then `npm run dev`.
3. Without Supabase settings, the library starts empty. Sign in with Supabase to save and sync videos. Add `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable authentication and cloud storage. Never put a service role key in the frontend.
4. In Supabase SQL Editor, run `supabase/migrations/202611150001_initial.sql`. Deploy the metadata Edge Function with `supabase functions deploy video-metadata`.
5. Configure the Supabase Auth site URL and email confirmation templates for your HTTPS deployment. Deploy the built `dist` folder to a static host with SPA fallback to `/index.html`.

The app only sends the share target manifest in supporting installed browsers (primarily Android Chrome). iOS does not support registering a PWA as a native share extension; paste the URL into Add Video there.

## Install

- Android: visit the HTTPS site in Chrome, choose Install app / Add to Home screen; then VideoVault can appear as a share target.
- iOS/iPadOS: open in Safari, tap Share, then Add to Home Screen. Use Add Video to paste links from the share sheet.
- Desktop: use the browser's install icon or menu.

## Offline behavior

Fetched cloud videos are cached in IndexedDB. Newly added items while offline are queued and retried on the next online event or app launch. Background Sync is not required.

## Notes

A PWA manifest may include any declared raster or SVG icon, but some install surfaces require explicit 192×192 and 512×512 PNG assets. Replace `public/icons/icon.svg` with branded PNG exports when preparing store-quality distribution. The current metadata function deliberately avoids cross-host redirects and refuses non-HTTPS URLs; social platforms can decline metadata requests. Link saving does not depend on metadata availability.


