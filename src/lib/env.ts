// Validation des variables d'environnement
export const validateEnv = () => {
  const requiredVars = [
    'VITE_NHOST_SUBDOMAIN',
    'VITE_NHOST_REGION',
    'VITE_NHOST_EMAIL',
    'VITE_NHOST_PASSWORD'
  ];

  const missing = requiredVars.filter(varName => !import.meta.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Variables d'environnement manquantes: ${missing.join(', ')}\n` +
      'Vérifiez votre fichier .env'
    );
  }

  console.log('✅ Variables d\'environnement validées');
};

// Types pour les variables d'environnement
declare global {
  interface ImportMetaEnv {
    readonly VITE_NHOST_SUBDOMAIN: string;
    readonly VITE_NHOST_REGION: string;
    readonly VITE_NHOST_EMAIL: string;
    readonly VITE_NHOST_PASSWORD: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
