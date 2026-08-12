# Configurando o Firebase (site + painel admin)

Leva uns 15 minutos, tudo gratuito no plano free (Spark) pro tamanho desse
projeto — não precisa de cartão cadastrado.

## 1. Criar o projeto no Firebase

1. Acesse **console.firebase.google.com**
2. **Adicionar projeto** → nome (ex: `mv-capacetes`) → pode desativar o
   Google Analytics do projeto
3. Aguarde o projeto ser criado

## 2. Ativar login por email/senha

1. Menu lateral: **Build → Authentication**
2. Aba **Sign-in method** → **Email/senha** → ativar → salvar

## 3. Criar o banco de dados (Firestore)

1. Menu lateral: **Build → Firestore Database**
2. **Criar banco de dados** → modo **produção** → região
   `southamerica-east1` (São Paulo)

## 4. Pegar as chaves públicas (app cliente)

1. Ícone de engrenagem → **Configurações do projeto** → aba **Geral**
2. Role até "Seus apps" → ícone `</>` (Web) → apelido (ex: `mv-web`) →
   **Registrar app**
3. Copie o bloco `firebaseConfig` pro seu `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=projectId
NEXT_PUBLIC_FIREBASE_APP_ID=appId
```

## 5. Pegar a chave secreta (Admin SDK)

1. **Configurações do projeto** → aba **Contas de serviço**
2. **Gerar nova chave privada** → baixa um `.json`
3. Copie 3 campos pro `.env.local`:

```
FIREBASE_PROJECT_ID=project_id (do json)
FIREBASE_CLIENT_EMAIL=client_email (do json)
FIREBASE_PRIVATE_KEY="private_key (do json, com as aspas e os \n)"
```

⚠️ **Nunca** suba esse `.json` pro GitHub. O `.gitignore` já ignora
`.env*.local`.

## 6. Travar as regras do Firestore

Todo acesso passa pelo servidor (Admin SDK, que ignora as regras) — pode
deixar o Firestore fechado pra leitura/escrita direta do navegador. Em
**Firestore Database → Regras**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## 7. WhatsApp, Instagram, endereço etc.

Não vai em variável de ambiente — depois do primeiro login, preencha em
**/admin/configuracoes** dentro do próprio painel (formato do WhatsApp:
`55DDNÚMERO`, sem espaços/símbolos). O botão "Tenho interesse" do site usa
esse número.

## 8. Popular com produtos de exemplo (opcional)

```bash
npm run seed
```

## 9. Rodar localmente

```bash
npm install
npm run dev
```

- Site: http://localhost:3000
- Painel: http://localhost:3000/admin/login — a primeira vez que você
  acessar, a tela vai pedir pra criar a conta principal (nome, email,
  senha) — não precisa criar usuário manualmente no Firebase.

## Sobre as fotos dos produtos

Comprimidas no navegador e guardadas como base64 direto no Firestore —
não usa Firebase Storage, então não precisa do plano Blaze.

## Se aparecer erro "The query requires an index"

Normal na primeira vez que você abrir **Estoque → Histórico** filtrado por
um produto — o Firestore pede um índice composto pra essa consulta. O
próprio erro no terminal traz um link que cria o índice automaticamente com
um clique; depois disso some para sempre.
