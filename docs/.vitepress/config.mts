import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Paks3c",
  description: "A VitePress Site",
  ignoreDeadLinks: true,
  // Optionnel : nettoyer les URLs (.html n'apparaitra pas)
  cleanUrls: true,
  base: '/Paks3c/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    /* CONFIGURATION DU PLUGIN SIDEBAR
     *    Cela remplace ton tableau manuel 'sidebar: [...]'
     */
    sidebar: generateSidebar({
      // Définit la racine de scan (ici '/' signifie la racine du projet)
      documentRootPath: '/',

      // Très important pour le "feeling" GitBook :
      // Utilise le titre H1 (# Mon Titre) du fichier au lieu du nom de fichier (mon-titre.md)
      useTitleFromFileHeading: false,
      documentRootPath: 'docs',
      // Options cosmétiques pour nettoyer les noms de dossiers
      hyphenToSpace: true,        // "red-team" devient "Red team"
      underscoreToSpace: true,    // "blue_team" devient "Blue team"
      capitalizeFirst: true,      // Met la première lettre en majuscule

      // Organisation
      collapseDepth: 2,           // Ouvre les menus automatiquement jusqu'au niveau 2
      sortMenusByFrontmatterOrder: true, // Permet de forcer l'ordre via 'order: 1' dans le frontmatter

      // Exclusion (pour éviter d'indexer des fichiers systèmes ou la home)
      excludeFiles: ['index.md', 'README.md'],
      excludeFolders: ['node_modules', '.vitepress']
    }),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    // Ajout recommandé : Recherche locale (indispensable pour une KB de sécu)
    search: {
      provider: 'local'
    }
  }
})
