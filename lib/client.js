window.__ModuleLoader__.load({
	id: "dsh-skin-xp-vaporwave",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/city.ts
		const LIGHT_PALETTE = {
			sky: [
				"#2d174d",
				"#5a2a8c",
				"#9a5fc0",
				"#d68ad0"
			],
			sunColors: [
				"#fff1a8",
				"#ffabce",
				"#e08bff"
			],
			sunRim: "rgba(255, 150, 210, 0.6)",
			sunGlow: "rgba(255, 140, 200, 0.45)",
			disc: "rgba(230, 150, 220, 0.45)",
			fog: "rgba(40, 20, 70, 0.4)",
			fillLayers: ["#4a3a78", "#5a4688"],
			cap: "rgba(255, 140, 200, 0.55)",
			windowColors: [
				"#5dffbc",
				"#ff9ad5",
				"#7dd3fc",
				"#ffd34d",
				"#d0b0ff"
			],
			starColors: [
				"#7dd3fc",
				"#ff9ad5",
				"#ffe9a8",
				"#d0b0ff"
			],
			radialRgb: [
				0,
				200,
				255
			],
			depthRgb: [
				255,
				140,
				200
			]
		};
		const DARK_PALETTE = {
			sky: [
				"#04010f",
				"#0d0530",
				"#2a0a52",
				"#3d0d63"
			],
			sunColors: [
				"#ffd319",
				"#ff2d95",
				"#b026ff"
			],
			sunRim: "rgba(255, 120, 200, 0.6)",
			sunGlow: "rgba(255, 45, 149, 0.5)",
			disc: "rgba(150, 40, 120, 0.5)",
			fog: "rgba(10, 3, 30, 0.55)",
			fillLayers: ["#0d0628", "#170a3a"],
			cap: "rgba(255, 45, 149, 0.6)",
			windowColors: [
				"#2bffc8",
				"#ff4fd8",
				"#ffd34d",
				"#ff5fa2",
				"#7df9ff"
			],
			starColors: [
				"#00f0ff",
				"#ff2d95",
				"#ffd34d",
				"#b388ff"
			],
			radialRgb: [
				0,
				240,
				255
			],
			depthRgb: [
				255,
				45,
				149
			]
		};
		/** Deterministic 0..1 hash for jitter/LOD decisions (no Math.random). */
		function hash01(n) {
			let x = Math.imul(n ^ n >>> 16, 73244475);
			x = Math.imul(x ^ x >>> 16, 73244475);
			x = x ^ x >>> 16;
			return (x >>> 0) / 4294967296;
		}
		/**
		* Lay out the skyline and stars for a viewport. Call on resize and at create.
		* @param scene - the scene to lay out.
		* @param viewport - the current CSS-pixel viewport.
		*/
		function layoutScene(scene, viewport) {
			const width = viewport.width;
			const height = viewport.height;
			scene.horizon = height * .42;
			scene.sun.cx = width / 2;
			scene.sun.r = Math.min(width * .17, 170);
			scene.sun.cy = scene.horizon - scene.sun.r * .28;
			buildSkyline(scene, width, scene.horizon);
			buildStars(scene, width, scene.horizon);
			buildFigures(scene, width, height, scene.horizon);
			buildEmojis(scene, width, height);
		}
		/**
		* Build an empty scene; geometry is filled by {@link layoutScene} for the
		* current viewport.
		* @param viewport - the starting viewport.
		* @returns an empty scene ready to be laid out.
		*/
		function createScene(viewport) {
			const scene = {
				horizon: 0,
				sun: {
					cx: 0,
					cy: 0,
					r: 0
				},
				buildings: [],
				stars: [],
				figures: [],
				emojis: [],
				speed: .1,
				gridRows: 16,
				time: 0
			};
			layoutScene(scene, viewport);
			return scene;
		}
		/**
		* Advance the scene one step: accumulate time so twinkle, pulse, and the
		* depth-line scroll update on the next frame.
		* @param scene - the scene to advance.
		* @param dt - elapsed seconds since the last frame.
		*/
		function advanceScene(scene, dt) {
			scene.time += dt;
		}
		function buildSkyline(scene, width, horizon) {
			const buildings = [];
			let seed = 11;
			for (const layer of [{
				minW: 48,
				maxW: 110,
				hm: .3,
				layer: 0,
				prob: .26
			}, {
				minW: 64,
				maxW: 150,
				hm: .52,
				layer: 1,
				prob: .32
			}]) {
				let x = -30;
				while (x < width + 40 && buildings.length < 42) {
					const w = layer.minW + hash01(seed++) * (layer.maxW - layer.minW);
					const h = horizon * layer.hm * (.35 + hash01(seed++) * .7);
					const windows = [];
					const cw = 7;
					const ch = 10;
					const ox = 5;
					const oy = 6;
					const cols = Math.max(1, Math.floor((w - ox * 2) / cw));
					const rows = Math.max(1, Math.floor((h - oy) / ch));
					for (let r = 0; r < rows && windows.length < 30; r += 1) for (let c = 0; c < cols && windows.length < 30; c += 1) if (hash01(seed++) < layer.prob) windows.push({
						fx: (ox + c * cw + 1) / w,
						fy: (oy + r * ch + 1) / h,
						size: cw * .6,
						ci: Math.floor(hash01(seed++) * 5) % 5,
						phase: hash01(seed++) * Math.PI * 2
					});
					buildings.push({
						x,
						w,
						h,
						layer: layer.layer,
						windows
					});
					x += w + (layer.layer === 0 ? 4 + hash01(seed++) * 18 : 0);
				}
			}
			scene.buildings = buildings;
		}
		function buildStars(scene, width, horizon) {
			const stars = [];
			for (let i = 0; i < 60; i += 1) stars.push({
				x: hash01(i * 3 + 1) * width,
				y: hash01(i * 3 + 2) * horizon * .9,
				size: .6 + hash01(i * 3 + 3) * 1.5,
				ci: Math.floor(hash01(i * 3 + 4) * 4) % 4,
				phase: hash01(i * 3 + 5) * Math.PI * 2
			});
			scene.stars = stars;
		}
		/** Clay-figure shades: [highlight, base, shadow]. */
		const CLAY_FIGURES = [
			[
				"#ffc08a",
				"#ff8a3d",
				"#8a3a12"
			],
			[
				"#9adcff",
				"#4fc3f7",
				"#175a7d"
			],
			[
				"#c6e8a5",
				"#9ccc65",
				"#3f6a1c"
			],
			[
				"#ff9ecb",
				"#ff5fa2",
				"#8f2353"
			],
			[
				"#ffe68a",
				"#ffd54f",
				"#8f6b10"
			],
			[
				"#d5c2ff",
				"#b388ff",
				"#54308f"
			],
			[
				"#a8ecef",
				"#4dd0e1",
				"#17606b"
			],
			[
				"#ffa79a",
				"#ef5350",
				"#7c1f1d"
			]
		];
		/** Floating emoji set (plus a neon glow colour per emoji). */
		const FLOAT_EMOJIS = [
			{
				char: "😵",
				glow: "rgba(0, 240, 255, 0.30)"
			},
			{
				char: "👾",
				glow: "rgba(255, 45, 149, 0.34)"
			},
			{
				char: "🛸",
				glow: "rgba(180, 140, 255, 0.32)"
			},
			{
				char: "💾",
				glow: "rgba(0, 240, 255, 0.30)"
			},
			{
				char: "📀",
				glow: "rgba(255, 45, 149, 0.34)"
			},
			{
				char: "⚡",
				glow: "rgba(255, 211, 77, 0.36)"
			},
			{
				char: "🔮",
				glow: "rgba(255, 45, 149, 0.34)"
			},
			{
				char: "🧠",
				glow: "rgba(255, 94, 190, 0.34)"
			},
			{
				char: "✨",
				glow: "rgba(255, 232, 138, 0.36)"
			},
			{
				char: "📡",
				glow: "rgba(0, 240, 255, 0.30)"
			},
			{
				char: "👁",
				glow: "rgba(180, 140, 255, 0.32)"
			},
			{
				char: "💀",
				glow: "rgba(255, 45, 149, 0.34)"
			}
		];
		function buildFigures(scene, width, height, horizon) {
			const figures = [];
			for (let i = 0; i < 6; i += 1) {
				const pal = CLAY_FIGURES[i % CLAY_FIGURES.length];
				const seed = i * 13 + 401;
				figures.push({
					light: pal[0],
					base: pal[1],
					dark: pal[2],
					baseX: width * (.08 + hash01(seed) * .84),
					baseY: horizon + (height - horizon) * (.35 + hash01(seed + 1) * .62),
					size: 16 + hash01(seed + 2) * 13,
					ampX: 26 + hash01(seed + 3) * 34,
					ampY: 16 + hash01(seed + 4) * 22,
					wa: .5 + hash01(seed + 5) * .6,
					wb: .42 + hash01(seed + 6) * .7,
					pa: hash01(seed + 7) * Math.PI * 2,
					pb: hash01(seed + 8) * Math.PI * 2,
					jiggle: hash01(seed + 9) * Math.PI * 2
				});
			}
			scene.figures = figures;
		}
		function buildEmojis(scene, width, height) {
			const emojis = [];
			for (let i = 0; i < 16; i += 1) {
				const spec = FLOAT_EMOJIS[i % FLOAT_EMOJIS.length];
				const seed = i * 29 + 2027;
				emojis.push({
					char: spec.char,
					glow: spec.glow,
					baseX: width * (.05 + hash01(seed) * .9),
					baseY: height * (.18 + hash01(seed + 1) * .75),
					size: 18 + hash01(seed + 2) * 20,
					amp: 8 + hash01(seed + 3) * 14,
					phase: hash01(seed + 4) * Math.PI * 2,
					rot: hash01(seed + 5) * Math.PI * 2,
					vr: (hash01(seed + 6) - .5) * 1.2,
					alpha: .4 + hash01(seed + 7) * .4
				});
			}
			scene.emojis = emojis;
		}
		/** Build an `rgba(r,g,b,a)` string. */
		function rgba(rgb, alpha) {
			return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha.toFixed(3)})`;
		}
		/** Draw the retro sun: a glow, an uninterrupted gradient disc, and a rim. */
		function drawSun(ctx, scene, palette) {
			const { cx, cy } = scene.sun;
			const radius = scene.sun.r * (1 + .02 * Math.sin(scene.time * .8));
			const glowRadius = radius * 2.3;
			const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
			glow.addColorStop(0, palette.sunGlow);
			glow.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = glow;
			ctx.fillRect(cx - glowRadius, cy - glowRadius, glowRadius * 2, glowRadius * 2);
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			const disc = ctx.createLinearGradient(0, cy - radius, 0, cy + radius);
			palette.sunColors.forEach((color, index) => disc.addColorStop(index / (palette.sunColors.length - 1), color));
			ctx.fillStyle = disc;
			ctx.fill();
			ctx.strokeStyle = palette.sunRim;
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.arc(cx, cy, radius, 0, Math.PI * 2);
			ctx.stroke();
		}
		/** Draw the skyline silhouette and its twinkling windows. */
		function drawBuildings(ctx, scene, palette) {
			for (const building of scene.buildings) {
				const left = building.x;
				const top = scene.horizon - building.h;
				ctx.fillStyle = palette.fillLayers[building.layer];
				ctx.fillRect(left, top, building.w, building.h);
				ctx.fillStyle = palette.cap;
				ctx.fillRect(left, top, building.w, 2);
				for (const cell of building.windows) {
					const cx = left + cell.fx * building.w;
					const cy = top + cell.fy * building.h;
					const size = cell.size * (building.h / 120);
					ctx.globalAlpha = .4 + .6 * Math.abs(Math.sin(scene.time * 2.2 + cell.phase));
					ctx.fillStyle = palette.windowColors[cell.ci % palette.windowColors.length];
					ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
				}
				ctx.globalAlpha = 1;
			}
		}
		/** Draw the perspective grid floor: cyan radial lines + scrolling pink depth lines. */
		function drawGrid(ctx, scene, viewport, palette) {
			const width = viewport.width;
			const height = viewport.height;
			const cx = width / 2;
			const horizon = scene.horizon;
			const floor = height - horizon;
			const cols = 22;
			for (let i = 0; i <= cols; i += 1) {
				const k = i / cols - .5;
				const topX = cx + k * width * .32;
				const bottomX = cx + k * width * 1.7;
				ctx.strokeStyle = rgba(palette.radialRgb, .14);
				ctx.lineWidth = 2.5;
				ctx.beginPath();
				ctx.moveTo(topX, horizon);
				ctx.lineTo(bottomX, height);
				ctx.stroke();
				ctx.strokeStyle = rgba(palette.radialRgb, .35);
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(topX, horizon);
				ctx.lineTo(bottomX, height);
				ctx.stroke();
			}
			for (let i = 0; i < scene.gridRows; i += 1) {
				const prog = (i / scene.gridRows + scene.time * scene.speed) % 1;
				const y = horizon + Math.pow(prog, 2.5) * floor;
				const alpha = prog * .85;
				ctx.strokeStyle = rgba(palette.depthRgb, alpha * .16);
				ctx.lineWidth = 3;
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
				ctx.strokeStyle = rgba(palette.depthRgb, alpha * .85);
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}
		}
		/** Draw the glowing disc on the ground beneath the sun. */
		function drawDisc(ctx, scene, viewport, palette) {
			const cx = viewport.width / 2;
			const cy = scene.horizon + viewport.height * .1;
			const radius = viewport.height * .3;
			const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
			gradient.addColorStop(0, palette.disc);
			gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.globalAlpha = .5 + .25 * Math.sin(scene.time * 1.2);
			ctx.fillStyle = gradient;
			ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
			ctx.globalAlpha = 1;
		}
		/** Draw one clay figure (glow, body, head, eyes) at its current position. */
		function drawFigure(ctx, figure, x, y, time) {
			const r = figure.size;
			const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4);
			glow.addColorStop(0, "rgba(255, 255, 255, 0.28)");
			glow.addColorStop(1, "rgba(0, 0, 0, 0)");
			ctx.fillStyle = glow;
			ctx.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
			const body = ctx.createLinearGradient(x, y - r, x, y + r);
			body.addColorStop(0, figure.light);
			body.addColorStop(.5, figure.base);
			body.addColorStop(1, figure.dark);
			ctx.fillStyle = body;
			ctx.beginPath();
			ctx.ellipse(x, y, r * .5, r * .62, 0, 0, Math.PI * 2);
			ctx.fill();
			const headY = y - r * .72;
			const head = ctx.createLinearGradient(x, headY - r * .36, x, headY + r * .36);
			head.addColorStop(0, figure.light);
			head.addColorStop(.55, figure.base);
			head.addColorStop(1, figure.dark);
			ctx.fillStyle = head;
			ctx.beginPath();
			ctx.arc(x, headY, r * .33, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
			const eyeY = headY - r * .02;
			const bob = Math.sin(time * 3 + figure.jiggle) * r * .05;
			ctx.fillRect(x - r * .16, eyeY + bob, r * .1, r * .1);
			ctx.fillRect(x + r * .06, eyeY + bob, r * .1, r * .1);
			ctx.strokeStyle = figure.dark;
			ctx.lineWidth = 1.4;
			ctx.beginPath();
			ctx.ellipse(x, y, r * .5, r * .62, 0, 0, Math.PI * 2);
			ctx.stroke();
		}
		/** Draw the flying clay figures, depth-sorted so nearer ones overlap. */
		function drawFigures(ctx, scene) {
			const ordered = scene.figures.map((figure) => {
				return {
					figure,
					x: figure.baseX + figure.ampX * Math.sin(figure.wa * scene.time + figure.pa),
					y: figure.baseY + figure.ampY * Math.sin(figure.wb * scene.time + figure.pb) + Math.sin(scene.time * 1.7 + figure.jiggle) * 7
				};
			}).sort((a, b) => a.y - b.y);
			for (const { figure, x, y } of ordered) drawFigure(ctx, figure, x, y, scene.time);
		}
		/** Draw the floating emojis (neon glow + drift + slow rotation). */
		function drawEmojis(ctx, scene) {
			for (const emoji of scene.emojis) {
				const x = emoji.baseX + Math.sin(scene.time * 1.4 + emoji.phase) * emoji.amp;
				const y = emoji.baseY + Math.cos(scene.time * 1.1 + emoji.phase) * emoji.amp;
				const radius = emoji.size * 1.5;
				const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
				glow.addColorStop(0, emoji.glow);
				glow.addColorStop(1, "rgba(0, 0, 0, 0)");
				ctx.fillStyle = glow;
				ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(emoji.rot + scene.time * emoji.vr);
				ctx.globalAlpha = emoji.alpha * (.8 + .2 * Math.sin(scene.time * 3 + emoji.phase));
				ctx.font = `${emoji.size}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(emoji.char, 0, 0);
				ctx.restore();
				ctx.globalAlpha = 1;
			}
		}
		/**
		* Draw a full frame: sky, stars, sun, skyline, fog, ground disc, grid,
		* flying figures, and floating emojis.
		* @param ctx - the 2D context (already transformed by dpr).
		* @param scene - the scene to render.
		* @param viewport - the current CSS-pixel viewport.
		* @param dark - whether the dark night palette applies.
		*/
		function drawFrame(ctx, scene, viewport, dark) {
			const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
			const width = viewport.width;
			const height = viewport.height;
			ctx.clearRect(0, 0, width, height);
			const sky = ctx.createLinearGradient(0, 0, 0, height);
			palette.sky.forEach((color, index) => sky.addColorStop(index / (palette.sky.length - 1), color));
			ctx.fillStyle = sky;
			ctx.fillRect(0, 0, width, height);
			for (const star of scene.stars) {
				ctx.globalAlpha = .3 + .5 * Math.abs(Math.sin(scene.time * 2 + star.phase));
				ctx.fillStyle = palette.starColors[star.ci % palette.starColors.length];
				ctx.fillRect(star.x, star.y, star.size, star.size);
			}
			ctx.globalAlpha = 1;
			drawSun(ctx, scene, palette);
			drawBuildings(ctx, scene, palette);
			const fog = ctx.createLinearGradient(0, scene.horizon - 60, 0, scene.horizon);
			fog.addColorStop(0, "rgba(0, 0, 0, 0)");
			fog.addColorStop(1, palette.fog);
			ctx.fillStyle = fog;
			ctx.fillRect(0, scene.horizon - 60, width, 60);
			drawDisc(ctx, scene, viewport, palette);
			drawGrid(ctx, scene, viewport, palette);
			drawFigures(ctx, scene);
			drawEmojis(ctx, scene);
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
			for (let y = 0; y < height; y += 4) ctx.fillRect(0, y, width, 1);
			const vignette = ctx.createRadialGradient(width / 2, height * .46, height * .35, width / 2, height * .5, height * .85);
			vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
			vignette.addColorStop(1, "rgba(3, 0, 14, 0.5)");
			ctx.fillStyle = vignette;
			ctx.fillRect(0, 0, width, height);
		}
		/** The browser-side gate: only a real canvas-with-2d-context browser proceeds. */
		function supportsCityRenderer() {
			if (typeof document === "undefined" || typeof requestAnimationFrame === "undefined" || typeof matchMedia === "undefined") return false;
			const probe = document.createElement("canvas");
			return typeof probe.getContext === "function" && probe.getContext("2d") !== null;
		}
		/**
		* Mount the cyberpunk backdrop canvas. Attaches nothing and returns a no-op
		* when the active skin is not the one this renderer belongs to, and tears the
		* canvas, RAF loop, and every listener down when the returned disposer runs.
		* @param ctx - the client context (for the theme service and the theme/change event).
		* @param skinId - the skin id that gates the renderer (e.g. `xp-vaporwave`).
		* @returns a disposer that unregisters the renderer.
		*/
		function attachCityFlyover(ctx, skinId) {
			if (!supportsCityRenderer()) return () => {};
			const canvas = document.createElement("canvas");
			canvas.className = "dsh-skin-3d";
			canvas.setAttribute("aria-hidden", "true");
			const style = canvas.style;
			style.position = "fixed";
			style.inset = "0";
			style.width = "100%";
			style.height = "100%";
			style.zIndex = "-1";
			style.pointerEvents = "none";
			style.display = "none";
			const context = canvas.getContext("2d");
			if (context === null) return () => {};
			const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
			const viewport = {
				width: 0,
				height: 0
			};
			const scene = createScene(viewport);
			let dark = false;
			let started = false;
			let running = false;
			let raf = 0;
			let last = 0;
			let attached = false;
			const attach = () => {
				if (attached) return;
				attached = true;
				document.body.appendChild(canvas);
			};
			const resize = () => {
				const width = window.innerWidth;
				const height = window.innerHeight;
				viewport.width = width;
				viewport.height = height;
				const dpr = Math.min(window.devicePixelRatio || 1, 2);
				canvas.width = Math.max(1, Math.round(width * dpr));
				canvas.height = Math.max(1, Math.round(height * dpr));
				context.setTransform(dpr, 0, 0, dpr, 0, 0);
				layoutScene(scene, viewport);
			};
			const drawOnce = () => {
				drawFrame(context, scene, viewport, dark);
			};
			const frame = (time) => {
				raf = 0;
				if (!running) return;
				const dt = Math.min((time - last) / 1e3, .05);
				last = time;
				advanceScene(scene, dt);
				drawFrame(context, scene, viewport, dark);
				raf = requestAnimationFrame(frame);
			};
			const pause = () => {
				if (!running) return;
				running = false;
				if (raf !== 0) {
					cancelAnimationFrame(raf);
					raf = 0;
				}
			};
			const resume = () => {
				if (!started || running || reduceMotion.matches) return;
				running = true;
				last = performance.now();
				raf = requestAnimationFrame(frame);
			};
			const start = () => {
				if (started) return;
				started = true;
				attach();
				resize();
				style.display = "block";
				if (reduceMotion.matches) drawOnce();
				else resume();
			};
			const stop = () => {
				if (!started) return;
				started = false;
				pause();
				style.display = "none";
			};
			const syncTheme = (snapshot) => {
				dark = snapshot.active.colorScheme === "dark";
				if (snapshot.skinId === skinId !== started) if (snapshot.skinId === skinId) start();
				else stop();
				else if (started && reduceMotion.matches) drawOnce();
			};
			const onResize = () => {
				if (!started) return;
				resize();
				if (reduceMotion.matches) drawOnce();
			};
			const onVisibility = () => {
				if (document.hidden) pause();
				else resume();
			};
			const onReduceMotion = () => {
				if (reduceMotion.matches) pause();
				else resume();
			};
			const offTheme = ctx.on("theme/change", syncTheme);
			window.addEventListener("resize", onResize);
			document.addEventListener("visibilitychange", onVisibility);
			reduceMotion.addEventListener("change", onReduceMotion);
			syncTheme(ctx.theme.getTheme());
			return () => {
				stop();
				offTheme();
				window.removeEventListener("resize", onResize);
				document.removeEventListener("visibilitychange", onVisibility);
				reduceMotion.removeEventListener("change", onReduceMotion);
				canvas.remove();
			};
		}
		//#endregion
		//#region \0dsh-inline-css:C:\Users\guoha\Desktop\deepseek-harness-master\packages\client\ui-skin-xp-vaporwave\src\skins\xp-vaporwave.css.mjs
		var xp_vaporwave_css_default = "body[data-ds-skin=xp-vaporwave]{--dsw-alias-bg-mask-1:#3c145a73;--dsw-alias-bg-mask-2:#3c145a40;--dsw-alias-bg-mask-3:#3c145a99;--dsw-alias-bg-mask-photo:#1e0a32e0;--dsw-alias-bg-mask-drop:#ffffffbf;--dsw-alias-bg-skeleton:#3c145a14;--dsw-alias-border-inverted2:#e01e5a40;--dsw-alias-border-inverted:#e01e5a33;--dsw-alias-border-l1:#e01e5a24;--dsw-alias-border-l2-darkmode-thin:#0096d647;--dsw-alias-border-l2:#0096d647;--dsw-alias-border-l3:#e01e5a4d;--dsw-alias-border-l4:#e01e5a66;--dsw-alias-brand-primary:#0096d6;--dsw-alias-brand-text:#0072a8;--dsw-alias-brand-primary-invert:#fff;--dsw-alias-label-primary:#2a1a3a;--dsw-alias-label-secondary:#5c4a70;--dsw-alias-label-tertiary:#84738f;--dsw-alias-label-dimmed:#a08fa8;--dsw-alias-label-caption:#8f7da0;--dsw-alias-label-primary-foreground:#fff;--dsw-alias-label-primary-inverted:#fff;--dsw-alias-label-primary-bluish:#3d2b63;--dsw-alias-button-primary-fill:#0096d6;--dsw-alias-button-primary-hover:#0ba7e8;--dsw-alias-button-primary-dimmed:#0096d61f;--dsw-alias-button-info-fill:#e0218a;--dsw-alias-button-info-hover:#ef3a9c;--dsw-alias-button-contrast-fill:#3d2b63;--dsw-alias-button-elevated-fill:#fff;--dsw-alias-button-floating-fill:#ffffffeb;--dsw-alias-button-floating-hover:#fff0faf5;--dsw-alias-button-ghost-active-border:#0096d6;--dsw-alias-button-ghost-active-fill:#0096d61a;--dsw-alias-button-ghost-active-hover:#0096d629;--dsw-alias-button-tool-bar-fill:#e01e5a33;--dsw-alias-button-tool-bar-hover:#e01e5a47;--dsw-alias-button-tool-bar-fill-invisible:#e01e5a1f;--dsw-alias-interactive-bg-hover:#0096d614;--dsw-alias-interactive-bg-hover-accent:#e01e5a1a;--dsw-alias-interactive-bg-active:#0096d624;--dsw-alias-interactive-bg-hover-solid:#3c145a0f;--dsw-alias-interactive-bg-hover-danger:#e01e5a14;--dsw-alias-state-business-primary:#e0218a;--dsw-alias-state-business-tertiary:#e01e5a14;--dsw-alias-state-error-primary:#e01e5a;--dsw-alias-state-error-secondary:#ef4d7e;--dsw-alias-state-success-primary:#0aa06a;--dsw-alias-state-success-secondary:#2bbd86;--dsw-alias-state-success-tertiary:#0aa06a1a;--dsw-alias-state-warn-label:#d97706;--dsw-alias-state-warn-primary:#d99a00;--dsw-alias-state-warn-secondary:#e8ad1a;--dsw-alias-state-warn-tertiary:#d99a001f;--dsw-alias-markdown-citation:#0096d61a;--dsw-alias-markdown-code-block-banner:#fffafdf5;--dsw-alias-markdown-code-block:#fffafdf0;--dsw-alias-markdown-code-segment-selected:#0096d624;--dsw-alias-markdown-code-segment-unselected:#3c145a0a;--dsw-alias-markdown-inline-code:#e01e5a1a;--dsw-alias-markdown-placeholder:#3c145a0d;--dsw-alias-markdown-tag:#0096d61a;--dsw-alias-scrollbar-bg-l1:#c9a8d8;--dsw-alias-scrollbar-bg-l2:#bd96d0;--dsw-alias-scrollbar-hover-l1:#a87bc0;--dsw-alias-scrollbar-hover-l2:#9a6cb4;--dsw-alias-toast-bg:#3d2b63;--dsw-alias-tooltip-bg:#6b4bc0;--dsw-specific-sidebar-nav-item-active-accent:#0096d624;--dsw-specific-sidebar-nav-item-active:#0096d614;--dsw-specific-sidebar-nav-item-hover:#3c145a0f;--dsw-specific-tip:#d99a001a;--dsw-font-family:Tahoma, \"Segoe UI\", \"Microsoft YaHei\", \"PingFang SC\", sans-serif;background-color:#ffeef7;--dsw-alias-bg-base:#fffcfff5!important;--dsw-alias-bg-layer-1:#fffcfff7!important;--dsw-alias-bg-layer-2:#fffdfffa!important;--dsw-alias-bg-layer-3:#fffdfffb!important;--dsw-alias-bg-overlay:#fffcfffc!important;--dsw-alias-bg-module-platform:#fffcfff5!important;--dsw-alias-bg-multi-select:#fffcfff5!important;--dsw-specific-bubble:#fffcfff5!important;--dsw-specific-bubble-highlight:#fffcfffa!important;--dsw-specific-input-major:#fff!important;--dsw-specific-login-input:#fff!important;--dsw-specific-menu:#fffcfffc!important;--dsw-specific-selector:#fffafffa!important;--dsw-specific-sidebar-fill:#fffaffe6!important}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme]{--dsw-alias-bg-mask-1:#04010a99;--dsw-alias-bg-mask-2:#04010a66;--dsw-alias-bg-mask-3:#04010ab3;--dsw-alias-bg-mask-photo:#04010ae0;--dsw-alias-bg-mask-drop:#2b0c4abf;--dsw-alias-bg-skeleton:#ffffff0f;--dsw-alias-border-inverted2:#01cdfe4d;--dsw-alias-border-inverted:#01cdfe3d;--dsw-alias-border-l1:#ff71ce38;--dsw-alias-border-l2-darkmode-thin:#01cdfe4d;--dsw-alias-border-l2:#01cdfe4d;--dsw-alias-border-l3:#ff71ce66;--dsw-alias-border-l4:#ff2d6d80;--dsw-alias-brand-primary:#01cdfe;--dsw-alias-brand-text:#01cdfe;--dsw-alias-brand-primary-invert:#0e0220;--dsw-alias-label-primary:#f7f0ff;--dsw-alias-label-secondary:#ded1f0;--dsw-alias-label-tertiary:#b4a3cc;--dsw-alias-label-dimmed:#8a76a6;--dsw-alias-label-caption:#ab9ac2;--dsw-alias-label-primary-foreground:#0e0220;--dsw-alias-label-primary-inverted:#0e0220;--dsw-alias-label-primary-bluish:#d2c2f2;--dsw-alias-button-primary-fill:#01cdfe;--dsw-alias-button-primary-hover:#2bd9ff;--dsw-alias-button-primary-dimmed:#01cdfe29;--dsw-alias-button-info-fill:#ff71ce;--dsw-alias-button-info-hover:#ff8ad8;--dsw-alias-button-contrast-fill:#d9c7f5;--dsw-alias-button-elevated-fill:#ffffff14;--dsw-alias-button-floating-fill:#280e4eeb;--dsw-alias-button-floating-hover:#321460f5;--dsw-alias-button-ghost-active-border:#01cdfe;--dsw-alias-button-ghost-active-fill:#01cdfe29;--dsw-alias-button-ghost-active-hover:#01cdfe3d;--dsw-alias-button-tool-bar-fill:#ff71ce52;--dsw-alias-button-tool-bar-hover:#ff71ce6b;--dsw-alias-button-tool-bar-fill-invisible:#ff71ce38;--dsw-alias-interactive-bg-hover:#01cdfe1f;--dsw-alias-interactive-bg-hover-accent:#ff71ce2e;--dsw-alias-interactive-bg-active:#01cdfe33;--dsw-alias-interactive-bg-hover-solid:#ffffff1a;--dsw-alias-interactive-bg-hover-danger:#ff2a6d29;--dsw-alias-state-business-primary:#ff71ce;--dsw-alias-state-business-tertiary:#ff71ce29;--dsw-alias-state-error-primary:#ff2a6d;--dsw-alias-state-error-secondary:#ff6b99;--dsw-alias-state-success-primary:#0aff9d;--dsw-alias-state-success-secondary:#5dffbc;--dsw-alias-state-success-tertiary:#0aff9d24;--dsw-alias-state-warn-label:#ffd319;--dsw-alias-state-warn-primary:#ffd319;--dsw-alias-state-warn-secondary:#ffc94d;--dsw-alias-state-warn-tertiary:#ffd31929;--dsw-alias-markdown-citation:#01cdfe24;--dsw-alias-markdown-code-block-banner:#000000d9;--dsw-alias-markdown-code-block:#000c;--dsw-alias-markdown-code-segment-selected:#01cdfe2e;--dsw-alias-markdown-code-segment-unselected:#ffffff0a;--dsw-alias-markdown-inline-code:#ff71ce29;--dsw-alias-markdown-placeholder:#ffffff0d;--dsw-alias-markdown-tag:#01cdfe24;--dsw-alias-scrollbar-bg-l1:#3b2a5c;--dsw-alias-scrollbar-bg-l2:#4a3680;--dsw-alias-scrollbar-hover-l1:#5c3fa8;--dsw-alias-scrollbar-hover-l2:#6b4bc0;--dsw-alias-toast-bg:#180732f7;--dsw-alias-tooltip-bg:#241145;--dsw-specific-sidebar-nav-item-active-accent:#01cdfe38;--dsw-specific-sidebar-nav-item-active:#01cdfe24;--dsw-specific-sidebar-nav-item-hover:#ffffff14;--dsw-specific-tip:#ffd3191f;--dsw-font-family:Tahoma, \"Segoe UI\", \"Microsoft YaHei\", \"PingFang SC\", sans-serif;background-color:#12042a;--dsw-alias-bg-base:#04020cf2!important;--dsw-alias-bg-layer-1:#060310f5!important;--dsw-alias-bg-layer-2:#080412f7!important;--dsw-alias-bg-layer-3:#0a0516fa!important;--dsw-alias-bg-overlay:#180732fc!important;--dsw-alias-bg-module-platform:#060310f5!important;--dsw-alias-bg-multi-select:#060310f5!important;--dsw-specific-bubble:#060310f0!important;--dsw-specific-bubble-highlight:#060310f7!important;--dsw-specific-input-major:#060310f0!important;--dsw-specific-login-input:#060310f0!important;--dsw-specific-menu:#060310fc!important;--dsw-specific-selector:#060310f0!important;--dsw-specific-sidebar-fill:#05030eeb!important}body[data-ds-skin=xp-vaporwave]:before{display:none}body[data-ds-skin=xp-vaporwave] canvas.dsh-skin-3d{z-index:-1;pointer-events:none;filter:saturate(1.4)contrast(1.12)brightness(1.02)hue-rotate(-8deg);width:100%;height:100%;position:fixed;inset:0}body[data-ds-skin=xp-vaporwave]:not([data-ds-dark-theme]) [data-phase=active]:has(>[data-conversation-scroll]){background:#fff6}body[data-ds-skin=xp-vaporwave] button{background-image:linear-gradient(#ffffff8c,#fff0 46%,#0000001a);border:2px outset #868ca0;border-color:#fff #868ca0 #868ca0 #fff}body[data-ds-skin=xp-vaporwave] button:hover:not(:disabled){background-image:linear-gradient(#ffffffbf,#fff0 46%,#0000000f)}body[data-ds-skin=xp-vaporwave] button:active:not(:disabled){background-image:linear-gradient(#0000001f,#ffffff26 60%);border-style:inset;border-color:#868ca0 #fff #fff #868ca0}body[data-ds-skin=xp-vaporwave] button:disabled{opacity:.55}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] button{border-color:#7a5fb0 #16042c #16042c #7a5fb0}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] button:active:not(:disabled){border-color:#16042c #7a5fb0 #7a5fb0 #16042c}body[data-ds-skin=xp-vaporwave] input,body[data-ds-skin=xp-vaporwave] textarea{border:1px solid #7f9db9;box-shadow:inset 1px 1px #00000026,inset -1px -1px #ffffff14}body[data-ds-skin=xp-vaporwave] input:focus,body[data-ds-skin=xp-vaporwave] textarea:focus{border-color:#ff8c00;box-shadow:inset 1px 1px #00000026,inset -1px -1px #ffffff14,0 0 0 1px #ff8c00}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] input,body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] textarea{border-color:#4a3680;box-shadow:inset 1px 1px #0006,inset -1px -1px #ffffff0d}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] input:focus,body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] textarea:focus{border-color:#ff8c00;box-shadow:inset 1px 1px #0006,inset -1px -1px #ffffff0d,0 0 0 1px #ff8c00}body[data-ds-skin=xp-vaporwave] :has(textarea),body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] :has(textarea){box-shadow:none;background:0 0;border-color:#0000}body[data-ds-skin=xp-vaporwave] :has(textarea) :is(input,textarea,select),body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] :has(textarea) :is(input,textarea,select),body[data-ds-skin=xp-vaporwave] :has(textarea) :is(input,textarea):focus,body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] :has(textarea) :is(input,textarea):focus{box-shadow:none;border-color:#0000}body[data-ds-skin=xp-vaporwave] :has(textarea) :is(input,textarea):focus-visible,body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] :has(textarea) :is(input,textarea):focus-visible{outline:none}body[data-ds-skin=xp-vaporwave] :focus-visible{outline-offset:1px;outline:2px solid #ff8c00}body[data-ds-skin=xp-vaporwave] ::selection{color:#fff;background:#316ac5}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] ::selection{color:#f2e8ff;background:#6b2fa0}body[data-ds-skin=xp-vaporwave] ::-webkit-scrollbar{width:12px;height:12px}body[data-ds-skin=xp-vaporwave] ::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#bd96d0,#9a6cb4);border:1px solid #00000040;border-radius:6px}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme] ::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#4a3680,#6b4bc0);border-color:#00000080}body[data-ds-skin=xp-vaporwave]{--shiki-token-constant:#0b84d0;--shiki-token-string:#0aa06a;--shiki-token-comment:#84738f;--shiki-token-keyword:#c2255c;--shiki-token-parameter:#e8590c;--shiki-token-function:#7048e8;--shiki-token-string-expression:#2b8a3e;--shiki-token-punctuation:#495057;--shiki-token-link:#1971c2}body[data-ds-skin=xp-vaporwave][data-ds-dark-theme]{--shiki-token-constant:#01cdfe;--shiki-token-string:#0aff9d;--shiki-token-comment:#8f7ab0;--shiki-token-keyword:#ff71ce;--shiki-token-parameter:#ffd319;--shiki-token-function:#b197fc;--shiki-token-string-expression:#5dffbc;--shiki-token-punctuation:#cdbce2;--shiki-token-link:#7dd3fc}";
		//#endregion
		//#region src/client/index.ts
		/** Locale namespace carrying skin display labels, keyed `skin.<id>`. */
		const SKIN_LOCALE_NS = "settings.skin";
		/** The skin id this package registers. */
		const SKIN_ID = "xp-vaporwave";
		/** The skin definition this package registers. */
		const SKIN = {
			id: SKIN_ID,
			preview: "linear-gradient(135deg, #3b0f63 0%, #ff71ce 48%, #01cdfe 100%)",
			sheet: xp_vaporwave_css_default
		};
		/** Required services: the theme registry and the locale service. */
		const inject = ["theme", "locale"];
		/**
		* Client plugin body: register the skin and its zh/en labels.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.contribute(SKIN_LOCALE_NS, {
				zh: { [`skin.${SKIN_ID}`]: "XP 蒸汽波" },
				en: { [`skin.${SKIN_ID}`]: "XP Vaporwave" }
			}), "ui-skin-xp-vaporwave: display labels");
			ctx.effect(() => ctx.theme.registerSkin(SKIN), "ui-skin-xp-vaporwave: skin registration");
			ctx.effect(() => attachCityFlyover(ctx, SKIN_ID), "ui-skin-xp-vaporwave: city flyover renderer");
		}
		//#endregion
		exports.SKIN = SKIN;
		exports.SKIN_ID = SKIN_ID;
		exports.SKIN_LOCALE_NS = SKIN_LOCALE_NS;
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map