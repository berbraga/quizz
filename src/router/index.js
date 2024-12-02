/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes as autoRoutes } from 'vue-router/auto-routes'

// Defina suas rotas adicionais
const customRoutes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/login.vue'), // Exemplo de lazy-loading
  },
  {
    path: '/cadastro',
    name: 'cadastro',
    component: () => import('@/pages/cadastro.vue'), // Exemplo de lazy-loading
  },
  {
    path: '/forgotpassword',
    name: 'esqueceuSenha',
    component: () => import('@/pages/forgotPassword.vue'), // Exemplo de lazy-loading
  },
  {
    path: '/professor',
    name: 'professor',
    component: () => import('@/pages/professor.vue'), // Exemplo de lazy-loading
  },
  {
    path: '/professor/novo-quiz',
    name: 'novo-quiz',
    component: () => import('@/pages/novoQuiz.vue'), // Exemplo de lazy-loading
  },
  {
    path: '/quiz/:quizId/questions',
    name: 'quiz-questions',
    component: () => import('@/pages/quizQuestions.vue'), // Exemplo de lazy-loading
    props: true, // Permite passar `quizId` para o componente
  },
  {
    path: '/quiz/:quizId/add-question',
    name: 'add-question',
    component: () => import('@/pages/addQuestion.vue'), // Lazy-loading
    props: true, // Permite passar o quizId como prop
  },
  {
    path: '/quizAluno/quiz/:quizId',
    name: 'quiz-responder',
    component: () => import('@/pages/quizResponder.vue'), // Lazy-loading
    props: true,
  },


  {
    path: '/aluno',
    name: 'aluno',
    component: () => import('@/pages/aluno.vue'), // Exemplo de lazy-loading
  },
]

// Combine as rotas automáticas com as personalizadas
const routes = [...autoRoutes, ...customRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround para https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
