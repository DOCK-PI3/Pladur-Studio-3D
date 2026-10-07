import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Box, Plus, Search, ChevronDown, Undo2, Redo2, Download, FolderOpen, Check, Copy, Trash2, Ruler, Grid2X2, Maximize, Camera, Layers, X, Info, RotateCcw, Square, Move, Armchair, FileJson, FileSpreadsheet, Image, BookOpen, ArrowUpRight, MousePointer2 } from 'lucide-react';
import Scene, { type SceneHandle, type View } from './Scene';
import Thumbnail from './Thumbnail';
import { bounds, catalog, catalogItem, categories, createModule, dimensionMinimum, emptyProject, estimate, exampleProject, finishes, format, hasThicknessControl, moduleArea, normalizeModule, parseProject, projectCSV, shelfLimit, thicknessLimit, type Kind, type Module, type Project } from './domain';

const STORAGE_KEY = 'pladur-studio.project.v1';
function initialProject() {
  try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) return parseProject(JSON.parse(saved)); } catch { /* Restore errors are shown after mount. */ }
  return exampleProject();
}
function download(data: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function NumberField({ label, value, unit = 'cm', min, max, step = 1, onChange }: { label: string; value: number; unit?: string; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState(String(Math.round(value * 100) / 100));
  useEffect(() => setDraft(String(Math.round(value * 100) / 100)), [value]);
  const commit = () => {
    const n = Number(draft.replace(',', '.'));
    if (draft.trim() && Number.isFinite(n)) { const next = Math.min(max, Math.max(min, n)); onChange(next); setDraft(String(Math.round(next * 100) / 100)); }
    else setDraft(String(Math.round(value * 100) / 100));
  };
  return <label className="number-field"><span>{label}</span><div><input type="text" inputMode="decimal" aria-label={label} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); const n = Number(draft.replace(',', '.')); const next = Math.min(max, Math.max(min, (Number.isFinite(n) ? n : value) + (e.key === 'ArrowUp' ? step : -step))); onChange(next); setDraft(String(next)); } }} /><small>{unit}</small></div></label>;
}
function IconButton({ title, children, onClick, disabled, active }: { title: string; children: ReactNode; onClick: () => void; disabled?: boolean; active?: boolean }) {
  return <button type="button" className={`icon-button ${active ? 'active' : ''}`} title={title} aria-label={title} aria-pressed={active} disabled={disabled} onClick={onClick}>{children}</button>;
}

export default function App() {
  const [project, setProject] = useState<Project>(initialProject);
  const [selectedId, setSelectedId] = useState<string | null>(project.modules.find(m => m.kind === 'tv')?.id ?? project.modules[0]?.id ?? null);
  const [past, setPast] = useState<Project[]>([]), [future, setFuture] = useState<Project[]>([]);
  const [view, setView] = useState<View>('perspective'), [frame, setFrame] = useState(0);
  const [grid, setGrid] = useState(true), [dimensions, setDimensions] = useState(true), [decoration, setDecoration] = useState(true);
  const [category, setCategory] = useState('Todos'), [search, setSearch] = useState('');
  const [tab, setTab] = useState<'properties' | 'measurements'>('properties');
  const [mobilePanel, setMobilePanel] = useState<'catalog' | 'scene' | 'inspector'>('scene');
  const [notice, setNotice] = useState(''), [saveState, setSaveState] = useState<'saved' | 'error'>('saved');
  const [dialog, setDialog] = useState<'export' | 'help' | 'new' | 'example' | null>(null);
  const input = useRef<HTMLInputElement>(null), scene = useRef<SceneHandle>(null);
  const selected = project.modules.find(m => m.id === selectedId);
  const selectedItem = selected ? catalogItem(selected.kind) : null;
  const totals = estimate(project), extent = bounds(project.modules);
  const notify = useCallback((message: string) => setNotice(message), []);
  useEffect(() => { if (!notice) return; const timeout = setTimeout(() => setNotice(''), 4500); return () => clearTimeout(timeout); }, [notice]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) parseProject(JSON.parse(saved));
    } catch { notify('No se ha podido recuperar el guardado anterior. Se ha abierto un ejemplo.'); }
  }, [notify]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(project)); setSaveState('saved'); }
    catch { setSaveState('error'); }
  }, [project]);
  const changeProject = useCallback((next: Project) => {
    setPast(p => [...p.slice(-59), project]); setFuture([]); setProject(next);
  }, [project]);
  const updateModule = (patch: Partial<Module>) => {
    if (!selected) return;
    const next = normalizeModule({ ...selected, ...patch });
    if (JSON.stringify(selected) === JSON.stringify(next)) return;
    changeProject({ ...project, modules: project.modules.map(m => m.id === selected.id ? next : m) });
  };
  const undo = useCallback(() => {
    if (!past.length) return; setFuture(f => [project, ...f]); setProject(past[past.length - 1]); setPast(p => p.slice(0, -1));
  }, [past, project]);
  const redo = useCallback(() => {
    if (!future.length) return; setPast(p => [...p, project]); setProject(future[0]); setFuture(f => f.slice(1));
  }, [future, project]);
  const remove = useCallback(() => {
    if (!selectedId) return;
    changeProject({ ...project, modules: project.modules.filter(m => m.id !== selectedId) }); setSelectedId(null); notify('Módulo eliminado. Puedes deshacer el cambio.');
  }, [changeProject, project, selectedId, notify]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (dialog || (event.target instanceof HTMLElement && (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) || event.target.isContentEditable))) return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      if (event.key === 'Delete' && selectedId) { event.preventDefault(); remove(); }
    }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, remove, selectedId, dialog]);
  useEffect(() => { if (selectedId && !project.modules.some(m => m.id === selectedId)) setSelectedId(null); }, [project.modules, selectedId]);
  const add = (kind: Kind) => {
    if (project.modules.length >= 200) { notify('El proyecto admite hasta 200 módulos.'); return; }
    const x = project.modules.length ? bounds(project.modules).maxX + catalog.find(c => c.kind === kind)!.size[0] / 2 + 12 : 0;
    const m = createModule(kind, { x: Math.min(2000, x) });
    changeProject({ ...project, modules: [...project.modules, m] }); setSelectedId(m.id); setTab('properties'); setFrame(f => f + 1); notify(`${m.name} añadido al proyecto.`); setMobilePanel('scene');
  };
  const duplicate = () => {
    if (!selected) return;
    if (project.modules.length >= 200) { notify('El proyecto admite hasta 200 módulos.'); return; }
    const m = { ...selected, id: crypto.randomUUID(), name: `${selected.name.slice(0, 72)} copia`, x: Math.min(2000, selected.x + selected.width + 12) };
    changeProject({ ...project, modules: [...project.modules, m] }); setSelectedId(m.id); setTab('properties'); setFrame(f => f + 1); notify('Módulo duplicado.');
  };
  const slug = project.name.replace(/[^a-zA-Z0-9áéíóúñ_-]/g, '-').slice(0, 80) || 'proyecto';
  const exportJSON = () => { download(JSON.stringify(project, null, 2), `${slug}.pladur.json`, 'application/json'); notify('Proyecto exportado.'); setDialog(null); };
  const importFile = async (file: File) => {
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('El archivo supera el límite de 2 MB.');
      const next = parseProject(JSON.parse(await file.text()));
      changeProject(next); setSelectedId(next.modules[0]?.id ?? null); setFrame(f => f + 1); notify('Proyecto abierto. El proyecto anterior sigue disponible en Deshacer.');
    } catch (error) { notify(error instanceof SyntaxError ? 'El archivo no es un JSON válido de Pladur Studio.' : error instanceof Error ? error.message : 'No se ha podido abrir el archivo.'); }
  };
  const setCamera = (next: View) => { setView(next); setFrame(f => f + 1); };
  const searchText = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es');
  const filtered = catalog.filter(c => (category === 'Todos' || c.category === category) && searchText(`${c.name} ${c.description} ${c.category}`).includes(searchText(search.trim())));
  return <div className="app-shell">
    <header className="app-header">
      <a className="brand" href="#" aria-label="Pladur Studio" onClick={e => e.preventDefault()}><span className="brand-mark"><Box size={24} strokeWidth={1.6} /></span><span>pladur<span className="brand-light">studio</span><small>Diseño de mobiliario 3D</small></span></a>
      <div className="header-divider" />
      <div className="project-heading"><input aria-label="Nombre del proyecto" maxLength={100} key={project.name} defaultValue={project.name} onBlur={e => { const name = e.target.value.trim() || 'Proyecto sin título'; if (name !== project.name) changeProject({ ...project, name }); }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} /><span className={`save-status ${saveState === 'error' ? 'error' : ''}`}>{saveState === 'saved' ? <><Check size={12} /> Guardado en este navegador</> : 'Guardado no disponible: descarga el JSON'}</span></div>
      <div className="header-actions"><button className="text-button new-button" onClick={() => setDialog('new')}><Plus size={16} /> Nuevo</button><IconButton title="Abrir proyecto JSON" onClick={() => input.current?.click()}><FolderOpen size={18} /></IconButton><button className="primary-button" aria-label="Exportar" onClick={() => setDialog('export')}><Download size={16} /><span>Exportar</span><ChevronDown size={13} /></button></div>
      <input hidden ref={input} type="file" accept=".json,application/json" onChange={e => { const file = e.target.files?.[0]; if (file) void importFile(file); e.target.value = ''; }} />
    </header>
    <nav className="mobile-nav" aria-label="Paneles del editor"><button className={mobilePanel === 'catalog' ? 'active' : ''} onClick={() => setMobilePanel('catalog')}><Layers size={16} />Catálogo</button><button className={mobilePanel === 'scene' ? 'active' : ''} onClick={() => setMobilePanel('scene')}><Box size={16} />Editor 3D</button><button className={mobilePanel === 'inspector' ? 'active' : ''} onClick={() => setMobilePanel('inspector')}><Ruler size={16} />Propiedades</button></nav>
    <main className={`workspace mobile-${mobilePanel}`}>
      <aside className="catalog-panel">
        <div className="panel-heading"><div><h2>Biblioteca de módulos</h2><p>La base de tu próximo mueble</p></div><Layers size={19} /></div>
        <label className="search-field"><Search size={16} /><input aria-label="Buscar módulos" placeholder="Buscar un módulo…" value={search} onChange={e => setSearch(e.target.value)} />{search && <button aria-label="Limpiar búsqueda" onClick={() => setSearch('')}><X size={14} /></button>}</label>
        <div className="category-tabs" aria-label="Categorías">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="library-result"><span>{filtered.length} de {catalog.length} módulos</span>{(search || category !== 'Todos') && <button onClick={() => { setSearch(''); setCategory('Todos'); }}>Ver todos</button>}</div>
        <div className="library-scroll">
          <div className="asset-grid">{filtered.map(c => <button className="asset-card" key={c.kind} onClick={() => add(c.kind)} title={`Añadir ${c.name}: ${c.description}${c.elevation ? `. Posición inicial a ${c.elevation} cm del suelo` : ''}`}><div className="asset-visual"><Thumbnail kind={c.kind} />{c.elevation && <span className="asset-elevation">Elevado</span>}<span className="asset-add"><Plus size={15} /></span></div><strong>{c.name}</strong><span>{c.size.join(' × ')} cm</span></button>)}{!filtered.length && <p className="empty-library">No hay módulos con esos filtros. Prueba otra búsqueda o pulsa Ver todos.</p>}</div>
          <div className="catalog-tip"><MousePointer2 size={17} /><p><strong>Combina piezas y volúmenes</strong>Usa encimeras, baldas y pilares junto a los muebles. Ajusta su altura y posición para unir la composición.</p></div>
        </div>
        <div className="elements-section"><div className="section-title"><h3>En tu proyecto</h3><span>{project.modules.length}</span></div><div className="element-list">{project.modules.map(m => <button key={m.id} className={`element-row ${selectedId === m.id ? 'selected' : ''}`} onClick={() => { setSelectedId(m.id); setTab('properties'); }}><Box size={15} /><span>{m.name}</span><small>{format(m.width, 0)} cm</small></button>)}{!project.modules.length && <p className="empty-library">Añade el primer módulo desde la biblioteca.</p>}</div></div>
        <button className="help-link" onClick={() => setDialog('help')}><BookOpen size={15} />Guía del editor<ArrowUpRight size={14} /></button>
      </aside>
      <section className="viewport-panel" aria-label="Editor 3D">
        <div className="viewport-toolbar"><div className="view-tabs"><button className={view === 'perspective' ? 'active' : ''} onClick={() => setCamera('perspective')}><Box size={15} />3D</button><button className={view === 'front' ? 'active' : ''} onClick={() => setCamera('front')}>Frontal</button><button className={view === 'top' ? 'active' : ''} onClick={() => setCamera('top')}>Planta</button></div><span className="toolbar-separator"/><IconButton title="Deshacer (Ctrl+Z)" onClick={undo} disabled={!past.length}><Undo2 size={17}/></IconButton><IconButton title="Rehacer (Ctrl+Mayús+Z)" onClick={redo} disabled={!future.length}><Redo2 size={17}/></IconButton><div className="toolbar-spacer"/><IconButton title="Mostrar cuadrícula" active={grid} onClick={() => setGrid(!grid)}><Grid2X2 size={17}/></IconButton><IconButton title="Mostrar cotas del conjunto" active={dimensions} onClick={() => setDimensions(!dimensions)}><Ruler size={18}/></IconButton><IconButton title="Mostrar decoración" active={decoration} onClick={() => setDecoration(!decoration)}><Armchair size={18}/></IconButton><IconButton title="Encuadrar proyecto" onClick={() => setFrame(f => f + 1)}><Maximize size={17}/></IconButton></div>
        <div className="canvas-container"><Scene ref={scene} modules={project.modules} selectedId={selectedId} onSelect={setSelectedId} grid={grid} dimensions={dimensions} decoration={decoration} view={view} frame={frame}/>
          <div className="canvas-label"><span className="live-dot"/><span>{view === 'perspective' ? 'Perspectiva' : view === 'front' ? 'Vista frontal' : 'Vista en planta'}</span><small>Unidades: cm</small></div>
          {!project.modules.length && <div className="empty-scene"><Box size={42} strokeWidth={1}/><h2>Tu idea empieza aquí</h2><p>Añade módulos desde la biblioteca o explora una composición de salón.</p><button className="primary-button" onClick={() => setDialog('example')}>Cargar ejemplo de salón</button><button className="text-button mobile-library-link" onClick={() => setMobilePanel('catalog')}>Abrir catálogo</button></div>}
          <div className="axis-widget" aria-label="Ejes: X horizontal, Y vertical, Z profundidad"><span className="axis-y">Y</span><span className="axis-x">X</span><span className="axis-z">Z</span><span className="axis-center"/></div>
          <div className="canvas-bottom"><span><Move size={14}/>{view === 'perspective' ? 'Arrastra para orbitar' : 'Arrastra para desplazar'}<i/>Rueda para zoom</span><button onClick={() => { const image = scene.current?.capture(); if (image) { const a = document.createElement('a'); a.href = image; a.download = `${slug}.png`; a.click(); notify('Imagen de la vista descargada.'); } else notify('La vista 3D no está disponible para capturar.'); }} title="Descargar imagen de la vista"><Camera size={16}/>Captura</button></div>
        </div>
        <div className="project-summary"><div className="summary-icon"><Ruler size={20}/></div><div><small>Dimensiones del conjunto</small><strong>{project.modules.length ? `${format(extent.width, 0)} × ${format(extent.height, 0)} × ${format(extent.depth, 0)}` : '—'} <span>cm</span></strong></div><div className="summary-area"><small>Superficie estimada con merma</small><strong>{format(totals.withWaste)} <span>m²</span></strong></div><button className="summary-detail" onClick={() => { setTab('measurements'); setMobilePanel('inspector'); }} aria-label="Ver mediciones"><ArrowUpRight size={19}/></button></div>
      </section>
      <aside className="inspector-panel"><div className="inspector-tabs"><button className={tab === 'properties' ? 'active' : ''} onClick={() => setTab('properties')}>Propiedades</button><button className={tab === 'measurements' ? 'active' : ''} onClick={() => setTab('measurements')}>Mediciones</button></div>
        <div className="inspector-scroll">{tab === 'properties' ? selected ? <>
          <div className="selection-heading"><div className="selected-asset"><Thumbnail kind={selected.kind}/></div><div><small>Módulo seleccionado</small><h2>{catalog.find(c => c.kind === selected.kind)?.name}</h2></div></div>
          <label className="name-field">Nombre del módulo<input key={`${selected.id}-${selected.name}`} maxLength={80} defaultValue={selected.name} onBlur={e => { const name = e.target.value.trim() || catalog.find(c => c.kind === selected.kind)!.name; updateModule({ name }); }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}/></label>
          <section className="property-section">
            <h3><Ruler size={15}/>Dimensiones<span>cm</span></h3>
            <div className="fields-grid three-fields">
              <NumberField label="Ancho" value={selected.width} min={dimensionMinimum(selected.kind, 'width')} max={1000} onChange={v => updateModule({ width: v })}/>
              <NumberField label="Alto" value={selected.height} min={dimensionMinimum(selected.kind, 'height')} max={1000} onChange={v => updateModule({ height: v })}/>
              <NumberField label="Fondo" value={selected.depth} min={dimensionMinimum(selected.kind, 'depth')} max={1000} onChange={v => updateModule({ depth: v })}/>
            </div>
            {hasThicknessControl(selected.kind) && <>
              <div className="fields-grid">
                <NumberField label="Grosor del conjunto" value={selected.thickness} min={1} max={thicknessLimit(selected)} step={.5} onChange={v => updateModule({ thickness: v })}/>
                {selectedItem?.shelfLabel && <NumberField label={selectedItem.shelfLabel} value={selected.shelves} unit="uds" min={0} max={shelfLimit(selected.height)} onChange={v => updateModule({ shelves: v })}/>}
              </div>
              <p className="field-help">Grosor del volumen terminado, incluida la estructura.</p>
            </>}
          </section>
          <section className="property-section"><h3><Move size={15}/>Posición<span>cm</span></h3><div className="fields-grid three-fields"><NumberField label="X · horizontal" value={selected.x} min={-2000} max={2000} onChange={v => updateModule({ x: v })}/><NumberField label="Y · altura" value={selected.y} min={0} max={2000} onChange={v => updateModule({ y: v })}/><NumberField label="Z · fondo" value={selected.z} min={-2000} max={2000} onChange={v => updateModule({ z: v })}/></div><div className="rotation-row"><NumberField label="Giro" unit="°" value={selected.rotation} min={0} max={359} onChange={v => updateModule({ rotation: v })}/><button className="text-button" onClick={() => updateModule({ rotation: selected.rotation + 90 })}><RotateCcw size={15}/>Girar 90°</button></div></section>
          <section className="property-section"><h3><Square size={14}/>Acabado</h3><div className="finish-options">{finishes.map(f => <button key={f.color} className={selected.color === f.color ? 'selected' : ''} style={{ background: f.color }} title={f.name} aria-label={f.name} aria-pressed={selected.color === f.color} onClick={() => updateModule({ color: f.color })}>{selected.color === f.color && <Check size={17} color={f.color === '#596775' ? 'white' : '#263d50'}/>}</button>)}<span>{finishes.find(f => f.color === selected.color)?.name}</span></div></section>
          <div className="module-area"><span>Superficie bruta del módulo</span><strong>{format(moduleArea(selected))} <small>m²</small></strong><p>Caras y cantos, antes de aplicar merma.</p></div>
          <div className="module-actions"><button onClick={duplicate}><Copy size={16}/>Duplicar</button><button className="danger" onClick={remove}><Trash2 size={16}/>Eliminar</button></div>
        </> : <div className="empty-inspector"><MousePointer2 size={28} strokeWidth={1.5}/><h2>Selecciona un módulo</h2><p>Pulsa una pieza en la escena o en la lista para editar sus propiedades.</p></div> : <>
          <div className="measurement-heading"><Ruler size={23}/><h2>Mediciones del proyecto</h2><p>Estimación geométrica de revestimiento</p></div><div className="total-measurement"><small>Con merma incluida</small><strong>{format(totals.withWaste)} <span>m²</span></strong><div><span>Superficie bruta</span><b>{format(totals.area)} m²</b></div></div>
          <div className="waste-control"><NumberField label="Merma de material" value={project.wastePercent} min={0} max={50} unit="%" onChange={v => { if (v !== project.wastePercent) changeProject({ ...project, wastePercent: v }); }}/><p>Añade margen para cortes y ajustes.</p></div>
          <div className="section-title"><h3>Superficie por módulo</h3><span>{project.modules.length}</span></div><div className="measurement-list">{project.modules.map(m => <button key={m.id} onClick={() => { setSelectedId(m.id); setTab('properties'); }}><span>{m.name}</span><b>{format(moduleArea(m))} m²</b></button>)}</div>
          <div className="measurement-info"><Info size={17}/><div><strong>Cómo se calcula</strong><p>Se suman las seis caras de cada panel, incluidos los cantos. No se descuentan las caras de contacto ni se fusionan módulos. La decoración queda excluida.</p><p>Es una superficie bruta orientativa, no un cálculo de placas comerciales ni estructural.</p></div></div><button className="outline-button full-width" onClick={() => { download(projectCSV(project), `${slug}-despiece.csv`, 'text/csv;charset=utf-8'); notify('Despiece con medidas y superficies descargado.'); }}><FileSpreadsheet size={16}/>Descargar despiece CSV</button>
        </>}</div>
        <div className="inspector-footer"><span className="live-dot"/>Diseño paramétrico<span>v0.2</span></div>
      </aside>
    </main>
    <footer className="status-bar"><span><span className="status-dot"/>Espacio de trabajo local</span><span>{project.modules.length} módulos<span className="status-divider"/>{totals.panels} paneles</span><button onClick={() => setDialog('help')}><Info size={13}/>Ayuda y atajos</button></footer>
    {notice && <div className="toast" role="status"><Info size={17}/><span>{notice}</span><button aria-label="Cerrar mensaje" onClick={() => setNotice('')}><X size={15}/></button></div>}
    {dialog && <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) setDialog(null); }}><Dialog type={dialog} close={() => setDialog(null)} onJSON={exportJSON} onCSV={() => { download(projectCSV(project), `${slug}-despiece.csv`, 'text/csv;charset=utf-8'); setDialog(null); notify('Despiece descargado.'); }} onImage={() => { const data = scene.current?.capture(); if (data) { const link = document.createElement('a'); link.href = data; link.download = `${slug}.png`; link.click(); setDialog(null); } else notify('La vista 3D no está disponible para capturar.'); }} onReplace={() => { const next = dialog === 'new' ? emptyProject() : exampleProject(); changeProject(next); setSelectedId(next.modules[0]?.id ?? null); setFrame(f => f + 1); setDialog(null); setMobilePanel('scene'); }}/></div>}
  </div>;
}
function Dialog({ type, close, onJSON, onCSV, onImage, onReplace }: { type: 'export' | 'help' | 'new' | 'example'; close: () => void; onJSON: () => void; onCSV: () => void; onImage: () => void; onReplace: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current!; element.querySelector<HTMLButtonElement>('button')?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const buttons = [...element.querySelectorAll<HTMLButtonElement>('button')]; const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handler); return () => { window.removeEventListener('keydown', handler); previous?.focus(); };
  }, [close]);
  return <div ref={dialog} className="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div className="dialog-heading"><h2 id="dialog-title">{type === 'export' ? 'Exportar tu proyecto' : type === 'help' ? 'Tu estudio, a tu medida' : type === 'new' ? 'Crear un proyecto vacío' : 'Cargar el ejemplo de salón'}</h2><IconButton title="Cerrar" onClick={close}><X size={19}/></IconButton></div>{type === 'export' ? <><p>Guarda una copia para continuar después o comparte las medidas de tu diseño.</p><button className="export-option" onClick={onJSON}><FileJson size={22}/><span><strong>Proyecto editable</strong><small>Archivo JSON para volver a abrir en Pladur Studio</small></span><Download size={16}/></button><button className="export-option" onClick={onCSV}><FileSpreadsheet size={22}/><span><strong>Despiece y superficies</strong><small>Paneles, medidas en cm y superficie bruta en m²</small></span><Download size={16}/></button><button className="export-option" onClick={onImage}><Image size={22}/><span><strong>Imagen del diseño</strong><small>Captura PNG de la vista actual</small></span><Download size={16}/></button></> : type === 'help' ? <><p>Combina módulos de pladur y convierte una idea en un diseño con medidas.</p><ol className="help-steps"><li><strong>Añade y combina</strong>Pulsa una pieza de la biblioteca. Se añadirá junto a las existentes.</li><li><strong>Ajusta en centímetros</strong>Edita ancho, alto, fondo, posición y giro. Pulsa Enter o sal del campo para aplicar.</li><li><strong>Revisa y guarda</strong>Consulta los m² en Mediciones. El proyecto se guarda automáticamente en este navegador; descarga un JSON para conservar una copia.</li></ol><div className="shortcut-list"><span>Orbitar / zoom</span><b>Arrastrar / rueda</b><span>Desplazar en 3D</span><b>Botón derecho</b><span>Deshacer / rehacer</span><b>Ctrl+Z / Ctrl+Mayús+Z</b><span>Eliminar selección</span><b>Supr</b></div><p className="field-help">En Mac, usa ⌘ en lugar de Ctrl. La selección también está disponible desde la lista de módulos.</p><button className="primary-button full-width" onClick={close}>Empezar a diseñar</button></> : <><p>{type === 'new' ? 'Se sustituirá el proyecto actual por uno vacío.' : 'Se sustituirá el proyecto actual por una composición con mueble TV y dos estanterías.'} Puedes recuperar el diseño anterior con Deshacer o descargar primero una copia.</p><div className="dialog-actions"><button className="outline-button" onClick={close}>Cancelar</button><button className="primary-button" onClick={onReplace}>{type === 'new' ? 'Crear proyecto' : 'Cargar ejemplo'}</button></div></>}</div>;
}
