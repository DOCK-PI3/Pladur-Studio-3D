import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { bounds, catalogItem, format, getPanels, type Module } from './domain';

export type View = 'perspective' | 'front' | 'top';
export interface SceneHandle { capture: () => string | undefined }
interface Props { modules: Module[]; selectedId: string | null; onSelect: (id: string | null) => void; grid: boolean; dimensions: boolean; decoration: boolean; view: View; frame: number }
interface Runtime { renderer: THREE.WebGLRenderer; scene: THREE.Scene; content: THREE.Group; measurements: THREE.Group; grid: THREE.GridHelper; perspective: THREE.PerspectiveCamera; ortho: THREE.OrthographicCamera; camera: THREE.Camera; controls: OrbitControls; width: number; height: number }

function disposeGroup(group: THREE.Group) {
  group.traverse(object => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    if (mesh.material) for (const material of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
      (material as THREE.MeshBasicMaterial).map?.dispose(); material.dispose();
    }
  });
  group.clear();
}
function box(group: THREE.Group, size: number[], center: number[], color: string, edges = false) {
  const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness: .86 }));
  mesh.position.set(center[0], center[1], center[2]); mesh.castShadow = true; mesh.receiveShadow = true;
  group.add(mesh);
  if (edges) {
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: '#8d979b', transparent: true, opacity: .2 }));
    edge.position.copy(mesh.position); group.add(edge);
  }
  return mesh;
}
function addDecor(group: THREE.Group, m: Module) {
  if (m.kind === 'tv') {
    const width = Math.min(145, m.width * .65), height = Math.min(82, m.height * .36), y = m.height * .54, z = m.depth / 2 - 5;
    box(group, [width, height, 2.5], [0, y, z], '#283139');
    const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 288;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 288); gradient.addColorStop(0, '#597580'); gradient.addColorStop(.55, '#a6bec0'); gradient.addColorStop(1, '#334a51');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 512, 288);
    ctx.fillStyle = '#d9dac9'; ctx.beginPath(); ctx.arc(365, 72, 26, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#637f80'; ctx.beginPath(); ctx.moveTo(0, 174); ctx.lineTo(125, 122); ctx.lineTo(240, 178); ctx.lineTo(410, 141); ctx.lineTo(512, 169); ctx.lineTo(512, 288); ctx.lineTo(0, 288); ctx.fill();
    ctx.fillStyle = '#3e6068'; ctx.beginPath(); ctx.moveTo(0, 224); ctx.lineTo(210, 167); ctx.lineTo(390, 216); ctx.lineTo(512, 188); ctx.lineTo(512, 288); ctx.lineTo(0, 288); ctx.fill();
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(width - 3, height - 3), new THREE.MeshBasicMaterial({ map: texture }));
    screen.position.set(0, y, z + 1.8); group.add(screen);
    [-width * .31, width * .31].forEach(x => box(group, [7, 2, 12], [x, y - height / 2 - 1, z], '#323c42'));
  }
  if (['shelf', 'wardrobe', 'grid', 'desk', 'corner'].includes(catalogItem(m.kind).geometry)) {
    const shelves = getPanels(m).filter(p => p.name.startsWith('Balda') || p.name.startsWith('Base'));
    const colors = ['#657d87', '#beae92', '#e6ddd0', '#81928b', '#6d7275'];
    shelves.forEach((p, row) => {
      const available = Math.min(28, (p.size[0] - 4) * .5);
      if (available < 8) return;
      for (let i = 0; i < 4; i++) {
        const height = Math.min(22 + (i % 3) * 3, m.height / (m.shelves + 2) * .52);
        const depth = Math.min(16, p.size[2] * .7);
        box(group, [available / 5, height, depth], [p.center[0] - p.size[0] / 2 + 9 + i * available / 4, p.center[1] + p.size[1] / 2 + height / 2, p.center[2] + p.size[2] / 2 - depth / 2 - 2], colors[(i + row) % colors.length]);
      }
    });
  }
}
function dimension(group: THREE.Group, from: THREE.Vector3, to: THREE.Vector3, label: string) {
  const material = new THREE.LineBasicMaterial({ color: '#3983a6', depthTest: false, transparent: true, opacity: .9 });
  const points = [from, to];
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material); line.renderOrder = 10; group.add(line);
  const dir = to.clone().sub(from).normalize();
  const cross = Math.abs(dir.y) > .5 ? new THREE.Vector3(6, 0, 0) : new THREE.Vector3(0, 6, 0);
  [from, to].forEach(p => group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p.clone().sub(cross), p.clone().add(cross)]), material.clone())));
  const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.roundRect(4, 4, 248, 56, 12); ctx.fill();
  ctx.font = '500 28px Segoe UI'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#27698b'; ctx.fillText(label, 128, 33);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false, toneMapped: false }));
  sprite.position.copy(from.clone().add(to).multiplyScalar(.5)); sprite.scale.set(64, 16, 1); sprite.renderOrder = 11; group.add(sprite);
}

const Scene = forwardRef<SceneHandle, Props>(function Scene(props, ref) {
  const host = useRef<HTMLDivElement>(null), runtime = useRef<Runtime | null>(null), current = useRef(props);
  const [error, setError] = useState(false), [ready, setReady] = useState(0);
  current.current = props;
  useImperativeHandle(ref, () => ({ capture: () => {
    const r = runtime.current; if (!r) return;
    r.renderer.render(r.scene, r.camera); return r.renderer.domElement.toDataURL('image/png');
  } }), []);
  useEffect(() => {
    const element = host.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); } catch { setError(true); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute('aria-label', 'Vista 3D del proyecto. Selecciona los módulos también desde la lista de elementos.');
    element.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#e7ecef');
    scene.add(new THREE.HemisphereLight('#ffffff', '#8995a0', 2.3));
    const sun = new THREE.DirectionalLight('#fff8ef', 3.2); sun.position.set(-280, 650, 450); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -700; sun.shadow.camera.right = 700; sun.shadow.camera.top = 600; sun.shadow.camera.bottom = -500; sun.shadow.camera.far = 1800; sun.shadow.bias = -.0003; sun.shadow.normalBias = .8; scene.add(sun);
    const fill = new THREE.DirectionalLight('#d4e8ff', 1); fill.position.set(350, 220, -100); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20000, 20000), new THREE.MeshStandardMaterial({ color: '#e3e8eb', roughness: 1 }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -1; floor.receiveShadow = true; scene.add(floor);
    const grid = new THREE.GridHelper(4000, 160, '#bac7ce', '#c9d2d8'); grid.position.y = -.5;
    const gridMaterial = grid.material as THREE.LineBasicMaterial; gridMaterial.transparent = true; gridMaterial.opacity = .4; scene.add(grid);
    const content = new THREE.Group(), measurements = new THREE.Group(); scene.add(content, measurements);
    const perspective = new THREE.PerspectiveCamera(38, 1, 1, 30000);
    const ortho = new THREE.OrthographicCamera(-400, 400, 300, -300, 1, 30000);
    perspective.position.set(650, 380, 700);
    const controls = new OrbitControls(perspective, renderer.domElement); controls.enableDamping = true; controls.dampingFactor = .09; controls.target.set(0, 110, 0); controls.maxPolarAngle = Math.PI / 2 - .015; controls.minDistance = 20; controls.maxDistance = 12000; controls.update();
    const r: Runtime = { renderer, scene, content, measurements, grid, perspective, ortho, camera: perspective, controls, width: 1, height: 1 }; runtime.current = r;
    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect; if (!width || !height) return;
      r.width = width; r.height = height; renderer.setSize(width, height); perspective.aspect = width / height; perspective.updateProjectionMatrix();
      const vertical = (ortho.top - ortho.bottom) / 2; ortho.left = -vertical * width / height; ortho.right = vertical * width / height; ortho.updateProjectionMatrix();
    }); observer.observe(element);
    const raycaster = new THREE.Raycaster(); let down = [0, 0];
    const pointerDown = (event: PointerEvent) => { down = [event.clientX, event.clientY]; };
    const pointerUp = (event: PointerEvent) => {
      if (event.button !== 0 || Math.hypot(event.clientX - down[0], event.clientY - down[1]) > 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1), r.camera);
      const hits = raycaster.intersectObjects(content.children, true).filter(hit => hit.object instanceof THREE.Mesh);
      let object: THREE.Object3D | null = hits[0]?.object ?? null;
      while (object && !object.userData.moduleId) object = object.parent;
      current.current.onSelect(object?.userData.moduleId ?? null);
    };
    renderer.domElement.addEventListener('pointerdown', pointerDown); renderer.domElement.addEventListener('pointerup', pointerUp);
    renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, r.camera); }); setReady(v => v + 1);
    return () => {
      observer.disconnect(); renderer.setAnimationLoop(null); controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', pointerDown); renderer.domElement.removeEventListener('pointerup', pointerUp);
      disposeGroup(content); disposeGroup(measurements); floor.geometry.dispose(); (floor.material as THREE.Material).dispose(); grid.geometry.dispose(); (grid.material as THREE.Material).dispose();
      renderer.dispose(); renderer.domElement.remove(); runtime.current = null;
    };
  }, []);
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    disposeGroup(r.content);
    for (const m of props.modules) {
      const group = new THREE.Group(); group.userData.moduleId = m.id; group.position.set(m.x, m.y, m.z); group.rotation.y = m.rotation * Math.PI / 180;
      for (const panel of getPanels(m)) box(group, panel.size, panel.center, m.color, true);
      if (props.decoration) addDecor(group, m);
      r.content.add(group);
      if (m.id === props.selectedId) {
        const helper = new THREE.BoxHelper(group, '#287caa'); (helper.material as THREE.LineBasicMaterial).transparent = true; (helper.material as THREE.LineBasicMaterial).opacity = .8; r.content.add(helper);
      }
    }
  }, [props.modules, props.selectedId, props.decoration, ready]);
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    r.grid.visible = props.grid; disposeGroup(r.measurements);
    if (!props.dimensions || !props.modules.length) return;
    const b = bounds(props.modules), z = b.maxZ + 38;
    dimension(r.measurements, new THREE.Vector3(b.minX, 4, z), new THREE.Vector3(b.maxX, 4, z), `${format(b.width, 0)} cm`);
    dimension(r.measurements, new THREE.Vector3(b.maxX + 30, b.minY, z), new THREE.Vector3(b.maxX + 30, b.maxY, z), `${format(b.height, 0)} cm`);
    dimension(r.measurements, new THREE.Vector3(b.minX - 30, 4, b.minZ), new THREE.Vector3(b.minX - 30, 4, b.maxZ), `${format(b.depth, 0)} cm`);
  }, [props.modules, props.grid, props.dimensions, ready]);
  useEffect(() => {
    const r = runtime.current; if (!r) return;
    const b = bounds(current.current.modules), target = new THREE.Vector3((b.minX + b.maxX) / 2, (b.maxY + b.minY) / 2, (b.minZ + b.maxZ) / 2);
    const span = Math.max(b.width, b.height, b.depth, 100), aspect = r.width / r.height;
    const distance = span * 1.55 / Math.min(aspect, 1);
    if (props.view === 'perspective') {
      r.camera = r.perspective; r.perspective.position.copy(target).add(new THREE.Vector3(distance * .55, distance * .34, distance));
    } else {
      r.camera = r.ortho;
      const vertical = Math.max(props.view === 'front' ? b.height : b.depth, b.width / aspect, 100) * .72;
      r.ortho.left = -vertical * aspect; r.ortho.right = vertical * aspect; r.ortho.top = vertical; r.ortho.bottom = -vertical; r.ortho.zoom = 1;
      r.ortho.up.set(0, props.view === 'top' ? 0 : 1, props.view === 'top' ? -1 : 0);
      r.ortho.position.copy(target).add(props.view === 'front' ? new THREE.Vector3(0, 0, distance) : new THREE.Vector3(0, distance, .001)); r.ortho.updateProjectionMatrix();
    }
    r.controls.object = r.camera; r.controls.target.copy(target); r.controls.enableRotate = props.view === 'perspective';
    r.controls.mouseButtons.LEFT = props.view === 'perspective' ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN;
    r.controls.touches.ONE = props.view === 'perspective' ? THREE.TOUCH.ROTATE : THREE.TOUCH.PAN;
    r.controls.maxPolarAngle = props.view === 'perspective' ? Math.PI / 2 - .015 : Math.PI;
    r.controls.update();
  }, [props.view, props.frame, ready]);
  return <div className="scene" ref={host}>{error && <div className="webgl-error"><strong>La vista 3D necesita WebGL</strong><p>Activa la aceleración gráfica del navegador. Puedes seguir editando las medidas y exportar el proyecto.</p></div>}</div>;
});
export default Scene;
