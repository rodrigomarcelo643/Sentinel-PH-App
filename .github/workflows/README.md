# CI/CD Pipeline - INACTIVE

> **Status:** INACTIVE - Template files for future implementation

This directory contains GitHub Actions workflow templates for automated CI/CD pipelines for the Sentinel PH mobile application.

## 📋 Overview

### Pipelines

1. **CI Pipeline** (`ci.yml.template`)
   - Lint & format checking
   - TypeScript type checking
   - Unit tests
   - Android APK build
   - iOS IPA build
   - Triggers: Push/PR to main/develop

2. **CD Pipeline** (`cd.yml.template`)
   - Deploy to Expo
   - Deploy Android to Play Store
   - Deploy iOS to App Store/TestFlight
   - Triggers: Version tags (v*.*.*) or manual dispatch

3. **PR Validation** (`pr-validation.yml.template`)
   - Commit message validation
   - Merge conflict detection
   - Changed files linting
   - Security scanning
   - Automated PR comments

## 🚀 Activation Steps

### 1. Rename Template Files
```bash
cd .github/workflows
mv ci.yml.template ci.yml
mv cd.yml.template cd.yml
mv pr-validation.yml.template pr-validation.yml
```

### 2. Configure GitHub Secrets

Navigate to: `Settings > Secrets and variables > Actions`

#### Required Secrets

**Expo:**
- `EXPO_TOKEN` - Expo access token (get from expo.dev)

**Firebase:**
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

**Google Play Store (Android):**
- `GOOGLE_PLAY_SERVICE_ACCOUNT` - Service account JSON

**Apple App Store (iOS):**
- `APPSTORE_ISSUER_ID`
- `APPSTORE_API_KEY_ID`
- `APPSTORE_API_PRIVATE_KEY`

### 3. Update Package Configuration

Add test script to `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Configure App Store Credentials

**Android (Google Play):**
1. Create service account in Google Cloud Console
2. Grant access in Play Console
3. Download JSON key
4. Add to GitHub secrets

**iOS (App Store Connect):**
1. Create API key in App Store Connect
2. Download .p8 file
3. Note Issuer ID and Key ID
4. Add to GitHub secrets

## 📦 Build Configuration

### Android
- Build type: APK (CI), AAB (CD)
- Target: Play Store Internal Track
- Java version: 17

### iOS
- Build type: Archive
- Target: TestFlight
- Requires: Apple Developer account

## 🔧 Customization

### Modify Triggers
```yaml
on:
  push:
    branches: [ main, develop, staging ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly
```

### Add Environment Variables
```yaml
env:
  NODE_ENV: production
  EXPO_PUBLIC_API_URL: ${{ secrets.API_URL }}
```

### Add Slack Notifications
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📊 Workflow Status

Once activated, badges can be added to README:

```markdown
![CI](https://github.com/username/sentinel-ph-app/workflows/CI%20Pipeline/badge.svg)
![CD](https://github.com/username/sentinel-ph-app/workflows/CD%20Pipeline/badge.svg)
```

## 🧪 Testing Locally

### Test CI steps locally with act:
```bash
# Install act
brew install act  # macOS
choco install act  # Windows

# Run CI workflow
act -j lint
act -j typecheck
```

## 📝 Commit Convention

Pipelines enforce conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `perf:` Performance
- `test:` Tests
- `chore:` Maintenance
- `ci:` CI/CD changes

## 🔒 Security

- Secrets are encrypted in GitHub
- Never commit credentials
- Use environment-specific secrets
- Rotate tokens regularly
- Enable branch protection rules

## 📚 Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Expo Build Docs](https://docs.expo.dev/build/introduction/)
- [Play Store Publishing](https://developer.android.com/studio/publish)
- [App Store Connect](https://developer.apple.com/app-store-connect/)

## ⚠️ Important Notes

- **INACTIVE:** These are template files
- Test in staging environment first
- Monitor build times and costs
- Set up notifications for failures
- Review security scan results
- Keep dependencies updated

---

**Branch:** `feature/cicd-infrastructure-template`  
**Status:** Ready for activation when needed
