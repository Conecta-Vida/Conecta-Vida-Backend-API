# Docker e Docker Swarm — Conecta à Vida API

A API Spring Boot roda na porta 8080 e utiliza o PostgreSQL/Supabase **externo** já existente. Este stack não cria nem replica banco de dados: todas as réplicas da API usam o mesmo serviço externo.

## 1. Configuração local

1. Copie `.env.example` para `.env`.
2. Preencha as variáveis com credenciais novas e válidas. Não coloque segredos em commits, imagens ou prints.
3. Gere um valor aleatório forte para `CONECTA_API_SALT`.
4. Mantenha o arquivo `.env` fora do Git.

A configuração Spring lê `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `CONECTA_API_SALT`, `CONECTA_CORS_ORIGINS` e `FCM_SERVER_KEY` do ambiente.

## 2. Construir e testar a imagem

Execute na raiz do repositório:

```bash
docker build -t conecta-a-vida-api:local ./conecta-a-vida-api
```

O Dockerfile usa o Gradle Wrapper do projeto e Java 17 em build multi-stage. Para testar localmente, carregue as variáveis do seu arquivo `.env` no ambiente e execute:

```bash
docker run --rm -p 8080:8080 --env-file .env conecta-a-vida-api:local
```

A imagem final contém o JRE e o JAR; o código-fonte e o Gradle não são copiados para o estágio de execução.

## 3. Publicar a imagem para o cluster

O Swarm não constrói imagens durante `docker stack deploy`. Publique a imagem em um registry acessível por todos os nós (por exemplo, GHCR ou Docker Hub):

```bash
docker login ghcr.io
docker build -t ghcr.io/SEU_USUARIO/conecta-a-vida-api:1.0.0 ./conecta-a-vida-api
docker push ghcr.io/SEU_USUARIO/conecta-a-vida-api:1.0.0
```

Altere `REGISTRY_IMAGE` no ambiente do manager para o endereço real da imagem publicada. Se usar um registry privado, autentique os nós/serviço e considere `--with-registry-auth` no deploy.

## 4. Criar o cluster Swarm

Em três máquinas/VMs com Docker Engine instalado, configure conectividade entre os nós. Portas padrão entre os nós:
- TCP 2377: gerenciamento do Swarm (manager).
- TCP/UDP 7946: descoberta e comunicação entre nós.
- UDP 4789: tráfego da rede overlay.

No manager:

```bash
docker swarm init --advertise-addr IP_DO_MANAGER
docker swarm join-token worker
```

Execute o comando `docker swarm join` gerado pelo manager em cada worker. No manager, confira:

```bash
docker node ls
```

Para distribuir duas réplicas em nós distintos, mantenha pelo menos dois nós ativos e elegíveis para executar serviços. O Compose define `max_replicas_per_node: 1`.

## 5. Implantar a stack

O comando `docker stack deploy` faz interpolação com as variáveis do ambiente do terminal do manager; não conte com a leitura automática de `.env` nesse comando.

Em Linux/macOS, a partir da raiz do repositório:

```bash
set -a
. ./.env
set +a
docker stack deploy --with-registry-auth -c docker-compose.yml conecta-vida
```

No PowerShell, carregue os valores do arquivo `.env` no ambiente da sessão (ou defina cada variável com `$env:NOME="valor"`) e execute:

```powershell
docker stack deploy --with-registry-auth -c docker-compose.yml conecta-vida
```

Verifique serviços e tarefas:

```bash
docker stack services conecta-vida
docker service ls
docker service ps conecta-vida_api
```

A API fica exposta na porta 8080 e o Docker Visualizer na porta 8081 do cluster. A routing mesh do Swarm encaminha as requisições para as réplicas do serviço.

## 6. Demonstrar escalabilidade

No manager:

```bash
docker service scale conecta-vida_api=1
docker service ls
docker service scale conecta-vida_api=2
docker service ls
docker service scale conecta-vida_api=3
docker service ls
```

A configuração inicial do Compose cria duas réplicas. A escala para três exige três nós elegíveis devido a `max_replicas_per_node: 1`. O Visualizer mostra a distribuição das tarefas nos nós em:

```
http://IP_DO_MANAGER:8081
```

Para remover a stack ao final do laboratório:

```bash
docker stack rm conecta-vida
```

## Observações de segurança e operação

- As credenciais anteriormente versionadas devem ser rotacionadas no provedor (Supabase e provedor SMTP). Remover o valor do arquivo atual não apaga cópias em commits antigos; a limpeza do histórico Git deve ser planejada separadamente, após rotação e com coordenação de quem usa o repositório.
- O Docker Visualizer monta o socket do Docker do manager. Mesmo em modo somente leitura, trate a interface como ferramenta administrativa de laboratório: restrinja o acesso à rede confiável e não a exponha publicamente.
- As réplicas compartilham o banco externo. Garanta que a aplicação não dependa de estado de sessão armazenado apenas em memória local e avalie limites de conexões do PostgreSQL/Supabase antes de aumentar a escala.
- O arquivo `.env.example` contém apenas valores ilustrativos; nunca use os marcadores como credenciais reais.
- Esta configuração é para Docker Swarm com `docker stack deploy`. O comando `docker compose up` não cria um cluster Swarm nem garante a aplicação de `deploy.replicas`.
