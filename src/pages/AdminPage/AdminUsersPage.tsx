import React, { useMemo, useState } from 'react';

import Section from '../../components/Section';
import Title from '../../components/Title';

import { useActivateUserMutation, useGetUsersQuery, useUpdateUserMutation } from '../../features/auth/authAPI';

export default function AdminUsersPage() {
  const [q, setQ] = useState('');
  const { data: users, isLoading, isError, refetch } = useGetUsersQuery(q ? { q } : undefined);
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();
  const [activateUser, { isLoading: activating }] = useActivateUserMutation();

  const rows = useMemo(() => users ?? [], [users]);

  const handleSave = async (id: number, update: { role?: 'user'|'hr'|'admin'; status?: 'pending'|'active'|'blocked' }) => {
    await updateUser({ id, data: update }).unwrap();
  };

  const handleActivate = async (id: number) => {
    await activateUser({ id }).unwrap();
  };

  if (isLoading) return <div>Загрузка пользователей…</div>;
  if (isError)   return <div>Не удалось загрузить список (возможно, нет прав)</div>;

  return (
    <Section className={` section-pad section-hidden`}>
      <div>
        <Title>Пользователи</Title>

        <div style={{ margin: '12px 0' }}>
          <input
            placeholder="Поиск (email/ФИО)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ padding: 8, width: 300 }}
          />
          <button onClick={() => refetch()} style={{ marginLeft: 8 }}>Обновить</button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left' }}>
              <th>id</th>
              <th>Email</th>
              <th>ФИО</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Создан</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.full_name}</td>

                <td>
                  <select
                    defaultValue={u.role}
                    onChange={(e) => handleSave(u.id, { role: e.target.value as any })}
                  >
                    <option value="user">user</option>
                    <option value="hr">hr</option>
                    <option value="admin">admin</option>
                  </select>
                </td>

                <td>
                  <select
                    defaultValue={u.status}
                    onChange={(e) => handleSave(u.id, { status: e.target.value as any })}
                  >
                    <option value="pending">pending</option>
                    <option value="active">active</option>
                    <option value="blocked">blocked</option>
                  </select>
                </td>

                <td>{new Date(u.created_at).toLocaleString()}</td>

                <td>
                  <button
                    onClick={() => handleActivate(u.id)}
                    disabled={activating || u.status === 'active'}
                  >
                    Активировать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(updating || activating) && <div style={{ marginTop: 8 }}>Сохраняю…</div>}
      </div>
    </Section>
  );
}