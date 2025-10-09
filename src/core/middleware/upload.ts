import multer from "multer";
import path from "path";
import { Request } from "express";
import { createError } from "./errorHandler";

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Criar pasta uploads se não existir
    const uploadPath = path.join(process.cwd(), "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Filtro de arquivos - apenas imagens
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Verificar se é uma imagem
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(createError("Apenas arquivos de imagem são permitidos", 400));
  }
};

// Configuração do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
    files: 6, // Máximo 6 arquivos
  },
});

// Middleware para upload de múltiplas imagens (máximo 6)
export const uploadImages = upload.array("images", 6);

// Middleware para upload de uma única imagem
export const uploadSingleImage = upload.single("photo");

// Middleware para tratamento de erros do multer
export const handleMulterError = (
  error: any,
  req: Request,
  res: any,
  next: any
) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_COUNT":
        return next(createError("Máximo de 6 imagens permitidas", 400));
      case "LIMIT_FILE_SIZE":
        return next(
          createError("Arquivo muito grande. Máximo 5MB por imagem", 400)
        );
      case "LIMIT_UNEXPECTED_FILE":
        return next(createError("Campo de arquivo inesperado", 400));
      default:
        return next(createError("Erro no upload do arquivo", 400));
    }
  }
  next(error);
};

export default upload;
