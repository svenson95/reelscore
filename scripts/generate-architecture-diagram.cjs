const fs = require('node:fs');

const [graphPath, readmePath] = process.argv.slice(2);

if (!graphPath || !readmePath) {
  throw new Error(
    'Usage: node scripts/generate-architecture-diagram.cjs <graph.json> <README.md>'
  );
}

const projectGraph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));
const readme = fs.readFileSync(readmePath, 'utf8');
const startMarker = '<!-- nx-architecture:start -->';
const endMarker = '<!-- nx-architecture:end -->';

const startIndex = readme.indexOf(startMarker);
const endIndex = readme.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  throw new Error('README must contain one valid Nx architecture marker pair.');
}

if (
  readme.indexOf(startMarker, startIndex + startMarker.length) !== -1 ||
  readme.indexOf(endMarker, endIndex + endMarker.length) !== -1
) {
  throw new Error('README must contain exactly one Nx architecture marker pair.');
}

const projects = Object.keys(projectGraph.graph.nodes).sort();
const projectIds = new Map(
  projects.map((projectName) => [
    projectName,
    projectName.replace(/[^a-zA-Z0-9_]/g, '_'),
  ])
);

const diagramLines = ['```mermaid', 'flowchart LR'];

for (const projectName of projects) {
  const projectId = projectIds.get(projectName);
  diagramLines.push(`  ${projectId}["${projectName}"]`);
}

const dependencies = Object.values(projectGraph.graph.dependencies)
  .flat()
  .filter(
    (dependency) =>
      projectIds.has(dependency.source) && projectIds.has(dependency.target)
  )
  .sort((first, second) => {
    const firstKey = `${first.source}:${first.target}`;
    const secondKey = `${second.source}:${second.target}`;

    return firstKey.localeCompare(secondKey);
  });

for (const dependency of dependencies) {
  const sourceId = projectIds.get(dependency.source);
  const targetId = projectIds.get(dependency.target);

  diagramLines.push(`  ${sourceId} --> ${targetId}`);
}

diagramLines.push('```');

const generatedBlock = `${startMarker}\n\n${diagramLines.join('\n')}\n\n${endMarker}`;
const blockStart = startIndex;
const blockEnd = endIndex + endMarker.length;
const updatedReadme = `${readme.slice(0, blockStart)}${generatedBlock}${readme.slice(blockEnd)}`;

if (updatedReadme !== readme) {
  fs.writeFileSync(readmePath, updatedReadme);
}
