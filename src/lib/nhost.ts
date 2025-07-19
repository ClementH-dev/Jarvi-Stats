import { NhostClient } from '@nhost/nhost-js';

// Configuration Nhost avec les variables d'environnement
export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION
});

// Authentification automatique
export const initAuth = async () => {
  try {
    const email = import.meta.env.VITE_NHOST_EMAIL;
    const password = import.meta.env.VITE_NHOST_PASSWORD;
    
    const result = await nhost.auth.signIn({
      email,
      password
    });
    
    if (result.error) {
      throw new Error(`Erreur d'authentification: ${result.error.message}`);
    }
    
    console.log('✅ Authentification Nhost réussie');
    return result;
  } catch (error) {
    console.error('❌ Erreur d\'authentification Nhost:', error);
    throw error;
  }
};

export default nhost;
