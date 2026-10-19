# Project conventions
- Keep homepage presentation in the existing home components with page-scoped CSS tokens; this isolates redesigns from account and admin workflows.
- Retain live catalog/category hooks and route destinations during presentation changes so merchandising and user workflows remain intact.
- Scope non-home public and account presentation through PublicPageFrame and public-pages CSS; keep homepage and admin themes independent.