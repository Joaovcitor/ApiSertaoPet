import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log da requisição
  console.log(`📥 [${timestamp}] ${req.method} ${req.originalUrl}`);
  
  // Interceptar o final da resposta
  const originalSend = res.send;
  
  res.send = function(body) {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    
    console.log(
      `📤 [${new Date().toISOString()}] ${req.method} ${req.originalUrl} ` +
      `${statusColor}${res.statusCode}\x1b[0m ${duration}ms`
    );
    
    return originalSend.call(this, body);
  };
  
  next();
};

// Função para colorir o status code no console
const getStatusColor = (statusCode: number): string => {
  if (statusCode >= 200 && statusCode < 300) {
    return '\x1b[32m'; // Verde
  } else if (statusCode >= 300 && statusCode < 400) {
    return '\x1b[33m'; // Amarelo
  } else if (statusCode >= 400 && statusCode < 500) {
    return '\x1b[31m'; // Vermelho
  } else if (statusCode >= 500) {
    return '\x1b[35m'; // Magenta
  }
  return '\x1b[0m'; // Reset
};
