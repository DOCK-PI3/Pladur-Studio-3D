import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bounds, catalog, categories, createModule, emptyProject, estimate, getPanels, normalizeModule, panelArea, parseProject, projectCSV, type Kind, type Project } from '../src/domain.ts';

test('cm² se convierten en m² para las seis caras del volumen', () => {
  assert.equal(panelArea({ name: 'panel', size: [100, 200, 10], center: [0, 0, 0] }), 4.6);
});
test('todos los assets generan paneles positivos incluso en dimensiones límite', () => {
  for (const item of catalog) for (const size of [10, 100, 1000]) for (const shelves of [0, 4, 12]) {
    const m = normalizeModule(createModule(item.kind, { width: size, height: size, depth: size, thickness: 30, shelves }));
    const panels = getPanels(m);
    assert.ok(panels.length > 0);
    for (const p of panels) for (const n of p.size) assert.ok(n > 0 && Number.isFinite(n), `${item.kind}: ${p.name}`);
    assert.doesNotThrow(() => parseProject({ ...emptyProject(), modules: [m] }));
  }
});
test('paneles internos no solapan volúmenes dentro del módulo', () => {
  for (const item of catalog) {
    const sizes = [[10, 10, 10], [100, 100, 100], [1000, 1000, 1000], [10, 1000, 10], [1000, 10, 1000], [10, 10, 1000], [1000, 1000, 10]];
    for (const [width, height, depth] of sizes) for (const count of [0, 4, 12]) {
      const panels = getPanels(createModule(item.kind, { width, height, depth, thickness: 30, shelves: count }));
      for (let i = 0; i < panels.length; i++) for (let j = i + 1; j < panels.length; j++) {
        const a = panels[i], b = panels[j];
        const overlaps = [0, 1, 2].every(axis => Math.abs(a.center[axis] - b.center[axis]) < (a.size[axis] + b.size[axis]) / 2 - 1e-6);
        assert.equal(overlaps, false, `${item.kind} ${width}/${height}/${depth}: ${a.name} / ${b.name}`);
      }
    }
  }
});
test('catálogo de 33 módulos con ids únicos, seis categorías y geometría dentro de sus medidas', () => {
  assert.equal(catalog.length, 33);
  assert.equal(new Set(catalog.map(c => c.kind)).size, catalog.length);
  assert.equal(categories.length, 7);
  for (const c of catalog) {
    const m = createModule(c.kind);
    assert.equal(m.width, c.size[0]); assert.equal(m.height, c.size[1]); assert.equal(m.depth, c.size[2]);
    assert.equal(m.y, c.elevation ?? 0);
    for (const p of getPanels(m)) {
      assert.ok(p.center[0] - p.size[0] / 2 >= -m.width / 2 - 1e-8, c.kind);
      assert.ok(p.center[0] + p.size[0] / 2 <= m.width / 2 + 1e-8, c.kind);
      assert.ok(p.center[1] - p.size[1] / 2 >= -1e-8, c.kind);
      assert.ok(p.center[1] + p.size[1] / 2 <= m.height + 1e-8, c.kind);
      assert.ok(p.center[2] - p.size[2] / 2 >= -m.depth / 2 - 1e-8, c.kind);
      assert.ok(p.center[2] + p.size[2] / 2 <= m.depth / 2 + 1e-8, c.kind);
    }
  }
});
test('los proyectos del catálogo original conservan su formato y los tipos de módulo', () => {
  const legacyKinds: Kind[] = ['shelf', 'tv', 'niche', 'bench', 'bar', 'divider', 'panel', 'wardrobe', 'headboard'];
  const legacy: Project = { version: 1, name: 'Proyecto v0.1', wastePercent: 10, modules: legacyKinds.map((kind, i) => ({
    id: `original-${i}`, kind, name: `Módulo original ${i}`, width: 200, height: 200, depth: 40,
    thickness: 8, shelves: kind === 'shelf' || kind === 'wardrobe' || kind === 'divider' ? 3 : 0,
    x: i * 100, y: 0, z: 0, rotation: 90, color: '#e9e7e1',
  })) };
  assert.deepEqual(parseProject(JSON.parse(JSON.stringify(legacy))), legacy);
  const all = { ...emptyProject(), modules: catalog.map(c => createModule(c.kind)) };
  assert.deepEqual(parseProject(JSON.parse(JSON.stringify(all))), all);
});
test('merma y estimación vacía son reproducibles', () => {
  const p = emptyProject(); assert.equal(estimate(p).area, 0);
  p.modules.push(createModule('panel', { width: 100, height: 200, depth: 10 }));
  assert.ok(Math.abs(estimate(p).withWaste - 5.06) < 1e-9);
});
test('envolvente contempla giro, elevación y traslación', () => {
  const b = bounds([createModule('panel', { width: 100, height: 200, depth: 10, rotation: 90, x: 80, y: 50 })]);
  assert.ok(Math.abs(b.width - 10) < 1e-9); assert.equal(b.height, 200); assert.equal(b.maxY, 250); assert.ok(Math.abs(b.depth - 100) < 1e-9);
});
test('JSON válido conserva datos y rechaza ids duplicados, NaN, espesores y versiones incompatibles', () => {
  for (const item of catalog) assert.doesNotThrow(() => parseProject({ ...emptyProject(), modules: [createModule(item.kind)] }));
  const p = { ...emptyProject(), modules: [createModule('wardrobe')] };
  assert.deepEqual(parseProject(JSON.parse(JSON.stringify(p))), p);
  assert.throws(() => parseProject({ ...p, version: 2 }));
  assert.throws(() => parseProject({ ...p, modules: [p.modules[0], p.modules[0]] }));
  assert.throws(() => parseProject({ ...p, modules: [{ ...p.modules[0], width: NaN }] }));
  assert.throws(() => parseProject({ ...p, modules: [{ ...p.modules[0], thickness: 999 }] }));
  assert.throws(() => parseProject({ ...p, modules: [{ ...p.modules[0], shelves: 1.5 }] }));
  assert.throws(() => parseProject({ ...p, modules: [{ ...p.modules[0], color: 'javascript:bad' }] }));
  assert.throws(() => parseProject({ ...p, wastePercent: Infinity }));
  assert.throws(() => parseProject({ ...p, modules: Array.from({ length: 201 }, () => createModule('panel')) }));
});
test('CSV escapa nombres e incluye unidades y valores decimales españoles', () => {
  const p = { ...emptyProject(), modules: [createModule('panel', { name: 'Panel "a"; prueba', width: 100, height: 200, depth: 10 })] };
  const csv = projectCSV(p);
  assert.ok(csv.includes('"Panel ""a""; prueba"'));
  assert.ok(csv.includes('4,6000')); assert.ok(csv.includes('Superficie bruta (m²)'));
  p.modules[0].name = '=1+2'; assert.ok(projectCSV(p).includes('"\'=1+2"'));
});
