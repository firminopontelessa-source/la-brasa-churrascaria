# La-Brasa Churrascaria

Aplicação estática em HTML, CSS e JavaScript, preparada para GitHub Pages e incorporação por iframe no Google Sites.

## O que funciona nesta versão

- Cardápio por categoria, pesquisa, imagens, preços e disponibilidade.
- Carrinho com quantidades, remoção, total e observações.
- Finalização que registra o pedido no navegador e abre uma conversa do WhatsApp com o resumo.
- Solicitação de reserva com validação de campos, data mínima e horários; registra localmente e prepara mensagem no WhatsApp.
- Painel administrativo local para produtos, status de pedidos, status de reservas e informações da casa.
- Layout responsivo para desktop e dispositivos móveis.

## Limites da versão estática

O GitHub Pages entrega arquivos estáticos. `localStorage` e `sessionStorage` pertencem ao navegador e dispositivo atual. Portanto, pedidos, reservas, alterações administrativas e a senha local não são sincronizados entre clientes, celulares ou computadores. Um usuário pode inspecionar o JavaScript e contornar a senha local. Não use este painel como controle comercial seguro nem armazene dados pessoais sensíveis nele.

O botão de pedido/reserva abre o WhatsApp configurado. O registro local é apenas uma cópia no navegador em que o formulário foi enviado; o WhatsApp só recebe a mensagem quando o usuário efetivamente envia a conversa.

## Configuração inicial

1. Edite `config.js`.
2. Troque `restaurant.phone` pelo número de WhatsApp no formato internacional, apenas números: `55` + DDD + número.
3. Atualize `displayPhone`, `address`, `hours` e `mapsUrl`.
4. Altere `localAdminPassword` para uma senha de demonstração exclusiva enquanto estiver testando. Essa senha **não é segura** em hospedagem estática.
5. Atualize produtos e fotos pelo painel administrativo ou ajuste `seedProducts` no início de `app.js`.
6. As fotos iniciais usam imagens remotas do Unsplash. Para produção, hospede imagens próprias em `assets/` e substitua os endereços.

## Testar localmente

Abra `index.html` no navegador. Para evitar diferenças de origem e simular hospedagem, rode um servidor local na pasta do projeto:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000`.

Senha inicial do painel: `brasa123` (definida em `config.js`). Clique no ícone de engrenagem no canto inferior direito.

### Roteiro de teste

- Navegue pelas categorias e pesquise um produto.
- Adicione itens, altere quantidades e remova um item.
- Verifique o total e tente finalizar; confirme a mensagem no WhatsApp sem precisar enviá-la.
- Envie uma reserva de teste e confira a solicitação no painel.
- Entre no painel, adicione um produto, altere disponibilidade e edite preço/nome.
- Mude o status de pedido/reserva e atualize a página para conferir persistência local.
- Teste em largura móvel.

## Publicar no GitHub Pages

1. Crie um repositório GitHub, por exemplo `la-brasa-churrascaria`.
2. Envie todos os arquivos desta pasta para a raiz do repositório (incluindo `index.html`).
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e `/ (root)` e salve.
6. Aguarde o GitHub Pages publicar. A URL normalmente será `https://SEU-USUARIO.github.io/la-brasa-churrascaria/`.
7. Teste o endereço público em computador e celular.

Se usar domínio próprio, configure-o na seção Pages e siga as instruções de DNS exibidas pelo GitHub.

## Incorporar no Google Sites

1. Publique o site no GitHub Pages e copie a URL HTTPS pública.
2. No editor do Google Sites, abra **Inserir → Incorporar → URL**.
3. Cole a URL do GitHub Pages e confirme.
4. Redimensione o bloco incorporado na página; use largura total e altura suficiente (recomendado 1.400–2.000 px para a página completa).
5. Publique o Google Sites e teste o iframe em computador e celular.

O Google Sites controla o tamanho externo do iframe. A aplicação se adapta à largura disponível, mas a altura do bloco incorporado deve ser ajustada no editor do Sites. Para uma experiência mais confortável, também disponibilize um link “Abrir cardápio” que abra o GitHub Pages em uma nova aba.

## Sincronização multiusuário com Supabase (recomendado)

Para uso real, configure um backend. Supabase pode fornecer Auth + Postgres + Row Level Security (RLS). O `config.js` já contém o espaço de configuração, mas o adaptador Supabase ainda precisa ser implementado e validado antes de habilitar. Não basta colocar uma chave no frontend: crie políticas RLS para permitir leitura pública somente do cardápio ativo, gravação pública limitada de solicitações e acesso administrativo apenas a usuários autenticados com papel de administrador.

Modelo de dados sugerido:

- `products`: `id`, `name`, `category`, `description`, `price`, `image_url`, `available`, `tag`, `updated_at`.
- `orders`: `id`, `customer_name`, `customer_phone`, `items` (JSONB), `notes`, `total`, `status`, `created_at`.
- `reservations`: `id`, `customer_name`, `customer_phone`, `reservation_date`, `reservation_time`, `guests`, `notes`, `status`, `created_at`.
- `restaurant_settings`: `name`, `whatsapp`, `address`, `hours`, `maps_url`.
- `profiles`: `user_id`, `role` (`admin` ou `staff`), com escrita restrita.

Checklist backend antes de produção:

1. Criar tabelas e índices, constraints de preço/quantidade e políticas RLS.
2. Habilitar autenticação de administradores (e-mail/senha ou provedor apropriado).
3. Criar funções/RPC ou Edge Functions para validar pedidos e reservas no servidor.
4. Migrar a leitura/escrita do `localStorage` para Supabase e lidar com falhas de rede.
5. Não incluir `service_role` key, tokens privados ou senhas administrativas no frontend.
6. Testar acesso anônimo, acesso administrativo, tentativas de alteração de status e sincronização entre dois dispositivos.

## Estrutura

```text
la-brasa-churrascaria/
├── index.html
├── styles.css
├── app.js
├── config.js
├── README.md
└── assets/
```
