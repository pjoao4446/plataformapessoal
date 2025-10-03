# 🎬 Guia de Preparação de Vídeos para Upload

## 📋 Especificações Técnicas

### ✅ Formatos Aceitos
- **MP4** (Recomendado)
- **AVI**
- **MOV**
- **WebM**
- **MKV**

### 📏 Limites de Tamanho
- **Tamanho máximo**: 100MB
- **Recomendado**: Até 50MB para melhor performance

## 🛠️ Como Preparar Seus Vídeos

### 1. **Comprimir Vídeos (Recomendado)**

#### Usando FFmpeg (Gratuito)
```bash
# Comprimir para MP4 com boa qualidade
ffmpeg -i video_original.mp4 -c:v libx264 -crf 28 -c:a aac -b:a 128k video_comprimido.mp4

# Reduzir ainda mais o tamanho (qualidade menor)
ffmpeg -i video_original.mp4 -c:v libx264 -crf 32 -c:a aac -b:a 96k video_pequeno.mp4
```

#### Usando HandBrake (Interface Gráfica)
1. Baixe o HandBrake: https://handbrake.fr/
2. Abra seu vídeo
3. Configure:
   - **Format**: MP4
   - **Quality**: RF 28 (boa qualidade) ou RF 32 (menor tamanho)
   - **Audio**: AAC, 128kbps
4. Clique em "Start"

### 2. **Reduzir Resolução**

#### Para vídeos HD (1080p)
```bash
# Converter para 720p
ffmpeg -i video_1080p.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 video_720p.mp4

# Converter para 480p (menor ainda)
ffmpeg -i video_1080p.mp4 -vf scale=854:480 -c:v libx264 -crf 28 video_480p.mp4
```

### 3. **Reduzir Duração**
- Corte partes desnecessárias
- Mantenha apenas o conteúdo essencial
- Considere dividir vídeos muito longos em partes menores

## 🎯 Dicas para Otimização

### ✅ **Faça**
- Use MP4 como formato principal
- Comprima vídeos grandes
- Teste o upload com arquivos pequenos primeiro
- Mantenha a duração entre 5-30 minutos
- Use resolução 720p ou menor para vídeos longos

### ❌ **Evite**
- Vídeos em 4K sem compressão
- Formatos não suportados (AVI muito antigo, WMV, etc.)
- Áudios com bitrate muito alto
- Vídeos com múltiplas faixas de áudio

## 🔧 Ferramentas Recomendadas

### Gratuitas
1. **FFmpeg** - Linha de comando (mais poderosa)
2. **HandBrake** - Interface gráfica
3. **VLC Media Player** - Conversão básica
4. **OBS Studio** - Gravação e streaming

### Pagas
1. **Adobe Media Encoder** - Profissional
2. **Movavi Video Converter** - Fácil de usar

## 🚨 Resolução de Problemas

### "Arquivo muito grande"
- Comprima o vídeo usando as ferramentas acima
- Reduza a resolução para 720p ou 480p
- Corte partes desnecessárias

### "Formato não suportado"
- Converta para MP4 usando HandBrake ou FFmpeg
- Verifique se a extensão do arquivo está correta

### "Upload muito lento"
- Verifique sua conexão de internet
- Use um vídeo menor para teste
- Comprima o vídeo antes de enviar

## 📱 Exemplo de Comando Completo

```bash
# Converter vídeo grande para formato otimizado
ffmpeg -i video_original.mov \
  -c:v libx264 \
  -crf 28 \
  -preset medium \
  -c:a aac \
  -b:a 128k \
  -vf scale=1280:720 \
  -movflags +faststart \
  video_otimizado.mp4
```

**Parâmetros explicados:**
- `-crf 28`: Qualidade (18=excelente, 28=bom, 32=aceitável)
- `-preset medium`: Velocidade de compressão
- `-b:a 128k`: Bitrate do áudio
- `-vf scale=1280:720`: Reduzir para 720p
- `-movflags +faststart`: Otimizar para streaming

## 💡 Dica Final

**Teste sempre com um vídeo pequeno primeiro!** Isso ajuda a verificar se tudo está funcionando antes de processar vídeos grandes.
