#!/usr/bin/env bash
# Prepara el entorno de voz (una sola vez por sesión/máquina). Uso: bash setup.sh [directorio-venv]
# Requiere red a: pypi, huggingface.co, cdn-lfs.huggingface.co, cdn-lfs.hf.co, cas-bridge.xethub.hf.co, us.aws.cdn.hf.co
set -e
V="${1:-/tmp/voz-venv}"
PY=$(command -v python3.13 || command -v python3.12 || command -v python3.11 || command -v python3)
[ -x "$V/bin/python" ] || "$PY" -m venv "$V"
"$V/bin/pip" install -q chatterbox-tts "setuptools<81"   # setuptools<81: perth (marca de agua) necesita pkg_resources
"$V/bin/python" -c "import chatterbox,torch,perth;assert perth.PerthImplicitWatermarker is not None;print('OK voz',torch.__version__)"
