// URL base onde o servidor local Spring Boot está a correr
const API_URL = 'http://localhost:8080/api';

// ===================================================================
// CONTRACOS DE DADOS (TYPESCRIPT INTERFACES)
// Nota didática: Estas interfaces garantem que o React saiba exatamente 
// quais as colunas e tipos de dados que vêm do Supabase.
// ===================================================================

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  idade?: number;
  sexo?: string;
  localizacao?: string; // Armazena o cargo (Ex: 'Administrador')
}

export interface InstituicaoSaude {
  id?: number;
  tipoInstituicao: string; // 'UNIDADE', 'HOSPITAL', 'POSTO' ou 'UPA'
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

// Alerta e Campanha mapeiam a tabela unificada 'comunicacoes' do Backend
export interface Alerta {
  id?: number;
  tipo: 'ALERTA';
  categoria: string; // 'urgente', 'aviso', 'info'
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
  status: string; // 'Ativa', 'Encerrada', 'Agendada'
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
// Nota didática: Centraliza os consumos usando 'fetch' nativo da web.
// ===================================================================

export const authService = {
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
    const response = await fetch(`${API_URL}/api/logs/recentes`); // Fallback seguro ligado ao controlador de auditoria
    if (!response.ok) {
      // Tenta a rota secundária unificada caso a primeira falhe
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
  // Executa o download nativo da planilha CSV gerada pelo Java
  exportarCsv: () => {
    window.open(`${API_URL}/usuarios/exportar-csv`, '_blank');
  },
  // Envia um ficheiro físico multipart (FormData) para processamento em lote (saveAll)
  importarCsv: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/usuarios/importar-csv`, {
      method: 'POST',
      body: formData // Nota: O fetch define o Content-Type como multipart/form-data automaticamente com o FormData
    });

    if (!response.ok) {
      const txtErro = await response.text();
      throw new Error(txtErro || 'Erro ao processar arquivo CSV.');
    }
    return response.text();
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
    // Mapeia para o endpoint genérico de comunicações ou específico de campanhas
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
  // Triggers de download para o stream de bytes em PDF estruturado pelo iText 7 no Spring Boot
  downloadUsuariosPdf: () => {
    window.open(`${API_URL}/relatorios/usuarios`, '_blank');
  }
};