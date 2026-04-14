# Data and Content Guide

This document defines content contracts for files in `/data`.

## General rules

- Keep IDs stable and unique.
- Keep copy concise and truthful.
- Always include `nodePosition` for graph-rendered entities.
- Maintain at least 2 units of spacing between nearby leaf nodes.

## projects.json

Required fields per project:

- `id`: string
- `title`: string
- `tagline`: string
- `stack`: string[]
- `bullets`: string[] (recommended exactly 3)
- `liveUrl`: string
- `githubUrl`: string
- `screenshot`: string (`/screenshots/...`)
- `nodePosition`: [number, number, number]

## skills.json

Required fields per category:

- `id`: string
- `category`: string
- `nodePosition`: [number, number, number]
- `skills`: { `name`: string; `context`: string }[]

## experience.json

Required fields per item:

- `id`: string
- `role`: string
- `company`: string
- `location`: string
- `dates`: string
- `nodePosition`: [number, number, number]
- `bullets`: string[] (max 3)

## certifications.json

Required fields per item:

- `id`: string
- `name`: string
- `issuer`: string
- `date`: string
- `credentialUrl`: string (optional)
- `nodePosition`: [number, number, number]

## about.json

Suggested structure:

- `intro`: short conversational paragraph
- `gamingCommunity`: string
- `availability`: string
- `contact`: { `email`: string; `github`: string; `linkedin`: string }

## Type alignment

When editing JSON, update `types/index.ts` only if schema changes. Keep the app and data contracts synchronized to avoid runtime panel errors.
