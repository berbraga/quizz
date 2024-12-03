<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card class="pa-10 d-flex flex-column" elevation="3" style="width: 700px; max-width: 90%; min-height: 500px;">

        <div align="center" justify="center">
          <v-img src="/capelo.png" max-height="100" max-width="100" class="mr-3" alt="Capelo"></v-img>
          <h1 class="text-indigo-darken-4 mb-0" style="font-size: 36px;">Study Quiz - Módulo Professor</h1>
        </div>


        <div class="d-flex my-4 mt-15">
          <v-img src="/desempenho.png" alt="atuacao" style="height: 55px;" width="25%"></v-img>
            <v-btn width="75%"
            style="background-color: cornflowerblue; color: white; font-size: 18px; padding: 12px; height: 50px;" @click="Ranking">
            Desempenho dos Alunos
            </v-btn>
        </div>

        <div class="d-flex my-4">
          <v-img src="/registro.png" alt="ranking" style="height: 55px;" width="25%"></v-img>
            <v-btn width="75%"
            style="background-color: cornflowerblue; color: white; font-size: 18px; padding: 12px; height: 50px;" @click="cadastrarPerguntas">
            Cadastrar Pergunta
            </v-btn>
        </div>


        <div class="d-flex my-4">
          <v-img src="/botao-play.png" alt="Play" style="height: 55px;" width="25%"></v-img>
            <v-btn width="75%"
            style="background-color: cornflowerblue; color: white; font-size: 18px; padding: 12px; height: 50px;"
            @click="startQuiz">
            Iniciar Quiz
            </v-btn>
        </div>

        <div class="d-flex justify-center mt-10" width="100%" >
          <v-btn class="mx-2" style="background-color: cornflowerblue; color: white; font-size: 15px; padding: 10px; height: 40px;" @click="perfilCadastro">
            Perfil
          </v-btn>
          <v-btn style="background-color: cornflowerblue; color: white; font-size: 15px; padding: 10px; height: 40px;" @click="sair">
            Sair
          </v-btn>
        </div>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {

const user = JSON.parse(localStorage.getItem('user'));

if (!user || user.isStudent) {
  router.push('/sem-permissao'); // Redireciona para a página de sem permissão se não for professor
}
});

const quizzes = ref([]);

const user = JSON.parse(localStorage.getItem('user'));
// Cabeçalhos da tabela
const headers = [
  { text: "Nome do Quiz", value: "name", align: "start" },
  { text: "Ações", value: "actions", sortable: false },
];

const startQuiz = async () => {
  router.push("/quizAluno");
}
const cadastrarPerguntas = async () => {
  router.push(`/professor/${user.id}/quizProfessor`);
}

const perfilCadastro = async () => {
  router.push(`/perfil`);
}

const sair = async () => {
  router.push(`/login`);
}

const Ranking = async () => {
  router.push(`/${user.id}/ranking`);
}
</script>
