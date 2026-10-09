/// <reference types="node" />

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repositoryRoot = path.resolve(import.meta.dirname, '../../..');
const appNames = ['landing', 'customer', 'admin', 'kds'] as const;

function collectFiles(directory: string, extension: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(entryPath, extension);
    return entry.isFile() && entry.name.endsWith(extension) ? [entryPath] : [];
  });
}

function customPropertyNames(css: string): string[] {
  const declarations = [...css.matchAll(/(?:^|[{;]\s*)--([a-z0-9-]+)\s*:/gim)].map((match) => match[1]!);
  const references = [...css.matchAll(/var\(\s*--([a-z0-9-]+)/gi)].map((match) => match[1]!);
  return [...new Set([...declarations, ...references])];
}

describe('frontend design-system boundaries', () => {
  it.each(appNames)('%s owns its token and asset contracts', (appName) => {
    expect(existsSync(path.join(repositoryRoot, 'apps', appName, 'src', 'design-system', 'tokens.css'))).toBe(true);
    expect(existsSync(path.join(repositoryRoot, 'apps', appName, 'public', 'assets', 'README.md'))).toBe(true);
  });

  it.each(appNames)('%s CSS uses only its own custom-property namespace', (appName) => {
    const cssFiles = collectFiles(path.join(repositoryRoot, 'apps', appName, 'src'), '.css');
    const allowedThirdPartyProperties = appName === 'landing' ? new Set(['radix-accordion-content-height']) : new Set<string>();

    for (const cssFile of cssFiles) {
      const foreignProperties = customPropertyNames(readFileSync(cssFile, 'utf8')).filter(
        (property) => !property.startsWith(`${appName}-`) && !allowedThirdPartyProperties.has(property),
      );
      expect(foreignProperties, `${path.relative(repositoryRoot, cssFile)} has foreign custom properties`).toEqual([]);
    }
  });

  it('keeps the shared UI package structural and CSS-free', () => {
    const uiPackage = JSON.parse(readFileSync(path.join(repositoryRoot, 'packages', 'ui', 'package.json'), 'utf8')) as {
      exports: Record<string, string>;
    };
    expect(uiPackage.exports).toEqual({ '.': './src/index.tsx' });
    expect(existsSync(path.join(repositoryRoot, 'packages', 'ui', 'src', 'foundation.css'))).toBe(false);

    for (const appName of appNames) {
      const css = collectFiles(path.join(repositoryRoot, 'apps', appName, 'src'), '.css')
        .map((file) => readFileSync(file, 'utf8'))
        .join('\n');
      expect(css).not.toContain('@pizza-avenue/ui/foundation.css');
    }
  });

  it('does not import source or assets across app boundaries', () => {
    for (const appName of appNames) {
      const sourceDirectory = path.join(repositoryRoot, 'apps', appName, 'src');
      const source = ['.ts', '.tsx', '.css']
        .flatMap((extension) => collectFiles(sourceDirectory, extension))
        .map((file) => readFileSync(file, 'utf8'))
        .join('\n');

      for (const otherApp of appNames.filter((candidate) => candidate !== appName)) {
        expect(source).not.toMatch(new RegExp(`apps[\\\\/]${otherApp}[\\\\/](?:src|public|assets)`));
      }
    }
  });
});
