# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at `src/app/page.tsx`.

## Environment Variables

The Worldcoin Mini app expects the following variables:

- `NEXT_PUBLIC_WLD_APP_ID` – your Worldcoin App ID
- `NEXT_PUBLIC_WLD_ACTION_ID` – the action ID used for verification

Create a `.env` file based on `.env.example` and provide these values. Variables prefixed with `NEXT_PUBLIC_` are exposed to the client, so they are not secret. When deploying (e.g. on GitHub or Netlify), configure the same variables in your environment settings.
