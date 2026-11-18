# PROJETO 05 – DESENVOLVIMENTO WEB III

Aplicação Web desenvolvida em **Node.js + NPM (sem frameworks)** para a disciplina de **Desenvolvimento Web III** (FATEC Diadema — DSM 3º Semestre, Prof. Vinicius Heltai Pacheco).

---

## 🎯 Funcionalidades

- Recebe as notas `p1` e `p2` via query string na URL (`/media?p1=7.5&p2=5.0`).
- Calcula a média aritmética: `MEDIA = (P1 + P2) / 2`.
- Direciona automaticamente para:
  - `public/aprovado.html` quando `MEDIA >= 6.0`
  - `public/reprovado.html` quando `MEDIA < 6.0`
- Exibe na página os valores de **P1**, **P2**, **Média Final** e **Situação**.
- Valida parâmetros ausentes ou fora do intervalo `0.0` a `10.0` (`400 Bad Request`) e rotas inexistentes (`404 Not Found`).

---

## 📁 Estrutura do Projeto

```text
dw3-projeto05-calculo-media/
├── app.js
├── package.json
├── package-lock.json
├── README.md
└── public/
    ├── index.html
    ├── aprovado.html
    ├── reprovado.html
    ├── erro400.html
    ├── erro404.html
    └── style.css
```

---

## 🚀 Como Executar

```bash
npm start
# Acesse http://localhost:3000 ou http://localhost:3000/media?p1=7.5&p2=5.0
```
