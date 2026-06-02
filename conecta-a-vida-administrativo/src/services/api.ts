const API_URL = 'http://localhost:8080/api';

// ===================================================================
// CONTRATOS DE DADOS (INTERFACES)
// ===================================================================

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  idade?: number;
  sexo?: string;
  localizacao?: string; // MANTIDO PARA AS CIDADES (FILTRO MOBILE) 🏙️
  permissao?: string;   // 🚀 ADICIONADO: Define se é 'Administrador' ou 'Usuário Comum' 🔒
}

export interface InstituicaoSaude {
  id?: number;
  tipoInstituicao: string; 
  nome: string;
  email?: string;
  telefone?: string;
  linksite?: string;
  endereco?: string;
  horarioSegSex?: string;
  horarioSabado?: string;
  horarioDomingo?: string;
}

export interface LogAtividade {
  id?: number;
  usuario?: Usuario;
  acao: string;
  dataHora: string;
}

export interface Alerta {
  id?: number;
  tipo: 'ALERTA';
  categoria: string; 
  titulo: string;
  descricao: string;
  localizacao?: string;
  lido: boolean;
  dataPostada: string;
}

export interface Campanha {
  id?: number;
  tipo?: 'CAMPANHA';
  titulo: string;
  descricao: string;
  categoria?: string;
  publicoAlvo: string;
  status: string; 
  dataInicio: string;
  dataFim: string;
  linkimagem?: string;
  localizacao?: string;
}

export interface DashboardStats {
  totalUsuarios: number;
  alertasAtivos: number;
  campanhasAtivas: number;
  noticiasPublicadas: number;
}

export interface ChartData {
  mes: string;
  quantidade: number;
}

// ===================================================================
// REQUISIÇÕES HTTP (SERVIÇOS ASSÍNCRONOS)
// ===================================================================

export const authService = {
  // Autenticação básica (Login) - CR8
  login: async (email: string, senha: string): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    if (!response.ok) {
      const erroDados = await response.json();
      throw new Error(erroDados.mensagem || 'Falha na autenticação');
    }
    return response.json();
  },

  // Registro obrigatório solicitado no CR8
  register: async (dados: Usuario): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      const erroDados = await response.json();
      throw new Error(erroDados.mensagem || 'Erro ao registrar nova credencial.');
    }
    return response.json();
  },

  // Logout no Servidor solicitado no CR8
  logout: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Falha ao sincronizar encerramento com a API.');
  }
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    if (!response.ok) throw new Error('Erro ao buscar estatísticas.');
    return response.json();
  },
  getChartData: async (): Promise<ChartData[]> => {
    const response = await fetch(`${API_URL}/dashboard/chart`);
    if (!response.ok) throw new Error('Erro ao carregar dados do gráfico.');
    return response.json();
  }
};

export const logService = {
  listarRecentes: async (): Promise<LogAtividade[]> => {
    const response = await fetch(`${API_URL}/logs/recentes`); 
    if (!response.ok) {
      const fallback = await fetch(`${API_URL}/dashboard/logs/recentes`);
      if (!fallback.ok) return [];
      return fallback.json();
    }
    return response.json();
  }
};

export const usuarioService = {
  listarTodos: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error('Erro ao listar usuários.');
    return response.json();
  },
  cadastrar: async (dados: Usuario): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao cadastrar.');
    return response.json();
  },
  atualizar: async (id: number, dados: Usuario): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao atualizar.');
    return response.json();
  },
  deletar: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao remover usuário.');
  },
  exportarCsv: () => {
    window.open(`${API_URL}/usuarios/exportar-csv`, '_blank');
  },
  importarCsv: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/usuarios/importar-csv`, {
      method: 'POST',
      body: formData 
    });
    if (!response.ok) {
      const txtErro = await response.text();
      throw new Error(txtErro || 'Erro ao processar arquivo CSV.');
    }
    return response.text();
  },

  // Inscrição de Usuários em Campanhas (Muitos-para-Muitos - CR7)
  inscreverEmCampanha: async (usuarioId: number, campanhaId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/usuarios/${usuarioId}/campanhas/${campanhaId}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Falha ao vincular cidadão à campanha.');
  }
};

export const instituicaoService = {
  listarTodas: async (): Promise<InstituicaoSaude[]> => {
    const response = await fetch(`${API_URL}/instituicoes`);
    if (!response.ok) throw new Error('Erro ao buscar instituições.');
    return response.json();
  },
  cadastrar: async (dados: InstituicaoSaude): Promise<InstituicaoSaude> => {
    const response = await fetch(`${API_URL}/instituicoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao salvar instituição.');
    return response.json();
  },
  atualizar: async (id: number, dados: InstituicaoSaude): Promise<InstituicaoSaude> => {
    const response = await fetch(`${API_URL}/instituicoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao modificar dados.');
    return response.json();
  }
};

export const campanhaService = {
  listarTodas: async (): Promise<Campanha[]> => {
    const response = await fetch(`${API_URL}/campanhas`);
    if (!response.ok) throw new Error('Erro ao carregar campanhas.');
    return response.json();
  },
  buscarPorId: async (id: number): Promise<Campanha> => {
    const response = await fetch(`${API_URL}/campanhas/${id}`);
    if (!response.ok) throw new Error('Campanha não encontrada.');
    return response.json();
  },
  cadastrar: async (dados: Campanha): Promise<Campanha> => {
    const response = await fetch(`${API_URL}/campanhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao publicar.');
    return response.json();
  },
  atualizar: async (id: number, dados: Campanha): Promise<Campanha> => {
    const response = await fetch(`${API_URL}/campanhas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao atualizar dados.');
    return response.json();
  },
  deletar: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/campanhas/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Erro ao remover campanha.');
  }
};

export const alertaService = {
  listarTodos: async (): Promise<Alerta[]> => {
    const response = await fetch(`${API_URL}/alertas`);
    if (!response.ok) throw new Error('Erro ao carregar alertas ativos.');
    return response.json();
  },
  cadastrar: async (dados: Alerta): Promise<Alerta> => {
    const response = await fetch(`${API_URL}/alertas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!response.ok) throw new Error('Erro ao emitir alerta emergencial.');
    return response.json();
  },
  marcarComoLido: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/alertas/${id}/lido`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Erro ao atualizar estado do alerta.');
  }
};

export const relatorioService = {
  downloadUsuariosPdf: () => {
    window.open(`${API_URL}/relatorios/usuarios`, '_blank');
  }
};