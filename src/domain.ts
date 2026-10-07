export type Kind = 'shelf' | 'tv' | 'niche' | 'bench' | 'bar' | 'divider' | 'panel' | 'wardrobe' | 'headboard'
  | 'tv-low' | 'display' | 'corner-shelf' | 'wall-bridge' | 'wardrobe-column' | 'nightstand'
  | 'headboard-niches' | 'bed-base' | 'kitchen-base' | 'kitchen-upper' | 'island' | 'pantry'
  | 'vanity' | 'bath-column' | 'double-niche' | 'desk' | 'table' | 'coffee-table'
  | 'console' | 'floating-shelf' | 'countertop' | 'pillar' | 'plinth' | 'steps';
export interface Module {
  id: string; kind: Kind; name: string;
  width: number; height: number; depth: number; thickness: number; shelves: number;
  x: number; y: number; z: number; rotation: number; color: string;
}
export interface Project { version: 1; name: string; modules: Module[]; wastePercent: number }
export interface Panel { name: string; size: [number, number, number]; center: [number, number, number] }
export const finishes = [
  { color: '#e9e7e1', name: 'Blanco yeso' }, { color: '#cec9bc', name: 'Piedra' },
  { color: '#96a5a7', name: 'Salvia' }, { color: '#596775', name: 'Pizarra' },
];
type Geometry = 'shelf' | 'tv' | 'wardrobe' | 'solid' | 'bench' | 'bar' | 'table' | 'grid' | 'corner' | 'headboard-niches' | 'desk' | 'steps';
export interface CatalogItem {
  kind: Kind; name: string; category: string; description: string;
  size: [number, number, number]; shelves: number; geometry: Geometry;
  shelfLabel?: string; columns?: number; openBack?: boolean; elevation?: number;
}
export const catalog: CatalogItem[] = [
  { kind: 'shelf', name: 'Estantería', category: 'Salón', description: 'Baldas y laterales a medida', size: [100, 240, 38], shelves: 4, geometry: 'shelf', shelfLabel: 'Baldas interiores' },
  { kind: 'tv', name: 'Mueble TV', category: 'Salón', description: 'Hueco central y almacenaje', size: [260, 220, 42], shelves: 2, geometry: 'tv' },
  { kind: 'niche', name: 'Nicho', category: 'Salón', description: 'Hueco abierto con trasera', size: [80, 80, 28], shelves: 0, geometry: 'shelf', shelfLabel: 'Baldas interiores' },
  { kind: 'tv-low', name: 'Mueble TV bajo', category: 'Salón', description: 'Tres huecos para una composición horizontal', size: [180, 55, 42], shelves: 0, geometry: 'grid', columns: 3, shelfLabel: 'Baldas por hueco' },
  { kind: 'display', name: 'Librería de cubos', category: 'Salón', description: 'Dos columnas de huecos para libros y objetos', size: [120, 180, 38], shelves: 2, geometry: 'grid', columns: 2, shelfLabel: 'Baldas por hueco' },
  { kind: 'corner-shelf', name: 'Estantería en L', category: 'Salón', description: 'Dos alas abiertas para aprovechar una esquina', size: [100, 220, 100], shelves: 4, geometry: 'corner', shelfLabel: 'Baldas en L' },
  { kind: 'wall-bridge', name: 'Puente superior', category: 'Salón', description: 'Módulo elevado para unir columnas o enmarcar un TV', size: [220, 45, 35], shelves: 0, geometry: 'shelf', shelfLabel: 'Baldas interiores', elevation: 195 },
  { kind: 'coffee-table', name: 'Mesa de centro', category: 'Salón', description: 'Sobre y dos apoyos con el centro libre', size: [110, 42, 65], shelves: 0, geometry: 'table' },
  { kind: 'wardrobe', name: 'Armario abierto', category: 'Dormitorio', description: 'Dos cuerpos con estantes', size: [180, 240, 60], shelves: 3, geometry: 'wardrobe', shelfLabel: 'Baldas izquierdas' },
  { kind: 'headboard', name: 'Cabecero', category: 'Dormitorio', description: 'Volumen continuo para la cama', size: [220, 120, 18], shelves: 0, geometry: 'solid' },
  { kind: 'wardrobe-column', name: 'Columna de armario', category: 'Dormitorio', description: 'Cuerpo individual para ampliar un vestidor', size: [80, 240, 60], shelves: 4, geometry: 'shelf', shelfLabel: 'Baldas interiores' },
  { kind: 'nightstand', name: 'Mesita de noche', category: 'Dormitorio', description: 'Dos huecos abiertos junto a la cama', size: [55, 50, 40], shelves: 1, geometry: 'shelf', shelfLabel: 'Baldas interiores' },
  { kind: 'headboard-niches', name: 'Cabecero con nichos', category: 'Dormitorio', description: 'Base continua y tres huecos en la parte superior', size: [240, 120, 22], shelves: 0, geometry: 'headboard-niches', columns: 3 },
  { kind: 'bed-base', name: 'Base de cama', category: 'Dormitorio', description: 'Plataforma baja con tres cuerpos de apoyo', size: [160, 35, 200], shelves: 0, geometry: 'grid', columns: 3 },
  { kind: 'bar', name: 'Barra', category: 'Cocina', description: 'Frente y sobre de pladur', size: [180, 105, 60], shelves: 0, geometry: 'bar' },
  { kind: 'kitchen-base', name: 'Mueble bajo', category: 'Cocina', description: 'Dos cuerpos abiertos para combinar bajo una encimera', size: [90, 85, 60], shelves: 1, geometry: 'grid', columns: 2, shelfLabel: 'Baldas por hueco' },
  { kind: 'kitchen-upper', name: 'Mueble alto', category: 'Cocina', description: 'Almacenaje elevado con baldas regulables', size: [90, 70, 35], shelves: 1, geometry: 'shelf', shelfLabel: 'Baldas interiores', elevation: 145 },
  { kind: 'island', name: 'Isla', category: 'Cocina', description: 'Sobre amplio, frente cerrado y parte posterior abierta', size: [160, 95, 80], shelves: 0, geometry: 'bar' },
  { kind: 'pantry', name: 'Despensa', category: 'Cocina', description: 'Columna profunda de almacenaje', size: [70, 240, 60], shelves: 5, geometry: 'shelf', shelfLabel: 'Baldas interiores' },
  { kind: 'vanity', name: 'Mueble de lavabo', category: 'Baño', description: 'Dos cuerpos elevados; combina con una encimera', size: [120, 65, 50], shelves: 0, geometry: 'grid', columns: 2, shelfLabel: 'Baldas por hueco', elevation: 25 },
  { kind: 'bath-column', name: 'Columna de baño', category: 'Baño', description: 'Almacenaje estrecho para toallas y accesorios', size: [45, 190, 35], shelves: 4, geometry: 'shelf', shelfLabel: 'Baldas interiores' },
  { kind: 'double-niche', name: 'Nicho doble', category: 'Baño', description: 'Dos huecos unidos para una composición de pared', size: [110, 50, 22], shelves: 0, geometry: 'grid', columns: 2, shelfLabel: 'Baldas por hueco', elevation: 100 },
  { kind: 'desk', name: 'Escritorio con estantes', category: 'Trabajo', description: 'Cuerpo lateral con baldas y espacio libre para sentarse', size: [160, 75, 65], shelves: 2, geometry: 'desk', shelfLabel: 'Baldas del lateral' },
  { kind: 'table', name: 'Mesa de trabajo', category: 'Trabajo', description: 'Sobre amplio y dos laterales abiertos', size: [180, 75, 80], shelves: 0, geometry: 'table' },
  { kind: 'bench', name: 'Banco', category: 'Complementos', description: 'Asiento con huecos inferiores', size: [160, 48, 45], shelves: 0, geometry: 'bench' },
  { kind: 'divider', name: 'Separador', category: 'Complementos', description: 'Estantes abiertos por ambos lados', size: [120, 220, 30], shelves: 4, geometry: 'shelf', shelfLabel: 'Baldas interiores', openBack: true },
  { kind: 'panel', name: 'Panel libre', category: 'Complementos', description: 'Pieza para composiciones propias', size: [100, 100, 8], shelves: 0, geometry: 'solid' },
  { kind: 'console', name: 'Consola de entrada', category: 'Complementos', description: 'Sobre estrecho con hueco central abierto', size: [120, 85, 35], shelves: 0, geometry: 'table' },
  { kind: 'floating-shelf', name: 'Balda flotante', category: 'Complementos', description: 'Pieza horizontal elevada para añadir entre módulos', size: [120, 8, 30], shelves: 0, geometry: 'solid', elevation: 100 },
  { kind: 'countertop', name: 'Encimera', category: 'Complementos', description: 'Sobre independiente para barras y muebles bajos', size: [180, 8, 65], shelves: 0, geometry: 'solid', elevation: 85 },
  { kind: 'pillar', name: 'Pilar', category: 'Complementos', description: 'Volumen vertical para soportes y separaciones', size: [25, 240, 25], shelves: 0, geometry: 'solid' },
  { kind: 'plinth', name: 'Zócalo', category: 'Complementos', description: 'Base continua para elevar y unir una composición', size: [180, 12, 45], shelves: 0, geometry: 'solid' },
  { kind: 'steps', name: 'Expositor escalonado', category: 'Complementos', description: 'Tres volúmenes a distintas alturas para exposición', size: [120, 90, 35], shelves: 0, geometry: 'steps' },
];
export const categories = ['Todos', ...new Set(catalog.map(item => item.category))];
export const catalogItem = (kind: Kind) => catalog.find(item => item.kind === kind)!;
export const hasThicknessControl = (kind: Kind) => !['solid', 'steps'].includes(catalogItem(kind).geometry);
export const dimensionMinimum = (kind: Kind, axis: 'width' | 'height' | 'depth') => (kind === 'panel' && axis === 'depth') || (['floating-shelf', 'countertop'].includes(kind) && axis === 'height') ? 1 : 10;
export const format = (n: number, digits = 2) => n.toLocaleString('es-ES', { maximumFractionDigits: digits, minimumFractionDigits: digits });
export function createModule(kind: Kind, overrides: Partial<Module> = {}): Module {
  const item = catalogItem(kind);
  return normalizeModule({ id: crypto.randomUUID(), kind, name: item.name, width: item.size[0], height: item.size[1], depth: item.size[2], thickness: 8, shelves: item.shelves, x: 0, y: item.elevation ?? 0, z: 0, rotation: 0, color: finishes[0].color, ...overrides });
}
export function exampleProject(): Project {
  return { version: 1, name: 'Salón · composición a medida', wastePercent: 10, modules: [
    createModule('shelf', { x: -188, width: 100, name: 'Estantería izquierda' }),
    createModule('tv', { width: 260, name: 'Mueble central TV' }),
    createModule('shelf', { x: 188, width: 100, name: 'Estantería derecha' }),
  ] };
}
export const emptyProject = (): Project => ({ version: 1, name: 'Proyecto sin título', modules: [], wastePercent: 10 });

// Panels describe finished rectangular volumes, not commercial gypsum sheets.
export function getPanels(m: Module): Panel[] {
  const { width: w, height: h, depth: d, thickness: t } = m;
  const item = catalogItem(m.kind);
  const panels: Panel[] = [];
  const add = (name: string, size: Panel['size'], center: Panel['center']) => panels.push({ name, size, center });
  if (item.geometry === 'solid') {
    add(m.kind === 'headboard' ? 'Cuerpo del cabecero' : m.kind === 'panel' ? 'Panel' : item.name, [w, h, d], [0, h / 2, 0]);
    return panels;
  }
  if (item.geometry === 'steps') {
    for (let i = 0; i < 3; i++) {
      const level = h * (i + 1) / 3;
      add(`Escalón ${i + 1}`, [w / 3, level, d], [-w / 2 + w / 6 + i * w / 3, level / 2, 0]);
    }
    return panels;
  }
  if (['bench', 'bar', 'table'].includes(item.geometry)) {
    add('Sobre', [w, t, d], [0, h - t / 2, 0]);
    const panelDepth = item.geometry === 'bar' ? d - t : d;
    const offsetZ = item.geometry === 'bar' ? t / 2 : 0;
    add('Lateral izquierdo', [t, h - t, panelDepth], [-w / 2 + t / 2, (h - t) / 2, offsetZ]);
    add('Lateral derecho', [t, h - t, panelDepth], [w / 2 - t / 2, (h - t) / 2, offsetZ]);
    if (item.geometry === 'bar') add('Frente', [w, h - t, t], [0, (h - t) / 2, -d / 2 + t / 2]);
    if (item.geometry === 'bench') add('Apoyo central', [t, h - t, d], [0, (h - t) / 2, 0]);
    return panels;
  }
  if (item.geometry === 'desk') {
    const cabinetWidth = w * .32;
    const innerWidth = cabinetWidth - 2 * t;
    const centerX = -w / 2 + cabinetWidth / 2;
    add('Sobre del escritorio', [w, t, d], [0, h - t / 2, 0]);
    add('Apoyo derecho', [t, h - t, d], [w / 2 - t / 2, (h - t) / 2, 0]);
    add('Lateral exterior del cuerpo', [t, h - t, d], [-w / 2 + t / 2, (h - t) / 2, 0]);
    add('Lateral interior del cuerpo', [t, h - t, d], [-w / 2 + cabinetWidth - t / 2, (h - t) / 2, 0]);
    add('Base del cuerpo', [innerWidth, t, d], [centerX, t / 2, 0]);
    add('Trasera del cuerpo', [innerWidth, h - 2 * t, t], [centerX, h / 2, -d / 2 + t / 2]);
    for (let i = 0; i < m.shelves; i++) add(`Balda lateral ${i + 1}`, [innerWidth, t, d - t], [centerX, t + (h - 2 * t) * (i + 1) / (m.shelves + 1), t / 2]);
    return panels;
  }
  if (item.geometry === 'corner') {
    const armWidth = w * .38, armDepth = d * .38;
    add('Lateral exterior izquierdo', [t, h, d], [-w / 2 + t / 2, h / 2, 0]);
    add('Trasera exterior', [w - t, h, t], [t / 2, h / 2, -d / 2 + t / 2]);
    add('Cierre del ala derecha', [t, h, armDepth - t], [w / 2 - t / 2, h / 2, -d / 2 + t + (armDepth - t) / 2]);
    add('Cierre del ala izquierda', [armWidth - t, h, t], [-w / 2 + t + (armWidth - t) / 2, h / 2, d / 2 - t / 2]);
    const level = (name: string, y: number) => {
      add(`${name} · ala derecha`, [w - 2 * t, t, armDepth - t], [0, y, -d / 2 + t + (armDepth - t) / 2]);
      add(`${name} · ala izquierda`, [armWidth - t, t, d - armDepth - t], [-w / 2 + t + (armWidth - t) / 2, y, -d / 2 + armDepth + (d - armDepth - t) / 2]);
    };
    level('Base', t / 2); level('Techo', h - t / 2);
    for (let i = 0; i < m.shelves; i++) level(`Balda ${i + 1}`, t + (h - 2 * t) * (i + 1) / (m.shelves + 1));
    return panels;
  }
  if (item.geometry === 'headboard-niches') {
    const bodyHeight = h * .6, upperHeight = h - bodyHeight, columns = item.columns ?? 3;
    const cellWidth = (w - (columns + 1) * t) / columns;
    add('Base continua del cabecero', [w, bodyHeight, d], [0, bodyHeight / 2, 0]);
    add('Lateral izquierdo superior', [t, upperHeight, d], [-w / 2 + t / 2, bodyHeight + upperHeight / 2, 0]);
    add('Lateral derecho superior', [t, upperHeight, d], [w / 2 - t / 2, bodyHeight + upperHeight / 2, 0]);
    add('Techo de los nichos', [w - 2 * t, t, d], [0, h - t / 2, 0]);
    add('Trasera de los nichos', [w - 2 * t, upperHeight - t, t], [0, bodyHeight + (upperHeight - t) / 2, -d / 2 + t / 2]);
    for (let i = 0; i < columns - 1; i++) add(`Separación de nichos ${i + 1}`, [t, upperHeight - t, d - t], [-w / 2 + t + cellWidth + t / 2 + i * (cellWidth + t), bodyHeight + (upperHeight - t) / 2, t / 2]);
    return panels;
  }
  add('Lateral izquierdo', [t, h, d], [-w / 2 + t / 2, h / 2, 0]);
  add('Lateral derecho', [t, h, d], [w / 2 - t / 2, h / 2, 0]);
  add('Base', [w - 2 * t, t, d], [0, t / 2, 0]);
  add('Techo', [w - 2 * t, t, d], [0, h - t / 2, 0]);
  const hasBack = !item.openBack;
  if (hasBack) add('Trasera', [w - 2 * t, h - 2 * t, t], [0, h / 2, -d / 2 + t / 2]);
  const shelfDepth = hasBack ? d - t : d;
  const shelfZ = hasBack ? t / 2 : 0;
  if (item.geometry === 'tv') {
    const lower = h * 0.25, upper = h * 0.83;
    add('Balda inferior TV', [w - 2 * t, t, shelfDepth], [0, lower, shelfZ]);
    add('Balda superior TV', [w - 2 * t, t, shelfDepth], [0, upper, shelfZ]);
    const lowerHeight = lower - t * 1.5;
    const offset = Math.min(w / 6, (w - 3 * t) / 2);
    const partitions = w > 4 * t + 1 ? [-offset, offset] : w > 3 * t + 1 ? [0] : [];
    partitions.forEach((x, i) => add(`División inferior ${i + 1}`, [t, lowerHeight, shelfDepth], [x, t + lowerHeight / 2, shelfZ]));
  } else if (item.geometry === 'wardrobe') {
    add('División central', [t, h - 2 * t, shelfDepth], [0, h / 2, shelfZ]);
    const half = (w - 3 * t) / 2;
    for (let i = 0; i < m.shelves; i++) {
      const y = t + (h - 2 * t) * (i + 1) / (m.shelves + 1);
      add(`Balda izquierda ${i + 1}`, [half, t, shelfDepth], [-(w - t) / 4, y, shelfZ]);
    }
    add('Altillo derecho', [half, t, shelfDepth], [(w - t) / 4, h * 0.8, shelfZ]);
  } else if (item.geometry === 'grid') {
    const columns = item.columns ?? 2, cellWidth = (w - (columns + 1) * t) / columns;
    for (let col = 0; col < columns - 1; col++) add(`Separación vertical ${col + 1}`, [t, h - 2 * t, shelfDepth], [-w / 2 + t + cellWidth + t / 2 + col * (cellWidth + t), h / 2, shelfZ]);
    for (let col = 0; col < columns; col++) for (let row = 0; row < m.shelves; row++) {
      add(`Balda ${row + 1} · cuerpo ${col + 1}`, [cellWidth, t, shelfDepth], [-w / 2 + t + cellWidth / 2 + col * (cellWidth + t), t + (h - 2 * t) * (row + 1) / (m.shelves + 1), shelfZ]);
    }
  } else {
    for (let i = 0; i < m.shelves; i++) {
      add(`Balda ${i + 1}`, [w - 2 * t, t, shelfDepth], [0, t + (h - 2 * t) * (i + 1) / (m.shelves + 1), shelfZ]);
    }
  }
  return panels;
}
export function panelArea(p: Panel): number { const [a, b, c] = p.size; return 2 * (a * b + a * c + b * c) / 10000; }
export const moduleArea = (m: Module): number => getPanels(m).reduce((sum, p) => sum + panelArea(p), 0);
export function estimate(p: Project) {
  const area = p.modules.reduce((sum, m) => sum + moduleArea(m), 0);
  return { area, withWaste: area * (1 + p.wastePercent / 100), panels: p.modules.reduce((sum, m) => sum + getPanels(m).length, 0) };
}
export function thicknessLimit(m: Pick<Module, 'width' | 'height' | 'depth' | 'kind' | 'shelves'>): number {
  const item = catalogItem(m.kind);
  const shelfCount = item.shelfLabel || item.geometry === 'grid' ? m.shelves : 0;
  const featureLimit = item.geometry === 'tv' || item.geometry === 'headboard-niches' ? m.height / 10
    : item.geometry === 'wardrobe' ? m.height / 8
    : item.geometry === 'desk' ? Math.min(m.width, m.height) / 10
    : item.geometry === 'corner' ? Math.min(m.width, m.depth) / 10 : 30;
  const columnLimit = item.columns ? (m.width - 1) / (item.columns + 2) : 30;
  return Math.max(1, Math.min(30, (Math.min(m.width, m.height, m.depth) - 1) / 3, (m.height - shelfCount - 1) / (shelfCount + 3), featureLimit, columnLimit));
}
export const shelfLimit = (height: number) => Math.max(0, Math.min(12, Math.floor((height - 4) / 2)));
export function normalizeModule(m: Module): Module {
  const result = { ...m };
  for (const key of ['width', 'height', 'depth'] as const) result[key] = Math.max(dimensionMinimum(m.kind, key), Math.min(1000, result[key]));
  result.shelves = Math.round(Math.max(0, Math.min(shelfLimit(result.height), result.shelves)));
  result.thickness = Math.max(1, Math.min(result.thickness, thicknessLimit(result)));
  for (const key of ['x', 'y', 'z'] as const) result[key] = Math.max(key === 'y' ? 0 : -2000, Math.min(2000, result[key]));
  result.rotation = ((result.rotation % 360) + 360) % 360;
  return result;
}
export function bounds(modules: Module[]) {
  if (!modules.length) return { minX: -150, maxX: 150, minZ: -50, maxZ: 50, maxY: 240, minY: 0, width: 300, height: 240, depth: 100 };
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity, maxY = 0, minY = Infinity;
  modules.forEach(m => {
    const r = m.rotation * Math.PI / 180;
    const hx = (Math.abs(Math.cos(r)) * m.width + Math.abs(Math.sin(r)) * m.depth) / 2;
    const hz = (Math.abs(Math.sin(r)) * m.width + Math.abs(Math.cos(r)) * m.depth) / 2;
    minX = Math.min(minX, m.x - hx); maxX = Math.max(maxX, m.x + hx);
    minZ = Math.min(minZ, m.z - hz); maxZ = Math.max(maxZ, m.z + hz);
    maxY = Math.max(maxY, m.y + m.height); minY = Math.min(minY, m.y);
  });
  return { minX, maxX, minZ, maxZ, maxY, minY, width: maxX - minX, height: maxY - minY, depth: maxZ - minZ };
}
export function parseProject(input: unknown): Project {
  if (!input || typeof input !== 'object') throw new Error('El archivo no contiene un proyecto.');
  const p = input as Record<string, unknown>;
  if (p.version !== 1) throw new Error('Versión de proyecto no compatible.');
  if (typeof p.name !== 'string' || !p.name.trim() || p.name.length > 100) throw new Error('El nombre del proyecto no es válido.');
  if (typeof p.wastePercent !== 'number' || !Number.isFinite(p.wastePercent) || p.wastePercent < 0 || p.wastePercent > 50) throw new Error('La merma debe estar entre 0 y 50 %.');
  if (!Array.isArray(p.modules) || p.modules.length > 200) throw new Error('El proyecto admite hasta 200 módulos.');
  const ids = new Set<string>();
  const modules = p.modules.map((value: unknown) => {
    if (!value || typeof value !== 'object') throw new Error('Hay un módulo inválido.');
    const m = value as Module;
    if (typeof m.id !== 'string' || !m.id || m.id.length > 100 || ids.has(m.id)) throw new Error('Los identificadores de módulos deben ser únicos.');
    ids.add(m.id);
    if (!catalog.some(c => c.kind === m.kind)) throw new Error('Tipo de módulo desconocido.');
    if (typeof m.name !== 'string' || !m.name.trim() || m.name.length > 80) throw new Error('Nombre de módulo inválido.');
    if (!finishes.some(f => f.color === m.color)) throw new Error('Acabado no compatible.');
    for (const key of ['width', 'height', 'depth', 'thickness', 'shelves', 'x', 'y', 'z', 'rotation'] as const) {
      if (typeof m[key] !== 'number' || !Number.isFinite(m[key])) throw new Error('Todas las medidas deben ser números finitos.');
    }
    const normalized = normalizeModule(m);
    if ((['width', 'height', 'depth', 'thickness', 'shelves', 'x', 'y', 'z', 'rotation'] as const).some(k => Math.abs(m[k] - normalized[k]) > 1e-6)) throw new Error('Hay medidas fuera de los límites permitidos.');
    return { id: m.id, kind: m.kind, name: m.name, width: m.width, height: m.height, depth: m.depth, thickness: m.thickness, shelves: m.shelves, x: m.x, y: m.y, z: m.z, rotation: m.rotation, color: m.color };
  });
  return { version: 1, name: p.name.trim(), wastePercent: p.wastePercent, modules };
}
export function projectCSV(project: Project): string {
  const cell = (text: string) => `"${(/^[\s]*[=+@-]/.test(text) ? "'" : '') + text.replaceAll('"', '""')}"`;
  const rows = ['Módulo;Pieza;Ancho (cm);Alto (cm);Fondo (cm);Superficie bruta (m²)'];
  for (const m of project.modules) for (const p of getPanels(m)) rows.push([cell(m.name), cell(p.name), ...p.size.map(v => format(v)), format(panelArea(p), 4)].join(';'));
  rows.push(['TOTAL', '', '', '', '', format(estimate(project).area, 4)].join(';'));
  return '\uFEFF' + rows.join('\r\n');
}
