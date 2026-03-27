import React, { useEffect, useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { Button } from "../../components/ui/Button";
import Modal from "../../components/modal/Modal";
import {
  type User,
  type UserCreateRequest,
  type AdminUserUpdateRequest,
  UserRole,
} from "../../schemas/entities";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  ArrowLeft,
  Shield,
  User as UserIcon,
  Mail,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import style from "./UserManagement.module.css";

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { users, isLoading, fetchUsers, createUser, updateUser, deleteUser } =
    useUserStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<UserCreateRequest>>({
    email: "",
    full_name: "",
    contact: "",
    password: "",
    role: "REGULAR",
  });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      full_name: "",
      contact: "",
      password: "",
      role: "REGULAR",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      contact: user.contact,
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData as AdminUserUpdateRequest);
      } else {
        await createUser(formData as UserCreateRequest);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar usuário. Verifique os dados.");
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await deleteUser(userId);
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
      }
    }
  };

  return (
    <div className={style.container}>
      {/* Header */}
      <div className={style.header}>
        <div>
          <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-[var(--color-text-dim)] hover:text-white mb-4 transition-colors">
            <ArrowLeft size={16} /> Voltar ao Dashboard
          </button>
          <span className={style.headerBadge}>Administração de Sistema</span>
          <h1 className={style.title}>
            <Users size={40} className={style.titleIcon} />
            Gestão de <span className={style.highlight}>Usuários</span>
          </h1>
        </div>
        <Button onClick={handleOpenCreate} className="flex items-center gap-2">
          <Plus size={18} /> Novo Usuário
        </Button>
      </div>

      {/* User Table Section */}
      <div className={style.tableSection}>
        <div className={style.listHeader}>
          <div className={style.listTitleGroup}>
            <Shield size={20} className={style.listIcon} />
            <h2 className={style.tableTitle}>Controle de Acesso</h2>
          </div>
          <div className={style.tableCount}>
            {users.length} usuários registrados
          </div>
        </div>

        <div className={style.tableWrapper}>
          <table className={style.userTable}>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Contato</th>
                <th>Função</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10">
                    <div className="w-8 h-8 border-2 border-[var(--color-industrial-orange)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id} className={style.userRow}>
                    <td>
                      <div className="flex flex-col">
                        <span className="font-bold">{user.full_name}</span>
                        <span className={style.userEmail}>{user.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-[var(--color-text-dim)]">{user.contact}</span>
                    </td>
                    <td>
                      <span className={`${style.roleBadge} ${user.role === 'ADMIN' ? style.roleAdmin : style.roleRegular}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className={style.actions}>
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className={`${style.actionButton} ${style.editButton}`}
                          title="Editar usuário"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className={`${style.actionButton} ${style.deleteButton}`}
                          title="Excluir usuário"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={style.emptyState}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit} className={style.modalContent}>
          <h2 className="text-xl font-black uppercase mb-6 tracking-tight">
            {editingUser ? "Editar Usuário" : "Criar Novo Usuário"}
          </h2>
          <div className={style.formField}>
            <label className={style.label}>Nome Completo</label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="text"
                required
                className={`${style.input} pl-10`}
                placeholder="Ex: João Silva"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
          </div>

          <div className={style.formField}>
            <label className={style.label}>E-mail Corporate</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="email"
                required
                className={`${style.input} pl-10`}
                placeholder="email@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className={style.formField}>
            <label className={style.label}>Contato / WhatsApp</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                type="text"
                required
                className={`${style.input} pl-10`}
                placeholder="(31) 99999-9999"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
          </div>

          {!editingUser && (
            <div className={style.formField}>
              <label className={style.label}>Senha de Acesso</label>
              <input
                type="password"
                required
                className={style.input}
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          )}

          <div className={style.formField}>
            <label className={style.label}>Nível de Acesso (Role)</label>
            <select
              className={style.select}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              <option value="REGULAR">REGULAR - Consulta e Edição de Ativos Próprios</option>
              <option value="ADMIN">ADMIN - Gestão Total do Sistema</option>
            </select>
          </div>

          <div className={style.modalFooter}>
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingUser ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bottom Decorator */}
      <div className={style.bottomDecorator}></div>
    </div>
  );
};
