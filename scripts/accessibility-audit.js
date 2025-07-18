#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class AccessibilityAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    console.log(`🔍 Auditing ${fileName}...`);
    
    // Check for accessibility props
    this.checkAccessibilityLabels(content, fileName);
    this.checkTouchableElements(content, fileName);
    this.checkImageAltText(content, fileName);
    this.checkColorContrast(content, fileName);
    this.checkFocusManagement(content, fileName);
  }

  checkAccessibilityLabels(content, fileName) {
    const touchableElements = content.match(/<(Pressable|TouchableOpacity|TouchableHighlight|Button)[^>]*>/g) || [];
    
    touchableElements.forEach((element, index) => {
      if (!element.includes('accessibilityLabel') && !element.includes('accessibilityHint')) {
        this.issues.push({
          file: fileName,
          type: 'Missing Accessibility Label',
          element: element.substring(0, 50) + '...',
          severity: 'high',
          fix: 'Add accessibilityLabel prop to describe the button action'
        });
      }
    });
  }

  checkTouchableElements(content, fileName) {
    const touchableElements = content.match(/<(Pressable|TouchableOpacity)[^>]*>/g) || [];
    
    touchableElements.forEach((element) => {
      if (!element.includes('accessibilityRole')) {
        this.warnings.push({
          file: fileName,
          type: 'Missing Accessibility Role',
          element: element.substring(0, 50) + '...',
          severity: 'medium',
          fix: 'Add accessibilityRole="button" for better screen reader support'
        });
      }
    });
  }

  checkImageAltText(content, fileName) {
    const images = content.match(/<Image[^>]*>/g) || [];
    
    images.forEach((image) => {
      if (!image.includes('accessibilityLabel') && !image.includes('accessible={false}')) {
        this.issues.push({
          file: fileName,
          type: 'Missing Image Alt Text',
          element: image.substring(0, 50) + '...',
          severity: 'high',
          fix: 'Add accessibilityLabel or set accessible={false} for decorative images'
        });
      }
    });
  }

  checkColorContrast(content, fileName) {
    // Check for hardcoded colors that might have contrast issues
    const colorMatches = content.match(/color:\s*['"`]#[0-9a-fA-F]{3,6}['"`]/g) || [];
    
    if (colorMatches.length > 0) {
      this.warnings.push({
        file: fileName,
        type: 'Hardcoded Colors Detected',
        count: colorMatches.length,
        severity: 'low',
        fix: 'Use theme colors and ensure WCAG AA contrast ratios (4.5:1 for normal text)'
      });
    }
  }

  checkFocusManagement(content, fileName) {
    if (content.includes('Modal') && !content.includes('onRequestClose')) {
      this.issues.push({
        file: fileName,
        type: 'Modal Missing Focus Management',
        severity: 'medium',
        fix: 'Add onRequestClose prop and proper focus management for modals'
      });
    }
  }

  generateReport() {
    console.log('\n📊 ACCESSIBILITY AUDIT REPORT');
    console.log('================================\n');

    if (this.issues.length === 0 && this.warnings.length === 0) {
      console.log('✅ No accessibility issues found!');
      return true;
    }

    if (this.issues.length > 0) {
      console.log(`❌ CRITICAL ISSUES (${this.issues.length}):`);
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.file}: ${issue.type}`);
        console.log(`   Severity: ${issue.severity.toUpperCase()}`);
        console.log(`   Fix: ${issue.fix}`);
        if (issue.element) console.log(`   Element: ${issue.element}`);
        console.log('');
      });
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  WARNINGS (${this.warnings.length}):`);
      this.warnings.forEach((warning, index) => {
        console.log(`${index + 1}. ${warning.file}: ${warning.type}`);
        console.log(`   Severity: ${warning.severity.toUpperCase()}`);
        console.log(`   Fix: ${warning.fix}`);
        if (warning.element) console.log(`   Element: ${warning.element}`);
        console.log('');
      });
    }

    console.log('📋 RECOMMENDATIONS:');
    console.log('• Test with VoiceOver (iOS) and TalkBack (Android)');
    console.log('• Verify color contrast ratios meet WCAG AA standards');
    console.log('• Test keyboard navigation on web platform');
    console.log('• Validate with accessibility testing tools');

    return this.issues.length === 0;
  }

  auditDirectory(dirPath) {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    files.forEach(file => {
      const fullPath = path.join(dirPath, file.name);
      
      if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'node_modules') {
        this.auditDirectory(fullPath);
      } else if (file.name.endsWith('.tsx') || file.name.endsWith('.ts')) {
        this.auditFile(fullPath);
      }
    });
  }
}

// Run the audit
const auditor = new AccessibilityAuditor();

console.log('🚀 Starting Accessibility Audit...\n');

// Audit main directories
['app', 'components'].forEach(dir => {
  if (fs.existsSync(dir)) {
    auditor.auditDirectory(dir);
  }
});

const passed = auditor.generateReport();

process.exit(passed ? 0 : 1);