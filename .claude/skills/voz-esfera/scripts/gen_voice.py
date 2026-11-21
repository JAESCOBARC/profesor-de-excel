#!/usr/bin/env python3
"""Genera el audio (mp3) de un guion con voz clonada (Chatterbox multilingüe, MIT).

Ejecutar con el python del venv:  /tmp/voz-venv/bin/python gen_voice.py --text guion.txt --out salida.mp3
- Divide el guion en frases (evita el corte "forcing EOS" de las frases largas), genera cada una,
  reintenta con otra semilla si el audio sale demasiado corto para el texto, las une con pausas
  y normaliza el volumen. Una línea en blanco en el guion = pausa más larga.
- La voz sale de --ref (por defecto assets/ref-jhony.wav, 14 s de la voz del profesor).
- El modelo añade una marca de agua inaudible (Resemble AI) que indica audio sintético; no se quita.
"""
import argparse, os, re, subprocess, sys, tempfile
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")   # evita el host cas-server.xethub.hf.co
HERE = os.path.dirname(os.path.abspath(__file__))

def frases(texto, maxlen=170):
    out = []
    for par in re.split(r"\n\s*\n", texto.strip()):
        par = re.sub(r"\s+", " ", par).strip()
        if not par:
            continue
        piezas = re.split(r"(?<=[.!?…:;])\s+", par)
        buf = ""
        trozos = []
        for p in piezas:
            if buf and len(buf) + 1 + len(p) > maxlen:
                trozos.append(buf); buf = p
            else:
                buf = (buf + " " + p).strip()
        if buf:
            trozos.append(buf)
        out.append(trozos)
    return out   # lista de párrafos, cada uno lista de trozos

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", required=True, help="archivo .txt con el guion aprobado")
    ap.add_argument("--out", required=True, help="mp3 de salida")
    ap.add_argument("--ref", default=os.path.join(HERE, "..", "assets", "ref-jhony.wav"))
    ap.add_argument("--lang", default="es")
    ap.add_argument("--exaggeration", type=float, default=0.5)
    ap.add_argument("--cfg", type=float, default=0.5)
    ap.add_argument("--pausa", type=float, default=0.35, help="segundos entre frases")
    ap.add_argument("--pausa-parrafo", type=float, default=0.7)
    ap.add_argument("--cps", type=float, default=13.0, help="caracteres/segundo esperados (para detectar cortes)")
    ap.add_argument("--wav", help="guardar además el wav sin comprimir")
    a = ap.parse_args()

    import torch, torchaudio as ta
    from chatterbox.mtl_tts import ChatterboxMultilingualTTS
    m = ChatterboxMultilingualTTS.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
    sr = m.sr
    texto = open(a.text, encoding="utf-8").read()
    segs, avisos = [], []
    for pi, par in enumerate(frases(texto)):
        for ti, t in enumerate(par):
            mejor = None
            for intento in range(4):
                torch.manual_seed(1000 + intento * 17 + pi * 3 + ti)
                w = m.generate(t, language_id=a.lang, audio_prompt_path=a.ref,
                               exaggeration=a.exaggeration, cfg_weight=a.cfg)
                dur = w.shape[1] / sr
                esperado = len(t) / a.cps
                ratio = dur / esperado
                if mejor is None or abs(1 - ratio) < abs(1 - mejor[2]):
                    mejor = (w, dur, ratio)
                if ratio >= 0.75:
                    break
            w, dur, ratio = mejor
            print(f"[{pi+1}.{ti+1}] {dur:4.1f}s (esperado {len(t)/a.cps:4.1f}s) {t[:70]}", flush=True)
            if ratio < 0.75:
                avisos.append(f"frase {pi+1}.{ti+1} posiblemente cortada: {t[:60]}")
            segs.append(w)
            segs.append(torch.zeros(1, int(sr * (a.pausa_parrafo if ti == len(par) - 1 else a.pausa))))
    audio = torch.cat(segs[:-1], dim=1)
    tmp = tempfile.mkdtemp()
    raw = os.path.join(tmp, "raw.wav")
    ta.save(raw, audio, sr)
    if a.wav:
        ta.save(a.wav, audio, sr)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                    "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k", a.out], check=True)
    dur = audio.shape[1] / sr
    print(f"OK {a.out} · {dur:.1f} s · {os.path.getsize(a.out)/1024:.0f} KB")
    for v in avisos:
        print("AVISO:", v)

if __name__ == "__main__":
    main()
