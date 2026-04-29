import "./style.css"
import { RacerGame } from "./game/core/RacerGame"

const app = document.querySelector("#app")

app.innerHTML = `
  <div class="canvas-shell" data-canvas-shell></div>
  <div class="noise-overlay"></div>
  <div class="boost-vignette" data-boost-vignette></div>
  <div class="pointer-events-none absolute inset-0">
    <div class="flex h-full flex-col justify-between p-4 md:p-6">
      <div class="flex items-start justify-between gap-4">
        <div class="hud-panel corner-chip max-w-xl rounded-[1.8rem] px-5 py-4 text-white/88">
          <div class="title-display text-xs text-white/50">6D INDIAN HIGHWAY PURSUIT</div>
          <div class="mt-1 flex items-end gap-3">
            <h1 class="title-display text-5xl leading-none text-[var(--cream)] md:text-7xl">NH6 PURSUIT</h1>
            <span class="mb-1 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.34em] text-[var(--neon-cyan)]">
              Monsoon Dusk
            </span>
          </div>
          <p class="mt-3 max-w-lg text-sm leading-6 text-white/68 md:text-[15px]">
            Slice through heavy Indian expressway traffic, keep your heatline coupe alive, and stop the interceptor SUV from boxing you in. Built as a polished, low-latency, browser-runnable pursuit prototype with a Unity blueprint included in the repo.
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <div class="hud-panel rounded-[1.5rem] px-4 py-3 text-right text-white/86">
            <div class="text-[10px] uppercase tracking-[0.35em] text-white/45">Audit Feed</div>
            <div class="mt-2 text-sm font-medium text-white/82" data-audit>FPS 60 • Traffic 18 • Pressure 12%</div>
          </div>
          <div class="hud-panel rounded-[1.5rem] px-4 py-3 text-right text-white/86">
            <div class="text-[10px] uppercase tracking-[0.35em] text-white/45">Pursuit Status</div>
            <div class="mt-2 text-sm font-medium text-[var(--saffron)]" data-status>TAP IGNITION TO RUN NH6</div>
          </div>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
        <div class="hud-panel rounded-[1.8rem] px-5 py-4 text-white">
          <div class="flex items-end justify-between">
            <div>
              <div class="text-[10px] uppercase tracking-[0.38em] text-white/45">Speed KPH</div>
              <div class="title-display speed-glow mt-1 text-7xl leading-none text-[var(--cream)]" data-speed>110</div>
            </div>
            <div class="space-y-2 text-right">
              <div class="text-[10px] uppercase tracking-[0.34em] text-white/45">Distance</div>
              <div class="title-display text-3xl text-[var(--emerald)]" data-distance>0.0 KM</div>
            </div>
          </div>
          <div class="mt-5 space-y-4">
            <div>
              <div class="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/45">
                <span>Boost Reserve</span>
                <span>SHIFT / SPACE</span>
              </div>
              <div class="relative h-3 rounded-full bg-white/8">
                <div class="gauge-fill cool" data-boost-fill></div>
              </div>
            </div>
            <div>
              <div class="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/45">
                <span>Heat Meter</span>
                <span data-heat>22%</span>
              </div>
              <div class="relative h-3 rounded-full bg-white/8">
                <div class="gauge-fill" data-heat-fill></div>
              </div>
            </div>
          </div>
        </div>

        <div class="hud-panel rounded-[1.8rem] px-5 py-4 text-white/86">
          <div class="text-[10px] uppercase tracking-[0.38em] text-white/45">Roadbook</div>
          <ul class="mt-4 space-y-3 text-sm leading-6 text-white/72">
            <li>Steer with <span class="font-semibold text-[var(--cream)]">A / D</span> or arrows.</li>
            <li>Push with <span class="font-semibold text-[var(--cream)]">W</span>, brake with <span class="font-semibold text-[var(--cream)]">S</span>.</li>
            <li>Burn boost with <span class="font-semibold text-[var(--cream)]">Shift</span> or <span class="font-semibold text-[var(--cream)]">Space</span>.</li>
            <li>Police close in when your speed drops after a hit.</li>
          </ul>
        </div>

        <div class="hud-panel rounded-[1.8rem] px-5 py-4 text-white/86">
          <div class="text-[10px] uppercase tracking-[0.38em] text-white/45">Run Ledger</div>
          <div class="mt-4 flex items-end justify-between">
            <div>
              <div class="text-xs uppercase tracking-[0.3em] text-white/40">Score</div>
              <div class="title-display text-4xl text-[var(--neon-cyan)]" data-score>000000</div>
            </div>
            <div class="text-right text-xs uppercase tracking-[0.3em] text-white/40">
              <div>Traffic • Buses • Lorries</div>
              <div class="mt-2 text-white/60">Inspired by Indian roads and ring-road pressure.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div data-intro class="absolute inset-0 flex items-center justify-center bg-black/46 backdrop-blur-sm">
    <div class="hud-panel mx-6 max-w-2xl rounded-[2rem] px-6 py-7 text-center text-white md:px-8">
      <div class="title-display text-sm uppercase tracking-[0.46em] text-[var(--saffron)]">India Pursuit Prototype</div>
      <h2 class="title-display mt-3 text-6xl leading-none text-[var(--cream)] md:text-7xl">START THE CHASE</h2>
      <p class="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">
        This build focuses on feel, atmosphere, traffic density, pursuit pressure, and stable rendering. It is a high-fidelity browser prototype plus a Unity blueprint layer rather than a fake Unity binary.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <button data-start class="pointer-events-auto rounded-full border border-white/10 bg-[var(--saffron)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-black transition hover:brightness-110">
          Ignite Run
        </button>
        <button data-retry class="pointer-events-auto rounded-full border border-white/14 bg-white/8 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white/12">
          Restart
        </button>
      </div>
    </div>
  </div>
`

const mount = document.querySelector("[data-canvas-shell]")
const game = new RacerGame({
  mount,
  hudRoot: app,
})

window.__nh6Game = game

