const BASE = import.meta.env.VITE_API_URL || '';

const TIPO_EMOJI = { GATO: '🐱', CAO: '🐶' };

export default function AnimalCard({ animal, onEditar, onDeletar, showActions = true }) {
  const fotoSrc = animal.foto_url
    ? `${BASE}${animal.foto_url}`
    : 'https://placehold.co/160x110?text=Pet';

  return (
    <div className="animal-card">
      <img className="animal-card__foto" src={fotoSrc} alt={animal.nome} />
      <div className="animal-card__nome">{animal.nome}</div>
      <span className="animal-card__tipo-badge">
        {TIPO_EMOJI[animal.tipo] || '🐾'} {animal.tipo}
      </span>
      {showActions && (
        <div className="animal-card__actions">
          {onEditar && (
            <button type="button" className="btn btn--edit" onClick={() => onEditar(animal)} aria-label={`Editar ${animal.nome}`}>
              <span aria-hidden="true">✏️</span> Editar
            </button>
          )}
          {onDeletar && (
            <button type="button" className="btn btn--delete" onClick={() => onDeletar(animal.id)} aria-label={`Excluir ${animal.nome}`}>
              <span aria-hidden="true">🗑️</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
