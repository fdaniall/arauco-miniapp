#!/usr/bin/env node

/**
 * Farcaster Mini App Manifest Validator
 * Run with: node scripts/validate-farcaster-manifest.js
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../public/.well-known/farcaster.json');

function validateManifest() {
  console.log('🔍 Validating Farcaster manifest...\n');

  // Read manifest
  let manifest;
  try {
    const content = fs.readFileSync(MANIFEST_PATH, 'utf8');
    manifest = JSON.parse(content);
  } catch (error) {
    console.error('❌ Error reading manifest:', error.message);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];

  // Check structure
  if (!manifest.miniapp && !manifest.frame) {
    errors.push('Missing "miniapp" property');
  }

  if (manifest.frame && !manifest.miniapp) {
    warnings.push('Using deprecated "frame" property. Use "miniapp" instead.');
  }

  const app = manifest.miniapp || manifest.frame;

  // Required fields
  const required = ['version', 'name', 'iconUrl', 'homeUrl'];
  required.forEach(field => {
    if (!app[field]) {
      errors.push(`Missing required field: miniapp.${field}`);
    }
  });

  // Validate version
  if (app.version !== '1') {
    errors.push('Version must be "1"');
  }

  // Validate lengths
  if (app.name && app.name.length > 32) {
    errors.push(`name too long (${app.name.length}/32 chars)`);
  }

  if (app.subtitle && app.subtitle.length > 30) {
    errors.push(`subtitle too long (${app.subtitle.length}/30 chars)`);
  }

  if (app.description && app.description.length > 170) {
    errors.push(`description too long (${app.description.length}/170 chars)`);
  }

  if (app.tagline && app.tagline.length > 30) {
    errors.push(`tagline too long (${app.tagline.length}/30 chars)`);
  }

  if (app.ogTitle && app.ogTitle.length > 30) {
    errors.push(`ogTitle too long (${app.ogTitle.length}/30 chars)`);
  }

  if (app.ogDescription && app.ogDescription.length > 100) {
    errors.push(`ogDescription too long (${app.ogDescription.length}/100 chars)`);
  }

  // Validate URLs
  const urlFields = ['homeUrl', 'iconUrl', 'splashImageUrl', 'heroImageUrl', 'ogImageUrl', 'webhookUrl'];
  urlFields.forEach(field => {
    if (app[field]) {
      if (app[field].length > 1024) {
        errors.push(`${field} too long (${app[field].length}/1024 chars)`);
      }
      try {
        new URL(app[field]);
      } catch {
        errors.push(`Invalid URL for ${field}: ${app[field]}`);
      }
    }
  });

  // Validate tags
  if (app.tags) {
    if (app.tags.length > 5) {
      errors.push(`Too many tags (${app.tags.length}/5 max)`);
    }
    app.tags.forEach((tag, i) => {
      if (tag.length > 20) {
        errors.push(`Tag ${i} too long (${tag.length}/20 chars)`);
      }
      if (!/^[a-z0-9-]+$/.test(tag)) {
        errors.push(`Tag "${tag}" must be lowercase, no spaces, no special characters`);
      }
    });
  }

  // Validate emoji/special chars
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  if (app.subtitle && emojiRegex.test(app.subtitle)) {
    warnings.push('subtitle contains emojis (not recommended)');
  }

  if (app.description && emojiRegex.test(app.description)) {
    warnings.push('description contains emojis (not recommended)');
  }

  // Validate account association
  if (!manifest.accountAssociation) {
    warnings.push('Missing accountAssociation (required for verification)');
  } else {
    const required = ['header', 'payload', 'signature'];
    required.forEach(field => {
      if (!manifest.accountAssociation[field]) {
        errors.push(`Missing accountAssociation.${field}`);
      }
    });
  }

  // Validate chains
  if (app.requiredChains && app.requiredChains.length > 0) {
    app.requiredChains.forEach(chain => {
      if (!chain.startsWith('eip155:')) {
        warnings.push(`Chain "${chain}" should use CAIP-2 format (e.g., eip155:8453)`);
      }
    });
  }

  // Print results
  console.log('📋 Validation Results:\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Manifest is valid!\n');
    console.log('📊 Manifest Summary:');
    console.log(`   Name: ${app.name}`);
    console.log(`   Subtitle: ${app.subtitle || 'N/A'}`);
    console.log(`   Category: ${app.primaryCategory || 'N/A'}`);
    console.log(`   Tags: ${app.tags?.join(', ') || 'N/A'}`);
    console.log(`   Home URL: ${app.homeUrl}`);
    console.log(`   Webhook: ${app.webhookUrl || 'N/A'}`);
    console.log(`   Required Chains: ${app.requiredChains?.join(', ') || 'N/A'}\n`);
    return true;
  }

  if (errors.length > 0) {
    console.log('❌ Errors:');
    errors.forEach(err => console.log(`   • ${err}`));
    console.log();
  }

  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(warn => console.log(`   • ${warn}`));
    console.log();
  }

  return errors.length === 0;
}

// Run validation
const isValid = validateManifest();
process.exit(isValid ? 0 : 1);
