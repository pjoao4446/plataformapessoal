/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Dark Palette - Estilo VertexGuard/Cybersecurity
        dark: {
          base: '#0B0C15',      // Fundo principal (muito escuro, não preto puro)
          surface: '#151725',   // Cards/Containers (levemente mais claro)
          elevated: '#1E2139',  // Elementos elevados
          border: 'rgba(255, 255, 255, 0.05)', // Bordas sutis
          'border-strong': 'rgba(255, 255, 255, 0.1)',
        },
        // Cores de Acento Neon (para status e highlights)
        neon: {
          purple: '#A855F7',    // Roxo Vibrante
          cyan: '#00FFFF',      // Azul Ciano
          orange: '#FF6B35',    // Laranja Neon
          emerald: '#10B981',  // Verde Esmeralda
          pink: '#EC4899',      // Rosa/Magenta
          blue: '#3B82F6',      // Azul Neon
        },
        // Cores de Status
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        // Texto
        text: {
          primary: '#E2E8F0',   // Texto principal
          secondary: '#94A3B8', // Texto secundário
          muted: '#64748B',     // Texto desbotado
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '1rem',      // rounded-2xl (16px)
        'card-lg': '1.5rem', // rounded-3xl (24px)
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}







