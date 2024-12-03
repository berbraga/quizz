<template>
  <v-container class="d-flex align-center justify-center ma-0 pa-0" style="height: 100vh;">
    <v-card class="pa-10 d-flex flex-column" elevation="3" style="width: 700px; max-width: 90%; min-height: 500px;">
        <v-row align="center" justify="center">
          <v-img src="/capelo.png" max-height="100" max-width="100" class="mr-3" alt="Capelo"></v-img>
          <h1 class="text-indigo-darken-4 mb-0" style="font-size: 36px;">Study Quiz - Módulo Aluno</h1>
        </v-row>


        <div class="d-flex my-4">
          <v-img src="/atuacao.png" alt="atuacao" style="height: 55px;" width="25%"></v-img>
            <v-btn width="75%"
              @click="MeuDesempenho"
              style="background-color: cornflowerblue; color: white; font-size: 18px; padding: 12px; height: 50px;"
              >
              Meu Desempenho
            </v-btn>
        </div>

        <div class="d-flex my-4">
          <v-img src="/ranking.png" alt="ranking" style="height: 55px;" width="25%"></v-img>
            <v-btn width="75%"
            style="background-color: cornflowerblue; color: white; font-size: 18px; padding: 12px; height: 50px;">
            Ranking da Turma
            </v-btn>
        </div>


        <div class="d-flex my-4">
          <v-img src="/play.png" alt="Play" style="height: 55px;" width="25%"></v-img>
            <v-btn width="75%"
            style="background-color: cornflowerblue; color: white; font-size: 18px; padding: 12px; height: 50px;"
            @click="startQuiz">
            Iniciar Quiz
            </v-btn>
        </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const quizzes = ref([]);
const user = JSON.parse(localStorage.getItem('user'));
// Cabeçalhos da tabela
const headers = [
  { text: "Nome do Quiz", value: "name", align: "start" },
  { text: "Ações", value: "actions", sortable: false },
];

const MeuDesempenho = () => {
  router.push(`/aluno/${user.id}/desempenho`);
}
const startQuiz = async () => {
  router.push("/quizAluno");
}

</script>
