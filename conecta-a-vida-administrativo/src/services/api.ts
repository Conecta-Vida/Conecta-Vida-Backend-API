const API_URL = 'http://localhost:8080/api';

// --- INTERFACES ---

export interface Paciente {
  id?: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  tipagemSanguinea: string;
}

export interface Vacina {
  id?: number;
  nome: string;
  descricao?: string;
  intervaloDosesDias?: number;
}

export interface Campanha {
  id?: number;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  publicoAlvo: string;
  status: 'Ativa' | 'Encerrada' | 'Agendada';
}

export interface Alerta {
  id?: number;
  tipo: 'urgente' | 'aviso' | 'info';
  titulo: string;
  descricao: string;
  dataCriacao: string;
  lido: boolean;
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
  usuario: string;
  acao: string;
  dataHora: string;
}

export interface RegistroVacinacao {
  id?: number;
  paciente: { id: number };
  vacina: { id: number };
  dataAplicacao: string;
  lote: string;
  profissionalSaude?: string;
}

export interface RegistroVacinacaoDetalhado {
  id: number;
  paciente: Paciente;
  vacina: Vacina;
  dataAplicacao: string;
  lote: string;
  profissionalSaude: string;
}

export interface DashboardStats {
  totalPacientes: number;
  vacinasAplicadas: number;
  alertasAtivos: number;
  agendamentosHoje: number;
}

export interface ChartData {
  mes: string;
  quantidade: number;
}

// --- SERVIÇOS ---

export const pacienteService = {
  listarTodos: async (): Promise<Paciente[]> => {
    const response = await fetch(`${API_URL}/pacientes`);
    if (!response.ok) throw new Error('Erro ao buscar pacientes');
    return response.json();
  },

  buscarPorCpf: async (cpf: string): Promise<Paciente | null> => {
    const response = await fetch(`${API_URL}/pacientes/cpf/${cpf}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Erro na busca');
    return response.json();
  },

  cadastrar: async (paciente: Paciente): Promise<Paciente> => {
    const response = await fetch(`${API_URL}/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente)
    });
    return response.json();
  },

  atualizar: async (id: number, paciente: Paciente): Promise<Paciente> => {
    const response = await fetch(`${API_URL}/pacientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente)
    });
    return response.json();
  },

  deletar: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/pacientes/${id}`, { method: 'DELETE' });
  },

  exportarCsv: () => {
    window.open(`${API_URL}/pacientes/exportar-csv`, '_blank');
  },

  importarCsv: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/pacientes/importar-csv`, {
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
    if (!response.ok) throw new Error('Erro ao buscar campanhas');
    return response.json();
  },

  buscarPorId: async (id: number): Promise<Campanha> => {
    const response = await fetch(`${API_URL}/campanhas/${id}`);
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

export const vacinaService = {
  listarTodas: async (): Promise<Vacina[]> => {
    const response = await fetch(`${API_URL}/vacinas`);
    return response.json();
  }
};

export const registroVacinacaoService = {
  listarPorPaciente: async (pacienteId: number): Promise<RegistroVacinacaoDetalhado[]> => {
    const response = await fetch(`${API_URL}/vacinacao/paciente/${pacienteId}`);
    return response.json();
  },

  registrar: async (registro: RegistroVacinacao): Promise<RegistroVacinacaoDetalhado> => {
    const response = await fetch(`${API_URL}/vacinacao`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registro)
    });
    return response.json();
  }
};

export const alertaService = {
  listarTodos: async (): Promise<Alerta[]> => {
    const response = await fetch(`${API_URL}/alertas`);
    return response.json();
  },

  marcarComoLido: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/alertas/${id}/lido`, { method: 'PUT' });
  }
};

export const unidadeSaudeService = {
  obterDados: async (): Promise<UnidadeSaude> => {
    const response = await fetch(`${API_URL}/unidade-saude`);
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
  downloadPacientesPdf: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/pacientes/exportar-pdf`);
    if (!response.ok) throw new Error('Erro ao gerar relatório PDF');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_pacientes_${new Date().getTime()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
};