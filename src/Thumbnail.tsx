import { useMemo } from 'react';
import { createModule, getPanels, type Kind } from './domain';

export default function Thumbnail({ kind }: { kind: Kind }) {
  const panels = useMemo(() => getPanels(createModule(kind)), [kind]);
  const projected: number[][] = [];
  const project = ([x, y, z]: number[]) => [x * .83 + z * .58, -y + x * .24 - z * .34];
  const faces = panels.flatMap(p => {
    const [w, h, d] = p.size; const [x, y, z] = p.center;
    const a = [x - w / 2, y - h / 2, z + d / 2], b = [x + w / 2, y - h / 2, z + d / 2];
    const c = [x + w / 2, y + h / 2, z + d / 2], e = [x - w / 2, y + h / 2, z + d / 2];
    const f = [x + w / 2, y + h / 2, z - d / 2], g = [x - w / 2, y + h / 2, z - d / 2], k = [x + w / 2, y - h / 2, z - d / 2];
    return [{ points: [b, k, f, c], fill: '#adb9bf' }, { points: [e, c, f, g], fill: '#f7f9fa' }, { points: [a, b, c, e], fill: '#dce3e7' }].map(face => {
      const points = face.points.map(project); projected.push(...points);
      return { points, fill: face.fill, order: z + y * .1 };
    });
  });
  const xs = projected.map(p => p[0]), ys = projected.map(p => p[1]);
  const left = Math.min(...xs) - 14, top = Math.min(...ys) - 14;
  const width = Math.max(...xs) - left + 14, height = Math.max(...ys) - top + 14;
  return <svg viewBox={`${left} ${top} ${width} ${height}`} aria-hidden="true" className="asset-preview">
    {faces.sort((a, b) => a.order - b.order).map((f, i) => <polygon key={i} points={f.points.map(p => p.join(',')).join(' ')} fill={f.fill} stroke="#889ba7" strokeWidth={Math.max(width, height) * .003} strokeLinejoin="round" />)}
  </svg>;
}
