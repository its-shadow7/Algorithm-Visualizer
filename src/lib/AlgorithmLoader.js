// Dynamic importer logic for the Scalability Protocol
const metaFiles = import.meta.glob('../algorithms/*/meta.json', { eager: true });
const algorithmFiles = import.meta.glob('../algorithms/*/algorithm.js');
const codeFiles = import.meta.glob('../algorithms/*/code.txt', { query: '?raw', eager: true });

export const getAlgorithms = () => {
  return Object.keys(metaFiles).map((path) => {
    const slug = path.split('/')[2];
    const meta = metaFiles[path];
    return {
      ...meta,
      slug,
      path: `../algorithms/${slug}/`
    };
  });
};

export const loadAlgorithmData = async (slug) => {
  const metaKey = Object.keys(metaFiles).find(k => k.includes(`/${slug}/meta.json`));
  const algoKey = Object.keys(algorithmFiles).find(k => k.includes(`/${slug}/algorithm.js`));
  const codeKey = Object.keys(codeFiles).find(k => k.includes(`/${slug}/code.txt`));

  if (!metaKey || !algoKey) throw new Error(`Algorithm ${slug} not found`);

  const meta = metaFiles[metaKey];
  const algorithmModule = await algorithmFiles[algoKey]();
  const code = codeFiles[codeKey]?.default || '';

  return {
    meta: meta.default || meta,
    slug,
    algorithmFn: algorithmModule[Object.keys(algorithmModule)[0]],
    code
  };
};
