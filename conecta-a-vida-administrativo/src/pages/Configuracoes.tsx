import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Save, MapPin, Phone, Mail, Clock } from "lucide-react";
import { type UnidadeSaude, unidadeSaudeService } from "../services/api";
import { toast } from "sonner";

// PARA A EQUIPE: Esta tela gerencia uma ÚNICA entidade no banco (A Unidade de Saúde atual).
// Ao invés de criar várias unidades, o backend atualiza a linha de ID 1 repetidamente.
export default function Configuracoes() {
  const [form, setForm] = useState<UnidadeSaude>({
    nome: "", endereco: "", telefone: "", email: "",
    horarioSegSex: "", horarioSabado: "", horarioDomingo: "",
  });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dados = await unidadeSaudeService.obterDados();
        if (dados) setForm(dados);
      } catch (error) {
        // Se a tabela estiver vazia na primeira vez, mantemos o formulário em branco
      }
    };
    carregarDados();
  }, []);

  const handleSave = async () => {
    try {
      await unidadeSaudeService.salvar(form);
      toast.success("Configurações atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar no servidor.");
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg"><Settings className="w-6 h-6 text-slate-600" /></div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configurações do Sistema</h1>
        </div>
        <p className="text-slate-500">Gerencie as informações públicas e horários de funcionamento da sua unidade.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-600" /> Dados da Unidade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-1.5"><Label>Nome do Posto / UBS</Label><Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Endereço Completo</Label><Input value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label><div className="flex items-center gap-1"><Phone className="w-3 h-3"/> Telefone</div></Label><Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} /></div>
              <div className="space-y-1.5"><Label><div className="flex items-center gap-1"><Mail className="w-3 h-3"/> E-mail</div></Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-base flex items-center gap-2"><Clock className="w-4 h-4 text-orange-600" /> Horário de Funcionamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-1.5"><Label>Segunda a Sexta-feira</Label><Input value={form.horarioSegSex} placeholder="Ex: 07:00 às 19:00" onChange={(e) => setForm({ ...form, horarioSegSex: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Sábados</Label><Input value={form.horarioSabado} placeholder="Ex: 08:00 às 12:00" onChange={(e) => setForm({ ...form, horarioSabado: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Domingos e Feriados</Label><Input value={form.horarioDomingo} placeholder="Ex: Fechado" onChange={(e) => setForm({ ...form, horarioDomingo: e.target.value })} /></div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700 h-12 px-10 font-bold shadow-lg shadow-blue-100">
          <Save className="w-5 h-5" /> Salvar Configurações
        </Button>
      </div>
    </div>
  );
}