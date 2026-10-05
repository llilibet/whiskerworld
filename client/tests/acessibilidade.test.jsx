// Testes de acessibilidade: verificam o nome que o leitor de tela anuncia em
// campos e botões, e o comportamento de teclado dos modais.
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

vi.mock('../src/firebase', () => ({ auth: { signOut: vi.fn() }, googleProvider: {} }));
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signInWithCustomToken: vi.fn(),
}));

import LoginPage from '../src/pages/LoginPage';
import CadastroPage from '../src/pages/CadastroPage';
import AdminCadastrarAnimalPage from '../src/pages/AdminCadastrarAnimalPage';
import AnimalCard from '../src/components/AnimalCard';

const comRota = (ui, rota = '/') => render(<MemoryRouter initialEntries={[rota]}>{ui}</MemoryRouter>);

describe('Melhoria 1 — rótulos associados aos campos', () => {
  it('login: e-mail e senha são anunciados pelo nome, não pelo placeholder', () => {
    comRota(<LoginPage />, '/login?tipo=ADOTANTE');
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/Senha/, { selector: 'input' })).toHaveAttribute('id', 'login-senha');
  });

  it('cadastro de adotante: nome, e-mail e senha têm rótulo', () => {
    comRota(<CadastroPage />, '/cadastro/ADOTANTE');
    expect(screen.getByRole('textbox', { name: 'Nome' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'E-mail' })).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/, { selector: 'input' })).toHaveAttribute('type', 'password');
  });

  it('cadastro de animal: listas de seleção e campos têm nome acessível', () => {
    comRota(<AdminCadastrarAnimalPage />, '/admin/animal');
    ['Unidade da idade', 'Sexo', 'Tipo de Animal', 'Porte', 'Vacinado?', 'Status'].forEach((nome) => {
      expect(screen.getByRole('combobox', { name: nome })).toBeInTheDocument();
    });
    ['Nome do Animal', 'Raça', 'Descrição', 'Histórico do Pet'].forEach((nome) => {
      expect(screen.getByRole('textbox', { name: nome })).toBeInTheDocument();
    });
    expect(screen.getByRole('spinbutton', { name: 'Idade' })).toBeInTheDocument();
  });
});

describe('Melhoria 2 — nome acessível em botões só com ícone', () => {
  it('card do animal: botões de editar e excluir dizem a ação e o animal', () => {
    render(<AnimalCard animal={{ id: 'a1', nome: 'Luna', tipo: 'GATO' }} onEditar={() => {}} onDeletar={() => {}} />);
    expect(screen.getByRole('button', { name: 'Excluir Luna' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar Luna' })).toBeInTheDocument();
  });

  it('login: botão do olho tem nome e informa se está pressionado', () => {
    comRota(<LoginPage />, '/login?tipo=ADOTANTE');
    const olho = screen.getByRole('button', { name: 'Mostrar senha' });
    expect(olho).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(olho);
    expect(olho).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('Melhoria 5 — modais acessíveis pelo teclado', () => {
  it('modal de termos recebe o foco, fecha com Esc e devolve o foco ao botão', () => {
    comRota(<CadastroPage />, '/cadastro/ADOTANTE');
    const abrir = screen.getByRole('button', { name: 'Termos de Uso' });
    abrir.focus();
    fireEvent.click(abrir);
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.activeElement).toBe(abrir);
  });
});
