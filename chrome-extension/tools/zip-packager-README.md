BeatsChain ZIP Packager

This helper validates a prepared package folder against core ZIP rules (size, mime types, filename sanitation)
and then creates a zip archive preserving folder structure.

Usage:

```bash
chmod +x tools/zip-packager.sh
./tools/zip-packager.sh /path/to/Track_Title_Radio_Submission /tmp/Track_Title_Radio_Submission.zip
```

Notes:
- The script expects the folder to already be organized according to the ZIP rules (audio/, images/, metadata/, samro/, contact/, biography/).
- It validates audio size (<=50MB) and attempts MIME validation using the `file` command.
- It warns about unsupported mime types and fails on critical issues (oversize, control chars in filenames).
- This is a local testing helper — production packaging should embed metadata and run full validation pipelines.
