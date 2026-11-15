# Ventura — travel companion

Two apps from one codebase and design system:

- **Ventura for mobile** (`index.html`): for being out in the city. Map with safety and events
  layers, Today (the trip you're on), landmark camera, local guide bookings and profile.
- **Ventura for desktop** (`desktop.html`, served at `/desktop`): for planning. AI and guided
  planning, Explore, the trip editor, a research map, discoveries and what the phone saved.

See [`DESIGN.md`](./DESIGN.md) for what lives where, the design system and how to restyle it.

```sh
npm install
npm run dev          # mobile at http://localhost:8080, desktop at http://localhost:8080/desktop
```

If the dev server fails with `EAFNOSUPPORT` (no IPv6), run `npx vite --host 127.0.0.1`.

The trip planner lives in the desktop app at `/desktop/plan`. Build the embeddable interactive
prototype of both apps with `npm run build:prototype` (see DESIGN.md).

Supabase is optional: without `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` the app
runs entirely on the mock data in `src/data/`.

---

## Lovable project

## Project info

**URL**: https://lovable.dev/projects/3d5c839b-e89f-4177-b9ce-d65602614f6b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3d5c839b-e89f-4177-b9ce-d65602614f6b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3d5c839b-e89f-4177-b9ce-d65602614f6b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
