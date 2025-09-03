HomeCycleHome — Deployment Guide

1) Overview & Architecture

Frontend: React + Vite. In dev, /api is proxied to the backend.

Backend: Node/Express (ESM) + MongoDB + JWT (cookies). App & routes are mounted under /api/*.

HTTP client: Axios is configured to call '/api' and send credentials (cookies).

Production routing: Netlify forwards /api/* and /health to the backend.

Containers: The CDA referential values containerization (“Les containeurs implémentent les services requis”). Include Docker in your procedure.

2) Prerequisites

Node.js 18+ (20+ recommended)

Docker Desktop (or Docker Engine + Compose) — for the containerized setup

Netlify account (frontend)

Render (or a Node host) for the backend

3) Environment Variables
Backend (.env)

Create a .env at the backend root with at least:

PORT=3000
MONGO_URI=mongodb://<user>:<password>@<host>:27017/<db>?authSource=admin
JWT_SECRET=<your-strong-secret>
# Optional (geocoding etiquette):
NOMINATIM_EMAIL=<your-contact-email>
NOMINATIM_USER_AGENT=HomeCycleHome/1.0 (<your-contact-email>)


The server reads the JWT from the access_token cookie and attaches the user to req.user.

API + CORS + routes are in index.js (mounted under /api).

Frontend (client/.env, optional)

Not strictly required. Axios points to '/api' and passes cookies by default. Netlify redirects to your backend in production.

4) Local Development (non-Docker)
4.1 Backend
cd backend
npm install
npm run dev   # nodemon on :3000


Health route: /health.

4.2 Frontend
cd client
npm install
npm run dev   # Vite on :5173


Vite dev proxy sends /api → http://localhost:3000.

5) Run with Docker (Backend + Mongo)

Use this if you want the API and DB fully containerized.

5.1 Prerequisites

Docker Desktop (Windows/Mac) or Docker Engine + Compose (Linux).

5.2 Bootstrap DB User (already scripted)

Mongo is initialized via mongo-init.js (creates DB and a readWrite user). Keep the same credentials in your MONGO_URI.

5.3 Compose Up

From the project root (where docker-compose.yml lives):

docker-compose up --build


What this does:

Builds and runs the backend container (exposes :3000).

Runs MongoDB and executes mongo-init.js.

The API connects using MONGO_URI (use the container hostname, e.g. mongo).

Example .env for Docker:

PORT=3000
MONGO_URI=mongodb://hch_user:hch_pass@mongo:27017/HomeCycleHome?authSource=admin
JWT_SECRET=<your-strong-secret>

5.4 Verify

API health: curl http://localhost:3000/health → should return OK.

Mongo shell (optional): docker exec -it <mongo-container-id> mongosh -u hch_user -p hch_pass

5.5 Production with Compose

On a VM/Docker host:

docker-compose up -d


Expose port 3000 via your reverse proxy (Caddy/Nginx/Traefik). Point your frontend’s /api/* to that API host (see Netlify redirects below).

6) Production Deployments
6.1 Backend on Render (managed, no Docker required)

Create a Web Service:

Build: npm install

Start: npm start (per backend/package.json)

Environment variables: PORT, MONGO_URI, JWT_SECRET, NOMINATIM_* (optional).

Node runtime: 18+.

Health check: /health (already implemented).

Note the API URL, e.g. https://homecyclehome-api.onrender.com.

You can also deploy as a Docker service on Render if you prefer shipping your own image.

6.2 Frontend on Netlify (static hosting + runtime proxy)

Your netlify.toml already defines:

Build in client/ and publish dist/.

Runtime redirects:

/api/* → your backend on Render

/health → backend health (handy probe)

SPA fallback to /index.html

Steps:

New Site → Link your Git repo.

Build settings:

Base: client

Build command: npm ci && npm run build

Publish directory: dist

Ensure the [[redirects]] target in netlify.toml points to your actual backend URL.

No frontend env var is needed: Axios calls '/api' and Netlify rewrites at the edge.

7) Cookies, CORS & Auth (Prod Notes)

CORS: Backend allows Netlify + localhost origins by default. Update the origin array if your Netlify domain changes.

Cookies/Auth:

Axios uses withCredentials: true; the browser sends/receives access_token cookie.

Frontend checks JWT expiry and auto-logs-out if expired.

Server verifies JWT from cookie (verifyToken) and enforces roles with verifyRole.

8) Health Checks & Smoke Tests

Backend health

Local: curl http://localhost:3000/health

Prod via Netlify edge: curl https://<your-netlify-domain>/health → forwarded to backend.

Auth smoke

Sign in via the app → confirm access_token cookie is set → call a protected route.

9) Troubleshooting

CORS errors (browser console)
Add your exact Netlify site URL to origin in backend CORS config.

401/403 on protected routes
Ensure cookies are sent (withCredentials), and JWT_SECRET matches between environments.

Frontend /api 404/502 in production
Verify netlify.toml redirects target your current backend URL.

Mongo connection timeouts
Check MONGO_URI, network allowlist, and that the service can reach your DB.

10) Commands Reference

Backend

# from backend/
npm run dev     # dev server on :3000
npm start       # production start


Frontend

# from client/
npm run dev     # vite on :5173 (proxies /api to :3000)
npm run build   # build to /dist
npm run preview # serve built site locally


Docker

docker-compose up --build  # build & run API + Mongo
docker-compose up -d       # daemon mode (prod-like)
docker-compose down        # stop

Appendix — How the /api path stays the same

Dev: Vite proxies /api → http://localhost:3000.

Prod: Netlify rewrites /api/* → your backend URL. Your frontend code doesn’t change.



HomeCycl’Home
Réparation et entretien de vélos à domicile

L’entreprise LeCycleLyonnais fort de ses 68 ans d'expérience dans la vente et l’entretien de bicyclette souhaite mettre en place un service de réparation et d’entretien à domicile de bicyclettes et bicyclettes électriques (VAE). La vente additionnelle de produits dédiés sera aussi proposée.

Besoin: 
Une application permettant de proposer des créneaux de rendez-vous pour des réparations et de la maintenance qui seront attribués aux techniciens en fonction de leur zone géographique.
Les administrateurs établissent des disponibilités d'interventions par zone géographique. La durée de l'intervention, et donc du créneau prévu, dépend du temps nécessaire à l'intervention, déterminé selon un forfait préétabli dans l'application.
Lorsque le client accède à l'application, il est invité à entrer son adresse ou à se connecter s'il possède déjà un compte. Dans ce dernier cas, son adresse lui sera suggérée.
Dans le cas contraire, l'application lui propose une adresse validée par un service dédié (comme Google Maps ?).
Des informations concernant le modèle, l'année et le type de cycle sont requises.
Le client sélectionne une opération de maintenance ou une opération de réparation.
Pour une maintenance, le client choisit un forfait (plusieurs options de forfaits d'entretien sont disponibles) puis un créneau horaire conforme au type de forfait dans sa zone géographique. Il peut également ajouter des photos depuis son smartphone pour fournir plus d'informations. De plus, le client a la possibilité d'ajouter des articles (produits). Une fois le rendez-vous validé, il est invité à créer un compte s'il n'en a pas encore.
En ce qui concerne une réparation, le même principe s'applique pour l'adresse, mais le client est invité à fournir des détails sur la panne. Des photos sont également demandées. Le client choisit ensuite son créneau horaire et est informé que le technicien le contactera pour obtenir plus d'informations. 
À la fin de chaque intervention, le technicien prend une ou plusieurs photos du travail réalisé et peut apporter des modifications au dossier du client. Il procède au paiement.
L’entreprise LeCycleLyonnais souhaite capitaliser cette application en la proposant à d’autres entreprises (hors zone couverte par LeCycleLyonnais) en marque blanche.
Chaque marque blanche possède sons sous domaine personnalisé et aura la possibilité d’ajouter son logo et les couleurs du thème de son application.
 
Plusieurs types d’utilisateurs:
	• Super Administrateur
	• Administrateur de l’application
	• Techniciens en charge de la réparation, maintenance des cycles
	• Clients

Fonctionnalités:

Super Administrateur:
	• Créer, modifier et supprimer des entreprises en marque blanche.
	• Créer ajouter et supprimer des super administrateurs
Administrateurs:
	• Gérer les informations de la société affichées sur l’application
	• Lister les clients et modifier les informations liées et ajouter
	• Lister les interventions, modifier et ajouter
	• Afficher le planning (calendrier) par technicien
	• Afficher, modifier et ajouter des utilisateurs de l’application (techniciens, admin, client)
	• Afficher, modifier, supprimer une intervention
	• Afficher, modifier et ajouter des produits additionnelles
	• Afficher, modifier et ajouter les prix des interventions
	• Afficher, modifier et ajouter des zones géographiques affectées aux techniciens
	• Afficher, modifier et ajouter des modèle de planifications en fonction des réparations et entretiens (forfaits entretien, demande de devis de réparation, réparations)
Techniciens:
	• Listes les interventions passés
	• Listes des interventions de la journée 
	• Listes des interventions des jours suivants
	• Filtres par type (entretien, réparation)
	• Afficher les détails des interventions
	• Afficher les détails des clients dans les interventions
	• Modifier les intervention, les clients
	• Déposer des photos dans les interventions
	• Ajouter des commentaires dans les interventions
	• Marquer les interventions comme faites.
	• Annuler une intervention.
Clients:
	• Créer un compte / se connecter
	• Lister les interventions passées
	• Voir ses factures
	• Réserver un créneau pour une intervention
	• Annuler une intervention
	• Voir ses cycles et pouvoir les modifier
   Voir sa fiche et pouvoir modifier
