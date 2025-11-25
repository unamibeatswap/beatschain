# BeatsChain Extension Zip Creation Rules
*Updated: October 22, 2025 - 21:05*

## Package Structure
```
BeatsChain-[Description]-[YYYY-MM-DD-HH-MM].zip
├── BeatsChainExtension/
│   ├── manifest.json
│   ├── popup/
│   ├── lib/
│   ├── background/
│   └── assets/icons/
```

## Exclusion Rules
- **NO** markdown files (*.md) except README.md
- **NO** development files (.gitignore, package.json, etc.)
- **NO** documentation folders
- **NO** temporary files
- **NO** test files
- **NO** build artifacts

## Naming Convention
`BeatsChain-[Feature/Fix Description]-[YYYY-MM-DD-HH-MM].zip`

## Creation Command
```bash
cd /workspaces/chromextension/BeatsChainExtension
zip -r "../BeatsChain-[Description]-$(date +%Y-%m-%d-%H-%M).zip" . -x "*.md" "*.git*" "*node_modules*" "*package*.json" "*test*" "*spec*" "*.log"
```

## Critical Rules
- **MUST** zip from INSIDE BeatsChainExtension directory
- **MUST** use `-H-M` format (no colons) for Windows compatibility
- **MUST** have manifest.json at root level of zip
- **NEVER** include parent directory in zip structure
- **MUST** exclude all development and documentation files

## Integration Standards
- **NO BREAKING CHANGES**: All existing functionality must remain intact
- **EXTENSION APPROACH**: New features integrate WITH existing systems, never replace
- **BACKWARD COMPATIBILITY**: All existing features must continue to work
- **PERFORMANCE PRESERVATION**: No degradation in extension performance
- **UI CONSISTENCY**: New features follow existing design patterns

## Quality Checklist
- [ ] All core files included
- [ ] No markdown files (except README.md)
- [ ] Proper timestamp format
- [ ] Descriptive package name
- [ ] Extension loads without errors
- [ ] All existing functionality preserved
- [ ] New features integrate properly
- [ ] No breaking changes introduced
- [ ] Performance maintained or improved
- [ ] Chrome Web Store compliance verified