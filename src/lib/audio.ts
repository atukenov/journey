/**
 * Генеративное фоновое пианино.
 * Тёплая пентатоника фа-мажора, мягкие затухающие ноты, лёгкая «комната».
 * Ни одного аудиофайла — работает офлайн и ничего не весит.
 */

const SCALE = [174.61, 220.0, 261.63, 293.66, 349.23, 440.0, 523.25, 587.33];

export class PianoEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;

  private ensureContext() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;

    // Мягкая «комната»: короткий сгенерированный импульс реверберации
    const convolver = this.ctx.createConvolver();
    convolver.buffer = this.makeImpulse(2.8, 2.2);
    const wet = this.ctx.createGain();
    wet.gain.value = 0.4;

    this.master.connect(this.ctx.destination);
    this.master.connect(convolver);
    convolver.connect(wet);
    wet.connect(this.ctx.destination);
  }

  private makeImpulse(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!;
    const rate = ctx.sampleRate;
    const length = rate * seconds;
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    return impulse;
  }

  private note(freq: number, when: number, velocity: number) {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.4;

    // Два слегка расстроенных осциллятора дают «живое» пианинное тело
    for (const detune of [-3, 3]) {
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      osc.detune.value = detune;
      osc.connect(gain);
      osc.start(when);
      osc.stop(when + 6);
    }

    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(velocity, when + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 5.5);
    gain.connect(filter);
    filter.connect(this.master!);
  }

  private scheduleNext() {
    if (!this.running || !this.ctx) return;

    // Пока браузер держит звук заблокированным — тихо ждём, не копя ноты
    if (this.ctx.state !== "running") {
      this.timer = setTimeout(() => this.scheduleNext(), 500);
      return;
    }

    const now = this.ctx.currentTime;

    // Небольшая фраза из 1–3 нот, неторопливая
    const phraseLength = 1 + Math.floor(Math.random() * 3);
    let t = now + 0.05;
    let idx = Math.floor(Math.random() * SCALE.length);
    for (let i = 0; i < phraseLength; i++) {
      const step = [-2, -1, 1, 2][Math.floor(Math.random() * 4)];
      idx = Math.min(SCALE.length - 1, Math.max(0, idx + step));
      this.note(SCALE[idx], t, 0.05 + Math.random() * 0.04);
      // Иногда — тихая квинта под нотой
      if (Math.random() < 0.3 && idx >= 3) {
        this.note(SCALE[idx - 3] / 2, t, 0.03);
      }
      t += 0.9 + Math.random() * 1.4;
    }

    const pause = (t - now) * 1000 + 800 + Math.random() * 2500;
    this.timer = setTimeout(() => this.scheduleNext(), pause);
  }

  async start() {
    this.ensureContext();
    if (this.ctx!.state === "suspended") {
      await this.ctx!.resume().catch(() => {});
      // Автозапуск заблокирован — возобновимся при первом жесте
      if (this.ctx!.state === "suspended") {
        const resume = () => this.ctx?.resume().catch(() => {});
        window.addEventListener("pointerdown", resume, { once: true });
        window.addEventListener("keydown", resume, { once: true });
      }
    }
    if (this.running) return;
    this.running = true;
    const now = this.ctx!.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(1, now + 3);
    this.scheduleNext();
  }

  stop() {
    if (!this.ctx || !this.running) return;
    this.running = false;
    if (this.timer) clearTimeout(this.timer);
    const now = this.ctx.currentTime;
    this.master!.gain.cancelScheduledValues(now);
    this.master!.gain.setValueAtTime(this.master!.gain.value, now);
    this.master!.gain.linearRampToValueAtTime(0, now + 2);
  }

  /** Мягкое затухание при смене главы, затем возврат громкости */
  duck() {
    if (!this.ctx || !this.running) return;
    const now = this.ctx.currentTime;
    const g = this.master!.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(0.15, now + 0.8);
    g.linearRampToValueAtTime(1, now + 3.2);
  }

  get isPlaying() {
    return this.running;
  }
}

export const piano = typeof window !== "undefined" ? new PianoEngine() : null;
