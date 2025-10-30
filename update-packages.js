#!/usr/bin/env node

/**
 * Script to update all Mastra packages to use a custom scope for private publishing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const ORIGINAL_SCOPE = '@mastra';
const NEW_SCOPE = '@yourcompany';
const NEW_VERSION_SUFFIX = '-private';

// Find all package.json files
function findPackageJsonFiles() {
  const output = execSync('find . -name "package.json" -not -path "./node_modules/*" -not -path "./.git/*"', { encoding: 'utf-8' });
  return output.trim().split('\n').filter(line => line.length > 0);
}

// Update package.json file
function updatePackageJson(filePath) {
  console.log(`Updating: ${filePath}`);

  const content = fs.readFileSync(filePath, 'utf-8');
  const pkg = JSON.parse(content);

  // Update package name if it uses @mastra scope
  if (pkg.name && pkg.name.startsWith(ORIGINAL_SCOPE)) {
    const newName = pkg.name.replace(ORIGINAL_SCOPE, NEW_SCOPE);
    console.log(`  Renaming: ${pkg.name} -> ${newName}`);
    pkg.name = newName;
  }

  // Add version suffix if not already present
  if (pkg.version && !pkg.version.includes(NEW_VERSION_SUFFIX)) {
    const currentVersion = pkg.version;
    pkg.version = `${currentVersion}${NEW_VERSION_SUFFIX}.1`;
    console.log(`  Version: ${currentVersion} -> ${pkg.version}`);
  }

  // Remove private flag for publishing
  if (pkg.private) {
    delete pkg.private;
    console.log(`  Removed private flag`);
  }

  // Add publish config for local registry
  if (!pkg.publishConfig) {
    pkg.publishConfig = {
      registry: "http://localhost:4873/"
    };
    console.log(`  Added publishConfig for local registry`);
  }

  // Update dependencies that use @mastra scope
  ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach(depType => {
    if (pkg[depType]) {
      Object.keys(pkg[depType]).forEach(depName => {
        if (depName.startsWith(ORIGINAL_SCOPE)) {
          const newDepName = depName.replace(ORIGINAL_SCOPE, NEW_SCOPE);
          const depVersion = pkg[depType][depName];

          // Only update if it's a workspace reference or version reference
          if (depVersion === 'workspace:*' || depVersion.startsWith('^') || depVersion.startsWith('~')) {
            console.log(`  Updating dependency: ${depName} -> ${newDepName}`);
            delete pkg[depType][depName];
            pkg[depType][newDepName] = depVersion;
          }
        }
      });
    }
  });

  // Write updated package.json
  fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
}

// Main execution
function main() {
  console.log('🔄 Updating Mastra packages for private publishing...\n');

  const packageFiles = findPackageJsonFiles();
  console.log(`Found ${packageFiles.length} package.json files\n`);

  packageFiles.forEach(updatePackageJson);

  console.log('\n✅ Package update completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Add user to Verdaccio: npm adduser --registry http://localhost:4873/');
  console.log('2. Build packages: pnpm build');
  console.log('3. Publish packages: pnpm publish -r --registry http://localhost:4873/');
}

main();