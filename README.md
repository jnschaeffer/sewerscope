# Sewer Scope: Clogged storm drain reporting for Philadelphia, USA

Philadelphia has a lot of trees, a major littering problem, and no street sweeping program. This means storm drains get clogged easily, causing flooding and other issues on streets and sidewalks. While the city has a public [issue reporting system](https://iframe.publicstuff.com/#?client_id=242), submitting issues is slow and cumbersome.

Sewer Scope aims to make reporting clogged storm drains and tracking updates easier by providing a fast, simple way to submit reports.

## Architecture

Sewer Scope is a Next.js app built on top of the Supabase platform. The UI is primarily based on shadcn/ui and Supabase UI blocks. Sewer Scope uses Auth for user management, PostgREST for data management, and Storage for uploading images. A future iteration of the application will use cron jobs to submit issues to the Philadelphia 311 reporting system in batches.

## Data

The database schema for this app is available at db/schema.sql.

To use Sewer Scope, you will need actual storm drain data from the city of Philadelphia. The city's [open data repository](https://opendataphilly.org/datasets/water-inlets/) contains a CSV of every water inlet in Philadelphia. Load this into the `inlets` table and you should be good to go!
