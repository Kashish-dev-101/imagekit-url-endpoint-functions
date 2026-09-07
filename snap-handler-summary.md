# snap_user_images Path Rewriter — Summary

## Overview

The `snap_user_images` Path Rewriter is a lightweight URL handler built for ImageKit that resolves a path mismatch between our database and S3. Our database stores image URLs with a legacy `snap_user_images/` prefix (carried over from Cloudinary), but the actual files in S3 don't have that prefix. This handler intercepts incoming image requests and silently strips the extra prefix before the request hits S3, so images load correctly — all without any changes to the database or existing stored URLs.

## Example

| | URL |
|---|---|
| **Before** | `https://ik.imagekit.io/hme/snap_user_images/snap/0000014a-0604-11ef-a0c5-0242ac11001b/6589074` |
| **After** | `https://ik.imagekit.io/hme/snap/0000014a-0604-11ef-a0c5-0242ac11001b/6589074` |

## Gist (Handler + Test Cases)

https://gist.github.com/Kashish-dev-101/1426635f67f0c83c7a6b23befe8ca9de
