# Node SFX

Add these files to enable node click sound effects:

- `public/sfx/node-central.wav` -> plays only for the central node.
- `public/sfx/node-default.wav` -> plays for every non-central node.

Notes:
- Keep clips short (100ms to 400ms) for snappy UI feedback.
- Use normalized loudness around -18 LUFS to avoid harsh volume spikes.
- Mono files are recommended for small file size.
