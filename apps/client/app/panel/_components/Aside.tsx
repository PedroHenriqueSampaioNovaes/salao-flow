import Link from 'next/link';

export default function Aside() {
  return (
    <aside>
      <ul>
        <li>
          <Link href="/panel/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/panel/services">Serviços</Link>
        </li>
        <li>
          <Link href="/panel/professionals">Profissionais</Link>
        </li>
        <li>
          <Link href="/panel/expedients">Expedientes</Link>
        </li>
        <li>
          <Link href="/panel/services">Serviços</Link>
        </li>
        <li>
          <Link href="/panel/clients">Clientes</Link>
        </li>
        <li>
          <Link href="/panel/blocked-times">Bloqueios de agendamentos</Link>
        </li>
        <li>
          <Link href="/panel/settings">Configurações</Link>
        </li>
      </ul>
    </aside>
  );
}
