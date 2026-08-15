/**
 * Comprime uma imagem no navegador (redimensiona e reduz qualidade JPEG) e
 * devolve como base64 — pra guardar direto no Firestore, sem precisar de
 * um serviço de armazenamento de arquivos separado (Storage/plano Blaze).
 *
 * Duas resoluções por foto: "mini" pro card/capa (tela pequena desenha
 * 2-3px por ponto aparente, então precisa de folga) e "grande" pra
 * ampliação na página de produto. Um documento do Firestore não passa de
 * 1MB, então reduz a qualidade automaticamente se a foto grande ficar
 * perto disso.
 */
/** Olha o canal alpha de verdade (não só a extensão do arquivo) — um PNG
 * comum, sem fundo removido, não tem pixel transparente nenhum, e nesse
 * caso salvar como PNG só deixaria o arquivo bem mais pesado à toa (PNG
 * não comprime tão bem quanto JPEG pra foto comum). Só vale a pena o PNG
 * (maior, mas com transparência de verdade) quando a foto realmente tem
 * área transparente. */
function temTransparenciaReal(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  const { data } = ctx.getImageData(0, 0, width, height);
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
}

function comprimir(file: File, maxLado: number, qualidade: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxLado || height > maxLado) {
          if (width > height) {
            height = Math.round(height * (maxLado / width));
            width = maxLado;
          } else {
            width = Math.round(width * (maxLado / height));
            height = maxLado;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Não foi possível processar a imagem."));
        ctx.drawImage(img, 0, 0, width, height);

        if (temTransparenciaReal(ctx, width, height)) {
          resolve(canvas.toDataURL("image/png"));
          return;
        }
        // Sem transparência real, não tem o que preservar — redesenha
        // com fundo branco (evita qualquer pixel semitransparente virar
        // preto) e salva como JPEG, bem mais leve.
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", qualidade));
      };
      img.onerror = () => reject(new Error("Não foi possível ler essa imagem."));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Não foi possível ler esse arquivo."));
    reader.readAsDataURL(file);
  });
}

export async function processarFoto(file: File): Promise<{ mini: string; grande: string }> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Escolha um arquivo de imagem.");
  }
  const mini = await comprimir(file, 900, 0.7);
  let grande = await comprimir(file, 1600, 0.85);
  if (grande.length > 700_000) grande = await comprimir(file, 1300, 0.8);
  if (grande.length > 900_000) grande = await comprimir(file, 1100, 0.75);
  return { mini, grande };
}
