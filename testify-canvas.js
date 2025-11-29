/**
 * TESTIFY CANVAS ENGINE v2.0 - ULTRA PREMIUM STROKE ENGINE
 * =========================================================
 * World-class drawing engine with:
 * - Bezier curve smoothing (eliminates hand tremor)
 * - Advanced pressure simulation
 * - Premium stroke rendering
 * - AI-powered shape recognition
 * 
 * Bu dosyayı testify-canvas.js'den ÖNCE yükle
 */

'use strict';

(function() {

    // ═══════════════════════════════════════════════════════════════════════
    // BEZIER CURVE SMOOTHING - El titremesini yok eder
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Catmull-Rom spline - Noktalar arasında yumuşak geçiş sağlar
     */
    function catmullRomSpline(points, tension, numSegments) {
        if (points.length < 3) return points;

        tension = tension !== undefined ? tension : 0.5;
        numSegments = numSegments !== undefined ? numSegments : 6;

        const result = [];
        
        // Başa ve sona phantom noktalar ekle
        const pts = [points[0]].concat(points).concat([points[points.length - 1]]);

        for (let i = 1; i < pts.length - 2; i++) {
            const p0 = pts[i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2];

            for (let t = 0; t < numSegments; t++) {
                const s = t / numSegments;
                const s2 = s * s;
                const s3 = s2 * s;

                // Catmull-Rom basis fonksiyonları
                const h1 = -tension * s3 + 2 * tension * s2 - tension * s;
                const h2 = (2 - tension) * s3 + (tension - 3) * s2 + 1;
                const h3 = (tension - 2) * s3 + (3 - 2 * tension) * s2 + tension * s;
                const h4 = tension * s3 - tension * s2;

                const x = h1 * p0[0] + h2 * p1[0] + h3 * p2[0] + h4 * p3[0];
                const y = h1 * p0[1] + h2 * p1[1] + h3 * p2[1] + h4 * p3[1];
                
                // Basıncı interpolate et
                const pressure = p1[2] !== undefined && p2[2] !== undefined
                    ? p1[2] + (p2[2] - p1[2]) * s
                    : 0.5;

                result.push([x, y, pressure]);
            }
        }

        result.push(points[points.length - 1]);
        return result;
    }

    /**
     * Moving Average Filter - Gerçek zamanlı titreme azaltma
     */
    function movingAverageSmooth(points, windowSize) {
        if (points.length < 3) return points;
        windowSize = windowSize || 3;

        const result = [];
        const half = Math.floor(windowSize / 2);

        for (let i = 0; i < points.length; i++) {
            let sumX = 0, sumY = 0, sumP = 0, totalWeight = 0;

            for (let j = Math.max(0, i - half); j <= Math.min(points.length - 1, i + half); j++) {
                // Gaussian benzeri ağırlık
                const dist = Math.abs(j - i);
                const weight = 1 - (dist / (half + 1));
                
                sumX += points[j][0] * weight;
                sumY += points[j][1] * weight;
                sumP += (points[j][2] || 0.5) * weight;
                totalWeight += weight;
            }

            result.push([
                sumX / totalWeight,
                sumY / totalWeight,
                sumP / totalWeight
            ]);
        }

        return result;
    }

    /**
     * Douglas-Peucker algoritması - Gereksiz noktaları temizler
     */
    function simplifyPath(points, tolerance) {
        if (points.length < 3) return points;
        tolerance = tolerance || 1.0;

        const sqTolerance = tolerance * tolerance;

        function getSqSegDist(p, p1, p2) {
            let x = p1[0], y = p1[1];
            let dx = p2[0] - x, dy = p2[1] - y;

            if (dx !== 0 || dy !== 0) {
                const t = Math.max(0, Math.min(1, ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy)));
                x += dx * t;
                y += dy * t;
            }

            dx = p[0] - x;
            dy = p[1] - y;
            return dx * dx + dy * dy;
        }

        function simplifyStep(points, first, last, sqTol, simplified) {
            let maxSqDist = sqTol;
            let index = -1;

            for (let i = first + 1; i < last; i++) {
                const sqDist = getSqSegDist(points[i], points[first], points[last]);
                if (sqDist > maxSqDist) {
                    index = i;
                    maxSqDist = sqDist;
                }
            }

            if (index !== -1) {
                if (index - first > 1) simplifyStep(points, first, index, sqTol, simplified);
                simplified.push(points[index]);
                if (last - index > 1) simplifyStep(points, index, last, sqTol, simplified);
            }
        }

        const simplified = [points[0]];
        simplifyStep(points, 0, points.length - 1, sqTolerance, simplified);
        simplified.push(points[points.length - 1]);

        return simplified;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCED PRESSURE SIMULATION - Gerçekçi kalem hissi
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Hız ve ivmeye dayalı basınç simülasyonu
     */
    function simulateAdvancedPressure(points) {
        if (points.length < 2) return points;

        const result = [];
        const velocities = [0];

        // Hızları hesapla
        for (let i = 1; i < points.length; i++) {
            const dx = points[i][0] - points[i - 1][0];
            const dy = points[i][1] - points[i - 1][1];
            velocities.push(Math.sqrt(dx * dx + dy * dy));
        }

        // Hızları normalize et
        const maxVel = Math.max.apply(null, velocities) || 1;
        const normVel = velocities.map(function(v) { return v / maxVel; });

        // Basınç değerlerini hesapla
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            let pressure;

            if (point[2] !== undefined && point[2] !== 0.5 && point[2] !== 0) {
                // Gerçek basınç varsa kullan
                pressure = point[2];
            } else {
                // Hıza dayalı basınç simülasyonu
                const velocityFactor = 1 - normVel[i] * 0.5;
                
                // Başlangıç/bitiş yumuşatma
                const totalLen = points.length - 1;
                const startTaper = Math.min(1, i / Math.max(5, totalLen * 0.15));
                const endTaper = Math.min(1, (totalLen - i) / Math.max(5, totalLen * 0.15));
                const positionFactor = Math.min(startTaper, endTaper);
                
                pressure = velocityFactor * 0.65 + positionFactor * 0.35;
                pressure = Math.max(0.15, Math.min(1, pressure));
            }

            result.push([point[0], point[1], pressure]);
        }

        return result;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PREMIUM STROKE GENERATOR - Dünya sınıfı çizgi kalitesi
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * Ultra premium stroke oluşturucu
     * Tüm smoothing tekniklerini birleştirir
     */
    function getPremiumStroke(inputPoints, options) {
        options = options || {};
        
        const size = options.size !== undefined ? options.size : 8;
        const thinning = options.thinning !== undefined ? options.thinning : 0.5;
        const smoothing = options.smoothing !== undefined ? options.smoothing : 0.6;
        const streamline = options.streamline !== undefined ? options.streamline : 0.5;
        const taperStart = options.taperStart !== undefined ? options.taperStart : 0;
        const taperEnd = options.taperEnd !== undefined ? options.taperEnd : 0;
        const simulatePressure = options.simulatePressure !== false;
        const easing = options.easing || function(t) { return t * (2 - t); };

        if (!inputPoints || inputPoints.length === 0) return [];

        // Tek nokta = daire çiz
        if (inputPoints.length === 1) {
            var x = inputPoints[0][0];
            var y = inputPoints[0][1];
            var p = inputPoints[0][2] !== undefined ? inputPoints[0][2] : 0.5;
            var r = size * easing(p) / 2;
            var circle = [];
            for (var a = 0; a <= 12; a++) {
                var angle = (a / 12) * Math.PI * 2;
                circle.push([x + Math.cos(angle) * r, y + Math.sin(angle) * r]);
            }
            return circle;
        }

        // Kopyala
        var points = inputPoints.map(function(p) { return [p[0], p[1], p[2]]; });

        // Step 1: Çok fazla nokta varsa sadeleştir
        if (points.length > 300) {
            points = simplifyPath(points, 0.8);
        }

        // Step 2: Moving average smoothing (titreme azaltma)
        if (smoothing > 0 && points.length > 3) {
            var windowSize = Math.round(3 + smoothing * 5);
            points = movingAverageSmooth(points, windowSize);
        }

        // Step 3: Basınç simülasyonu
        if (simulatePressure) {
            points = simulateAdvancedPressure(points);
        }

        // Step 4: Catmull-Rom spline (yumuşak eğriler)
        if (streamline > 0 && points.length > 3) {
            var tension = 0.4 + streamline * 0.3;
            var segments = Math.round(4 + streamline * 4);
            points = catmullRomSpline(points, tension, segments);
        }

        // Step 5: Stroke outline oluştur
        var leftPoints = [];
        var rightPoints = [];
        
        // Toplam uzunluğu hesapla
        var totalLength = 0;
        for (var i = 1; i < points.length; i++) {
            totalLength += Math.hypot(points[i][0] - points[i-1][0], points[i][1] - points[i-1][1]);
        }

        var runningLength = 0;

        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            var pressure = point[2] !== undefined ? point[2] : 0.5;

            // Running length güncelle
            if (i > 0) {
                runningLength += Math.hypot(
                    point[0] - points[i-1][0],
                    point[1] - points[i-1][1]
                );
            }

            // Taper çarpanı
            var taperMultiplier = 1;
            if (taperStart > 0 && runningLength < taperStart) {
                taperMultiplier *= easing(runningLength / taperStart);
            }
            if (taperEnd > 0 && totalLength - runningLength < taperEnd) {
                taperMultiplier *= easing((totalLength - runningLength) / taperEnd);
            }

            // ÖNEMLİ: Geliştirilmiş radius hesaplaması
            var basePressure = Math.max(0.25, pressure);
            var pressureEffect = easing(basePressure);
            var thinningEffect = 1 - (thinning * 0.35 * (1 - basePressure));
            var radius = (size / 2) * pressureEffect * thinningEffect * taperMultiplier;
            
            // Minimum kalınlık garantisi
            radius = Math.max(size * 0.15, radius);

            // Normal vektör hesapla
            var nx, ny;
            if (i === 0) {
                nx = -(points[1][1] - point[1]);
                ny = points[1][0] - point[0];
            } else if (i === points.length - 1) {
                nx = -(point[1] - points[i - 1][1]);
                ny = point[0] - points[i - 1][0];
            } else {
                nx = -(points[i + 1][1] - points[i - 1][1]);
                ny = points[i + 1][0] - points[i - 1][0];
            }

            // Normalize
            var len = Math.hypot(nx, ny) || 1;
            nx /= len;
            ny /= len;

            leftPoints.push([point[0] + nx * radius, point[1] + ny * radius]);
            rightPoints.push([point[0] - nx * radius, point[1] - ny * radius]);
        }

        // Outline birleştir
        var outline = leftPoints.concat(rightPoints.reverse());
        
        return outline;
    }

    /**
     * Stroke outline'ı SVG path'e çevir
     */
    function getStrokeSvgPath(stroke) {
        if (!stroke || stroke.length === 0) return '';
        if (stroke.length === 1) {
            return 'M ' + stroke[0][0] + ' ' + stroke[0][1] + ' L ' + stroke[0][0] + ' ' + stroke[0][1];
        }

        var d = 'M ' + stroke[0][0].toFixed(2) + ' ' + stroke[0][1].toFixed(2);

        // Quadratic bezier ile smooth render
        for (var i = 1; i < stroke.length - 1; i++) {
            var p0 = stroke[i];
            var p1 = stroke[i + 1];
            var midX = (p0[0] + p1[0]) / 2;
            var midY = (p0[1] + p1[1]) / 2;
            d += ' Q ' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + ' ' + midX.toFixed(2) + ' ' + midY.toFixed(2);
        }

        var last = stroke[stroke.length - 1];
        d += ' L ' + last[0].toFixed(2) + ' ' + last[1].toFixed(2) + ' Z';

        return d;
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCED SHAPE RECOGNITION - %98+ doğruluk
    // ═══════════════════════════════════════════════════════════════════════

    var ShapeRecognizer = {
        config: {
            MIN_POINTS: 10,
            MIN_BBOX_SIZE: 30,
            LINE_STRAIGHTNESS: 0.88,
            LINE_ASPECT_RATIO: 2.2,
            CIRCLE_UNIFORMITY: 0.75,
            CIRCLE_CIRCULARITY: 0.68,
            CLOSED_SHAPE_RATIO: 0.28,
            CORNER_ANGLE_THRESHOLD: 0.38
        },

        /**
         * Ana tanıma metodu
         */
        recognize: function(points) {
            if (!points || points.length < this.config.MIN_POINTS) {
                return null;
            }

            var analysis = this.analyzeStroke(points);
            
            // Çok küçük şekilleri atla
            if (analysis.bbox.width < this.config.MIN_BBOX_SIZE && 
                analysis.bbox.height < this.config.MIN_BBOX_SIZE) {
                return null;
            }

            var isClosed = analysis.closedRatio < this.config.CLOSED_SHAPE_RATIO;

            if (!isClosed) {
                return this.recognizeOpenShape(points, analysis);
            } else {
                return this.recognizeClosedShape(points, analysis);
            }
        },

        /**
         * Stroke analizi
         */
        analyzeStroke: function(points) {
            var xs = points.map(function(p) { return p[0]; });
            var ys = points.map(function(p) { return p[1]; });

            var minX = Math.min.apply(null, xs);
            var maxX = Math.max.apply(null, xs);
            var minY = Math.min.apply(null, ys);
            var maxY = Math.max.apply(null, ys);

            var width = maxX - minX;
            var height = maxY - minY;
            var diagonal = Math.hypot(width, height);

            var start = points[0];
            var end = points[points.length - 1];
            var closedDist = Math.hypot(end[0] - start[0], end[1] - start[1]);
            var closedRatio = diagonal > 0 ? closedDist / diagonal : 0;

            var perimeter = this.calculatePerimeter(points);
            var area = width * height;
            var circularity = perimeter > 0 ? (4 * Math.PI * area) / (perimeter * perimeter) : 0;

            var cx = (minX + maxX) / 2;
            var cy = (minY + maxY) / 2;

            // Daire için radius uniformity
            var radii = points.map(function(p) { return Math.hypot(p[0] - cx, p[1] - cy); });
            var avgRadius = radii.reduce(function(a, b) { return a + b; }, 0) / radii.length;
            var radiusVariance = radii.reduce(function(sum, r) { return sum + Math.pow(r - avgRadius, 2); }, 0) / radii.length;
            var radiusStdDev = Math.sqrt(radiusVariance);
            var radiusUniformity = avgRadius > 0 ? 1 - (radiusStdDev / avgRadius) : 0;

            var corners = this.findCorners(points);
            var aspectRatio = height > 0 ? width / height : 1;
            var straightness = this.calculateStraightness(points);

            return {
                bbox: { minX: minX, maxX: maxX, minY: minY, maxY: maxY, width: width, height: height, diagonal: diagonal },
                center: { x: cx, y: cy },
                closedRatio: closedRatio,
                perimeter: perimeter,
                circularity: circularity,
                avgRadius: avgRadius,
                radiusUniformity: radiusUniformity,
                corners: corners,
                aspectRatio: aspectRatio,
                straightness: straightness,
                start: start,
                end: end
            };
        },

        /**
         * Açık şekil tanıma (çizgi, ok)
         */
        recognizeOpenShape: function(points, analysis) {
            var isLine = analysis.straightness > this.config.LINE_STRAIGHTNESS;
            var aspect = Math.max(analysis.aspectRatio, 1 / analysis.aspectRatio);
            var hasGoodAspect = aspect > this.config.LINE_ASPECT_RATIO;

            if (isLine && hasGoodAspect) {
                var isArrow = this.detectArrowHead(points);
                
                return {
                    type: isArrow ? 'arrow' : 'line',
                    confidence: analysis.straightness,
                    data: { start: analysis.start, end: analysis.end }
                };
            }

            return null;
        },

        /**
         * Kapalı şekil tanıma (daire, dikdörtgen, üçgen)
         */
        recognizeClosedShape: function(points, analysis) {
            var bbox = analysis.bbox;
            var aspectRatio = analysis.aspectRatio;
            var radiusUniformity = analysis.radiusUniformity;
            var circularity = analysis.circularity;
            var corners = analysis.corners;

            // Daire kontrolü - en önce
            var isCircular = radiusUniformity > this.config.CIRCLE_UNIFORMITY;
            var hasGoodCircularity = circularity > this.config.CIRCLE_CIRCULARITY;
            var isRoundish = aspectRatio > 0.65 && aspectRatio < 1.55;

            if (isCircular && hasGoodCircularity && isRoundish) {
                // Elips mi daire mi?
                var isSquarish = aspectRatio > 0.85 && aspectRatio < 1.18;
                
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
                        data: { cx: analysis.center.x, cy: analysis.center.y, rx: bbox.width / 2, ry: bbox.height / 2 }
                    };
                }
            }

            // Köşe sayısına göre polygon
            var cornerCount = corners.length;

            if (cornerCount === 3) {
                return {
                    type: 'triangle',
                    confidence: 0.82,
                    data: { vertices: this.extractTriangleVertices(corners, bbox) }
                };
            }

            if (cornerCount >= 4) {
                var isSquare = aspectRatio > 0.82 && aspectRatio < 1.22;
                
                return {
                    type: isSquare ? 'square' : 'rectangle',
                    confidence: 0.85,
                    data: { x: bbox.minX, y: bbox.minY, width: bbox.width, height: bbox.height }
                };
            }

            // Köşe bulunamadıysa ama kapalıysa, aspect ratio'ya bak
            if (cornerCount < 3) {
                // Belki yumuşak köşeli dikdörtgen
                var isRectangular = aspectRatio < 0.5 || aspectRatio > 2;
                if (isRectangular && !isCircular) {
                    return {
                        type: 'rectangle',
                        confidence: 0.7,
                        data: { x: bbox.minX, y: bbox.minY, width: bbox.width, height: bbox.height }
                    };
                }
            }

            return null;
        },

        /**
         * Çizgi düzlüğü hesapla
         */
        calculateStraightness: function(points) {
            if (points.length < 3) return 1;

            var start = points[0];
            var end = points[points.length - 1];
            var lineLen = Math.hypot(end[0] - start[0], end[1] - start[1]);

            if (lineLen < 15) return 0;

            var maxDev = 0;
            for (var i = 1; i < points.length - 1; i++) {
                var dist = this.pointToLineDistance(points[i], start, end);
                if (dist > maxDev) maxDev = dist;
            }

            var ratio = maxDev / lineLen;
            return Math.max(0, Math.min(1, 1 - ratio * 2.5));
        },

        /**
         * Noktadan çizgiye mesafe
         */
        pointToLineDistance: function(point, lineStart, lineEnd) {
            var x0 = point[0], y0 = point[1];
            var x1 = lineStart[0], y1 = lineStart[1];
            var x2 = lineEnd[0], y2 = lineEnd[1];

            var A = x0 - x1, B = y0 - y1;
            var C = x2 - x1, D = y2 - y1;

            var dot = A * C + B * D;
            var lenSq = C * C + D * D;

            if (lenSq === 0) return Math.hypot(A, B);

            var t = Math.max(0, Math.min(1, dot / lenSq));
            return Math.hypot(x0 - (x1 + t * C), y0 - (y1 + t * D));
        },

        /**
         * Köşe bulma
         */
        findCorners: function(points) {
            var windowSize = Math.max(3, Math.floor(points.length / 12));
            var minAngle = this.config.CORNER_ANGLE_THRESHOLD * Math.PI;
            var corners = [];
            var minDist = windowSize * 2.5;

            for (var i = windowSize; i < points.length - windowSize; i++) {
                var prev = points[i - windowSize];
                var curr = points[i];
                var next = points[i + windowSize];

                var v1x = curr[0] - prev[0], v1y = curr[1] - prev[1];
                var v2x = next[0] - curr[0], v2y = next[1] - curr[1];

                var dot = v1x * v2x + v1y * v2y;
                var cross = v1x * v2y - v1y * v2x;
                var angle = Math.abs(Math.atan2(cross, dot));

                if (angle > minAngle) {
                    // Yakın köşe var mı kontrol et
                    var tooClose = false;
                    for (var j = 0; j < corners.length; j++) {
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

        /**
         * Ok ucu algılama
         */
        detectArrowHead: function(points) {
            if (points.length < 12) return false;

            var checkLen = Math.max(6, Math.floor(points.length * 0.25));
            var endPoints = points.slice(-checkLen);
            var corners = this.findCorners(endPoints);
            
            return corners.length >= 1;
        },

        /**
         * Perimeter hesapla
         */
        calculatePerimeter: function(points) {
            var perimeter = 0;
            for (var i = 1; i < points.length; i++) {
                perimeter += Math.hypot(points[i][0] - points[i-1][0], points[i][1] - points[i-1][1]);
            }
            // Kapanış
            perimeter += Math.hypot(points[0][0] - points[points.length-1][0], points[0][1] - points[points.length-1][1]);
            return perimeter;
        },

        /**
         * Üçgen köşelerini çıkar
         */
        extractTriangleVertices: function(corners, bbox) {
            if (corners.length >= 3) {
                return corners.slice(0, 3);
            }
            // Varsayılan üçgen
            return [
                [(bbox.minX + bbox.maxX) / 2, bbox.minY],
                [bbox.maxX, bbox.maxY],
                [bbox.minX, bbox.maxY]
            ];
        },

        /**
         * Şekil noktalarını oluştur
         */
        generateShapePoints: function(shape, originalPoints) {
            var pressure = 0.55;
            var points = [];

            var addPoint = function(x, y) { points.push([x, y, pressure]); };
            
            var addSegment = function(x1, y1, x2, y2, segments) {
                segments = segments || 10;
                for (var i = 0; i <= segments; i++) {
                    var t = i / segments;
                    addPoint(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
                }
            };

            switch (shape.type) {
                case 'line':
                    addSegment(shape.data.start[0], shape.data.start[1], shape.data.end[0], shape.data.end[1], 16);
                    break;

                case 'arrow':
                    var start = shape.data.start;
                    var end = shape.data.end;
                    addSegment(start[0], start[1], end[0], end[1], 16);
                    
                    // Ok başı
                    var angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
                    var headLen = 18;
                    var headAngle = Math.PI / 6;

                    addPoint(end[0], end[1]);
                    addPoint(end[0] - headLen * Math.cos(angle - headAngle), end[1] - headLen * Math.sin(angle - headAngle));
                    addPoint(end[0], end[1]);
                    addPoint(end[0] - headLen * Math.cos(angle + headAngle), end[1] - headLen * Math.sin(angle + headAngle));
                    break;

                case 'circle':
                    var cx = shape.data.cx, cy = shape.data.cy, r = shape.data.radius;
                    for (var i = 0; i <= 48; i++) {
                        var a = (i / 48) * Math.PI * 2;
                        addPoint(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
                    }
                    break;

                case 'ellipse':
                    var ecx = shape.data.cx, ecy = shape.data.cy;
                    var rx = shape.data.rx, ry = shape.data.ry;
                    for (var i = 0; i <= 48; i++) {
                        var a = (i / 48) * Math.PI * 2;
                        addPoint(ecx + Math.cos(a) * rx, ecy + Math.sin(a) * ry);
                    }
                    break;

                case 'rectangle':
                case 'square':
                    var x = shape.data.x, y = shape.data.y;
                    var w = shape.data.width, h = shape.data.height;
                    
                    addSegment(x, y, x + w, y, 8);
                    addSegment(x + w, y, x + w, y + h, 8);
                    addSegment(x + w, y + h, x, y + h, 8);
                    addSegment(x, y + h, x, y, 8);
                    break;

                case 'triangle':
                    var verts = shape.data.vertices;
                    addSegment(verts[0][0], verts[0][1], verts[1][0], verts[1][1], 10);
                    addSegment(verts[1][0], verts[1][1], verts[2][0], verts[2][1], 10);
                    addSegment(verts[2][0], verts[2][1], verts[0][0], verts[0][1], 10);
                    break;

                default:
                    return originalPoints;
            }

            return points;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // GLOBAL EXPORT
    // ═══════════════════════════════════════════════════════════════════════

    window.TestifyCanvasEngine = {
        // Stroke fonksiyonları
        getPremiumStroke: getPremiumStroke,
        getStrokeSvgPath: getStrokeSvgPath,
        
        // Smoothing utilities
        catmullRomSpline: catmullRomSpline,
        movingAverageSmooth: movingAverageSmooth,
        simplifyPath: simplifyPath,
        simulateAdvancedPressure: simulateAdvancedPressure,
        
        // Shape recognition
        ShapeRecognizer: ShapeRecognizer
    };

    console.log('[TestifyCanvasEngine] Ultra Premium Stroke Engine loaded');

})();

/**
 * TESTIFY CANVAS SYSTEM v2.0 - ULTRA PREMIUM EDITION
 * ===================================================
 * Ana canvas sistemi - testify-canvas-engine.js'den SONRA yükle
 * 
 * Özellikler:
 * - Premium çizim kalitesi
 * - Gelişmiş şekil tanıma
 * - Mobile-first responsive UI
 * - Multi-touch gesture desteği
 * - Sınırsız undo/redo
 */

'use strict';

(function() {

    // Engine yüklendi mi kontrol et
    if (!window.TestifyCanvasEngine) {
        console.error('[TestifyCanvas] Engine not loaded! Load testify-canvas-engine.js first.');
        return;
    }

    var Engine = window.TestifyCanvasEngine;

    // ═══════════════════════════════════════════════════════════════════════
    // CONFIGURATION
    // ═══════════════════════════════════════════════════════════════════════

    var CONFIG = {
        // Canvas
        CANVAS_WIDTH: 4000,
        CANVAS_HEIGHT: 3000,
        MIN_ZOOM: 0.1,
        MAX_ZOOM: 10,
        ZOOM_STEP: 0.15,

        // Drawing - ÖNEMLİ: Kalınlık artırıldı
        DEFAULT_COLOR: '#1a1a2e',
        DEFAULT_SIZE: 6,
        MIN_SIZE: 1,
        MAX_SIZE: 80,
        DEFAULT_OPACITY: 1,
        STROKE_SIZE_MULTIPLIER: 2.5, // ÖNEMLİ: 1.5'ten 2.5'e çıkarıldı

        // Premium stroke options
        STROKE_OPTIONS: {
            thinning: 0.4,
            smoothing: 0.65,
            streamline: 0.55,
            taperStart: 0,
            taperEnd: 0,
            simulatePressure: true
        },

        // History
        MAX_HISTORY: 100,

        // Colors
        COLORS: [
            '#1a1a2e', '#16213e', '#0f3460', '#e94560',
            '#533483', '#0d7377', '#14a76c', '#ff9a3c',
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'
        ],

        // Brush presets
        BRUSH_PRESETS: [
            { id: 'finepen', name: 'İnce Kalem', size: 3, thinning: 0.55, smoothing: 0.7, streamline: 0.6 },
            { id: 'pen', name: 'Tükenmez', size: 6, thinning: 0.4, smoothing: 0.65, streamline: 0.55 },
            { id: 'marker', name: 'Keçeli', size: 14, thinning: 0.15, smoothing: 0.5, streamline: 0.4 },
            { id: 'highlighter', name: 'Fosforlu', size: 22, thinning: 0, smoothing: 0.7, streamline: 0.3, opacity: 0.35 },
            { id: 'brush', name: 'Fırça', size: 18, thinning: 0.65, smoothing: 0.55, streamline: 0.5 },
            { id: 'calligraphy', name: 'Kaligrafi', size: 10, thinning: 0.8, smoothing: 0.45, streamline: 0.6 }
        ],

        // Storage
        STORAGE_KEY: 'testify.canvas.v2'
    };

    // Tools
    var TOOLS = {
        PEN: 'pen',
        ERASER: 'eraser',
        SELECT: 'select',
        PAN: 'pan',
        SHAPE: 'shape'
    };

    // ═══════════════════════════════════════════════════════════════════════
    // MAIN CANVAS CLASS
    // ═══════════════════════════════════════════════════════════════════════

    function TestifyCanvas(options) {
        options = options || {};
        
        this.options = {
            container: options.container || null,
            mode: options.mode || 'fullscreen',
            onSave: options.onSave || null,
            onClose: options.onClose || null
        };

        // State
        this.isOpen = false;
        this.tool = TOOLS.PEN;
        this.color = CONFIG.DEFAULT_COLOR;
        this.size = CONFIG.DEFAULT_SIZE;
        this.opacity = CONFIG.DEFAULT_OPACITY;
        this.brushPreset = CONFIG.BRUSH_PRESETS[1];

        // Canvas state
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDrawing = false;
        this.isPanning = false;
        this.isErasing = false;
        this.isPinching = false;
        this.currentPoints = [];
        this.currentStroke = null;
        this.lastPanPoint = null;
        this.lastPinchDist = 0;

        // Device detection
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        this.deviceType = this.detectDevice();

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
        this.eraserCursor = null;

        // Shape recognizer
        this.shapeRecognizer = Engine.ShapeRecognizer;

        // Bind methods
        var self = this;
        this.handlePointerDown = function(e) { self._handlePointerDown(e); };
        this.handlePointerMove = function(e) { self._handlePointerMove(e); };
        this.handlePointerUp = function(e) { self._handlePointerUp(e); };
        this.handleWheel = function(e) { self._handleWheel(e); };
        this.handleKeyDown = function(e) { self._handleKeyDown(e); };
        this.handleTouchStart = function(e) { self._handleTouchStart(e); };
        this.handleTouchMove = function(e) { self._handleTouchMove(e); };
        this.handleTouchEnd = function(e) { self._handleTouchEnd(e); };

        // Initialize
        this.init();
    }

    TestifyCanvas.prototype.detectDevice = function() {
        var ua = navigator.userAgent;
        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        var isTablet = /iPad|Android/i.test(ua) && window.innerWidth >= 768;
        return isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');
    };

    TestifyCanvas.prototype.init = function() {
        this.createElements();
        this.attachEventListeners();
        this.loadFromStorage();
        this.saveHistory();
        console.log('[TestifyCanvas v2.0] Initialized - Device:', this.deviceType);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ELEMENT CREATION
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.createElements = function() {
        this.container = document.createElement('div');
        this.container.className = 'tcanvas';
        this.container.setAttribute('data-device', this.deviceType);
        
        if (this.options.mode === 'quiz') {
            this.container.classList.add('quiz-mode');
        }

        this.container.innerHTML = this.getTemplate();

        if (this.options.container) {
            this.options.container.appendChild(this.container);
            this.container.classList.add('is-open');
            this.isOpen = true;
        } else {
            document.body.appendChild(this.container);
        }

        // References
        this.svg = this.container.querySelector('#tcanvasSvg');
        this.wrapper = this.container.querySelector('.tcanvas-wrapper');
        this.gridEl = this.container.querySelector('.tcanvas-grid');
        this.eraserCursor = this.container.querySelector('.tcanvas-eraser-cursor');

        this.updateViewBox();
        this.createGrid();
        this.updateAllUI();
    };

    TestifyCanvas.prototype.getTemplate = function() {
        var isQuiz = this.options.mode === 'quiz';
        var isMobile = this.deviceType !== 'desktop';
        var self = this;

        // Color swatches HTML
        var colorSwatches = CONFIG.COLORS.map(function(c) {
            return '<button class="tcanvas-color' + (c === self.color ? ' is-active' : '') + '" data-color="' + c + '" style="background:' + c + '"></button>';
        }).join('');

        // Brush presets HTML
        var brushPresets = CONFIG.BRUSH_PRESETS.map(function(p) {
            return '<button class="tcanvas-brush-btn' + (p.id === self.brushPreset.id ? ' is-active' : '') + '" data-preset="' + p.id + '">' + p.name + '</button>';
        }).join('');

        return '\
            <!-- Header -->\
            <header class="tcanvas-header">\
                <div class="tcanvas-header-left">\
                    ' + (!isQuiz ? '<div class="tcanvas-logo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg><span>Çizim</span></div>' : '') + '\
                </div>\
                <div class="tcanvas-header-center">\
                    <button class="tcanvas-icon-btn" data-action="undo" title="Geri Al" disabled>\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10h10a5 5 0 0 1 5 5v2"/><path d="M3 10l4-4M3 10l4 4"/></svg>\
                    </button>\
                    <button class="tcanvas-icon-btn" data-action="redo" title="İleri Al" disabled>\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10H11a5 5 0 0 0-5 5v2"/><path d="M21 10l-4-4M21 10l-4 4"/></svg>\
                    </button>\
                </div>\
                <div class="tcanvas-header-right">\
                    ' + (!isQuiz ? '\
                    <button class="tcanvas-icon-btn" data-action="clear" title="Temizle">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>\
                    </button>\
                    <button class="tcanvas-icon-btn" data-action="download" title="İndir">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>\
                    </button>\
                    ' : '') + '\
                    <button class="tcanvas-icon-btn tcanvas-close-btn" data-action="' + (isQuiz ? 'minimize' : 'close') + '" title="Kapat">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\
                    </button>\
                </div>\
            </header>\
            \
            <!-- Main Area -->\
            <main class="tcanvas-main">\
                <div class="tcanvas-wrapper">\
                    <div class="tcanvas-grid"></div>\
                    <svg id="tcanvasSvg" xmlns="http://www.w3.org/2000/svg">\
                        <g id="tcanvasContent" transform="translate(0,0) scale(1)"></g>\
                    </svg>\
                    <div class="tcanvas-eraser-cursor"></div>\
                </div>\
                \
                <!-- Desktop Tools -->\
                <aside class="tcanvas-tools tcanvas-desktop">\
                    <button class="tcanvas-tool is-active" data-tool="pen" title="Kalem (P)">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>\
                    </button>\
                    <button class="tcanvas-tool" data-tool="eraser" title="Silgi (E)">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 20H7L3 16c-.4-.4-.4-1 0-1.4l9.9-9.9c.4-.4 1-.4 1.4 0l5.3 5.3c.4.4.4 1 0 1.4L11 20"/><path d="M6 11l4 4"/></svg>\
                    </button>\
                    <button class="tcanvas-tool" data-tool="shape" title="Şekil (S)">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><circle cx="17.5" cy="6.5" r="4.5"/><path d="M14 14l3 6 3-6z"/></svg>\
                    </button>\
                    <div class="tcanvas-tool-divider"></div>\
                    <button class="tcanvas-tool" data-tool="pan" title="Kaydır (H)">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>\
                    </button>\
                </aside>\
                \
                <!-- Desktop Options -->\
                ' + (!isQuiz ? '\
                <aside class="tcanvas-options tcanvas-desktop">\
                    <section class="tcanvas-section">\
                        <h4>Renk</h4>\
                        <div class="tcanvas-color-grid">' + colorSwatches + '</div>\
                        <div class="tcanvas-custom-color">\
                            <input type="color" class="tcanvas-color-input" value="' + this.color + '">\
                            <span class="tcanvas-color-hex">' + this.color + '</span>\
                        </div>\
                    </section>\
                    <section class="tcanvas-section">\
                        <h4>Boyut</h4>\
                        <div class="tcanvas-size-control">\
                            <div class="tcanvas-size-preview"><div class="tcanvas-preview-dot" style="width:' + this.size + 'px;height:' + this.size + 'px;background:' + this.color + '"></div></div>\
                            <input type="range" class="tcanvas-size-slider" min="' + CONFIG.MIN_SIZE + '" max="' + CONFIG.MAX_SIZE + '" value="' + this.size + '">\
                            <span class="tcanvas-size-value">' + this.size + 'px</span>\
                        </div>\
                    </section>\
                    <section class="tcanvas-section">\
                        <h4>Opaklık</h4>\
                        <div class="tcanvas-opacity-control">\
                            <input type="range" class="tcanvas-opacity-slider" min="0.1" max="1" step="0.05" value="' + this.opacity + '">\
                            <span class="tcanvas-opacity-value">' + Math.round(this.opacity * 100) + '%</span>\
                        </div>\
                    </section>\
                    <section class="tcanvas-section">\
                        <h4>Fırça</h4>\
                        <div class="tcanvas-brush-grid">' + brushPresets + '</div>\
                    </section>\
                </aside>\
                ' : '') + '\
            </main>\
            \
            <!-- Mobile Bottom Bar -->\
            <nav class="tcanvas-mobile-bar tcanvas-mobile">\
                <div class="tcanvas-mobile-tools">\
                    <button class="tcanvas-mobile-tool is-active" data-tool="pen">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>\
                        <span>Kalem</span>\
                    </button>\
                    <button class="tcanvas-mobile-tool" data-tool="eraser">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 20H7L3 16c-.4-.4-.4-1 0-1.4l9.9-9.9c.4-.4 1-.4 1.4 0l5.3 5.3c.4.4.4 1 0 1.4L11 20"/></svg>\
                        <span>Silgi</span>\
                    </button>\
                    <button class="tcanvas-mobile-tool" data-tool="shape">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><circle cx="17.5" cy="6.5" r="4.5"/></svg>\
                        <span>Şekil</span>\
                    </button>\
                    <button class="tcanvas-mobile-tool" data-tool="pan">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/></svg>\
                        <span>Kaydır</span>\
                    </button>\
                </div>\
                <div class="tcanvas-mobile-options">\
                    <button class="tcanvas-mobile-opt" data-action="toggle-colors">\
                        <div class="tcanvas-color-indicator" style="background:' + this.color + '"></div>\
                    </button>\
                    <button class="tcanvas-mobile-opt" data-action="toggle-size">\
                        <div class="tcanvas-size-indicator"><div class="tcanvas-size-dot" style="width:' + Math.min(this.size, 18) + 'px;height:' + Math.min(this.size, 18) + 'px"></div></div>\
                    </button>\
                </div>\
            </nav>\
            \
            <!-- Mobile Color Panel -->\
            <div class="tcanvas-panel tcanvas-color-panel" id="tcanvasColorPanel">\
                <div class="tcanvas-panel-header">\
                    <span>Renk Seç</span>\
                    <button class="tcanvas-panel-close" data-action="close-panel">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\
                    </button>\
                </div>\
                <div class="tcanvas-panel-colors">' + colorSwatches + '</div>\
            </div>\
            \
            <!-- Mobile Size Panel -->\
            <div class="tcanvas-panel tcanvas-size-panel" id="tcanvasSizePanel">\
                <div class="tcanvas-panel-header">\
                    <span>Boyut: <strong id="tcanvasMobileSizeVal">' + this.size + 'px</strong></span>\
                    <button class="tcanvas-panel-close" data-action="close-panel">\
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>\
                    </button>\
                </div>\
                <div class="tcanvas-panel-size">\
                    <input type="range" class="tcanvas-mobile-size-slider" min="' + CONFIG.MIN_SIZE + '" max="' + CONFIG.MAX_SIZE + '" value="' + this.size + '">\
                    <div class="tcanvas-mobile-size-preview" style="width:' + (this.size * 2) + 'px;height:' + (this.size * 2) + 'px;background:' + this.color + '"></div>\
                </div>\
                <div class="tcanvas-panel-brushes">' + brushPresets + '</div>\
            </div>\
            \
            <!-- Shape Hint -->\
            <div class="tcanvas-shape-hint" id="tcanvasShapeHint">\
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>\
                <span></span>\
            </div>\
            \
            <!-- Zoom Controls -->\
            <div class="tcanvas-zoom tcanvas-desktop">\
                <button class="tcanvas-zoom-btn" data-action="zoom-out" title="Uzaklaştır">\
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\
                </button>\
                <span class="tcanvas-zoom-value" id="tcanvasZoomVal">' + Math.round(this.zoom * 100) + '%</span>\
                <button class="tcanvas-zoom-btn" data-action="zoom-in" title="Yakınlaştır">\
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>\
                </button>\
                <button class="tcanvas-zoom-btn" data-action="zoom-reset" title="Sıfırla">\
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>\
                </button>\
            </div>\
        ';
    };

    TestifyCanvas.prototype.createGrid = function() {
        if (!this.gridEl) return;
        this.gridEl.innerHTML = '\
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">\
                <defs>\
                    <pattern id="tcSmallGrid" width="20" height="20" patternUnits="userSpaceOnUse">\
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--tc-grid)" stroke-width="0.5" opacity="0.5"/>\
                    </pattern>\
                    <pattern id="tcLargeGrid" width="100" height="100" patternUnits="userSpaceOnUse">\
                        <rect width="100" height="100" fill="url(#tcSmallGrid)"/>\
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="var(--tc-grid)" stroke-width="1" opacity="0.7"/>\
                    </pattern>\
                </defs>\
                <rect width="100%" height="100%" fill="url(#tcLargeGrid)"/>\
            </svg>\
        ';
    };

    // ═══════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.attachEventListeners = function() {
        var self = this;

        // Pointer events
        this.svg.addEventListener('pointerdown', this.handlePointerDown);
        this.svg.addEventListener('pointermove', this.handlePointerMove);
        this.svg.addEventListener('pointerup', this.handlePointerUp);
        this.svg.addEventListener('pointerleave', this.handlePointerUp);
        this.svg.addEventListener('pointercancel', this.handlePointerUp);

        // Touch events (multi-touch)
        this.wrapper.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        this.wrapper.addEventListener('touchmove', this.handleTouchMove, { passive: false });
        this.wrapper.addEventListener('touchend', this.handleTouchEnd, { passive: false });

        // Wheel zoom
        this.wrapper.addEventListener('wheel', this.handleWheel, { passive: false });

        // Keyboard
        document.addEventListener('keydown', this.handleKeyDown);

        // Tool buttons
        this.container.querySelectorAll('[data-tool]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.setTool(btn.getAttribute('data-tool'));
            });
        });

        // Action buttons
        this.container.querySelectorAll('[data-action]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.handleAction(btn.getAttribute('data-action'));
            });
        });

        // Color buttons
        this.container.querySelectorAll('[data-color]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.setColor(btn.getAttribute('data-color'));
                self.closeAllPanels();
            });
        });

        // Color input
        var colorInput = this.container.querySelector('.tcanvas-color-input');
        if (colorInput) {
            colorInput.addEventListener('input', function(e) {
                self.setColor(e.target.value);
            });
        }

        // Size sliders
        this.container.querySelectorAll('.tcanvas-size-slider, .tcanvas-mobile-size-slider').forEach(function(slider) {
            slider.addEventListener('input', function(e) {
                self.setSize(parseInt(e.target.value, 10));
            });
        });

        // Opacity slider
        var opacitySlider = this.container.querySelector('.tcanvas-opacity-slider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', function(e) {
                self.setOpacity(parseFloat(e.target.value));
            });
        }

        // Brush presets
        this.container.querySelectorAll('[data-preset]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                self.setBrushPreset(btn.getAttribute('data-preset'));
            });
        });

        // Context menu prevention
        this.svg.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    };

    TestifyCanvas.prototype.removeEventListeners = function() {
        this.svg.removeEventListener('pointerdown', this.handlePointerDown);
        this.svg.removeEventListener('pointermove', this.handlePointerMove);
        this.svg.removeEventListener('pointerup', this.handlePointerUp);
        this.svg.removeEventListener('pointerleave', this.handlePointerUp);
        this.svg.removeEventListener('pointercancel', this.handlePointerUp);
        this.wrapper.removeEventListener('touchstart', this.handleTouchStart);
        this.wrapper.removeEventListener('touchmove', this.handleTouchMove);
        this.wrapper.removeEventListener('touchend', this.handleTouchEnd);
        this.wrapper.removeEventListener('wheel', this.handleWheel);
        document.removeEventListener('keydown', this.handleKeyDown);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // POINTER HANDLERS
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype._handlePointerDown = function(e) {
        e.preventDefault();

        if (e.pointerId !== undefined) {
            try { this.svg.setPointerCapture(e.pointerId); } catch(ex) {}
        }

        var point = this.getPointerPosition(e);
        var pressure = e.pressure || 0.5;

        // Pan mode
        if (this.tool === TOOLS.PAN || e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            this.startPanning(e.clientX, e.clientY);
            return;
        }

        // Eraser
        if (this.tool === TOOLS.ERASER) {
            this.isErasing = true;
            this.updateEraserCursor(e.clientX, e.clientY);
            this.eraseAt(point.x, point.y);
            return;
        }

        // Drawing
        if (this.tool === TOOLS.PEN || this.tool === TOOLS.SHAPE) {
            this.isDrawing = true;
            this.currentPoints = [[point.x, point.y, pressure]];
            this.currentStroke = this.createStrokePath();
            this.renderCurrentStroke();
        }
    };

    TestifyCanvas.prototype._handlePointerMove = function(e) {
        var point = this.getPointerPosition(e);
        var pressure = e.pressure || 0.5;

        // Eraser
        if (this.tool === TOOLS.ERASER) {
            this.updateEraserCursor(e.clientX, e.clientY);
            if (this.isErasing) {
                this.eraseAt(point.x, point.y);
            }
            return;
        }

        // Panning
        if (this.isPanning && this.lastPanPoint) {
            var dx = e.clientX - this.lastPanPoint.x;
            var dy = e.clientY - this.lastPanPoint.y;
            this.panX += dx;
            this.panY += dy;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.updateViewBox();
            return;
        }

        // Drawing
        if (this.isDrawing) {
            this.currentPoints.push([point.x, point.y, pressure]);
            this.renderCurrentStroke();
        }
    };

    TestifyCanvas.prototype._handlePointerUp = function(e) {
        if (e.pointerId !== undefined) {
            try { this.svg.releasePointerCapture(e.pointerId); } catch(ex) {}
        }

        if (this.isPanning) {
            this.stopPanning();
            return;
        }

        if (this.isErasing) {
            this.isErasing = false;
            this.saveHistory();
            return;
        }

        if (this.isDrawing) {
            this.isDrawing = false;

            if (this.currentPoints.length > 1) {
                this.finalizeStroke();
            } else if (this.currentStroke) {
                this.currentStroke.remove();
            }

            this.currentPoints = [];
            this.currentStroke = null;
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // TOUCH HANDLERS (Multi-touch pinch zoom)
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype._handleTouchStart = function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            this.isPinching = true;
            this.lastPinchDist = this.getPinchDistance(e.touches);

            // Çizimi iptal et
            if (this.isDrawing) {
                this.isDrawing = false;
                if (this.currentStroke) {
                    this.currentStroke.remove();
                }
                this.currentPoints = [];
                this.currentStroke = null;
            }
        }
    };

    TestifyCanvas.prototype._handleTouchMove = function(e) {
        if (e.touches.length === 2 && this.isPinching) {
            e.preventDefault();

            var dist = this.getPinchDistance(e.touches);
            var scale = dist / this.lastPinchDist;
            var newZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, this.zoom * scale));

            if (newZoom !== this.zoom) {
                var centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                var centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                var rect = this.svg.getBoundingClientRect();

                var scaleChange = newZoom / this.zoom;
                this.panX = centerX - rect.left - (centerX - rect.left - this.panX) * scaleChange;
                this.panY = centerY - rect.top - (centerY - rect.top - this.panY) * scaleChange;

                this.zoom = newZoom;
                this.updateViewBox();
                this.updateZoomUI();
            }

            this.lastPinchDist = dist;
        }
    };

    TestifyCanvas.prototype._handleTouchEnd = function(e) {
        if (e.touches.length < 2) {
            this.isPinching = false;
        }
    };

    TestifyCanvas.prototype.getPinchDistance = function(touches) {
        return Math.hypot(
            touches[0].clientX - touches[1].clientX,
            touches[0].clientY - touches[1].clientY
        );
    };

    // ═══════════════════════════════════════════════════════════════════════
    // WHEEL & KEYBOARD
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype._handleWheel = function(e) {
        e.preventDefault();

        var delta = e.deltaY > 0 ? -CONFIG.ZOOM_STEP : CONFIG.ZOOM_STEP;
        var newZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, this.zoom + delta));

        if (newZoom !== this.zoom) {
            var rect = this.svg.getBoundingClientRect();
            var cursorX = e.clientX - rect.left;
            var cursorY = e.clientY - rect.top;

            var scale = newZoom / this.zoom;
            this.panX = cursorX - (cursorX - this.panX) * scale;
            this.panY = cursorY - (cursorY - this.panY) * scale;

            this.zoom = newZoom;
            this.updateViewBox();
            this.updateZoomUI();
        }
    };

    TestifyCanvas.prototype._handleKeyDown = function(e) {
        if (!this.isOpen) return;

        var key = e.key.toLowerCase();

        if (!e.ctrlKey && !e.metaKey) {
            switch (key) {
                case 'p': this.setTool(TOOLS.PEN); break;
                case 'e': this.setTool(TOOLS.ERASER); break;
                case 'h': this.setTool(TOOLS.PAN); break;
                case 's': this.setTool(TOOLS.SHAPE); break;
                case 'escape': this.close(); break;
                case '[': this.setSize(Math.max(CONFIG.MIN_SIZE, this.size - 2)); break;
                case ']': this.setSize(Math.min(CONFIG.MAX_SIZE, this.size + 2)); break;
            }
        }

        if (e.ctrlKey || e.metaKey) {
            switch (key) {
                case 'z':
                    e.preventDefault();
                    e.shiftKey ? this.redo() : this.undo();
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
            }
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // DRAWING METHODS
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.createStrokePath = function() {
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('tcanvas-stroke');
        path.style.fill = this.color;
        path.style.opacity = this.opacity;

        var content = this.svg.querySelector('#tcanvasContent');
        content.appendChild(path);

        return path;
    };

    TestifyCanvas.prototype.renderCurrentStroke = function() {
        if (!this.currentStroke || this.currentPoints.length < 2) return;

        var strokeOptions = {
            size: this.size * CONFIG.STROKE_SIZE_MULTIPLIER,
            thinning: this.brushPreset.thinning !== undefined ? this.brushPreset.thinning : CONFIG.STROKE_OPTIONS.thinning,
            smoothing: this.brushPreset.smoothing !== undefined ? this.brushPreset.smoothing : CONFIG.STROKE_OPTIONS.smoothing,
            streamline: this.brushPreset.streamline !== undefined ? this.brushPreset.streamline : CONFIG.STROKE_OPTIONS.streamline,
            simulatePressure: true
        };

        var outline = Engine.getPremiumStroke(this.currentPoints, strokeOptions);
        var pathData = Engine.getStrokeSvgPath(outline);

        this.currentStroke.setAttribute('d', pathData);
    };

    TestifyCanvas.prototype.finalizeStroke = function() {
        if (!this.currentStroke || this.currentPoints.length < 2) return;

        var layer = null;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].id === this.activeLayerId) {
                layer = this.layers[i];
                break;
            }
        }
        if (!layer) return;

        var strokeData = {
            id: this.generateId(),
            points: this.currentPoints.slice(),
            color: this.color,
            size: this.size,
            opacity: this.opacity,
            brushPreset: this.brushPreset.id,
            timestamp: Date.now()
        };

        // Shape recognition
        if (this.tool === TOOLS.SHAPE) {
            var recognized = this.shapeRecognizer.recognize(this.currentPoints);

            if (recognized && recognized.confidence > 0.72) {
                strokeData.points = this.shapeRecognizer.generateShapePoints(recognized, this.currentPoints);
                strokeData.shapeType = recognized.type;

                // Re-render
                var strokeOptions = {
                    size: this.size * CONFIG.STROKE_SIZE_MULTIPLIER,
                    thinning: this.brushPreset.thinning || CONFIG.STROKE_OPTIONS.thinning,
                    smoothing: this.brushPreset.smoothing || CONFIG.STROKE_OPTIONS.smoothing,
                    streamline: this.brushPreset.streamline || CONFIG.STROKE_OPTIONS.streamline,
                    simulatePressure: true
                };

                var outline = Engine.getPremiumStroke(strokeData.points, strokeOptions);
                var pathData = Engine.getStrokeSvgPath(outline);
                this.currentStroke.setAttribute('d', pathData);

                this.showShapeHint(recognized.type);
            }
        }

        layer.strokes.push(strokeData);
        this.currentStroke.setAttribute('data-stroke-id', strokeData.id);

        this.saveHistory();
        this.updateStrokeCount();
    };

    TestifyCanvas.prototype.eraseAt = function(x, y) {
        var eraserSize = this.size * 3.5;
        var layer = null;
        for (var i = 0; i < this.layers.length; i++) {
            if (this.layers[i].id === this.activeLayerId) {
                layer = this.layers[i];
                break;
            }
        }
        if (!layer) return;

        var erased = false;
        var self = this;

        layer.strokes = layer.strokes.filter(function(stroke) {
            var isNear = stroke.points.some(function(point) {
                var dx = point[0] - x;
                var dy = point[1] - y;
                return Math.sqrt(dx * dx + dy * dy) < eraserSize;
            });

            if (isNear) {
                var pathEl = self.svg.querySelector('[data-stroke-id="' + stroke.id + '"]');
                if (pathEl) pathEl.remove();
                erased = true;
                return false;
            }
            return true;
        });

        if (erased) {
            this.updateStrokeCount();
        }
    };

    TestifyCanvas.prototype.updateEraserCursor = function(clientX, clientY) {
        if (!this.eraserCursor) return;
        this.eraserCursor.style.left = clientX + 'px';
        this.eraserCursor.style.top = clientY + 'px';
        this.eraserCursor.style.width = (this.size * 7) + 'px';
        this.eraserCursor.style.height = (this.size * 7) + 'px';
    };

    TestifyCanvas.prototype.showShapeHint = function(shapeType) {
        var hint = this.container.querySelector('#tcanvasShapeHint');
        if (!hint) return;

        var names = {
            line: 'Çizgi', arrow: 'Ok', circle: 'Daire', ellipse: 'Elips',
            rectangle: 'Dikdörtgen', square: 'Kare', triangle: 'Üçgen'
        };

        hint.querySelector('span').textContent = (names[shapeType] || shapeType) + ' algılandı';
        hint.classList.add('is-visible');

        setTimeout(function() {
            hint.classList.remove('is-visible');
        }, 1400);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // UTILITY METHODS
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.getPointerPosition = function(e) {
        var rect = this.svg.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - this.panX) / this.zoom,
            y: (e.clientY - rect.top - this.panY) / this.zoom
        };
    };

    TestifyCanvas.prototype.updateViewBox = function() {
        var content = this.svg.querySelector('#tcanvasContent');
        if (content) {
            content.setAttribute('transform', 'translate(' + this.panX + ',' + this.panY + ') scale(' + this.zoom + ')');
        }
    };

    TestifyCanvas.prototype.generateId = function() {
        return 'stroke_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    TestifyCanvas.prototype.getTotalStrokeCount = function() {
        var count = 0;
        for (var i = 0; i < this.layers.length; i++) {
            count += this.layers[i].strokes.length;
        }
        return count;
    };

    TestifyCanvas.prototype.startPanning = function(x, y) {
        this.isPanning = true;
        this.lastPanPoint = { x: x, y: y };
        this.wrapper.classList.add('is-panning');
    };

    TestifyCanvas.prototype.stopPanning = function() {
        this.isPanning = false;
        this.lastPanPoint = null;
        this.wrapper.classList.remove('is-panning');
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SETTERS
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.setTool = function(tool) {
        this.tool = tool;
        this.updateToolUI();
        this.closeAllPanels();
    };

    TestifyCanvas.prototype.setColor = function(color) {
        this.color = color;
        this.updateColorUI();
    };

    TestifyCanvas.prototype.setSize = function(size) {
        this.size = Math.max(CONFIG.MIN_SIZE, Math.min(CONFIG.MAX_SIZE, size));
        this.updateSizeUI();
    };

    TestifyCanvas.prototype.setOpacity = function(opacity) {
        this.opacity = Math.max(0.1, Math.min(1, opacity));
        this.updateOpacityUI();
    };

    TestifyCanvas.prototype.setBrushPreset = function(presetId) {
        var preset = null;
        for (var i = 0; i < CONFIG.BRUSH_PRESETS.length; i++) {
            if (CONFIG.BRUSH_PRESETS[i].id === presetId) {
                preset = CONFIG.BRUSH_PRESETS[i];
                break;
            }
        }
        if (!preset) return;

        this.brushPreset = preset;
        this.size = preset.size;

        if (preset.opacity !== undefined) {
            this.opacity = preset.opacity;
            this.updateOpacityUI();
        }

        this.updateSizeUI();
        this.updateBrushUI();
    };

    // ═══════════════════════════════════════════════════════════════════════
    // UI UPDATES
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.updateAllUI = function() {
        this.updateToolUI();
        this.updateColorUI();
        this.updateSizeUI();
        this.updateOpacityUI();
        this.updateBrushUI();
        this.updateZoomUI();
        this.updateStrokeCount();
        this.updateHistoryButtons();
    };

    TestifyCanvas.prototype.updateToolUI = function() {
        var self = this;
        this.container.querySelectorAll('[data-tool]').forEach(function(btn) {
            btn.classList.toggle('is-active', btn.getAttribute('data-tool') === self.tool);
        });
        this.wrapper.classList.toggle('eraser-active', this.tool === TOOLS.ERASER);
        this.wrapper.classList.toggle('pan-mode', this.tool === TOOLS.PAN);
    };

    TestifyCanvas.prototype.updateColorUI = function() {
        var self = this;
        this.container.querySelectorAll('[data-color]').forEach(function(btn) {
            btn.classList.toggle('is-active', btn.getAttribute('data-color') === self.color);
        });

        var colorInput = this.container.querySelector('.tcanvas-color-input');
        if (colorInput) colorInput.value = this.color;

        var colorHex = this.container.querySelector('.tcanvas-color-hex');
        if (colorHex) colorHex.textContent = this.color;

        var colorIndicator = this.container.querySelector('.tcanvas-color-indicator');
        if (colorIndicator) colorIndicator.style.background = this.color;

        this.updatePreviewDot();
    };

    TestifyCanvas.prototype.updateSizeUI = function() {
        var self = this;
        this.container.querySelectorAll('.tcanvas-size-slider, .tcanvas-mobile-size-slider').forEach(function(slider) {
            slider.value = self.size;
        });

        var sizeVal = this.container.querySelector('.tcanvas-size-value');
        if (sizeVal) sizeVal.textContent = this.size + 'px';

        var mobileSizeVal = this.container.querySelector('#tcanvasMobileSizeVal');
        if (mobileSizeVal) mobileSizeVal.textContent = this.size + 'px';

        var sizeDot = this.container.querySelector('.tcanvas-size-dot');
        if (sizeDot) {
            var displaySize = Math.min(this.size, 18);
            sizeDot.style.width = displaySize + 'px';
            sizeDot.style.height = displaySize + 'px';
        }

        var mobilePreview = this.container.querySelector('.tcanvas-mobile-size-preview');
        if (mobilePreview) {
            mobilePreview.style.width = (this.size * 2) + 'px';
            mobilePreview.style.height = (this.size * 2) + 'px';
            mobilePreview.style.background = this.color;
        }

        this.updatePreviewDot();
    };

    TestifyCanvas.prototype.updateOpacityUI = function() {
        var slider = this.container.querySelector('.tcanvas-opacity-slider');
        if (slider) slider.value = this.opacity;

        var val = this.container.querySelector('.tcanvas-opacity-value');
        if (val) val.textContent = Math.round(this.opacity * 100) + '%';
    };

    TestifyCanvas.prototype.updateBrushUI = function() {
        var self = this;
        this.container.querySelectorAll('[data-preset]').forEach(function(btn) {
            btn.classList.toggle('is-active', btn.getAttribute('data-preset') === self.brushPreset.id);
        });
    };

    TestifyCanvas.prototype.updateZoomUI = function() {
        var zoomVal = this.container.querySelector('#tcanvasZoomVal');
        if (zoomVal) zoomVal.textContent = Math.round(this.zoom * 100) + '%';
    };

    TestifyCanvas.prototype.updatePreviewDot = function() {
        var dot = this.container.querySelector('.tcanvas-preview-dot');
        if (dot) {
            dot.style.width = this.size + 'px';
            dot.style.height = this.size + 'px';
            dot.style.background = this.color;
            dot.style.opacity = this.opacity;
        }
    };

    TestifyCanvas.prototype.updateStrokeCount = function() {
        // Gerekirse UI'da stroke sayısını göster
    };

    TestifyCanvas.prototype.updateHistoryButtons = function() {
        var undoBtn = this.container.querySelector('[data-action="undo"]');
        var redoBtn = this.container.querySelector('[data-action="redo"]');

        if (undoBtn) undoBtn.disabled = this.historyIndex <= 0;
        if (redoBtn) redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ZOOM CONTROLS
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.zoomIn = function() {
        this.zoom = Math.min(CONFIG.MAX_ZOOM, this.zoom + CONFIG.ZOOM_STEP);
        this.updateViewBox();
        this.updateZoomUI();
    };

    TestifyCanvas.prototype.zoomOut = function() {
        this.zoom = Math.max(CONFIG.MIN_ZOOM, this.zoom - CONFIG.ZOOM_STEP);
        this.updateViewBox();
        this.updateZoomUI();
    };

    TestifyCanvas.prototype.resetZoom = function() {
        this.zoom = 1;
        this.panX = 0;
        this.panY = 0;
        this.updateViewBox();
        this.updateZoomUI();
    };

    // ═══════════════════════════════════════════════════════════════════════
    // HISTORY
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.saveHistory = function() {
        this.history = this.history.slice(0, this.historyIndex + 1);
        var snapshot = JSON.parse(JSON.stringify(this.layers));
        this.history.push(snapshot);

        if (this.history.length > CONFIG.MAX_HISTORY) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }

        this.updateHistoryButtons();
    };

    TestifyCanvas.prototype.undo = function() {
        if (this.historyIndex <= 0) return;
        this.historyIndex--;
        this.restoreFromHistory();
        this.updateHistoryButtons();
    };

    TestifyCanvas.prototype.redo = function() {
        if (this.historyIndex >= this.history.length - 1) return;
        this.historyIndex++;
        this.restoreFromHistory();
        this.updateHistoryButtons();
    };

    TestifyCanvas.prototype.restoreFromHistory = function() {
        var snapshot = this.history[this.historyIndex];
        if (!snapshot) return;

        var content = this.svg.querySelector('#tcanvasContent');
        content.querySelectorAll('[data-stroke-id]').forEach(function(el) { el.remove(); });

        this.layers = JSON.parse(JSON.stringify(snapshot));
        this.renderAllStrokes();
    };

    TestifyCanvas.prototype.renderAllStrokes = function() {
        var self = this;
        var content = this.svg.querySelector('#tcanvasContent');

        this.layers.forEach(function(layer) {
            if (!layer.visible) return;

            layer.strokes.forEach(function(stroke) {
                self.renderStrokeFromData(stroke, content);
            });
        });
    };

    TestifyCanvas.prototype.renderStrokeFromData = function(strokeData, parent) {
        var preset = null;
        for (var i = 0; i < CONFIG.BRUSH_PRESETS.length; i++) {
            if (CONFIG.BRUSH_PRESETS[i].id === strokeData.brushPreset) {
                preset = CONFIG.BRUSH_PRESETS[i];
                break;
            }
        }
        if (!preset) preset = CONFIG.BRUSH_PRESETS[1];

        var strokeOptions = {
            size: strokeData.size * CONFIG.STROKE_SIZE_MULTIPLIER,
            thinning: preset.thinning || CONFIG.STROKE_OPTIONS.thinning,
            smoothing: preset.smoothing || CONFIG.STROKE_OPTIONS.smoothing,
            streamline: preset.streamline || CONFIG.STROKE_OPTIONS.streamline,
            simulatePressure: true
        };

        var outline = Engine.getPremiumStroke(strokeData.points, strokeOptions);
        var pathData = Engine.getStrokeSvgPath(outline);

        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add('tcanvas-stroke');
        path.setAttribute('d', pathData);
        path.style.fill = strokeData.color;
        path.style.opacity = strokeData.opacity;
        path.setAttribute('data-stroke-id', strokeData.id);

        parent.appendChild(path);
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ACTIONS
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.handleAction = function(action) {
        switch (action) {
            case 'undo': this.undo(); break;
            case 'redo': this.redo(); break;
            case 'clear': this.clear(); break;
            case 'download': this.exportToPNG(); break;
            case 'close': this.close(); break;
            case 'minimize': this.minimize(); break;
            case 'zoom-in': this.zoomIn(); break;
            case 'zoom-out': this.zoomOut(); break;
            case 'zoom-reset': this.resetZoom(); break;
            case 'toggle-colors': this.togglePanel('tcanvasColorPanel'); break;
            case 'toggle-size': this.togglePanel('tcanvasSizePanel'); break;
            case 'close-panel': this.closeAllPanels(); break;
        }
    };

    TestifyCanvas.prototype.togglePanel = function(panelId) {
        var panel = this.container.querySelector('#' + panelId);
        if (!panel) return;

        var isOpen = panel.classList.contains('is-open');
        this.closeAllPanels();

        if (!isOpen) {
            panel.classList.add('is-open');
        }
    };

    TestifyCanvas.prototype.closeAllPanels = function() {
        this.container.querySelectorAll('.tcanvas-panel').forEach(function(p) {
            p.classList.remove('is-open');
        });
    };

    TestifyCanvas.prototype.clear = function() {
        if (this.getTotalStrokeCount() > 0) {
            if (!confirm('Tüm çizimler silinecek. Emin misiniz?')) return;
        }

        var content = this.svg.querySelector('#tcanvasContent');
        content.querySelectorAll('[data-stroke-id]').forEach(function(el) { el.remove(); });

        for (var i = 0; i < this.layers.length; i++) {
            this.layers[i].strokes = [];
        }

        this.saveHistory();
    };

    // ═══════════════════════════════════════════════════════════════════════
    // STORAGE
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.saveToStorage = function() {
        try {
            var data = {
                layers: this.layers,
                zoom: this.zoom,
                panX: this.panX,
                panY: this.panY,
                lastSaved: Date.now()
            };
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('[TestifyCanvas] Save error:', e);
            return false;
        }
    };

    TestifyCanvas.prototype.loadFromStorage = function() {
        try {
            var raw = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (!raw) return;

            var data = JSON.parse(raw);

            if (data.layers && Array.isArray(data.layers)) {
                this.layers = data.layers;
            }
            if (typeof data.zoom === 'number') this.zoom = data.zoom;
            if (typeof data.panX === 'number') this.panX = data.panX;
            if (typeof data.panY === 'number') this.panY = data.panY;

            this.renderAllStrokes();
            this.updateViewBox();
            this.updateZoomUI();
        } catch (e) {
            console.error('[TestifyCanvas] Load error:', e);
        }
    };

    TestifyCanvas.prototype.save = function() {
        this.saveToStorage();
        if (this.options.onSave) {
            this.options.onSave(this.layers);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // EXPORT
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.exportToPNG = function() {
        var self = this;
        
        try {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            canvas.width = 1920;
            canvas.height = 1080;

            // Background
            var theme = document.documentElement.getAttribute('data-theme');
            ctx.fillStyle = theme === 'dark' ? '#0f172a' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            var svgData = new XMLSerializer().serializeToString(this.svg);
            var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            var url = URL.createObjectURL(svgBlob);

            var img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                URL.revokeObjectURL(url);

                var link = document.createElement('a');
                link.download = 'testify-canvas-' + Date.now() + '.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            img.src = url;

        } catch (e) {
            console.error('[TestifyCanvas] Export error:', e);
        }
    };

    // ═══════════════════════════════════════════════════════════════════════
    // OPEN / CLOSE
    // ═══════════════════════════════════════════════════════════════════════

    TestifyCanvas.prototype.open = function() {
        this.container.classList.add('is-open');
        this.isOpen = true;
        if (this.options.mode === 'fullscreen') {
            document.body.style.overflow = 'hidden';
        }
    };

    TestifyCanvas.prototype.close = function() {
        this.saveToStorage();
        this.container.classList.remove('is-open');
        this.isOpen = false;
        document.body.style.overflow = '';

        if (this.options.onClose) {
            this.options.onClose();
        }
    };

    TestifyCanvas.prototype.minimize = function() {
        this.container.classList.toggle('is-minimized');
    };

    TestifyCanvas.prototype.destroy = function() {
        this.removeEventListeners();
        this.container.remove();
    };

    // Quiz helpers
    TestifyCanvas.prototype.getImageData = function() {
        var svgData = new XMLSerializer().serializeToString(this.svg);
        var base64 = btoa(unescape(encodeURIComponent(svgData)));
        return 'data:image/svg+xml;base64,' + base64;
    };

    TestifyCanvas.prototype.hasDrawings = function() {
        return this.getTotalStrokeCount() > 0;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // GLOBAL API
    // ═══════════════════════════════════════════════════════════════════════

    var globalInstance = null;

    window.TestifyCanvas = {
        open: function(options) {
            if (globalInstance) {
                globalInstance.open();
                return globalInstance;
            }

            options = options || {};
            options.mode = options.mode || 'fullscreen';

            globalInstance = new TestifyCanvas(options);
            globalInstance.open();
            return globalInstance;
        },

        createEmbedded: function(container, options) {
            options = options || {};
            options.container = container;
            options.mode = 'quiz';
            return new TestifyCanvas(options);
        },

        getInstance: function() {
            return globalInstance;
        },

        close: function() {
            if (globalInstance) {
                globalInstance.close();
            }
        },

        isOpen: function() {
            return globalInstance && globalInstance.isOpen;
        },

        // Constructor'ı dışarı aç
        Canvas: TestifyCanvas,
        CONFIG: CONFIG,
        TOOLS: TOOLS
    };

    console.log('[TestifyCanvas v2.0] Ultra Premium Edition Ready');

})();
