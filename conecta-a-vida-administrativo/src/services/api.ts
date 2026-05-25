const API_URL = 'http://localhost:8080/api';

// --- INTERFACES ALINHADAS COM O NOVO BANCO ---

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  idade?: number;
  sexo?: string;
  localizacao?: string;
}

export interface Campanha {
  id?: number;
  titulo: string;
  descricao: string;
  dataInicio: string; 
  dataFim: string;    
  publicoAlvo: string; 
  status: 'Ativa' | 'Encerrada' | 'Agendada' | string;
  categoria?: string;
  linkimagem?: string;
  localizacao?: string;
}

export interface Alerta {
  id?: number;
  tipo: string;        
  categoria: 'urgente' | 'aviso' | 'info' | string; 
  titulo: string;
  descricao: string;
  dataPostada: string; // Alinhado com o banco postgres
  lido: boolean;
  localizacao?: string;
}

export interface UnidadeSaude {
  id?: number;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  horarioSegSex: string;
  horarioSabado: string;
  horarioDomingo: string;
}

export interface LogAtividade {
  id?: number;
  usuario: Usuario; // Alinhado: agora é um objeto completo do banco
  acao: string;
  dataHora: string; 
}

export interface DashboardStats {
  totalUsuarios: number; 
  alertasAtivos: number;  
}

export interface ChartData {
  mes: string;
  quantidade: number;
}

// --- SERVIÇOS DE CONSUMO ---

export const usuarioService = {
  listarTodos: async (): Promise<Usuario[]> => {
    const response = await fetch(`${API_URL}/usuarios`);
    if (!response.ok) throw new Error('Erro ao buscar usuários');
    return response.json();
  },

  buscarPorEmail: async (email: string): Promise<Usuario | null> => {
    const response = await fetch(`${API_URL}/usuarios/email/${email}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erro na busca');
    return response.json();
  },

  cadastrar: async (usuario: Usuario): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return response.json();
  },

  atualizar: async (id: number, usuario: Usuario): Promise<Usuario> => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario)
    });
    return response.json();
  },

  deletar: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/usuarios/${id}`, { method: 'DELETE' });
  },

  exportarCsv: () => {
    window.open(`${API_URL}/usuarios/exportar-csv`, '_blank');
  },

  importarCsv: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/usuarios/importar-csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Erro ao importar ficheiro CSV');
    return response.text();
  }
};

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await fetch(`${API_URL}/dashboard/stats`);
    if (!response.ok) throw new Error('Erro ao carregar métricas');
    return response.json();
  },
  getChartData: async (): Promise<ChartData[]> => {
    const response = await fetch(`${API_URL}/dashboard/chart`);
    if (!response.ok) throw new Error('Erro ao carregar gráfico');
    return response.json();
  }
};

export const campanhaService = {
  listarTodas: async (): Promise<Campanha[]> => {
    const response = await fetch(`${API_URL}/campanhas`);
    if (!response.ok) throw new Error('Erro ao buscar campaigns');
    return response.json();
  },

  buscarPorId: async (id: number): Promise<Campanha> => {
    const response = await fetch(`${API_URL}/campanhas/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar detalhes');
    return response.json();
  },

  cadastrar: async (campanha: Campanha): Promise<Campanha> => {
    const response = await fetch(`${API_URL}/campanhas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campanha)
    });
    return response.json();
  }
};

export const logService = {
  listarRecentes: async (): Promise<LogAtividade[]> => {
    const response = await fetch(`${API_URL}/logs/recentes`);
    if (!response.ok) return [];
    return response.json();
  }
};

export const alertaService = {
  listarTodos: async (): Promise<Alerta[]> => {
    const response = await fetch(`${API_URL}/alertas`);
    if (!response.ok) throw new Error('Erro ao buscar alertas');
    return response.json();
  },

  marcarComoLido: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/alertas/${id}/lido`, { method: 'PUT' });
  }
};

export const unidadeSaudeService = {
  obterDados: async (): Promise<UnidadeSaude> => {
    const response = await fetch(`${API_URL}/unidade-saude`);
    if (!response.ok) throw new Error('Erro ao buscar dados da unidade');
    return response.json();
  },

  salvar: async (dados: UnidadeSaude): Promise<UnidadeSaude> => {
    const response = await fetch(`${API_URL}/unidade-saude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    return response.json();
  }
};

export const relatorioService = {
  downloadUsuariosPdf: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/relatorios/usuarios`);
    if (!response.ok) throw new Error('Erro ao gerar relatório PDF');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_usuarios_${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
};