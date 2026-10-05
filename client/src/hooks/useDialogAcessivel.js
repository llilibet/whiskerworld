// ── Acessibilidade: comportamento de teclado para modais ─────────────────────
// Ao abrir: move o foco para dentro do modal. Enquanto aberto: Esc fecha e
// Tab/Shift+Tab ficam presos dentro do modal. Ao fechar: devolve o foco ao
// elemento que abriu o modal (padrão WAI-ARIA para "dialog modal").
import { useEffect, useRef } from 'react';

const FOCAVEIS = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useDialogAcessivel(aberto, onFechar) {
  const dialogRef = useRef(null);
  const onFecharRef = useRef(onFechar);
  onFecharRef.current = onFechar;

  useEffect(() => {
    if (!aberto) return undefined;
    const anterior = document.activeElement;
    const dialog = dialogRef.current;
    const focaveis = () => [...(dialog?.querySelectorAll(FOCAVEIS) || [])];

    (focaveis()[0] || dialog)?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onFecharRef.current?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const lista = focaveis();
      if (lista.length === 0) { e.preventDefault(); return; }
      const primeiro = lista[0];
      const ultimo = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (anterior && typeof anterior.focus === 'function') anterior.focus();
    };
  }, [aberto]);

  return dialogRef;
}
