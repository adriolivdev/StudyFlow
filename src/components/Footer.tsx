/**
 * Rodapé fixo no final da página.
 * Exibe créditos com estilo tech.
 */
export default function Footer() {
    return (
      <footer className="w-full text-center py-4 text-sm bg-black/80 text-green-400 border-t border-green-700 shadow-inner">
        Desenvolvido por <span className="font-semibold">adriolivdev &lt;/&gt;</span> © {new Date().getFullYear()}
      </footer>
    );
  }
  