
/**
 * TESTIFY CANVAS SYSTEM v1.3
 * ===========================
 * Ultra-premium drawing/writing system for YKS test solving
 * Features: pressure simulation, shape snapping (line / circle / rect / triangle / arrow / ellipse),
 * infinite canvas, multi-layer support, undo/redo, brush presets, and more.
 *
 * Inspired by: Microsoft Whiteboard, Procreate, Excalidraw
 * Built with: perfect-freehand style algorithm (embedded)
 */

'use strict';

/* ────────────────────────────────────────────────────────────────────────── */
/* PART 1 – CORE + PERFECT FREEHAND                                          */
/* ────────────────────────────────────────────────────────────────────────── */

(function () {

    // ═══════════════════════════════════════════════════════════════════════
    // PERFECT-FREEHAND STYLE IMPLEMENTATION (SHARED)
    // ═══════════════════════════════════════════════════════════════════════

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

    // Daha yumuşak, hisli çizgi için basınç simülasyonlu stroke üretici
    function getStroke(points, options = {}) {
        const {
            size = 16,
            thinning = 0.5,
            smoothing = 0.35,       // hafif smoothing
            streamline = 0.25,      // titreme azaltma düşürüldü
            easing = t => t,
            simulatePressure = true,
            start = {},
            end = {}
        } = options;

        if (!points || points.length === 0) return [];

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

                // streamline – çok sık nokta geliyorsa bazılarını at
                if (distance < minDistance && i !== points.length - 1) {
                    continue;
                }
            }

            strokePoints.push({
                point: [point[0], point[1]],
                pressure,
                distance: i > 0
                    ? Math.hypot(point[0] - prevPoint[0], point[1] - prevPoint[1])
                    : 0,
                runningLength
            });

            prevPoint = point;
        }

        if (strokePoints.length === 0) return [];

        // Tek nokta ise küçük bir daire gibi göster
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

            // Thinning ile incelik/kalınlık ayarı
            const radius = size * easing(0.5 - thinning * (0.5 - sp)) / 2;

            // Normale (dik vektör) ihtiyacımız var
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

        // Uçlardaki abartı “cap” noktaları yok – başlangıç boşluğu azalır
        return [...leftPoints, ...rightPoints.reverse()];
    }

    // Global export – Part 2 ve başka yerler buradan kullanıyor
    window.TestifyCanvasUtils = { getStroke, getSvgPathFromStroke };

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════

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

        // Kalınlık çarpanı
        STROKE_SIZE_MULTIPLIER: 1.5,

        // Perfect-freehand global seçenekler (fırçalara göre override ediliyor)
        STROKE_OPTIONS: {
            thinning: 0.6,
            smoothing: 0.35,   // titreme azaltma düşürüldü
            streamline: 0.25,  // daha az filtre
            simulatePressure: true,
            start: { cap: true, taper: 0 },
            end: { cap: true, taper: 0 }
        },

        // History
        MAX_HISTORY: 100,

        // Shape recognition
        SHAPE_RECOGNITION_THRESHOLD: 0.86,
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

        // Brush presets – PARAMETRELER ULTRA AYRI
        BRUSH_PRESETS: [
            {
                id: 'pen',
                name: 'Kalem',
                size: 5,
                thinning: 0.7,
                smoothing: 0.35,
                streamline: 0.2
            },
            {
                id: 'marker',
                name: 'Marker',
                size: 18,
                thinning: 0.15,
                smoothing: 0.45,
                streamline: 0.2
            },
            {
                id: 'highlighter',
                name: 'Fosforlu',
                size: 26,
                thinning: 0,
                smoothing: 0.7,
                streamline: 0.15,
                opacity: 0.35
            },
            {
                id: 'pencil',
                name: 'Kurşun Kalem',
                size: 3,
                thinning: 0.85,
                smoothing: 0.25,
                streamline: 0.15
            },
            {
                id: 'brush',
                name: 'Fırça',
                size: 12,
                thinning: 0.65,
                smoothing: 0.5,
                streamline: 0.25
            }
        ],

        // Storage
        STORAGE_KEY: 'testify.canvas.data',
        AUTOSAVE_INTERVAL: 30000
    };

    window.TestifyCanvasConfig = CONFIG;

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCED SHAPE RECOGNIZER (Line / Arrow / Circle / Ellipse / Rect / Square / Triangle)
    // ═══════════════════════════════════════════════════════════════════════

    const AdvancedShapeRecognizer = {
        config: {
            MIN_POINTS: 10,
            MIN_BBOX_SIZE: 30,
            LINE_STRAIGHTNESS: 0.9,     // çizgi için daha sıkı
            LINE_ASPECT_RATIO: 2.4,
            CIRCLE_UNIFORMITY: 0.85,    // daire için daha sıkı
            CIRCLE_CIRCULARITY: 0.78,
            CLOSED_SHAPE_RATIO: 0.3,
            CORNER_ANGLE_THRESHOLD: 0.5 // köşe tespiti daha seçici
        },

        recognize(points) {
            if (!points || points.length < this.config.MIN_POINTS) {
                return null;
            }

            const analysis = this.analyzeStroke(points);

            // Çok küçük şekilleri at
            if (
                analysis.bbox.width < this.config.MIN_BBOX_SIZE &&
                analysis.bbox.height < this.config.MIN_BBOX_SIZE
            ) {
                return null;
            }

            const isClosed = analysis.closedRatio < this.config.CLOSED_SHAPE_RATIO;

            if (!isClosed) {
                return this.recognizeOpenShape(points, analysis);
            } else {
                return this.recognizeClosedShape(points, analysis);
            }
        },

        analyzeStroke(points) {
            const xs = points.map(p => p[0]);
            const ys = points.map(p => p[1]);

            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);

            const width = maxX - minX;
            const height = maxY - minY;
            const diagonal = Math.hypot(width, height);

            const start = points[0];
            const end = points[points.length - 1];
            const closedDist = Math.hypot(end[0] - start[0], end[1] - start[1]);
            const closedRatio = diagonal > 0 ? closedDist / diagonal : 0;

            const perimeter = this.calculatePerimeter(points);
            const area = width * height || 1;
            const circularity = perimeter > 0 ? (4 * Math.PI * area) / (perimeter * perimeter) : 0;

            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;

            // Daire için radius uniformity
            const radii = points.map(p => Math.hypot(p[0] - cx, p[1] - cy));
            const avgRadius = radii.reduce((a, b) => a + b, 0) / radii.length;
            const radiusVariance =
                radii.reduce((sum, r) => sum + Math.pow(r - avgRadius, 2), 0) / radii.length;
            const radiusStdDev = Math.sqrt(radiusVariance);
            const radiusUniformity = avgRadius > 0 ? 1 - radiusStdDev / avgRadius : 0;

            const corners = this.findCorners(points);
            const aspectRatio = height > 0 ? width / height : 1;
            const straightness = this.calculateStraightness(points);

            return {
                bbox: { minX, maxX, minY, maxY, width, height, diagonal },
                center: { x: cx, y: cy },
                closedRatio,
                perimeter,
                circularity,
                avgRadius,
                radiusUniformity,
                corners,
                aspectRatio,
                straightness,
                start,
                end
            };
        },

        recognizeOpenShape(points, analysis) {
            const isLine = analysis.straightness > this.config.LINE_STRAIGHTNESS;
            const aspect = Math.max(analysis.aspectRatio, 1 / analysis.aspectRatio);
            const hasGoodAspect = aspect > this.config.LINE_ASPECT_RATIO;

            if (isLine && hasGoodAspect) {
                const isArrow = this.detectArrowHead(points);

                return {
                    type: isArrow ? 'arrow' : 'line',
                    confidence: analysis.straightness,
                    data: { start: analysis.start, end: analysis.end }
                };
            }

            return null;
        },

        recognizeClosedShape(points, analysis) {
            const bbox = analysis.bbox;
            const aspectRatio = analysis.aspectRatio;
            const radiusUniformity = analysis.radiusUniformity;
            const circularity = analysis.circularity;
            const corners = analysis.corners;

            // Daire / elips kontrolü
            const isCircular = radiusUniformity > this.config.CIRCLE_UNIFORMITY;
            const hasGoodCircularity = circularity > this.config.CIRCLE_CIRCULARITY;
            const isRoundish = aspectRatio > 0.7 && aspectRatio < 1.4;

            if (isCircular && hasGoodCircularity && isRoundish) {
                const isSquarish = aspectRatio > 0.9 && aspectRatio < 1.1;

                if (isSquarish) {
                    return {
                        type: 'circle',
                        confidence: (radiusUniformity + circularity) / 2,
                        data: { cx: analysis.center.x, cy: analysis.center.y, radius: analysis.avgRadius }
                    };
                } else {
                    return {
                        type: 'ellipse',
                        confidence: (radiusUniformity + circularity) / 2,
                        data: {
                            cx: analysis.center.x,
                            cy: analysis.center.y,
                            rx: bbox.width / 2,
                            ry: bbox.height / 2
                        }
                    };
                }
            }

            const cornerCount = corners.length;

            if (cornerCount === 3) {
                // üçgen sadece 3 net köşe varsa
                return {
                    type: 'triangle',
                    confidence: 0.9,
                    data: { vertices: this.extractTriangleVertices(corners, bbox) }
                };
            }

            if (cornerCount >= 4) {
                const isSquare = aspectRatio > 0.9 && aspectRatio < 1.1;

                return {
                    type: isSquare ? 'square' : 'rectangle',
                    confidence: 0.88,
                    data: { x: bbox.minX, y: bbox.minY, width: bbox.width, height: bbox.height }
                };
            }

            // Köşe yok ama kapalıysa: muhtemelen yuvarlatılmış dikdörtgen
            if (cornerCount < 3 && !isCircular) {
                const isRectangular = aspectRatio < 0.6 || aspectRatio > 1.4;
                if (isRectangular) {
                    return {
                        type: 'rectangle',
                        confidence: 0.8,
                        data: { x: bbox.minX, y: bbox.minY, width: bbox.width, height: bbox.height }
                    };
                }
            }

            return null;
        },

        calculateStraightness(points) {
            if (points.length < 3) return 1;

            const start = points[0];
            const end = points[points.length - 1];
            const lineLen = Math.hypot(end[0] - start[0], end[1] - start[1]);

            if (lineLen < 15) return 0;

            let maxDev = 0;
            for (let i = 1; i < points.length - 1; i++) {
                const dist = this.pointToLineDistance(points[i], start, end);
                if (dist > maxDev) maxDev = dist;
            }

            const ratio = maxDev / lineLen;
            return Math.max(0, Math.min(1, 1 - ratio * 2.5));
        },

        pointToLineDistance(point, lineStart, lineEnd) {
            const x0 = point[0],
                y0 = point[1];
            const x1 = lineStart[0],
                y1 = lineStart[1];
            const x2 = lineEnd[0],
                y2 = lineEnd[1];

            let A = x0 - x1,
                B = y0 - y1;
            let C = x2 - x1,
                D = y2 - y1;

            let dot = A * C + B * D;
            let lenSq = C * C + D * D;

            if (lenSq === 0) return Math.hypot(A, B);

            let t = Math.max(0, Math.min(1, dot / lenSq));
            const projX = x1 + t * C;
            const projY = y1 + t * D;

            return Math.hypot(x0 - projX, y0 - projY);
        },

        findCorners(points) {
            const windowSize = Math.max(3, Math.floor(points.length / 12));
            const minAngle = this.config.CORNER_ANGLE_THRESHOLD * Math.PI;
            const corners = [];
            const minDist = windowSize * 2.5;

            for (let i = windowSize; i < points.length - windowSize; i++) {
                const prev = points[i - windowSize];
                const curr = points[i];
                const next = points[i + windowSize];

                const v1x = curr[0] - prev[0];
                const v1y = curr[1] - prev[1];
                const v2x = next[0] - curr[0];
                const v2y = next[1] - curr[1];

                const dot = v1x * v2x + v1y * v2y;
                const cross = v1x * v2y - v1y * v2x;
                const angle = Math.abs(Math.atan2(cross, dot));

                if (angle > minAngle) {
                    let tooClose = false;
                    for (let j = 0; j < corners.length; j++) {
                        if (Math.hypot(corners[j][0] - curr[0], corners[j][1] - curr[1]) < minDist) {
                            tooClose = true;
                            break;
                        }
                    }

                    if (!tooClose) {
                        corners.push(curr);
                    }
                }
            }

            return corners;
        },

        detectArrowHead(points) {
            if (points.length < 12) return false;

            const checkLen = Math.max(6, Math.floor(points.length * 0.25));
            const endPoints = points.slice(-checkLen);
            const corners = this.findCorners(endPoints);

            return corners.length >= 1;
        },

        calculatePerimeter(points) {
            let perimeter = 0;
            for (let i = 1; i < points.length; i++) {
                perimeter += Math.hypot(
                    points[i][0] - points[i - 1][0],
                    points[i][1] - points[i - 1][1]
                );
            }
            perimeter += Math.hypot(
                points[0][0] - points[points.length - 1][0],
                points[0][1] - points[points.length - 1][1]
            );
            return perimeter;
        },

        extractTriangleVertices(corners, bbox) {
            if (corners.length >= 3) {
                return corners.slice(0, 3);
            }
            return [
                [(bbox.minX + bbox.maxX) / 2, bbox.minY],
                [bbox.maxX, bbox.maxY],
                [bbox.minX, bbox.maxY]
            ];
        },

        generateShapePoints(shape, originalPoints) {
            const pressure = 0.55;
            const result = [];

            const addPoint = (x, y) => result.push([x, y, pressure]);

            const addSegment = (x1, y1, x2, y2, segments = 10) => {
                for (let i = 0; i <= segments; i++) {
                    const t = i / segments;
                    addPoint(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
                }
            };

            switch (shape.type) {
                case 'line': {
                    const s = shape.data.start;
                    const e = shape.data.end;
                    addSegment(s[0], s[1], e[0], e[1], 16);
                    break;
                }
                case 'arrow': {
                    const s = shape.data.start;
                    const e = shape.data.end;

                    addSegment(s[0], s[1], e[0], e[1], 16);

                    const angle = Math.atan2(e[1] - s[1], e[0] - s[0]);
                    const headLen = 18;
                    const headAngle = Math.PI / 6;

                    addPoint(e[0], e[1]);
                    addPoint(
                        e[0] - headLen * Math.cos(angle - headAngle),
                        e[1] - headLen * Math.sin(angle - headAngle)
                    );
                    addPoint(e[0], e[1]);
                    addPoint(
                        e[0] - headLen * Math.cos(angle + headAngle),
                        e[1] - headLen * Math.sin(angle + headAngle)
                    );
                    break;
                }
                case 'circle': {
                    const { cx, cy, radius } = shape.data;
                    const segments = 48;
                    for (let i = 0; i <= segments; i++) {
                        const a = (i / segments) * Math.PI * 2;
                        addPoint(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
                    }
                    break;
                }
                case 'ellipse': {
                    const { cx, cy, rx, ry } = shape.data;
                    const segments = 48;
                    for (let i = 0; i <= segments; i++) {
                        const a = (i / segments) * Math.PI * 2;
                        addPoint(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry);
                    }
                    break;
                }
                case 'rectangle':
                case 'square': {
                    const { x, y, width, height } = shape.data;
                    const corners = [
                        [x, y],
                        [x + width, y],
                        [x + width, y + height],
                        [x, y + height],
                        [x, y]
                    ];
                    const segs = 8;
                    for (let i = 0; i < corners.length - 1; i++) {
                        const [x1, y1] = corners[i];
                        const [x2, y2] = corners[i + 1];
                        addSegment(x1, y1, x2, y2, segs);
                    }
                    break;
                }
                case 'triangle': {
                    const verts = shape.data.vertices;
                    const corners = [verts[0], verts[1], verts[2], verts[0]];
                    const segs = 12;
                    for (let i = 0; i < corners.length - 1; i++) {
                        const [x1, y1] = corners[i];
                        const [x2, y2] = corners[i + 1];
                        addSegment(x1, y1, x2, y2, segs);
                    }
                    break;
                }
                default:
                    return originalPoints;
            }

            return result;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // TOOLS ENUM
    // ═══════════════════════════════════════════════════════════════════════

    const TOOLS = {
        PEN: 'pen',
        ERASER: 'eraser',
        SELECT: 'select',
        PAN: 'pan',
        SHAPE: 'shape', // Akıllı şekil kalemi – çizerken shape snapping
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

    // ═══════════════════════════════════════════════════════════════════════
    // TESTIFY CANVAS CLASS – CORE
    // ═══════════════════════════════════════════════════════════════════════

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
            this.isErasing = false;
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

        // ═══════════════════════════════════════════════════════════════════
        // INITIALIZATION
        // ═══════════════════════════════════════════════════════════════════

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
            this.updateOpacityUI();
            this.updateZoomUI();
            this.updateStrokeCount();
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
                        <button class="canvas-btn" data-action="undo" title="Geri Al (Ctrl+Z)" disabled>
                            <i class="ph ph-arrow-counter-clockwise"></i>
                        </button>
                        <button class="canvas-btn" data-action="redo" title="İleri Al (Ctrl+Y)" disabled>
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
                        <!-- Şekil kalemi: Çizgiyi algılayıp line/circle/rect/triangle'a çevirir -->
                        <button class="tool-btn" data-tool="shape" data-tooltip="Akıllı Şekil Kalemi (S)">
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

            const gridHTML = `
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

        // ═══════════════════════════════════════════════════════════════════
        // EVENT LISTENERS
        // ═══════════════════════════════════════════════════════════════════

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
                btn.addEventListener('click', () => {
                    this.setTool(btn.dataset.tool);
                });
            });

            // Action buttons
            this.container.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
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
                    this.setSize(parseInt(e.target.value, 10));
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

        // ═══════════════════════════════════════════════════════════════════
        // POINTER HANDLERS
        // ═══════════════════════════════════════════════════════════════════

        handlePointerDown(e) {
            e.preventDefault();

            // Capture pointer
            if (e.pointerId !== undefined) {
                this.svg.setPointerCapture(e.pointerId);
            }

            const point = this.getPointerPosition(e);
            const pressure = e.pressure || 0.5;

            // Pan mode
            if (this.tool === TOOLS.PAN || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
                this.isPanning = true;
                this.lastPanPoint = { x: e.clientX, y: e.clientY };
                this.wrapper.classList.add('is-panning', 'is-dragging');
                return;
            }

            // Eraser
            if (this.tool === TOOLS.ERASER) {
                this.isErasing = true;
                this.updateEraserCursor(e.clientX, e.clientY);
                this.eraseAt(point.x, point.y);
                return;
            }

            // Çizim (hem PEN hem SHAPE kalemi burada çiziyor)
            if (this.tool === TOOLS.PEN || this.tool === TOOLS.SHAPE) {
                this.isDrawing = true;
                this.currentPoints = [[point.x, point.y, pressure]];
                this.currentStroke = this.createStrokePath();
                this.renderCurrentStroke();
            }
        }

        handlePointerMove(e) {
            const point = this.getPointerPosition(e);
            const pressure = e.pressure || 0.5;

            // Eraser cursor
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
            if (this.isDrawing && (this.tool === TOOLS.PEN || this.tool === TOOLS.SHAPE)) {
                this.currentPoints.push([point.x, point.y, pressure]);
                this.renderCurrentStroke();
            }
        }

        handlePointerUp(e) {
            // Release pointer
            if (e.pointerId !== undefined) {
                try {
                    this.svg.releasePointerCapture(e.pointerId);
                } catch (_) { /* ignore */ }
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

            if (this.isDrawing && (this.tool === TOOLS.PEN || this.tool === TOOLS.SHAPE)) {
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

        // ═══════════════════════════════════════════════════════════════════
        // DRAWING METHODS
        // ═══════════════════════════════════════════════════════════════════

        createStrokePath() {
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.classList.add('canvas-stroke-filled');
            path.style.fill = this.color;
            path.style.opacity = this.opacity;
            path.dataset.brush = this.brushPreset.id;

            // highlighter için blend mode
            if (this.brushPreset.id === 'highlighter') {
                path.style.mixBlendMode = 'multiply';
            } else {
                path.style.mixBlendMode = 'normal';
            }

            const contentGroup = this.svg.querySelector('#canvasContent');
            contentGroup.appendChild(path);

            return path;
        }

        renderCurrentStroke() {
            if (!this.currentStroke || this.currentPoints.length < 2) return;

            // ÖNEMLİ: slider boyutu en son override ediyor
            const strokeOptions = {
                ...CONFIG.STROKE_OPTIONS,
                ...this.brushPreset,
                size: this.size * CONFIG.STROKE_SIZE_MULTIPLIER
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
                points: this.currentPoints.slice(),
                color: this.color,
                size: this.size,
                opacity: this.opacity,
                brushPreset: this.brushPreset.id,
                timestamp: Date.now()
            };

            layer.strokes.push(strokeData);

            // Assign ID to path element
            this.currentStroke.dataset.strokeId = strokeData.id;

            // Akıllı şekil sadece SHAPE aracındayken devreye girsin
            if (this.tool === TOOLS.SHAPE) {
                this.tryRecognizeShape(strokeData);
            }

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
                const isNear = stroke.points.some(point => {
                    const dx = point[0] - x;
                    const dy = point[1] - y;
                    return Math.sqrt(dx * dx + dy * dy) < eraserSize;
                });

                if (isNear) {
                    const pathEl = this.svg.querySelector(`[data-stroke-id="${stroke.id}"]`);
                    if (pathEl) pathEl.remove();
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

        // ═══════════════════════════════════════════════════════════════════
        // SHAPE RECOGNITION + SNAP (UPGRADED)
        // ═══════════════════════════════════════════════════════════════════

        tryRecognizeShape(strokeData) {
            const pts = strokeData.points;
            if (!pts || pts.length < CONFIG.MIN_POINTS_FOR_SHAPE) return;

            // Gelişmiş algılayıcıyı kullan
            const result = AdvancedShapeRecognizer.recognize(pts);
            if (!result) return;

            // Güven eşiği
            const minConfidence = CONFIG.SHAPE_RECOGNITION_THRESHOLD || 0.75;
            if (result.confidence < minConfidence) return;

            // Yeni, düzgün shape noktalarını üret
            const newPoints = AdvancedShapeRecognizer.generateShapePoints(result, pts);
            if (!newPoints || newPoints.length < 2) return;

            // Çok minik şekilleri yine çöp say
            const xs = newPoints.map(p => p[0]);
            const ys = newPoints.map(p => p[1]);
            const minX = Math.min(...xs);
            const maxX = Math.max(...xs);
            const minY = Math.min(...ys);
            const maxY = Math.max(...ys);
            const width = maxX - minX;
            const height = maxY - minY;
            const MIN_BBOX = 24;

            if (width < MIN_BBOX && height < MIN_BBOX) return;

            // Stroke verisini güncelle
            strokeData.points = newPoints;
            strokeData.shapeType = result.type;

            // SVG path'i yeniden oluştur
            const pathEl = this.svg.querySelector(`[data-stroke-id="${strokeData.id}"]`);
            if (pathEl) {
                const preset =
                    CONFIG.BRUSH_PRESETS.find(p => p.id === strokeData.brushPreset) ||
                    CONFIG.BRUSH_PRESETS[0];

                const strokeOptions = {
                    ...CONFIG.STROKE_OPTIONS,
                    ...preset,
                    size: strokeData.size * CONFIG.STROKE_SIZE_MULTIPLIER
                };

                const outlinePoints = getStroke(strokeData.points, strokeOptions);
                const pathData = getSvgPathFromStroke(outlinePoints);
                pathEl.setAttribute('d', pathData);
            }

            // Hint'i şeklin üstüne koy
            const centerX = (minX + maxX) / 2;
            const hintY = minY - 20;
            this.showShapeHint(result.type, centerX, hintY);
        }

        // (Eski yardımcı fonksiyonlar kalabilir, kullanılmıyor ama zararı yok)
        getLineStraightnessScore(points) {
            const p0 = points[0];
            const p1 = points[points.length - 1];
            const lineLen = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]) || 1;

            let maxDev = 0;
            for (let i = 1; i < points.length - 1; i++) {
                const p = points[i];
                const dev = this.pointToLineDistance(p, p0, p1);
                if (dev > maxDev) maxDev = dev;
            }
            const ratio = maxDev / lineLen;
            return Math.max(0, Math.min(1, 1 - ratio));
        }

        pointToLineDistance(p, a, b) {
            const [x0, y0] = p;
            const [x1, y1] = a;
            const [x2, y2] = b;
            const A = x0 - x1;
            const B = y0 - y1;
            const C = x2 - x1;
            const D = y2 - y1;
            const dot = A * C + B * D;
            const lenSq = C * C + D * D || 1;
            const param = dot / lenSq;
            let xx, yy;
            if (param < 0) {
                xx = x1; yy = y1;
            } else if (param > 1) {
                xx = x2; yy = y2;
            } else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }
            return Math.hypot(x0 - xx, y0 - yy);
        }

        buildShapePoints(shape, meta, originalPoints) {
            // Artık AdvancedShapeRecognizer.generateShapePoints kullanılıyor.
            // Bu fonksiyon yedek dursun.
            return originalPoints;
        }

        calculatePerimeter(points) {
            let perimeter = 0;
            for (let i = 1; i < points.length; i++) {
                perimeter += Math.hypot(
                    points[i][0] - points[i - 1][0],
                    points[i][1] - points[i - 1][1]
                );
            }
            return perimeter;
        }

        findCorners(points, threshold = 0.25) {
            const corners = [];
            const windowSize = Math.max(2, Math.floor(points.length / 12));

            for (let i = windowSize; i < points.length - windowSize; i++) {
                const prev = points[i - windowSize];
                const curr = points[i];
                const next = points[i + windowSize];

                const v1 = [curr[0] - prev[0], curr[1] - prev[1]];
                const v2 = [next[0] - curr[0], next[1] - curr[1]];

                const dot = v1[0] * v2[0] + v1[1] * v2[1];
                const len1 = Math.hypot(v1[0], v1[1]) || 1;
                const len2 = Math.hypot(v2[0], v2[1]) || 1;
                const cos = dot / (len1 * len2);

                if (Math.abs(cos) < threshold) {
                    corners.push(curr);
                }
            }
            return corners;
        }

        showShapeHint(shape, x, y) {
            const hint = this.container.querySelector('#shapeHint');
            if (!hint) return;

            const shapeNames = {
                line: 'Çizgiye dönüştürüldü',
                arrow: 'Oka dönüştürüldü',
                circle: 'Daireye dönüştürüldü',
                ellipse: 'Elipse dönüştürüldü',
                square: 'Kareye dönüştürüldü',
                rectangle: 'Dikdörtgene dönüştürüldü',
                triangle: 'Üçgene dönüştürüldü'
            };

            hint.textContent = shapeNames[shape] || shape;
            hint.style.left = x + 'px';
            hint.style.top = y + 'px';
            hint.classList.add('is-visible');

            setTimeout(() => {
                hint.classList.remove('is-visible');
            }, 1600);
        }

        // ═══════════════════════════════════════════════════════════════════
        // UTILITY METHODS
        // ═══════════════════════════════════════════════════════════════════

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
    }

    // Store class for global access
    window.TestifyCanvasClass = TestifyCanvas;

})();

/* ────────────────────────────────────────────────────────────────────────── */
/* PART 2 – UI, HISTORY, STORAGE, EXPORT & GLOBAL API                        */
/* ────────────────────────────────────────────────────────────────────────── */

(function () {

    const TestifyCanvas = window.TestifyCanvasClass;
    if (!TestifyCanvas) {
        console.error('[TestifyCanvas] Core module not loaded!');
        return;
    }

    const { getStroke, getSvgPathFromStroke } = window.TestifyCanvasUtils;
    const CONFIG = window.TestifyCanvasConfig;

    const TOOLS = {
        PEN: 'pen',
        ERASER: 'eraser',
        SELECT: 'select',
        PAN: 'pan',
        SHAPE: 'shape',
        TEXT: 'text',
        LASER: 'laser'
    };

    Object.assign(TestifyCanvas.prototype, {

        // ═══════════════════════════════════════════════════════════════════
        // TOOL MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════

        setTool(tool) {
            this.tool = tool;
            this.updateToolUI();

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

        // ═══════════════════════════════════════════════════════════════════
        // COLOR MANAGEMENT
        // ═══════════════════════════════════════════════════════════════════

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

        // ═══════════════════════════════════════════════════════════════════
        // SIZE & OPACITY
        // ═══════════════════════════════════════════════════════════════════

        setSize(size) {
            this.size = Math.max(CONFIG.MIN_SIZE, Math.min(CONFIG.MAX_SIZE, size));
            this.updateBrushUI();
            this.updateBrushPreview();
        },

        setOpacity(opacity) {
            this.opacity = Math.max(0.1, Math.min(1, opacity));
            this.updateOpacityUI();
            this.updateBrushPreview();
        },

        updateBrushUI() {
            const slider = this.container.querySelector('.brush-size-slider');
            const value = this.container.querySelector('.brush-size-value');

            if (slider) slider.value = this.size;
            if (value) value.textContent = this.size + 'px';
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

        // ═══════════════════════════════════════════════════════════════════
        // BRUSH PRESETS
        // ═══════════════════════════════════════════════════════════════════

        setBrushPreset(presetId) {
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
            this.updateBrushPreview();
        },

        updatePresetUI() {
            this.container.querySelectorAll('.brush-preset').forEach(btn => {
                btn.classList.toggle('is-active', btn.dataset.preset === this.brushPreset.id);
            });
        },

        // ═══════════════════════════════════════════════════════════════════
        // ZOOM
        // ═══════════════════════════════════════════════════════════════════

        zoomIn() {
            this.zoom = Math.min(CONFIG.MAX_ZOOM, this.zoom + CONFIG.ZOOM_STEP);
            this.updateViewBox();
            this.updateZoomUI();
        },

        zoomOut() {
            this.zoom = Math.max(CONFIG.MIN_ZOOM, this.zoom - CONFIG.ZOOM_STEP);
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

        // ═══════════════════════════════════════════════════════════════════
        // STROKE COUNT
        // ═══════════════════════════════════════════════════════════════════

        updateStrokeCount() {
            const count = this.getTotalStrokeCount();
            const el = this.container.querySelector('#strokeCount');
            if (el) {
                el.textContent = count + ' çizgi';
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        // HISTORY
        // ═══════════════════════════════════════════════════════════════════

        saveHistory() {
            // Remove any redo states
            this.history = this.history.slice(0, this.historyIndex + 1);

            const snapshot = JSON.parse(JSON.stringify(this.layers));
            this.history.push(snapshot);

            if (this.history.length > CONFIG.MAX_HISTORY) {
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

            const contentGroup = this.svg.querySelector('#canvasContent');
            contentGroup.querySelectorAll('path[data-stroke-id]').forEach(el => el.remove());

            this.layers = JSON.parse(JSON.stringify(snapshot));

            this.renderAllStrokes();
            this.updateStrokeCount();
        },

        updateHistoryButtons() {
            const undoBtn = this.container.querySelector('[data-action="undo"]');
            const redoBtn = this.container.querySelector('[data-action="redo"]');

            if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
            if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
        },

        // ═══════════════════════════════════════════════════════════════════
        // RENDERING
        // ═══════════════════════════════════════════════════════════════════

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
            const preset = CONFIG.BRUSH_PRESETS.find(p => p.id === strokeData.brushPreset) || CONFIG.BRUSH_PRESETS[0];

            const strokeOptions = {
                ...CONFIG.STROKE_OPTIONS,
                ...preset,
                size: strokeData.size * CONFIG.STROKE_SIZE_MULTIPLIER
            };

            const outlinePoints = getStroke(strokeData.points, strokeOptions);
            const pathData = getSvgPathFromStroke(outlinePoints);

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.classList.add('canvas-stroke-filled');
            path.setAttribute('d', pathData);
            path.style.fill = strokeData.color;
            path.style.opacity = strokeData.opacity;
            path.dataset.strokeId = strokeData.id;
            path.dataset.brush = strokeData.brushPreset;

            if (strokeData.brushPreset === 'highlighter') {
                path.style.mixBlendMode = 'multiply';
            } else {
                path.style.mixBlendMode = 'normal';
            }

            parent.appendChild(path);
        },

        // ═══════════════════════════════════════════════════════════════════
        // CLEAR
        // ═══════════════════════════════════════════════════════════════════

        clear() {
            if (this.getTotalStrokeCount() > 0) {
                if (!confirm('Tüm çizimler silinecek. Emin misiniz?')) {
                    return;
                }
            }

            const contentGroup = this.svg.querySelector('#canvasContent');
            contentGroup.querySelectorAll('path[data-stroke-id]').forEach(el => el.remove());

            this.layers.forEach(layer => {
                layer.strokes = [];
            });

            this.saveHistory();
            this.updateStrokeCount();

            if (window.Utils && typeof Utils.showToast === 'function') {
                Utils.showToast('Çizim alanı temizlendi', 'info');
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        // STORAGE
        // ═══════════════════════════════════════════════════════════════════

        saveToStorage() {
            try {
                const data = {
                    layers: this.layers,
                    zoom: this.zoom,
                    panX: this.panX,
                    panY: this.panY,
                    lastSaved: Date.now()
                };

                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));

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
                const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
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

                this.renderAllStrokes();
                this.updateViewBox();
                this.updateZoomUI();
                this.updateStrokeCount();

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

        // ═══════════════════════════════════════════════════════════════════
        // EXPORT
        // ═══════════════════════════════════════════════════════════════════

        async exportToPNG() {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = 1920;
                canvas.height = 1080;

                const theme = document.documentElement.getAttribute('data-theme');
                ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const svgData = new XMLSerializer().serializeToString(this.svg);
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);

                const img = new Image();

                return new Promise((resolve, reject) => {
                    img.onload = () => {
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        URL.revokeObjectURL(url);

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

        // ═══════════════════════════════════════════════════════════════════
        // ACTION HANDLER
        // ═══════════════════════════════════════════════════════════════════

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

        // ═══════════════════════════════════════════════════════════════════
        // GRID TOGGLE
        // ═══════════════════════════════════════════════════════════════════

        toggleGrid() {
            if (this.gridEl) {
                this.gridEl.classList.toggle('is-hidden');
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        // OPEN / CLOSE / MINIMIZE
        // ═══════════════════════════════════════════════════════════════════

        open() {
            this.container.classList.add('is-open');
            this.isOpen = true;
            if (this.options.mode === 'fullscreen') {
                document.body.style.overflow = 'hidden';
            }
        },

        close() {
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

        // ═══════════════════════════════════════════════════════════════════
        // DESTROY
        // ═══════════════════════════════════════════════════════════════════

        destroy() {
            this.removeEventListeners();
            this.container.remove();
        },

        // ═══════════════════════════════════════════════════════════════════
        // QUIZ IMAGE DATA
        // ═══════════════════════════════════════════════════════════════════

        getImageData() {
            const svgData = new XMLSerializer().serializeToString(this.svg);
            const base64 = btoa(unescape(encodeURIComponent(svgData)));
            return 'data:image/svg+xml;base64,' + base64;
        },

        hasDrawings() {
            return this.getTotalStrokeCount() > 0;
        }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // GLOBAL API
    // ═══════════════════════════════════════════════════════════════════════

    let globalInstance = null;

    window.TestifyCanvas = {
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

        createEmbedded(container, options = {}) {
            return new TestifyCanvas({
                container,
                mode: 'quiz',
                ...options
            });
        },

        getInstance() {
            return globalInstance;
        },

        close() {
            if (globalInstance) {
                globalInstance.close();
            }
        },

        isOpen() {
            return globalInstance && globalInstance.isOpen;
        }
    };

    console.log('[TestifyCanvas] System loaded and ready');

})();

/* ────────────────────────────────────────────────────────────────────────── */
/* PART 3 – QUIZ CANVAS INTEGRATION                                          */
/* ────────────────────────────────────────────────────────────────────────── */

(function () {

    const QuizCanvasManager = {
        canvasInstances: new Map(),
        isEnabled: true,

        initForQuestion(questionId, container) {
            if (!this.isEnabled || !container) return null;

            if (!window.TestifyCanvas) {
                console.warn('[QuizCanvasManager] TestifyCanvas not loaded');
                return null;
            }

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

            const embedContainer = canvasContainer.querySelector('.quiz-canvas-embed');

            const canvas = TestifyCanvas.createEmbedded(embedContainer, {
                onSave: (layers) => {
                    this.saveDrawingForQuestion(questionId, layers);
                }
            });

            this.canvasInstances.set(questionId, {
                canvas,
                container: canvasContainer,
                isExpanded: false,
                isCollapsed: false
            });

            this.attachQuizCanvasActions(questionId, canvasContainer);

            return canvas;
        },

        attachQuizCanvasActions(questionId, container) {
            const instance = this.canvasInstances.get(questionId);
            if (!instance) return;

            container.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;

                    switch (action) {
                        case 'clear':
                            if (instance.canvas) instance.canvas.clear();
                            break;

                        case 'undo':
                            if (instance.canvas) instance.canvas.undo();
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

        toggleExpand(questionId) {
            const instance = this.canvasInstances.get(questionId);
            if (!instance) return;

            instance.isExpanded = !instance.isExpanded;
            instance.container.classList.toggle('is-expanded', instance.isExpanded);

            const btn = instance.container.querySelector('[data-action="expand"]');
            if (btn) {
                btn.querySelector('i').className = instance.isExpanded
                    ? 'ph ph-arrows-in'
                    : 'ph ph-arrows-out';
            }
        },

        toggleCollapse(questionId) {
            const instance = this.canvasInstances.get(questionId);
            if (!instance) return;

            instance.isCollapsed = !instance.isCollapsed;
            instance.container.classList.toggle('is-collapsed', instance.isCollapsed);

            const btn = instance.container.querySelector('[data-action="toggle"]');
            if (btn) {
                btn.querySelector('i').className = instance.isCollapsed
                    ? 'ph ph-caret-up'
                    : 'ph ph-caret-down';
            }
        },

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

        getCanvas(questionId) {
            const instance = this.canvasInstances.get(questionId);
            return instance ? instance.canvas : null;
        },

        hasDrawings(questionId) {
            const instance = this.canvasInstances.get(questionId);
            return instance && instance.canvas && instance.canvas.hasDrawings();
        },

        getImageData(questionId) {
            const instance = this.canvasInstances.get(questionId);
            if (instance && instance.canvas) {
                return instance.canvas.getImageData();
            }
            return null;
        },

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

        destroyAll() {
            this.canvasInstances.forEach((_instance, questionId) => {
                this.destroyForQuestion(questionId);
            });
        },

        setEnabled(enabled) {
            this.isEnabled = enabled;
        }
    };

    // Styles (senin CSS dosyan zaten var, bu kısım aynı kalabilir)
    const styles = `
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
[data-theme="dark"] .quiz-canvas-body {
    background: var(--bg-primary);
}
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

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // QUIZ MANAGER INTEGRATION
    function integrateWithQuizManager() {
        if (!window.QuizManager) {
            setTimeout(integrateWithQuizManager, 100);
            return;
        }

        const originalDisplayQuestion = QuizManager.displayQuestion.bind(QuizManager);

        QuizManager.displayQuestion = function () {
            originalDisplayQuestion();

            const question = this.state.questions[this.state.currentIndex];
            if (!question) return;

            const questionId = question.id || `q_${this.state.currentIndex}`;

            const questionCard = document.querySelector('.question-card');
            if (!questionCard) return;

            const existingWrapper = questionCard.querySelector('.quiz-canvas-wrapper');
            if (existingWrapper) {
                existingWrapper.remove();
            }

            QuizCanvasManager.initForQuestion(questionId, questionCard);
        };

        const originalCleanup = QuizManager.cleanupPreviousQuiz.bind(QuizManager);

        QuizManager.cleanupPreviousQuiz = function () {
            originalCleanup();
            QuizCanvasManager.destroyAll();
        };

        console.log('[QuizCanvasManager] Integrated with QuizManager');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', integrateWithQuizManager);
    } else {
        integrateWithQuizManager();
    }

    window.QuizCanvasManager = QuizCanvasManager;

})();
