# Data and Content Guide

This document defines content contracts for files in `/data`.

## Progress

- [x] Content schema documented
- [x] Project data contract documented
- [x] Skills data contract documented
- [x] Experience data contract documented
- [x] Certifications data contract documented
- [x] About data contract documented
- [ ] Final content values reviewed

## General rules

- [x] Keep IDs stable and unique.
- [x] Keep copy concise and truthful.
- [x] Always include `nodePosition` for graph-rendered entities.
- [x] Maintain at least 2 units of spacing between nearby leaf nodes.

## projects.json

Required fields per project:

- [x] `id`: string
- [x] `title`: string
- [x] `tagline`: string
- [x] `stack`: string[]
- [x] `bullets`: string[] (recommended exactly 3)
- [x] `liveUrl`: string
- [x] `githubUrl`: string
- [x] `screenshot`: string (`/screenshots/...`)
- [x] `nodePosition`: [number, number, number]

## skills.json

Required fields per category:

- [x] `id`: string
- [x] `category`: string
- [x] `nodePosition`: [number, number, number]
- [x] `skills`: { `name`: string; `context`: string }[]

## experience.json

Required fields per item:

- [x] `id`: string
- [x] `role`: string
- [x] `company`: string
- [x] `location`: string
- [x] `dates`: string
- [x] `nodePosition`: [number, number, number]
- [x] `bullets`: string[] (max 3)

## certifications.json

Required fields per item:

- [x] `id`: string
- [x] `name`: string
- [x] `issuer`: string
- [x] `date`: string
- [x] `credentialUrl`: string (optional)
- [x] `nodePosition`: [number, number, number]

## about.json

Suggested structure:

- [x] `intro`: short conversational paragraph
- [x] `gamingCommunity`: string
- [x] `availability`: string
- [x] `contact`: { `email`: string; `github`: string; `linkedin`: string }

## Type alignment

When editing JSON, update `types/index.ts` only if schema changes. Keep the app and data contracts synchronized to avoid runtime panel errors.

- [x] Update `types/index.ts` only if schema changes.
- [x] Keep the app and data contracts synchronized to avoid runtime panel errors.
