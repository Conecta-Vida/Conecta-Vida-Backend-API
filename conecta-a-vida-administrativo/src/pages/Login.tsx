import { useState } from "react";
import { Mail, Lock, ShieldAlert, Loader2, HeartPulse } from "lucide-react";
import { authService } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    try {
      const adminLogado = await authService.login(email, senha);
      
      // Salva a sessão do administrador localmente no navegador
      localStorage.setItem("@conecta:admin", JSON.stringify(adminLogado));
      
      // Redireciona para o Dashboard principal do sistema
      window.location.href = "/";
    } catch (err: any) {
      // Captura a mensagem exata do erro ("Você não tem credencial liberada." ou "Credenciais incorretas.")
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-none shadow-xl bg-white overflow-hidden">
        {/* TOPO COM IDENTIDADE VISUAL */}
        <CardHeader className="bg-blue-600 text-white text-center py-8">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-white/10 rounded-2xl">
              <HeartPulse className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-white">Conecta Admin</CardTitle>
          <p className="text-blue-100 text-xs mt-1">Painel Restrito de Gestão de Saúde Coletiva</p>
        </CardHeader>

        <CardContent className="p-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* INPUT DE E-MAIL */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" /> E-mail Institucional
              </Label>
              <Input 
                type="email" 
                required 
                placeholder="seu-email@conectavida.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-50 border-slate-200 h-11 focus-visible:ring-blue-600"
              />
            </div>

            {/* INPUT DE SENHA */}
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-400" /> Senha de Acesso
              </Label>
              <Input 
                type="password" 
                required 
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="bg-slate-50 border-slate-200 h-11 focus-visible:ring-blue-600"
              />
            </div>

            {/* MENSAGEM DE ERRO DINÂMICA (Aparece em caso de falha ou falta de credencial) */}
            {erro && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs font-semibold animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{erro}</span>
              </div>
            )}

            {/* BOTÃO ENTRAR */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 shadow-md transition-all active:scale-[0.99] mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> A autenticar...
                </span>
              ) : (
                "Aceder ao Painel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}