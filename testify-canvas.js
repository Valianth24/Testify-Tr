/**
 * TESTIFY CANVAS SYSTEM v1.0
 * ===========================
 * Ultra-premium drawing/writing system for YKS test solving
 * Features: pressure simulation, shape recognition, infinite canvas,
 * multi-layer support, undo/redo, brush presets, and more.
 * 
 * Inspired by: Microsoft Whiteboard, Procreate, Excalidraw
 * Built with: perfect-freehand algorithm (embedded)
 */

'use strict';

(function() {

// ═══════════════════════════════════════════════════════════════════════════
// PERFECT-FREEHAND ALGORITHM (Embedded - MIT License by Steve Ruiz)
// ═══════════════════════════════════════════════════════════════════════════

const average = (a, b) => (a + b) / 2;

function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return '';
    
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, average(x0, x1), average(y0, y1));
            return acc;
        },
        ['M', ...stroke[0], 'Q']
    );
    
    d.push('Z');
    return d.join(' ');
}

function getStroke(points, options = {}) {
    const {
        size = 16,
        thinning = 0.5,
        smoothing = 0.5,
        streamline = 0.5,
        easing = t => t,
        simulatePressure = true,
        start = {},
        end = {},
        last = true
    } = options;
    
    const {
        cap: startCap = true,
        taper: startTaper = 0,
        easing: startEasing = t => t * (2 - t)
    } = start;
    
    const {
        cap: endCap = true,
        taper: endTaper = 0,
        easing: endEasing = t => --t * t * t + 1
    } = end;
    
    if (points.length === 0) return [];
    
    const totalLength = points.reduce((acc, point, i) => {
        if (i === 0) return 0;
        const prev = points[i - 1];
        return acc + Math.hypot(point[0] - prev[0], point[1] - prev[1]);
    }, 0);
    
    const minDistance = size * streamline;
    const strokePoints = [];
    let prevPoint = points[0];
    let runningLength = 0;
    
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const pressure = point[2] !== undefined ? point[2] : 0.5;
        
        if (i > 0) {
            const distance = Math.hypot(point[0] - prevPoint[0], point[1] - prevPoint[1]);
            runningLength += distance;
        }
        
        strokePoints.push({
            point: [point[0], point[1]],
            pressure,
            vector: i > 0 
                ? [point[0] - prevPoint[0], point[1] - prevPoint[1]]
                : [1, 1],
            distance: i > 0 
                ? Math.hypot(point[0] - prevPoint[0], point[1] - prevPoint[1])
                : 0,
            runningLength
        });
        
        prevPoint = point;
    }
    
    if (strokePoints.length === 0) return [];
    if (strokePoints.length === 1) {
        const { point, pressure } = strokePoints[0];
        const r = size * easing(pressure) / 2;
        return [
            [point[0] - r, point[1]],
            [point[0], point[1] - r],
            [point[0] + r, point[1]],
            [point[0], point[1] + r]
        ];
    }
    
    const leftPoints = [];
    const rightPoints = [];
    
    for (let i = 0; i < strokePoints.length; i++) {
        const { point, pressure, runningLength: rl } = strokePoints[i];
        
        let sp = simulatePressure 
            ? Math.min(1, 1 - Math.min(1, strokePoints[i].distance / size))
            : pressure;
        
        // Apply thinning
        const radius = size * easing(0.5 - thinning * (0.5 - sp)) / 2;
        
        // Get perpendicular
        let nx, ny;
        if (i === 0) {
            const next = strokePoints[1];
            nx = -(next.point[1] - point[1]);
            ny = next.point[0] - point[0];
        } else if (i === strokePoints.length - 1) {
            const prev = strokePoints[i - 1];
            nx = -(point[1] - prev.point[1]);
            ny = point[0] - prev.point[0];
        } else {
            const prev = strokePoints[i - 1];
            const next = strokePoints[i + 1];
            nx = -(next.point[1] - prev.point[1]);
            ny = next.point[0] - prev.point[0];
        }
        
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        
        // Apply smoothing
        const offset = radius * (1 - smoothing * 0.5);
        
        leftPoints.push([point[0] + nx * offset, point[1] + ny * offset]);
        rightPoints.push([point[0] - nx * offset, point[1] - ny * offset]);
    }
    
    // Start cap
    const startPoint = strokePoints[0].point;
    const startRadius = size * easing(strokePoints[0].pressure) / 2;
    const startCaps = startCap ? [
        [startPoint[0] - startRadius, startPoint[1]],
        [startPoint[0], startPoint[1] - startRadius * 0.5],
    ] : [];
    
    // End cap
    const endPoint = strokePoints[strokePoints.length - 1].point;
    const endRadius = size * easing(strokePoints[strokePoints.length - 1].pressure) / 2;
    const endCaps = endCap ? [
        [endPoint[0], endPoint[1] + endRadius * 0.5],
        [endPoint[0] + endRadius, endPoint[1]],
    ] : [];
    
    return [...startCaps, ...leftPoints, ...endCaps, ...rightPoints.reverse()];
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 4000,
    CANVAS_HEIGHT: 3000,
    MIN_ZOOM: 0.1,
    MAX_ZOOM: 5,
    ZOOM_STEP: 0.1,
    
    // Drawing
    DEFAULT_COLOR: '#1f2937',
    DEFAULT_SIZE: 8,
    MIN_SIZE: 1,
    MAX_SIZE: 64,
    DEFAULT_OPACITY: 1,
    
    // Perfect-freehand options
    STROKE_OPTIONS: {
        thinning: 0.6,
        smoothing: 0.5,
        streamline: 0.5,
        simulatePressure: true,
        start: { cap: true, taper: 0 },
        end: { cap: true, taper: 0 }
    },
    
    // History
    MAX_HISTORY: 100,
    
    // Shape recognition
    SHAPE_RECOGNITION_THRESHOLD: 0.85,
    MIN_POINTS_FOR_SHAPE: 10,
    
    // Colors
    COLORS: [
        '#1f2937', // black
        '#3b82f6', // blue
        '#ef4444', // red
        '#10b981', // green
        '#8b5cf6', // purple
        '#f59e0b', // orange
        '#ec4899', // pink
        '#06b6d4', // cyan
        '#84cc16', // lime
        '#f97316', // dark orange
        '#6366f1', // indigo
        '#14b8a6', // teal
    ],
    
    // Brush presets
    BRUSH_PRESETS: [
        { id: 'pen', name: 'Kalem', size: 4, thinning: 0.5, smoothing: 0.5 },
        { id: 'marker', name: 'Marker', size: 16, thinning: 0.2, smoothing: 0.3 },
        { id: 'highlighter', name: 'Fosforlu', size: 24, thinning: 0, smoothing: 0.8, opacity: 0.4 },
        { id: 'pencil', name: 'Kurşun Kalem', size: 3, thinning: 0.8, smoothing: 0.2 },
        { id: 'brush', name: 'Fırça', size: 12, thinning: 0.7, smoothing: 0.6 }
    ],
    
    // Storage
    STORAGE_KEY: 'testify.canvas.data',
    AUTOSAVE_INTERVAL: 30000
};

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS ENUM
// ═══════════════════════════════════════════════════════════════════════════

const TOOLS = {
    PEN: 'pen',
    ERASER: 'eraser',
    SELECT: 'select',
    PAN: 'pan',
    SHAPE: 'shape',
    TEXT: 'text',
    LASER: 'laser'
};

const SHAPES = {
    LINE: 'line',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    ARROW: 'arrow'
};

// ═══════════════════════════════════════════════════════════════════════════
// TESTIFY CANVAS CLASS
// ═══════════════════════════════════════════════════════════════════════════

class TestifyCanvas {
    constructor(options = {}) {
        this.options = {
            container: null,
            mode: 'fullscreen', // 'fullscreen' | 'embedded' | 'quiz'
            onSave: null,
            onClose: null,
            ...options
        };
        
        // State
        this.isOpen = false;
        this.tool = TOOLS.PEN;
        this.color = CONFIG.DEFAULT_COLOR;
        this.size = CONFIG.DEFAULT_SIZE;
        this.opacity = CONFIG.DEFAULT_OPACITY;
        this.brushPreset = CONFIG.BRUSH_PRESETS[0];
        
        // Canvas state
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDrawing = false;
        this.isPanning = false;
        this.currentPoints = [];
        this.currentStroke = null;
        
        // Layers
        this.layers = [
            { id: 'layer-1', name: 'Katman 1', visible: true, strokes: [] }
        ];
        this.activeLayerId = 'layer-1';
        
        // History
        this.history = [];
        this.historyIndex = -1;
        
        // Elements
        this.container = null;
        this.svg = null;
        this.wrapper = null;
        
        // Bindings
        this.handlePointerDown = this.handlePointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        
        // Initialize
        this.init();
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════
    
    init() {
        this.createElements();
        this.attachEventListeners();
        this.loadFromStorage();
        this.saveHistory();
        
        console.log('[TestifyCanvas] Initialized');
    }
    
    createElements() {
        // Main container
        this.container = document.createElement('div');
        this.container.className = 'testify-canvas-container';
        if (this.options.mode === 'quiz') {
            this.container.classList.add('quiz-mode');
        }
        
        this.container.innerHTML = this.getTemplate();
        
        // Append to body or custom container
        if (this.options.container) {
            this.options.container.appendChild(this.container);
            this.container.classList.add('is-open');
            this.isOpen = true;
        } else {
            document.body.appendChild(this.container);
        }
        
        // Get references
        this.svg = this.container.querySelector('#testifyDrawCanvas');
        this.wrapper = this.container.querySelector('.canvas-wrapper');
        this.gridEl = this.container.querySelector('.canvas-grid');
        this.eraserCursor = this.container.querySelector('.eraser-cursor');
        
        // Setup SVG viewBox
        this.updateViewBox();
        
        // Create grid
        this.createGrid();
        
        // Update UI
        this.updateToolUI();
        this.updateColorUI();
        this.updateBrushUI();
    }
    
    getTemplate() {
        const isQuizMode = this.options.mode === 'quiz';
        
        return `
            <!-- Top Toolbar -->
            <div class="canvas-top-toolbar">
                <div class="canvas-toolbar-left">
                    ${!isQuizMode ? `
                    <h1 class="canvas-title">
                        <span class="canvas-title-icon">
                            <i class="ph ph-pencil-simple"></i>
                        </span>
                        Çizim Alanı
                    </h1>
                    ` : ''}
                </div>
                
                <div class="canvas-toolbar-center">
                    <button class="canvas-btn" data-action="undo" title="Geri Al (Ctrl+Z)" ${this.historyIndex <= 0 ? 'disabled' : ''}>
                        <i class="ph ph-arrow-counter-clockwise"></i>
                    </button>
                    <button class="canvas-btn" data-action="redo" title="İleri Al (Ctrl+Y)" ${this.historyIndex >= this.history.length - 1 ? 'disabled' : ''}>
                        <i class="ph ph-arrow-clockwise"></i>
                    </button>
                    ${!isQuizMode ? `
                    <div style="width: 1px; height: 20px; background: var(--toolbar-border); margin: 0 0.25rem;"></div>
                    <button class="canvas-btn" data-action="clear" title="Temizle">
                        <i class="ph ph-trash"></i>
                    </button>
                    ` : ''}
                </div>
                
                <div class="canvas-toolbar-right">
                    ${!isQuizMode ? `
                    <button class="canvas-btn canvas-btn-text" data-action="save">
                        <i class="ph ph-floppy-disk"></i>
                        Kaydet
                    </button>
                    <button class="canvas-btn" data-action="download" title="PNG olarak indir">
                        <i class="ph ph-download-simple"></i>
                    </button>
                    ` : ''}
                    <button class="canvas-btn" data-action="minimize" title="${isQuizMode ? 'Kapat' : 'Küçült'}">
                        <i class="ph ph-${isQuizMode ? 'x' : 'minus'}"></i>
                    </button>
                    ${!isQuizMode ? `
                    <button class="canvas-btn" data-action="close" title="Kapat">
                        <i class="ph ph-x"></i>
                    </button>
                    ` : ''}
                </div>
            </div>
            
            <!-- Main Canvas Area -->
            <div class="canvas-main-area">
                <div class="canvas-wrapper">
                    <div class="canvas-grid"></div>
                    <svg id="testifyDrawCanvas" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="pencilTexture">
                                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise"/>
                                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" xChannelSelector="R" yChannelSelector="G"/>
                            </filter>
                        </defs>
                        <g id="canvasContent" transform="translate(0,0) scale(1)">
                            <!-- Strokes will be rendered here -->
                        </g>
                    </svg>
                    <div class="eraser-cursor"></div>
                </div>
                
                <!-- Tools Panel -->
                <div class="canvas-tools-panel">
                    <button class="tool-btn is-active" data-tool="pen" data-tooltip="Kalem (P)">
                        <i class="ph ph-pen"></i>
                    </button>
                    <button class="tool-btn" data-tool="eraser" data-tooltip="Silgi (E)">
                        <i class="ph ph-eraser"></i>
                    </button>
                    ${!isQuizMode ? `
                    <button class="tool-btn" data-tool="select" data-tooltip="Seç (V)">
                        <i class="ph ph-cursor"></i>
                    </button>
                    ` : ''}
                    <button class="tool-btn" data-tool="pan" data-tooltip="Kaydır (H)">
                        <i class="ph ph-hand"></i>
                    </button>
                    
                    <div class="tool-divider"></div>
                    
                    ${!isQuizMode ? `
                    <button class="tool-btn" data-tool="shape" data-tooltip="Şekil (S)">
                        <i class="ph ph-shapes"></i>
                    </button>
                    <button class="tool-btn" data-tool="text" data-tooltip="Metin (T)">
                        <i class="ph ph-text-t"></i>
                    </button>
                    <button class="tool-btn" data-tool="laser" data-tooltip="Lazer (L)">
                        <i class="ph ph-cursor-click"></i>
                    </button>
                    ` : ''}
                </div>
                
                <!-- Options Panel -->
                ${!isQuizMode ? `
                <div class="canvas-options-panel">
                    <!-- Colors -->
                    <div class="options-section">
                        <div class="options-label">Renk</div>
                        <div class="color-palette">
                            ${CONFIG.COLORS.map(c => `
                                <button class="color-swatch ${c === this.color ? 'is-active' : ''}" 
                                        data-color="${c}" 
                                        style="background: ${c}"></button>
                            `).join('')}
                        </div>
                        <div class="color-picker-wrapper">
                            <button class="color-picker-btn"></button>
                            <input type="color" class="color-picker-input" value="${this.color}">
                        </div>
                    </div>
                    
                    <!-- Brush Size -->
                    <div class="options-section">
                        <div class="options-label">Boyut</div>
                        <div class="brush-size-control">
                            <div class="brush-size-preview">
                                <div class="brush-preview-dot" style="width: ${this.size}px; height: ${this.size}px; background: ${this.color}"></div>
                            </div>
                            <input type="range" class="brush-size-slider" 
                                   min="${CONFIG.MIN_SIZE}" 
                                   max="${CONFIG.MAX_SIZE}" 
                                   value="${this.size}">
                            <div class="brush-size-value">${this.size}px</div>
                        </div>
                    </div>
                    
                    <!-- Opacity -->
                    <div class="options-section">
                        <div class="options-label">Opaklık</div>
                        <div class="opacity-control">
                            <input type="range" class="opacity-slider" 
                                   min="0.1" max="1" step="0.1" 
                                   value="${this.opacity}">
                            <span class="opacity-value">${Math.round(this.opacity * 100)}%</span>
                        </div>
                    </div>
                    
                    <!-- Brush Presets -->
                    <div class="options-section">
                        <div class="options-label">Fırça Stili</div>
                        <div class="brush-presets">
                            ${CONFIG.BRUSH_PRESETS.map(preset => `
                                <button class="brush-preset ${preset.id === this.brushPreset.id ? 'is-active' : ''}" 
                                        data-preset="${preset.id}" 
                                        title="${preset.name}">
                                    ${this.getBrushPresetIcon(preset.id)}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <!-- Bottom Bar -->
            ${!isQuizMode ? `
            <div class="canvas-bottom-bar">
                <div class="canvas-info-left">
                    <span class="canvas-info-item">
                        <i class="ph ph-stack"></i>
                        <span id="strokeCount">${this.getTotalStrokeCount()} çizgi</span>
                    </span>
                    <span class="canvas-info-item">
                        <i class="ph ph-clock"></i>
                        <span id="lastSaved">-</span>
                    </span>
                </div>
                
                <div class="canvas-info-right">
                    <button class="canvas-btn" data-action="toggle-grid" title="Izgara">
                        <i class="ph ph-grid-four"></i>
                    </button>
                    
                    <div class="zoom-controls">
                        <button class="zoom-btn" data-action="zoom-out">
                            <i class="ph ph-minus"></i>
                        </button>
                        <span class="zoom-value">${Math.round(this.zoom * 100)}%</span>
                        <button class="zoom-btn" data-action="zoom-in">
                            <i class="ph ph-plus"></i>
                        </button>
                        <button class="zoom-btn" data-action="zoom-reset" title="Sıfırla">
                            <i class="ph ph-frame-corners"></i>
                        </button>
                    </div>
                </div>
            </div>
            ` : ''}
            
            <!-- Shape Recognition Hint -->
            <div class="shape-recognition-hint" id="shapeHint"></div>
        `;
    }
    
    getBrushPresetIcon(presetId) {
        const icons = {
            pen: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
            marker: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 1.15c-.53 0-1.04.19-1.43.58l-5.81 5.82 5.65 5.65 5.82-5.81c.77-.78.77-2.05 0-2.83l-2.82-2.83c-.39-.39-.9-.58-1.41-.58zM10.3 8.5l-7.37 7.37c-.39.39-.39 1.01 0 1.41l3.24 3.23c.39.38 1.03.39 1.42 0l7.36-7.35L10.3 8.5z"/></svg>',
            highlighter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm5-12h2v3h-2V2zM3.5 5.88l1.41-1.41 2.12 2.12L5.62 8 3.5 5.88zm13.46.71l2.12-2.12 1.41 1.41L18.38 8l-1.42-1.41z" opacity="0.6"/></svg>',
            pencil: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.3 8.93l-1.41-1.41-9.59 9.59 1.41 1.41 9.59-9.59zM15.89 5.52l-1.41-1.41-9.59 9.59 1.41 1.41 9.59-9.59zM5 19h14v2H5v-2z"/></svg>',
            brush: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/></svg>'
        };
        return icons[presetId] || icons.pen;
    }
    
    createGrid() {
        if (!this.gridEl) return;
        
        const gridSize = 20;
        const majorGridSize = 100;
        const width = CONFIG.CANVAS_WIDTH;
        const height = CONFIG.CANVAS_HEIGHT;
        
        let gridHTML = `
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
                        <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="var(--canvas-grid)" stroke-width="0.5"/>
                    </pattern>
                    <pattern id="grid" width="${majorGridSize}" height="${majorGridSize}" patternUnits="userSpaceOnUse">
                        <rect width="${majorGridSize}" height="${majorGridSize}" fill="url(#smallGrid)"/>
                        <path d="M ${majorGridSize} 0 L 0 0 0 ${majorGridSize}" fill="none" stroke="var(--canvas-grid-major)" stroke-width="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        `;
        
        this.gridEl.innerHTML = gridHTML;
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════
    
    attachEventListeners() {
        // Pointer events on SVG
        this.svg.addEventListener('pointerdown', this.handlePointerDown);
        this.svg.addEventListener('pointermove', this.handlePointerMove);
        this.svg.addEventListener('pointerup', this.handlePointerUp);
        this.svg.addEventListener('pointerleave', this.handlePointerUp);
        this.svg.addEventListener('pointercancel', this.handlePointerUp);
        
        // Wheel for zoom
        this.wrapper.addEventListener('wheel', this.handleWheel, { passive: false });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyDown);
        
        // Tool buttons
        this.container.querySelectorAll('[data-tool]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setTool(btn.dataset.tool);
            });
        });
        
        // Action buttons
        this.container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAction(btn.dataset.action);
            });
        });
        
        // Color swatches
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', () => {
                this.setColor(swatch.dataset.color);
            });
        });
        
        // Color picker
        const colorPicker = this.container.querySelector('.color-picker-input');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.setColor(e.target.value);
            });
        }
        
        // Brush size slider
        const sizeSlider = this.container.querySelector('.brush-size-slider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                this.setSize(parseInt(e.target.value));
            });
        }
        
        // Opacity slider
        const opacitySlider = this.container.querySelector('.opacity-slider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                this.setOpacity(parseFloat(e.target.value));
            });
        }
        
        // Brush presets
        this.container.querySelectorAll('.brush-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setBrushPreset(btn.dataset.preset);
            });
        });
        
        // Prevent context menu
        this.svg.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch handling
        this.svg.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                this.isPanning = true;
            }
        }, { passive: true });
    }
    
    removeEventListeners() {
        this.svg.removeEventListener('pointerdown', this.handlePointerDown);
        this.svg.removeEventListener('pointermove', this.handlePointerMove);
        this.svg.removeEventListener('pointerup', this.handlePointerUp);
        this.svg.removeEventListener('pointerleave', this.handlePointerUp);
        this.svg.removeEventListener('pointercancel', this.handlePointerUp);
        this.wrapper.removeEventListener('wheel', this.handleWheel);
        document.removeEventListener('keydown', this.handleKeyDown);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // POINTER HANDLERS
    // ═══════════════════════════════════════════════════════════════════════
    
    handlePointerDown(e) {
        e.preventDefault();
        
        // Capture pointer
        this.svg.setPointerCapture(e.pointerId);
        
        const point = this.getPointerPosition(e);
        const pressure = e.pressure || 0.5;
        
        if (this.tool === TOOLS.PAN || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            // Pan mode
            this.isPanning = true;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.wrapper.classList.add('is-panning', 'is-dragging');
            return;
        }
        
        if (this.tool === TOOLS.ERASER) {
            // Eraser mode
            this.isErasing = true;
            this.eraseAt(point.x, point.y);
            return;
        }
        
        if (this.tool === TOOLS.PEN) {
            // Start drawing
            this.isDrawing = true;
            this.currentPoints = [[point.x, point.y, pressure]];
            this.currentStroke = this.createStrokePath();
            this.renderCurrentStroke();
        }
    }
    
    handlePointerMove(e) {
        const point = this.getPointerPosition(e);
        const pressure = e.pressure || 0.5;
        
        // Update eraser cursor
        if (this.tool === TOOLS.ERASER) {
            this.updateEraserCursor(e.clientX, e.clientY);
            
            if (this.isErasing) {
                this.eraseAt(point.x, point.y);
            }
            return;
        }
        
        // Pan
        if (this.isPanning && this.lastPanPoint) {
            const dx = e.clientX - this.lastPanPoint.x;
            const dy = e.clientY - this.lastPanPoint.y;
            
            this.panX += dx;
            this.panY += dy;
            
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.updateViewBox();
            return;
        }
        
        // Draw
        if (this.isDrawing && this.tool === TOOLS.PEN) {
            this.currentPoints.push([point.x, point.y, pressure]);
            this.renderCurrentStroke();
        }
    }
    
    handlePointerUp(e) {
        // Release pointer
        if (e.pointerId !== undefined) {
            this.svg.releasePointerCapture(e.pointerId);
        }
        
        if (this.isPanning) {
            this.isPanning = false;
            this.lastPanPoint = null;
            this.wrapper.classList.remove('is-panning', 'is-dragging');
            return;
        }
        
        if (this.isErasing) {
            this.isErasing = false;
            this.saveHistory();
            return;
        }
        
        if (this.isDrawing && this.tool === TOOLS.PEN) {
            this.isDrawing = false;
            
            if (this.currentPoints.length > 1) {
                // Finalize stroke
                this.finalizeStroke();
            } else {
                // Remove single-point stroke
                if (this.currentStroke) {
                    this.currentStroke.remove();
                }
            }
            
            this.currentPoints = [];
            this.currentStroke = null;
        }
    }
    
    handleWheel(e) {
        e.preventDefault();
        
        const delta = e.deltaY > 0 ? -CONFIG.ZOOM_STEP : CONFIG.ZOOM_STEP;
        const newZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, this.zoom + delta));
        
        if (newZoom !== this.zoom) {
            // Zoom towards cursor
            const rect = this.svg.getBoundingClientRect();
            const cursorX = e.clientX - rect.left;
            const cursorY = e.clientY - rect.top;
            
            const scale = newZoom / this.zoom;
            this.panX = cursorX - (cursorX - this.panX) * scale;
            this.panY = cursorY - (cursorY - this.panY) * scale;
            
            this.zoom = newZoom;
            this.updateViewBox();
            this.updateZoomUI();
        }
    }
    
    handleKeyDown(e) {
        if (!this.isOpen) return;
        
        // Prevent default for our shortcuts
        const key = e.key.toLowerCase();
        
        // Tool shortcuts
        if (!e.ctrlKey && !e.metaKey) {
            switch (key) {
                case 'p': this.setTool(TOOLS.PEN); break;
                case 'e': this.setTool(TOOLS.ERASER); break;
                case 'v': this.setTool(TOOLS.SELECT); break;
                case 'h': this.setTool(TOOLS.PAN); break;
                case 's': this.setTool(TOOLS.SHAPE); break;
                case 't': this.setTool(TOOLS.TEXT); break;
                case 'l': this.setTool(TOOLS.LASER); break;
                case 'escape': this.close(); break;
            }
        }
        
        // Ctrl shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (key) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
                case 's':
                    e.preventDefault();
                    this.save();
                    break;
                case '0':
                    e.preventDefault();
                    this.resetZoom();
                    break;
                case '=':
                case '+':
                    e.preventDefault();
                    this.zoomIn();
                    break;
                case '-':
                    e.preventDefault();
                    this.zoomOut();
                    break;
            }
        }
        
        // Bracket shortcuts for brush size
        if (key === '[') {
            this.setSize(Math.max(CONFIG.MIN_SIZE, this.size - 2));
        } else if (key === ']') {
            this.setSize(Math.min(CONFIG.MAX_SIZE, this.size + 2));
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // DRAWING METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    createStrokePath() {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('canvas-stroke-filled');
        path.style.fill = this.color;
        path.style.opacity = this.opacity;
        
        const contentGroup = this.svg.querySelector('#canvasContent');
        contentGroup.appendChild(path);
        
        return path;
    }
    
    renderCurrentStroke() {
        if (!this.currentStroke || this.currentPoints.length < 2) return;
        
        const strokeOptions = {
            size: this.size,
            ...CONFIG.STROKE_OPTIONS,
            ...this.brushPreset
        };
        
        const outlinePoints = getStroke(this.currentPoints, strokeOptions);
        const pathData = getSvgPathFromStroke(outlinePoints);
        
        this.currentStroke.setAttribute('d', pathData);
    }
    
    finalizeStroke() {
        if (!this.currentStroke || this.currentPoints.length < 2) return;
        
        // Get active layer
        const layer = this.layers.find(l => l.id === this.activeLayerId);
        if (!layer) return;
        
        // Save stroke data
        const strokeData = {
            id: this.generateId(),
            points: this.currentPoints,
            color: this.color,
            size: this.size,
            opacity: this.opacity,
            brushPreset: this.brushPreset.id,
            timestamp: Date.now()
        };
        
        layer.strokes.push(strokeData);
        
        // Assign ID to path element
        this.currentStroke.dataset.strokeId = strokeData.id;
        
        // Check for shape recognition
        this.tryRecognizeShape(strokeData);
        
        // Save history
        this.saveHistory();
        
        // Update UI
        this.updateStrokeCount();
    }
    
    eraseAt(x, y) {
        const eraserSize = this.size * 2;
        const layer = this.layers.find(l => l.id === this.activeLayerId);
        if (!layer) return;
        
        let erased = false;
        
        // Find strokes that intersect with eraser
        layer.strokes = layer.strokes.filter(stroke => {
            // Check if any point is within eraser radius
            const isNear = stroke.points.some(point => {
                const dx = point[0] - x;
                const dy = point[1] - y;
                return Math.sqrt(dx * dx + dy * dy) < eraserSize;
            });
            
            if (isNear) {
                // Remove from DOM
                const pathEl = this.svg.querySelector(`[data-stroke-id="${stroke.id}"]`);
                if (pathEl) {
                    pathEl.remove();
                }
                erased = true;
                return false;
            }
            
            return true;
        });
        
        if (erased) {
            this.updateStrokeCount();
        }
    }
    
    updateEraserCursor(clientX, clientY) {
        if (!this.eraserCursor) return;
        
        this.eraserCursor.style.left = clientX + 'px';
        this.eraserCursor.style.top = clientY + 'px';
        this.eraserCursor.style.width = (this.size * 4) + 'px';
        this.eraserCursor.style.height = (this.size * 4) + 'px';
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // SHAPE RECOGNITION
    // ═══════════════════════════════════════════════════════════════════════
    
    tryRecognizeShape(strokeData) {
        if (strokeData.points.length < CONFIG.MIN_POINTS_FOR_SHAPE) return;
        
        // Get bounding box
        const xs = strokeData.points.map(p => p[0]);
        const ys = strokeData.points.map(p => p[1]);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const width = maxX - minX;
        const height = maxY - minY;
        
        // Check if stroke is closed (start and end are close)
        const start = strokeData.points[0];
        const end = strokeData.points[strokeData.points.length - 1];
        const closedDistance = Math.hypot(end[0] - start[0], end[1] - start[1]);
        const isClosed = closedDistance < Math.max(width, height) * 0.15;
        
        if (!isClosed) return;
        
        // Analyze shape
        const aspectRatio = width / height;
        const perimeter = this.calculatePerimeter(strokeData.points);
        const area = width * height;
        const circularity = (4 * Math.PI * area) / (perimeter * perimeter);
        
        let recognizedShape = null;
        
        // Circle detection
        if (circularity > 0.7 && aspectRatio > 0.8 && aspectRatio < 1.2) {
            recognizedShape = 'circle';
        }
        // Rectangle detection
        else if (aspectRatio > 0.8 && aspectRatio < 1.2 && this.hasRightAngles(strokeData.points)) {
            recognizedShape = 'square';
        }
        else if (this.hasRightAngles(strokeData.points)) {
            recognizedShape = 'rectangle';
        }
        // Triangle detection
        else if (this.countCorners(strokeData.points) === 3) {
            recognizedShape = 'triangle';
        }
        
        if (recognizedShape) {
            this.showShapeHint(recognizedShape, minX + width / 2, minY - 20);
        }
    }
    
    calculatePerimeter(points) {
        let perimeter = 0;
        for (let i = 1; i < points.length; i++) {
            perimeter += Math.hypot(
                points[i][0] - points[i-1][0],
                points[i][1] - points[i-1][1]
            );
        }
        return perimeter;
    }
    
    hasRightAngles(points) {
        // Simplified check for rectangular shapes
        const corners = this.findCorners(points);
        return corners.length >= 4;
    }
    
    countCorners(points) {
        return this.findCorners(points).length;
    }
    
    findCorners(points, threshold = 0.5) {
        const corners = [];
        const windowSize = Math.floor(points.length / 10);
        
        for (let i = windowSize; i < points.length - windowSize; i++) {
            const prev = points[i - windowSize];
            const curr = points[i];
            const next = points[i + windowSize];
            
            const v1 = [curr[0] - prev[0], curr[1] - prev[1]];
            const v2 = [next[0] - curr[0], next[1] - curr[1]];
            
            const dot = v1[0] * v2[0] + v1[1] * v2[1];
            const len1 = Math.hypot(v1[0], v1[1]);
            const len2 = Math.hypot(v2[0], v2[1]);
            
            if (len1 > 0 && len2 > 0) {
                const cos = dot / (len1 * len2);
                if (cos < threshold) {
                    corners.push(curr);
                }
            }
        }
        
        return corners;
    }
    
    showShapeHint(shape, x, y) {
        const hint = this.container.querySelector('#shapeHint');
        if (!hint) return;
        
        const shapeNames = {
            circle: 'Daire algılandı',
            square: 'Kare algılandı',
            rectangle: 'Dikdörtgen algılandı',
            triangle: 'Üçgen algılandı'
        };
        
        hint.textContent = shapeNames[shape] || shape;
        hint.style.left = x + 'px';
        hint.style.top = y + 'px';
        hint.classList.add('is-visible');
        
        setTimeout(() => {
            hint.classList.remove('is-visible');
        }, 2000);
    }
    
    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════════════
    
    getPointerPosition(e) {
        const rect = this.svg.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.panX) / this.zoom;
        const y = (e.clientY - rect.top - this.panY) / this.zoom;
        return { x, y };
    }
    
    updateViewBox() {
        const contentGroup = this.svg.querySelector('#canvasContent');
        if (contentGroup) {
            contentGroup.setAttribute('transform', `translate(${this.panX}, ${this.panY}) scale(${this.zoom})`);
        }
    }
    
    generateId() {
        return 'stroke_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    getTotalStrokeCount() {
        return this.layers.reduce((sum, layer) => sum + layer.strokes.length, 0);
    }
    
    // Continue in Part 2...
}

// Store class for global access
window.TestifyCanvasClass = TestifyCanvas;

})();
/**
 * TESTIFY CANVAS SYSTEM v1.0 - Part 2
 * ====================================
 * UI Controls, History, Storage, and Integration
 */

'use strict';

(function() {

// Get the class from Part 1
const TestifyCanvas = window.TestifyCanvasClass;
if (!TestifyCanvas) {
    console.error('[TestifyCanvas] Core module not loaded!');
    return;
}

// ═══════════════════════════════════════════════════════════════════════════
// EXTEND PROTOTYPE: UI METHODS
// ═══════════════════════════════════════════════════════════════════════════

Object.assign(TestifyCanvas.prototype, {
    
    // ═══════════════════════════════════════════════════════════════════════
    // TOOL MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    setTool(tool) {
        this.tool = tool;
        this.updateToolUI();
        
        // Update cursor
        if (tool === TOOLS.ERASER) {
            this.wrapper.classList.add('eraser-active');
        } else {
            this.wrapper.classList.remove('eraser-active');
        }
        
        if (tool === TOOLS.PAN) {
            this.wrapper.classList.add('is-panning');
        } else {
            this.wrapper.classList.remove('is-panning');
        }
    },
    
    updateToolUI() {
        this.container.querySelectorAll('[data-tool]').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.tool === this.tool);
        });
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // COLOR MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    setColor(color) {
        this.color = color;
        this.updateColorUI();
        this.updateBrushPreview();
    },
    
    updateColorUI() {
        this.container.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.classList.toggle('is-active', swatch.dataset.color === this.color);
        });
        
        const colorPicker = this.container.querySelector('.color-picker-input');
        if (colorPicker) {
            colorPicker.value = this.color;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // SIZE & OPACITY MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════
    
    setSize(size) {
        this.size = Math.max(1, Math.min(64, size));
        this.updateBrushUI();
        this.updateBrushPreview();
    },
    
    setOpacity(opacity) {
        this.opacity = Math.max(0.1, Math.min(1, opacity));
        this.updateOpacityUI();
    },
    
    updateBrushUI() {
        const slider = this.container.querySelector('.brush-size-slider');
        const value = this.container.querySelector('.brush-size-value');
        
        if (slider) slider.value = this.size;
        if (value) value.textContent = this.size + 'px';
        
        this.updateBrushPreview();
    },
    
    updateOpacityUI() {
        const slider = this.container.querySelector('.opacity-slider');
        const value = this.container.querySelector('.opacity-value');
        
        if (slider) slider.value = this.opacity;
        if (value) value.textContent = Math.round(this.opacity * 100) + '%';
    },
    
    updateBrushPreview() {
        const preview = this.container.querySelector('.brush-preview-dot');
        if (preview) {
            preview.style.width = this.size + 'px';
            preview.style.height = this.size + 'px';
            preview.style.background = this.color;
            preview.style.opacity = this.opacity;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // BRUSH PRESETS
    // ═══════════════════════════════════════════════════════════════════════
    
    setBrushPreset(presetId) {
        const CONFIG = {
            BRUSH_PRESETS: [
                { id: 'pen', name: 'Kalem', size: 4, thinning: 0.5, smoothing: 0.5 },
                { id: 'marker', name: 'Marker', size: 16, thinning: 0.2, smoothing: 0.3 },
                { id: 'highlighter', name: 'Fosforlu', size: 24, thinning: 0, smoothing: 0.8, opacity: 0.4 },
                { id: 'pencil', name: 'Kurşun Kalem', size: 3, thinning: 0.8, smoothing: 0.2 },
                { id: 'brush', name: 'Fırça', size: 12, thinning: 0.7, smoothing: 0.6 }
            ]
        };
        
        const preset = CONFIG.BRUSH_PRESETS.find(p => p.id === presetId);
        if (!preset) return;
        
        this.brushPreset = preset;
        this.size = preset.size;
        
        if (preset.opacity !== undefined) {
            this.opacity = preset.opacity;
            this.updateOpacityUI();
        }
        
        this.updateBrushUI();
        this.updatePresetUI();
    },
    
    updatePresetUI() {
        this.container.querySelectorAll('.brush-preset').forEach(btn => {
            btn.classList.toggle('is-active', btn.dataset.preset === this.brushPreset.id);
        });
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // ZOOM CONTROLS
    // ═══════════════════════════════════════════════════════════════════════
    
    zoomIn() {
        this.zoom = Math.min(5, this.zoom + 0.1);
        this.updateViewBox();
        this.updateZoomUI();
    },
    
    zoomOut() {
        this.zoom = Math.max(0.1, this.zoom - 0.1);
        this.updateViewBox();
        this.updateZoomUI();
    },
    
    resetZoom() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateViewBox();
        this.updateZoomUI();
    },
    
    updateZoomUI() {
        const zoomValue = this.container.querySelector('.zoom-value');
        if (zoomValue) {
            zoomValue.textContent = Math.round(this.zoom * 100) + '%';
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // STROKE COUNT
    // ═══════════════════════════════════════════════════════════════════════
    
    updateStrokeCount() {
        const count = this.getTotalStrokeCount();
        const el = this.container.querySelector('#strokeCount');
        if (el) {
            el.textContent = count + ' çizgi';
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // HISTORY (UNDO/REDO)
    // ═══════════════════════════════════════════════════════════════════════
    
    saveHistory() {
        // Remove any redo states
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Deep clone layers
        const snapshot = JSON.parse(JSON.stringify(this.layers));
        
        // Add to history
        this.history.push(snapshot);
        
        // Limit history size
        if (this.history.length > 100) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }
        
        this.updateHistoryButtons();
    },
    
    undo() {
        if (this.historyIndex <= 0) return;
        
        this.historyIndex--;
        this.restoreFromHistory();
        this.updateHistoryButtons();
    },
    
    redo() {
        if (this.historyIndex >= this.history.length - 1) return;
        
        this.historyIndex++;
        this.restoreFromHistory();
        this.updateHistoryButtons();
    },
    
    restoreFromHistory() {
        const snapshot = this.history[this.historyIndex];
        if (!snapshot) return;
        
        // Clear current strokes from DOM
        const contentGroup = this.svg.querySelector('#canvasContent');
        contentGroup.querySelectorAll('path[data-stroke-id]').forEach(el => el.remove());
        
        // Restore layers
        this.layers = JSON.parse(JSON.stringify(snapshot));
        
        // Re-render all strokes
        this.renderAllStrokes();
        this.updateStrokeCount();
    },
    
    updateHistoryButtons() {
        const undoBtn = this.container.querySelector('[data-action="undo"]');
        const redoBtn = this.container.querySelector('[data-action="redo"]');
        
        if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
        if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // RENDERING
    // ═══════════════════════════════════════════════════════════════════════
    
    renderAllStrokes() {
        const contentGroup = this.svg.querySelector('#canvasContent');
        
        this.layers.forEach(layer => {
            if (!layer.visible) return;
            
            layer.strokes.forEach(stroke => {
                this.renderStrokeFromData(stroke, contentGroup);
            });
        });
    },
    
    renderStrokeFromData(strokeData, parent) {
        const CONFIG = {
            STROKE_OPTIONS: {
                thinning: 0.6,
                smoothing: 0.5,
                streamline: 0.5,
                simulatePressure: true,
                start: { cap: true, taper: 0 },
                end: { cap: true, taper: 0 }
            },
            BRUSH_PRESETS: [
                { id: 'pen', name: 'Kalem', size: 4, thinning: 0.5, smoothing: 0.5 },
                { id: 'marker', name: 'Marker', size: 16, thinning: 0.2, smoothing: 0.3 },
                { id: 'highlighter', name: 'Fosforlu', size: 24, thinning: 0, smoothing: 0.8, opacity: 0.4 },
                { id: 'pencil', name: 'Kurşun Kalem', size: 3, thinning: 0.8, smoothing: 0.2 },
                { id: 'brush', name: 'Fırça', size: 12, thinning: 0.7, smoothing: 0.6 }
            ]
        };
        
        const preset = CONFIG.BRUSH_PRESETS.find(p => p.id === strokeData.brushPreset) || CONFIG.BRUSH_PRESETS[0];
        
        const strokeOptions = {
            size: strokeData.size,
            ...CONFIG.STROKE_OPTIONS,
            ...preset
        };
        
        // Use embedded getStroke function
        const outlinePoints = window.TestifyCanvasUtils.getStroke(strokeData.points, strokeOptions);
        const pathData = window.TestifyCanvasUtils.getSvgPathFromStroke(outlinePoints);
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('canvas-stroke-filled');
        path.setAttribute('d', pathData);
        path.style.fill = strokeData.color;
        path.style.opacity = strokeData.opacity;
        path.dataset.strokeId = strokeData.id;
        
        parent.appendChild(path);
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // CLEAR CANVAS
    // ═══════════════════════════════════════════════════════════════════════
    
    clear() {
        // Confirm before clearing
        if (this.getTotalStrokeCount() > 0) {
            if (!confirm('Tüm çizimler silinecek. Emin misiniz?')) {
                return;
            }
        }
        
        // Clear all strokes from DOM
        const contentGroup = this.svg.querySelector('#canvasContent');
        contentGroup.querySelectorAll('path[data-stroke-id]').forEach(el => el.remove());
        
        // Clear layer data
        this.layers.forEach(layer => {
            layer.strokes = [];
        });
        
        // Save history
        this.saveHistory();
        this.updateStrokeCount();
        
        // Show toast
        if (window.Utils && typeof Utils.showToast === 'function') {
            Utils.showToast('Çizim alanı temizlendi', 'info');
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // STORAGE
    // ═══════════════════════════════════════════════════════════════════════
    
    saveToStorage() {
        try {
            const data = {
                layers: this.layers,
                zoom: this.zoom,
                panX: this.panX,
                panY: this.panY,
                lastSaved: Date.now()
            };
            
            localStorage.setItem('testify.canvas.data', JSON.stringify(data));
            
            // Update last saved time
            const lastSaved = this.container.querySelector('#lastSaved');
            if (lastSaved) {
                lastSaved.textContent = 'Az önce kaydedildi';
            }
            
            return true;
        } catch (e) {
            console.error('[TestifyCanvas] Save error:', e);
            return false;
        }
    },
    
    loadFromStorage() {
        try {
            const raw = localStorage.getItem('testify.canvas.data');
            if (!raw) return;
            
            const data = JSON.parse(raw);
            
            if (data.layers && Array.isArray(data.layers)) {
                this.layers = data.layers;
            }
            
            if (typeof data.zoom === 'number') {
                this.zoom = data.zoom;
            }
            
            if (typeof data.panX === 'number') {
                this.panX = data.panX;
            }
            
            if (typeof data.panY === 'number') {
                this.panY = data.panY;
            }
            
            // Render loaded strokes
            this.renderAllStrokes();
            this.updateViewBox();
            this.updateZoomUI();
            this.updateStrokeCount();
            
            // Update last saved time
            if (data.lastSaved) {
                const lastSaved = this.container.querySelector('#lastSaved');
                if (lastSaved) {
                    const ago = this.formatTimeAgo(data.lastSaved);
                    lastSaved.textContent = ago;
                }
            }
            
        } catch (e) {
            console.error('[TestifyCanvas] Load error:', e);
        }
    },
    
    formatTimeAgo(timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        
        if (seconds < 60) return 'Az önce';
        if (seconds < 3600) return Math.floor(seconds / 60) + ' dk önce';
        if (seconds < 86400) return Math.floor(seconds / 3600) + ' saat önce';
        return Math.floor(seconds / 86400) + ' gün önce';
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // EXPORT
    // ═══════════════════════════════════════════════════════════════════════
    
    async exportToPNG() {
        try {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = 1920;
            canvas.height = 1080;
            
            // Fill background
            const theme = document.documentElement.getAttribute('data-theme');
            ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Get SVG data
            const svgData = new XMLSerializer().serializeToString(this.svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            // Create image from SVG
            const img = new Image();
            
            return new Promise((resolve, reject) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    URL.revokeObjectURL(url);
                    
                    // Download
                    const link = document.createElement('a');
                    link.download = `testify-canvas-${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    
                    resolve(true);
                };
                
                img.onerror = reject;
                img.src = url;
            });
            
        } catch (e) {
            console.error('[TestifyCanvas] Export error:', e);
            if (window.Utils && typeof Utils.showToast === 'function') {
                Utils.showToast('Dışa aktarma hatası', 'error');
            }
            return false;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // ACTION HANDLER
    // ═══════════════════════════════════════════════════════════════════════
    
    handleAction(action) {
        switch (action) {
            case 'undo':
                this.undo();
                break;
            case 'redo':
                this.redo();
                break;
            case 'clear':
                this.clear();
                break;
            case 'save':
                this.save();
                break;
            case 'download':
                this.exportToPNG();
                break;
            case 'minimize':
                this.minimize();
                break;
            case 'close':
                this.close();
                break;
            case 'toggle-grid':
                this.toggleGrid();
                break;
            case 'zoom-in':
                this.zoomIn();
                break;
            case 'zoom-out':
                this.zoomOut();
                break;
            case 'zoom-reset':
                this.resetZoom();
                break;
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GRID TOGGLE
    // ═══════════════════════════════════════════════════════════════════════
    
    toggleGrid() {
        if (this.gridEl) {
            this.gridEl.classList.toggle('is-hidden');
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // OPEN / CLOSE / MINIMIZE
    // ═══════════════════════════════════════════════════════════════════════
    
    open() {
        this.container.classList.add('is-open');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
    },
    
    close() {
        // Save before closing
        this.saveToStorage();
        
        this.container.classList.remove('is-open');
        this.isOpen = false;
        document.body.style.overflow = '';
        
        if (this.options.onClose) {
            this.options.onClose();
        }
    },
    
    minimize() {
        this.container.classList.toggle('is-minimized');
    },
    
    save() {
        const success = this.saveToStorage();
        
        if (success && window.Utils && typeof Utils.showToast === 'function') {
            Utils.showToast('Çizim kaydedildi', 'success');
        }
        
        if (this.options.onSave) {
            this.options.onSave(this.layers);
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // DESTROY
    // ═══════════════════════════════════════════════════════════════════════
    
    destroy() {
        this.removeEventListeners();
        this.container.remove();
    },
    
    // ═══════════════════════════════════════════════════════════════════════
    // GET DATA FOR QUIZ
    // ═══════════════════════════════════════════════════════════════════════
    
    getImageData() {
        // Convert SVG to data URL for saving with quiz answers
        const svgData = new XMLSerializer().serializeToString(this.svg);
        const base64 = btoa(unescape(encodeURIComponent(svgData)));
        return 'data:image/svg+xml;base64,' + base64;
    },
    
    hasDrawings() {
        return this.getTotalStrokeCount() > 0;
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// TOOLS ENUM (Re-declare for this module)
// ═══════════════════════════════════════════════════════════════════════════

const TOOLS = {
    PEN: 'pen',
    ERASER: 'eraser',
    SELECT: 'select',
    PAN: 'pan',
    SHAPE: 'shape',
    TEXT: 'text',
    LASER: 'laser'
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS (Global access for rendering)
// ═══════════════════════════════════════════════════════════════════════════

const average = (a, b) => (a + b) / 2;

function getSvgPathFromStroke(stroke) {
    if (!stroke.length) return '';
    
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, average(x0, x1), average(y0, y1));
            return acc;
        },
        ['M', ...stroke[0], 'Q']
    );
    
    d.push('Z');
    return d.join(' ');
}

function getStroke(points, options = {}) {
    const {
        size = 16,
        thinning = 0.5,
        smoothing = 0.5,
        streamline = 0.5,
        easing = t => t,
        simulatePressure = true
    } = options;
    
    if (points.length === 0) return [];
    
    const strokePoints = [];
    let prevPoint = points[0];
    let runningLength = 0;
    
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const pressure = point[2] !== undefined ? point[2] : 0.5;
        
        if (i > 0) {
            runningLength += Math.hypot(point[0] - prevPoint[0], point[1] - prevPoint[1]);
        }
        
        strokePoints.push({
            point: [point[0], point[1]],
            pressure,
            distance: i > 0 ? Math.hypot(point[0] - prevPoint[0], point[1] - prevPoint[1]) : 0
        });
        
        prevPoint = point;
    }
    
    if (strokePoints.length === 0) return [];
    if (strokePoints.length === 1) {
        const { point, pressure } = strokePoints[0];
        const r = size * easing(pressure) / 2;
        return [
            [point[0] - r, point[1]],
            [point[0], point[1] - r],
            [point[0] + r, point[1]],
            [point[0], point[1] + r]
        ];
    }
    
    const leftPoints = [];
    const rightPoints = [];
    
    for (let i = 0; i < strokePoints.length; i++) {
        const { point, pressure } = strokePoints[i];
        
        let sp = simulatePressure 
            ? Math.min(1, 1 - Math.min(1, strokePoints[i].distance / size))
            : pressure;
        
        const radius = size * easing(0.5 - thinning * (0.5 - sp)) / 2;
        
        let nx, ny;
        if (i === 0) {
            const next = strokePoints[1];
            nx = -(next.point[1] - point[1]);
            ny = next.point[0] - point[0];
        } else if (i === strokePoints.length - 1) {
            const prev = strokePoints[i - 1];
            nx = -(point[1] - prev.point[1]);
            ny = point[0] - prev.point[0];
        } else {
            const prev = strokePoints[i - 1];
            const next = strokePoints[i + 1];
            nx = -(next.point[1] - prev.point[1]);
            ny = next.point[0] - prev.point[0];
        }
        
        const len = Math.hypot(nx, ny) || 1;
        nx /= len;
        ny /= len;
        
        const offset = radius * (1 - smoothing * 0.5);
        
        leftPoints.push([point[0] + nx * offset, point[1] + ny * offset]);
        rightPoints.push([point[0] - nx * offset, point[1] - ny * offset]);
    }
    
    const startPoint = strokePoints[0].point;
    const startRadius = size * easing(strokePoints[0].pressure) / 2;
    const startCaps = [
        [startPoint[0] - startRadius, startPoint[1]],
        [startPoint[0], startPoint[1] - startRadius * 0.5],
    ];
    
    const endPoint = strokePoints[strokePoints.length - 1].point;
    const endRadius = size * easing(strokePoints[strokePoints.length - 1].pressure) / 2;
    const endCaps = [
        [endPoint[0], endPoint[1] + endRadius * 0.5],
        [endPoint[0] + endRadius, endPoint[1]],
    ];
    
    return [...startCaps, ...leftPoints, ...endCaps, ...rightPoints.reverse()];
}

// Export utilities globally
window.TestifyCanvasUtils = {
    getStroke,
    getSvgPathFromStroke
};

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL API
// ═══════════════════════════════════════════════════════════════════════════

let globalInstance = null;

window.TestifyCanvas = {
    /**
     * Open the canvas in fullscreen mode
     */
    open(options = {}) {
        if (globalInstance) {
            globalInstance.open();
            return globalInstance;
        }
        
        globalInstance = new TestifyCanvas({
            mode: 'fullscreen',
            ...options
        });
        
        globalInstance.open();
        return globalInstance;
    },
    
    /**
     * Create embedded canvas for quiz questions
     * @param {HTMLElement} container - Container element
     * @param {Object} options - Options
     */
    createEmbedded(container, options = {}) {
        return new TestifyCanvas({
            container,
            mode: 'quiz',
            ...options
        });
    },
    
    /**
     * Get the global instance
     */
    getInstance() {
        return globalInstance;
    },
    
    /**
     * Close the canvas
     */
    close() {
        if (globalInstance) {
            globalInstance.close();
        }
    },
    
    /**
     * Check if canvas is open
     */
    isOpen() {
        return globalInstance && globalInstance.isOpen;
    }
};

console.log('[TestifyCanvas] System loaded and ready');

})();
/**
 * TESTIFY QUIZ CANVAS INTEGRATION v1.0
 * =====================================
 * Integrates TestifyCanvas with QuizManager for drawing during tests
 */

'use strict';

(function() {

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ CANVAS MANAGER
// ═══════════════════════════════════════════════════════════════════════════

const QuizCanvasManager = {
    // State
    canvasInstances: new Map(),  // questionId -> canvas instance
    isEnabled: true,
    
    /**
     * Initialize canvas for a question
     * @param {string} questionId - Question identifier
     * @param {HTMLElement} container - Container to embed canvas
     */
    initForQuestion(questionId, container) {
        if (!this.isEnabled || !container) return null;
        
        // Check if TestifyCanvas is available
        if (!window.TestifyCanvas) {
            console.warn('[QuizCanvasManager] TestifyCanvas not loaded');
            return null;
        }
        
        // Create canvas container
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'quiz-canvas-wrapper';
        canvasContainer.id = `quiz-canvas-${questionId}`;
        canvasContainer.innerHTML = `
            <div class="quiz-canvas-header">
                <span class="quiz-canvas-title">
                    <i class="ph ph-pencil-simple"></i>
                    Çizim Alanı
                </span>
                <div class="quiz-canvas-actions">
                    <button type="button" class="quiz-canvas-btn" data-action="clear" title="Temizle">
                        <i class="ph ph-trash"></i>
                    </button>
                    <button type="button" class="quiz-canvas-btn" data-action="undo" title="Geri Al">
                        <i class="ph ph-arrow-counter-clockwise"></i>
                    </button>
                    <button type="button" class="quiz-canvas-btn" data-action="expand" title="Genişlet">
                        <i class="ph ph-arrows-out"></i>
                    </button>
                    <button type="button" class="quiz-canvas-btn is-active" data-action="toggle" title="Gizle/Göster">
                        <i class="ph ph-caret-down"></i>
                    </button>
                </div>
            </div>
            <div class="quiz-canvas-body">
                <div class="quiz-canvas-embed"></div>
            </div>
        `;
        
        container.appendChild(canvasContainer);
        
        // Get embed container
        const embedContainer = canvasContainer.querySelector('.quiz-canvas-embed');
        
        // Create embedded canvas
        const canvas = TestifyCanvas.createEmbedded(embedContainer, {
            onSave: (layers) => {
                this.saveDrawingForQuestion(questionId, layers);
            }
        });
        
        // Store instance
        this.canvasInstances.set(questionId, {
            canvas,
            container: canvasContainer,
            isExpanded: false,
            isCollapsed: false
        });
        
        // Attach action handlers
        this.attachQuizCanvasActions(questionId, canvasContainer);
        
        return canvas;
    },
    
    /**
     * Attach action handlers to quiz canvas buttons
     */
    attachQuizCanvasActions(questionId, container) {
        const instance = this.canvasInstances.get(questionId);
        if (!instance) return;
        
        container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                
                switch (action) {
                    case 'clear':
                        if (instance.canvas) {
                            instance.canvas.clear();
                        }
                        break;
                        
                    case 'undo':
                        if (instance.canvas) {
                            instance.canvas.undo();
                        }
                        break;
                        
                    case 'expand':
                        this.toggleExpand(questionId);
                        break;
                        
                    case 'toggle':
                        this.toggleCollapse(questionId);
                        break;
                }
            });
        });
    },
    
    /**
     * Toggle expanded mode
     */
    toggleExpand(questionId) {
        const instance = this.canvasInstances.get(questionId);
        if (!instance) return;
        
        instance.isExpanded = !instance.isExpanded;
        instance.container.classList.toggle('is-expanded', instance.isExpanded);
        
        // Update button icon
        const btn = instance.container.querySelector('[data-action="expand"]');
        if (btn) {
            btn.querySelector('i').className = instance.isExpanded 
                ? 'ph ph-arrows-in' 
                : 'ph ph-arrows-out';
        }
    },
    
    /**
     * Toggle collapsed mode
     */
    toggleCollapse(questionId) {
        const instance = this.canvasInstances.get(questionId);
        if (!instance) return;
        
        instance.isCollapsed = !instance.isCollapsed;
        instance.container.classList.toggle('is-collapsed', instance.isCollapsed);
        
        // Update button icon
        const btn = instance.container.querySelector('[data-action="toggle"]');
        if (btn) {
            btn.querySelector('i').className = instance.isCollapsed 
                ? 'ph ph-caret-up' 
                : 'ph ph-caret-down';
        }
    },
    
    /**
     * Save drawing data for a question
     */
    saveDrawingForQuestion(questionId, layers) {
        try {
            const key = `testify.quiz.drawing.${questionId}`;
            localStorage.setItem(key, JSON.stringify({
                layers,
                savedAt: Date.now()
            }));
        } catch (e) {
            console.error('[QuizCanvasManager] Save error:', e);
        }
    },
    
    /**
     * Load drawing data for a question
     */
    loadDrawingForQuestion(questionId) {
        try {
            const key = `testify.quiz.drawing.${questionId}`;
            const raw = localStorage.getItem(key);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            console.error('[QuizCanvasManager] Load error:', e);
        }
        return null;
    },
    
    /**
     * Get canvas instance for a question
     */
    getCanvas(questionId) {
        const instance = this.canvasInstances.get(questionId);
        return instance ? instance.canvas : null;
    },
    
    /**
     * Check if question has drawings
     */
    hasDrawings(questionId) {
        const instance = this.canvasInstances.get(questionId);
        return instance && instance.canvas && instance.canvas.hasDrawings();
    },
    
    /**
     * Get image data for question drawings
     */
    getImageData(questionId) {
        const instance = this.canvasInstances.get(questionId);
        if (instance && instance.canvas) {
            return instance.canvas.getImageData();
        }
        return null;
    },
    
    /**
     * Destroy canvas for a question
     */
    destroyForQuestion(questionId) {
        const instance = this.canvasInstances.get(questionId);
        if (instance) {
            if (instance.canvas) {
                instance.canvas.destroy();
            }
            if (instance.container) {
                instance.container.remove();
            }
            this.canvasInstances.delete(questionId);
        }
    },
    
    /**
     * Destroy all canvases
     */
    destroyAll() {
        this.canvasInstances.forEach((instance, questionId) => {
            this.destroyForQuestion(questionId);
        });
    },
    
    /**
     * Enable/disable canvas feature
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ CANVAS STYLES
// ═══════════════════════════════════════════════════════════════════════════

const styles = `
/* Quiz Canvas Wrapper */
.quiz-canvas-wrapper {
    margin-top: 1rem;
    border-radius: 12px;
    border: 1px solid var(--border-subtle);
    background: var(--bg-secondary);
    overflow: hidden;
    transition: all 0.3s ease;
}

.quiz-canvas-wrapper.is-expanded {
    position: fixed;
    inset: 1rem;
    z-index: 9999;
    margin: 0;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.quiz-canvas-wrapper.is-collapsed .quiz-canvas-body {
    display: none;
}

/* Quiz Canvas Header */
.quiz-canvas-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border-subtle);
}

.quiz-canvas-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
}

.quiz-canvas-title i {
    font-size: 1rem;
    color: var(--primary);
}

.quiz-canvas-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.quiz-canvas-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s ease;
}

.quiz-canvas-btn:hover {
    background: var(--bg-primary);
    color: var(--primary);
}

.quiz-canvas-btn.is-active {
    color: var(--primary);
}

.quiz-canvas-btn i {
    font-size: 1rem;
}

/* Quiz Canvas Body */
.quiz-canvas-body {
    position: relative;
    height: 250px;
    background: var(--canvas-bg, #ffffff);
}

.quiz-canvas-wrapper.is-expanded .quiz-canvas-body {
    height: calc(100% - 44px);
}

.quiz-canvas-embed {
    width: 100%;
    height: 100%;
}

/* Override embedded canvas styles */
.quiz-canvas-embed .testify-canvas-container {
    position: relative !important;
    width: 100% !important;
    height: 100% !important;
    opacity: 1 !important;
    visibility: visible !important;
    transform: none !important;
}

.quiz-canvas-embed .testify-canvas-container.quiz-mode {
    border: none !important;
    box-shadow: none !important;
    margin: 0 !important;
    border-radius: 0 !important;
}

/* Dark mode */
[data-theme="dark"] .quiz-canvas-body {
    background: var(--bg-primary);
}

/* Mobile optimization */
@media (max-width: 768px) {
    .quiz-canvas-body {
        height: 200px;
    }
    
    .quiz-canvas-header {
        padding: 0.35rem 0.5rem;
    }
    
    .quiz-canvas-title {
        font-size: 0.75rem;
    }
    
    .quiz-canvas-btn {
        width: 32px;
        height: 32px;
    }
}
`;

// Inject styles
const styleEl = document.createElement('style');
styleEl.textContent = styles;
document.head.appendChild(styleEl);

// ═══════════════════════════════════════════════════════════════════════════
// QUIZ MANAGER INTEGRATION
// ═══════════════════════════════════════════════════════════════════════════

// Wait for QuizManager to be available
function integrateWithQuizManager() {
    if (!window.QuizManager) {
        setTimeout(integrateWithQuizManager, 100);
        return;
    }
    
    // Store original displayQuestion method
    const originalDisplayQuestion = QuizManager.displayQuestion.bind(QuizManager);
    
    // Override displayQuestion to add canvas
    QuizManager.displayQuestion = function() {
        // Call original method
        originalDisplayQuestion();
        
        // Get current question
        const question = this.state.questions[this.state.currentIndex];
        if (!question) return;
        
        const questionId = question.id || `q_${this.state.currentIndex}`;
        
        // Find container for canvas (after options list)
        const questionCard = document.querySelector('.question-card');
        if (!questionCard) return;
        
        // Remove existing canvas wrapper if any
        const existingWrapper = questionCard.querySelector('.quiz-canvas-wrapper');
        if (existingWrapper) {
            existingWrapper.remove();
        }
        
        // Initialize canvas for this question
        QuizCanvasManager.initForQuestion(questionId, questionCard);
    };
    
    // Store original cleanupPreviousQuiz method
    const originalCleanup = QuizManager.cleanupPreviousQuiz.bind(QuizManager);
    
    // Override cleanup to destroy canvases
    QuizManager.cleanupPreviousQuiz = function() {
        originalCleanup();
        QuizCanvasManager.destroyAll();
    };
    
    console.log('[QuizCanvasManager] Integrated with QuizManager');
}

// Start integration
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', integrateWithQuizManager);
} else {
    integrateWithQuizManager();
}

// Export globally
window.QuizCanvasManager = QuizCanvasManager;

})();
