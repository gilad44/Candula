const helmet = require("helmet");

// Security headers configuration
const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
    reportOnly: false,
  },

  // HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },

  // X-Frame-Options
  frameguard: {
    action: "deny", // Prevent clickjacking
  },

  // X-Content-Type-Options
  noSniff: true, // Prevent MIME-type sniffing

  // X-XSS-Protection
  xssFilter: true,

  // Referrer Policy
  referrerPolicy: {
    policy: ["no-referrer", "strict-origin-when-cross-origin"],
  },

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // X-DNS-Prefetch-Control
  dnsPrefetchControl: {
    allow: false,
  },

  // X-Download-Options
  ieNoOpen: true,

  // X-Permitted-Cross-Domain-Policies
  permittedCrossDomainPolicies: false,
});

// Additional security middleware for API responses
const apiSecurityHeaders = (req, res, next) => {
  // Prevent caching of sensitive data
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  // Additional security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // CORS security headers
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");

  next();
};

// Security logging middleware
const securityLogger = (req, res, next) => {
  // Log suspicious activity
  const suspiciousPatterns = [
    /\.\./,
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /union.*select/i,
    /drop.*table/i,
  ];

  const userAgent = req.get("User-Agent") || "";
  const requestBody = JSON.stringify(req.body);
  const requestUrl = req.originalUrl;

  // Check for suspicious patterns
  const isSuspicious = suspiciousPatterns.some(
    (pattern) =>
      pattern.test(requestUrl) ||
      pattern.test(requestBody) ||
      pattern.test(userAgent)
  );

  if (isSuspicious) {
    console.warn(`🚨 Suspicious request detected:`, {
      ip: req.ip,
      userAgent: userAgent,
      url: requestUrl,
      body:
        requestBody.length > 100
          ? requestBody.substring(0, 100) + "..."
          : requestBody,
      timestamp: new Date().toISOString(),
    });
  }

  // Log rate limit headers if present
  const rateLimitRemaining = res.getHeader("RateLimit-Remaining");
  if (rateLimitRemaining !== undefined && rateLimitRemaining < 10) {
    console.warn(
      `⚠️ Rate limit warning for IP ${req.ip}: ${rateLimitRemaining} requests remaining`
    );
  }

  next();
};

module.exports = {
  securityHeaders,
  apiSecurityHeaders,
  securityLogger,
};
