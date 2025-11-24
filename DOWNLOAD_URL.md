# Downloading the fixed frontend bundle

Build a fresh archive locally by running:

```
npm run package:zip
```

The command writes `public/seoscribe-fixed.zip` (ignored by git so binary-only diffs never block PRs). If your Next.js server is running, the file is automatically served at:

```
http://localhost:3000/seoscribe-fixed.zip
```

Otherwise, copy `public/seoscribe-fixed.zip` directly from disk after generating it.
